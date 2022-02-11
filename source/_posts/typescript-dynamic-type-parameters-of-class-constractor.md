---
title: TypeScript 进阶：Class 中的动态类型参数
categories: 心得
tags:
  - TypeScript
  - Vue
date: 2019-04-25 00:24:57
update: 2019-04-25 15:25:46
---


> 前段时间听说 Vue3.x 要使用 TypeScript 重构了, 本来一直都想研究一下 Vue 的源码, 这次带着夙愿来从头编写一个简单的、现代化的 Vue.

搭建好 TypeScript 开发环境后, 开始了一段 TypeScript 与 Vue 源码的探索之旅.

# 背景

我使用 ES6 `class` 创建了一个 Vue 类, 为了实现数据监听, 我使用了 ES2015 中的 `proxy` 方法来对数据进行封装, 
并且将这个 `proxy` 返回给类的构造方法, 以便于获取 `vm` 实例.

代码如下

<details>
<summary>查看源代码</summary>

``` ts
interface IOptions {
  data: () => Record<string, any>
}

class Vue {
  private $options: IOptions = {
    data: () => ({})
  }

  constructor(options: IOptions) {
    this.$options = options
    const proxy = this.initProxy()
    return proxy
  }

  initProxy() {
    const data = this.$options.data ? this.$options.data() : {}

    return new Proxy(this, {
      set(_, key: string, value) {
        data[key] = value
        return true
      },
      get(_, key: string) {
        return data[key]
      }
    })
  }
}

const vm = new Vue({
  data() {
    return {
      a: 1
    }
  }
})

vm.a = 2
// ^ Property 'a' does not exist on type 'Vue'.

console.log(vm.a) // => 2
//             ^ Property 'a' does not exist on type 'Vue'.

```
</details>

<details open>
<summary>在线版本</summary>

<iframe class="stackblitz" src="https://stackblitz.com/edit/typescript-kh4zmn?ctl=1&embed=1&file=index.ts&hideExplorer=1&hideNavigation=1&view=editor"></iframe>
</details>


如果你查看了在线版本, 可以看到, 我们在使用实例属性 `vm.a` 时报了一个 TS 错误 `Property 'a' does not exist on type 'Vue'`, 
意思是说 `vm` 实例上不存在属性 `a`.

<!-- more -->

虽然这段代码可以正常执行, 但是静态类型检查没有通过呀.

没关系, 万物皆 Any, 我们这样

``` ts
const vm: any = new Vue({
  data() {
    return {
      a: 1
    }
  }
})

vm.a = 2

console.log(vm.a)

```

Everything is any!

看起来还不错, 代码正常运行了, 静态类型检查也通过了. But ...

但是我们使用 TypeScript 的初衷呢? 我们不就是为了类型安全吗, 现在编辑器也不提示 `vm` 上有哪些属性了, 
就算用了 `vm.b` 也不报错了 \[掀桌.jpg]

不行, 我们不能这样.

<hr>

