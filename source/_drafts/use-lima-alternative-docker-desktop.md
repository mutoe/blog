---
title: 用 Lima 代替 Docker Desktop
date: 2022-01-11 17:09:49
categories: 心得
tags:
  - Docker
  - Lima
---

太长不看版：

1. 卸载 Docker Desktop
2. `brew install docker docker-compose lima`
3. `limactl start`
4. 选择自定义配置

Docker desktop 终于忍不住要收费了，

lima: https://github.com/lima-vm/lima
----
brew install lima
limactl start

docker配置 https://github.com/lima-vm/lima/blob/master/examples/docker.yaml

## 报错 `docker-credential-desktop not installed or not available in PATH`

https://stackoverflow.com/questions/67642620/docker-credential-desktop-not-installed-or-not-available-in-path

## 端口转发
