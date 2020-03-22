---
title: nginx 学习笔记
date: 2018-03-24 07:35:44
categories: 笔记
tags:
  - Nginx
  - Server
---

# 前言

这里是一篇个人学习使用 Nginx 服务器时遇到的一些常见问题以及资料的集合. 用来在日后的操作中做一个 QA 索引. 如果它也能帮到你就再好不过了.

<!-- more -->

## 开启 gzip

网站的 css, js, xml, html 在传输的时候可以使用 gzip 压缩，提高访问速度.

``` conf
;
gzip on;  // 开启 gzip 压缩
gzip_comp_level 5;  // 压缩级别，可以是 0-9 中的任一个，级别越高，压缩就越小.
gzip_min_length 200;  //这里表示如果文件小于200个字节，就不用压缩，因为没有意义，本来就很小
gzip_types text/css text/xml application/javascript;  // 这里表示哪些类型的文件要压缩，text/html类型是默认的不需要写，如果不知道文件有哪些类型，可以在nginx目录中找到文件类型，/var/mywww/nginx/conf/mime.types 文件中记录了所有可以压缩的文件类型
gzip_vary on; // 可以不写，表示我在传送数据时，给客户端说明我使用了gzip压缩
```
