---
title: TypeScript 常见错误整理
description: 这里记录下了我在学习和使用 TypeScript 时遇到的常见错误, 如果你有什么疑问, 欢迎在下方留言或点击右上方小铅笔补充修改
date: 2019-07-22 09:19:11
categories: 笔记
tags:
  - TypeScript
---


*Tips: 善用右侧导航和 `Ctrl+F` 搜索哦*

<div id="TS2307"></div>
## TS2307: Cannot find module 'moduleA'.

假设我们有一个导入语句 `import { a } from "moduleA"`, 为了去检查任何对 `a` 的使用, 编译器回去寻找关于它的定义, 这会去向上寻找 `moduelA`.

但 moduleA 会写在某个 `.ts` 或是 `.d.ts` 文件中, 如果没有找到对应的类型定义去解析这个模块, 可能会抛出一个 `error TS2307: Cannot find module 'moduleA'.`

**解决办法**  
给 `moduleA` 声明定义文件, 如果导入的是一个第三方 npm 包, 可以去社区找到对应的 [@types](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/README.cn.md)

**相关资料**
- https://www.typescriptlang.org/docs/handbook/module-resolution.html ([中文镜像](https://www.tslang.cn/docs/handbook/module-resolution.html))

<div id="TS2339"></div>
## TS2339: Property 'xxx' does not exist on type 'yyy'.

当使用表达式 `yyy.xxx` 时, typescript 会尝试从 `yyy` 对象上解析 `xxx` 属性, 如果没有找到对应的定义, 则会抛出一个 `error TS2339: Property 'xxx' does not exist on type 'yyy'.`

**解决办法**

给 `yyy` 对象定义正确的类型

需要注意的是, 如果 `yyy` 是 window 对象, 则需要定义全局的声明文件, 如果

`TS2339: Property 'xxx' does not exist on type 'Window'.`

``` ts
declare global {
  interface Window {
    xxx: any;
  }
}
```

这里还是建议 xxx 应该有自己的类型而不是 any.



<div id="TS2531"></div>
## TS2531: Object is possibly 'null'.

在访问一个对象上的属性时, 如果该对象可能为 `null` 则抛出 `error TS2531: Object is possibly 'null'.`

**解决办法**

在访问可能为空的对象前判断该对象是否为空



<div id="TS2554"></div>
## TS2554: Expected 2 arguments, but got 1.

这是由于调用函数时, **传入参数** 与 **期望的参数** 数量不一致时, 会抛出 `error TS2554: Expected 2 arguments, but got 1.`

**解决办法**

- 如果是自定义函数类型定义的问题, 修改函数的 interface.
- 如果是调用时传参的问题, 恭喜你, 提前发现了一个错误, Fix it.
