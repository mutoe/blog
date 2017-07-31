---
title: vi & vim 学习笔记
date: 2017-07-31 13:24:09
categories: 笔记
tags:
 - Vim
 - Linux
---

# Vi / Vim 版本的选择

Vim 是 Vi 的升级版本，比 Vi 多了语法高亮等更多特性。就版本而言，软件的新版本往往会修正旧版的一些缺陷和不足，所以说能用新版本尽量使用最新版本。

# 启动 / 关闭 Vim

## 启动

`vim <file>` 使用 Vim 打开某文件

## 退出

`:q!` 抛弃修改并退出
`ZQ` (alias)

`:wq` 保存并退出
`ZZ` (alias)

## 挂起

### 通过 Vim 命令

`:!{cmd}` 用来执行某一条 shell 命令。如 `:!cat database.conf`

`:sh` 进入 shell 环境。执行结束需要返回 Vim 编辑环境时，输入 `exit` 或按下 `ctrl + d` 即可。

### 通过 Shell 命令

利用 Linux 作业机制，按下 `ctrl + z` 将当前程序放在后台执行。然后使用 `fg` 命令重新回到 Vim 编辑器。
详情参考[Unix或Linux中&、jobs、fg、bg等命令的使用方法](http://blog.sina.com.cn/s/blog_673ee2b50100iywr.html)
