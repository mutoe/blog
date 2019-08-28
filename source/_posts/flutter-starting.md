---
title: flutter 环境搭建
date: 2019-08-28 14:29:49
categories: 心得
tags:
  - Flutter
---

最近在学习 Flutter 补充移动端开发的技术栈，刚好换电脑，特此从 0 开始重新搭建 Flutter 开发环境

> 整个安装环境是基于 macOS 操作系统的，如果你使用的是 Windows 操作系统，可以参考其他教程或本博文大致思路

# 1. 环境安装包下载

以下几个安装包体积较大，所以在观看本教程前需要提前进行下载

- [Flutter SDK](https://flutter.dev/docs/get-started/install) (提供 Flutter 相关命令行)
- [XCode](http://developer.apple.com/xcode) (提供 iOS 模拟器和编译环境)
- [Android Studio](https://developer.android.com/studio) (提供 Android 模拟器和编译环境)

# 2. Flutter SDK 安装

下载好 Flutter SDK 后，解压到一个存放 SDK 的目录，我这里存放在 `~/.flutter-sdk` 下

```bash
mkdir ~/.flutter-sdk
cd ~/.flutter-sdk
unzip ~/Downloads/flutter_macos_v1.7.8+hotfix.4-stable.zip
```

然后将 Flutter SDK 的安装目录暴露给环境变量，在 `~/.zshrc` 或 `~/.bashrc` 文件中增加以下内容

```bash
# Flutter
export PATH="$PATH:$HOME/.flutter-sdk/flutter/bin"
```

然后你还可以下载 Flutter 在未来会需要的二进制包（可选的，也可以在未来下载）

```bash
flutter precache
```

最后运行检查工具 `flutter doctor` ，来检查你的 Flutter 是否可以正常运行, 如果出现下面的信息，就说明你安装 Flutter SDK 成功啦

```bash
flutter doctor

➜  .flutter-sdk flutter doctor
[✓] Flutter (Channel stable, v1.7.8+hotfix.4, on Mac OS X 10.14.5 18F132, locale en-CN)
    • Flutter version 1.7.8+hotfix.4 at /Users/yourusername/.flutter-sdk/flutter
    • Framework revision 20e59316b8 (6 weeks ago), 2019-07-18 20:04:33 -0700
    • Engine revision fee001c93f
    • Dart version 2.4.0
...
```

# 3. Android 环境安装

首先运行我们下载并安装好的 Android Studio

首次运行会依次询问是否导入已有配置、是否允许匿名上报统计信息

接下来会弹出 "Android Studio Setup Wizard" 对话框，我们选择 "Standard" 默认方式安装，接下来等待需要的安装包下载完毕

安装完毕后会弹出 "Welcome to Android Studio" 对话框，不着急关掉它，我们接下来创建一个安卓模拟器

选择 "Configure -> AVD Manager" 弹出 "Android Virtual Device Manager" 对话框， 选择 "Create Virtual Device"，然后选择一个你喜爱的机型和系统版本，等待安装完毕即可关掉 Android Studio

运行 `flutter doctor --android-licenses` 来同意 Android Studio 的协议

# 4. XCode 环境安装

安装好我们下载的 XCode 后，需要执行以下命令来注册 XCode 并且同意它的 License

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

接下来使用 brew 安装 iOS 开发相关的 tools

```bash
brew install --HEAD usbmuxd
brew link usbmuxd
brew install --HEAD libimobiledevice
brew install ideviceinstaller ios-deploy cocoapods
```

# 5. 开发环境配置

## 5.1 Visual Studio Code

如果你使用 VSCode 进行 Flutter 应用的开发，需要安装 Flutter 拓展

在应用市场中搜索 "Flutter" 安装第一个扩展即可

## 5.2 Android Studio

如果你使用 Android Studio 进行开发，则需要安装 Flutter 插件

点击 "Configure -> Plugins" 在 Marketplace 中搜索 flutter 安装即可

# 6. 检查安装环境

所有步骤进行完毕后，连接手机，使用 `flutter doctor` 查看是否正常安装完毕，

![flutter-doctor](https://static.mutoe.com/2019/flutter-starting/flutter-doctor.png)

如果你的某一步不是对勾的话可以检查下是什么问题，也可以在博客下方留言，我会尽可能的帮助你来解决问题 😊

# 7. Hello world!

> 我使用 VSCode 进行开发，所以这里就不再演示 Android Studio 下的 Hello world 了

启动 VSCode，按 ` Command``Shift``P ` 然后输入 `flutter new` 按回车建立一个 Flutter 项目，输入项目名 "hello_world"

> 如果出现这个错误
>
> ![vscode-load-flutter-sdk](https://static.mutoe.com/2019/flutter-starting/vscode-load-flutter-sdk.png)
>
> 需要手动配置一下 Flutter SDK 的位置，打开 VSCode 设置，搜索 "flutterSdkPath"，输入地址 `~/.flutter-sdk/flutter/bin`，然后重启一下 VSCode 就好啦

然后选择一个项目目录用于存放 Flutter 代码, 如果看见以下目录，则说明我们的 Flutter 项目创建成功啦！

![hello-world](https://static.mutoe.com/2019/flutter-starting/hello-world.png)

直接按 F5 启动项目，选择一个模拟器或者是真机，愉快的开启我们的 Flutter 之旅吧！

# 参考文档

- [Flutter Get Started](https://flutter.dev/docs/get-started)
