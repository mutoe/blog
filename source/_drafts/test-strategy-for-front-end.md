---
title: 前端测试策略
date: 2022-02-11 11:40:51
categories: 心得
tags:
  - test
---

# 前端项目中的测试金字塔

![前端测试金字塔](https://static.mutoe.com/2022/test-strategy-for-front-end/pyramid.png)

<!-- TODO: 补充UI、Functional测试 -->
UI、Functional 测试在这里就不过多讲了，一般会由 QA 负责对其进行自动化和手工测试。
Unit 测试主要是负责一些纯函数的测试，比如 API 调用，工具函数和 Hooks 等，这个也没什么争议点，属于纯函数的测试。

在讨论前端中的 Component test (组件测试) 是否属于集成测试之前，我们先来看看目前前端开发中测试框架的两大流派：

以 React Enzyme/Vue test utils 为代表的单元测试阵营和以 Testing Library 为代表的集成测试阵营。

![Enzyme/Vue Test Utils VS Testing Library](https://static.mutoe.com/2022/test-strategy-for-front-end/testing-library-vs-enzyme-vue-test-utils.png)


# 编写可测试的组件 -- 组件拆分

而最有争议点的问题就是：JSX 测不测？

在讨论一个问题前，我喜欢先分析清楚争议点带来的投入产出比。可以借助图像进行归类，我们画一个坐标轴将横轴设为投入的精力，纵轴设置为收益

![收益-投入座标](https://static.mutoe.com/2022/test-strategy-for-front-end/value-cost-graph.png)

# 如何设置覆盖率
# 一些干货
