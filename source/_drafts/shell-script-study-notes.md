---
title: shell script 学习笔记
date: 2020-06-16 23:44:01
categories: 笔记
tags:
  - Shell Script
  - Linux
---

# 变量

# 字符串

字符串可以用单引号，也可以用双引号，也可以不用引号。

## 单引号

单引号里任何字符都会原样输出，变量也是无效的，也无法对单引号进行转义。

```bash
str='this is a string'
```

## 双引号和字符串的拼接

双引号就可以随意的进行转义啦！

```bash
name="mutoe"
greeting="hello, $name !" # => hello, mutoe !
greeting="hello, "$name" !" # => hello, mutoe !
greeting="hello, ${name}!" # => hello, mutoe!
quote_greeting="hello, \"$name\" !" # => hello, "mutoe" !
```

## 获取字符串长度

```bash
str='abcd'
echo ${#abcd} # => 4
```

## 获取子字符串

```bash
str='abcdefg'
echo ${string:1:4} # => bcde
```

## 分割字符串

```bash
str="a,b,c,d"
arr=$(echo $str | tr ";" "\n")
for item in $arr
do
  echo $item
done
```

# 条件

## if

## case

```sh
case $var in
1)
  command1
  command2
  ;; # break (required)
$const|2） # or
  command1
  command2
  ;;
*) # default
  command1
  command2
  ;;
esac
```

# 循环

## for

## while

## until

# 注释

以 `#` 开始的部分就是注释， sh里没有多行注释，只能每行加一个 `#` 号

# 参考资料

- [Shell 教程 - c语言中文网](https://wiki.jikexueyuan.com/project/shell-tutorial)
- [How do I split a string on a delimiter in Bash?](https://stackoverflow.com/q/918886/7736393)
