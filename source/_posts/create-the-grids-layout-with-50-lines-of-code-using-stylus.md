---
title: 用 stylus 写一个 50 行代码的栅格化布局
date: 2018-03-24 02:24:20
categories:
  - 教程
tags:
  - stylus
---

相信前端的同学们已经接触过栅格化布局了, 只要你用过 bootstrap 或者一些其他的 css 框架.

栅格化布局是一个非常方便的布局方式, 尤其是它的自适应布局, 可以根据屏幕大小缩放容器的宽度.

![preview](//static.mutoe.com/2018/create-the-grids-layout-with-50-lines-of-code-using-stylus/preview.png '图片来自 ElementUI Layout')

今天我们用一个 css 预处理器 stylus 来编写一个 __只有 50 行代码__, 能自定义栅格数, 能响应多个断点, 能推能拉的栅格化布局!

## 代码解析

``` stylus
$cols = 12      // 自定义栅格数
$query = {      // 自定义断点
  normal: '',
  xs: 'max-width: 768px',
  sm: 'min-width: 768px',
  md: 'min-width: 992px',
  lg: 'min-width: 1200px',
  xl: 'min-width: 1920px',
}

media($class = '')
  $class += '-' unless $class == ''

  .el-col-{$class}0
    display none

  for $c in 1..$cols
    $percent = (100 / $cols * $c)%

    .el-col-{$class}{$c}
      width $percent
    .el-col-{$class}offset-{$c}
      margin-left $percent
    .el-col-{$class}pull-{$c}
      position relative
      right $percent
    .el-col-{$class}push-{$c}
      position relative
      left $percent

.el-row
  position relative
  box-sizing border-box
  
  &::after
    clear both

[class*="el-col-"]
  float left
  box-sizing border-box

for $k, $v in $query
  if $k == 'normal'
    media()
  else
    @media only screen and ({$v})
      media($k)

```

去除那些空行, 这段代码只有 39 行, 为了方便阅读, 所以加上一些空行.

下面我将逐行为大家解释这段代码, 请善用右侧导航栏进行跳转.

### :1 `$cols = 12`

这里声明了一个变量, 用来定义栅格数. 在 stylus 中, 变量无需 `$` 字符开头, 但本人为了区分这是自定义变量, 习惯在变量前加该字符.

### :2-9 `$query = {...}`

这里声明了一个对象 ( Hash 数组 ), 键名为 class 缩写, 键值为 media query 条件 (第一行除外).

### :11 `media($class = '') {...}`

这里声明了一个方法, 用于创建某个 media query 条件下的栅格布局.

该方法含有一个参数, 该参数用于给栅格化布局增加响应式断点, 默认值为空. 该参数为空时表示无自适应布局时的条件

### :12 `$class += '-' unless $class == ''`

这里给自适应类增加后缀 `-`, 用于接下来将变量作为插值拼接到 class 名中

### :14-15 `.el-col-{$class}0`

这一行就是将变量 `$class` 作为差值拼入 class 名中了

如果 `$class = ''`, 则生成代码为 `.el-col-0`, 如果 `$class = 'xs'`, 则生成代码为 `.el-col-xs-0`. 插值是不是很方便?

### :17 `for $c in 1..$cols`

这里使用了一个迭代 (Iteration, 也可以叫做循环). 意思是将 `$c` 作为循环变量, 从 `1` 到 `$cols` 进行循环.

界限操作符 `1..5` 意思是从 1 开始, 一直到 5

范围操作符 `1...5` 意思是从 1 开始, 到 4 (不含 5) 结束

### :18 `$percent = (100 / $cols * $c)%`

这里声明了本次循环中的变量 `$percent`, 有两个注意点.

在 stylus 中计算属性最好将其用圆括号 `()` 包裹起来, 避免某些情况下编译器将其理解为多个值, 如 `border-raidus: 4px / 2px;`.

`(expr)%` 的意思是将 expr 表达式强行加个单位, 是内置函数 `unit(expr, '%')` 的语法糖

### :20-29 `.el-col-{$class}{$c}`

这里就开始循环声明 class 了, 设置栅格宽度, 设置偏移量, 设置推拉. 同样使用了变量插值.

### :31-36 `.el-row`

所有声明完毕后, 从这一行开始实际生成 css. 

没什么多说了的, 栅格容器. 设置清除浮动.

### :38-40 `[class*="el-col-"]`

这里使用了 css 的属性选择器, 选择以 `.el-col-` 开头的元素, 为其设置浮动和盒模型.

### :42-47 `for $k, $v in $query`

遍历 `$query`, 将所有断点取出来. 然后判断如果键名为 `normal` (`$query` 的第一个键值对), 则调用无参的 `media()` 方法. 否则生成相应断点和 media query 的方法.

## 最终生成的 css 代码

[codepen 在线查看](https://codepen.io/mutoe/pen/JLyGVa)

![preview](//static.mutoe.com/2018/create-the-grids-layout-with-50-lines-of-code-using-stylus/preview-stylus.png)

## 参考链接

[ElementUI - Layout 布局](http://element-cn.eleme.io/#/zh-CN/component/layout) 灵感来自其 sass 源码

[张鑫旭 - stylus中文版参考文档](http://www.zhangxinxu.com/jq/stylus/)
