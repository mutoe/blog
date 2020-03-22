---
title: 在输入框中显示 “@” 用户的选择框
date: 2019-03-28 17:08:11
categories: 心得
tags:
	- JavaScript
---

# 前言

不久之前接到一个需求，需要在输入框中输入“@”字符时，弹出一个选择框，显示被at的用户，没有输入任何内容时显示当前登录用户的好友，光标移动到被at的用户前后时，还需要整块删除。

第一时间想到的思路时使用 `<div contenteditable="true"></div>` 而非 `<textarea></textarea>` ，因为涉及到整块删除，将需要被删除的内容设置为 `display: inline-block;` 然后在删除就会整块删掉。

但是这样体验非常不好，有时候光标会莫名其妙错位，还没有办法解决（或许是我不知道怎么解决），眼看着交付期就要到了，就随便在网上找了一段代码改了一改，就放上去了，效果勉强还可以，但是后面一个需求没有实现，就是无法删除被at的用户一整块内容，但总比光标错位要好，因为要忙其他事情，这块需求就暂时告一段落了。

最近在重构该项目，又涉及到这部分内容，时间也稍微富裕了一些，所以就把以前糊弄过去的东西自己吃透，这样的话也对自己有个交代，毕竟糊弄自己的项目就是糊弄自己的技术，就是糊弄自己😳。

# 思路

首先整理一下我们的需求

1. 输入“@”字符时弹出用户选择框
2. 点选被 at 的用户时，弹出用户选择框
3. 弹出选择框需要跟随“@”字符的位置
4. 弹出选择框时按上下键选择，按回车键确认
5. 光标左右移动时如果移动到被 at 用户附近，则直接选中被 at 用户（可按下 `delete` 键删除被 at 用户）
6. 每输入一个字符，就向后端请求搜索用户，然后展示返回的结果在列表中，或显示没有找到该用户

# 1.输入“@”字符后弹出选择框

这个需求很简单，只需要在每次 `keyup` 时，检测输入框内容里有没有 `@` 字符即可，如果有就显示选择框

我们首先编写以下内容，编写整个需求的框架

<p class="codepen" data-height="256" data-theme-id="light" data-default-tab="html,result" data-user="mutoe" data-slug-hash="Bbgvqw" style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; padding: 1em;" data-pen-title="Bbgvqw">
  <span>See the Pen <a href="https://codepen.io/mutoe/pen/Bbgvqw/">
  Bbgvqw</a> by mutoe (<a href="https://codepen.io/mutoe">@mutoe</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

**因为项目是 vue 写的，所以以下内容围绕着 vue 组件来写，如果应用在其他项目，思路都是一样的，或者参考[底部的链接](#参考链接)**

<!-- more -->

# 参考链接

- [控制input输入框光标的位置](https://www.cnblogs.com/tugenhua0707/p/7434935.html) - cnblogs·龙恩0707

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
