---
title: 给 NAS 上的应用配置域名并去除端口号
date: 2024-01-21 23:56:25
categories: 教程
tags:
- 家庭网络
- Openwrt
- NAS
- 群辉
- DNS
- 反向代理

---

在上一篇文章 [在 NAS 上部署 Gitea](/2024/deploy-gitea-on-nas/) 中，我教大家如何在内网中部署 Gitea 服务。但是，我们在内网中访问 Gitea 时，需要使用 `http://192.168.5.5:4000` 这样的地址，这样的地址不仅不美观，而且还需要记住端口号，不方便，甚至它还不是 HTTPS 的，也不安全。

那有没有什么办法可以让我们在内网中访问 Gitea 时，使用 `https://gitea.lan` 这样的地址呢？答案是肯定的，我们可以使用 DNS 和反向代理来实现这个功能。

# 1. 什么是 DNS

DNS 是 Domain Name System 的缩写，即域名系统。它的作用是将域名解析为 IP 地址，这样我们就可以通过域名访问网站了。

我们首先要做的一件事就是在 DNS 服务器中添加一条记录，将 `gitea.lan` 解析到 `192.168.5.5` 这个 IP 地址上。这样当我们访问这个域名时，就会将请求转发到我们的 NAS 服务器上对应的端口了。 

DNS 服务器是一个树形结构，当你输入一个域名时，DNS 服务器会从最底层的节点向上查找，直到根节点，然后返回对应的 IP 地址。每个节点都缓存有一堆域名和与其对应的 IP 地址。

例如，当我们访问 `https://gitea.lan` 时，DNS 服务器会：

1. 先从浏览器中尝试获取缓存的 IP 地址
2. 如果没有缓存，就会向本机的 DNS 服务器发起请求尝试获取缓存的 IP 地址
3. 如果本机的 DNS 服务器没有缓存，就会尝试向路由器发起请求尝试获取缓存的 IP 地址
4. 如果路由器没有缓存，就会向上级 DNS 服务器（通常是运营商，如中国电信）发起请求尝试获取缓存的 IP 地址
5. ... 以此类推，直到根 DNS 节点 

<!-- more -->

# 2. DNS 服务器的配置

聪明的你一定已经发现了，如果我们的 Gitea 服务部署在内网的 NAS 上，那么我们的 DNS 服务器就应该是路由器中，是可以被我们控制并且可以影响到内网中所有设备的。

一般家庭网络中的路由器都会支持 DNS 解析，你可以在网上查找你路由器的型号，然后搜索 `型号 DNS`，就可以找到你的路由器的 DNS 配置方法了。

这里我以我的 OpenWRT 软路由为例，介绍一下 DNS 的配置方法。

