---
title: testcafe -- 一个基于 nodejs 自动化测试框架
categories: 心得
tags:
  - test
  - nodejs
  - testcafe
date: 2018-10-21 21:50:35
update: 2018-10-25 13:02:31
---

# 简介

testcafe ([官网](https://devexpress.github.io/testcafe/)) 是一个基于 nodejs 的自动化测试框架，优点就先不多说了，我们直接进入正题！

# 安装

testcafe 是一个 npm 包，它可以使用 npm 或 yarn 包管理器进行安装，这里我们使用 yarn 进行安装（因为它很快）

> 如果你的机器上没有安装 yarn，那么你可以使用 npm 来安装 yarn 😊
  ``` bash
  npm install -g yarn
  ```

在命令行中运行以下命令

``` bash
yarn global add testcafe
```

这样， testcafe 就安装在你本机上啦

# 小试牛刀

## 创建一个测试项目

我们新建一个目录，用于练习我们的自动化测试框架 testcafe

``` bash
# 首先切换到你用于管理 web 项目的根目录，我本机是 "~/www"
cd ~/www
mkdir testcafe && cd testcafe
```

<!-- more -->

## 编写第一个测试脚本

然后新建一个名为 `myFirstTestcase.js` 文件，用于编写我们的自动化测试脚本

``` bash
vim myFirstTestcase.js # 用 vim 打开这个文件（如果文件不存在就创建它）
```

> 如果你安装了 vscode，你还可以使用 `code myFirstTestcase.js` 来创建并编辑它
> _需要在 vscode 的控制它中输入 `install command` 来启用 `code` 命令_

将以下内容粘贴到 `myFirstTestcase.js` 中

``` js
// ES6 导包语法
import { Selector } from 'testcafe';

// 声明一个 fixture 测试项目
fixture('Getting Started')
  // 打开一个 web 页面用于接下来的测试
  .page('http://devexpress.github.io/testcafe/example')

// 创建一个测试用例
test('My first test', async t => {
  // Test code
});
```

到这里，我们的第一个 test script 就写好了，接下来我们来运行它看看

## 运行测试脚本

我们回到命令行中，执行以下命令来运行一个测试脚本

``` bash
testcafe chrome myFirstTestcase.js
```

> 这个命令中，
> - `testcafe` 是我们使用包管理工具全局安装的依赖，testcafe 是它的可执行程序
> - `chrome` 是我们的测试平台，安装在本机的浏览器，也可以是 `safari` `firefox` 等
> - `myFirstTestcase.js` 是我们编写的测试脚本

稍等片刻，我们的浏览器就会被自动打开然后运行测试脚本，最后浏览器被自动关闭，在终端上留下了测试结果。

![test report](//static.mutoe.com/2018/testcafe/test-report.png)

## 编写测试代码

刚才我们的测试脚本只是简单的打开了一个页面，它并没有执行任何动作。

> 在接下来的几个例子中，你可以打开测试目标网站 [http://devexpress.github.io/testcafe/example](http://devexpress.github.io/testcafe/example) 这个页面，然后打开控制台，观察其 DOM 结构，并试着模拟脚本的操作，以便方便的理解脚本的内容。

### 在页面上执行操作

接下来我们简单的写两个动作，用来对页面进行操作。  
打开 `myFirstTestcase.js`，在 `test` 方法的回调函数中添加以下内容

``` diff
  test('My first test', async t => {
-   // Test code
+   await t
+     .typeText('#developer-name', 'John Smith')
+     .click('#submit-button');
  });
```

t 是我们的测试用例的上下文对象，它又很多方法，在上面的例子中，我们调用了它的 `typeText` 和 `click` 两个方法，其中

- `typeText` 方法用来键入文本，它接受两个参数：第一个参数是 selector 选择器（它的语法类似 jQuery 选择器的语法）；第二个参数是你要键入的文本；
- `click` 方法用来模拟鼠标点击，它接受一个参数，是一个 selector 选择器

> 有关这个上下文对象的更多方法，请先参考 [TestCafe 官方 API 手册](https://devexpress.github.io/testcafe/documentation/test-api/actions/) (它是一个英文文档，稍后我会整理出这个文档的中文手册在本页下方)

这段代码的作用是：
1. 首先找到 id 为 `developer-name` 的标签，输入值 'John Smith'
2. 然后点击 id 为 `submit-button` 的按钮

### 观察页面的变化

上面一小节我们对页面进行了交互，接下来我们想知道页面进行了什么反应，也就是观察的页面变化。

我们对测试脚本进行修改

``` diff
  test('My first test', async t => {
    await t
      .typeText('#developer-name', 'John Smith')
      .click('#submit-button');
+
+   const articleHeader = await Selector('.result-content').find('h1');
+
+   // 获取 article header 的内容文本
+   let headerText = await articleHeader.innerText;
  });
```

在我们点击页面上的“提交”按钮后，会打开一个“谢谢”页面。  
如果我们要访问页面上的 DOM 元素，可以使用测试脚本顶部导入的 Selector 方法

1. L6，我们声明了一个 `articleHeader` 变量，这个变量的值是根据选择器 `.result-content > h1` 找到的 DOM 元素
2. L9，我们又声明了一个 `headerText` 变量，它的值是我们获取到的 DOM 元素的 `innerText` 属性（这个属性的值是 DOM 元素的内容文本）

### 断言

我们拿到需要判断的值后，就可以对测试用例进行断言了。  
它到底能否正确执行测试用例并输出我们期望的结果？

我们使用测试用例上下文对象 `t.expect()` 方法来进行断言,  
将测试脚本改写为以下内容

``` diff
  test('My first test', async t => {
    await t
      .typeText('#developer-name', 'John Smith')
      .click('#submit-button');

-   const articleHeader = await Selector('.result-content').find('h1');
-
-   // 获取 article header 的内容文本
-   let headerText = await articleHeader.innerText;
+   // 使用断言方法来判断我们获取到的值与我们期望的值是否相等
+   .expect(Selector('#article-header').innerText).eql('Thank you, John Smith!');
  });
```

- L11 `expect()` 是一个 BDD（行为驱动开发）风格的断言方法, 它接受一个参数：需要进行断言的变量；  
  它返回一个断言类实例对象，后跟一个断言方法。
- `eql()` 是一个断言方法，用于判断断言实例与期望值是否严格等于，它接受一个参数：期望值；  
  该类断言方法会在打印出相应的测试报告，如果相等则返回 pass，否则抛出一个 AssertionError
  
  ![assertion error](//static.mutoe.com/2018/testcafe/assertion-error.png)

## 小结

到这里，我们的第一个自动化测试脚本就完成了，如果你没有跑通的话，请检查一下你的测试脚本是否与以下内容一致

``` js
// ES6 导包语法
import { Selector } from 'testcafe'

// 声明一个 fixture 测试项目
fixture('Getting Started')
  // 打开一个 web 页面用于接下来的测试
  .page('http://devexpress.github.io/testcafe/example')

// 创建一个测试用例
test('My first test', async t => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')

    // 使用断言方法来判断我们获取到的值与我们期望的值是否相等
    .expect(Selector('#article-header').innerText).eql('Thank you, John Smith!1')
})

```

# API 文档 (unfinished)

## 测试代码结构

### 测试组 Fixtures

TestCafe 测试必须将一些测试组织起来，测试组 (Fixtures) 就像是一个文件夹，将同一类的测试包裹起来。
一个测试文件可以包含很多测试组。

要声明一个测试组，使用 `fixture` 方法
``` js
fixture( fixtrueName )

// 或下面这种用法
fixture `fixtureName`

```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `fixtureName` | string | 测试组的名称 |

它返回一个测试组对象，可以接测试组方法，有关这些方法，请参考下方相关 API。

> 请注意，测试方法 `test` 必须放在测试组声明后面。

### 测试用例 Tests (no)

> 暂未更新

### 指定起始页面 (no)

> 暂未更新

### 测试元数据 (no)

> 暂未更新

### 钩子 (no)

> 暂未更新

### 跳过测试 (no)

> 暂未更新

## 页面元素选择 (no)

### 选择器 (no)

> 暂未更新

### DOM 节点状态 (no)

> 暂未更新

### 特定框架的选择器 (no)

> 暂未更新

### 一些例子 (no)

> 暂未更新

## 动作

### 单击 click

单击页面上的元素

``` js
t.click( selector [, options] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器]() |
| `options` _(可选的)_ | Object | 选项, 有关[鼠标动作的选项]() |

下面用一个例子来展示如何使用 `t.click` 动作来选择一个复选框元素。

``` js
test('Click a check box and check its state', async t => {
  const checkbox = Selector('#testing-on-remote-devices');
  await t
    .click(checkbox)
    .expect(checkbox.checked).ok();
});
```

下面一个例子使用 `options` 参数在输入框中设置光标位置

``` js
test('Click Input', async t => {
  const nameInput = Selector('#developer-name');
  await t
    .typeText(nameInput, 'Peter Parker')
    .click(nameInput, { caretPos: 5 })
    .keyPress('backspace')
    .expect(nameInput.value).eql('Pete Parker');
});
```

### 双击 doubleClick

双击页面上的元素

``` js
t.doubleClick( selector [, options] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器]() |
| `options` _(可选的)_ | Object | 选项, 有关[鼠标动作的选项]() |

### 右击 rightClick

右击页面上的元素

``` js
t.rightClick( selector [, options] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器]() |
| `options` _(可选的)_ | Object | 选项, 有关[鼠标动作的选项]() |


### 拖拽 drag

#### 拖拽一定距离 drag

``` js
t.drag( selector, dragOffsetX, dragOffsetY [, options] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器]() |
| `dragOffsetX` | Number | 鼠标在 x 轴上需要拖拽的距离 |
| `dragOffsetY` | Number | 鼠标在 y 轴上需要拖拽的距离 |
| `options` _(可选的)_ | Object | 选项, 有关[鼠标动作的选项]() |

下面一个例子来演示如何使用 `t.drag` 动作来拖拽元素

``` js
test('Drag slider', async t => {
  const slider = Selector('#developer-rating');
  await t
    .click('#i-tried-testcafe');
    .expect(slider.value).eql(1)
    .drag('.ui-slider-handle', 360, 0, { offsetX: 10, offsetY: 10 })
    .expect(slider.value).eql(7);
});
```

#### 拖拽到另一个元素上 dragToElement

``` js
t.dragToElement( selector, destinationSelector [, options] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器]() |
| `destinationSelector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器, 拖拽目标元素，有关[选择器]() |
| `options` _(可选的)_ | Object | 选项, 有关[拖拽到元素动作的选项]() |

下面这个例子演示了如何使用 `t.dragToElement` 将元素拖放到特定区域

``` js
test('Drag an item from the toolbox', async t => {
  const designSurfaceItems = Selector('.design-surface').find('.items');
  await t
    .dragToElement('.toolbox-item.text-input', '.design-surface')
    .expect(designSurfaceItems.count).gt(0);
});
```

### 悬停 hover

将鼠标指针悬停在网页元素上

``` js
t.hover( selector [, options] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器]() |
| `options` _(可选的)_ | Object | 选项, 有关[鼠标动作的选项]() |

使用此操作可以调用弹出元素，例如悬停在其他元素上时出现的提示窗口、弹出菜单或下拉列表。

下面这例子演示如何将鼠标指针移动到组合框上显示下拉列表，然后选择一个项目并检查组合框的值。

``` js
test('Select combo box value', async t => {
  const comboBox = Selector('.combo-box');
  await t
    .hover(comboBox)
    .click('#i-prefer-both')
    .expect(comboBox.value).eql('Both');
});
```

### 选择文本 selectText

#### 在 input 元素中

``` js
t.selectText( selector [, startPos] [, endPos] [, options] )
```

| 参数 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择目标元素]() | |
| `startPos` _(可选的)_ | Number | 选择的起始位置，从 0 开始的整数 | 0 |
| `endPos` _(可选的)_ | Number | 选择的结束位置，从 0 开始的整数 | 可见文本的长度 |
| `options` _(可选的)_ | Object | 选项, 有关[通用选项]() | |  

#### 在 textarea 元素中 (no)

> 暂未更新

#### 在 contentEditable 元素中 (no)

> 暂未更新

### 键入文本 typeText

``` js
t.typeText( selector, text [, options] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择目标元素]() |
| `text` | string | 要在指定元素中输入的文本 |
| `options` _(可选的)_ | Object | 选项, 有关[输入动作选项]() | 

> 如果要删除文本，请使用 [`t.selectText`](#选择文本-selectText) 和 [`t.pressKey`](#按键-pressKey) 来实现

``` js
test('Type and Replace', async t => {
  const nameInput = Selector('#developer-name');
  await t
    .typeText(nameInput, 'Peter')
    .typeText(nameInput, 'Paker', { replace: true })
    .typeText(nameInput, 'r', { caretPos: 2 })
    .expect(nameInput.value).eql('Parker');
});
```

> **注意**
> 
> 某些类型的HTML5输入（如 DateTime ， Color 或 Range）需要以特定格式输入值。
> 
> The following table lists value formats expected by these inputs.
>
> | 输入类型 | 模式 | 例子 |
> | --- | --- | --- |
> | Date | `yyyy-MM-dd` | `2018-10-25` |
> | Week | `yyyy-Www` | `2018-W03` |
> | Month | `yyyy-MM` | `2018-10` |
> | DateTime | `yyyy-MM-ddThh:mm` | `2018-10-25T13:22` |
> | Time | `hh:mm` | `13:22:28` |
> | Color | `#rrggbb` | `#003500` |
> | Range | `n` | `45` |

### 按键 pressKey

``` js
t.pressKey( keys [, options] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `keys` | string | 要在指定元素中输入的文本 |
| `options` _(可选的)_ | Object | 选项, 有关[通用选项]() | 

下表显示了如何指定不同类型，键序列和组合的键。

| 按键类型 | 例子 |
| --- | --- |
| 字母和数字 | `a`, `A`, `1` |
| 修饰键 | `shift`, `alt`(`⌥`), `ctrl`, `meta`(`⌘`) 
| 导航和操作键 | `backspace`, `tab`, `enter`, `capslock`, `esc`, `space`, `pageup`, `pagedown`, `end`, `home`, `left`, `right`, `up`, `down`, `ins`, `delete` |
| 组合键 | `shift+a`, `ctrl+d` |
| 一番操作 | `ctrl+a del`, `ctrl+a ctrl+c` (自由组合按键，并使用空格分隔它们) |

``` js
test('Key Presses', async t => {
  const nameInput = Selector('#developer-name');
  await t
    .typeText(nameInput, 'Peter Parker')
    .pressKey('home right . delete delete delete delete')
    .expect(nameInput.value).eql('P. Parker');
});
```

### 页面跳转 navigateTo

``` js
t.navigateTo( url )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `url` | string | 要导航到的 URL 地址。可以是绝对地址或相对地址 |

下面的例子来演示如何导航到一个绝对地址

``` js
test('Navigate to the main page', async t => {
  await t
    .click('#submit-button')
    .navigateTo('http://devexpress.github.io/testcafe');
});
```

在重定向发生后，TestCafe 会自动等待服务器响应。如果服务器在 15s 内没有响应，测试将会被恢复(?)。

### 截图 takeScreenshot

#### 获取整页的屏幕截图 takeScreenshot

``` js
t.takeScreenshot( [path] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `path` _(可选的)_ | string | 截图文件保存的相对路径和名称，该相对路径是基于命令行制定的基本目录。 | 

``` js
test('Take a screenshot of a fieldset', async t => {
  await t
    .typeText('#developer-name', 'Peter Parker')
    .click('#submit-button')
    .takeScreenshot('my-fixture/thank-you-page.png');
});
```

#### 获取页面元素的屏幕截图 takeElementScreenshot

``` js
t.takeScreenshot( [path] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择目标元素]() |
| `path` _(可选的)_ | string | 截图文件保存的相对路径和名称，该相对路径是基于命令行制定的基本目录。 | 
| `options` _(可选的)_ | Object | 用于定义屏幕截图截取方式的选项。详情见下文。 |

``` js
test('Take a screenshot of a fieldset', async t => {
  await t
    .click('#reusing-js-code')
    .click('#continuous-integration-embedding')
    .takeElementScreenshot(Selector('fieldset').nth(1), 'my-fixture/important-features.png');
});
```

`options` 对象包含以下属性

| 属性 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `scrollTargetX`, `scrollTargetY` | number | 该点的坐标，是相对于目标元素计算的。| 元素的中心。 |
| `includeMargins` | boolean | 是否包含外边距 (margin) | `false` |
| `includeBorders` | boolean | 是否包含边框 (border) | `true` |
| `includePaddings` | boolean | 是否包含内边距 (padding) | `true` |
| `crop` | Object | 是否允许裁剪屏幕截图上的目标元素。 | 裁剪到整个元素。如果它不适合窗口大小，则为其可见部分。 |

`crop` 对象具有以下字段

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| `top` | number | 裁剪矩形的上边缘。如果传递负数，则从元素的下边缘计算坐标。 |
| `left` | number | 裁剪矩形的左边缘。如果传递负数，则从元素的右边缘计算坐标。 |
| `bottom` | number | 裁剪矩形的下边缘。如果传递负数，则从元素的上边缘计算坐标。 |
| `right` | number | 裁剪矩形的右边缘。如果传递负数，则从元素的左边缘计算坐标。 |

![take screenshot](//static.mutoe.com/2018/testcafe/screenshot-crop.png)

``` js
test('Take a screenshot of my new avatar', async t => {
  await t
    .click('#change-avatar')
    .setFilesToUpload('#upload-input', 'img/portrait.jpg')
    .click('#submit')
    .takeElementScreenshot('#avatar', {
      includeMargins: true,
      crop: {
        top: -100,
        left: 10,
        bottom: 30,
        right: 200
      }
    });
});
```

### 上传 setFilesToUpload (no)

> 暂未更新

### 调整窗口尺寸 resize (no)

> 暂未更新

### 动作选项 (no)

> 暂未更新

## 断言

你可以使用断言来检查测试的网页状态是否与预期状态匹配。  
TestCafe 提供了一组基于行为驱动开发风格（BDD风格）的断言方法。

### 构造断言

要构造一个断言，可以使用测试控制器 (`t`) 的 expect 方法。

``` js
await t.expect( actual )
```

这个构造方法接受一个实际值，可以是 selector 的 DOM 节点状态属性或者是一个从页面中侦听到的 promise 对象。
TestCafe 会自动等待节点状态值的变动。

接下来跟一个断言方法，他接受期望值和一些其他的可选参数。

### 断言方法

#### 等于 eql

``` js
await t.expect( actual ).eql( expected [, message] [, options ])
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `actual` | Any | 比较值，如果是一个 promise 对象，TestCafe 会自动等待值的变化 |
| `expected` | Any | 期望值 |
| `message` _(optional)_ | string | 如果测试失败，需要在测试报告中输出的字符串 |
| `options` _(optional)_ | Object | 参见[断言选项]() |

``` js
await t
  .expect({ a: 'bar' }).eql({ a: 'bar' }, 'this assertion will pass')
  .expect({ a: 'bar' }).eql({ a: 'foo' }, 'this assertion will fail');
```

``` js
test('My test', async t => {
  await t.expect(Selector('.className').count).eql(3);
});
```

#### 不等于 notEql

#### 真值 ok

#### 假值 notOk

#### 包含 contains

#### 不包含 notContains

#### 类型等于 tyoeOf

#### 类型不等于 notTypeOf

#### 大于 gt

#### 大于等于 gte

#### 小于 lt

#### 小于等于 lte

#### 在某个范围 within

#### 不在某个范围 notWithin

#### 正则匹配 match

#### 非正则匹配 notMatch

### 断言选项



## 侦测数据变化 (no)

> 暂未更新

## 等待 (no)

> 暂未更新
