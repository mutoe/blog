---
title: Flutter 学习笔记
date: 2020-01-21 19:17:19
updated: 2020-01-26 22:28:54
categories: 笔记
tags:
  - Flutter
  - Dart
---

这里记录了一些个人学习 Flutter 时遇到的一些问题, 可以作为避免踩坑和速查手册. 如有疑问欢迎留言.

<!-- more -->

# 我该选择什么布局容器?

## 我想自定义大小

[Container][]
[SizedBox][]
[SizedOverflowBox][]

## 我想增加内边距

[Padding][]
[Container][]

## 我想将子元素进行对齐

[Center][] 居中对齐
[Align][] 选择任意一个位置
[Baseline][] 根据基线对齐

## 我想让子元素的宽高按父元素进行适应

[FittedBox][]

## 我想指定元素的宽高比

[AspectRatio][]

## 我想约束子元素的宽高

[ConstrainedBox][]
[FractionallySizeedBox][]
[IntrinsicHeight][]
[IntrinsicWidth][]
[LimitedBox][]

## 我想控制子 Widget 的显示与隐藏

[Offstage][]

## 我想让子元素溢出父元素显示

[OverflowBox][]
[SizedOverflowBox][]

## 我想让子元素旋转或平移

[Transform][]

## 我想让子元素水平排列

[Row][]

## 我想让子元素垂直排列

[Column][]

## 我想让子元素们堆叠在一起

[Stack][]
[IndexedStack][]

## 我想让子元素进行流式布局

[Flow][]
[Wrap][]
[ListBody][]
[ListView][]

## 我想让子元素可滚动显示

解决 `BOTTOM OVERFLOWED BY xx PIXELS` 的问题

[SingleChildScrollView][]

## 我想让子元素使用表格布局

[Table][]

## 我想自定义子元素的排列

[CustomSingleChildLayout][]
[CustomMultiChildLayout][]
[LayoutBuilder][]

## 我想将很多可滚动的组件拼在一起组成一个大滚动组件

[CustomScrollView][]

需要注意 `CustomScrollView` 该组件只支持 Sliver 系列组件, 常用的有这些

[SliverAppBar][]
[SliverPersistentHeader][]
[SliverFillRemaining][]
[SliverToBoxAdapter][]
[SliverPadding][]
[SliverList][]
[SliverGrid][]

## 我想显示标签栏 (Material)

[TabBar][]
[TabBarView][]
[DefaultTabController][]

TabBar 通常配合 TabBarView 组件使用

<details>
<summary>如何使用 TabBar</summary>

1. 使用 DefaultTabController

```dart
class _MyWidgetState extends State<MyWidget> {
  List<Tab> tabs;
  List<Widget> pages;
  // ...

  build(context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: Text('title'),
          bottom: TabBar(tabs: tabs),
        ),
        body: TabBarView(children: pages),
      ),
    );
  }
}
```

2. 使用自定义的 controller

> 注意类后面的 `with TickerProviderStateMixin`

```dart
class _MyWidgetState extends State<MyWidget>
    with TickerProviderStateMixin {
  final _tabController;
  List<Tab> tabs;
  List<Widget> pages;

  @override
  initState(() {
    _tabController = TabController(length: 3, vsync: this);
    // ...
  })

  build(context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('title'),
        bottom: TabBar(tabs: tabs, controller: _tabController),
      ),
      body: TabBarView(children: pages, controller: _tabController),
    );
  }
}
```

</details>

# 我该选择什么组件填充内容?

## 我想显示文本

[Text][]

## 我想显示图片

[Image][]
[RawImage][]

## 我想显示图标

[Icon][]

## 我想显示按钮

[RaisedButton][]

## 我想创建一个表单

[Form][]
[FormField][]

## 我想监听用户键盘按键

[RawKeyboardListener][]

## 我想添加渐变

[LinearGradient][]

## 我想添加动画

