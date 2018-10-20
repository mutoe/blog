---
title: 使用 Vue + Koa 打造全栈应用《时光·印象》图片分享应用 -- 项目框架搭建篇
date: 2018-10-15 20:12:02
update: 2018-10-20 14:47:20
categories: 心得
tags:
  - Vue
  - Koa
---

# 前言

之前在学校用前端 pjax 无刷新跳转 + 后端 php 服务端渲染做了一个应用, 用来做校内的图片分享网站, 后来离校后就没怎么管了, 所以只做了一点就弃坑了. 

最近又想起来那个项目, 所以这次抱着学习的心态使用 vue + koa 来重新将这个项目拾起来, 一方面可以学习一些当下的新框架了解前段发展趋势, 另一方面也可以充实下自己的简历.

## 选型

下面列出该项目的技术选型, 以及原因 (按重要程度排序)

- ### Vue (v2.5) `单文件组件` `响应式`

  以及 `vue-router` `vuex` `axios`

  选 Vue 作为前端框架是因为他的单文件组件做模块化开发很方便, 还有现成的脚手架工具 `vue-cli`, 以及对 [@尤大](https://github.com/yyx990803) 的 __信仰__

- ### Koa (v2.5) `中间件`

  以及 `koa-router` `koa-jwt` 

  选用 Koa 而非 Express 是因为 Express 了解过一些, 想换个口味试试. Express 也确实感受过回调地狱的痛, Koa 的洋葱模型似乎很不错!

  后端只用来提供 API 接口不做 <span class="explain" title="Server-Side Render, 服务端渲染.">SSR</span>.

- ### MongoDB (v4.0) `NoSQL Database`

  就想学习下 NoSQL 数据库, MongoDB 语法最像 js, 就它了.

- ### Eslint `语法检查` `防傻瓜`

  Eslint 进行代码风格检查和防傻瓜还是非常方便的, 尤其是配合其自带的 `--fix` 功能自动进行代码格式化. 避免在 coding 的过程中出现一些傻瓜式的语法错误带来的不必要的时间浪费.
  
  使用 Eslint Standard 配置（Vue 使用 @vue/standard 配置）

- ### ES6, Stylus `语法糖` `预处理`
 
  __语法糖!__ 提高 coding 效率. 但是 <span class="explain" title="一个类似 Less \ Sass 的 CSS 预处理器">Stylus</span>, 一个小众的 css 预处理器, 提供了非常高效和酷炫的写法.

- ### Yarn `依赖安装`

  用 Yarn 就是因为快! 比 npm 快了不是一丁半点! yarn 执行项目内 bin 文件也非常方便, 免去了安装全局依赖的烦恼.

<!-- more -->

# 安装步骤

## 1. 安装 yarn 包管理器

yarn 相比于 npm 的优势在于安装速度更快，并且本地安装的 bin 包可以直接食用 `yarn xxx` 运行（和 npx 有些类似）

``` bash
npm i -g yarn # 用 npm 安装 yarn 到全局 😂
yarn -v # > 1.10.1
```

## 2. 使用 vue-cli 生成项目目录

[**`@vue/cli v3`**](https://cli.vuejs.org) 
全新的 v3 版本提供了非常便捷的初始化 vue 项目的方法，并且提供了 UI 可视化界面来创建或管理 vue 项目.

_Vue UI 创建项目_
![vue ui](//static.mutoe.com/2018/vue-koa-fullstack-time-image/vue-ui-create-project.jpg)

这里我们使用命令行来创建项目

``` bash
yarn global add @vue/cli # 全局安装 vue-cli
cd xxx # 切换到你的项目管理目录
vue create pic # 使用 vue-cli 创建一个名为 pic 的项目
```

然后你会看到下图

![vue-cli create](//static.mutoe.com/2018/vue-koa-fullstack-time-image/vue-create-step1.png)

选择 `Manually select features` 来根据我们的需要选择初始化模版

![vue-cli create](//static.mutoe.com/2018/vue-koa-fullstack-time-image/vue-create-step2.png)

选择 `Babel` `PWA` `Router` `Vuex` `CSS Pre-processors` `Linter / Formatter`

选择 vue-router 的 `history` 模式; `Stylus` css 预编译器; `ESLint + Standard config` Standard ESLint 语法检查和自动格式化; 在保存时进行语法检查；将这些配置信息保存到 `package.json` 中而不是分别散落在不同的文件中

![vue-cli create](//static.mutoe.com/2018/vue-koa-fullstack-time-image/vue-create-step3.png)

等待依赖安装完毕，然后迫不及待的将我们刚创建好的 vue 模版运行起来吧！

``` bash
cd pic
yarn serve # 以开发模式启动项目
```

![vue-cli create](//static.mutoe.com/2018/vue-koa-fullstack-time-image/vue-create-finally.png)

项目目录框架搭建就完成啦！

## 3. 创建服务端目录

我们在项目根目录下创建一个 server 目录，用于存放和服务端相关的文件内容.  
然后安装服务端核心框架 koa
然后切换到 server 目录, 创建一个 `index.js` 的文件

``` bash
mkdir server
yarn add koa
cd server
vi index.js
```

`index.js` 文件内容如下

``` js
const Koa = require('koa')
const app = new Koa()

app.use(ctx => {
  ctx.body = 'Hello TimeImage'
})

app.listen(3000, () => {
  console.log('Koa is running in port 3000 successfully!')
})

```

然后我们来启动它吧！

``` bash
node index.js
# >>> Koa is running in port 3000 successfully!
```

然后打开你的浏览器，输入 `localhost:3000`, 是不是看见了令人激动的 "Hello TimeImage" 呢！

但是现在我们的服务端代码改动时，并不能实时生效，我们需要中断 nodejs 进程，然后重新启动它，这样的话很麻烦，不利于高效率开发应用。  
所以我们请出 PM2 来监听代码变动并热重启 nodejs 进程，还能将日志输出到文件中，awesome pm2!

``` bash
# 按下 ctrl+c 中断 nodejs 进程
cd ..
yarn global add pm2 # 将 pm2 安装为全局依赖
pm2 start server/index.js # 通过 pm2 启动 node 服务
pm2 log # 查看日志
```

> 还可以使用 `pm2-dev` 来启动开发服务， 区别就是使用 dev 进行启动时，可以实时输出日志并且会监听代码变动对服务进行热重启，免去每次都要手动重启 node 服务的烦恼。

![pm2 develpment mode](//static.mutoe.com/2018/vue-koa-fullstack-time-image/pm2-dev-mode.png)

## 4. 连接数据库

> 此步骤开始前，请确保你的机器上安装并启动了 mysql, 然后创建好一个名为 `pic` 的数据库，为了支持 emoji 表情，请将数据库字符集设置为 `utf8mb4`

首先安装 nodejs mysql 依赖，用于使用 node 对 mysql 数据库进行操作。

``` bash
yarn add mysql
```

然后在 `server/index.js` 头部插入以下内容

``` js
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pic',
})
connection.connect(err => {
  if (err) return console.error(err)
  console.log('mysql is connected successfully!')
})
```

![mysql is connected](//static.mutoe.com/2018/vue-koa-fullstack-time-image/mysql-is-connected.png)

## 5. 使用配置文件

我们存在于本地的配置文件（如 mysql 连接信息、vue 或 koa 的配置信息）无法使用 git 进行管理，所以我们要将这些环境配置信息存在一个单独的文件中进行管理，并且将它加入到 git 的忽略列表中，禁止这个文件被 git 控制。  

这里我们使用 node 中的 `dotenv` 来管理配置信息

``` bash
yarn add dotenv
touch .env.template # 创建 `.env.template` 配置信息模版文件
```

将以下内容填入 `.env.template` 文件中

``` ini
# 部署路径
BASE_URL = /

# 服务端相关配置
SERVER_LISTEN_PORT = 8080 # 服务端口号

# MySQL 连接信息
MYSQL_HOST = localhost
MYSQL_USERNAME = root
MYSQL_PASSWORD =
MYSQL_DATABASE = pic

```

将该文件复制一份重命名为 `.env` 并将其加入 `.gitignore` 列表

``` bash
cp .env.template .env
echo .env >> .gitignore
```

> 模版文件将提交到 git 版本控制，该文件会对**所有人可见**。  
> 所以在模版配置文件 `.env.template` 中不要包含私密信息，数据库连接信息请在 `.env` 文件中进行填写。
> 并且在发布时请提示用户将模版文件复制一份重命名为 `.env`。

修改 `server/index.js`

``` diff
+ // 加载 dotenv 配置信息
+ require('dotenv').config()

  // 连接 mysql
  const mysql = require('mysql')
  const connection = mysql.createConnection({
-   host: 'localhost',
-   user: 'root',
-   password: '',
-   database: 'pic',
+   host: process.env.MYSQL_HOST || 'localhost',
+   user: process.env.MYSQL_USERNAME || 'root',
+   password: process.env.MYSQL_PASSWORD || '',
+   database: process.env.MYSQL_DATABASE || 'pic',
  })

  connection.connect(err => {
    if (err) return console.error(err)
    console.log('mysql is connected successfully!')
  })

  // 创建 koa 实例
  const Koa = require('koa')
  const app = new Koa()
+ const port = process.env.APP_SERVER_LISTEN_PORT || 3000

  app.use(ctx => {
    ctx.body = 'Hello TimeImage'
  })

- app.listen(3000, () => {
-   console.log(`Koa is running in port 3000 successfully!`)
+ app.listen(port, () => {
+   console.log(`Koa is running in port ${port} successfully!`)
  })

```

经过这番操作，你的数据库就不会暴露给 git 仓库啦！

# 小结

到这里为止，我们的全栈应用程度的框架搭建篇就结束了，我们初步搭建好了 Vue 框架、koa server、mysql 和 配置文件管理。

当然，这样的目录结构现在时没有任何联系的，我们下一篇进行前端页面的编写。
