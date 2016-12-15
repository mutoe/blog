---
title: 将 GitHub Pages 绑定到自己的域名
date: 2016-12-15 20:28:49
tags:
 - GitHub Pages
---

### 准备工作

* 一个域名
* 一个创建好 GitHub Pages 的项目

### 1 解析域名

登录到你购买域名的服务商, 找到解析入口, 这里我以万网提供的解析为例

![analysis](analysis.png)

添加一条 CNAME 记录, 将您的 www 或自己定义的子域名解析到您的 GitHub Pages 上.

![cname](cname.png)

> 如果您打算直接用 `www.xxx.com` 或 `xxx.com` 作为您的博客地址, 那么就分别创建主机记录为 www 和 @ 的记录指向到你的 GitHub Pages 上.

### 2 配置 GitHub Pages 项目

在你项目的 "Setting" 页面中找到 "GitHub Pages" 子栏目, 在 "Custom domain" 中填上你刚才设置好的解析地址.

![custom domain](custom-domain.png)

稍等片刻, 你就可以访问这个域名了.
但是接下来还有一步要做的工作, 就是在这个项目下创建一个 CNAME 文件, 来保证以后生成的静态页面下都含有该文件, 避免出现无法解析的情况.

### 3 创建 CNAME 文件

打开你本地保存项目的目录, 找到 `./source/` , 在该目录下创建一个文件, 文件名为 `CNAME`, 注意没有后缀, 文件内容就是你的域名.

![cname file](cname-file.png)

保存后使用 hexo 生成并发布就可以啦.

``` bash
$ hexo g -d # -d 参数用来在生成静态文件时同时发布
```
