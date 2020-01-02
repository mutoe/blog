---
title: 手把手带你实践 TDD Nestjs Realworld 项目 - 1. 环境搭建篇
date: 2019-12-30 13:27:04
categories: 教程
tags:
  - Nestjs
  - TypeScript
  - Postgres
  - TDD
  - Jest
  - Docker
  - GitHub Actions
  - Swagger
  - ESLint
---

emmm, 最近计划着学习后端，本来想从 Java 开始，奈何新的知识点一股脑涌进来，只知道教程怎么做，而不说为什么，很是迷茫。

于是想从熟悉的技术栈开始，结合最近学习的知识（TDD、Docker、GitHub Actions）和想学的知识（NestJS、Postgres、Swagger）一步一步巩固和学习。

顺便记录下来沉淀和输出自己的知识，也希望能帮到大家少走一些弯路，告别 2019，迎接 2020！

# 0. 内容预告

我们这次将要实现的系统是 [Conduit](https://preact-realworld.mutoe.com/) 的 API 部分，前些时间我已经 TDD 实践实现了 [Conduit 的前端部分](https://github.com/mutoe/preact-realworld-example-app)，技术栈选择了 Preact.

Conduit 是什么，这是一个基于 [Realworld](https://github.com/gothinkster/realworld) 的示例项目。Realworld 集合了现今大部分的前后端框架，他们用不同的语言和技术展实现了同一个系统，也就是我们这次要做的 Conduit。

当然，Realworld 现在也有 NestJS 的实现，不过既然是结合自己的知识点来学，当然不能照抄啦，假装网友们还没用 NestJS 实现它好啦，[偷笑][偷笑]

这次用到的技术栈有：`Nestjs` `TypeScript` `Postgres` `Jest` `Docker` `Github Actions` `Swagger` `ESLint` , 然后我们会以 TDD 的方式进行开发，遵循“红-绿-重构”的方式一步一步的完成我们的项目。

好，话不多说，赶紧进入实战演练吧！

<!-- more -->

# 1. 开发环境搭建

## 1.1 前置内容准备

在教程开始前，我们假定你已经安装了以下环境并且了解这些环境的基本知识。

- Nodejs
- Yarn
- Docker
- GitHub 仓库
- 一个趁手的编辑器

> 其中 Docker 是可选的，不懂或者不想用也没关系，跟着做或跳过就好。

## 1.2 创建 NestJS 项目

打开命令行，进入到项目目录，输入以下命令全局安装 nestjs 命令行工具并且创建一个新的 nestjs 项目

```bash
yarn global add @nestjs/cli
nest new nestjs-realworld-example-app
```

出现 `Which package manager would you to use` 时，选择 `yarn`

稍等一会你会得到这样一个目录

```tree
./nestjs-realworld-example-app
├── .gitignore
├── .prettierrc
├── README.md
├── nest-cli.json
├── package.json
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
├── tsconfig.json
├── tslint.json
└── yarn.lock
```

## 1.3 修改 Lint 工具

我们把 nestjs cli 默认生成的 `prettier` 和 `tslint` 移除，用 `typescript-eslint` 和 `standard` 代替

> WHY?
>
> TypeScript 官方已经放弃了 TSLint 的支持，选用了 ESLint 作为下一代的语法风格检查工具，[参考这里](https://github.com/palantir/tslint#tslint)

执行以下命令安装 ESLint 相关依赖

```bash
cd nestjs-realworld-example-app
yarn add -D eslint eslint-plugin-jest @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

然后安装 standard 相关的依赖

```bash
yarn add -D eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard
```

然后删除 tslint 和 prettier 相关文件

```bash
rm -f .prettierrc tslint.json
```

修改 `package.json`

> 请注意，下面示例的内容为 diff 格式，为了方便比较修改的内容，红色代表被移除的行，绿色代表新增的行，本系列文章不再赘述。

```diff
  ...
  "scripts": {
    ...
-   "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    ...
-   "lint": "tslint -p tsconfig.json -c tslint.json",
+   "lint": "eslint '**/*.ts'",
    ...
  },
  "devDependencies": {
    ...
    "jest": "^24.9.0",
-   "prettier": "^1.18.2",
    "supertest": "^4.0.2",
    "ts-jest": "^24.1.0",
    "ts-loader": "^6.1.1",
    "ts-node": "^8.4.1",
    "tsconfig-paths": "^3.9.0",
-   "tslint": "^5.20.0",
    "typescript": "^3.6.3"
  },
+ "eslintConfig": {
+   "root": true,
+   "parser": "@typescript-eslint/parser",
+   "parserOptions": {
+     "project": "./tsconfig.json",
+     "tsconfigRootDir": "./"
+   },
+   "plugins": [
+     "@typescript-eslint",
+     "jest"
+   ],
+   "extends": [
+     "plugin:@typescript-eslint/recommended",
+     "plugin:jest/recommended",
+     "standard"
+   ],
+   "rules": {
+     "comma-dangle": [
+       "error",
+       "always-multiple"
+     ],
+     "@typescript-eslint/explicit-function-return-type": "off",
+     "jest/expect-expect": "off"
+   }
+ },
+ "eslintIgnore": [
+   "node_modules",
+   "dist",
+   "coverage"
+ ],
  "jest": {
    "moduleFileExtensions": [
    ...
```

这一步执行完成之后，我们执行下面的命令来自动格式化我们的代码。

```
yarn lint --fix
```

> 如果你使用的 IDE 是 Intellij 家族的，那么还会自动弹出提示框来读取 eslint 配置

到这里，我们的本地开发准备工作就完成啦，你可以运行

```sh
yarn start
```

访问 3000 端口，如果出现了 "Hello world" 说明我们到这一步就没问题了

# 2. Docker 镜像生成

为了保证部署与开发环境统一，我们使用 Docker 作为我们的容器

## 2.1 编写 Dockerfile

我们在根目录下创建一个 `.dockerignore` 文件，内容如下

```dockerignore .dockerignore
node_modules
.git
.idea
.vscode
/coverage
```

然后我们在根目录继续创建一个 `Dockerfile` 文件，内容如下

```Dockerfile Dockerfile
FROM node:12-alpine AS dependencies
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production

FROM node:12-alpine
WORKDIR /usr/src/app
COPY package.json dist ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
EXPOSE 3000
CMD [ "node", "dist/main" ]
```

> 为了避免镜像中打包冗余的文件，我们使用多阶段构建镜像

## 2.2 打包镜像

> 在此步骤之前,请确认你本地已经登录了 docker 账号

为了方便我们对镜像版本管理，我们在 `package.json` 中新建一个脚本来打包镜像

```diff package.json
  ...
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
+   "build:docker": "yarn build && docker build -t mutoe/$npm_package_name:latest . && docker push mutoe/$npm_package_name:latest",
    "start": "nest start",
    "start:dev": "nest start --watch",
    ...
```

> 需要注意的是，我们在本地 build 好 dist 目录后，在 docker 中下载了生产环境所需要的依赖，然后一并进行打包。这样就可以避免我们在 docker 中全量下载依赖了，有效的节约了构建镜像的时间。  
> 但是这种做法必须保证你进行打包的 node 环境和 docker 中的 node 版本一致，否则有可能打包出来的是不可用的，这样就失去了使用 docker 的意义。

然后执行

```bash
yarn build:docker
```

可以看到，我们用多阶段构建的方法打包出来的镜像有 92M

    $ docker images
    REPOSITORY                           TAG                 IMAGE ID            CREATED             SIZE
    mutoe/nestjs-realworld-example-app   latest              b7cedde8299d        5 seconds ago       92.2MB

然后登录 [docker hub](https://hub.docker.com/repositories), 最终压缩后的 [docker 镜像](https://hub.docker.com/layers/mutoe/nestjs-realworld-example-app/0.1.0/images/sha256-c5e4a523f383751c2eb69a377801039995f206ad3b7e10f565b2880fa032837e)大小只有 28M

# 3. Pipeline 搭建

## 3.1 基本功能实现

我们选用 github 新出的功能 GitHub Actions 来作为我们项目的 Pipeline 工具。

我们在根目录下创建以下目录结构

```diff
 .
 ├── .dockerignore
+├── .github
+│   └── workflows
+│       └── nodejs.yml
 ├── .gitignore
 ...
```

编辑 `nodejs.yml`

```yml nodejs.yml
name: Node CI

on: [push]

jobs:
  build:
    env:
      CI: true

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - name: Setup Nodejs
        uses: actions/setup-node@v1
        with:
          node-version: 12

      - name: Install dependencies
        run: yarn install --skip-integrity-check --non-interactive --no-progress

      - name: Lint
        run: yarn lint

      - name: Test
        run: yarn test
```

> 其中 “Install dependencies” 部分,我们给 `yarn install` 添加了一些参数，他们是用来在 CI 环境下移除掉一些需要交互的内容。

上面就配置了一个最简单的 workflow，你每次推代码的时候，就会自动出发 github actions，来 lint 和 test 你的代码。

## 3.2 增加构建缓存

不过你会发现，我们每次推代码都会重新安装依赖，这会花费很长时间。

不过没关系，github actions 市场上有这样一个插件 `actions/cache` 这个可以用来缓存每次运行 CI 的产物。

我们安装依赖前添加一些内容以缓存 yarn 的依赖

```diff
      - name: Setup Nodejs
        uses: actions/setup-node@v1
        with:
          node-version: 12

+     - name: Get yarn cache
+       id: yarn-cache
+       run: echo "::set-output name=dir::$(yarn cache dir)"
+
+     - uses: actions/cache@v1
+       with:
+         path: ${{ steps.yarn-cache.outputs.dir }}
+         key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
+         restore-keys: |
+           ${{ runner.os }}-yarn-
+
      - name: Install dependencies
        run: yarn install --skip-integrity-check --non-interactive --no-progress

```

重新提交几次代码，你会发现后面的步骤会跳过耗时很长的安装依赖步骤，这很 Nice！

## 3.3 自动构建并发布 Docker 镜像

为了在 GitHub Actions 里发布 docker 镜像, 我们需要使用 GitHub 市场中的 [Docker Login](https://github.com/marketplace/actions/docker-login) 插件,
打开我们刚才的 action 配置文件, 在文件末尾追加下面两段

```diff nodejs.yml
      - name: Lint
        run: yarn lint

      - name: Test
        run: yarn test

+     - uses: azure/docker-login@v1
+       with:
+         username: ${{ secrets.DOCKER_USERNAME }}
+         password: ${{ secrets.DOCKER_PASSWORD }}
+
+     - name: Build docker image
+       run: yarn build:docker
```

接下来我们需要在 GitHub 中设置我们的 secrets

在 github 中打开我们的项目,然后点击 `Settings`,在左侧选择 `Secrets`, 然后点击 `Add a new secret` 分别添加我们的 docker 账号和密码, secret key 和上面设置的是一样的哦 (`DOCKER_USERNAME` `DOCKER_PASSWORD`)

![github secrets](https://static.mutoe.com/2019/TDD-nestjs-realworld-example-app/github-secrets.png)

设置完毕后,推代码, 然后进入 github actions 页面观察我们的构建, 最后会是这个样子

![after action triggered](https://static.mutoe.com/2019/TDD-nestjs-realworld-example-app/after-action-triggered.png)

如果你看到上面这个画面, 恭喜你, 我们的 Pipeline 部署成功啦!

所有步骤完成之后, 最终我们的项目应该长[这个样子](https://github.com/mutoe/nestjs-realworld-example-app/tree/2a7c8da63e6c0d62902ea510dd0eca98507ec7e8). (这是项目当前的快照, 你可以在任何时候查看它)

# 参考资料

- [First steps - NestJS Document](https://docs.nestjs.com/first-steps)
- [TSLint in 2019](https://medium.com/palantir/tslint-in-2019-1a144c2317a9)
- [Typescript + ESLint and StandardJS ](https://dev.to/itmayziii/typescript-eslint-and-standardjs-5hmd)
- [把一个 Node.js web 应用程序给 Docker 化](https://nodejs.org/zh-cn/docs/guides/nodejs-docker-webapp/)
- [Nodejs Docker 镜像体积优化实践](https://juejin.im/post/5cada976f265da035e210bf8)
