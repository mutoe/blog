---
title: Chrome 浏览器的一些使用小技巧
keywords: [chrome, 谷歌浏览器, 浏览器, 技巧, 插件, 默认搜索引擎]

date: 2017-07-18 14:16:01
categories: 心得
tags:
 - Browser
 - Chrome
---

# 使用技巧

现在的互联网都鼓励大家使用 Chrome 浏览器，它很强大，本身简洁，支持非常多的插件。但正因如此，大家都比较懒不愿意去花时间学习适应一个新的产品去打造适合自己的浏览器，所以我在这里写下一些使用 Chrome 浏览器的小技巧供大家参考学习。

## 搜索引擎相关

相信不少朋友不愿意使用 chrome 浏览器是因为它默认的搜索引擎是 google，而对于国内环境来说，普通用户不使用特别手段是上不了 google.com 的，所以你在地址栏输入向搜索的关键词时会跳转到 google 导致无法显示，从而必须先进入到 baidu.com 然后再进行搜索。

### 修改默认搜索引擎

那有没有简单的方法能够将 chrome 浏览器的默认搜索引擎切换为百度呢？当然有。

进入设置页面，找到 `搜索引擎` 一栏，将默认搜索引擎切换为百度即可

![switch-search-engine](//static.mutoe.com/2017/chrome-uses-tips/switch-search-engine.png)

### 快捷切换搜索引擎

学到了上面的方法你还不满足，我想在多个搜索引擎中自由切换，比如搜技术类作品用 github，搜视频用 bilibili，搜百科用 wikipedia，搜地名用 map.baidu.com。

按照一般思路，搜百科用 wikipedia 的话要先去 `zh.wikipedia.org`，然后在该站点的搜索栏中键入要查询的关键字，总共两个步骤。

那我现在教你一个快捷的方法：直接在地址栏键入 wikipedia，然后按下 `tab` 键，会发现地址栏变成这样：（不过要保证你之前用过 wikipedia 的搜索功能）

<!-- more -->

![wiki-search](//static.mutoe.com/2017/chrome-uses-tips/wiki-search.png)

然后直接输入你要搜索的关键词如 `博客`，然后按下回车就能直接跳到 wikipedia 的搜索结果页啦。

![quick-switch](//static.mutoe.com/2017/chrome-uses-tips/quick-switch.png)

> __为什么我按下 `tab` 键地址栏没有变成你那样呢？__

> 这是因为你的 chrome 没有检测到这个网站的搜索引擎，你也可以手动添加。
> 在 `搜索引擎` 设置一览，找到 `管理搜索引擎`，然后在 `其他搜索引擎` 标签的右侧找到 `添加` 按钮。
> ![add-custom-search-engine](//static.mutoe.com/2017/chrome-uses-tips/add-custom-search-engine.png)
> 然后在弹出的窗口中输入你想添加的搜索引擎
> ![add-custom-dialog](//static.mutoe.com/2017/chrome-uses-tips/add-custom-dialog.png)

只要你想，只要那个网站支持，什么都可以直接搜。更爽的是，只要你用过某个网站的搜索功能，他就会自动的收录在 `其他搜索引擎` 的列表中而不用你去一个个手动添加。

我在这里列举出了一些常用的搜索引擎，如果你有需要可以按照上面的方式自行添加。

- 百度 `https://www.baidu.com/#ie={inputEncoding}&wd=%s`
- 天猫 `http://list.tmall.com/search_product.htm?q=%s`
- 京东 `http://search.jd.com/Search?keyword=%s&enc=utf-8`
- bilibili `http://www.bilibili.tv/search?keyword=%s`
- 微博 `http://s.weibo.com/weibo/%s`
- google 翻译 `http://translate.google.cn/?source=osdd#auto|auto|%s`
- 知乎 `http://www.zhihu.com/search?q=%s`
- 熊猫 TV `http://www.panda.tv/search?kw=%s`
- github `https://github.com/search?q=%s`
- 百度贴吧 `http://tieba.baidu.com/f?kw=%s`
- 阮一峰的博客 `http://www.ruanyifeng.com/blog/search.html?q=%s`

# 插件推荐

( 未完占坑 )

## 增强易用性

### 广告拦截器 uBlock Origin
### 油猴脚本 Tampermonkey
### 暂存标签
### 代理快速切换 SwitchyOmega
### 一键分屏 Tab Resize

## 开发者工具

### 格式化工具 JSON Viewer
### Vue 开发者工具 Vue Devtools
### LiveReload

### 写在最后

如果你有其他的小技巧或插件，也可以 [联系我](mailto:mutoe@foxmail.com) 或去 [这个文章的 github](https://github.com/mutoe/mutoe.github.io/blob/source/source/_posts/chrome-users-tips.md) 点击右上角的编辑, 提交 `pull request` 来参与编辑这篇文章，我会将补充上的内容注明你的名字，共同分享学习。
