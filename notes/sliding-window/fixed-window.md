# 定长滑动窗口

***

## 一、概念与特征

### 1.1 定义

在长度为 n 的数组或字符串上,维护一个**长度固定为 k** 的区间 `[left, right]`,使得 `right - left + 1 == k`。每轮循环让右端点 `i` 向右推进一位,左端点 `i-k+1` 跟随滑动,直到 `i` 到达序列末尾。窗口内只需要维护与题目相关的"统计量",由于进出窗口严格配对,每个元素恰好进出窗口一次,整体 O(n) 解决。

### 1.2 适用场景识别

满足以下任意一条,可优先考虑定长滑动窗口:

- 题面明确给出窗口长度 k(例如"长度为 k 的子数组/子串")。
- 需要枚举所有长度为 k 的连续子区间,并从中挑最值/判断条件/统计个数。
- 需要对每个长度为 k 的窗口求和、求平均、求某种频率统计,且能在 O(1) 时间内用"加一项、减一项"维护。

### 1.3 与其他算法的关系

- **变长滑动窗口**:窗口长度不固定,需要 `while` 条件收缩。定长是其特例,只需"判长度==k"代替"while 收缩"。
- **前缀和 + 枚举**:对长度为 k 的窗口求和,前缀和能做到 O(1) 查询区间和;但维护频次、集合、最值等其他状态时,滑动窗口更灵活。
- **双指针**:定长滑动窗口是双指针的特例,两指针距离恒为 `k-1`。
- **差分 / 环形处理**:部分定长题(如 1888、2134)需要把数组复制一份接到尾部再用滑动窗口,这与"循环移位 / 环形"的处理思路一致。

***

## 二、核心套路总结

### 2.1 三步走

窗口右端点在 i 时，由于窗口长度为 k，所以窗口左端点为 i−k+1。

1. 入：下标为 i 的元素（右端点）进入窗口，更新**相关统计量**。如果窗口左端点 i−k+1<0，说明尚未形成第一个窗口，重复第一步。
2. 更新答案：如果窗口左端点 i−k+1 ≥ 0 ，说明定长 k 窗口形成，用相关统计量更新答案。
3. 出：下标为 i−k+1 的元素（左端点）出窗口，更新**相关统计量**。

### 2.2 常见维护变量

- 端点：窗口左端点 i−k+1，窗口右端点 i。
- 相关统计量：窗口内元素符合题目条件的统计值。
- 答案：根据题目要求得到的答案，通常由相关统计量得到。

> 💡 **为什么维护右端点为 i 而不是左端点为 i ？**
>
> - 维护左端点为 i 与维护右端点为 i 在开销上等价；
> - 若维护左端点为 i ，需要在循环外额外构建初始窗口，而若维护右端点为 i ，则无需额外构建初始窗口，不简洁。

### 2.3 初始化时机

按"维护右端点为 i"的写法,所有变量在 `for (int i = 0; i < n; i++)` 之外统一初始化,进入循环后只用"加一项、减一项"维护。常见两类:

- **累加型(初值 0)**:用于维护窗口统计量,例如窗口和 `sum`、频次数组 `cnt[]`、满足条件的次数 `cnt`、不同元素个数 `distinct` 等。直接初始化为 0,进入循环后 `+=` 或 `-=`。
- **答案型(给特定初值)**:用于记录最终结果,需要在循环外根据题意给初值。
  - 求**最大值**:`int ans = INT_MIN;` 或 `0`(若答案非负且不存在时返回 0,如 2461)。
  - 求**最小值**:`int ans = INT_MAX;`。
  - 求**个数 / 计数**:`int ans = 0;`。
  - 判断**存在性**:`bool ans = false;`,进入循环命中即 `return true`。

> ⚠️ **注意**:不要把"答案型"和"累加型"混在一起初始化为 0,否则会把"原本可能为负数的最值"误判为 0(如最大子数组和为负数时,初值应为 `INT_MIN`)。

***

## 三、典型例题

