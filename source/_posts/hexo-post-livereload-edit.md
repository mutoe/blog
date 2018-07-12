---
title: Hexo 实现实时预览编辑
keywords: [hexo, 技巧, 实时预览]

date: 2016-12-16 00:43:39
categories: 心得
tags:
 - Hexo
---

在用了一段时间 Hexo 后, 发现写 Hexo 文章时需要到在线的 Markdown 编辑器中实时预览, 感觉还是有些不方便.

找到官方文档, 在服务器部分有这样一段话
> 安装完成后，输入以下命令以启动服务器，您的网站会在 http://localhost:4000 下启动。在服务器启动期间，Hexo 会监视文件变动并自动更新，您无须重启服务器。
  ``` bash
  $ hexo server
  ```

片子, 根本没有自动更新( 可能是我姿势不对? ).

<!-- more -->

期间根据知乎 [_@leeon_](https://www.zhihu.com/question/27384681/answer/87037317) 同学的建议, 在 sublime text 和 Chrome 上安装 livereload 插件, 配合 `hexo s -g` 命令来实时编辑, 思路很棒, 也有用户实验成功, 但我怎么试都不成功, 可能是 hexo 版本的问题.

在网上一番寻找之后, 发现了一个插件: [hexo-browsersync](https://github.com/hexojs/hexo-browsersync/), 这是一个移植插件, 项目主页上基本没有过多的介绍. 下面写一些我自己使用的心得吧.

## Hexo-Browsersync 使用方法

首先在项目目录下安装 `hexo-browsersync` 插件

``` bash
$ cd hexo_project/
$ npm install hexo-browsersync --save
```

然后运行 hexo server, 看到以下内容就说明启动成功啦.

``` bash
$ hexo s
[BS] Access URLs:
 --------------------------------------
          UI: http://localhost:3001
 --------------------------------------
 UI External: http://192.168.191.1:3001
 --------------------------------------
INFO  Start processing
INFO  Hexo is running at http://localhost:4000/. Press Ctrl+C to stop.
```

其中 3001 端口是 browsersync 的配置页面, 4000 端口就是我们的调试页面了.

## 参考文章

* [Hexo Server 的一个迷の bug](https://yq.aliyun.com/articles/3060) -- 潘佳邦
* https://github.com/hexojs/hexo-browsersync/issues/12
