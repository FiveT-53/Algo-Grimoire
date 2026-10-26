# 1343. 定长子数组的平均值大于等于阈值的最多数量

**题目链接：**

[LeetCode 1343. 定长子数组的平均值大于等于阈值的最多数量](https://leetcode-cn.com/problems/number-of-subarrays-of-size-k-and-average-greater-than-or-equal-to-threshold/)

---

## 题目描述

给你一个整数数组 `arr` 和两个整数 `k` 和 `threshold`。

请你返回长度为 `k` 且平均值大于等于 `threshold` 的子数组数目。

> **示例 1**
>
> **输入**:`arr = [2,2,2,2,5,5,5,8]`, `k = 3`, `threshold = 4`
>
> **输出**:`3`
>
> **解释**:子数组 `[2,5,5]`、`[5,5,5]`、`[5,5,8]` 的平均值分别为 `4`、`5`、`5.333...`,均大于等于 `4`,所以一共有 3 个这样的子数组。
>
> **示例 2**
>
> **输入**:`arr = [1,1,1,1,1]`, `k = 1`, `threshold = 0`
>
> **输出**:`5`
>
> **解释**:共有 5 个长度为 1 的子数组,平均值都等于 1.0,均大于等于 0,答案就是 5。

**提示**：

- `1 <= arr.length <= 10^5`
- `1 <= arr[i] <= 10^4`
- `1 <= k <= arr.length`
- `0 <= threshold <= 10^4`

---

## 解题思路

翻译题干：子数组->连续，考虑窗口；长度为 k -> 窗口大小为定长 k；平均值大于等于阈值 -> 窗口内元素和大于等于阈值的 k 倍。

识别为定长滑动窗口题目，按照公式化循环内三步完成，初始化条件按照题目来，要计数就加计数器，要平均值就跟踪窗口内元素和。

### 算法步骤

1. 入：下标为 i 的元素进入窗口，窗口元素和 s 增加 arr[i]。如果 i < k−1 则重复第一步。
2. 更新：更新答案。本题由于窗口长度固定为 k，所以满足平均值 >= threshold 则答案加一。
3. 出：下标为 i−k+1 的元素离开窗口，窗口元素和 s 减少 arr[i−k+1]。

---

## 代码

```cpp
class Solution {
public:
    int numOfSubarrays(vector<int>& arr, int k, int threshold) {
        int n = arr.size();
        int sum = 0, count = 0;

        for(int i = 0; i < n; i++){
            //入
            sum += arr[i];
            int left = i - k + 1;
            if(left < 0){
                continue;
            }

            //答案
            if(sum / k >= threshold){
                count++;
            }

            //出
            sum -= arr[left];
        }

        return count;
    }
};
```

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

---

## 易错点

- 优化思路：本题可以将除法优化为乘法，即 sum >= threshold * k。

## 边界自测

- arr=[1,1,1,1,1], k=1, threshold=0 → 5。
- 验证入口与运行状态见[验证说明](../../docs/validation.md)。