经过一番思考与探索, 最终我选择求助 overstackflow 上的网友, 在提出我的
[问题](https://stackoverflow.com/questions/55826350/how-to-dynamically-declare-an-instance-property-of-a-class-from-a-constructor-in)
后的短短 1 个小时内, 竟然获得了三个回答

其中有个网友提到, TypeScript 并不能知道 Proxy 上可能出现的属性, 必须在运行时才能知道.

但是我的观点是, 我并没有等到运行时才声明才会出现的属性, 而是在类声明之后的调用中声明属性, 我认为这仍然处于编译时的阶段.

不久之后看到了一个新的回答, 他说道这个问题需要两个步骤, 

第一个步骤是正确处理 `initProxy` 的返回值, 它将包含实例中动态声明的属性.

第二步是让类的返回值中也包含这个动态类型和类本身.

# Proxy

在 Proxy 的初始化方法 `initProxy()` 中, 我们将 `target` 绑定到了类的 `this` 中, 以便与我们使用 `vm.a` 来访问这个 proxy, 
它的返回值就是类本身

在构造函数 `constractor` 中我们将这个 proxy 返回给类, 试图让类的实例也获得 proxy 中声明的类型, 但是上面我们知道了, 这样行不通,

虽然这个实例确实获得了 proxy 的指向, 但是类型并没有被一并获得.

# 泛型

根据 [@Titian Cernicova-Dragomir 的回答](https://stackoverflow.com/a/55827723/7736393) 我们需要对这种动态的类型使用泛型变量

首先我们需要正确的获取 initProxy() 的返回值类型

<details>
<summary>查看源代码</summary>

``` ts
interface IOptions<T> {
  data: () => T
}

class Vue<T = {}> {
  private $options: IOptions<T> = {
    data: () => ({})
  } as IOptions<T>

  constructor(options: IOptions<T>) {
    this.$options = options
    const proxy = this.initProxy()
    return proxy
  }
  public initProxy(): T & Vue<T> {
    const data = this.$options.data ? this.$options.data() : {}

    return new Proxy(this as unknown as T & Vue<T>, {
      set(_, key: string, value) {
        data[key] = value
        return true
      },
      get(_, key: string) {
        return data[key]
      }
    })
  }
}

const vm = new Vue({
  data() {
    return {
      a: 1
    }
  }
})

vm.initProxy().a // ok now

```
</details>

<details open>
<summary>在线版本</summary>

<iframe class="stackblitz" src="https://stackblitz.com/edit/typescript-wc52zd?ctl=1&embed=1&file=index.ts&hideExplorer=1&hideNavigation=1&view=editor"></iframe>
</details>

我们使用泛型变量 `T` 来告诉 TypeScript 我们即将要声明的 `data` 的类型, 这个类型变量将会用于声明:

- 接口 `IOptions` 的 `data` 属性的类型

  ``` ts
  interface IOptions<T> {
    data: () => T
  }
  ```

- `proxy` 的返回值类型

  ``` ts
  return new Proxy(this as unknown as T & Vue<T>, {/* ... */}) 
  // Proxy 会返回第一个参数的类型
  ```

`IOptions<T>` 这个接口在构造函数中进行了声明, 实例化类时就会获得泛型变量 `T` 的实际类型

而 `proxy` 的返回值类型中我们使用到了 TS 中的交叉类型 (Intersection Types), 它会返回这两个类型的所有属性.

# 修改类的返回值类型

[@Titian Cernicova-Dragomir](https://stackoverflow.com/a/55827723/7736393) 还指出, 
即使 TypeScript 允许我们指定 constractor 的返回值, 我们也无力改变这个类的返回值的**类型**, 所以

``` ts
vm.initProxy().a // It's ok

vm.a // Error: Property 'a' does not exist on type 'Vue'
```

我们有两个办法来克服这个限制:

## 1. 不使用构造函数实例化类

我们将构造函数私有化, 并且声明一个静态方法来实例话这个类, 在这个静态方法中返回类的类型和泛型 T

<details>
<summary>查看源代码</summary>

``` ts
interface IOptions<T> {
  data: () => T
}

class Vue<T = {}> {
  private $options: IOptions<T> = {
    data: () => ({})
  } as IOptions<T>

  private constructor(options: IOptions<T>) {
    this.$options = options
    const proxy = this.initProxy()
    return proxy
  }
  static create<T>(data: IOptions<T>): Vue<T> & T {
    return new Vue<T>(data) as unknown as Vue<T> & T
  }
  initProxy(): T & Vue<T> {
    const data = this.$options.data ? this.$options.data() : {}

    return new Proxy(this as unknown as T & Vue<T>, {
      set(_, key: string, value) {
        data[key] = value
        return true
      },
      get(_, key: string) {
        return data[key]
      }
    })
  }
}

const vm = Vue.create({
  data() {
    return {
      a: 1
    }
  }
})

vm.a = 2

```
</details>

<details open>
<summary>在线版本</summary>

<iframe class="stackblitz" src="https://stackblitz.com/edit/typescript-eyrsb8?ctl=1&embed=1&file=index.ts&hideExplorer=1&hideNavigation=1&view=editor"></iframe>
</details>

这种办法解决了我们的问题, 但是不完美. 我们实例话 Vue 类的时候, 需要这样写

``` ts
const vm = Vue.create({/* ... */})
```

这一点都不 OOP ~ \[掀桌.jpg]x2

## 2. 对类使用单独的签名

<details>
<summary>查看源代码</summary>

``` ts
interface IOptions<T> {
  data: () => T
}

class _Vue<T = {}> {
  private $options: IOptions<T> = {
    data: () => ({})
  } as IOptions<T>

  private constructor(options: IOptions<T>) {
    this.$options = options
    const proxy = this.initProxy()
    return proxy
  }
  initProxy(): Vue<T> {
    const data = this.$options.data ? this.$options.data() : {}

    return new Proxy(this as unknown as Vue<T>, {
      set(_, key: string, value) {
        data[key] = value
        return true
      },
      get(_, key: string) {
        return data[key]
      }
    })
  }
}

type Vue<T> = _Vue<T> & T
const Vue: new <T>(data: IOptions<T>) => Vue<T> = _Vue as any // 这很 any

const vm = new Vue({
  data() {
    return {
      a: 1
    }
  }
})

vm.a = 2

```
</details>

<details open>
<summary>在线版本</summary>

<iframe class="stackblitz" src="https://stackblitz.com/edit/typescript-9mhvbb?ctl=1&embed=1&file=index.ts&hideExplorer=1&hideNavigation=1&view=editor"></iframe>
</details>

完美的解决了我们的问题, 虽然这个办法需要声明一个额外的类型, 但是由于我们使用的是封装的高阶方法, 只要不影响使用就行啦!

再次感谢 [@Titian Cernicova-Dragomir](https://stackoverflow.com/users/125734/titian-cernicova-dragomir) !

# 参考链接

- [zzz945/write-vue3-from-scratch](https://github.com/zzz945/write-vue3-from-scratch)
- [Advanced Types - TypeScript](https://www.tslang.cn/docs/handbook/advanced-types.html)
- [How to dynamically declare an instance property of a class from a constructor in TypeScript? - @Titian Cernicova-Dragomir](https://stackoverflow.com/questions/55826350/how-to-dynamically-declare-an-instance-property-of-a-class-from-a-constructor-in)
