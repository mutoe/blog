---
title: 在 Hexo 中方便的使用插图
date: 2016-12-16 20:11:57
update: 2017-04-01 20:43:18
categories: 教程
tags:
 - Hexo
---

## 如何在 Hexo 中使用插图

我们编辑文章时或有或无的需要佐上那么几张图片来表达自己的想法,  Hexo 中编辑文章的方式是直接写 Markdown 文件, 又没有直接上传图片的接口, 以下是博主从网上收集来的一些 Hexo 中引用图片的办法合集.

<!-- more -->

### 办法1 直接使用 Markdown 提供的引用方法

在 `./source/images/` 目录下放置图片, 在 Markdown 中这样写

``` md
{% asset_img /images/example.png example %}
```
这种方法很方便, 配合 livereload 或 browsersync 插件无论是在本地还是在线上都能看到效果, 但是如果您是用的 Markdown 编辑器, 这似乎就有些难受了, 因为在 Markdown 编辑器中是无法识别这样的图片路径的.

所以对图片的支持程度较差, 您放在 source_dir 下的图片引用后不会正确的显示在本地调试环境或线上, 二者只能取其一, 感觉很难受.

### 办法2 使用在线图片存储服务.

引用图片时, 将图片先上传到一个另外的服务器上, 得到该图片的在线地址, 然后在 Markdown 中引用.

国内外用户/服务商有很多提供类似图床或对象存储的服务, 即外链.

* [Gimhoy图床](http://pic.gimhoy.com/)
* [极简图床](http://yotuku.cn/)
* [七牛](http://www.qiniu.com/)
* ~~[微博是个好图床](http://weibotuchuang.sinaapp.com/bookmark.html) ( 2016.12.16 已挂 )~~

这些在线图片存储服务使用便捷, 还自带 CDN 加速功能, 但缺点也很明显了, 图片存在别人服务器里面说不定哪天图就挂了, 总觉得不太放心.

### 办法3 使用 Hexo-asset-image 插件

__2017年4月1日 在这个插件更新前 (当前版本 v0.0.3) , 不推荐使用这个插件.
原因是使用该插件后导致编译出的 html 文件中文字符会被转化为 unicode 编码, 不利于站内搜索和 SEO 优化.
你可以直接跳到办法4__

``` bash
npm install hexo-asset-image --save
```
_非官方插件, 该插件由 CodeFalling 维护, 底部有项目地址_

安装该插件后在您项目根目录的 `./_config.yml` 中寻找到下面这一行, 将 `post_asset_folder` 的值设置为 `true`.

``` yml
post_asset_folder: true
```
该设置会在您使用 `hexo new "new post"` 时在文章所在目录下生成一个同名文件夹, 您只需将图片放入该文件夹, 然后在需要放置图片的位置写入以下代码即可解决 办法1 出现的问题.

``` md
{% asset_img example.png example %}
```

### 办法4 使用官方提供的办法

2017年4月1日更新

该方法类似办法3, 只是使用图片的方法由原生的 `![]()` 改为 Hexo 标签插件.

首先在您项目根目录的 `./_config.yml` 中寻找到下面这一行, 将 `post_asset_folder` 的值设置为 `true`. 原因办法3中已经介绍, 这里不再阐述.

然后在需要引用图片的地方写入以下代码即可

``` swig
{% asset_img example.jpg this is title %}
```

如果你之前使用了 `hexo-asset-image` 插件的办法, 你可以使用我写的正则表达式一键替换.

查找
``` markdown
!\[([\S ]+)\]\((\S+)\)
```
替换为
``` swig
{% asset_img $2 $1 %}
```

配合我的另一篇文章 [实时预览](//blog.mutoe.com/2016/hexo-post-livereload-edit/) , 写文章简直美滋滋.

### 小结

三种解决办法各有优劣, 博主做个简单的小结.

| -		| 优点 | 缺点 |
| ----- | ---- | ---- |
| 1 直接使用 Markdown 引用方法 | 图片资源统一存放, 便于管理 | 实时预览时排版效果不好 |
| 2 使用在线图片存储服务 | 方便移植, 不占用本地空间 | 使用不稳定, 不便于管理 |
| 3 使用 Hexo-asset-image 插件 | 文件结构更有条理 | 对中文支持不友好 |
| 4 使用官方提供的办法 | 官方支持 | 不适用原生 md 语法 |

您可以根据自己的实际情况来进行选择, 不能说哪个办法是最好的, 但肯定有一个最适合您的.

## 参考文章

* [在 Hexo 中无痛使用本地图片](http://codefalling.com/2015/12/19/no-pains-with-hexo-local-image/) -- codefalling ( 原文似乎挂了 [推酷快照](http://www.tuicool.com/articles/umEBVfI) )
* https://github.com/CodeFalling/hexo-asset-image
* [CodeFalling/hexo-asset-image#12 中文编码问题](https://github.com/CodeFalling/hexo-asset-image/issues/12)
* [资源文件夹 | hexo.io](https://hexo.io/zh-cn/docs/asset-folders.html)