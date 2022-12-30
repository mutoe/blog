---
title: vimdiff - 命令行中解决冲突的利器
date: 2022-10-10 10:05:11
categories: 心得
tags:
  - Vim
  - Git
---

在使用 git 的过程中，有时候你在解决冲突的地方非常凑巧没有编辑器、没有可视化的工具来让你方便的解决冲突（这可能是在你在服务器bash中、可能是临时解决个小冲突不想启动IDE、或是仅仅觉得在命令行中解决冲突很酷炫）。这时候我们只能想办法打开这个文件手动解决冲突。

<!-- ![一张有冲突的文件的代码图]() -->

如果你不想手动编辑文件解决冲突也不想/不能打开任何可视化工具的话，这篇文章将介绍到的 vimdiff 工具或许能够帮到你。

<!-- ![一张 vimdiff 正在解决冲突的图]() -->

**学前须知：**
该文章仅面向闲的蛋疼的 vim 进阶学者编写，新手请尽快驶离 🚑。浏览该文章前，请确保：

- 你能熟练的使用 vim
- 你充分了解 git 的工作流程 (如“如何解决冲突”，如何设置 git 配置等)
- 你还能起来学

如果你继续阅读，我们默认您接受了以上条款。 :)

<!-- more -->

| 命令                  | 作用                                           |
| --------------------- | ---------------------------------------------- |
| `:wqa`                  | 保存并退出                                           |
| `:cq`                 | 放弃合并，该命令会以非零状态(non zero)退出  |
| `[c` / `]c`                 | 跳转到上一处/下一处 change  |

> 如果你使用 `:cq` 退出被标记了已解决，则可增加以下配置。
>
> ```config ~/.gitconfig
> [difftool]
>     # Be able to abort all diffs with `:cq` or `:cquit`
>     trustExitCode = true
> ```

## temporary `.orig` file

如果你在使用 vimdiff 解决冲突后出现了 `.orig` 文件，在你提交后可以将该文件安全的删除掉。

该文件是解决冲突前的文件备份，只需将 `.orig` 后缀移除即可恢复。但个人感觉其实这个文件用处不大，一般解决冲突如果出现问题我一般会重新操作一遍，当然如果你的冲突比较多，这个orig备份文件还是能稍稍增加一些容错率。

你可以将 `*.orig` 文件加入 `.gitignore` 忽略掉，也可以执行以下命令关闭该文件生成。

``` bash
git config --global mergetool.keepBackup false
```

如果你想清理项目下的 orig 文件，可以选择使用下面两种方法。

``` bash
git clean -n *.orig
git clean -f *.orig

# or

find . -name \*.orig 
find . -name \*.orig -delete
```

> [vimdiff cheat sheet](https://gist.github.com/mattratleph/4026987)