### 例题:定长子串中元音的最大数目（LeetCode 1456）

**题目链接**: [LeetCode 1456](https://leetcode-cn.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/)

**题目描述**：
给你一个字符串 s 和一个整数 k ，请你返回 s 中长度为 k 的子字符串中可能包含的最大元音字母数。元音字母为 'a'、'e'、'i'、'o' 和 'u' 。

> **示例1**
>
> 输入：s = "abciiidef", k = 3
>
> 输出：3
>
> 解释：子字符串 "iii" 包含 3 个元音字母。
> **示例2**
>
> 输入：s = "aeiou", k = 2
>
> 输出：2
>
> 解释：子字符串 "aeiou" 包含 2 个元音字母。

**提示**：

- 1 <= s.length <= 10^5
- s 由小写英文字母组成
- 1 <= k <= s.length

**思路**:

看到”长度恰好为k“，就可以想到用定长滑动窗口。滑动条件不用做特殊判断，直接单次遍历维护窗口长度为 k 即可。持续维护的前提下，计算子串元音个数的时间复杂度为 O(1)。所以总的时间复杂度为 O(n)。只需要考虑移除（离开窗口）的字母是不是元音，以及添加（进入窗口）的字母是不是元音即可，因为中间的字母都在这两个子串中。

```cpp
class Solution {
public:
    int maxVowels(string s, int k) {
        int n = s.size();
        const string vowels = "aeiou";
        int count = 0, result = 0;
        for(int i = 0; i < n; i++){
            //第一步：入
            if(vowels.find(s[i]) != string::npos){
                count++;
            }
            int left = i - k + 1;
            if(left < 0){
                continue;
            }

            //第二步：更新答案
            result = max(result, count);

            //第三步：出
            if(vowels.find(s[left]) != string::npos){
                count--;
            }
        }
        return result;
    }
};
```

- **时间复杂度**: O(n)，其中 n 是字符串 s 的长度。
- **空间复杂度**: O(1)

***

## 四、易错点与边界

1. 注意窗口左端点 i−k+1 可能小于 0，需要在循环中判断。
2. 入、更新答案、出的顺序不能改变，建立初始窗口的 continue 首次不执行时，窗口长度恰好为 k ，此时首次更新答案。

***

## 五、复杂度分析

- **时间复杂度**:O(n),每个元素恰好进窗口一次、出窗口一次
- **空间复杂度**:O(1),仅维护常数个变量(求和、频次等)

***

## 六、练习题清单

### 6.1 基础

| 难度 | 题目 | 题号 | 题解 |
| -- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- |
| 中等 | [1456. 定长子串中元音的最大数目](https://leetcode-cn.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/)                                 | 1456 | [本文例题](#三典型例题) |
| 简单 | [643. 子数组最大平均数 I](https://leetcode-cn.com/problems/maximum-average-subarray-i/)                                                                 | 643  | [题解](../../leetcode/sliding-window/643-leetcode.md) |
| 中等 | [1343. 大小为 K 且平均值大于等于阈值的子数组数目](https://leetcode-cn.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/) | 1343 | [题解](../../leetcode/sliding-window/1343-leetcode.md) |
| 中等 | [2090. 半径为 k 的子数组平均值](https://leetcode-cn.com/problems/k-radius-subarray-averages/)                                                             | 2090 | [题解](../../leetcode/sliding-window/2090-leetcode.md) |
| 简单 | [2379. 得到 K 个黑块的最少涂色次数](https://leetcode-cn.com/problems/minimum-recolors-to-get-k-consecutive-black-blocks/)                                   | 2379 | [题解](../../leetcode/sliding-window/2379-leetcode.md) |
| 中等 | [2841. 几乎唯一子数组的最大和](https://leetcode-cn.com/problems/maximum-sum-of-almost-unique-subarray/)                                                    | 2841 | -    |
| 中等 | [2461. 长度为 K 子数组中的最大和](https://leetcode-cn.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/)                                       | 2461 | -    |
| 中等 | [1423. 可获得的最大点数](https://leetcode-cn.com/problems/maximum-points-you-can-obtain-from-cards/)                                                    | 1423 | -    |

### 6.2 进阶（选做）

| 难度 | 题目                                                                                                                          | 题号   | 题解 |
| -- | --------------------------------------------------------------------------------------------------------------------------- | ---- | -- |
| 中等 | [1052. 爱生气的书店老板](https://leetcode-cn.com/problems/grumpy-bookstore-owner/)                                                  | 1052 | -  |
| 中等 | [1653. 使字符串平衡的最少删除次数](https://leetcode-cn.com/problems/minimum-deletions-to-make-string-balanced/)                          | 1653 | -  |
| 中等 | [3439. 重新安排会议得到最多空余时间 I](https://leetcode-cn.com/problems/reschedule-meetings-for-maximum-free-time-i/)                     | 3439 | -  |
| 中等 | [3694. 删除子字符串后不同的终点](https://leetcode-cn.com/problems/distinct-points-reachable-after-substring-removal/)                   | 3694 | -  |
| 中等 | [2134. 最少交换次数来组合所有的 1 II](https://leetcode-cn.com/problems/minimum-swaps-to-group-all-1s-together-ii/)                      | 2134 | -  |
| 简单 | [1652. 拆炸弹](https://leetcode-cn.com/problems/defuse-the-bomb/)                                                              | 1652 | -  |
| 中等 | [1297. 子串的最大出现次数](https://leetcode-cn.com/problems/maximum-number-of-occurrences-of-a-substring/)                           | 1297 | -  |
| 中等 | [3652. 按策略买卖股票的最佳时机](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-using-strategy/)                      | 3652 | -  |
| 中等 | [567. 字符串的排列](https://leetcode-cn.com/problems/permutation-in-string/)                                                      | 567  | -  |
| 中等 | [438. 找到字符串中所有字母异位词](https://leetcode-cn.com/problems/find-all-anagrams-in-a-string/)                                       | 438  | -  |
| 困难 | [30. 串联所有单词的子串](https://leetcode-cn.com/problems/substring-with-concatenation-of-all-words/)                                | 30   | -  |
| 中等 | [1888. 使二进制字符串字符交替的最少反转次数](https://leetcode-cn.com/problems/minimum-number-of-flips-to-make-the-binary-string-alternating/) | 1888 | -  |
| 困难 | [2156. 查找给定哈希值的子串](https://leetcode-cn.com/problems/find-substring-with-given-hash-value/)                                  | 2156 | -  |
| 困难 | [2953. 统计完全子字符串](https://leetcode-cn.com/problems/count-complete-substrings/)                                               | 2953 | -  |

***

## 七、与其他算法对比

| 算法       | 窗口长度        | 典型操作                | 时间                | 适用场景                               |
| -------- | ----------- | ------------------- | ----------------- | ---------------------------------- |
| 定长滑动窗口   | 固定 k        | 入 / 判长度 / 出,严格对称    | O(n)              | 题面给 k,或可等价转为"长度 n-k"、"循环拼接 + 长度 n" |
| 变长滑动窗口   | 不固定         | `while` 条件收缩        | O(n)              | 求最长/最短满足某条件的子数组,如"最长无重复字符"         |
| 前缀和 + 枚举 | 固定 k(也可推广)  | 枚举起点,用前缀和 O(1) 算区间和 | O(n)              | 仅维护区间和,无其他状态                       |
| 双指针(无窗口) | -           | 两端单调推进,常带排序         | O(n) 或 O(n log n) | 两数之和、盛水、反转等                        |
| 差分       | -           | 区间加减 O(1)           | O(n + q)          | 多次区间修改、单点查询                        |
| 单调队列     | 固定 k(求窗口最值) | 维护单调递减/递增队列         | O(n)              | 长度为 k 的窗口最大/最小值(如 239 题)           |
| 滚动哈希     | 固定 k        | 进/出更新哈希值            | O(n)              | 子串哈希匹配(如 2156、1044)                |