![](https://static.mutoe.com/2024/setup-domain-and-remove-port-for-nas-app/set-dns-for-gitea.png)

对，就是这么简单。

访问 `http://gitea.lan`，发现可以正常路由到 NAS 的 80 端口了，于是我们可以访问 `http://gitea.lan:4000`，OK，Gitea 服务也也能正常访问了。接下来我们就要解决端口的问题了。

# 3. 什么是反向代理

我们知道，服务器中每个端口只能被一个应用程序监听，如果我们想要在同一个服务器上部署多个应用程序，就需要使用不同的端口。但是，我们在访问网站时，如果不加端口号，那么浏览器会默认使用 80 端口（HTTPS 是 443 端口），这样就会导致我们无法访问到我们想要的应用程序。

所以，我们需要一个工具，它可以将我们的请求转发到不同的端口，这就是反向代理。我们将反向代理部署在 80 和 443 端口，然后根据请求的域名，将请求转发到不同的端口，这样我们就可以使用域名访问不同的应用程序了。

# 4. 配置反向代理

这里我使用的是群辉自带的反向代理工具，它的配置非常简单，只需要在群辉的控制面板中打开反向代理功能，然后添加一条规则即可。

在 `控制面板` -> `登陆门户` -> `高级` -> `反向代理服务器` 中添加一条记录：

将来自其他机器的 `https://gitea.lan` 的请求转发到 `http://localhost:4000` 上 

![](https://static.mutoe.com/2024/setup-domain-and-remove-port-for-nas-app/set-reverse-proxy-for-gitea.png)

> 如果勾选 `启用 HSTS`，那么浏览器会强制使用 HTTPS 访问，但是这样会导致我们无法使用 HTTP 访问，所以看你的具体情况来决定是否勾选。

以此类推，你可以增加更多的规则，将不同的域名转发到不同的端口，这样就可以在内网中使用域名访问不同的应用程序了。

# 5. 证书问题

如果你使用的是群辉自带的反向代理工具，那么你不需要担心证书的问题，因为群辉会自动为你生成证书。而我们只需要在本机信任该证书即可。不同浏览器和操作系统信任自签证书的方法不同，你可以自行搜索或问 GPT。（搜索关键字："chrome 如何信任自签证书"）

# 6. 群辉反向代理的问题

接下来遇到的问题是，每当我访问 `https://gitea.lan` 时，总会被自动重定向到 `https://gitea.lan:5001`，这是群辉的默认 HTTPS 端口。找遍了所有可能的设置，终究无果。

于是我想探寻到底是哪里设置的跳转，于是我在内网的另一台电脑上使用 `curl` 命令访问 `https://gitea.lan` 并且不带 `-L` 参数，报错了，告诉我当前连接的证书不安全，没关系我们相信群辉的证书，忽略他继续访问。

> 忽略证书错误的命令是 `curl -k`，是 `curl --insecure` 的简写。

结果发现返回的是一个静态页面，内容是一个重定向。

> `curl -L` 是 `curl --location` 的简写，表示跟随重定向。如果不带这个参数，`curl` 会返回重定向的地址，而不是重定向后的内容。

于是我前往群辉的 nginx 配置文件 `/etc/nginx/nginx.conf`，发现了这样一段配置：

```nginx
# ...
server {
    listen 443 default_server ssl;
    listen [::]:443 default_server ssl;
    server_name _; 
    # ...
    
    location / {
        etag off;
        root /var/tmp/nginx/html;
        rewrite (.*) /redirect.html break;
    } 
}
# ...
```

查看 `var/tmp/nginx/html/redirect.html`，发现这里的内容和我在 `curl` 中看到的一致，OK，找到问题了。

> **强烈建议修改 nginx 配置文件前进行备份**，以免出现问题后找不到问题然后不得不重新安装系统的情况。

注释调这段内容，重启 nginx，调用 `curl https://gitea.lan`，返回一段 Gitea 的 HTML 代码，问题解决！

> 重启 nginx 的命令是 `nginx -s reload`。

![](https://static.mutoe.com/2024/setup-domain-and-remove-port-for-nas-app/succeed-for-https-gitea.png)

# 7. 设置 Gitea SSH 端口

等等，我们还有一个问题没有解决，那就是 SSH 端口的问题。我们在访问 Gitea 时，需要使用 `https://gitea.lan`，但是在使用 SSH 克隆仓库时，还是需要使用 `tcp://git@gitea:4022` 这样的地址，这样不太方便。

在客户端，我们可以使用 SSH 的别名来解决这个问题，只需要在 `~/.ssh/config` 文件中添加一条记录即可。

```ssh
Host gitea
    HostName gitea.lan
    Port 4022
    User git
```

这样我们就可以使用 `git clone gitea:username/repo.git` 来克隆仓库了。

但是，我们有没有什么办法来转发 SSH 的请求呢？答案是肯定的，我们可以修改 container 的配置，将容器的 22 端口映射到 NAS 的 22 端口，这样我们就可以使用 `git clone git@gitea:username/repo.git` 来克隆仓库了。

如果你不想重启容器，我们还可以使用 nginx 的 stream 模块来实现这个功能。

在 `/etc/nginx/nginx.conf` 中添加一段配置：

```nginx
stream {
  upstream gitea {
    server localhost:4022;
  }
  server {
    listen 22;
    proxy_pass gitea;
  } 
}
```

> 需要注意的是，这里将服务器中的 22 端口映射到了 4022 端口，并不是反向代理，而是 nginx 的端口转发功能。


测试一下 Gitea 的 SSH 服务是否正常

```shell
> ssh -T git@gitea.lan

Hi there, mutoe! You've successfully authenticated with the key named 1password Gitea SSH Key, but Gitea does not provide shell access.
If this is unexpected, please log in with password and setup Gitea under another user. 
```

OK，SSH 服务一切正常。 

如果这里测试失败，那么可能是 SSH 端口冲突了。如果你的 NAS 的默认 SSH 端口是 22 端口，那么你需要修改 NAS 的 SSH 端口为其他端口，否则会导致端口冲突。

# 8. SSH 端口冲突问题 

那有没有办法通过反向代理的方式来让不同域名的22端口转发到不同的端口去呢？

> 我: nginx中，是否可以通过反向代理的方式来让不同域名的22端口转发到不同的端口去？
> 
> GPT4: 首先，我要澄清一点：nginx 是一个强大的 web 服务器，被广泛用于负载平衡和反向代理 HTTP 和 HTTPS 流量。但是，nginx 本身并不支持 TCP（例如 SSH 的22端口）或 UDP 流量的代理。
> 
> 相反，您可以考虑使用其他专门为此设计的工具，例如 HAProxy 或者 nginx 的商业版本 - nginx plus。这些工具都有内置的 TCP 和 UDP负载平衡功能。
> 
> 至于你的问题，通过 TCP 负载均衡器，是可以实现根据不同来源（这个来源可以是域名，也可以是其他的标识）的 22 端口流量，转发到后端的不同端口。关于怎么配置，会因为具体工具而异，一般来说会涉及到负载均衡规则的配置。

这个问题的根本原因是 TCP 位于 OSI 模型的第四层，而 HTTP 位于 OSI 模型的第七层，nginx 的反向代理功能只能处理第七层的 HTTP 流量，而不能处理第四层的 TCP 流量。所以，如果你的应用程序是基于 TCP 的，那么你需要考虑使用别的工具来处理 TCP 流量。

我的处理方案是，将 NAS 的 22 端口让给 Gitea SSH 使用，而 NAS 自身的 SSH 改用别的端口，有以下这么几个原因：

1. 我的 NAS 本身就是一个 Linux 服务器，对于 Linux 服务器来说，为了安全起见，建议修改默认的 SSH 端口，这样可以避免被黑客扫描到默认的 SSH 端口，从而增加安全性。
2. Git SSH 的使用频率和便利程度会高于 NAS 的 SSH，所以将 Gitea SSH 设置为默认的 22，可以减少使用时的心智负担。

> 修改 NAS 的 SSH 端口的地方在 `控制面板` -> `终端机和 SNMP` -> `启动 SSH 功能` -> `端口` 中。

而登陆 SSH 也可以通过配置 SSH 的别名来解决，只需要在 `~/.ssh/config` 文件中添加一条记录即可。

```config
Host nas
    HostName ds.lan
    Port 10022
    User mutoe
```

这样我们就可以使用 `ssh nas` 来登陆 NAS 了。
 
# 9. 关于外网访问

好了，今天的教程就到此为止，如果你希望在外网可以访问，我不建议你开放任何服务端口对外网，尤其是有 NAS 的情况，一旦被黑客入侵，后果不堪设想 😅

正确的办法是设置一个 VPN 服务器，然后通过 VPN 来访问内网中的服务。这样不仅安全，而且还可以访问内网中的所有服务。

至与如何配置一个 VPN 服务器，请参考 [家庭网络折腾记#安全](/2021/home-network-infra-notes/#%E5%AE%89%E5%85%A8)

# 参考资料

本期没有任何参考资料，全是通过我的需求 + ChatGPT 的帮助，再加上自己的摸索完成的，ChatGPT，NB！


