---
title: 使用 Vue + Koa 打造全栈应用《时光·印象》图片分享应用 -- 前端页面构建篇
date: 2018-10-20 14:55:21
categories: 心得
tags:
  - Vue
  - Stylus
  - ElementUI
---

> _使用 Vue + Koa 打造全栈应用《时光·印象》图片分享应用_ 系列教程

# 前言

上一篇我们讲了如何搭建项目框架，这一篇我们来将如何使用 vue 编写前端页面。  
其中涵盖了视图、路由、组件、状态管理几个部分，分为几个章节，循序渐进的引入他们

我们这次篇的目标是创建注册和登陆页、图片列表页（首页）和图片详情页共4个页面


<!-- more -->

# 目录

  1. [项目框架搭建篇](/2018/vue-koa-setup-app-framework)
  2. [前端页面构建篇](/2018/vue-koa-frontend-build)
  
# 1. 配置 ESLint

我们使用 vue-cli 创建项目时，已经选择了 eslint 置入我们的项目，但是它的规则是松散的。  
我们把规则调的稍微严格一些，配合编辑器的自动格式化功能，我们可以写出非常优雅的代码，不易出错，也具有较强的可读性。

打开 `package.json`, 修改以下内容

``` diff
  "extends": [
-   "plugin:vue/essential",
+   "plugin:vue/recommended",
    "@vue/standard"
  ],
  "rules": {
+   "comma-dangle": [ 2, "always-multiline" ],
+   "vue/max-attributes-per-line": [ 2, { "singleline": 2 } ]
  },
```

> `comma-dangle`  将数组的多行元素或对象的多行属性尾部添加一个逗号
> `vue/max-attributes-per-line` 将 html 中超过 2 个属性的标签拆行显示

# 1. 引入 ElementUI 样式库

根据 [ElementUI 官网](http://element-cn.eleme.io/#/zh-CN/component/quickstart#shi-yong-vue-cli-at-3) 的介绍，
我们可以使用 vue-cli@3 的插件方式安装 ElementUI

``` bash
vue add element
```

# 2. 路由

我们将 `src/router.js` 移动到 `src/router/index.js` (如果目录不存在就创建它)

``` bash
mv src/router.js src/router/index.js
```

然后在 `src/router` 目录下新建一个 `base.js` 和 `auth.js` 的文件

`base.js` 用来存放基础路由，比如首页、图片详情页（临时存放），内容如下

``` js
import ImageList from '@/views/ImageList.vue'
import ImageDetail from '@/views/ImageDetail.vue'

export default [
  {
    path: '/images',
    name: 'ImageList',
    component: ImageList,
  },
  {
    path: '/images/:id',
    name: 'ImageDetail',
    component: ImageDetail,
  },
]

```

创建 `auth.js` 用来存放认证路由，比如登陆、注册页，内容如下

``` js
/**
 * 权限路由
 */

import AuthLogin from '@/views/AuthLogin.vue'
import AuthRegister from '@/views/AuthRegister.vue'

export default [
  {
    path: '/auth/login',
    name: 'AuthLogin',
    component: AuthLogin,
  },
  {
    path: '/auth/register',
    name: 'AuthRegister',
    component: AuthRegister,
  },
]

```

然后在 `src/views` 下创建四个 vue 文件，分别是 `ImageList.vue` `ImageDetail.vue` `AuthLogin.vue` `AuthRegister.vue`，它们的内容暂时是空的 vue 模版文件，如下

``` vue
<template>
  <div/>
</template>

<script>
export default {}
</script>
```

最后编辑 `src/router/index.js`，内容如下

``` diff
  import Vue from 'vue'
  import Router from 'vue-router'
- import Home from './views/Home.vue'
+ import baseRoute from './base'
+ import authRoute from './auth'

  Vue.use(Router)

  export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
-     {
-       path: '/',
-       name: 'home',
-       component: Home,
-     },
-     {
-       path: '/about',
-       name: 'about',
-       // route level code-splitting
-       // this generates a separate chunk (about.[hash].js) for this route
-       // which is lazy-loaded when the route is visited.
-       component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
-     },
+     // 入口
+     { path: '/', redirect: '/images' },
+
+     ...baseRoute,
+     ...authRoute,
    ],
  })

```
