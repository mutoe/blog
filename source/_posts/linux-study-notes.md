---
title: Linux 学习笔记

date: 2017-08-01 12:30:09
update: 2021-03-22 22:20:32
categories: 笔记
tags:
  - Linux
---

# 前言

这里是一篇个人学习使用 Linux 操作系统时遇到的一些常见问题以及资料的集合. 用来在日后的操作中做一个 QA 索引. 如果它也能帮到你就再好不过了.

<!-- more -->

# 命令

## 快捷键

在 Linux 命令行中有一些快捷键可供方便的敲出命令

| 光标移动            | 作用                         |
| ------------------- | ---------------------------- |
| `Ctrl-b` / `Ctrl-f` | 将光标移向左/右移动一位      |
| `M-b` / `M-f`       | 将光标移向左/右移动一个词    |
| `Ctrl-a` / `Ctrl-e` | 将光标移到行首/尾            |
| `Ctrl-xx`           | 光标在当前位置与行尾之前切换 |

| 编辑                | 作用                         |
| ------------------- | ---------------------------- |
| `Ctrl-h` / `Ctrl-d` | 剪切光标前/后的字符          |
| `Ctrl-t`            | 交换当前字符与前一个字符     |
| `Ctrl-w` / `Alt-d`  | 剪切光标位置到词首/尾        |
| `Ctrl-k`            | 剪切到行尾                   |
| `Ctrl-u`            | 剪切整行                     |
| `Ctrl-y`            | 粘贴上述命令删除的内容       |
| `Alt-.`             | 使用上一条命令的最后一个参数 |
| `Ctrl-_`            | 撤销                         |

| 历史命令           | 作用                                             |
| ------------------ | ------------------------------------------------ |
| `Ctrl-p` `⬆`       | 回溯上一个命令                                   |
| `Ctrl-n` `⬇`       | 回溯下一个命令                                   |
| `Ctrl-r`/ `Ctrl-g` | 查找历史命令 / 退出查找                          |
| `!!`               | 执行上一条命令                                   |
| `!wget`            | 执行最近一条以 wget 开头的命令                   |
| `!wget:p`          | dry-run (打印最近一条以 wget 开头的命令, 不执行) |
| `!*`               | 输入上一条命令的所有参数                         |
| `^abc`             | 删除上一条命令的 abc                             |
| `!-n`              | 执行前 n 条命令                                  |

| 控制命令            | 作用                         |
| ------------------- | ---------------------------- |
| `Ctrl-l`            | 清空屏幕上的内容             |
| `Ctrl-o`            | 执行当前命令并选择上一条命令 |
| `Ctrl-s` / `Ctrl-q` | 阻止/允许屏幕输出            |
| `Ctrl-c` / `Ctrl-z` | 中止/挂起进程                |

