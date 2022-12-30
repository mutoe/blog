---
title: Docker 学习心得
date: 2019-11-14 13:58:15
update: 2022-10-22 19:45:36
categories: 心得
tags:
  - Docker
---

## 文件共享

### 文件挂载

如果你想将宿主机中的文件或目录挂载至容器中，可以在启动容器时使用 `--volume` 或 `-v` 参数.

> `--volume|-v <host_path>:<container_path>[:permission]`  
>
> `host_path` 为要挂载的宿主机目录路径，必须为绝对路径  
> `container_path` 为挂载在容器中的目标路径  
> `permission` 为挂载目录的权限，默认为读写 `rw`; 可指定为只读 `ro`  

一些例子

```bash
# 将宿主机的 Downloads 目录挂载在容器的 `/var/downloads` 中
docker run -v /home/$(whoami)/Downloads:/var/downloads ubuntu /bin/bash
# 挂载时指定为只读模式
docker run -v /var/log:/var/host_log/*:ro ubuntu /bin/bash
```

### 从容器中复制文件到宿主机

如果你想将容器中的文件复制到宿主机中，可以使用 `docker cp` 命令

> `docker cp <container_id>:<container_source_path> <host_target_path>`
> `container_id` 容器 ID
> `container_source_path` 要拷贝容器内文件的路径
> `host_target_path` 要放置在宿主机内的路径

一些例子

``` bash
# 将容器 nginx 中的配置文件复制到宿主机的家目录中
docker cp nginx:/etc/nginx/nginx.conf $HOME
```

### 从宿主机复制文件到容器中

从宿主机复制文件到容器中可以使用 [文件挂载](#文件挂载) (`--volume`) 的方法，但这种方法不能在运行中的容器中使用，如果你真的想这么做，也有一些稍微麻烦些的办法。

1. 将宿主机的文件系统直接挂载在容器内，可以参考这篇文章 [http://dockerone.com/article/149](http://dockerone.com/article/149)

2. 先将容器中需要备份的文件使用 `docker cp` 复制出来，然后重新运行该容器并使   用 `docker run --volume` 挂载文件.

3. 通过 sshfs 挂载文件目录.

4. 先将容器停掉，然后使用 `docker commit` 创建一个新的镜像，最后启动该镜像进行文件挂载.

## 通信

### 容器间通信的一些 Q&A

1. 如果不声明 `network` 字段, 在同一个 docker compose 之间可以通信吗？

    **可以**。

    > 如果不指定一个特定的 network, docker 会指定容器在一个名为 `docker0` 的默认网桥中

2. 如果不声明 `expose` 选项, 那么同一网络中的其他容器可以访问该容器吗？

    **可以**。

    > 但如果启动docker守护进程时指定了`--icc=false`选项，则不可以。  
    > **建议声明**, 声明该选项有助于使用者了解容器内暴露了那些端口出来供使用。

3. 在同一个网络中不同的容器使用了同一个端口会有冲突吗？

    **不会**。

    > 不同的容器使用不同的 host, 所以哪怕两个容器使用了同样的端口，也不会与其他容器冲突。

4. `expose` 和 `ports` 字段有什么区别？

    如果容器内的端口需要在宿主环境访问，则需提供 `ports` 字段

    `expose` 字段在**默认情况**下是可选的，即使不声明也可以在同一个网络中使用该容器的端口

## 容器相关

### 健康检查

> [HEALTHCHECK 官方文档](https://docs.docker.com/engine/reference/builder/#healthcheck)

如果你想知道容器内应用是否被正常启动了，你可以在启动时指定健康检查测试相关参数.

比如你在启动一个 web 应用容器后，开开心心准备用这个服务，却发现访问不到，启动成功了但没有完全成功，有点气人。

这时候你可以通过设置健康检查命令 `curl -f http://localhost:8080 || exit 1` 来检查应用真的启动了，而不是因为各种原因导致容器启动了但是内部的应用没启动成功，而造成一种成功了的假象。

用于健康检查的测试命令会在容器内执行，命令退出代码为 `非零` 或超时没有成功则视为测试失败，等待下一次测试。

| 参数  | 作用 (涉及时间的选项均可指定 秒:`s` 分:`m` 时:`h` 等)  |
| ----- | :--------------------------- |
| `interval` | 执行测试间隔时间。默认 30s                  |
| `timeout`| 超时时间，执行测试如果超过了这个时间，则视为失败。默认 30s|
| `retries`| 重试次数，如果测试连续失败次数如果超过了该值，则容器健康状态会被置为不健康 (`unhealthy`)|
| `start_period`| 在容器启动多久之后开始第一次检查。默认 0s |

在 `Dockerfile` 中的用法示例

```Dockerfile
HEALTHCHECK --interval=10s --timeout=3s \
  CMD curl -f http://localhost:8080/health || exit 1
```

在 `docker-compose.yml` 中的示例

```yml docker-compose.yml
version: '3.8'
services:
  grafana:
    image: grafana/grafana
    healthcheck:
      test: wget -nv -t1 --spider http://192.168.5.1:3000 || exit 1
      interval: 1m
      retries: 3
      start_period: 10s # 需要 version >= 3.4

  loki:
    image: grafana/loki
    depends-on:
      grafana: # 条件语法需要 version >= 3.8
        condition: service_healthy # 在 grafana 健康检查通过后才启动该容器
```

> 在 `docker-compose.yml` 中使用时
>
> - 会覆盖镜像中自带的健康检查命令
> - `start_period` 参数需要 `version >= 3.4`
> - 可根据容器的健康状态来成为 `depends-on` 执行条件(条件语法需要 `version >= 3.8`)

设置了健康检查后，会在容器列表中看到一列多的内容 

```bash
docker ps
```

![health check docker ps](https://static.mutoe.com/2019/docker-study-note/docker-health-check-ps.png)

还可以在 docker inspect 中帮助排查问题 

```bash
docker inspect --format '{{json .State.Health}}' loki | jq .
```

![health check docker inspect](https://static.mutoe.com/2019/docker-study-note/docker-health-check-inspect.png)

需要注意的是，健康检查的测试命令会在重启内执行，所以测试命令容器内可执行。比如在 `alpine` 版本的镜像中是不含 `curl` 程序的，这时你可以用 `wget` 来代替。

一些连通性检查的例子

```bash
# 检查 本机 8080 端口是否能连通
curl -f http://localhost:8080 || exit 1

# 在 alpine 镜像中检查 8080 端口是否能连通
wget -nv -t1 --spider http://localhost:8080 || exit 1

# Loki 中检查是否启动成功 (Loki 的 health check API 很奇怪，wget with --spider 时会报 405，只好另辟蹊径)
# Update: 是因为 wget with --spider 会先发送一个 HEAD 请求，Loki 不认
[ "$(wget -nv -t1 -o /dev/null -O - http://localhost:3100/ready)" = "ready" ] || exit 1
```


## 参考文章

- [已经启动的 Docker 容器如何挂载目录？ - SegmentFault](https://segmentfault.com/q/1010000020514283)
