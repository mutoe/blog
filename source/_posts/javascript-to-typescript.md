---
title: 记一个项目改造为 TypeScript 心得
date: 2019-07-20 11:38:11
categories: 心得
tags:
  - TypeScript
  - JavaScript
---

# 前言

现手上有一个小型的 js 项目, 内容比较简单, 就是提供一个单页, 其中引用了 quill 富文本编辑器. 

该页面需要嵌入到其他客户端(如 iframe 或 webview) 以提供统一的富文本编辑的用户体验.

项目内部使用 webpack 将 js / stylus 打包, 对外提供两个 html, 一个用于大屏的 iframe 显示, 另一个用于小屏的 Android / IOS 设备显示.

项目结构如下

![file-tree](//static.mutoe.com/2019/javascript-to-typescript/file-tree.png)

你可以参考此项目对自己的项目进行改造, 过程大致相同

> 阅读本贴, 你可能需要了解以下前置内容
> - typescript
> - webpack
> - yarn

**本次改造所有改动可在 github [查看 commit 记录](https://github.com/slimkit/plus-editor/commit/3424d38e0e60ce39eeaa419113fb67cf73411d36)**

<!-- more -->

# 开始改造

## 1. 添加 `typescript` 依赖和 `tsconfig.json`

``` bash
$ yarn add -D typescript
$ yarn tsc --init
```

其中 `yarn tsc --init` 使用本地刚安装的 typescript 初始化了一个 `tsconfig.json` 含有很多默认配置的文件

修改 `tsconfig.json` 为以下内容 (可自行配置)

``` json tsconfig.json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "rootDir": "./src/",
    "sourceMap": true,
    "strict": true,
    "noImplicitAny": false,
    "module": "es6",
    "target": "es5"
  }
}
```

> 查看 [TypeScript 官方文档](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) 了解更多关于 `tsconfig.json` 的配置选项。

## 2. 将所有 js 文件修改为 ts 文件

一个一个替换后缀名太麻烦了, 我们使用几行命令批量替换. (注意我们只需要批量替换 src 目录下的 js 文件)

linux / mac 下执行以下命令

``` bash
$ cd src
$ find . -name "*.js" | sed 's/.js//' | xargs -n1 -I {} mv {}.js {}.ts
```

windows 下参考 [这里(google)](https://www.google.com/search?q=windows+%E9%80%92%E5%BD%92+%E6%89%B9%E9%87%8F%E6%9B%BF%E6%8D%A2%E6%96%87%E4%BB%B6%E5%90%8E%E7%BC%80) 或 [这里(baidu)](https://www.baidu.com/baidu?wd=windows+%E9%80%92%E5%BD%92+%E6%89%B9%E9%87%8F%E6%9B%BF%E6%8D%A2%E6%96%87%E4%BB%B6%E5%90%8E%E7%BC%80)

## 3. 修复出错的 ts 文件

执行以下命令来检查有多少个文件需要修改

``` bash
yarn tsc
```

![tscompile-errors](//static.mutoe.com/2019/javascript-to-typescript/tscompile-errors.png)

意料之中, 我们得到了 29 个错误, 分了下类, 大约有下面几种类型, 逐一解决之

- [error TS2307: Cannot find module 'xxx'.](#TS2307)
- [error TS2339: Property 'xxx' does not exist on type 'yyy'.](#TS2339)
- [error TS2554: Expected 2-3 arguments, but got 1.](#TS2554)
- [error TS2322: Type 'any' is not assignable to type 'never'.](#TS2322)

## 4. 让 webpack 支持编译 typescript

我们接下来我们需要让 webpack 认识 ts 文件并且以 typescript 自己的编译器进行转化, 安装 `ts-loader`

``` bash
$ yarn add -D ts-loader
```

然后添加 `webpack.config.js` 文件中对 ts 文件的解析 (自行追加)

``` js webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js', '.json' ]
  },
};
```

> 查看 [Webpack 中文文档](https://webpack.docschina.org/concepts/configuration/) 了解更多关于 `webpack.config.js` 的配置选项。


# 改造后常见 TS 错误 (持续更新)

> 如果你想了解一些常见的 TS 错误, 可以参见我的另一篇帖子 -- [《TypeScript 常见错误整理》](/2019/typescript-errors)

<div id="TS2307"></div>

## TS2307: Cannot find module 'moduleA'.

假设我们有一个导入语句 `import { a } from "moduleA"`, 为了去检查任何对 `a` 的使用, 编译器回去寻找关于它的定义, 这会去向上寻找 `moduelA`.

但 moduleA 会写在某个 `.ts` 或是 `.d.ts` 文件中, 如果没有找到对应的类型定义去解析这个模块, 可能会抛出一个 `error TS2307: Cannot find module 'moduleA'.`

**解决办法**  
给 `moduleA` 声明定义文件, 如果导入的是一个第三方 npm 包, 可以去社区找到对应的 [@types](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/README.cn.md)

<details>
<summary>本示例项目中出现的 TS2307 错误</summary>

**`error TS2307: Cannot find module 'quill'.`**

```
src/blots/divider.ts:1:19 - error TS2307: Cannot find module 'quill'.

1 import Quill from 'quill'
```

需要安装 `@types/quill`

``` bash
$ yarn add -D @types/quill
```

**`error TS2307: Cannot find module 'source-map'.`**
   
``` bash
node_modules/@types/uglify-js/index.d.ts:9:30 - error TS2307: Cannot find module 'source-map'.

9 import { RawSourceMap } from 'source-map';
```

我尝试安装 @types/source-map 但是不起作用, 于是去 google 这个问题, 在 [DefinitelyTyped#23649](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/23649#issuecomment-424355987) 找到了解决办法:

安装 `source-map` 并且设置 `tsconfig.json` 中的 `moduleResolution`

``` json tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node"
  }
}
```
</details>

----------

<div id="TS2339"></div>

## TS2339: Property 'xxx' does not exist on type 'yyy'.

当使用表达式 `window.xxx` 时, typescript 会尝试从 `yyy` 对象上解析 `xxx` 属性, 如果没有找到对应的定义, 则会抛出一个 `error TS2339: Property 'xxx' does not exist on type 'yyy'.`

**解决办法**

给 `yyy` 对象定义正确的类型

需要注意的是, 如果 `yyy` 是 window 对象, 则需要定义全局的声明文件

``` ts
declare global {
  interface Window {
    xxx: any;
  }
}
```

这里还是建议 xxx 应该有自己的类型而不是 any.

<details>
<summary>本示例项目中出现的 TS2339 错误</summary>

**`error TS2339: Property 'id' does not exist on type 'never'.`**

```
src/index.ts:64:51 - error TS2339: Property 'id' does not exist on type 'never'.

64     const index = images.findIndex(image => image.id === item.id)
```

这里是因为我在初始化 `images` 数组时书写了以下内容 

``` ts
const images = []
```

TS 认为 `images` 数组是一个空数组并且不可拓展, 于是遍历数组时 TS 认为每个元素都是 `never` 类型, 而 `id` 属性并不在 `never` 类型上面. 我们给这个数组补充声明一个类型

``` ts
/** 上传的图片 */
interface UploadImage {
  /** 图片标识 */
  id: number
  /** 图片地址 */
  src?: string
}

/** 上传的图片列表 */
const images: UploadImage[] = []
```

**`error TS2339: Property 'launcher' does not exist on type 'Window'.`**

```
src/caller.ts:2:14 - error TS2339: Property 'launcher' does not exist on type 'Window'.

2   if (window.launcher) {
```

在入口 `index.ts` 文件顶部增加以下内容

``` ts index.ts
declare global {
  interface Window {
    quill: Quill
    /** Android 端注入 webview 中的对象 */
    launcher: any
    /** IOS 端注入 webview 中的对象 */
    webkit: any
    /** 接收图片预览地址的钩子 */
    imagePreviewReceiver: (src: string) => void
    /** 接收图片实际地址的钩子 */
    imageUrlReceiver: (src: string) => void
    /** 接收提交请求的钩子, 会触发各端对应的提交事件 */
    editorSubmitReceiver: (src: string) => void
  }
}
```

至于 `launcher` 和 `webkit` 为什么是 `any` 类型, 这两个变量是 android 和 ios 端分别注入在 window 中的 sdk, 所以保证他内部逻辑不会出错就可以啦.


</details>

----------

<div id="TS2531"></div>

## TS2531: Object is possibly 'null'.

在访问一个对象上的属性时, 如果该对象可能为 `null` 则抛出 `error TS2531: Object is possibly 'null'.`

**解决办法**

在访问可能为空的对象前判断该对象是否为空

<details>
<summary>本示例项目中出现的 TS2531 错误</summary>

**`error TS2531: Object is possibly 'null'.`**

```
    const range = quill.getSelection()
    quill.insertEmbed(range.index, 'image', item.base64, 'user')
    
const range: RangeStatic | null
Object is possibly 'null'.ts(2531)
```

这是由于 `range` 对象是调用 `quill.getSelection()` 得到的, 而该方法的返回值包含了 `RangeStatic | null`. 

如果 `range` 为空的话, 我们在生产环境访问 `range.index` 就不好了... Fix it.

``` ts
const index = (range && range.index) || 0
quill.insertEmbed(index, 'image', item.base64, 'user')
```
</details>

----------

<div id="TS2554"></div>

## TS2554: Expected 2 arguments, but got 1.

这是由于调用函数时, **传入参数** 与 **期望的参数** 数量不一致时, 会抛出 `error TS2554: Expected 2 arguments, but got 1.`

**解决办法**

- 如果是自定义函数类型定义的问题, 修改函数的 interface.
- 如果是调用时传参的问题, 恭喜你, 提前发现了一个错误, Fix it.

<details>
<summary>本示例项目中出现的 TS2554 错误</summary>

**`error TS2554: Expected 2-3 arguments, but got 1.`**

```
    window.top.postMessage({ funcName: fnName, params })

Expected 2-3 arguments, but got 1.ts(2554)
lib.dom.d.ts(17233, 31): An argument for 'targetOrigin' was not provided.
```

这是由于调用 `window.postMessage` 方法时传参不严谨导致的问题, 该方法期望接受第二个参数 `targetOrigin` 用于增强安全性, 补充之.  

``` ts
window.top.postMessage({ funcName: fnName, params }, '*')
```

注: 虽然该方法不传入第二个参数也可调用成功, 但是在 [postMessage 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage) 中该方法是必选的.  

<br>
**`error TS2554: Expected 2 arguments, but got 1.`**

```
    inWebview = callMethod('chooseImage')

(alias) callMethod(fnName: any, params: any): boolean
import callMethod
Expected 2 arguments, but got 1.ts(2554)
caller.ts(1, 36): An argument for 'params' was not provided.
```

该问题是由于自己定义的方法 `callMethod` 第二个参数是可选的, 但是忘记书写默认值, 导致问题出现. 修正 `callMethod` 类型

``` ts
export function callMethod(fnName: string, params: any = {}): boolean {
  // ...
}
```

</details>

# 心得总结

_如果你自己改造的过程中遇到了什么问题, 可以在下面留言, 我会第一时间回复并尽可能的帮助你解决一些改造过程中遇到的问题._


## 平滑过渡到 typescript

为了减小过渡到 typescript 的成本, 我添加了 `"noImplicitAny": false` 如果你的项目不大, 可以移除改行逐一替换 any 类型

当然中大型项目后期是需要逐渐移除 any 类型的, 不然就成了 anyscript 😂


## 关于批量替换文件名

在替换文件名时一开始尝试使用 `for i in *.js; do mv "$i" "${i%.js}.ts";done` 命令, 发现该命令只能替换当前目录下的文件, 不能递归替换子目录, 遂放弃之.

## 错误数量巨大

很多时候刚改造完项目编译发现成百上千个错误, 这时候千万不能怕, 很多错其实都是联动发生的, 你只要找对了根源修复它, 一次可以减少很多数量的错误.

像这次改造, 开始有 30 个错误, 每次调整同类型的错误都能减少很多, 改到最后 0 个问题, 心里还是觉得蛮有成就感的.

# 参考资料

- [React & Webpack(EN) - TypeScript](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
- [Module Resolution(EN) - TypeScript](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [TypeScript - Webpack中文文档](https://webpack.docschina.org/guides/typescript/)
- [DefinitelyTyped(CN) - GitHub](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/README.cn.md)
- [从 JavaScript 迁移 - 《深入理解 TypeScript[译]》](https://jkchao.github.io/typescript-book-chinese/typings/migrating.html)
