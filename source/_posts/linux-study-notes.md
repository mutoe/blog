---
title: linux 学习笔记

date: 2017-08-01 12:30:09
update: 2019-10-16 15:47:14
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

会自动为创建的用户指定主目录、系统 shell 版本，会在创建时输入用户密码。

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

### 1. 切换到 root 用户下

### 2. 添加 sudo 文件的写权限

```bash
chmod u+w /etc/sudoers
```

### 3. 编辑 sudoers 文件

```bash
vim /etc/sudoers
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

### 4. 撤销 sudo 文件的写权限

```bash
chmod u-w /etc/sudoers
```

## 允许用户使用密钥登陆

### 新密钥对登陆

```bash
su username # 切换到普通用户
cd ~ # 进入 home 目录
ssh-keygen -r rsa # 创建密钥对, 一路回车即可
cd .ssh # 进入 .ssh 目录
mv id_rsa.pub authorized_keys # 将公钥重命名
```

然后将 id_rsa 下载到主机, 并且使用它登陆即可

### 使用已有密钥对

```bash
su username
cd ~
mkdir -m 700 .ssh # 创建 .ssh 目录
cd .ssh
# 将 id_rsa.pub 放入此目录
mv id_rsa.pub authorized_keys
chmod 644 authorized_keys
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
```

追加在文件尾部

```bash
echo "foo" >> file.txt
```

### `sed` 非交互式编辑

处理前置命令的输出结果

`(std-out) | sed [options]`command``

处理文件

`sed [-n] [-i]`条件 命令`file`

- `-n` 忽略没有修改的输出
- `-i` 直接修改源文件
- `-r` 支持拓展正则表达式

| 条件                          | 作用                                                     | 例子                            | 解释                                  |
| ----------------------------- | -------------------------------------------------------- | ------------------------------- | ------------------------------------- |
| 行号 命令                     | 对指定行号的行进行操作                                   | `3p`                            | 打印第 3 行                           |
| 起始行号,终止行号 命令        | 对范围中的几行进行操作                                   | `2,6d`                          | 删除第 2 行到第 6 行                  |
| 行号 1 命令 ; 行号 2 命令; …… | 对多行进行操作，没有行号先后区分                         | `1p;2d`                         | 打印第 1 行然后删除第 2 行            |
| 起始行号,+附加的行数 命令     | 从起始行号开始，再加指定行数，这写范围内的所有行进行操作 | `1,+3p`                         | 打印 1 到 4 行的内容                  |
| 起始行号~步长 命令            | 从起始行号开始，每隔一个步长的每个行进行操作             | `1~2p`                          | 打印奇数行的内容                      |
|                               |                                                          | `2~2p`                          | 打印偶数行的内容                      |
| /正则表达式/命令              | 对匹配正则表达式的当进行操作，注意格式要求               | <code>/^root\&#124;^ftp/d<code> | 删除文件中包以 root 或者 ftp 开头的行 |
| \$命令                        | 对最后一行进行操作                                       | `\$!d`                          | 最后一行保留，其他全部干掉            |

| 命令 | 作用     | 用法和例子                                   | 解释                                                                                                                           |
| ---- | -------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| i    | 插入文本 | 条件 i 内容                                  | 在指定的行之前插入文本                                                                                                         |
| a    | 追加文本 | 条件 a 内容                                  | 在指定的行之后追加文本                                                                                                         |
| c    | 替换行   | 条件 c 内容                                  | 把指定行的内容替换，整行都替换掉                                                                                               |
| p    | 打印     | 条件 p                                       | 打印符合条件的内容，注意如果没有-n，sed 默认打印所有                                                                           |
| !p   | 打印其他 | 条件!p                                       | 不打印符合条件的内容，打印其他的所有                                                                                           |
| =    | 打印行号 | `\$=`                                        | 输出文件一共多少行，\$代表最后一行，=代表输出行号                                                                              |
|      |          | `/^root/=`                                   | 输出以 root 开头的行号                                                                                                         |
| d    | 删除     | 条件 d                                       | 删除符合条件的内容                                                                                                             |
|      |          | `\$d`                                        | 删除最后一行                                                                                                                   |
|      |          | `/^\$/d`                                     | 删除所有空行 ，这是正则与之结合的结果                                                                                          |
| !d   | 保留其他 | 条件!d                                       | 符合条件的不删除，其余删除                                                                                                     |
|      |          | `/^root/!d`                                  | 以 root 开头的保留，其余全部删除                                                                                               |
| s    | 替换     | 条件 s/被替换内容/替换成什么/第几个          | 把文件中的每个符合条件的行的第几个匹配替换要求的内容进行替换，如果没有这么多个被替换内容就不替换，不写默认第一个               |
|      |          | 条件 s/被替换内容/替换成什么/g               | 把文件中的每个符合条件的行的所有匹配替换要求的内容进行替换                                                                     |
|      |          | 条件 s/被替换内容/替换成什么/第几个 p        | 把文件中的每个符合条件的行的第几个匹配替换要求的内容进行替换，然后显示，如果前面有-n，那么就可以完成替换后只显示替换的部分信息 |
|      |          | 条件 s#被替换内容#替换成什么#                | s 后面紧跟的符号就是控制替换符号，可以是任意字符，包括空格，字符，数字，但是不建议使用                                         |
|      |          | `2s/student//2p`                             | 把文件中第二行中第二个 student 替换成空,然后现实替换的内容，可以用作删除                                                       |
|      |          | `1,5s/^a/#a`                                 | 在 1 到 5 行每个以 a 开头的行的前面加上注释                                                                                    |
|      |          | `6,10s/^#//`                                 | 把 6 到 10 行中的注释的注释标示去掉，让其成为配置                                                                              |
|      |          | `99s9\98\97\99\95\98\99gp`                   | 这里面替换控制符号是 9，他就算把 99 行所有的 98979 替换成 95989 然后输出                                                       |
|      |          | `1s#^.\{`\$n`\}..∗..\{`\$m`\}\$#\1\4\3\2\5#` | 把第 n 个和倒数第 m 个字符对调                                                                                                 |
| r    | 导入文件 | `条件 r 文件 2`                              | 把文件 2（条件指令中的文件）中的内容添加文件 1（sed 命令后操作的文件）中到满足条件的行下                                       |
|      |          | `sed -n "2 r a.txt" b.txt`                   | 把 a.txt 的内容添加到 b.txt 的第二行下                                                                                         |
| w    | 导出文件 | 条件 w 文件 2                                | 把文件 1（sed 命令后操作的文件）中到满足条件的行另存到文件 2 中                                                                |
|      |          | `sed -n "w a.txt" b.txt`                     | 把 b.txt 的所有内容保存到 a.txt 中                                                                                             |
| H    | 追加复制 | 条件 H                                       | 把符合条件的行的内容写入复制版中                                                                                               |
| h    | 覆盖复制 | 条件 h                                       | 把符合条件的行的内容覆盖写入复制版中                                                                                           |
| G    | 追加粘贴 | 条件 G                                       | 把复制版中的内容追加到符合条件的行后面，注意也没有回车                                                                         |
| g    | 覆盖粘贴 | 条件 g                                       | 把复制版中的内容覆盖到符合条件的行后面，注意也没有回车                                                                         |

