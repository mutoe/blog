---
title: 为什么要上 TypeScript
date: 2019-07-15 19:47:26
categories: 心得
tags:
  - TypeScript
---

“TypeScript 又是什么东西啊, 怎么又在出新语言, 求不要再出了, 学不动了!!”

## 场景1 -- 检查类型

开心的撸代码中, 突然接到老大消息: xxx离职了, 现在你来接手他维护的项目.😳

拿到代码后, 看到了这段东西

``` js
/** 根据用户id获取用户信息 */
async function getUsers(id) {
  const users = await fetchUsers(id)
  return users
}
```

这个 `id` 是什么? 是  `1` 还是 `"1"` 还是 `[1,2,3]` 还是 `"1,2,3"` ???

这个 `users` 又是什么? 是普通权限用户? 还是管理员看到的用户?

全局搜索了一下调用该方法的地方, 发现这是个“万能”的方法, 传入 id 为 `1` 时会返回 1 号用户的不含私密信息的对象

传入 `[1,2,3]` 或 `"1,2,3"` 时会获取一个数组 

![[掀桌]](//static.mutoe.com/xianzhuo.jpg)

----

如果上了ts

![](//static.mutoe.com/2019/why-typescript/example-1-ts.gif)

<!-- more -->


## 场景2 -- 查函数使用方法

开心的撸代码中, 突然接到老大消息: xxx离职了, 现在你来接手他维护的项目.😳

拿到代码后, 看到了这段东西

![](//static.mutoe.com/2019/why-typescript/example-2-js.png)

![[掀桌]](//static.mutoe.com/xianzhuo.jpg)

----

如果上了ts

![](//static.mutoe.com/2019/why-typescript/example-2-ts.gif)


## 场景3 -- 重构变量

开心的撸代码中, 突然接到老大消息: xxx离职了, 现在你来接手他维护的项目.😳

拿到代码后, 看到了这段东西

![](//static.mutoe.com/2019/why-typescript/example-3-js.png)

现在后端要将 `topic` 返回的 `name` 修改成 `title`

![](//static.mutoe.com/2019/why-typescript/example-3-js-1.gif)

![[掀桌]](//static.mutoe.com/xianzhuo.jpg)

----

如果上了ts

![](//static.mutoe.com/2019/why-typescript/example-3-ts.gif)

## 快上 TypeScript 吧

老大: “可以呀, 别人改这些都要半天你只需要几分钟, 升职加薪就是你啦!”

哇哈哈哈哈! 真香!
