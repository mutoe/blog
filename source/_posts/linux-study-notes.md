---
title: linux 学习笔记
date: 2017-08-01 12:30:09
update: 2018-03-23 21:23:21
categories: 笔记
tags:
  - Linux
---


# 前言

这里是一篇个人学习使用 Linux 操作系统时遇到的一些常见问题以及资料的集合. 用来在日后的操作中做一个 QA 索引. 如果它也能帮到你就再好不过了.

<!-- more -->

# 命令

## 别名

在使用 yum 安装 remi 源的 php7 时，需要执行 `yum install php70`，安装完成后执行 php cli 的命令为 `php70 -v`，比较不方便，这时可以使用 alias 给 `php70` 设置一个别名。

执行以下命令

``` bash
alias php='php70'
```

注意等号前后不可以有空格，否则会报错。

# 文件

## 目录

### `mkdir` 创建目录

- `-m [prop]` 目标属性, 目录权限.
- `-p` 递归创建, 如果目标目录上级目录不存在, 则创建.

# 进程

## 挂起与恢复

| 快捷键 | 作用 |
| ---    | :--- |
| ctrl-c | 发送中断信号强制中断前台进程
| ctrl-z | 发送挂起信号挂起一个前台进程，挂起后使用 `fg` / `bg` 恢复进程
| ctrl-d | 模拟输入 `.exit` 退出当前进程

## 开机启动

| 命令 | 作用 |
| ---  | :--- |
| `chkconfig [service]` | 查看某个 service 是否在开机启动状态 |
| `chkconfig [service] on` | 允许开机启动某个 service |
| `chkconfig [service] off` | 禁止开机启动某个 service |

# 安全

## 创建新用户

| 命令 | 作用 |
| ---  | :--- |
| `adduser` | 自动创建新用户 |
| `useradd` | 需要使用参数选项创建新用户 |

### `adduser` 自动创建新用户

会自动为创建的用户指定主目录、系统shell版本，会在创建时输入用户密码。

### `useradd` 自定义创建新用户

需要使用参数选项指定上述基本设置，如果不使用任何参数，则创建的用户无密码、无主目录、没有指定shell版本。

- `-d [path]` 为其设置主目录.
- `-g [gid|groupname]` 为其指定一个主用户组. 可以接组 ID 或组名称
- `-G [gid|groupname,...]` 为其指定一个附加用户组. 可以用逗号分隔开(不要加空格).
- `-m` 如果主目录不存在则创建; 存在则不再创建, 并且这个目录不属于新用户.
- `-M` 不创建主目录.
- `-N` 不为用户创建一个同名的用户组.
- `-s [shell]` 指定用户登陆的 shell 版本
- `-u [uid]` 指定用户 uid

example.
``` bash
sudo user add -d "/home/xxx" -m -s "/bin/bash"
```

> `useradd` 命令是有默认值的, 其值与 `/etc/default/useradd` 中的内容相同.

## 将用户添加进一个用户组中

| 命令 | 作用 |
| ---  | :--- |
| `groupadd` | 创建一个用户组 |
| `usermod` | 更改用户信息 |

### `usermod` 创建一个用户组

参考 `useradd`

- `-a` 配合 `-G` 使用, 附加用户组.
- `-l [username]` 修改用户名.
- `-L` 锁定用户密码, 使密码无效.
- `-U` 解除密码锁定.

## 为普通用户添加 root 权限

### 1. 切换到 root 用户下

### 2. 添加 sudo 文件的写权限

``` bash
chmod u+w /etc/sudoers
```

### 3. 编辑 sudoers 文件

``` bash
vim /etc/sudoers
```
找到这行 `root ALL=(ALL) ALL`, 在它下面添加一行, 将 root 替换为你的用户名

> 你可以sudoers添加下面四行中任意一条
> ```
> youuser            ALL=(ALL)                ALL
> %youuser           ALL=(ALL)                ALL
> youuser            ALL=(ALL)                NOPASSWD: ALL
> %youuser           ALL=(ALL)                NOPASSWD: ALL
> ```
> 第一行:允许用户youuser执行sudo命令(需要输入密码).  
> 第二行:允许用户组youuser里面的用户执行sudo命令(需要输入密码).  
> 第三行:允许用户youuser执行sudo命令,并且在执行的时候不输入密码.  
> 第四行:允许用户组youuser里面的用户执行sudo命令,并且在执行的时候不输入密码.  

### 4. 撤销 sudo 文件的写权限

``` bash
chmod u-w /etc/sudoers
```

## 允许用户使用密钥登陆

### 新密钥对登陆

``` bash
su username # 切换到普通用户
cd ~ # 进入 home 目录
ssh-keygen -r rsa # 创建密钥对, 一路回车即可
cd .ssh # 进入 .ssh 目录
mv id_rsa.pub authorized_keys # 将公钥重命名
```

然后将 id_rsa 下载到主机, 并且使用它登陆即可

### 使用已有密钥对

``` bash
su username
cd ~
mkdir -m 700 .ssh # 创建 .ssh 目录
cd .ssh
# 将 id_rsa.pub 放入此目录
mv id_rsa.pub authorized_keys
chmod 644 authorized_keys
```

# 文件与目录

## 文件内容查阅

| 命令 | 作用 |
| ---  | :--- |
| `cat` | 由第一行开始显示文件内容 |
| `tac` | 由最后一行开始显示文件内容 |
| `nl` | 输出行号显示 |
| `more` | 逐页显示内容 |
| `less` | 逐页显示内容还可以向上翻页 |
| `head` | 输出头部若干行 |
| `tail` | 输出尾部若干行 |
| `od` | 以二进制输出文件内容 |

### `cat` 由第一行开始显示文件内容

- `-n` 列出行号，包括空行

### `less` 分页显示文件内容

| 按键 | 作用 |
| ---    | :--- |
| space | 向下翻一页 |
| pagedown | 向下翻一页 |
| pageup | 向上翻一页 |
| /[字符串] | 向下查询 [字符串] |
| ?[字符串] | 向上查询 [字符串] |
| n | 向下重复一次查询 |
| N | 向上重复一次查询 |
| q | 离开 less |

### `tail` 显示文件尾部内容

- `-n` 接数字，显示多少行
- `-f` 持续检测文件尾部变动，按下 ctrl-c 结束检测

> 参考资料

> - 《鸟哥的 Linux 私房菜》 - 鸟哥
