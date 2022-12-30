---
title: testcafe -- 一个基于 nodejs 自动化测试框架
categories: 心得
tags:
  - Test
  - NodeJS
  - Testcafe
date: 2018-10-21 21:50:35
update: 2019-04-03 11:30:18
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

稍等片刻，我们的浏览器就会被自动打开然后运行测试脚本，最后浏览器被自动关闭，在终端上留下了测试结果。

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

t 是我们的测试用例的控制器，它又很多方法，在上面的例子中，我们调用了它的 `typeText` 和 `click` 两个方法，其中

- `typeText` 方法用来键入文本，它接受两个参数：第一个参数是 selector 选择器（它的语法类似 jQuery 选择器的语法）；第二个参数是你要键入的文本；
- `click` 方法用来模拟鼠标点击，它接受一个参数，是一个 selector 选择器

> 有关这个控制器的更多方法，请先参考 [TestCafe 官方 API 手册](https://devexpress.github.io/testcafe/documentation/test-api/actions/) (它是一个英文文档，稍后我会整理出这个文档的中文手册在本页下方)

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

我们使用测试用例控制器的 `t.expect()` 方法来进行断言,  
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

### 测试用例 Tests

你可以使用 `test` 方法声明一个测试用例。

``` js
test( testName, fn(t) )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `testName` | string | 测试用例的名称 |
| `fn` | Function | 包含测试代码的异步函数 |
| `t` | Object | 测试用例的[测试控制器](#) |

``` js
fixture('MyFixture')

test('Test1', async t => {
  /* Test 1 Code */
})

test('Test2', async t => {
  /* Test 2 Code */
})
```

TestCafe 测试在服务器端执行。
你可以使用[测试动作](#动作)来操纵测试的网页。
要确定页面元素的状态或从客户端获取任何其他数据，请使用[选择器](#选择器-selector)和客户端方法。

要检查页面状态是否与预期页面状态匹配，请使用[断言](#断言)。

#### 测试控制器 Test Controller

如果要使用[测试动作](#动作)、[断言](#断言)、或者[等待](#等待), 必须挂在在测试控制器上.



### 指定起始页面

您可以指定 fixture 中所有测试启动时的 web 页面。

``` js
fixture.page( url )
fixture.page `url`
```

类似的，你也可以为特定的测试用例置顶一个起始的 web 页面。

``` js
test.page( url )
test.page `url`
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `url` | string | 指定起始页面的 URL |

``` js
fixture('MyFixture')
  .page('http://devexpress.github.io/testcafe/example')

test('Test1', async t => {
  // Starts at http://devexpress.github.io/testcafe/example
})

test.page('http://devexpress.github.io/testcafe/blog/')
  ('Test2', async t => {
      // Starts at http://devexpress.github.io/testcafe/blog/
  })
```

如果没有指定起始页面，则打开 `about:blank` 页面。

你也可以使用 `file://` 协议或相对路径

``` js
fixture('MyFixture')
  .page('file:///user/my-website/index.html')
```

``` js
fixture('MyFixture')
  .page('../my-project/index.html')
```

### 测试元数据

你可以使用键值对的方式为测试指定元数据，并在测试报告中展示这些元数据。

要定义元数据，请使用 `meta` 方法。

``` js
fixture
  .meta('fixtureID', 'f-0001')
  .meta({ author: 'John', creationDate: '05/03/2018' })
  
test
  .meta('testID', 't-0001')
  .meta({ severity: 'critical', testedAPIVersion: '1.0' })
  ('MyTest', async t => { /* ... */})
```

你可以使用 [custom reporter](https://devexpress.github.io/testcafe/documentation/extending-testcafe/reporter-plugin/) 来访问测试元数据。

报告器的 `reportFixtureStart` 和 `reportTestDone` 方法来访问测试元数据

### 钩子

#### 测试组钩子

在每个测试组开始前、结束后，都可以执行特定的方法，它叫做钩子。如果一个测试在多个浏览器中运行，则在每个浏览器中都会执行指定钩子。

你可以指定测试组开始前、结束后执行的钩子

``` js
fixture `My fixture`
  .page `http://example.com`
  .before( async ctx => {
    /* fixture initialization code */
  })
  .after( async ctx => {
    /* fixture finalization code */
  });
```

#### 测试用例钩子

在每次测试的开始前、结束后，也有相应的钩子。


``` js
fixture.beforeEach( fn(t) )
fixture.afterEach( fn(t) )

test.before( fn(t) )
test.after( fn(t) )
```

> 如果指定了 `test.before()` 或 `test.after()`， 那么它会覆盖 `fixture.beforeEach()` 或 `fixture.afterEach()` 的钩子。 

``` js
fixture `My fixture`
  .page `http://example.com`
  .beforeEach( async t => {
      /* test initialization code */
  })
  .afterEach( async t => {
      /* test finalization code */
  });

test
  .before( async t => {
      /* test initialization code */
  })
  ('MyTest', async t => { /* ... */ })
  .after( async t => {
      /* test finalization code */
  });
```

#### 在钩子和测试代码之间共享变量

通过使用测试的上下文对象，来共享在钩子和测试代码之间的变量。

测试的上下文对象为 `t.ctx`，使用它来代替全局变量。

``` js
fixture `Fixture1`
  .beforeEach(async t  => {
    t.ctx.someProp = 123;
  });

test
  ('Test1', async t => {
    console.log(t.ctx.someProp); // > 123
  })
  .after(async t => {
    console.log(t.ctx.someProp); // > 123
  });
```

> 需要注意的是，每个测试都有自己的测试上下文对象。每次测试开始时，`t.ctx` 都是一个空的对象。

在测试组的钩子中，回调函数的参数为 `ctx`，即为测试的上下文对象，在测试代码中可以使用 `t.fixtureCtx` 来访问它

``` js
fixture `Fixture1`
  .before(async ctx  => {
    ctx.someProp = 123;
  })
  .after(async ctx  => {
    console.log(ctx.newProp); // > abc
  });

test('Test1', async t => {
  console.log(t.fixtureCtx.someProp); // > 123
});

test('Test2', async t => {
  t.fixtureCtx.newProp = 'abc';
});
```

### 跳过测试

你在写测试用例时，可以跳过某个测试用例或者只执行某个测试用例

``` js
fixture.skip `Fixture1`; // 所有该测试组的用例都会被跳过

test('Fixture1Test1', () => {});
test('Fixture1Test2', () => {});

fixture `Fixture2`;

test('Fixture2Test1', () => {});
test.skip('Fixture2Test2', () => {}); // 这个测试用例会被跳过
test('Fixture2Test3', () => {});
```

``` js
fixture.only `Fixture1`;
test('Fixture1Test1', () => {});
test('Fixture1Test2', () => {});

fixture `Fixture2`;

test('Fixture2Test1', () => {});
test.only('Fixture2Test2', () => {});
test('Fixture2Test3', () => {});

// 只有 `Fixture1` 测试组和 `Fixture2Test2` 测试用例会被执行
```

## 页面元素选择

### 选择器 selector

选择器是标识测试中的网页元素的方法。选择器 API 提供了选择页面上的元素并获取其状态的方法和属性。

要从 `testcafe` 模块导入 `Selector` 构造函数，调用此构造函数并将 CSS 选择器字符串作为参数传递。

``` js
import { Selector } from 'testcafe';

const article = Selector('.article-content');
```

`Selector` 参数语法类似于 jQuery 选择器语法，他们都是使用的 [CSS选择器](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors) 语法。
在上面的例子中，我们选择了一个 class 为 `atricle-content` 的元素。
然后我们就可以使用这个选择器对对元素进行操作了。

``` js
await t.click(article)
```

或者在断言方法中使用它

``` js
await t.expect(article.scrollHeight).eql(1800)
```

甚至还可以编写一个匹配多个页面元素的选择器，然后按文本、属性等对它们进行过滤。
下面这两个例子首先选择了一个 class 为 `radio-button` 的元素，并且其中的文本为 "Windows"，第二个是含有属性为 `selected` 的元素。

``` js
const windowsRadioButton  = Selector('.radio-button').withText('Windows');
const selectedRadioButton = Selector('.radio-button').withAttribute('selected');
```

如果需要在 DOM 树中查找特定元素，可以使用选择器 API 的[搜索方法]()查找它。

``` js
const buttonWrapper = Selector('.article-content').find('#share-button').parent();
```

#### 创建选择器

``` js
Selector( init [, options] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `init` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | 标识要选择的 DOM 节点 |
| `options` _(可选的)_ | Object | 选项, 有关[选择器选项]() |

- 使用一个 CSS 选择器

  ``` js
  import { Selector } from 'testcafe';

  const usernameInput = Selector('#username');
  ```
  
- 使用一个在客户端执行的函数，必须返回一个 `DOM node`，一组 `DOM nodes`， `NodeList`, `HTMLCollection`, `null` 或者 `undefined`，或者 Promise.resolve() 为以上内容的方法

  请注意，它不能使用一些外部变量，因为该方法是在浏览器中运行的

  ``` js
  import { Selector } from 'testcafe';

  const element = Selector(() => {
      const storedElementId = window.localStorage.storedElementId;
      return document.querySelector(storedElementId);
  });
  ```
  
- 一个 `Selector` 构造器

  ``` js
  import { Selector } from 'testcafe';
  
  const ctaButton = Selector('.cta-button');
  Selector(ctaButton, { visibilityCheck: true });
  ```

#### 使用选择器

本主题描述如何标识DOM元素并使用选择器获取关于它们的信息。

##### 检查元素是否存在

选择器可能返回一个、多个或者不存在匹配的元素。您可以使用一下属性来检查元素是否存在，或者确定匹配元素的数量。

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `exists` | boolean | 如果匹配到元素则返回 `true` |
| `count` | number | 选择器匹配的节点数量 |

``` js
import { Selector } from 'testcafe';

fixture `Example page`
  .page `http://devexpress.github.io/testcafe/example/`;

test('My test', async t => {
  const osCount            = Selector('.column.col-2 label').count;
  const submitButtonExists = Selector('#submit-button').exists;

  await t
    .expect(osCount).eql(3)
    .expect(submitButtonExists).ok();
});
```

> 注意，选择器的 getter 是异步的

##### 获取元素的状态

你也可以获取选择器匹配元素的状态（size、position、classes 等）。有关[元素的状态](#)

``` js
import { Selector } from 'testcafe';

fixture `My fixture`
  .page('http://devexpress.github.io/testcafe/example/');

const windowsInput = Selector('#windows');

test('Obtain Element State', async t => {
  await t.click(windowsInput);
  const windowsInputChecked = await windowsInput.checked; // returns true
});
```

###### DOM 节点快照

如果你需要获取整个 DOM 元素实例的状态，需要使用 `await` 来匹配

``` js
import { Selector } from 'testcafe';

fixture `My fixture`
  .page `http://devexpress.github.io/testcafe/example/`;

test('DOM Node Snapshot', async t => {
  const sliderHandle = Selector('#slider').child('span');
  const sliderHandleSnapshot = await sliderHandle();

  console.log(sliderHandleSnapshot.hasClass('ui-slider-handle'));    // => true
  console.log(sliderHandleSnapshot.childElementCount);               // => 0
});
```

##### 定义动作的目标

你还可以将选择器的返回值作为测试控制器操作的目标。DOM 节点快照同样可以。

``` js
import { Selector } from 'testcafe';

fixture `My fixture`
    .page `http://devexpress.github.io/testcafe/example/`;

const label = Selector('#tried-section').child('label');

test('My Test', async t => {
  const labelSnapshot = await label();

  await t.click(labelSnapshot);
});
```

如果匹配到多个目标元素，那么只有匹配到的第一个元素将会被操作。

##### 定义断言的目标

你可以将选择器的返回值作为断言的目标。

``` js
import { Selector } from 'testcafe';

fixture `My fixture`
  .page `http://devexpress.github.io/testcafe/example/`;

test('Assertion with Selector', async t => {
  const developerNameInput = Selector('#developer-name');

  await t
    .expect(developerNameInput.value).eql('')
    .typeText(developerNameInput, 'Peter')
    .expect(developerNameInput.value).eql('Peter');
});
```

##### 选择器超时

在测试期间，testcafe 会一次又一次的检查，等待目标元素变得可见，如果超时还不可见则不会通过测试用例。

**如何设置超时**

- 你可以在选择器构造函数的[选项](#)中指定超时时间。
- 如果使用 API 进行测试，则需要在 [`runner.run`](#) 方法中指定。
- 如果使用命令行启动，则需要指定[选择器超时](#) 选项。

##### 调试选择器

Testcafe 会输出有关于测试报告运行失败时的详细信息。

如果你尝试使用不匹配任何DOM元素的选择器时，测试失败并抛出一个错误。错误消息指示哪个选择器失败。

![failed selector report](//static.mutoe.com/2018/testcafe/failed-selector-report.png)

#### 选择器的方法

##### 过滤 DOM 节点

如果选择器返回多个DOM节点，你可以对它们进行筛选，以选择一个最终将由选择器返回的节点。选择器提供了根据索引、文本、属性等过滤DOM节点的方法。

###### 根据索引 (nth)

| 参数 | 返回值类型 | 描述 |
| --- | --- | --- |
| `nth(index)` | Selector | 根据匹配集中的索引查找元素。`index` 参数为从 `0` 开始的索引，如果指定为负数，则从末尾开始计算索引。 |

``` js
// 返回第三个 ul 元素
Selector('ul').nth(2)

// 返回最后一个 div 元素
Selector('div').nth(-1)
```

##### 根据文本 (withText / withExactText)

| 参数 | 返回值类型 | 描述 |
| --- | --- | --- |
| `withText(text)` | Selector | 创建一个选择器，该选择器过滤指定**文本**的匹配项，选择包含此文本的元素。`text` 参数区分大小写。 |
| `withExactText(text)` | Selector | 创建一个选择器，该选择器过滤指定**文本**的匹配项，将会严格匹配等于该文本的元素。`text` 参数区分大小写。 |
| `withText(regexp)` | Selector | 创建一个选择器，该选择器过滤指定**正则表达式**的匹配项。 |

``` js
// 返回内容含有 'foo' 的 label 元素
// 不会返回含有 'foobar' 或 'Foo' 的元素
Selector('label').withText('foo')

// 返回匹配 /a[b-e]/ 文本的 div 元素。
// 会匹配 'ab', 'ac'。 不会匹配 'bb', 'aa'
Selector('div').withText(/a[b-e]/)
```

需要注意， `withText` 不仅会留下立即包含指定文本的元素，还会留下它的祖先元素。比如

``` html
<div class="container">
  <div class="child">some text</div>
</div>
```

``` js
// 这个选择器会匹配 '.container' 和 '.child'
Selector('div').withText('some text')
```

##### 根据属性 (withAttribute)

| 参数 | 返回值类型 | 描述 |
| --- | --- | --- |
| `withAttribute(attrName [, attrValue])` | Selector | 创建一个选择器，选择包含指定属性(或属性值)的元素。 |


| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `attrName` | string &vert; RegExp | 属性名，区分大小写。 |
| `attrValue` _(可选的)_ | string &vert; RegExp | 属性值，区分大小写。你可以省略它来匹配任何值。 |

``` js
// 匹配任何含有 href 属性的 a 标签
Selector('a').withAttribute('href')

// 匹配 title 属性为‘图片’的 img 元素
Selector('img').withAttribute('title', '图片')

// 匹配任何 src 属性以 'https://static.mutoe.com' 开头的 img 元素
Selector('img').withAttribute('src', /^https?:\/\/static\.mutoe\.com/)
```

##### 根据可见性 (filterVisible / filterHidden)

| 参数 | 返回值类型 | 描述 |
| --- | --- | --- |
| `filterVisible()` | Selector | 创建一个选择器，只留下可见的元素。这些元素**没有** `display: none;`, `visibility: hidden;`, `width: 0;` 或 `height: 0;` 这些属性 |
| `filterHidden()` | Selector | 创建一个选择器，只留下不可见的元素。这些元素**含有** `display: none;`, `visibility: hidden;`, `width: 0;` 或 `height: 0;` 这些属性 |

``` js
// 选择所有可见的 div 元素
Selector('div').filterVisible()

// 选择所有隐藏的 input 元素
Selector('input').filterHidden()
```

##### 根据过滤器 (filter)

| 参数 | 返回值类型 | 描述 |
| --- | --- | --- |
| `filter(cssSelector)` | Selector | 创建一个选择器，根据 css 选择器的语法过滤。 |
| `filter(filterFn(node, idx), dependencies)` | Selector | 创建一个选择器，根据节点的状态过滤。 |

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `cssSelector` | string | css 选择器 |
| `filterFn(node, idx)` | Function | 该方法将会在浏览器环境中执行 |
| `dependencies` | Function | 需要传递到客户端的方法，否则调用时不会出现在浏览器上下文环境中 |
| `node` | Element | 当前元素的 DOM node |
| `idx` | number | 当前 DOM node 所处的索引 |

``` js
// 从所有 li 标签中挑选含有 'active' class 的元素
Selector('li').filter('.active')
```

``` js
import { Selector } from 'testcafe'

fixture `Example page`
  .page `http://devexpress.github.io/testcafe/example/`

test('My test', async t => {
  const secondCheckBox = Selector('input')
    .withAttribute('type', 'checkbox')
    .nth(1)

  const checkedInputs = Selector('input')
    .withAttribute('type', 'checkbox')
    .filter(node => node.checked)

  const windowsLabel = Selector('label')
    .withText('Windows')

  await t
    .click(secondCheckBox)
    .expect(checkedInputs.count).eql(1)
    .click(windowsLabel)
})
```

如果所有的 DOM 都被过滤掉，`filter()` 选择器会返回 `null`

##### 根据关系 (find / parent / child / sibling)

| 参数 | 返回值类型 | 描述 |
| --- | --- | --- |
| `find(cssSelector)` | Selector | 返回当前元素匹配的所有子节点，并通过 css 选择器筛选它们。 |
| `find(filterFn, dependencies)` | Selector | 返回当前元素匹配的所有子节点，根据节点的状态过滤。 |
| `parent()` | Selector | 返回当前元素匹配的父节点。（第一个元素将会是最近的父元素） |
| `parent(index)` | Selector | 返回当前元素匹配的父节点，并通过索引筛选它们。`0` 是最近的父元素，负数将会从根结点开始计算。 |
| `parent(cssSelector)` | Selector | 返回当前元素匹配的父节点，并通过 css 选择器筛选。 |
| `parent(filterFn, dependencies)` | Selector | 返回当前元素匹配的父节点，根据节点的状态过滤。 |
| `child()` | Selector | 返回当前元素匹配的子节点。（第一个元素将会是最近的子元素） |
| `child(index)` | Selector | 返回当前元素匹配的子节点，并通过索引筛选它们。`0` 是最近的子元素，负数将会从根结点开始计算。 |
| `child(cssSelector)` | Selector | 返回当前元素匹配的子节点，并通过 css 选择器筛选。 |
| `child(filterFn, dependencies)` | Selector | 返回当前元素匹配的子节点，根据节点的状态过滤。 |
| `sibling()` | Selector | 返回当前元素匹配的兄弟元素。（第一个元素将会是最近的兄弟元素） |
| `sibling(index)` | Selector | 返回当前元素匹配的兄弟元素，并通过索引筛选它们。以 `0` 开始，负数将会从末尾开始计算。 |
| `sibling(cssSelector)` | Selector | 返回当前元素匹配的兄弟元素，并通过 css 选择器筛选。 |
| `sibling(filterFn, dependencies)` | Selector | 返回当前元素匹配的兄弟元素，根据节点的状态过滤。 |
| `nextSibling()` | Selector | 返回当前元素之后匹配的兄弟元素。（第一个元素将会是之后最近的兄弟元素） |
| `nextSibling(index)` | Selector | 返回当前元素之后匹配的兄弟元素，并通过索引筛选它们。以 `0` 开始，负数将会从末尾开始计算。 |
| `nextSibling(cssSelector)` | Selector | 返回当前元素之后匹配的兄弟元素，并通过 css 选择器筛选。 |
| `nextSibling(filterFn, dependencies)` | Selector | 返回当前元素之后匹配的兄弟元素，根据节点的状态过滤。 |
| `prevSibling()` | Selector | 返回当前元素之前匹配的兄弟元素。（第一个元素将会是之前最近的兄弟元素） |
| `prevSibling(index)` | Selector | 返回当前元素之前匹配的兄弟元素，并通过索引筛选它们。以 `0` 开始，负数将会从末尾开始计算。 |
| `prevSibling(cssSelector)` | Selector | 返回当前元素之前匹配的兄弟元素，并通过 css 选择器筛选。 |
| `prevSibling(filterFn, dependencies)` | Selector | 返回当前元素之前匹配的兄弟元素，根据节点的状态过滤。 |

**例子**

``` js
Selector('ul').find('label').parent('div.someClass')
```

找到页面上的所有ul元素。然后，在每个已找到的ul元素中找到label元素。然后，为每个label元素找到一个匹配div.someClass选择器的父元素。

```js
Selector('.container').parent(1).nth(0).find('.content').withText('yo!').child('span')
```

这个例子做了以下事情：

- 找到 `.container` 元素的第二个父元素（父元素的父元素）
- 选择匹配集中的第 1 个元素
- 在该元素中，查找与 `.content` 选择器匹配的元素
- 找到文本包含 'yo!' 的元素
- 在每个已过滤的元素中，搜索标记名为 `span` 的子项。

#### 选择器选项 (no)

> 暂未更新

#### 选择器拓展 (no)

> 暂未更新

#### 边缘情况 (no)

> 暂未更新

### DOM 节点状态

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
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器](#选择器-selector) |
| `options` _(可选的)_ | Object | 选项, 有关[点击动作选项](#点击动作选项-click-action) |

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
    .pressKey('backspace')
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
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器](#选择器-selector) |
| `options` _(可选的)_ | Object | 选项, 有关[点击动作选项](#点击动作选项-click-action) |

### 右击 rightClick

右击页面上的元素

``` js
t.rightClick( selector [, options] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器](#选择器-selector) |
| `options` _(可选的)_ | Object | 选项, 有关[点击动作选项](#点击动作选项-click-action) |


### 拖拽 drag

#### 拖拽一定距离 drag

``` js
t.drag( selector, dragOffsetX, dragOffsetY [, options] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器](#选择器-selector) |
| `dragOffsetX` | Number | 鼠标在 x 轴上需要拖拽的距离 |
| `dragOffsetY` | Number | 鼠标在 y 轴上需要拖拽的距离 |
| `options` _(可选的)_ | Object | 选项, 有关[鼠标动作选项](#鼠标动作选项-mouse-action) |

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
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器](#选择器-selector) |
| `destinationSelector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器, 拖拽目标元素，有关[选择器](#选择器-selector) |
| `options` _(可选的)_ | Object | 选项, 有关[拖拽到元素动作选项](#拖拽到元素动作选项-dragToElement-action) |

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
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器](#选择器-selector) |
| `options` _(可选的)_ | Object | 选项, 有关[鼠标动作选项](#鼠标动作选项-mouse-action) |

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
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器](#选择器-selector) | |
| `startPos` _(可选的)_ | Number | 选择的起始位置，从 0 开始的整数 | 0 |
| `endPos` _(可选的)_ | Number | 选择的结束位置，从 0 开始的整数 | 可见文本的长度 |
| `options` _(可选的)_ | Object | 选项, 有关[基本动作选项](#基本动作选项-basic-action) | |

``` js
const developerNameInput = Selector('#developer-name');

const getElementSelectionStart = ClientFunction(selector => selector().selectionStart);
const getElementSelectionEnd = ClientFunction(selector => selector().selectionEnd);

test('Select text within input', async t => {
  await t
    .typeText(developerNameInput, 'Test Cafe', { caretPos: 0 })
    .selectText(developerNameInput, 7, 1);

  await t
    .expect(await getElementSelectionStart(developerNameInput)).eql(1)
    .expect(await getElementSelectionEnd(developerNameInput)).eql(7);
});
```

> 如果 `startPos` 的值大于 `endPos` 的值，则动作将执行向前选择。

#### 在 textarea 元素中

``` js
t.selectTextAreaContent( selector [, startLine] [, startPos] [, endLine] [, endPos] [, options] )
```

| 参数 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器](#选择器-selector) | |
| `startLine` _(可选的)_ | Number | 选择开始的行号，从 0 开始的整数 | 0 |
| `startPos` _(可选的)_ | Number | 选择的起始位置，从 0 开始的整数 | 0 |
| `endLine` _(可选的)_ | Number | 选择结束的行号，从 0 开始的整数 | 最后一行的索引 |
| `endPos` _(可选的)_ | Number | 选择的结束位置(基于 `endline`)，从 0 开始的整数 | `endLine` 的最后一个字符 |
| `options` _(可选的)_ | Object | 选项, 有关[基本动作选项](#基本动作选项-basic-action) | |

``` js
const commentTextArea = Selector('#comments');

const getElementSelectionStart = ClientFunction(selector => selector().selectionStart);
const getElementSelectionEnd   = ClientFunction(selector => selector().selectionEnd);

test('Select text within textarea', async t => {
  await t
    .click('#tried-test-cafe')
    .typeText(commentTextArea, [
      'Lorem ipsum dolor sit amet',
      'consectetur adipiscing elit',
      'sed do eiusmod tempor'
    ].join(',\n'))
    .selectTextAreaContent(commentTextArea, 0, 5, 2, 10);

  await t
    .expect(await getElementSelectionStart(commentTextArea)).eql(5)
    .expect(await getElementSelectionEnd(commentTextArea)).eql(67);
});
```

> 如果 `startLine` 比 `endLine` 的值大，则执行向前选择。

#### 在 contentEditable 元素中

``` js
t.selectEditableContent( startSelector, endSelector [, options] )
```

| 参数 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `startSelector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | 标识开始选择的元素 selector 选择器，有关[选择器](#选择器-selector) | |
| `endSelector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | 标识结束选择的元素 selector 选择器，有关[选择器](#选择器-selector) | |
| `options` _(可选的)_ | Object | 选项, 有关[基本动作选项](#基本动作选项-basic-action) | |

此方法适用于启用了 `contentEditable` 属性的 HTML 元素。

``` js
test('Delete text within a contentEditable element', async t => {
  await t
    .selectEditableContent('#foreword', '#chapter-3')
    .pressKey('delete')
    .expect(Selector('#chapter-2').exists).notOk()
    .expect(Selector('#chapter-4').exists).ok();
});
```

### 键入文本 typeText

``` js
t.typeText( selector, text [, options] )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `selector` | Function &vert; string &vert; Selector &vert; Snapshot &vert; Promise | selector 选择器，有关[选择器](#选择器-selector) |
| `text` | string | 要在指定元素中输入的文本 |
| `options` _(可选的)_ | Object | 选项, 有关[输入动作选项](#输入动作选项-typing-action) | 

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
| `options` _(可选的)_ | Object | 选项, 有关[基本动作选项](#基本动作选项-basic-action) | 

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

| 参数    | 类型     | 描述                        |
|-------|--------|---------------------------|
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

### 动作选项 options

#### 基本动作选项 basic action

``` js
{
  speed: Number
}
```

| 参数 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `speed` | number | 动作的速度，在 `1`(最大速度) 和 `0.01`(最小速度) 之间 | `1` |

基本动作选项用于 `t.pressKey`，`t.selectText`，`t.selectTextAreaContent` 和 `t.selectEditableContent` 动作。

``` js
test('My Test', async t => {
  const nameInput = Selector('#developer-name');
  await t
    .typeText(nameInput, 'Peter')
    .typeText(nameInput, ' Parker', { speed: 0.1 });
});
```

#### 鼠标动作选项 mouse action

``` js
{
  modifiers: {
    ctrl: Boolean,
    alt: Boolean,
    shift: Boolean,
    meta: Boolean
  },

  offsetX: Number,
  offsetY: Number,
  speed: Number
}
```

| 参数 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `ctrl` `alt` `shift` `meta` | boolean | 在鼠标操作期间要按下的修饰键 | `false` |
| `offsetX` `offsetY` | number | 鼠标指针坐标，正整数从左上角计算，负整数从右下角计算 | 目标元素的中心 |
| `speed` | number | 动作的速度，在 `1`(最大速度) 和 `0.01`(最小速度) 之间 | `1` |


鼠标动作选项用于 `t.drag` 和 `t.hover` 动作。

``` js
test('My Test', async t => {
  await t
    .drag(sliderHandle, 360, 0, {
      offsetX: 10,
      offsetY: 10,
      modifiers: {
        shift: true
      }
    });
});
```

#### 拖拽到元素动作选项 dragToElement action

``` js
{
  modifiers: {
    ctrl: Boolean,
    alt: Boolean,
    shift: Boolean,
    meta: Boolean
  },

  offsetX: Number,
  offsetY: Number,
  destinationOffsetX: Number,
  destinationOffsetY: Number,
  speed: Number
}
```

| 参数 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `ctrl` `alt` `shift` `meta` | boolean | 在鼠标操作期间要按下的修饰键 | `false` |
| `offsetX` `offsetY` | number | 鼠标指针坐标，正整数从左上角计算，负整数从右下角计算 | 目标元素的中心 |
| `destinationOffsetX` `destinationOffsetY` | number | 鼠标拖拽完成时的指针坐标，正整数从左上角计算，负整数从右下角计算 | 目标元素的中心 |
| `speed` | number | 动作的速度，在 `1`(最大速度) 和 `0.01`(最小速度) 之间 | `1` |

拖拽到元素动作选项用于 `t.dragToElement` 动作。

``` js
test('My Test', async t => {
  const fileIcon      = Selector('.file-icon');
  const directoryPane = Selector('.directory');

  await t
    .dragToElement(fileIcon, directoryPane, {
      offsetX: 10,
      offsetY: 10,
      destinationOffsetX: 100,
      destinationOffsetY: 50,
      modifiers: {
        shift: true
      }
    });
});
```

#### 点击动作选项 click action

``` js
{
  modifiers: {
    ctrl: Boolean,
    alt: Boolean,
    shift: Boolean,
    meta: Boolean
  },

  offsetX: Number,
  offsetY: Number,
  caretPos: Number,
  speed: Number
}
```

| 参数 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `ctrl` `alt` `shift` `meta` | boolean | 在鼠标操作期间要按下的修饰键 | `false` |
| `offsetX` `offsetY` | number | 鼠标指针坐标，正整数从左上角计算，负整数从右下角计算 | 目标元素的中心 |
| `caretPos` | number | 如果在输入元素上执行动作，则为初始插入符号位置，从零开始的整数。 | 文本长度 |
| `speed` | number | 动作的速度，在 `1`(最大速度) 和 `0.01`(最小速度) 之间 | `1` |

点击操作选项用于 `t.click`，`t.doubleClick` 和 `t.rightClick` 动作。

``` js
test('My Test', async t => {
  const nameInput = Selector('#developer-name');
  await t
    .typeText(nameInput, 'Pete Parker')
    .click(nameInput, { caretPos: 4 })
    .pressKey('r');
});
```

#### 输入动作选项 typing action

``` js
{
  modifiers: {
    ctrl: Boolean,
    alt: Boolean,
    shift: Boolean,
    meta: Boolean
  },

  offsetX: Number,
  offsetY: Number,
  caretPos: Number,
  replace: Boolean,
  paste: Boolean,
  speed: Number
}
```

| 参数 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `ctrl` `alt` `shift` `meta` | boolean | 在鼠标操作期间要按下的修饰键 | `false` |
| `offsetX` `offsetY` | number | 鼠标指针坐标，正整数从左上角计算，负整数从右下角计算 | 目标元素的中心 |
| `caretPos` | number | 如果在输入元素上执行动作，则为初始插入符号位置，从零开始的整数。 | 文本长度 |
| `replace` | boolean | 是否替换原有文本 | `false` |
| `paste` | boolean | 是否使用粘贴的方式一次性键入文本 | `false` |
| `speed` | number | 动作的速度，在 `1`(最大速度) 和 `0.01`(最小速度) 之间 | `1` |

输入动作选项用于 `t.typeText` 动作。

``` js
test('My Test', async t => {
  await t
    .typeText(nameInput, 'Peter')
    .typeText(nameInput, 'Parker', { replace: true });
});
```

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
| `options` _(optional)_ | Object | 参见[断言选项](#断言选项) |

``` js
await t
  .expect({ a: 'bar' }).eql({ a: 'bar' }, '这个断言将会通过')
  .expect({ a: 'bar' }).eql({ a: 'foo' }, '这个断言将会失败，并且这句话会被打印出来');
```

``` js
test('My test', async t => {
  await t.expect(Selector('.className').count).eql(3);
});
```

#### 不等于 notEql

``` js
await t.expect( actual ).notEql( unexpected [, message] [, options ])
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `actual` | Any | 比较值，如果是一个 promise 对象，TestCafe 会自动等待值的变化 |
| `unexpected` | Any | 不期望的值 |
| `message` _(optional)_ | string | 如果测试失败，需要在测试报告中输出的字符串 |
| `options` _(optional)_ | Object | 参见[断言选项](#断言选项) |

``` js
await t
  .expect({ a: 'bar' }).notEql({ a: 'bar' }, '这个断言将会失败，并且这句话会被打印出来')
  .expect({ a: 'bar' }).notEql({ a: 'foo' }, '这个断言将会通过');
```

``` js
test('My test', async t => {
  await t.expect(Selector('.className').count).notEql(2);
});
```

#### 真值 ok

``` js
await t.expect( actual ).ok( [ message ] [, options ])
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `actual` | Any | 比较值，如果是一个 promise 对象，TestCafe 会自动等待值的变化 |
| `message` _(optional)_ | string | 如果测试失败，需要在测试报告中输出的字符串 |
| `options` _(optional)_ | Object | 参见[断言选项](#断言选项) |

``` js
await t
  .expect('ok').ok('这个断言将会通过')
  .expect(false).ok('这个断言将会失败，并且这句话会被打印出来');
```

``` js
test('My test', async t => {
  await t.expect(Selector('#element').exists).ok();
});
```

#### 假值 notOk

``` js
await t.expect( actual ).notOk( [ message ] [, options ])
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `actual` | Any | 比较值，如果是一个 promise 对象，TestCafe 会自动等待值的变化 |
| `message` _(optional)_ | string | 如果测试失败，需要在测试报告中输出的字符串 |
| `options` _(optional)_ | Object | 参见[断言选项](#断言选项) |

``` js
await t
  .expect('ok').notOk('这个断言将会失败，并且这句话会被打印出来')
  .expect(false).notOk('这个断言将会通过');
```

``` js
test('My test', async t => {
  await t.expect(Selector('#element').exists).notOk();
});
```

#### 包含 contains

``` js
await t.expect( actual ).contains( expected [, message ] [, options ])
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `actual` | Any | 比较值，如果是一个 promise 对象，TestCafe 会自动等待值的变化 |
| `expected` | Any | 期望值 |
| `message` _(optional)_ | string | 如果测试失败，需要在测试报告中输出的字符串 |
| `options` _(optional)_ | Object | 参见[断言选项](#断言选项) |

``` js
await t
  .expect('foo bar').contains('bar', '用例未通过：字符串 "foo bar" 里面不含有期望的 "bar" 子串')
  .expect([1, 2, 3]).contains(2, '用例未通过：数组中不含有期望的值')
  .expect({ foo: 'bar', hello: 'universe' }).contains({ foo: 'bar' }, '用例未通过：对象中不含有期望的属性')
```

``` js
test('My test', async t => {
  const getLocation = ClientFunction(() => document.location.href.toString())
  await t.expect(getLocation()).contains('example.com', '用例未通过：网址不包含期望的值');
});
```

#### 不包含 notContains

``` js
await t.expect( actual ).notContains( unexpected [, message ] [, options ])
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `actual` | Any | 比较值，如果是一个 promise 对象，TestCafe 会自动等待值的变化 |
| `unexpected` | Any | 不期望的值 |
| `message` _(optional)_ | string | 如果测试失败，需要在测试报告中输出的字符串 |
| `options` _(optional)_ | Object | 参见[断言选项](#断言选项) |

``` js
await t
  .expect('foo bar').notContains('bar', '用例未通过：字符串中含有不期望的子串')
  .expect([1, 2, 3]).notContains(2, '用例未通过：数组中含有不期望的值')
  .expect({ foo: 'bar', hello: 'universe' }).notContains({ buzz: 'abc' }, '用例未通过：对象中含有不期望的属性')
```

``` js
test('My test', async t => {
  const getLocation = ClientFunction(() => document.location.href.toString())
  await t.expect(getLocation()).notContains('example.com', '用例未通过：网址包含了不被期望的值');
});
```

#### 类型等于 tyoeOf

``` js
await t.expect( actual ).typeOf( typeName [, message ] [, options ])
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `actual` | Any | 比较值，如果是一个 promise 对象，TestCafe 会自动等待值的变化 |
| `typeName` | string | 期望的 `actual` 的类型 |
| `message` _(optional)_ | string | 如果测试失败，需要在测试报告中输出的字符串 |
| `options` _(optional)_ | Object | 参见[断言选项](#断言选项) |

``` js
await t
  .expect({ a: 'bar' }).typeOf('object', '用例未通过：比较值不是对象')
  .expect(/bar/).typeOf('regexp', '用例未通过：比较值不是正则表达式')
  .expect(null).typeOf('null', '用例未通过：比较值不为null')
```

``` js
test('My test', async t => {
  await t.expect(Selector('#element').getAttribute('attr')).typeOf('string');
});
```

#### 类型不等于 notTypeOf

``` js
await t.expect( actual ).notTypeOf( typeName [, message ] [, options ])
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `actual` | Any | 比较值，如果是一个 promise 对象，TestCafe 会自动等待值的变化 |
| `typeName` | string | 不期望的 `actual` 的类型 |
| `message` _(optional)_ | string | 如果测试失败，需要在测试报告中输出的字符串 |
| `options` _(optional)_ | Object | 参见[断言选项](#断言选项) |

``` js
await t
  .expect('bar').notTypeOf('number', '用例未通过：比较值不是数字类型')
```

``` js
test('My test', async t => {
  await t.expect(Selector('#element').getAttribute('attr')).notTypeOf('null');
});
```

#### 大于 gt

``` js
await t.expect( actual ).gt( expected [, message ] [, options ])
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `actual` | Any | 比较值，如果是一个 promise 对象，TestCafe 会自动等待值的变化 |
| `expected` | Any | 期望的值 |
| `message` _(optional)_ | string | 如果测试失败，需要在测试报告中输出的字符串 |
| `options` _(optional)_ | Object | 参见[断言选项](#断言选项) |

``` js
await t.expect(5).gt(2, '用例未通过：比较值应该比 2 大')
```

``` js
test('My test', async t => {
  await t.expect(Selector('#element').clientWidth).gt(300);
});
```

#### 大于等于 gte

``` js
await t.expect( actual ).gte( expected [, message ] [, options ])
```

用法同 [`gt`](#大于-gt)

#### 小于 lt

``` js
await t.expect( actual ).lt( expected [, message ] [, options ])
```

用法同 [`gt`](#大于-gt)

#### 小于等于 lte

``` js
await t.expect( actual ).lte( expected [, message ] [, options ])
```

用法同 [`gt`](#大于-gt)

#### 在某个范围 within

``` js
await t.expect( actual ).within( start, finish [, message ] [, options ])
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `actual` | number | 比较值，如果是一个 promise 对象，TestCafe 会自动等待值的变化 |
| `start` | number | 范围下限（包含） |
| `finish` | number | 范围上限（包含） |
| `message` _(optional)_ | string | 如果测试失败，需要在测试报告中输出的字符串 |
| `options` _(optional)_ | Object | 参见[断言选项](#断言选项) |

``` js
await t.expect(5).within(3, 10, '这个断言将会通过');
```

``` js
test('My test', async t => {
  await t.expect(Selector('#element').scrollTop).within(300, 400);
});
```

#### 不在某个范围 notWithin

``` js
await t.expect( actual ).notWithin( start, finish [, message ] [, options ])
```

用法同 [`within`](#在某个范围-within)

#### 正则匹配 match

``` js
await t.expect( actual ).match( regexp [, message ] [, options ])
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `actual` | string | 比较值，如果是一个 promise 对象，TestCafe 会自动等待值的变化 |
| `regexp` | RegExp | 用来匹配 `actual` 的正则表达式 |
| `message` _(optional)_ | string | 如果测试失败，需要在测试报告中输出的字符串 |
| `options` _(optional)_ | Object | 参见[断言选项](#断言选项) |

``` js
await t.expect('foobar').match(/^f/, '这个断言将会通过');
```

``` js
test('My test', async t => {
  const getLocation = ClientFunction(() => document.location.href.toString());
  await t.expect(getLocation()).match(/\.com/);
});
```

#### 非正则匹配 notMatch

``` js
await t.expect( actual ).notMatch( regexp [, message ] [, options ])
```

用法同 [`match`](#正则匹配-match)

### 断言选项

``` js
{
  timeout: Number,
  allowUnawaitedPromise: Boolean
}
```

| 参数 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| `timeout` | number | 如果在断言中使用了属性选择器或客户端函数，可等待的最大时间 (单位：ms) |
| `allowUnawaitedPromise` | boolean | 如果你要断言一个常规的 promise 方法，请将该选项设置为 `true` |

``` js
await t.expect(Selector('#elementId').innerText).eql('text', '在 500ms 内检查元素的文本', { timeout: 500 });
```

``` js
await t.expect(doSomethingAsync()).ok('检查异步函数是否含回了 promise 对象', { allowUnawaitedPromise: true });
```

## 客户端方法 (no)

> 暂未更新

## 等待

无论出于什么原因，让测试暂停一小会

``` js
t.wait( timeout )
```

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `timeout` | number | 暂停的持续时间，单位 ms |

``` js
await t
  .click('#play-1-sec-animation')
  .wait(1000)
  .expect(header.getStyleProperty('opacity')).eql(0);
```
