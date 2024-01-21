---
title: 家庭网络折腾记  
date: 2021-04-11 16:12:26  
update: 2024-01-21 22:15:09
categories: 心得  
tags:
  - 家庭网络
  - OpenWrt
  - Docker
---

最近把家里的网络折腾了一下，整体用下来感觉还不错，这里记录下来分享给大家，大家一起学习交流~

![Infrastructure](https://static.mutoe.com/2021/home-network-infra-notes/infra.png)

痛点：

- 科学上网。现在家里的网络总是觉得有些不尽人意，本人最大的爱好就是周末宅在家里搞搞开源、打打游戏。遇到问题了 Google / StackOverflow 效率是比 Baidu 高，而每个设备自己科学上网比较繁琐，需要各自管理白名单，太麻烦...
- NAS 访问慢。和爱人出去玩偶尔会拍一些照片和 Vlog，这些都是美好珍贵的记忆，目前存在自己的私有云上，想看了拿出来看看，照片列表加载缓慢，视频进度拖拉卡顿...
- WIFI 信号。之前路由器是放在客厅，信号到卧室床头比较曲折，有时关门后甚至断网，网络体验极差...

折腾后：

- 全屋设备科学上网。在软路由里根据 IP 地址分流，国外 IP 走代理，国内直连。终端无需单独开软件，无需在意是否国内外网站。
- 广告过滤。同上。
- 内网全千兆访问。访问 NAS 资源、各设备之间文件互传速度大幅提升，堪比本地访问。
- Docker。开发时如果需要容器资源，内外网都可使用路由器的 Docker，节约开发机资源，目前资源是 4C8G。
- 数据安全。之前 NAS 是直接暴露在公网的，且没有开启 HTTP，现在公网访问内网设备需要 VPN，访问 NAS 强制 HTTPS。
- 扩大 WIFI 信号覆盖。未来搬去新家后智能设备增多，WIFI6 是必不可少的。出于成本考虑，WIFI6 AP 放在客厅，现有垃圾 AP 放在卧室。

硬件改造成本共 1135 元

- 软路由： J4105，8G DDR4 + 64G SATA固态 咸鱼 750 元
- 交换机： 水星SG108C 塑料8口 JD 69元
- AP： 华为AX3Pro 咸鱼 295 元
- 网线： 绿联6类线 0.5m x3 JD 21元

> 哭，现在设备各种涨价， ax3pro 暴涨 150 元，蹲了二周才蹲到低于 300 元的 AP，J4105 也涨了 100 多，不知道是不是受了这一波矿潮影响...

总之，想把网络环境做好，最大的变化就是没有变化，让用户感觉不到就成功了，只需要默默地提供稳定的服务就好~

<!-- more -->

# 软路由

首先科普一下软路由，和普通的路由器有什么区别呢？

一般家庭宽带入户都是光纤，这个光信号是不能直接用来接入一般路由器或电脑的（特殊网卡除外），所以需要一台机器将光信号转化为电信号，这个机器就是 **调制解调器** 啦，俗称光猫。

光猫接入光信号，输出弱电信号（通常是 RJ45 端口）。

IPTV 的网口的设置一般也会在光猫中内置的路由中设置。装网的师傅也会在光猫里帮你设置好拨号，那么你的设备只需要将网线插入光猫的 LAN 口即可上网。

如果你不是用的光猫作为 WIFI 发射器，那么你还会买入一个 WIFI 路由器（我们简称硬路由），将它的 WAN 或 LAN 口和光猫的 LAN 口相连，设置一下 WIFI 密码，你的手机也可以无线上网了。

到这里为止，宽带师傅就收钱（设备调试费）跑了。那么我们得到一张下面的图

![Router](https://static.mutoe.com/2021/home-network-infra-notes/router.png)

他们承担了以下 4 项工作

- 调制解调器：Modem，负责光电信号转换
- 路由器： Router，负责对数据进行分发
- 交换机： Switch，负责设备之间的数据交换
- AP： Access Point，把有线网络转化为无线网络

有同学就会问了，那光猫不是把这四件事都做了，还需要路由器做什么？是因为光猫为了成本考虑，只有一个千兆 LAN 端口，其他 LAN 口都是百兆，并且自带的 AP 接入点只是用来做设备调试的，实际使用卡到爆。所以你才需要一个额外的路由器。

那我为什么还需要软路由呢？因为路由器提供的功能不满足个人需求使用，比如科学上网等，软路由相当于购入一台微型电脑，路由只是它其中一项功能。性能好的硬路由成本太高（Ax86u说你呢），所以我们采用分体设计的方案。

交换机实现内网数据交换，不消耗路由器资源。当然如果你有线设备不多，也可以省去交换机，直接使用千兆无线路由器即可。



# Openwrt

我使用的软路由机器是 J4105 (以下简称这台机器为软路由)，机器购入后，由于是咸鱼二手，测试了一下硬件什么的，没问题后开始刷机，系统是 [openwrt.club](https://openwrt.club/dl) 的精品小包。本来想刷高大全版的，连上后一直找不到 wan 口，遂放弃。

刷机参考 [B站 BraveRu](https://www.bilibili.com/video/BV1w541157Uo) 的视频，非常详细。刷机成功后进入管理页面，看到 4C8G 和 2个千兆端口，啊，舒服

![OpenWrt](https://static.mutoe.com/2021/home-network-infra-notes/openwrt.png)

## WAN 口

如果你装了宽带，并且是光纤入户的话（或者电话线入户），需要有一台机器将光信号转化为电信号，这个就是光猫啦，学名调制解调器。

首先登入光猫管理页面，将千兆网口连接方式改为桥接（如果有 IPTV 的话可以保留其他端口），之后这个千兆网口接入软路由。

然后登录 OpenWrt 管理页面，找到 网络-接口-WAN，协议修改为 PPPOE，填入宽带帐号密码。如果不知道的话就打电话问装宽带的人。

> 宽带用户名密码我是直接从光猫管理页面的 HTML 里扒出来的，可怕。。

![Dial-up](https://static.mutoe.com/2021/home-network-infra-notes/wan-dial-up.png)


## LAN

LAN 口没什么可设置的，就用了 OpenWrt 默认的 `192.168.5.1/24` 网段，开启 DHCP，修改了下 DHCP 租期为 7 天。

默认设备分配 100-250 地址（100 以下想保留给固定设备，比如 NAS、AP 管理页面等）

![DHCP static address](https://static.mutoe.com/2021/home-network-infra-notes/dhcp-static-address.png)


## AP

然后登录原来的路由器管理页面（以下简称这台机器为AP），找到 LAN 口设置，关闭 DHCP，我们只用软路由分配 IP 地址。

关闭 DHCP 后，我们需要手动指定一下这台路由器的 IP 地址，按照上图设置为保留的 `192.168.5.3`, 掩码 `255.255.255.0`，这台路由器我们就制作为 AP 使用啦。

![AP Settings](https://static.mutoe.com/2021/home-network-infra-notes/ap-settings.png)

未来如果想要修改 WIFI 密码什么的，可以登录 `192.168.5.3` 或静态地址分配里设置的主机名 `tplink.lan` 访问这个 AP

# 酸酸乳

这里就不过多介绍了。。小命要紧，小命要紧，就一张图。前段时间华为云活动，领了个香港机器做备用节点，是蛮快的，平时还是走自己的韩国节点。

![酸酸乳](https://static.mutoe.com/2021/home-network-infra-notes/ssr.png)

运行模式设置为绕过大陆 IP 模式，这样就可以实现全屋设备上网啦~

其他的广告过滤和解锁网易云都可以用，还可以代理 Netflix，不过我的节点不支持，我也不太需要就算咯。

# DDNS

那么如果身处外网，想要访问家里的设备怎么办呢？如果你的宽带有公网 IP，那么你就可以通过家里的公网 IP 地址，然后直接访问路由器中的服务。

但是这个 IP 地址是动态的，每隔一段时间就会变，所以我们需要一个动态 DNS 服务来将一个固定的域名解析到我们 IP 随时会发生变化的路由器上，这个服务就叫做 DDNS。

成都联通有一点比较好的是入户默认开了公网 IP，让外网访问变得简单了许多，不过缺点就是封锁了 80 端口，不过没关系，我的核心业务还是在云上的，毕竟可靠一点，家里的机器就做些边缘的事情就好。

如果你是移动用户的话，基本不可能申请到公网 IP，因为移动本身就没有多少可用的 IP 地址，这时候就需要使用内网穿透技术了，这里不做过多介绍，可以自行搜索。

有了公网 IP，接下来就需要设置一个动态 DNS 解析的机制了，毕竟公网 IP 三天一小变，五天一大变。我的域名是放在 Aliyun 解析的，创建子账户后分配好 DNS 权限，交给 OpenWrt 去做就好，比较省心。

![DDNS](https://static.mutoe.com/2021/home-network-infra-notes/ddns.png)

# 安全

由于内网有 NAS 和摄像头，数据可不能随便被弄出去了，数据安全是非常重要的，检查下 网络-防火墙 设置。端口转发和规则都在这里设置，只保留需要的端口即可。

由于本人技术垃圾，不想直接将端口暴露在公网，太危险了，鬼知道什么妖魔鬼怪进来安装个勒索程序或者挖矿脚本什么的。所以如果想在外面访问家里内网的话，连接 VPN 即可回家。

Update: 2024-01-21 随着时代进步，第一代 VPN-IPSec 技术已经无法在现代的手机上使用，但是第二代我不知道为什么一直设置不成功，所以这里不再推荐使用 VPN-IPSec 技术，而是使用 OpenVPN 服务器。

<details>
<summary>点击展开 IPSec VPN 第一代教程 (不推荐)</summary> 
找到 "VPN-IPSec VPN 服务器" 点击启用，设置好地址、用户名密码即可，然后 Android 或 iOS 使用系统自带的 VPN 功能即可回家。

![IPSec](https://static.mutoe.com/2021/home-network-infra-notes/ipsec.png)

![Android VPN](https://static.mutoe.com/2021/home-network-infra-notes/android-vpn.jpg)

</details>

![](https://static.mutoe.com/2024/home-network-infra-notes/setup-openvpn.png)

其中 DDNS 域名是上面提到的 DDNS 服务中你设置的域名。

按照此步骤设置 OpenVPN 服务器，然后下载 OpenVPN 客户端，导入配置文件即可，这里就不做过多介绍了。 

# NAS

前面我们在路由表里为 NAS 设置了静态路由，现在需要进入到 NAS 里将 IP 地址固定下来

![QNAP LAN settings](https://static.mutoe.com/2021/home-network-infra-notes/qnap-lan-settings.png)

然后把 Container Station 和各种服务关了，之后就专注存储吧。

经朋友提醒，想实现内网全千兆的话还需要 NAS 硬盘支持千兆读写，看了一下我这款红盘速度还可以，平均 150MB/s 读写，勉强打到千兆水平。

现有方案是单硬盘 + 每天归档存储至 Aliyun 对象存储，后续可以组 RAID0 稍微提一提速。。。可能不是很有必要，其他设施得要 2.5Gbps 支持了

# Docker

话说这个机器性能完全过剩了啊，根据国外大佬的测评，千兆网速 Vmess 跑满也才 50% 负载，二话不说，上 Docker。

由于 OpenWrt 内置的 Docker 没有开启远程访问，我们需要修改 Docker daemon 的启动参数以支持远程访问。

先远程联入系统，然后找到 `/etc/config/dockerd` 文件, 修改启动参数 hosts

```shell
ssh root@openwrt.lan
vim /etc/config/dockerd
```

找到 `config globals 'globals'` 加入下面一行

```cfg
list hosts 'tcp://0.0.0.0:2375'
```

然后重启 Docker daemon 即可远程接入

```shell
/etc/init.d/dockerd restart
```

![IDEA Docker](https://static.mutoe.com/2021/home-network-infra-notes/idea-docker.png)

## zsh

能终端接入的话不说了 Zsh、Zinit 安排起来。

在 OpenWrt 上折腾可以参考这篇帖子，[在openwrt中最小化安装oh-my-zsh](https://itcao.com/2020/06031516.html)。

> 我遇到了一个奇怪的问题，使用非默认 sh 的时候（OpenWrt 默认为 ash），按退格会变成空格，网上找了一番，在 `.zshrc` 中设置如下配置即可，可能是我用 Tmux 时设置了 TERM 的原因
> 
> ```shell
> export TERM=vt100
> ```


好啦，这就是本篇博客的所有内容啦，欢迎大家分享自己的家庭网络架构，一起学习一起折腾~