[AnimatedContainer][] - 状态变换时使用线性算法
[AnimatedBuilder][]
[DecoratedBoxTransition][] - Decorated 变换时使用线性算法

[AnimatedCrossFade][] - 在两个子组件之间切换

[Hero][] - 在不同屏幕之间保持同一个元素的切换动画


# 我想

## 我想调用震动功能

使用 [`vibration`](https://github.com/benjamindean/flutter_vibration) 库，该库支持自定义震动强度和时间，比如具有线性马达的手机可以通过设置较短的持续时间来实现触摸反馈的功能。

```dart
if (await Vibration.hasVibrator()) {
  if (await Vibration.hasAmplitudeControl()) {
    // 震动强度检测
    print('amplitude');
    Vibration.vibrate(amplitude: 128);
  } else if (await Vibration.hasCustomVibrationsSupport()) {
    // 震动持续时间检测 (Android 8.0+)
    print('custom vibrations');
    Vibration.vibrate(duration: 1);
  } else {
    // 普通震动
    print('normal');
    Vibration.vibrate();
  }
}
```

## 我想获取计步器的数据

使用 [`pedometer`](https://pub.dev/packages/pedometer) 库

# MacOS APP

编译到 MacOS 运行时的一些问题

## 无法连接网络怎么办？

编译到 macos 后无法发起网络请求、加载网络图片等

在 `macos/Runner/DebugProfile.entitlements` 中设置 `com.apple.security.network.client` 为 `true` ，然后重新编译即可

```xml macos/Runner/DebugProfile.entitlements
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.security.app-sandbox</key>
	<true/>
	<key>com.apple.security.cs.allow-jit</key>
	<true/>
	<key>com.apple.security.network.server</key>
	<true/>
	<key>com.apple.security.network.client</key>
	<true/>
</dict>
</plist>
```

# 插件篇

## Sqflite

### 执行 SQL 时提示 no such table

数据表没有创建好, 检查创建数据表的 SQL 语句是否正确.

另外需要注意的是, `sqflite` 在执行 `db.execute()` 时, **不支持一次执行多行命令**, 所以多个语句需要拆成多个命令分别执行.

```dart
Future dbImportSql(Database db, List<String> sqlStatements) async {
  var batch = db.batch();
  for (var statement in sqlStatements) {
    batch.execute(statement);
  }
  await batch.commit(noResult: true);
}
```

# 参考资料

- [Creating database from SQL Scheme - tekartik/sqflite#87](https://github.com/tekartik/sqflite/issues/87#issuecomment-451411459)

<!-- prettier-ignore-start -->
[Container]: https://api.flutter.dev/flutter/widgets/Container-class.html
[Padding]: https://api.flutter.dev/flutter/widgets/Padding-class.html
[Center]: https://api.flutter.dev/flutter/widgets/Center-class.html
[Align]: https://api.flutter.dev/flutter/widgets/Align-class.html
[FittedBox]: https://api.flutter.dev/flutter/widgets/FittedBox-class.html
[AspectRatio]: https://api.flutter.dev/flutter/widgets/AspectRatio-class.html
[ConstrainedBox]: https://api.flutter.dev/flutter/widgets/ConstrainedBox-class.html
[FractionallySizeedBox]: https://api.flutter.dev/flutter/widgets/FractionallySizeedBox-class.html
[IntrinsicHeight]: https://api.flutter.dev/flutter/widgets/IntrinsicHeight-class.html
[IntrinsicWidth]: https://api.flutter.dev/flutter/widgets/IntrinsicWidth-class.html
[LimitedBox]: https://api.flutter.dev/flutter/widgets/LimitedBox-class.html
[Offstage]: https://api.flutter.dev/flutter/widgets/Offstage-class.html
[OverflowBox]: https://api.flutter.dev/flutter/widgets/OverflowBox-class.html
[SizedBox]: https://api.flutter.dev/flutter/widgets/SizedBox-class.html
[SizedOverflowBox]: https://api.flutter.dev/flutter/widgets/SizedOverflowBox-class.html
[Transform]: https://api.flutter.dev/flutter/widgets/Transform-class.html
[Row]: https://api.flutter.dev/flutter/widgets/Row-class.html
[Column]: https://api.flutter.dev/flutter/widgets/Column-class.html
[Stack]: https://api.flutter.dev/flutter/widgets/Stack-class.html
[IndexedStack]: https://api.flutter.dev/flutter/widgets/IndexedStack-class.html
[Flow]: https://api.flutter.dev/flutter/widgets/Flow-class.html
[Table]: https://api.flutter.dev/flutter/widgets/Table-class.html
[Wrap]: https://api.flutter.dev/flutter/widgets/Wrap-class.html
[ListBody]: https://api.flutter.dev/flutter/widgets/ListBody-class.html
[ListView]: https://api.flutter.dev/flutter/widgets/ListView-class.html
[SingleChildScrollView]: https://api.flutter.dev/flutter/widgets/SingleChildScrollView-class.html
[CustomSingleChildLayout]: https://api.flutter.dev/flutter/widgets/CustomSingleChildLayout-class.html
[CustomMultiChildLayout]: https://api.flutter.dev/flutter/widgets/CustomMultiChildLayout-class.html
[LayoutBuilder]: https://api.flutter.dev/flutter/widgets/LayoutBuilder-class.html
[Image]: https://api.flutter.dev/flutter/widgets/Image-class.html
[RawImage]: https://api.flutter.dev/flutter/widgets/RawImage-class.html
[Text]: https://api.flutter.dev/flutter/widgets/Text-class.html
[Icon]: https://api.flutter.dev/flutter/widgets/Icon-class.html
[RaisedButton]: https://api.flutter.dev/flutter/widgets/RaisedButton-class.html
[Form]: https://api.flutter.dev/flutter/widgets/Form-class.html
[FormField]: https://api.flutter.dev/flutter/widgets/FormField-class.html
[RawKeyboardListener]: https://api.flutter.dev/flutter/widgets/RawKeyboardListener-class.html
[LinearGradient]: https://api.flutter.dev/flutter/painting/LinearGradient-class.html
[AnimatedContainer]: https://api.flutter.dev/flutter/widgets/AnimatedContainer-class.html
[AnimatedBuilder]: https://api.flutter.dev/flutter/widgets/AnimatedBuilder-class.html
[AnimatedCrossFade]: https://api.flutter.dev/flutter/widgets/AnimatedCrossFade-class.html
[Hero]: https://api.flutter.dev/flutter/widgets/Hero-class.html
[DecoratedBoxTransition]: https://api.flutter.dev/flutter/widgets/DecoratedBoxTransition-class.html
[CustomScrollView]: https://api.flutter.dev/flutter/widgets/CustomScrollView-class.html
[SliverAppBar]: https://api.flutter.dev/flutter/widgets/SliverAppBar-class.html
[SliverPersistentHeader]: https://api.flutter.dev/flutter/widgets/SliverPersistentHeader-class.html
[SliverFillRemaining]: https://api.flutter.dev/flutter/widgets/SliverFillRemaining-class.html
[SliverToBoxAdapter]: https://api.flutter.dev/flutter/widgets/SliverToBoxAdapter-class.html
[SliverPadding]: https://api.flutter.dev/flutter/widgets/SliverPadding-class.html
[SliverList]: https://api.flutter.dev/flutter/widgets/SliverList-class.html
[SliverGrid]: https://api.flutter.dev/flutter/widgets/SliverGrid-class.html
[TabBar]: https://api.flutter.dev/flutter/material/TabBar-class.html
[TabBarView]: https://api.flutter.dev/flutter/material/TabBarView-class.html
[DefaultTabController]: https://api.flutter.dev/flutter/material/DefaultTabController-class.html
<!-- prettier-ignore-end -->
