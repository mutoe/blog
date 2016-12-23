---
title: 在 Git 中使用模版来管理配置文件
date: 2016-12-23 22:39:39
update: 2016-12-23 23:54:50
tags:
 - Git
---

不知道你们在开发一个项目中有没有遇到过这种情况: 项目小组一起开发一个项目, 建立了一个配置文件用于项目中, 但是在开发阶段每个人本地数据库都不同, 所以修改数据库连接部分的配置后会将自己修改过的配置上传到 Git 库中, 比如 `config.php`, 其他人 pull 的时候就会把他自己本地的数据库配置给覆盖了, 像下面这样.

``` php
<?php
// 项目配置文件
return [
    'project' => [
        'name'      => 'foo',
        'version'   => 1.0.0,
    ],
    // ...
    'database' => [
        'host'      => '127.0.0.1',
        'db_name'   => 'foo',
        'db_user'   => 'bar',
        // ...
    ]
];
```

首先想到的办法是将配置文件中 'database' 部分移入另外一个文件, 比如 `database.php`, 然后将这个 `database.php` 加入到 `.gitignore` 的列表中.

这样导致的问题就是如果使用 `.gitignore` 将 `config.php` 加入到忽略列表中, 然后我们在文档中添加一段说明, 让其他开发者将这段代码放在 'config.php' 同级目录下的 'database.php' 中 ( 请注意, 加入到 `.gitignore` 中的文件是不接受版本控制的, 也就是说其他开发者下载后是没有 `database.php` 这个文件的 ).

你可能意识到了, 这样做虽然是一种办法, 但是感觉还是有些麻烦, 我想建立一个类似模版的文件, 开发者只需要获得模版, 而不需要这个文件后续的版本控制. 我从 segmentfault 社区找到了一个 "解决办法".

> @FatGhosta :
> 已经维护起来的文件，即使加上了gitignore，也无济于事。
> 用下面这个命令：
> ``` bash
  git update-index --assume-unchanged logs/*.log
  ```
> 这样每次提交就不会出现logs下面的文件了

这条命令会让 `logs/*.log` 文件们暂时不接受 Git 控制, 是一个伪标记.
我试了一下这个办法, 将默认的 `database.php` 放置在版本库中, 上传到仓库, 然后执行这条命令, 再修改本地数据配置, 似乎用着很方便, 是我想要的结果.

``` bash
git update-index --assume-unchanged config/database.php
```

但是随着投入使用, 似乎还是有点小麻烦, 这条命令需要每个人在本地都执行一遍, 那还不如直接建立配置文档, 反正都不能直接用, 况且 `git update-index --assume-unchanged` 这条命令的正确用法也不是这样.

## 解决办法

一番摸索之后, 又回到了 segmentfault 社区, 在评论区找到了比较合理的解决办法, 到目前为止, 我也正在这么用.

__建立一个 `database.php.example` 文件, 然后将 `database.php` 加入到 `.gitignore` 忽略列表中, push 到公共仓库.__

使用时复制一个 `database.php.example` 文件并改名为 `database.php`. 这样配置文件就不会重新上传到公共仓库了.

## 参考资料
* [git忽略已经被提交的文件](https://segmentfault.com/q/1010000000430426) - SegmentFault
