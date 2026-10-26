import fs from 'node:fs';
import assert from 'node:assert/strict';

// Independently enumerate small examples; this checks prose, not the C++ implementation.
const sum = a => a.reduce((x, y) => x + y, 0);
function solve(id, x) {
  const a = x.nums ?? x.arr ?? x.cardPoints ?? x.s ?? x.blocks;
  const n = a.length;
  if (id === '2090') return Array.from({ length: n }, (_, i) => i < x.k || i + x.k >= n ? -1 : Math.trunc(sum(a.slice(i-x.k,i+x.k+1))/(2*x.k+1)));
  if (id === '1423') return Math.max(...Array.from({length:x.k+1},(_,i)=>sum(a.slice(0,i))+sum(a.slice(n-(x.k-i)))));
  const matches = [];
  for (let l = 0; l < n; l++) for (let r = l+1; r <= n; r++) {
    const b = Array.from(a.slice(l,r));
    const counts = new Map(); for (const v of b) counts.set(v,(counts.get(v)??0)+1);
    const len = b.length, total = sum(b), ones = b.filter(v=>v===1||v==='1').length;
    let valid = false, value = len;
    switch (id) {
      case '3': valid=counts.size===len; break;
      case '3090': valid=Math.max(...counts.values())<=2; break;
      case '643': valid=len===x.k; value=total/x.k; break;
      case '1343': valid=len===x.k&&total>=x.k*x.threshold; break;
      case '2379': valid=len===x.k; value=counts.get('W')??0; break;
      case '2461': valid=len===x.k&&counts.size===x.k; value=total; break;
      case '2841': valid=len===x.k&&counts.size>=x.m; value=total; break;
      case '1493': valid=(counts.get(0)??0)<=1; value=len-1; break;
      case '3795': valid=sum([...counts.keys()])>=x.k; break;
      case '2904': valid=ones===x.k; value=b.join(''); break;
      case '2962': valid=(counts.get(Math.max(...a))??0)>=x.k; break;
      case '1358': valid=['a','b','c'].every(c=>counts.has(c)); break;
      case '930': valid=total===x.goal; break;
      case '1248': valid=b.filter(v=>v%2===1).length===x.k; break;
      default: throw Error(`Unknown problem ${id}`);
    }
    if(valid) matches.push(value);
  }
  if (['1343','2962','1358','930','1248'].includes(id)) return matches.length;
  if(id==='2904') return matches.sort((a,b)=>a.length-b.length||(a<b?-1:a>b?1:0))[0]??'';
  if(id==='3795') return matches.length?Math.min(...matches):-1;
  if(id==='2379') return Math.min(...matches);
  return matches.length?Math.max(...matches):0;
}
let count=0;
for(const file of fs.readdirSync('leetcode/sliding-window').filter(f=>f.endsWith('.md'))) {
  const id=file.split('-')[0];
  const text=fs.readFileSync(`leetcode/sliding-window/${file}`,'utf8');
  for(const m of text.matchAll(/\*\*输入\*\*[:：]([^\n]+)\r?\n>\s*\r?\n>\s*\*\*输出\*\*[:：]`([^`]+|)`/g)) {
    const input={};
    for(const v of m[1].replaceAll('`','').matchAll(/(\w+)\s*=\s*(\[[^\]]*\]|"[^"]*"|-?\d+)/g)) input[v[1]]=JSON.parse(v[2]);
    const actual=solve(id,input), expected=JSON.parse(m[2]);
    if(typeof actual==='number') assert.ok(Math.abs(actual-expected)<1e-5,`${file}: ${m[1]}: got ${actual}, expected ${expected}`);
    else assert.deepEqual(actual,expected,`${file}: ${m[1]}`);
    count++;
  }
}
assert.ok(count>=40,`Only parsed ${count} examples; check Markdown format`);
console.log(`PASS: ${count} documented examples checked with independent enumeration.`);
