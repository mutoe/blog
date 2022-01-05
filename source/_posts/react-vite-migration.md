---
title: React Vite 迁移指南  
date: 2021-03-06 22:12:53  
categories: 教程  
tags:
  - React
  - Vite
---

Vite2 发布有一段时间了，其内部使用了 ESBuild 进行打包，ESBuild 有着相对 Webpack 惊人的打包速度。

![esbuild benchmark](https://static.mutoe.com/2021/react-vite-migration/esbuild-benchmark.svg)
_[数据来自 github.com/evanw/esbuild](https://github.com/evanw/esbuild#why)_

React 用户表示令人羡慕，不过 Vite 野心比较大，不止可以用来开发 Vue 项目，类似 Rollup，Vite2 可以使用插件来支持 React 项目。

这就巧了，手上刚好有一个 React 练习项目，使用 Create React App 创建并且进行过 Eject。接下来我们就用这个 React 项目来练练手吧，享受一下飞一般的构建速度！

<!-- more -->

# 1. 移除无用依赖

如果你的 React 项目是使用 Create React App 创建出来并且没有 Eject 过，那么步骤是非常简单的。

只需要从 `package.json` 中移除 `react-scripts` 即可。

如果你进行过 Eject, 那么你需要移除所有 webpack 相关依赖（xxx-loader, xxx-webpack-plugin），只需保留你需要使用的依赖。

最终剩下的有 lint / test / 工具类以及业务相关依赖。

# 2. 修改静态文件目录结构

将 `public/index.html` 移至根目录（如果不想也可以之后从 vite 配置），其他文件移至 `src/assets/` 下, 然后移除 `public` 目录。

然后在 `index.html` 中添加以下内容至 div#app 后

```html index.html
<div id="root"></div>
<script type="module" src="src/index.tsx"></script>
```

<details>
<summary>点击这里查看修改后的 <code>index.html</code></summary>

```html index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="src/assets/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="Web site created using create-react-app" />
  <title>React App</title>
</head>
<body>

<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="root"></div>

<script>const global = globalThis</script>
<script type="module" src="src/index.tsx"></script>
</body>
</html>
```

</details>

如过 Eject 过， 还需移除 `config` `scripts` 目录。

# 3. 安装 Vite

```shell
npm install -D vite @vitejs/plugin-react-refresh
# or
yarn add -D vite @vitejs/plugin-react-refresh
```

然后修改启动脚本

```json package.json
{
  "scripts": {
    "start": "vite",
    "build": "tsc && vite build",
    "serve": "vite preview",
    ...
  }
}
```

(如果没有使用 TypeScript，可以去除 `tsc`)

然后创建 vite 配置文件在项目跟目录下，命名为 `vite.config.js`

```js vite.config.js
import reactRefresh from '@vitejs/plugin-react-refresh'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'src': resolve(__dirname, 'src'),
    },
  },
  plugins: [ reactRefresh() ],
})
```

# 4. 修改 `tsconfig.json`

_如不使用 TypeScript 可跳过此步骤_

- `compilerOptions.target` 修改为 `ESNext`
- `compilerOptions.types` 增加 `vite/client`

<details>
<summary>提供一个示例文件，点击查看</summary>

```json tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": [
      "DOM",
      "DOM.Iterable",
      "ESNext"
    ],
    "types": [
      "vite/client",
      "jest",
      "jest-dom"
    ],
    "baseUrl": ".",
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react"
  },
  "include": [
    "src"
  ]
}
```

</details>

# 5. 启动项目

```shell
npm run start
# or
yarn start
```

享受飞一般的编译速度吧

![webpack build result](https://static.mutoe.com/2021/react-vite-migration/webpack-build-result.png)
_Webpack build_

![vite build result](https://static.mutoe.com/2021/react-vite-migration/vite-build-result.png)
_Vite build_

可以看到，迁移到 Vite 后，构建速度由原先的34s 提升到了 12s, 提速 2.8 倍，更舒服的是 dev 模式下 vite 几乎是秒开，而 webpack 还是要等 20s 左右。

根据 ESBuild 给出的 benchmark 报告来看，Webpack5 在构建速度上并没有什么进步反而还在倒退。所以目前来说迁移到 Vite 还可以，值得注意的是 Vite2 兼容大部分 rollup
插件，所以对于迁移还是包容度比较高，不过对于生产环境还是建议大家慎重，可以观察一段时间。

# 需要注意

## 浏览器兼容性

[Vite - Browser Support](https://vitejs.dev/guide/#browser-support)

Vite2 使用了 es6-module 特性，不支持 IE ([Caniuse](https://caniuse.com/es6-module))，如果想支持 IE，可以使用 `@vitejs/plugin-legacy` 插件

## `process.env.XXX`

[Vite - Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html#env-variables-and-modes)

Vite 中不再使用 `process.env.XXX` 来读取环境变量，取而代之的是使用

- `import.meta.env.MODE` 运行环境，与 `.env.*` 文件相关
- `import.meta.env.BASE_URL` 项目部署的子路径
- `import.meta.env.PROD` 返回 Boolean，是否运行在 Production
- `import.meta.env.DEV` 返回 Boolean，是否运行在 Development

项目如果指定了二级路径(PUBLIC_URL), 现在需要在 build 时指定 `--base=/sub-path/` 参数。  
在代码中读取 path 时由 `process.env.PUBLIC_URL` 变更为 `import.meta.env.BASE_URL`

## Proxy

[Vite - Config(server.proxy)](https://vitejs.dev/config/#server-proxy)

Vite2 中开发环境代理配置在 `vite.config.js` 中

```js vite.config.js
export default {
  server: {
    proxy: {
      // string shorthand
      '/foo': 'http://localhost:4567/foo',
      // with options
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // with RegEx
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, '')
      }
    }
  }
}
```

## Jest

迁移到 Vite 后单元测试大批的挂，起因是因为我把 babel 相关内容都移除了，

后来根据 Jest 官方文档进行了一波修复 [Jest - Using TypeScript](https://jestjs.io/docs/en/getting-started#using-typescript)

需要注意的是，如果是通过 CRA 并 Eject 的项目需要移除 `transform` 和 `transformIgnorePatterns` 字段

测试环境下需要打开 `@babel/preset-env` 的 `modules` 选项，而开发或构建必须关掉，所以需要 `babel.config.js` 做一些判断

<details>
<summary>附上 Babel 配置和 Jest 配置, 安装相应依赖安装即可</summary>

```js babel.config.js
module.exports = api => {
  const isTest = api.env('test')

  return {
    presets: [
      [ '@babel/preset-env', { modules: isTest ? 'auto' : false } ],
      '@babel/preset-typescript',
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-runtime',
      'babel-plugin-transform-import-meta', // 用于处理 import.meta 的问题
    ],
  }
}
```

```json package.json
{
  ...
  "jest": {
    "roots": [ "<rootDir>/src" ],
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": [ "<rootDir>/src/setupTests.ts" ],
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
    ],
    "moduleNameMapper": {
      "^src/(.*)$": "<rootDir>/src/$1"
    },
    "moduleFileExtensions": [ "js", "ts", "tsx", "json" ]
  }
}
```

</details>

## `global is not defined`

我的项目中使用了 Draftjs, 在加载页面时报了 `global is not defined`
错误，在社区找到了可行的[解决方案](https://github.com/aws-amplify/amplify-js/issues/678#issuecomment-384260863)

在 `index.html` 的 root div 下方加入以下内容

```html

<script>const global = globalThis</script>
```

## `vite.config.ts` 中无法使用 `import.meta.env` 读取环境变量

`vite.config.ts` 在执行时处于编译时，所以可以使用 `process.env` 获取环境变量。

至于获取启动 Vite 的 mode 和 development/production，可以参考 https://vitejs.dev/config/#conditional-config

## Webpack dev server 中 proxy 配置了 onProxyRes 在 Vite 中失效

Vite proxy 底层时用了 [node-http-proxy](https://github.com/http-party/node-http-proxy#options)，新的用法如下

```ts vite.config.ts
{
  proxy: {
    '/api': {
      target: 'http://xxx.com',
      configure: proxy => {
        proxy.on('proxyRes', (proxyRes, req, res) => {
          // ...
          res.send()
        })
      }
    }
  }
}
```
