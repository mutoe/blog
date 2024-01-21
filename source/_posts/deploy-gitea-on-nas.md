---
title: 在 NAS 上部署 Gitea
date: 2024-01-21 16:11:25
categories: 教程
tags: 
- 家庭网络
- NAS
- 群辉
- Git
- Gitea
- Docker
---

处于某种原因，需要自己部署一个 Git 仓库管理工具来管理和部署一些奇怪的家庭服务，虽然 GitHub private repository 也可以用，但因为这些平台都中心化的，会受制于人，速度可可靠性也不太理想，在外网做家庭服务的持续部署也比较麻烦，所以就想到了自己部署一个 Git 仓库管理工具，想怎么玩就怎么玩。 

为什么不选择装 GitLab 而是 Gitea，因为 GitLab 的硬件要求太高了，而且我只是想要一个简单的 Git 仓库管理工具，不需要多人协作也不需要很多复杂的功能，Gitea 足够了，最低只需要 1 核和 2G 内存，所以选择了 Gitea。

虽然群辉 NAS 自带了 Gitea 的社区套件，之前也一直在用。但是它的版本已经落后于官方好几个版本了，所以这里选择自己用 Docker 部署一个最新版的 Gitea，也方便后续升级和折腾。

注：以下教程图示是群辉 NAS 的安装界面。如果你是其他 NAS 品牌的用户，可以参考自己对应品牌的 Docker 安装界面或是直接使用命令行或 [使用 Gitea 的官方 docker compose](https://docs.gitea.com/zh-cn/installation/install-with-docker) 进行安装，也可以参考我安装的思路。

<!-- more -->

# 1. 创建共享目录

首先我们需要创建仓库相关的目录，用于存放 git 仓库。

分离 Gitea 和 Git Repositories 的好处是，当 Gitea 升级或者毁坏后，仓库还在，不会丢失。

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/create-shared-folder-git.png)

一路下一步，用户权限可以先跳过，下面我们会把 docker 组和 gitea 用户赋予此目录的权限。

# 2. 创建 Docker 用户组

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/create-docker-group.png)

```bash
sudo groupadd docker
```

下一步选择成员，可以跳过，因为我们会在下一步我们把 gitea 用户加入到 Docker 用户组中。

再下一步分配目录权限，我们将系统自带的 `docker` 目录和刚才创建的 `git` 目录都分配给 `docker` 组，并且设置为可读写。

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/assign-folder-permission-to-docker-group.png)

下一步配额可以根据自己的需要进行设置，这里我选择跳过。

在下一步选择分配应用程序权限，我们选择拒绝任何程序权限，因为该用户组下的用户没有使用应用的场景。

再下一步设置群组速度限制，我们也跳过。

最后你会看到一个确认页面，确认无误后点击完成。

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/confirm-create-docker-group.png)

# 3. 创建 Gitea 用户

接下来我们创建 `gitea` 用户，后续 gitea 容器会使用这个用户来运行。

gitea 作为系统用户，密码可以随意设置，后面我们不会用这个用户进行登陆，如果实在需要也可以重置密码。

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/create-gitea-user.png) 

该用户需要加入刚才创建的 `docker` 用户组，这样才能访问到 docker 目录。

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/user-gitea-join-docker-group.png)

然后禁止此用户访问其他共享目录，只允许访问 `docker` 和 `git` 目录。（确保这两个目录拥有可读写权限，因为是继承自 docker group，所以应该自动拥有了这两个目录的读写权限）

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/gitea-user-directory-permission.png)

接下来用户配额、用户限速可以根据你自己的需求自行调整，应用程序权限同样选择跳过。然后确认你最后的配置，点击完成。

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/confirm-create-gitea-user.png)

然后登陆到 ssh 终端，获取 `gitea` 用户的 UID 和 `docker` 组的 GID

```bash
mutoe@ds918:~$ id gitea
uid=1029(gitea) gid=100(users) groups=100(users),65538(docker)
```

# 4. 下载镜像

![Docker search gitea image](https://static.mutoe.com/2024/deploy-gitea-on-nas/docker-search-gitea-image.png)

> 镜像版本选择 `:1` 是因为 `:latest` 会是基于最新的开发版，可能会有不稳定的情况。

# 5. 创建容器

根据刚才下载好的镜像创建对应的容器

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/create-gitea-container-from-image.png)

网络选择默认的 `bridge` 模式

容器名称输入 `gitea` 或者自己喜欢的名字, 勾选启用自动重启，这样当 NAS 重启后容器也会自动启动。然后点击高级设置，新增 2 个环境变量：`USER_UID` 和 `USER_GID`，这两个环境变量分别对应刚才获取到的 `gitea` 用户的 UID 和 `docker` 组的 GID。

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/set-gitea-container-path-variables.png)

端口设置，将容器的 22 端口映射到 NAS 的 4022 端口，这样我们未来就可以通过 ssh 来推送代码了。  
然后将容器的 3000 端口映射到 NAS 的 4000 端口，这是以后访问 Gitea 的网页地址。

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/gitea-container-port-map.png)

下一步挂载卷，这一步我们在 `docker` 目录中创建 Gitea 的工作目录，然后在 `git` 目录中创建 Gitea 的仓库目录，最后将这两个目录挂载到容器中。
另外官方文档中还推荐映射 `/etc/timezone` 和 `/etc/localtime`，这样容器内的时间才会和 NAS 一致。不过群辉的这个可视化界面中无法找到 `/etc` 这个系统目录，所以这里就不做映射了。 

> 如果这一步找不到 docker 目录，就去共享文件夹设置里确认一下当前用户对 `docker` 目录是否有可读写权限。因为默认情况下，当前用户应该属于 administration 用户组，不排除有些用户没有权限。

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/setup-gitea-container-volumn.png)

确认一下各项配置

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/confirm-create-gitea-container.png) 

点击完成后稍等几十秒，容器就会启动了。
 
# 6. 配置 Gitea

容器启动后，访问 `http://your-nas-ip:4000` 进入 Gitea 的配置页面。注意修改 SSH 端口和 HTTP 服务端口，参考下图。

服务器域名填写你的 nas 地址，我这里后面会做反向代理，所以添了单独的域名。你可以根据自己的需要自行填写。

需要注意的是，ssh 服务端口和 http 服务端口不需要修改，这是容器内的地址。

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/configure-gitea.png)

点击确认后稍等几分钟，你就应该能看见成功后的页面了

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/succeed.png)

Gitea 1.19 后的 Gitea Actions 也可以使用了 😄

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/gitea-actions.png)

创建一个仓库后，确认下 volume 目录是否有对应的目录。这样一旦后面 gitea 需要升级或者毁坏后，至少仓库还在。

![](https://static.mutoe.com/2024/deploy-gitea-on-nas/git-repository-volume.png)

到这里，所有的配置都已经完成了，你的 Gitea 已经可以正常使用了。但美中不足的是我们需要在访问 Gitea 时输入端口号，使用 SSH 克隆仓库时也需要加对应的端口号，这样不太方便。

如果我们需要把端口号去掉的话，需要做一些额外的设置，他们分别是 DNS 解析和反向代理。这是个比较独立的话题，感兴趣的话后面我可以单独写一篇文章来介绍。

# 参考资料

- [使用 Docker 安装 - Gitea](https://docs.gitea.com/zh-cn/installation/install-with-docker)
- [使用群晖部署Gitea服务 - 北远山村](https://northfar.net/deploy-gitea-on-synology/)
- [Synology搭建Gitea(Docker) - gaoyang3513](https://blog.csdn.net/gaoyang3513/article/details/129210211)



