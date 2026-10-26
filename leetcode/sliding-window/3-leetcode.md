# 3. 无重复字符的最长子串

<!-- 标签:不定长滑动窗口、哈希表、字符串 -->

**题目链接**：

[LeetCode 3. 无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

---

## 题目描述

给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长 子串** 的长度。

> **示例 1**
>
> **输入**:`s = "abcabcbb"`
>
> **输出**:`3`
>
> **解释**:因为无重复字符的最长子串是 `"abc"`，所以其长度为 3。注意 `"bca"` 和 `"cab"` 也是正确答案。
>
> **示例 2**
>
> **输入**:`s = "bbbbb"`
>
> **输出**:`1`
>
> **解释**:因为无重复字符的最长子串是 `"b"`，所以其长度为 1。
>
> **示例 3**
>
> **输入**:`s = "pwwkew"`
>
> **输出**:`3`
>
> **解释**:因为无重复字符的最长子串是 `"wke"`，所以其长度为 3。请注意，你的答案必须是 子串 的长度，`"pwke"` 是一个子序列，不是子串。

**提示**：

- `0 <= s.length <= 10^5`
- `s` 由英文字母、数字、符号和空格组成

---

## 解题思路

字串-滑动窗口；无重复字符-哈希表；最长字串-非固定窗口大小。

在解题时先想到了默认的操作，先for循环套while循环。但在实现过程中，原本打算先处理右边入的元素，但考虑了一下题目要求不重复，那么倘若在入之前就已经把重复解决，那么就可以立刻更新答案了。实际上自己的版本最后也是这么做的，但提交之后发现时间和空间消耗都比较大，当时猜测与 contains 有关，但没有控制变量的基准测试，不能据此归因。两个实现还存在查询次数、erase 操作等差异，平台耗时也可能波动。

### 关键观察

最后看了灵神的题解才意识到有两点可以修改或优化：

1. **右侧先无脑入，左侧再处理题目要求**：在本题中，题目要求元素不重复，转化为条件就是哈希表的元素出现次数不能大于1，那么在右侧入了之后不断收缩左侧知道满足条件即可。
2. 操作哈希表的方式：在本题中，哈希表仅用于判断是否有重复元素（次数大于1），而不需要读取哈希表的size（即元素数量），所以在收缩左侧窗口时，并不需要在元素对应计数减到0的时候删除掉元素。

### 算法步骤

1. for循环遍历right，紧接着右入元素。
2. while循环处理left，直到满足题目要求。
3. 本题中，while循环过程中都是不满足题目要求的，在while后更新答案。

---

## 代码

**灵神版本**：

```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int n = s.length(), ans = 0, left = 0;
        unordered_map<char, int> cnt; // 维护从下标 left 到下标 right 的字符
        for (int right = 0; right < n; right++) {
            char c = s[right];
            cnt[c]++;
            while (cnt[c] > 1) { // 窗口内有重复字母
                cnt[s[left]]--; // 移除窗口左端点字母
                left++; // 缩小窗口
            }
            ans = max(ans, right - left + 1); // 更新窗口长度最大值
        }
        return ans;
    }
};
```

**自己的版本**：

```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int n = s.size();
        unordered_map<char, int> hash;
        int ans = 0;
        int left = 0;

        for(int right = 0; right < n; right++){
            //左排至不包含要进的元素
            while(hash.contains(s[right])){
                if(--hash[s[left]] == 0){
                    hash.erase(s[left]);
                }
                left++;
            }

            //右入,更新答案
            hash[s[right]]++;
            ans = max(ans, right - left + 1);
        }

        return ans;
    }
};
```

- **时间复杂度**: O(n)。
- **空间复杂度**: O(∣Σ∣)，其中 ∣Σ∣ 为字符集合的大小，本题中字符均为 ASCII 字符，所以 ∣Σ∣≤128。

---

## 易错点

- 暂时未注意到，但需要多考虑哈希表的作用和操作的对应关系。

## 边界自测

- 空字符串 → 0；输入没有字符时循环不进入。
- 验证入口与运行状态见[验证说明](../../docs/validation.md)。