> - macOS 下 `Alt` 键对应 <kbd>Option</kbd>；如果按出特殊字符则需要关闭相应的特殊字符输出设定，参考 [Mac 禁用 options 特殊字符](https://juejin.cn/post/6844903709152018439)
> - `M-b` 为按住 <kbd>Esc</kbd> 再按 <kbd>b</kbd>

## 别名

在使用 yum 安装 remi 源的 php7 时，需要执行 `yum install php70`，安装完成后执行 php cli 的命令为 `php70 -v`，比较不方便，这时可以使用 alias 给 `php70` 设置一个别名。

执行以下命令

```bash
alias php=`php70`
```

注意等号前后不可以有空格，否则会报错。

# 进程

## 挂起与恢复

| 快捷键 | 作用                                                          |
| ------ | :------------------------------------------------------------ |
| ctrl-c | 发送中断信号强制中断前台进程                                  |
| ctrl-z | 发送挂起信号挂起一个前台进程，挂起后使用 `fg` / `bg` 恢复进程 |
| ctrl-d | 模拟输入 `.exit` 退出当前进程                                 |

## 开机启动

| 命令                      | 作用                                |
| ------------------------- | :---------------------------------- |
| `chkconfig [service]`     | 查看某个 service 是否在开机启动状态 |
| `chkconfig [service] on`  | 允许开机启动某个 service            |
| `chkconfig [service] off` | 禁止开机启动某个 service            |

# 安全

## 创建新用户

| 命令      | 作用                       |
| --------- | :------------------------- |
| `adduser` | 自动创建新用户             |
| `useradd` | 需要使用参数选项创建新用户 |

### `adduser` 自动创建新用户

会自动为创建的用户指定主目录、系统 shell 版本.

### `useradd` 自定义创建新用户

需要使用参数选项指定上述基本设置，如果不使用任何参数，则创建的用户无密码、无主目录、没有指定 shell 版本。

- `-d [path]` 为其设置主目录.
- `-g [gid|groupname]` 为其指定一个主用户组. 可以接组 ID 或组名称
- `-G [gid|groupname,...]` 为其指定一个附加用户组. 可以用逗号分隔开(不要加空格).
- `-m` 如果主目录不存在则创建; 存在则不再创建, 并且这个目录不属于新用户.
- `-M` 不创建主目录.
- `-N` 不为用户创建一个同名的用户组.
- `-s [shell]` 指定用户登陆的 shell 版本
- `-u [uid]` 指定用户 uid

example.

```bash
sudo user add -d "/home/xxx" -m -s "/bin/bash"
```

> `useradd` 命令是有默认值的, 其值与 `/etc/default/useradd` 中的内容相同.

## 指定用户密码

```bash
# 设置当前用户的密码
passwd
# 设置任意用户的密码
passwd your_username       # 在 root 用户时
sudo passwd your_username  # 在普通用户时
```

> 安全起见，请不要使用弱密码。最好使用 1password, BitWarden 或其他密码管理器来管理此密码，然后为其设置密钥登陆。

## 将用户添加进一个用户组中

| 命令       | 作用           |
| ---------- | :------------- |
| `groupadd` | 创建一个用户组 |
| `usermod`  | 更改用户信息   |

### `usermod` 创建一个用户组

参考 `useradd`

- `-a` 配合 `-G` 使用, 附加用户组.
- `-l [username]` 修改用户名.
- `-L` 锁定用户密码, 使密码无效.
- `-U` 解除密码锁定.

## 为普通用户添加 root 权限

编辑 sudoers 文件

```bash
sudo vim /etc/sudoers
```

找到这行 `root ALL=(ALL) ALL`, 在它下面添加一行, 将 root 替换为你的用户名

> 你可以 sudoers 添加下面四行中任意一条
>
> ```
> youuser            ALL=(ALL)                ALL
> %youuser           ALL=(ALL)                ALL
> youuser            ALL=(ALL)                NOPASSWD: ALL
> %youuser           ALL=(ALL)                NOPASSWD: ALL
> ```
>
> 第一行:允许用户 youuser 执行 sudo 命令(需要输入密码).  
> 第二行:允许用户组 youuser 里面的用户执行 sudo 命令(需要输入密码).  
> 第三行:允许用户 youuser 执行 sudo 命令,并且在执行的时候不输入密码.  
> 第四行:允许用户组 youuser 里面的用户执行 sudo 命令,并且在执行的时候不输入密码.

然后使用 `:wq!` 保存

## 允许用户使用密钥登陆

### 新密钥对登陆

在客户端上执行以下命令创建密钥对

```bash
su username # 切换到普通用户
cd ~ # 进入 home 目录
ssh-keygen -r rsa # 创建密钥对, 一路回车即可
```

现在你就拥有了一堆密钥对

### 使用已有密钥对登陆远端主机

将 `id_rsa.pub` 上传到主机, 并且使用它登陆即可

```bash
# 将 id_rsa 上传到远端服务器（host改成你服务器的ip或域名，remoteuser改成你自己的用户名）
ssh-copy-id remoteuser@host

# 使用刚上传的密钥对的私钥登陆远端服务器
ssh remoteuser@host -i $HOME/.ssh/id_rsa
```

你也可以配置 ssh config 以避免每次使用 ssh 登陆时都需要指定私钥

```config ~/.ssh/config
Host *
  # 对所有主机使用以下配置
  IdentityFile ~/.ssh/id_rsa  # 指定登陆使用的密钥文件
  ServerAliveInterval 60      # 每 60s 向服务器发送一次心跳，避免长时间无响应被服务器强制断开连接

Host customname # customname 可以随意指定，用于后续登陆
  HostName host # host 改成自己的主机ip或域名
  Port 22
  User root     # 如果你使用的不是 root 用户，改成自己的用户名

```

如果登陆失败，需要检查一下你的 `.ssh` 目录和 `.ssh/id_rsa` 私钥文件的权限 (将 `.ssh` 目录设置为 `700`, 将私钥设置为 `644`)

```bash
❯ ls -al
total 56
drwx------   9 user   staff   288 Jul 21 09:48 .
-rw-r--r--   1 user   staff   475 Jun 25 10:55 config
-rw-------   1 user   staff  2610 Mar 19 01:23 id_rsa
-rw-r--r--   1 user   staff   578 Mar 19 01:23 id_rsa.pub
-rw-------   1 user   staff  1534 Jul 19 16:14 known_hosts
```

# 文件与目录

## 目录

### `mkdir` 创建目录

- `-m [prop]` 目标属性, 目录权限.
- `-p` 递归创建, 如果目标目录上级目录不存在, 则创建.

### `setfacl` `getfacl` 为文件或目录添加多个用户(组)

- `setfacl -m g:group:rwx path` 为 path 添加 group 用户组
- `setfacl -m u:user:rwx path` 为 path 添加 user 用户
- `setfacl -x g:group path` 为 path 移除 group 用户组
- `setfacl -x u:user path` 为 path 移除 user 用户
- `getfacl path` 查看 path 的所有权限

## 文件操作

### 复制文件

`cp` 复制文件

- `-r` 递归复制, 复制目录时使用此参数

- `cp foo.txt foo_copy.txt`
- `cp -r folder copied_folder`

### 移动文件

`mv` 移动文件或目录

- `mv file1.txt file2.txt`
- `mv folder1 folder2`

[comment]: <> (TODO: 末尾带 / 与否影响结果)

### 重命名

使用 `mv` 亦可进行重命名操作，如果想使用高级用法，可以使用 `rename` 命令 

`rename` 批量重命名

`rename [options] oldname newname file`  
`rename [options] "s/oldname/newname/" file`

- `-v` verbose 输出详细信息
- `-n` `--no-act` 预览输出而不进行实际操作
- `-o` `--no-overwrite` 不覆盖已存在的文件
- `-s` `--symlink` 同时作用于 symlink

其中 `file` 可支持 `?` `*` 通配符， 当指定为 `*` 时表示匹配当前目录下所有文件

替换命令支持 perl 正则表达式, 匹配捕获组时使用 `\1` 来保留捕获组

例如当前目录下有 `foo1` `foo2` ... `foo200`, 我们想将其重命名为 `text_1.txt` `text_2.txt` ... `text_200.txt` 可以使用如下命令

``` shell
rename "s/foo(\d+)/text_\1.txt/" foo*
```

将当前目录下所有 `file_1.txt` `file_200.txt` 替换为 `text_1.txt` `text_2.txt`

### 修改目录名

`mv` 移动文件

`rename` 批量修改文件名

## 文件内容查阅

| 命令   | 作用                       |
| ------ | :------------------------- |
| `cat`  | 由第一行开始显示文件内容   |
| `tac`  | 由最后一行开始显示文件内容 |
| `nl`   | 输出行号显示               |
| `more` | 逐页显示内容               |
| `less` | 逐页显示内容还可以向上翻页 |
| `head` | 输出头部若干行             |
| `tail` | 输出尾部若干行             |
| `od`   | 以二进制输出文件内容       |

### `cat` 由第一行开始显示文件内容

- `-n` 列出行号，包括空行

### `less` 分页显示文件内容

| 按键      | 作用              |
| --------- | :---------------- |
| space     | 向下翻一页        |
| pagedown  | 向下翻一页        |
| pageup    | 向上翻一页        |
| /[字符串] | 向下查询 [字符串] |
| ?[字符串] | 向上查询 [字符串] |
| n         | 向下重复一次查询  |
| N         | 向上重复一次查询  |
| q         | 离开 less         |

### `tail` 显示文件尾部内容

- `-n` 接数字，显示多少行
- `-f` 持续检测文件尾部变动，按下 ctrl-c 结束检测

## 编辑文件

### 非交互式写入

将字符串写入文件（清空原有内容）

```bash
echo "foo" > file.txt
# or
cat > file.txt << EOF
foo
bar
EOF
```

追加在文件尾部

```bash
echo "foo" >> file.txt
# or
cat >> file.txt << EOF
foo
bar
EOF
```

### `sed` 非交互式编辑

处理前置命令的输出结果

`(std-out) | sed [options]`command``

处理文件

`sed [-n] [-i]`条件 命令`file`

- `-n` 忽略没有修改的输出
- `-i` 直接修改源文件
- `-r` 支持拓展正则表达式

| 条件                          | 作用                                                     | 例子                           | 解释                                  |
| ----------------------------- | -------------------------------------------------------- | ------------------------------ | ------------------------------------- |
| 行号 命令                     | 对指定行号的行进行操作                                   | `3p`                           | 打印第 3 行                           |
| 起始行号,终止行号 命令        | 对范围中的几行进行操作                                   | `2,6d`                         | 删除第 2 行到第 6 行                  |
| 行号 1 命令 ; 行号 2 命令; …… | 对多行进行操作，没有行号先后区分                         | `1p;2d`                        | 打印第 1 行然后删除第 2 行            |
| 起始行号,+附加的行数 命令     | 从起始行号开始，再加指定行数，这写范围内的所有行进行操作 | `1,+3p`                        | 打印 1 到 4 行的内容                  |
| 起始行号~步长 命令            | 从起始行号开始，每隔一个步长的每个行进行操作             | `1~2p`                         | 打印奇数行的内容                      |
|                               |                                                          | `2~2p`                         | 打印偶数行的内容                      |
| /正则表达式/命令              | 对匹配正则表达式的行进行操作，注意格式要求               | <code>/^root&#124;^ftp/d<code> | 删除文件中包以 root 或者 ftp 开头的行 |
| \$命令                        | 对最后一行进行操作                                       | `$!d`                          | 最后一行保留，其他全部干掉            |

| 命令 | 作用     | 用法和例子                                | 解释                                                                                                                           |
| ---- | -------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| i    | 插入文本 | 条件 i 内容                               | 在指定的行之前插入文本                                                                                                         |
| a    | 追加文本 | 条件 a 内容                               | 在指定的行之后追加文本                                                                                                         |
| c    | 替换行   | 条件 c 内容                               | 把指定行的内容替换，整行都替换掉                                                                                               |
| p    | 打印     | 条件 p                                    | 打印符合条件的内容，注意如果没有-n，sed 默认打印所有                                                                           |
| !p   | 打印其他 | 条件!p                                    | 不打印符合条件的内容，打印其他的所有                                                                                           |
| =    | 打印行号 | `$=`                                      | 输出文件一共多少行，`$`代表最后一行，`=`代表输出行号                                                                           |
|      |          | `/^root/=`                                | 输出以 root 开头的行号                                                                                                         |
| d    | 删除     | 条件 d                                    | 删除符合条件的内容                                                                                                             |
|      |          | `$d`                                      | 删除最后一行                                                                                                                   |
|      |          | `/^$/d`                                   | 删除所有空行 ，这是正则与之结合的结果                                                                                          |
| !d   | 保留其他 | 条件!d                                    | 符合条件的不删除，其余删除                                                                                                     |
|      |          | `/^root/!d`                               | 以 root 开头的保留，其余全部删除                                                                                               |
| s    | 替换     | 条件 s/被替换内容/替换成什么/第几个       | 把文件中的每个符合条件的行的第几个匹配替换要求的内容进行替换，如果没有这么多个被替换内容就不替换，不写默认第一个               |
|      |          | 条件 s/被替换内容/替换成什么/g            | 把文件中的每个符合条件的行的所有匹配替换要求的内容进行替换                                                                     |
|      |          | 条件 s/被替换内容/替换成什么/第几个 p     | 把文件中的每个符合条件的行的第几个匹配替换要求的内容进行替换，然后显示，如果前面有-n，那么就可以完成替换后只显示替换的部分信息 |
|      |          | 条件 s#被替换内容#替换成什么#             | s 后面紧跟的符号就是控制替换符号，可以是任意字符，包括空格，字符，数字，但是不建议使用                                         |
|      |          | `2s/student//2p`                          | 把文件中第二行中第二个 student 替换成空,然后现实替换的内容，可以用作删除                                                       |
|      |          | `1,5s/^a/#a`                              | 在 1 到 5 行每个以 a 开头的行的前面加上注释                                                                                    |
|      |          | `6,10s/^#//`                              | 把 6 到 10 行中的注释的注释标示去掉，让其成为配置                                                                              |
|      |          | `99s9\98\97\99\95\98\99gp`                | 这里面替换控制符号是 9，他就算把 99 行所有的 98979 替换成 95989 然后输出                                                       |
|      |          | `1s#^.\{'$n'\}..∗..\{'$m'\}$#\1\4\3\2\5#` | 把第 n 个和倒数第 m 个字符对调                                                                                                 |
| r    | 导入文件 | `条件 r 文件 2`                           | 把文件 2（条件指令中的文件）中的内容添加文件 1（sed 命令后操作的文件）中到满足条件的行下                                       |
|      |          | `sed -n "2 r a.txt" b.txt`                | 把 a.txt 的内容添加到 b.txt 的第二行下                                                                                         |
| w    | 导出文件 | 条件 w 文件 2                             | 把文件 1（sed 命令后操作的文件）中到满足条件的行另存到文件 2 中                                                                |
|      |          | `sed -n "w a.txt" b.txt`                  | 把 b.txt 的所有内容保存到 a.txt 中                                                                                             |
| H    | 追加复制 | 条件 H                                    | 把符合条件的行的内容写入复制版中                                                                                               |
| h    | 覆盖复制 | 条件 h                                    | 把符合条件的行的内容覆盖写入复制版中                                                                                           |
| G    | 追加粘贴 | 条件 G                                    | 把复制版中的内容追加到符合条件的行后面，注意也没有回车                                                                         |
| g    | 覆盖粘贴 | 条件 g                                    | 把复制版中的内容覆盖到符合条件的行后面，注意也没有回车                                                                         |

注意

- 在 sed 中的空格没有太过严格的要求，条件与命令间有没有空格都可以，不影响使用，
- 如果想让输出有该行在源文件的位置，可以用 `cat -n 文件 | sed [选项] 条件 命令`  
  但是这时候如果用正则匹配，开头匹配就不能用了，因为内容有了改变，原本再文件中开头的数据前面都有了行号，他们就不是在行首了
- 删除某一行或多行用命令 `条件 d` ，如果删除某一行或多行中的某一些字段用 `条件 s/目标字段//`  
  替换某一行的内容用`条件 c 内容` , 如果替换某一行中的某个字段用`条件 s/被替换的部分/替换成什么/`
- s 后面紧跟的符号就是控制替换符号，可以是任意字符，包括空格，字符，数字，但是不建议使用
- 在 sed 的 s 替换中替换成什么，这个部分，符号基本都没有特殊含义，除了 \ 和被选定作为控制替换符号 ， 如果要向替换成 \ 就要打 \\ 如果向换成 \\ 就打 \\\ 依次类推 ， 如果要替换成控制替换符号如 / 就要打 \/  
  例如： sed -n `s/[A−Z]/\/\\\1:"`/gp` 文件 其作用就是把全文所有的大写字母 变成 /\大写字母:" 然后打印出来
- 一般 sed 中用 ``限定起来如果要用变量可以把中间的条件命令分开来`……`\$变量`……` 这样就可以了

<!-- ## 权限控制

`chmod`
`chown`
`chgrp`
`setfacl`
`getfacl` -->

# SHELL

_已移至 [Shell Script 学习笔记](/2023/shell-script-study-notes/)_

# 参考资料

> - 《鸟哥的 Linux 私房菜》
> - [10个高效Linux技巧及Vim命令对比 - Vimjc](https://vimjc.com/linux-vim-tricks.html)
> - [linux命令行常用光标移动快捷键](https://www.jianshu.com/p/de98af781829)
