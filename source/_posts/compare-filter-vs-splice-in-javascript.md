---
title: 比较 javascript 中 filter 和 splice 删除数组的性能
date: 2019-01-18 14:53:20
categories: 心得
tags:
 - JavaScript
 - benchmark
 - mockjs
 - lodash
---

# 前言

因为最近在项目中经常需要将数组中的一个元素从数组中剔除，基于 ES6 的选择有比较多，
产生了一个关于几种方法之间执行效率的疑惑，网上也没有太多资料，于是乎本着学习性能测试的想法，展开了一段性能测试的旅程

# 测试工具

- `benchmark` 性能测试核心依赖
- `mockjs` 生成假数据
- `lodash` 提供另外的筛选数组的方法用于参照

``` bash
yarn add benchmark mockjs lodash
```

# 测试思路

首先定义四种方法来测试数据删除操作，他们分别是 `Array.prototype.filter` `Array.prototype.splice` `lodash.reject` `lodash.filter` 

然后使用 `mockjs` 生成两个数组，长度分别是 100 和 1000，用四种方法分别对这两组数据进行测试。  
需要注意的是，在测试时需要对测试数组进行深拷贝，避免他们之间相互影响(毕竟 `Array.prototype.splice` 会改变原数组)

然后我们对其中一组数据进行测试，来校验我们写的方法是否正确

最后运行 `benchmark`，比较结果得出结论

<!-- more -->

# 测试代码

``` js
// benchmark.js

// 引入相关依赖
const _ = require('lodash')
const { mock, Random } = require('mockjs')
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()

// Array.prototype.filter
function fun1 (array, id) {
  return array.filter(item => item.id !== id)
}
// Array.prototype.splice
function fun2 (array, id) {
  const index = array.map(item => item.id).indexOf(id)
  array.splice(index, 1)
  return array
}
// lodash.reject
function fun3 (array, id) {
  return _.reject(array, item => item.id === id)
}
// lodash.filter
function fun4 (array, id) {
  return _.filter(array, item => item.id !== id)
}

// 生成两组假数据
console.time('generate data')
const data100 = mock({ 'array|100': [{ 'id|+1': 1, 'name': Random.name(), 'content': Random.paragraph() }] }).array
const data1000 = mock({ 'array|1000': [{ 'id|+1': 1, 'name': Random.name(), 'content': Random.paragraph() }] }).array
console.timeEnd('generate data')

// 校验结果
console.time('test')
for (let i = 1; i <= 4; i++) {
  const result = eval(`fun${i}([...data100], 2)`)
  if (result[1].id !== 3 || result.length !== 99) throw new Error(`fun${i} test failed.`)
}
console.timeEnd('test')

// 开测
suite
  .add('Array.prototype.filter 100', () => {
    fun1(data100, 50)
  })
  .add('Array.prototype.splice 100', () => {
    fun2(data100, 50)
  })
  .add('lodash.reject 100', () => {
    fun3(data100, 50)
  })
  .add('lodash.filter 100', () => {
    fun4(data100, 50)
  })
  .add('Array.prototype.filter 1000', () => {
    fun1(data1000, 500)
  })
  .add('Array.prototype.splice 1000', () => {
    fun2(data1000, 500)
  })
  .add('lodash.reject 1000', () => {
    fun3(data1000, 500)
  })
  .add('lodash.filter 1000', () => {
    fun4(data1000, 500)
  })
  .on('cycle', event => {
    console.log(String(event.target).padStart(80))
  })
  .on('complete', function () {
    console.log('Faster is ' + this.filter('fastest').map('name'))
  })
  .run({
    async: true,
  })
```

# 运行测试

``` bash
node benchmark.js
```

# 测试结果

    generate data: 24.946ms
    test: 1.099ms
    
          Array.prototype.filter 100 x 1,917,735 ops/sec ±0.77% (89 runs sampled)
         Array.prototype.splice 100 x 12,774,324 ops/sec ±0.54% (90 runs sampled)
                  lodash.reject 100 x 26,526,046 ops/sec ±0.64% (91 runs sampled)
                  lodash.filter 100 x 47,850,218 ops/sec ±0.91% (91 runs sampled)

           Array.prototype.filter 1000 x 169,970 ops/sec ±6.32% (92 runs sampled)
        Array.prototype.splice 1000 x 12,802,157 ops/sec ±0.71% (86 runs sampled)
                 lodash.reject 1000 x 26,534,300 ops/sec ±0.63% (92 runs sampled)
                 lodash.filter 1000 x 47,920,887 ops/sec ±0.55% (93 runs sampled)

    Faster is lodash.filter 1000,lodash.filter 100

# 结论

- `Array.prototype.filter` 最最最最最最慢
- `Array.prototype.splice`  略慢
- `lodash.reject` 略快
- `lodash.filter` 最快

在数据量较大时，`Array.prototpe.filter` 方法会随着数组长度越来越慢，其他几种则似乎不太受影响。

在项目不使用 lodash 依赖或数据量较小时，可优先考虑 `Array.prototype.splice` 方法，不过要注意，`Array.prototype.splice` 会改变原数组

> 也不知道 lodash 内部用了什么黑科技，比 js 原生的 splice 还要快，有机会研究一下 lodash 源码，忙里偷闲写了篇文章，先继续工作了
