---
title: 使用 GitHub Pages 和 Hexo 搭建自己的静态博客
date: 2016-12-14 21:41:22
update: 2016-12-15 22:24:34
tags:
 - GitHub Pages
 - Hexo
---

## 准备工作

* github 帐号
* node 环境
* 科学上网 (尽量)

如果你还不知道 github 或者 node, 建议您简单了解一下 git / github 、 node 工作原理, 以便快速上手该教程, 这里就不再阐述了.

## 1 搭建 Github Pages

### 1.1 新建一个 GitHub Pages 个人主页项目

注意项目名要填 `用户名.github.io` , 比如我的github用户名是mutoe, 那我的项目名就必须填 `mutoe.github.io` , 如果不这样做的话你的主页就会变成类似 `http://mutoe.github.io/project-name` 这样的子目录了.

![github-pages-project](github-pages-project.jpg)

填完项目名直接确认就好, 其它不用设置.

<!-- more -->

## 2 搭建本地 git 环境

如果你已经搭建好了 git 环境, 如安装了 github 客户端或其他 git 客户端, 那么您就可以跳过此步.

``` bash
$ npm install git -g
```

## 3 搭建本地 Hexo 环境

### 3.1 安装 Hexo 框架

首先确认您的 node 是 3.2.2 及以上版本

``` bash
$ node -v
v6.2.2
```

然后安装 Hexo 到全局空间

``` bash
$ npm install hexo-cli -g
```
如果你没有听说或 cnpm 可以 [点击这里](http://npm.taobao.org/) 了解一下墙内的 npm 加速.

### 3.2 初始化 Hexo 项目目录

在 bash 内切换到你准备在本地保存博客文档 ( markdown ) 的目录.

``` bash
$ cd /d/www/blog # 本人在 windows 环境下使用 node
```

在执行以下代码前__请尽量确保您正在科学上网__, 否则会让您苦等甚至觉得它卡死了.

``` bash
$ hexo init
```
这里首先会以 git 方式下载 Hexo 所依赖的程序, 如果您电脑内还没有安装 git 或下载速度过慢, 它会自动切换到 npm 方式下载依赖程序.

> 第二种方式似乎会绕过 cnpm 源进行下载, 所以尽量科学上网.

### 3.3 创建一个文章

在 Hexo 中文章叫做 post, 我们新建一个示例文章.

``` bash
$ hexo new "my first article"
```
_我们第一篇文章名字不起 `Hello world!` 的原因是 Hexo 自带了一篇示例文章, 就叫做 `Hello world!` [滑稽][滑稽] _

这条命令执行完之后就新建了一个空白的文章, 它放在 `./source/_posts/my-first-article.md` 了, 你可以用喜欢的编辑器来写它, 它是 Markdown 标准的文档, 随后会被 Hexo 渲染成 html 形式显示在网页上.

### 3.4 渲染这篇文章

``` bash
$ hexo generate # 这条命令的缩写是 'hexo g' , 它们的效果是一样的.
```

然后你就可以在 `./public/` 找到这篇文章的 html 源码了, 但是你现在还不能够直接打开它, 因为它需要服务器的支持.

### 3.5 启动 Hexo 内置服务器

如果您的机器上有其他的服务器软件, 可以将虚拟目录指向这个项目, 然后运行. 如果您没有服务器软件, 则可以使用 Hexo 内置的临时服务器进行预览.

``` bash
$ hexo server # 这条命令的缩写是 'hexo s'
```
> `hexo server` 命令默认启动 4000 端口, 您可以使用参数 `-p xxxx` 来指定一个端口号.

然后您就可以在浏览器中输入 `localhost:4000` 查看您的博客啦.

> 使服务器停止运行可以使用快捷键 `ctrl + c`

### 3.6 关于 Hexo 的更多内容

你可以在 [Hexo 官方文档 ( 简体中文 ) ](https://hexo.io/zh-cn/docs/index.html) 中查看详细的使用说明.

## 4 将 Hexo 绑定到 github

### 4.1 在 Hexo 中填写 GitHub Pages 地址

打开项目根目录下 `./_config.yml` 文件, 找到下面这一行

``` yaml
deploy:
  type:
```

将 type 的值改为以下内容, 其中 repo 填你的 GitHub Pages 项目地址, branch 填 master.

> 在 GitHub Pages 中, 如果你需要将代码渲染为页面, 只能在 master 分支中放置代码.

``` yaml
deploy:
  type: git
  repo: https://github.com/mutoe/mutoe.github.io.git # 这里改为你自己的 GitHub Pages 地址
  branch: master
```

### 4.2 将编译好的文件发布到 GitHub Pages 代码库中

``` bash
$ hexo deploy # 这条命令的缩写是 'hexo d'
```
在这过程中可能会提示您输入 github 帐号密码, 按提示输入即可.

### 4.3 访问 GitHub Pages

接下来在浏览器中输入您的 GitHub Pages 地址就可以看到用 Hexo 搭建好的个人博客啦.

----

## 拓展阅读

* [Hexo 官方文档 ( 简体中文 ) ](https://hexo.io/zh-cn/docs/index.html)
* {% post_link github-pages-custom-domain '将 GitHub Pages 绑定到自己的域名' %}
* {% post_link hexo-post-livereload-edit 'Hexo 实现实时预览编辑' %}
