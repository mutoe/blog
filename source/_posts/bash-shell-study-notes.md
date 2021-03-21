---
title: Bash Shell 学习笔记  
date: 2020-06-16 23:44:01  
update: 2021-03-20 21:47:39  
categories: 笔记  
tags:
  - Linux
  - Bash
  - Shell Script
---

# 变量

## 字符串

字符串可以用单引号，也可以用双引号，也可以不用引号。

### 单引号

单引号里任何字符都会原样输出，变量也是无效的，也无法对单引号进行转义。

```bash
str='this is a string'
```

### 双引号和字符串的拼接

双引号就可以随意的进行转义啦！

```bash
name="mutoe"
greeting="hello, $name !" # => hello, mutoe !
greeting="hello, "$name" !" # => hello, mutoe !
greeting="hello, ${name}!" # => hello, mutoe!
quote_greeting="hello, \"$name\" !" # => hello, "mutoe" !
```

### 获取字符串长度

```bash
str='abcd'
echo ${#abcd} # => 4
```

### 获取子字符串

```bash
str='abcdefg'
echo ${string:1:4} # => bcde
```

### 分割字符串

```bash
str="a,b,c,d"
arr=$(echo $str | tr ";" "\n")
for item in $arr
do
  echo $item
done
```

## 数组

数组使用小括号定义

```sh
# 声明数组
array=(1 2 a b "foo")
array[10]=bar

# 读取数组
echo ${array[3]} # => b
echo ${array[9]} # => 
echo ${array[10]} # => bar
echo ${array[*]} # => 1 2 a b foo bar
echo ${array[@]} # => 1 2 a b foo bar

# 读取数组长度
echo ${#array[*]} # => 6

# 读取字符串元素长度
echo ${#array[10]} # => 3

# 删除元素
unset array[1]
echo ${array[*]} # => 1 a b foo bar
echo ${#array[*]} # => 5

# 拼接数组
new_arr=(0 ${array[*]} z)
echo ${new_arr[*]} # => 0 1 a b foo bar z
echo ${new_arr[6]} # => z

# 删除数组
unset new_arr
echo $new_arr # => 
```

### 关联数组

Bash shell 中可以使用字符串作为数组的下标，类似 Map 对象

```bash
declare -A color
color["red"]="#ff0000"
color["green"]="#00ff00"
color["blue"]="#0000ff"

echo $color
```

# 条件

## if

```shell
if condition
then
  ...
elif condition2
then
  ...
else
  ...
fi
```

> 实际上，if 检测的是一条命令的退出状态。

<details>
<summary>Example</summary>

```shell
a=$[2*3]
b=$[1+5]
if [ $a == $b ]; then
    echo "a == b"
fi
```
</details>

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

<!--
# 循环

## for

## while

## until
-->

# 注释

以 `#` 开始的部分就是注释， sh里没有多行注释，只能每行加一个 `#` 号

# 参考资料

- [Shell 教程 - c语言中文网](https://wiki.jikexueyuan.com/project/shell-tutorial)
- [How do I split a string on a delimiter in Bash?](https://stackoverflow.com/q/918886/7736393)
- [shell中各种括号的作用()、(())、[]、[[]]、{}](https://blog.csdn.net/taiyang1987912/article/details/39551385)
