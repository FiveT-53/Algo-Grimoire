# 3090. 每个字符最多出现两次的最长子字符串 II

<!-- 标签:不定长滑动窗口、哈希表、字符串 -->

**题目链接**：

[LeetCode 3090. 每个字符最多出现两次的最长子字符串 II](https://leetcode-cn.com/problems/maximum-length-substring-with-two-occurrences/)

---

## 题目描述

给你一个字符串 `s` ，请找出满足每个字符最多出现两次的最长子字符串，并返回该的 **最大** 长度。

> **示例 1**
>
> **输入**:`s = "bcbbbcba"`
>
> **输出**:`4`
>
> **解释**:以下子字符串长度为 4，并且每个字符最多出现两次:`"bcba"`。
>
> **示例 2**
>
> **输入**:`s = "aaaa"`
>
> **输出**:`2`
>
> **解释**:以下子字符串长度为 2，并且每个字符最多出现两次:`"aa"`。

**提示**：

- `2 <= s.length <= 100`
- `s` 仅由小写英文字母组成。

---

## 解题思路

全部形同 [3. 最长无重复字符的子串](./3-leetcode.md)，只需要把判断时的 > 1 改为 > 2 即可。

---

## 代码

```cpp
class Solution {
public:
    int maximumLengthSubstring(string s) {
        int n = s.size(), left = 0, ans = 0;
        unordered_map<char, int> hash;

        for(int right = 0; right < n; right++){
            char c = s[right];
            hash[c]++;

            while(hash[c] > 2){
                hash[s[left]]--;
                left++;
            }

            ans = max(ans, right - left + 1);
        }

        return ans;
    }
};
```

- **时间复杂度**: O(n)
- **空间复杂度**: O(∣Σ∣)

## 边界自测

- aaaa → 2；每个字符最多保留两次。
- 验证入口与运行状态见[验证说明](../../docs/validation.md)。
