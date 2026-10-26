# Algo-Grimoire

个人算法学习与复习笔记，以 C++ 题解为主。专题笔记解释适用条件和正确性，题解记录关键转化、个人误区和边界案例。

## 阅读入口

| 专题 | 状态 | 阅读与代表题 |
| --- | --- | --- |
| 定长滑动窗口 | 已整理，持续复习 | [专题笔记](notes/sliding-window/fixed-window.md)；[643：窗口和](leetcode/sliding-window/643-leetcode.md)、[2841：频次维护](leetcode/sliding-window/2841-leetcode.md)、[1423：逆向转化](leetcode/sliding-window/1423-leetcode.md) |
| 非定长滑动窗口 | 已整理，持续复习 | [专题笔记](notes/sliding-window/non-fixed-window.md)；[3：求最长](leetcode/sliding-window/3-leetcode.md)、[3795：求最短](leetcode/sliding-window/3795-leetcode.md)、[1358：计数](leetcode/sliding-window/1358-leetcode.md)、[930：恰好型](leetcode/sliding-window/930-leetcode.md) |
| 二分查找 | 本地草稿，尚未纳入版本管理 | 下一专题：区间约定、循环不变量、lower_bound / upper_bound |
| 双指针、动态规划、贪心、回溯 | 待开始 | 目前仅有占位目录 |
| 图论、网格图、数据结构、单调栈 | 待开始 | 目前仅有占位目录 |
| 字符串、数学、位运算 | 待开始 | 目前仅有占位目录 |

当前已收录 16 篇独立滑动窗口题解，另有专题内的 1456、209 例题。已写题解与未来练习在各专题题单中分别列出；“已整理”不代表已覆盖所有进阶题。

## 复习方式

1. 先判断约束的单调性，解释为什么指针不必回退。
2. 不看代码写出维护状态、收缩条件和答案更新位置。
3. 用示例及一个边界案例检查，再对照题解中的个人反思。
4. 同类题只记录变化；不能复述正确性时，回到专题笔记补理解。

## 目录与约定

- notes：专题知识、不变量、实现模板与代表题。
- leetcode：按主解法分类的独立题解，多种解法通过文内链接关联。
- docs/images：笔记插图。
- docs/templates：[专题模板](docs/templates/note-template.md)、[题解模板](docs/templates/problem-solution-template.md)。

代码默认使用 C++20，已有代码包含 contains 和 ranges。Solution 代码块按 LeetCode 提交格式编写，通常省略头文件、命名空间和 main；本地运行时需要补充驱动。复杂度说明应区分辅助空间与返回值空间，哈希操作按期望常数时间分析。

## 当前维护清单

- [x] 修正已发现的滑窗示例、边界解释与复杂度错误。
- [x] 补充两类滑窗不变量和计数公式证明。
- [ ] 补完二分草稿，重点解释闭区间边界与越界哨兵。
- [ ] 分别练习 713、76、992，补齐计数、覆盖与恰好型的应用。
- [ ] 复习时记录实际做错的反例，避免只扩充题单。

新增内容先复用模板，确认示例和边界，再更新专题题单及本页状态。

## 验证

运行方法、检查范围与本次运行状态见[验证说明](docs/validation.md)。
