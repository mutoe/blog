---
title: 微信小程序开发问题集锦
date: 2019-05-15 10:08:54
categories: 心得
tags:
	- 微信小程序
---

这个帖子记录了本人在开发微信小程序时遇到的种种问题和坑, 供自己日后参考与备份.

# 小程序无法修改按钮边框样式

在微信小程序中对默认按钮组件 `<button>` 进行样式改写时, 无法修改默认对边框, 很难受

![无效的修改](https://static.mutoe.com/2019/button-border-in-wechat-miniprogram/before.png)

实际上广大网友也提供了解决办法, 就是在给 button 添加一个 `::after` 选择器, 修改 `::after` 的边框样式即可

![无效的修改](https://static.mutoe.com/2019/button-border-in-wechat-miniprogram/after.png)

``` css
button {
  border: none;
}
button::after {
  border: none;
}
```

# 小程序无法修改按钮禁用样式

修改原生按钮组件 `<button>` 的样式时, 无法对 `button[disabled]` 的样式进行改写.

**解决办法**

需要增加 `!important` 后缀
