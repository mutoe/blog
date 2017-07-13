---
title: 将 Hexo 博客发布到自己的服务器上
date: 2017-03-13 20:16:44
categories: 心得
tags:
 - Hexo
 - Git
---

最近写博客的时候发现搭建在 Github Pages 上在国内偶尔会抽, 表现为加载慢, 半天才读取完.

鉴于自己有服务器, 索性就放在自己服务器上吧, 打算就用 Github Pages 做博客备份. 接下来就开始动手把.

## 实现原理
我们在自己的电脑上写好博客, 使用 git 发布到代码仓库进行备份, git 仓库接收到 push 请求后, 使用 webhook 配合 nodejs 自动进行服务器端页面的更新.

<!-- more -->

## 1. 准备工作

### 1.1 服务器端
1. node 环境
1. git 环境
2. 服务器软件 (apache, nginx, iis 等)

### 1.2 客户端
1. 含有 webhooks 的 git 仓库 (github, coding 等)
2. hexo 博客

git 这里我使用了两个分支来保存博客项目: 包含 hexo 源文件的 source 分支和只含有 public 即已经生成静态文件的分支 master. 这是因为之前使用了 github pages 的原因, 如果你也和我是一样的做法, 那么你以后还可以使用 github.io 域名的博客镜像站点.

## 2. 服务器端构建

因为服务器端最容易出错, 所以先进行这部分操作.

### 2.1 服务器端的"钩子"

我们借助一个 node 插件 `github-webhook-handler` 来快速完成配合 github webhook 的操作, 其他 git 平台也有相应的插件, 如配合 coding 的 `coding-webhook-handler`.

#### 监听脚本

使用 `npm install -g github-webhook-handler` 命令来安装到服务器端.

``` bash
npm install -g github-webhook-handler
```

接下来切换到你服务器的站点目录, 如 `/var/htdoc/blog`, 新建一个 public 目录, 将你 github 仓库中的 master 分支 pull 到该目录中, 这个目录就作为这个博客的跟目录了.

``` bash
cd /var/htdoc/blog
mkdir public
cd public
git init
git remote add origin https://github.com/mutoe/mutoe.github.io.git
git pull origin master
```

接下来我们创建钩子, 新建一个 `webhooks.js` 文件, 将以下内容复制粘贴进去.

``` javascript
var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/', secret: 'yoursecret' })

function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = "";

  child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
  child.stdout.on('end', function() { callback (resp) });
}

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
    run_cmd('sh', ['./deploy.sh',event.payload.repository.name], function(text){ console.log(text) });
})
```

注意上段代码中第 3 行 `{ path: '/', secret: 'yoursecret' }` 中 secret 可以改为你喜欢的口令, 这口令将在下面的步骤中起到作用, 请留意. 第 19 行 `listen(7777)` 中 7777 为监听程序需要使用的端口.

#### 执行脚本

上面的 javascript 代码是用来捕捉 github 发来的信号并发起一个执行 `./deploy.sh` 的脚本, 接下来我们还需要写 `deploy.sh` 的内容.

``` bash
#!/bin/bash

WEB_PATH='/usr/htdoc/blog/public'

echo "Start deployment"
cd $WEB_PATH
echo "pulling source code..."
git reset --hard origin/master
git clean -f
git pull
git checkout master
echo "Finished."
```

将以上代码的第 3 行改为你服务器中的实际目录. 接下来只需要开启监听就可以了.

> tips: 在此之前你可以使用 `node deploy.js` 来测试一下监听程序是否能够正常运行.
> 我在这里碰到了一个 node 环境变量的问题, 读取不到 github-webhook-handler 这个模块, 找了很多办法也没有解决, 后来我直接在项目根目录的上级目录安装了这个模块, 问题就解决了.
> ``` bash
  cd /var/htdoc/blog
  npm install github-webhook-handler
  ```
> npm 会从当前目录依次向上寻找含有 `node_modules` 目录并访问该模块.

``` bash
nohup node deploy.js > deploy.log &
```

这段代码将在后台监听上面设置的 7777 端口并将日志输出在当前目录下的 `deploy.log` 文件中.

### 2.2 运行 web 服务

这里将 `/var/htdoc/blog/public` 设置为 web 根目录即可, 如果你已经设置好了, 可以跳过这步.

具体设置方法网上有很多, 如果你使用的也是 Apache, 我可以简单的说一下.

我在 Apache 配置文件 `httpd.conf` 最后添加了一段代码, 声明我的博客根目录和域名.

``` xml
<VirtualHost *:80>
  DocumentRoot /var/htdoc/blog/public
  ServerName blog.mutoe.com
  DirectoryIndex index.html
  <Directory "/var/htdoc/blog/public">
    Options FollowSymlinks Multiviews
  </Directory>
</VirtualHost>
```

重启 httpd 服务, 然后去域名服务商那里将 blog.mutoe.com 解析到我的服务器, 就可以看到博客了. 如果到这里你没有成功, 那么可能是哪里出了问题, 先解决完再往下看.

## 3. Github 配置 Webhooks

进入你的项目地址, 点击 Setting 标签, 在左侧选择 Webhooks, 然后点击右上角 `Add webhook` 按钮.

![setting](//static.mutoe.com/2017/deploy-hexo-website-to-self-server/setting.png)

然后在这个表单中的 Payload URL 字段填入你博客的域名 ( 或 IP 地址 ) 加上你之前在监听脚本中设置的端口号; __将 Content type 修改为 json 格式 ( 重要!! github-webhook-handler 插件只支持该格式 );__ Secret 字段填入你之前设置的, 保存即可.

![webhook](//static.mutoe.com/2017/deploy-hexo-website-to-self-server/webhook.png)

## 小结

之前有试过别的方法, 比如 使用 rsync 配合 hexo 的 hexo-deployer-rsync 插件使用, 在本地使用命令 `hexo deploy` 直接发布到服务器上. 但是这个方法我没有成功, 而且很繁琐, 需要在本机和服务器装一个软件, 配置环境变量, 本来就繁琐最后还没有成功, 索性放弃了这个办法.

还有的办法是直接将本地的 hexo 项目直接放在服务器, 然后设置好 public 目录后使用 `hexo generate` 命令直接生成. 但这样做每次更新的时候需要再次同步一遍, 也很繁琐.

这两种办法都与我当初选择 Hexo 这个博客系统的 简单 / 优雅 背道而驰, 最后受 mylonly 同学的启发, 利用 webhook 这个功能来同步博客, 同时还可以备份源代码, 使用我的方法后还可以使用 Github Pages 提供的空间, 即 github.io 这个域名作为紧急镜像, 在你自己服务器宕机的时候可以跳转到这里来, 感觉很完美, prefect !

## 参考文章

* [rvagg / github-webhook-handler](https://github.com/rvagg/github-webhook-handler)
* [利用Github的Webhook功能和Node.js完成项目的自动部署](http://www.jianshu.com/p/e4cacd775e5b) -- mylonly
