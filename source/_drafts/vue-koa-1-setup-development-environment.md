---
title: 使用 Vue + Koa 打造全栈应用 1 -- 环境搭建篇
date: 2018-03-22 18:12:02
categories: 心得
tags:
  - Vue
  - Koa
---

# 前言

之前在学校用前端 pjax 无刷新跳转 + 后端 php 服务端渲染做了一个应用, 用来做校内的图片分享网站, 后来离校后就没怎么管了, 所以只做了一点就弃坑了. 

最近又想起来那个项目, 所以这次抱着学习的心态使用 vue + koa 来重新将这个项目拾起来, 一方面可以学习一些当下的新框架了解前段发展趋势, 另一方面也可以充实下自己的简历.

# 选型

下面列出该项目的技术选型, 以及原因 (按重要程度排序)

- ## Vue (v2.5)

选 Vue 作为前端框架是因为他的单文件组件做模块化开发很方便, 还有现成的脚手架工具 `vue-cli`, 以及对 [@尤大](https://github.com/yyx990803) 的 __信仰__

以及 `vue-router` `vuex` `axios`

`单文件组件` `响应式`

- ## Webpack (v3.6)

选用 Webpack 作为自动化工具是因为 Gulp 和 Fis 了解一些, 想了解一下 Webpack 的工作方式. 另外 `vue-cli` 也默认使用它进行模块化开发.

`模块化` `按需引入第三方库` <span class="explain" title="Hot Module Replacement, 模块热替换. 用于开发时页面的无刷新重载">`HMR`</span>

- ## Koa (v2.5)

选用 Koa 而非 Express 也是因为 Express 了解过一些, 想换个口味试试. Express 也确实感受过回调地狱的痛, Koa 的洋葱模型似乎很不错!

后端只用来提供 API 接口不做 <span class="explain" title="Server-Side Render, 服务端渲染.">SSR</span>.

以及 `koa-router` `koa-jwt` 

`中间件`

- ## MongoDB (v3.6)

就想学习下 NoSQL 数据库, MongoDB 语法最像 js, 就它了.

- ## Eslint

Eslint 进行代码风格检查和防傻瓜还是非常方便的, 尤其是配合其自带的 `--fix` 功能自动进行代码格式化. 避免在 coding 的过程中出现一些傻瓜式的语法错误带来的不必要的时间浪费.

`语法检查` `防傻瓜`

- ## ES6, Stylus, Pug
 
__语法糖!__ 提高 coding 效率. 但是 <span class="explain" title="一个类似 Less \ Sass 的 CSS 预处理器">Stylus</span> 和 <span class="explain" title="一个 HTML 模版引擎, 前身是 Jade.">Pug</span> 比较小众, 可能会降低代码可读性, 但无所谓啦, 这个单人项目又有谁会来读我的代码呢.

`语法糖` `预处理`

- ## Yarn

用 Yarn 就是因为快! 比 npm 快了不是一丁半点!

`依赖安装`

# 安装步骤

## 1. 使用 vue-cli 生成项目目录

``` bash
yarn global add vue-cli
vue init webpack pic
cd pic
```

构建时选择了 eslint standard, Jest unit test, e2e