注意

- 在 sed 中的空格没有太过严格的要求，条件与命令间有没有空格都可以，不影响使用，
- 如果想让输出有该行在源文件的位置，可以用 `cat -n 文件 | sed [选项] 条件 命令`  
  但是这时候如果用正则匹配，开头匹配就不能用了，因为内容有了改变，原本再文件中开头的数据前面都有了行号，他们就不是在行首了
- 删除某一行或多行用命令 `条件 d` ，如果删除某一行或多行中的某一些字段用 `条件 s/目标字段//`  
  替换后一行的内容用`条件 c 内容` , 如果替换后一行中的某个字段用`条件 s/被替换的部分/替换成什么/`
- s 后面紧跟的符号就是控制替换符号，可以是任意字符，包括空格，字符，数字，但是不建议使用
- 在 sed 的 s 替换中替换成什么，这个部分，符号基本都没有特殊含义，除了 \ 和被选定作为控制替换符号 ， 如果要向替换成 \ 就要打 \\ 如果向换成 \\ 就打 \\\ 依次类推 ， 如果要替换成控制替换符号如 / 就要打 \/  
  例如： sed -n `s/[A−Z]/\/\\\1:"`/gp` 文件 其作用就是把全文所有的大写字母 变成 /\大写字母:" 然后打印出来
- 一般 sed 中用 `` 限定起来如果要用变量可以把中间的条件命令分开来 `……`\$变量`……` 这样就可以了

# SHELL

## 输出

| 命令   | 作用 |
| ------ | :--- |
| `echo` | 输出 |

### `echo`

## 输入

### 输入参数

读取参数时，使用 `$0`..`$9` `${10}` 等获取参数

其中 `$0` 是程序名称

```bash add.sh
# !/bin/bash

