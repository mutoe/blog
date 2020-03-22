---
title: git 学习笔记
date: 2017-08-16 15:55:10
categories: 笔记
tags:
 - Git
---

# 用户

## 保存用户名密码

将用户名密码保存在硬盘中，而不用在每次 pull 或 push 时输入密码

``` bash
git config credential.helper store
```

请注意，这样保存下来的密码是明文的，使用 `cat ~/.git-credentials` 查看

# commit

## commit message

代码提交注释规范

feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动

# reset

| 参数 | 作用 |
| --- | --- |
| `--hard [commit id]` | 回滚到某个 commit 并抛弃所有改动 |
| `--mixed [commit id]` | 回滚到某个 commit 并将改动提交至暂存区 |
| `--soft [commit id]` | 回滚到某个 commit 并将改动恢复至工作区 |
