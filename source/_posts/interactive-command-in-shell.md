---
title: 在 Shell 脚本中进行交互的一些心得
date: 2019-10-17 12:12:16
categories: 心得
tags:
  - Linux
  - Shell
---

我们在写 shell 脚本时经常会遇到一些需要交互的操作，比如修改某个文件，或是使用 `yum install` `ssh-keygen` `certbot --nginx` 等操作时，需要输入一些指令如 "y", "Enter" 和其他的一些信息。

我们写脚本就是为了自动操作，怎么可以等命令执行一会之后在按个回车进行下一步呢？既然我知道接下来要输入什么命令，我告诉你你帮我输入了不就得了？

<ruby>聪明<rt>tōu lǎn<rt></ruby>的我们想到了一些办法来避免这种无谓的等待，记录下来分享给大家

<!-- more -->

# 1. 自动化输入

## 1.1 输入单个指令

这里用 `yum install` 来进行演示，虽然该命令可以使用参数 `-y` 来直接确认，但是这是一个大家熟知对命令，可以用来很好的演示效果。

```bash
echo "y" | yum install wget
```

如果要求输入回车，可以使用 echo 指令的参数 `-e` + `\n` 进行操作

```bash
echo -e "\n" | yum remove wget
```

<details>
<summary>**`echo -e` 的小知识**</summary>

若字符串中出现以下字符，则特别加以处理，而不会将它当成一般文字输出：  
`\a` 发出警告声；  
`\b` 删除前一个字符；  
`\c` 最后不加上换行符号；  
`\f` 换行但光标仍旧停留在原来的位置；  
`\v` 与\f 相同；  
`\n` 换行且光标移至行首；  
`\r` 光标移至行首，但不换行；  
`\t` 插入 `tab` 符号；  
`\\` 插入 '\' 字符；  
`\nnn` 插入 nnn（八进制）所代表的 ASCII 字符；

</details>

## 1.2 输入多行指令

输入多行指令我们需要借助输入重定向操作符 `<<`

以下面这个脚本为例

```bash multi.sh
#!/bin/bash

read -p "enter number:" no
read -p "enter name:" name
echo "you have entered $no, $name"
```

借助 `<<` 符号进行自动化输入

```bash
#!/bin/bash
sh multi.sh << EOF
1
mutoe
EOF
```

但是有时候这种方法并不生效，比如 `ssh-keygen` 命令，那只有借助强大的 `expect` 命令了

## 1.3 借助 `expect` 进行交互

在使用 `expect` 前需要进行安装，方法很简单，以 CentOS 为例，只需要运行 `yum install -y expect` 即可

expect 有两种用法，一种是直接写 expect 解释器的脚本，和 bash 类似，以 `#!/usr/bin/expect` 开头

下面是一个合格的 expect 脚本示例

```bash
#!/bin/expect

set IP     [lindex $argv 0] # 读取第1个参数设置为 IP 变量
set PASSWD [lindex $argv 1] # 读取第2个参数设置为 PASSWD 变量
set CMD    [lindex $argv 2] # 读取第3个参数设置为 CMD 变量

spawn ssh $IP $CMD # spawn 来给命令加壳，以便于断言输出
expect { # expect 是断言命令
  # 如果读取到屏幕上输出 (yes/no) 信息，则输入 "yes" 并按下回车键
  # exp_continue 是继续等待花括号内的断言, 如果不加这一句会直接跳出 expect
  "(yes/no)?" { send "yes\r"; exp_continue }

  "password:" { send "$PASSWD\r" } # 如果读取到屏幕上输出 password 信息，则输入 PASSWD 变量中的内容
  "*host " { exit 1 } # 如果读取到 "No route to host" 等内容， 就以非0状态退出
}
expect eof # 等待命令执行结束
```

需要注意的是，在 expect 解释器内， 除了几个特定关键字的命令，其他命令都不可用，这种方式适用于执行命令较少，单次需要交互较多的自动化脚本

第二种用法是在 bash 脚本中执行 expect 配合重定向操作符, 在有大量脚本需要执行的情况下推荐使用该方式

下面是我在 `certbot` 命令时使用的 shell 脚本，以供参考

