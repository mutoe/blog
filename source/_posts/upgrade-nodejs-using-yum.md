---
title: 记使用 yum 升级 nodejs 遇到的坑
keywords: [yum, nodejs, centos, 升级失败, 缓存]

date: 2018-07-11 22:36:41
categories: 心得
tags:
  - NodeJS
  - Yum
---

> tips: 解决办法在文章底部，请使用右侧导航直接跳转到 **解决办法**

## 问题描述

最近在使用 centos 7 时需要升级到 nodejs 10 版本，直接执行 `yum update nodejs` 发现 yum 源里还是 6.x，并且提示已经是最新版本了。。

？？什么鬼，去 nodesource 查看原来需要将 nodesource 源升级一下，so，执行以下命令

``` bash
curl -sL https://rpm.nodesource.com/setup_10.x | bash -
yum upgrade nodejs
```

竟然发现还是 6.x 版本

```
====================================================================================================================
 Package               Arch                  Version                                Repository                 Size
====================================================================================================================
Installing:
 nodejs                x86_64                2:6.11.2-1nodesource                   nodesource                 17 M

Transaction Summary
====================================================================================================================
```

咦？难道是需要将 node 先卸载了吗？于是 `yum remove nodejs` 然后 `yum install nodejs`。。。然后是你猜到的结果，还还还还是 6.x 版本。。。

<!-- more -->

随后猜测可能是之前安装的 nodejs 6.x 版本的 nodesource 源，于是在网上查找了资料想办法删除之前的旧版 nodesource 源，执行以下命令

``` bash
cd /etc/yum.repos.d/
# 然后删除所有以 node 开头的 repo 文件，下一行可能与你的不同
rm -f nodesource-el7.repo
yum clean all # 清空 yum 缓存
curl -sL https://rpm.nodesource.com/setup_10.x | bash -
yum install nodejs
```

然后重新安装 nodejs，依旧不行。问题出在哪里呢？甚至开始怀疑是机器的问题。。

过了几天回到这个问题，又查找了不少资料, 根据
[nodesource/distributions#340](https://github.com/nodesource/distributions/issues/340#issuecomment-251417163) _(真是为难我这个英语渣了)_ 中的一个回答，发现 `yum clean all` 时，可能并不会清除 repo 不存在的缓存文件，并提供了一行代码来手动清除 yum 缓存

``` bash
rm -rf /var/cache/yum/*
```

随后安装最新版的 nodesource 源，安装 nodejs，于是

```
====================================================================================================================
 Package               Arch                  Version                                Repository                 Size
====================================================================================================================
Installing:
 nodejs                x86_64                2:10.6.0-1nodesource                   nodesource                 17 M

Transaction Summary
====================================================================================================================
```

🎉 成功了！怀着激动的心情解决了问题并写下这篇心得，希望能帮到大家，最后总结一下

## 解决办法

**无需删除旧版本的 nodejs，该问题只与 yum 缓存有关**

``` bash
# 以下命令请均以 sudo 权限执行

yum clean all # 清空 yum 缓存
rm -rf /var/cache/yum/* # 手动删除所有 yum 缓存
cd /etc/yum.repos.d/
ls
# 请结合实际情况删除所有以 node 开头的 repo 文件
rm -f nodesource-el.repo # 移除旧的 nodesource 源
curl -sL https://rpm.nodesource.com/setup_10.x | bash - # 安装 nodesource 源
yum update nodejs # 升级到最新版本
```
