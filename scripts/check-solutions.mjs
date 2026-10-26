import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// Compile the actual Markdown snippets, not a second implementation.
const cases = {
  '3': 'assert(s.lengthOfLongestSubstring("abcabcbb")==3); assert(s.lengthOfLongestSubstring("")==0);',
  '3090': 'assert(s.maximumLengthSubstring("bcbbbcba")==4); assert(s.maximumLengthSubstring("aaaa")==2);',
  '643': 'vector<int>a{1,12,-5,-6,50,3},b{-5}; assert(abs(s.findMaxAverage(a,4)-12.75)<1e-8); assert(s.findMaxAverage(b,1)==-5);',
  '1343': 'vector<int>a{2,2,2,2,5,5,5,8},b{1,1,1,1,1}; assert(s.numOfSubarrays(a,3,4)==3); assert(s.numOfSubarrays(b,1,0)==5);',
  '2090': 'vector<int>a{7,4,3,9,1,8,5,2,6},b{100000}; assert((s.getAverages(a,3)==vector<int>{-1,-1,-1,5,4,4,-1,-1,-1})); assert(s.getAverages(b,0)==b); assert((s.getAverages(b,100000)==vector<int>{-1})); vector<int>c(99999,100000); assert(s.getAverages(c,49999)[49999]==100000);',
  '2379': 'assert(s.minimumRecolors("WBBWWBBWBW",7)==3); assert(s.minimumRecolors("WBBWWBBWBW",8)==3); assert(s.minimumRecolors("WBWBBBWBBW",9)==3); assert(s.minimumRecolors("B",1)==0);',
  '2461': 'vector<int>a{1,5,4,2,9,9,9},b{4,4,4}; assert(s.maximumSubarraySum(a,3)==15); assert(s.maximumSubarraySum(b,3)==0);',
  '2841': 'vector<int>a{2,6,7,3,1,7},b{1,2,1,2}; assert(s.maxSum(a,3,4)==18); assert(s.maxSum(b,3,3)==0); vector<int>c{1000000000,999999999,999999998}; assert(s.maxSum(c,3,3)==2999999997LL);',
  '1423': 'vector<int>a{1,2,3,4,5,6,1},b{9,7,7,9,7,7,9}; assert(s.maxScore(a,3)==12); assert(s.maxScore(b,7)==55);',
  '1493': 'vector<int>a{1,1,0,1},b{1,1,1},c{0}; assert(s.longestSubarray(a)==3); assert(s.longestSubarray(b)==2); assert(s.longestSubarray(c)==0);',
  '3795': 'vector<int>a{2,2,3,1},b{2,2}; assert(s.minLength(a,4)==2); assert(s.minLength(b,5)==-1);',
  '2904': 'assert(s.shortestBeautifulSubstring("100011001",3)=="11001"); assert(s.shortestBeautifulSubstring("000",1)==""); assert(s.shortestBeautifulSubstring("00101",1)=="1");',
  '2962': 'vector<int>a{1,3,2,3,3},b{1}; assert(s.countSubarrays(a,2)==6); assert(s.countSubarrays(b,2)==0);',
  '1358': 'assert(s.numberOfSubstrings("abcabc")==10); assert(s.numberOfSubstrings("aaa")==0);',
  '930': 'vector<int>a{1,0,1,0,1},b(5,0); assert(s.numSubarraysWithSum(a,2)==4); assert(s.numSubarraysWithSum(b,0)==15);',
  '1248': 'vector<int>a{1,1,2,1,1},b{2,4,6}; assert(s.numberOfSubarrays(a,3)==2); assert(s.numberOfSubarrays(b,1)==0);'
};
const headers = '#include <algorithm>\n#include <cassert>\n#include <climits>\n#include <cmath>\n#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <vector>\nusing namespace std;\n';
let source = headers;
const calls = [];
for (const [id, body] of Object.entries(cases)) {
  const text = fs.readFileSync(`leetcode/sliding-window/${id}-leetcode.md`, 'utf8');
  const blocks = [...text.matchAll(/```cpp\s*\n([\s\S]*?)```/g)];
  if (!blocks.length) throw Error(`No C++ code for ${id}`);
  for (const [i, block] of blocks.entries()) {
    const name = `p${id}_${i}`;
    source += `namespace ${name} {\n${block[1]}\nvoid test(){Solution s; ${body}}\n}\n`;
    calls.push(`${name}::test();`);
  }
}
// Exhaustive small-input comparison against a quadratic enumeration oracle.
source += `void differential(){
  for(int n=1;n<=8;n++) for(int mask=0;mask<(1<<n);mask++) {
    vector<int>a(n),b(n); for(int i=0;i<n;i++){a[i]=(mask>>i)&1; b[i]=a[i]?1:2;}
    for(int k=0;k<=n;k++) {
      int expected=0; for(int l=0;l<n;l++){int sum=0;for(int r=l;r<n;r++){sum+=a[r];expected+=(sum==k);}}
      assert(p930_0::Solution().numSubarraysWithSum(a,k)==expected);
      if(k>0) assert(p1248_0::Solution().numberOfSubarrays(b,k)==expected);
    }
  }
}
int main(){${calls.join('\n')} differential(); cout<<"PASS: all solution variants, boundary cases and exhaustive counting checks\\n";}
`;
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'algo-grimoire-'));
try {
  const input = path.join(temp, 'solutions.cpp');
  fs.writeFileSync(input, source);
  const compiler = process.env.CXX || 'g++';
  const output = path.join(temp, process.platform === 'win32' ? 'solutions.exe' : 'solutions');
  const build = spawnSync(compiler, ['-std=c++20', '-Wall', '-Wextra', '-O1', input, '-o', output], { encoding: 'utf8' });
  if (build.error) throw Error(`C++20 compiler unavailable: ${compiler}. Set CXX to a compiler path. No C++ tests ran.`);
  if (build.status !== 0) throw Error(build.stderr);
  const run = spawnSync(output, [], { encoding: 'utf8', timeout: 30000 });
  if (run.error || run.status !== 0) throw Error(run.error?.message || run.stderr || `Tests exited ${run.status}`);
  console.log(run.stdout.trim());
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
