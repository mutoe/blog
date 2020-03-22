---
title: 用 Javascript 将内容复制到剪贴板
date: 2019-03-25 15:00:11
categories: 心得
tags:
 - JavaScript
---

在 js 中，将内容复制到剪贴板的原理是利用 `document.execCommand()` 方法进行操作.

# document.execCommand()

`document.execCommand()` 的签名是这样的

``` js
bool = document.execCommand(aCommandName, aShwoDefaultUI, aValueArgument)
```

需要注意的是，该命令复制的内容是当前页面选中的内容.

<!-- more -->

## Return value

返回一个 `Boolean` 值，如果不支持或被禁用就返回false.

> 注意不要使用返回值来验证用户浏览器是否支持该方法.

## Parameters

### `aCommandName`

要执行的命令的名称. 我们使用复制方法时，该值为 `copy`.

> 所有支持的命令参见 [命令](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Commands)

### `aShwoDefaultUI`

指示是否应显示默认用户界面的布尔值。这在Mozilla中没有实现。（？？什么界面？？啥东西啊？？在说什么）

### `aValueArgument`

额外参数，有些命令才会需要到。


## 兼容性

> from [Caniuse](https://caniuse.com/#feat=document-execcommand)

![docuemnt.execCommand-compatibility](//static.mutoe.com/2019/copy-content-to-clipboard-in-javascript/docuemnt.execCommand-compatibility.png)

## Usage

``` html
<input id="demoInput" value="hello world">
<button id="btn">点我复制</button>
```

``` js
const btn = document.querySelector('#btn')
btn.addEventListener('click', () => {
  const input = document.querySelector('#demoInput')
  input.select()
  if (document.execCommand('copy')) {
    console.log('复制成功')
  } else {
    console.log('复制失败')
  }
})
```

如我我们想要复制的不是输入框内的东西呢？我们来创建一个输入框再复制即可

``` js
const btn = document.querySelector('#btn')
btn.addEventListener('click', () => {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.setAttribute('value', '复制我')
  input.select()
  if (document.execCommand('copy')) {
    console.log('复制成功')
  } else {
    console.log('复制失败')
  }
  document.body.removeChild(input)
})
```

# 坑

> 感谢 [@axuebin](https://github.com/axuebin) 提醒

- 在 IOS 下会出现白屏抖动 😡

  是因为先拉起了又收回了键盘. 解决办法，在代码中添加 `input.setAttribute('readonly', 'readonly')` 设置 `input` 为只读即可.

- 在 IOS 下无法复制 😡

  是因为 `input.select()` 在 IOS 下没有选中全部内容. 我们使用 `input.setSelectionRange(0, input.value.length)` 即可.

# 参考链接

- [JavaScript复制内容到剪贴板 - GitHub·axuebin](https://github.com/axuebin/articles/issues/26)
