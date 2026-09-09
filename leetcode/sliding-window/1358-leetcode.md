# 1358. 包含所有三种字符的子字符串数目

<!-- 标签:不定长滑动窗口、哈希表、字符串 -->

**题目链接**：

[LeetCode 1358. 包含所有三种字符的子字符串数目](https://leetcode-cn.com/problems/number-of-substrings-containing-all-three-characters/)

---

## 题目描述

给你一个字符串 `s` ，它只包含三种字符 `a`, `b` 和 `c`。

请你返回 `a`，`b` 和 `c` 都 **至少** 出现过一次的子字符串数目。

> **示例 1**
>
> **输入**:`s = "abcabc"`
>
> **输出**:`10`
>
> **解释**:包含 `a`，`b` 和 `c` 各至少一次的子字符串为 `"abc"`, `"abca"`, `"abcab"`, `"abcabc"`, `"bca"`, `"bcab"`, `"bcabc"`, `"cab"`, `"cabc"` 和 `"abc"` (相同字符串算多次)。
>
> **示例 2**
>
> **输入**:`s = "aaacb"`
>
> **输出**:`3`
>
> **解释**:包含 `a`，`b` 和 `c` 各至少一次的子字符串为 `"aaacb"`, `"aacb"` 和 `"acb"`。
>
> **示例 3**
>
> **输入**:`s = "abc"`
>
> **输出**:`1`

**提示**：

- `3 <= s.length <= 5 x 10^4`
- `s` 只包含字符 `'a'`，`'b'` 和 `'c'`。

---

## 解题思路

找子串 → 连续 → 滑动窗口。

再注意条件：子字符串必须包含 `a`，`b` 和 `c` 各至少一次，是找“大于”条件的子串，并且还需要计数，在这种类型下，收缩左端点到“恰好“不满足条件，符合条件的子串数量为 `left`，因为窗口左侧以外的内容也可与窗口组合成符合条件的子串。

### 算法步骤

1. for循环：右端点遍历字符串 `s`，每次入窗口一个字符（哈希加计数）。
2. while循环：当窗口满足条件时，收缩左端点（哈希减计数）直到恰好不满足条件。
3. 更新答案：按照分析，每次收缩完成之后，符合条件的子串数量为 `left`，所以 `ans += left`。

---

## 代码

```cpp
class Solution {
public:
    int numberOfSubstrings(string s) {
        int n = s.length(), left = 0, ans = 0;
        unordered_map<char, int> hash;

        for(int right = 0; right < n; right++){
            //入
            char c_r = s[right];
            hash[c_r]++;

            //满足条件就缩小
            while(hash['a'] && hash['b'] && hash['c']){
                //缩小
                char c_l = s[left];
                hash[c_l]--;
                left++;
            }
            ans += left;
        }

        return ans;
    }
};
```

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

---

## 易错点

- 注意审题，本题不仅要记录”符合条件的窗口个数“，窗口之外也有个数，需要使用到 `left` 来更新答案。
