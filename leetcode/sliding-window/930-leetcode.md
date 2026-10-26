# 930. 和相同的二元子数组

<!-- 标签:不定长滑动窗口、前缀和、数组 -->

**题目链接**：

[LeetCode 930. 和相同的二元子数组](https://leetcode-cn.com/problems/binary-subarrays-with-sum/)

---

## 题目描述

给你一个二元数组 `nums` ，和一个整数 `goal` ，请你统计并返回有多少个和为 `goal` 的 **非空** 子数组。

**子数组** 是数组的一段连续部分。

> **示例 1**
>
> **输入**:`nums = [1,0,1,0,1]`, `goal = 2`
>
> **输出**:`4`
>
> **解释**:有 4 个满足题目要求的子数组:`[1,0,1]`、`[1,0,1,0]`、`[0,1,0,1]`、`[1,0,1]`。
>
> **示例 2**
>
> **输入**:`nums = [0,0,0,0,0]`, `goal = 0`
>
> **输出**:`15`

**提示**：

- `1 <= nums.length <= 3 * 10^4`
- `nums[i]` 不是 `0` 就是 `1`
- `0 <= goal <= nums.length`

---

## 解题思路

数组元素只有 0 和 1，窗口和随扩张不减，因此可以用滑动窗口分别统计两个阈值条件。

但“恰好“的条件相较于“大于等于“的条件，需要额外处理：我们可以把问题分解为：

- 大于等于goal的子数组数量
- 大于goal的子数组数量
- 答案为 大于等于goal - 大于goal 的子数组数量

本质上，就是把大于类型（大于等于类型类似）的解法在一个函数内两部分同时完成，并做减法。

### 算法步骤

1. for循环：遍历数组，每次入右端点right
2. 内部分为两部分：大于等于goal的子数组数量和大于goal的子数组数量，分别对应两个while循环收缩左端点left1和left2
3. 答案更新为 大于等于goal - 大于goal 的子数组数量

---

## 代码

```cpp
class Solution {
public:
    int numSubarraysWithSum(vector<int>& nums, int goal) {
        int ans = 0;
        int sum1 = 0, sum2 = 0;
        int left1 = 0, left2 = 0;

        for(int right = 0; right < nums.size(); right++){
            //>=goal部分
            //入
            sum1 += nums[right];
            //收缩
            while(left1 <= right && sum1 >= goal){
                sum1 -= nums[left1];
                left1++;
            }
            //答案
            ans += left1;

            //>goal部分
            //入
            sum2 += nums[right];
            //收缩
            while(sum2 > goal){
                sum2 -= nums[left2];
                left2++;
            }
            //答案
            ans -= left2;
        }

        return ans;
    }
};
```

- **时间复杂度**: O(n)
- **空间复杂度**: O(1)

---

## 易错点

- 本题中的第一个while循环（大于等于goal）需要考虑 `goal = 0` 的情况，有概率出现左端点left1大于right，需要在条件中剔除。

## 边界自测

- nums=[0,0,0,0,0], goal=0 → 15；必须处理零阈值。
- 验证入口与运行状态见[验证说明](../../docs/validation.md)。