name=`basename $0`

echo "the cmd is $0"
echo "the cmd basename is $name"
echo "The #1 param is $1"
echo "The #2 param is $2"

SUM=$[ $1 + $2 ]

echo "The result is $SUM"
```

输出

```
➜  ~ chmod +x add.sh
➜  ~ ./add.sh 1 2
the cmd is ./add.sh
the cmd basename is add.sh
The #1 param is 1
The #2 param is 2
The result is 3
```

### 特殊变量

还有几个特殊的变量可供使用

- `echo $#` 输出参数的个数
- `echo $*` 输出参数变量
- `echo $@` 输出参数列表（可用 for in 遍历）

下面的例子来判断变量参数是否符合要求

```bash
# !/bin/bash

if [ $# -lt 2 ] # $#获取输入个数，选项-lt表示less than
then
  echo "please input at least 2 param"
fi
```

### `shift` 移动参数位置

使用 `shift` 命令将参数队列的第一个参数移出 所有参数位置向前移动

```bash sum.sh
# !/bin/bash

result=0

while [ -n "$1" ]               # 通过循环，每次读取$1位置参数
do
  result=$[ $result + $1 ]    # $1位置参数与原参数和累加
  shift                       # 把$2位置参数向前移动到$1，原$1位置参数不可用
done

echo "sum of result is $result"
```

### `read` 读取键盘输入

`read [-s] [-t timeout] [-n num] [-p prompt] [variables...]`

- `-p prompt` 提示语句
- `-s` 静默输入(例如输入密码)
- `-t timeout` 设置输入超时时间，如果超时则以非 0 状态退出
- `-n num` 限制输入字数，如果设置为一则只需要按下一个字母，无需按回车键
- `variabels` 变量名 可以制定多个， 如果不指定会将输入将存入`REPLY`变量中

```bash
# !/bin/bash

echo -n "Enter your name:"                 # 参数-n的作用是不换行，echo默认换行
read name                                  # 把输入放入变量name
echo "hello $name,welcome to my program"   # 显示输入信息
exit 0
```

交互式菜单

```bash
#!/bin/bash

echo "Please Select:
1.Display System Information
2.Display Disk Space
3.Display Home Space Utilization
0.Quit"
read -p -n 1 "Enter selection [0-3] >" num

if [[ $num =~ ^[0-3]$ ]]; then
   if [[ $num == 0 ]]; then
     echo "Program terminated"
     exit;
   fi

  if [[ $num == 1 ]]; then
    echo "Hostname :$HOSTNAME"
    uptime
    exit
  fi

  if [[ $num == 2 ]]; then
    df -h
    exit;
  fi

  if [[ $num == 3 ]]; then
    if [[ $(id -u) -eq 0 ]]; then
      echo "Home Space Utilization(All Users)"
      du -sh /home/*
    else
      echo "Home Space Utilization($USER)"
      du -sh $HOME
    fi
  fi
else
 echo "Invalid entry." >&2
 exit 1
fi
```

### 自动输入

我们在写 shell 脚本时会遇到需要进行手动输入的命令，如 `sudo` `passwd` 等需要等待输入密码，在 shell 脚本中如何进行输入呢？

以 `passwd username` 为例

```bash
#!/bin/bash

passwd username << EOF
123456
123456
EOF
```

# 参考资料

> - 《鸟哥的 Linux 私房菜》
> - [Shell 编程中的用户输入处理 - Locutus](https://so.csdn.net/so/search/s.do?q=Shell%E7%BC%96%E7%A8%8B%E4%B8%AD%E7%9A%84%E7%94%A8%E6%88%B7%E8%BE%93%E5%85%A5%E5%A4%84%E7%90%86&t=blog&u=yjk13703623757)
> - [Linux 的 Shell 脚本——day5——sed 非交互文本编辑 - Lu-Yu](https://blog.csdn.net/Yu1543376365/article/details/82717257)