```bash
#!/bin/bash

sudo expect << EOF
spawn certbot --nginx
expect {
  "Enter email address" { send "mutoe@foxmail.com\n";exp_continue}
  "Please read the Terms of Service" {send "A\n";exp_continue}
  "Would you be willing to share your email address" {send "N\n";exp_continue}
  "Which names would you like to activate HTTPS for" {send "\n";exp_continue}
  "You have an existing certificate that has exactly the same domains" {send "1\n";exp_continue}
  "Please choose whether or not to redirect HTTP traffic to HTTPS" {send "2\n";exp_continue}
  eof
}
```

# 2. 修改文件

## 2.1 在文件中增加内容

我们想要将某个命令的输出写入到文件中进行保存，比如日志、新增一行配置，可以借助输出重定向符号 `>` `>>` 来实现

```bash
who > log.txt # > 符号将会先清空 log.txt 然后以 who 的输出写入到文件中
echo "append" >> log.txt # >> 符号会追加字符串 "append" 到文件的尾行
```

那如果需要写入多行该怎么办呢？虽然也可以借助 `echo -e` + `\n` 来实现，但是我们还有其他更优雅的办法

借助 `cat` 命令配合 `<<` 符号也可以达到我们的目的

```bash
cat > log.txt << EOF
我有很多行
很多行
行
EOF
```

> **WHY?**  
> `cat` 命令如果不接受任何参数，将会进入交互式界面，输入什么就会输出什么；  
> 配合 `>` 符号将 `cat` 的输出写入到文件 `log.txt` 中；  
> 而 `<<` 我们前面介绍过，会将多行输入重定向到前面的命令 `cat` 中

## 2.2 修改文件的内容

关于修改文件的内容，如何在不借助 vim 等工具情况下进行呢？

有请我们强大的 `sed` 命令登场！！

`sed [选项] 指令 文件`

其中选项有

- `-n` 忽略没有修改的内容
- `-i` 原地修改文件而不输出
- `-r` 拓展正则表达式

指令为一个字符串，由 2 个部分组成 `条件` `命令`，条件用于约束，指令进行操作

一个正常的替换命令长这样

```bash
sed -i "/^user/ s/nginx/mutoe/" /paht/to/nginx.conf
```

其中  
`/^user/` 为条件，查找以 "user" 开头的一行;  
`s/nginx/mutoe/` 为命令，`s`是替换，这条命令意思是将 `nginx` 替换为 `mutoe`

sed 支持的命令有很多，约有 15 中，列举一些常见的命令

- `i` 插入
- `a` 追加
- `d` 删除行
- `c` 替换行
- `s` 替换指定内容

> 关于 `sed` 的更多用法，可以参考我的 [《Linux 学习笔记》 "sed 非交互式编辑"](/2017/linux-study-notes/#sed-%E9%9D%9E%E4%BA%A4%E4%BA%92%E5%BC%8F%E7%BC%96%E8%BE%91) 部分

以下面的 nginx 配置片段为例

```nginx nginx.conf
user nginx;
worker_processes  1;

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;

  #gzip  on;

  include /etc/nginx/conf.d/*.conf;
}

# delete me
```

首先我们将 nginx 的启动用户改为自定义用户

```bash
sed -i "1c user mutoe;" /path/to/nginx.conf
```

`-i` 意思是将输出 "in-placed" 直接替换文件内容而不是作为输出  
"1c user mutoe;" 是指将第 1 行替换(c)为"user mutoe;"

接下来我们去除 `#gzip on;` 前的空格，难度在于我们并不知道改行配置位于哪一行，没关系，我们借助正则表达式先找到这一行

```bash
sed -i "/#gzip\s+on;/s/#//" /path/to/nginx.conf
```

最后我们删除文件的最后一行

```bash
sed -i "$d" /path/to/nginx.conf
```

好了，所有内容到这里就结束啦，如果看的不过瘾，[这里](https://gist.github.com/mutoe/c7f86167d648d697e9c28a68db74ae0e)有我在实际使用中的一些脚本，以供参考。

如果你有任何疑问或是支持，欢迎在下方留言。

# 参考资料

- [echo 命令 - Linux 命令大全](https://man.linuxde.net/echo)
- [Shell 输入/输出重定向 - Runoob](https://www.runoob.com/linux/linux-shell-io-redirections.html)
- [shell 中交互输入自动化 - lufubo](https://blog.csdn.net/lufubo/article/details/7627393)
