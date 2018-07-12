---
title: 如何用好 git
keywords: [git, 技巧, tips]

date: 2017-07-12 23:52:35
categories: 心得
tags:
 - Git
---

自己在使用 git 的过程中遇到了不少问题, 最终我都会花时间把它们解决. 这里记录下我遇到这些场景时的解决办法, 并总结一下各种方法的优缺点, 让大家少走点弯路.

# 使用案例

## 正在做一个功能, 这时临时需要做别的修改

你可能会遇到这种情况: 当你正在做一个功能(feature-A)时, 这个功能并没有开发完, 但这时有同学喊你紧急修复一个线上 bug 或者要你 pull 一下代码. 这种情况下你会怎么做呢 ?

- A.
    ``` bash
    git add .               // 将当前改动提交至暂存区
    git commit -am "save"   // "保存"一下这些改动
    git checkout master     // 切换到 master 分支
    // some change commit
    git push origin master  // 修复完成后提交
    git checkout feature-A  // 切换回功能分支继续开发
    ```
- B.
    ``` bash
    git add .
    git commit -am "temp"   // 临时"保存"一下这些改动, 因为我最后会撤销它
    git checkout master
    // some change commit
    git push origin master
    git checkout feature-A  // 切换回开发分支
    git reset --mixed HEAD^ // 撤销上一次提交并恢复工作区
    ```

- C.
    ``` bash
    git stash               // 存储工作区和暂存区
    git checkout master
    // some change commit
    git push origin master
    git checkout feature-A  // 切换回开发分支
    git stash pop           // 还原工作区和暂存区
    ```

### 正确姿势

C. 使用 `git stash` 功能

<!-- more -->

`git stash` 用来将当前工作区和暂存区的内容存储起来并清空它们. 以便于你进行其他操作 ( 如 pull / checkout 等)

[Git Stash 用法 - subchen](https://gist.github.com/subchen/3409a16cb46327ca7691)

> ### git stash 用于保存和恢复工作进度

> * `git stash`
    保存当前的工作进度。会分别对暂存区和工作区的状态进行保存

> * `git stash save "message..."`
    这条命令实际上是第一条 `git stash` 命令的完整版

> * `git stash list`
    显示进度列表。此命令显然暗示了 `git stash` 可以多次保存工作进度，并用在恢复时候进行选择

> * `git stash pop [--index] [<stash>]`
    如果不使用任何参数，会恢复最新保存的工作进度，并将恢复的工作进度从存储的工作进度列表中清除。
    如果提供 `<stash>` 参数（来自 `git stash list` 显示的列表），则从该 `<stash>` 中恢复。恢复完毕也将从进度列表中删除 `<stash>`。
    选项 `--index` 除了恢复工作区的文件外，还尝试恢复暂存区。

> * `git stash apply [--index] [<stash>]`
    除了不删除恢复的进度之外，其余和 `git stash pop` 命令一样

> * `git stash clear`
    删除所有存储的进度


# 未完待续

## push 代码的时候被拒绝, pull 的时候有冲突

## 查看 commit log 的时候很乱, 做 code review 的时候没有头绪
