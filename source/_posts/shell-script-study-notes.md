---
title: Shell Script 学习笔记
date: 2023-04-24 16:33:59
categories: 笔记
tags:

- Shell
- Script
- Bash

---

这里记录了一些个人学习 Shell Script 时遇到的一些问题, 可以作为避免踩坑和速查手册. 如有疑问欢迎留言.

<!-- more -->

## 环境变量

| 命令         | 作用       |
|------------|:---------|
| `printenv` | 打印所有环境变量 |

## 输出

| 命令     | 作用  |
|--------|:----|
| `echo` | 输出  |

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

## 条件

### 并且 （AND）

```shell
if [ c1 -a c2 ]; then
...
fi

if [ c1 ] && [ c2 ]; then
...
fi
```

### 或 （OR）

```shell
if [ c1 -o c2 ]; then
...
fi

if [ c1 ] || [ c2 ]; then
...
fi
```


### 利用 `test` 命令进行判断

| 参数                            | 作用                                              |
|-------------------------------|-------------------------------------------------|
| `-e file`                     | 判断 file 是否存在 (exist)                            |
| `-f file`                     | 判断 file 是否存在并且是 file                            |
| `-d file`                     | 判断 file 是否存在并且是 directory                       |
| `-S file`                     | 判断 file 是否存在并且是 socket                          |
| `-L file`                     | 判断 file 是否存在并且是 symbolic link                   |
| `-r file`                     | 判断 file 是否存在并且可读 (readable)                     |
| `-w file`                     | 判断 file 是否存在并且可写 (writeable)                    |
| `-x file`                     | 判断 file 是否存在并且可执行 (executable)                  |
| `-s file`                     | 判断 file 是否存在并且文件大小 (size) 非零                    |
| `file1 -nt file2`             | 判断 file1 存在并且比 file2 新 (newer than)             |
| `file1 -ot file2`             | 判断 file1 存在并且比 file2 旧 (older than)             |
| `file1 -ef file2`             | 判断 file1 和 file 2存在并且是同一个文件 (exist & same file) |
| `string`                      | 判断 string 是空字符串                                 |
| `-n string`                   | 判断 string 长度为非零 (non-zero)                      |
| `-z string`                   | 判断 string 长度为零 (zero)                           |
| `s1 = s2`                     | 判断字符串 s1 和 s2 相同                                |
| `s1 != s2`                    | 判断字符串 s1 和 s2 不同                                |
| `s1 < s2` / `s1 > s2`         | 判断字符串 s1 的二进制值比 s2 小 / 大                        |
| `! expiression`               | 取表达式的非值                                         |
| `expiression1 -a expression2` | 判断表达式1 **和(and)** 表达式2 都为真                      |
| `expiression1 -o expression2` | 判断表达式1 **或(or)** 表达式2 为真                        |

注意：
1. 如果文件是一个符号链接 (symbolic link)，它将会指向链接的真实文件进行判断，除非指定了 `-L` 或 `-n` 参数.
2. 当 `-a` 和 `-o` 同时使用时，`-a` 的运算优先级比 `-o` 高.

### 利用 `[]` 判断符号进行判断

- 判读符号 `[]` 的使用方法与 `test` 命令一致。
- `[]` 方括号内的每个元件都要以空格分隔，这包括方括号本身。
  > `[ -z foo ]` `[ "$name" == "foo bar" ]`
- 如果需要引入变量，变量最好使用双引号包裹，否则变量中出现的空格将会作为判断符号的元件被分隔。
  > 试着体会 `[ -z "foo bar" ]` 和 `[ -z foo bar ]` 的区别

```shell
[ -z abc -a -w file] # => true
[ (-z abc) -a (-w file)] # => true
[ -z abc ] && [ -w file] # => false
```

### 利用 `command` 命令进行命令判断

| 参数   | 作用       |
|------|----------|
| `-e` | 判断文件是否存在 |
| `-v` | 判断命令是否存在 |

### 判断语句 `if`, `if [ ]`, `if [[ ]]` 有什么区别？

1. `if`
   这是shell的基本形式,要求命令返回0表示真,非0表示假,比较简单。例如:
   ```shell
   if cmd; then
     echo "True"
   fi
   ```
2. `if [ ]` 这是shell的扩展形式,使用 [] 进行条件测试。例如:
   ```shell
   if [ $a -eq $b ]; then
     echo "a 等于 b"
   fi
   ```
3. `if [[ ]]` 这是shell的新形式,使用 [[ ]] 进行条件测试。它有以下优点:

   - 支持正则表达式匹配
   - 不需要在条件表达式内部加空格
   - 支持 && 和 || 逻辑操作
   - 支持字符串比较
   
   例如:
   ```shell
   if [[ $a = "b" ]]; then
     echo "a 等于 b"
   fi
   
   if [[ $a -eq $b ]] && [[ $c -gt $d ]]; then
     echo "条件满足"
   fi
   ```
综上,如果shell版本支持,推荐使用 `if [[ ]]` 形式进行条件判断,它有更多特性和优点。`if [ ]` 形式虽然也可用,但需要注意内部空格问题。`if` 命令形式最简单,但实用性较差。

[//]: # (## 循环)

[//]: # ()

[//]: # (```shell)

[//]: # ()

[//]: # (``` )

## 函数

函数的定义格式如下

```
[function] funname [()] {
  action;
  [return int;]
}
```

```shell
function fn {
  echo "hello world!"
  return 0
}

say_hi() {
  echo $1
}
say_hi jack
```

| 参数                 | 说明                                 |
|--------------------|------------------------------------|
| `$1` `$10` `${11}` | 第 `1`, `10`, `11` 个参数              |
| `$#`               | 传递到脚本或函数的参数个数                      |
| `$*`               | 以一个单字符串显示所有向脚本传递的参数                |
| `$@`               | 与 `$*` 相同，但是使用时加引号，并在引号中返回每个参数。    |
| `$$`               | 脚本运行的当前进程 ID 号                     |
| `$!`               | 后台运行的最后一个进程的 ID 号                  |
| `$-`               | 显示 Shell 使用的当前选项，与 `set` 命令功能相同。   |
| `$?`               | 显示最后命令的退出状态。`0` 表示没有错误，其他任何值表明有错误。 |

## 小技巧

### 获取当前 Git 分支名

```shell
# 获取当前 ref 名
ref_name=$(git symbolic-ref -q HEAD) # => refs/heads/master
# 利用替换命令
branch_name=${ref_name##refs/heads/} # => master
```

## 参考资料

> - [Shell 编程中的用户输入处理 - Locutus](https://so.csdn.net/so/search/s.do?q=Shell%E7%BC%96%E7%A8%8B%E4%B8%AD%E7%9A%84%E7%94%A8%E6%88%B7%E8%BE%93%E5%85%A5%E5%A4%84%E7%90%86&t=blog&u=yjk13703623757)
> - [Linux 的 Shell 脚本——day5——sed 非交互文本编辑 - Lu-Yu](https://blog.csdn.net/Yu1543376365/article/details/82717257)
