---
title: 手把手带你实践 TDD Nestjs Realworld 项目 - 2. 数据库连接
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
  - ESLint
---

上一个文章我们介绍了如何搭建一个开发环境和 Pipeline, 这篇文章开始我们将正式的用 TDD 的模式实现一个后端项目.

# 1. 安装依赖

我们选用了 Postgres 作为我们的数据库, 操作数据库的 ORM 我们选用 TypeORM, 这是一个 TypeScript 友好的 ORM, 并且 nest 也提供了非常便利的集成方法.

```bash
yarn add @nestjs/typeorm typeorm pg
```

# 2. 接入 TypeORM

编辑 `app.module.ts`

```ts app.module.ts
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'realworld',
      password: '123456',
      database: 'nestjs',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

# 3. 创建数据库

我们启动我们的 Postgres 服务, 然后创建一个用户 `realworld` 和数据库 `nestjs`

```bash
psql postgres

CREATE ROLE realworld WITH LOGIN PASSWORD '123456';
CREATE DATABASE nestjs OWNER realworld;
GRANT ALL PRIVILEGES ON DATABASE nestjs TO realworld;
```

# 4. 定义用户表

我们接下来定义一个用户表, TypeORM 支持仓库设计模式(Repository design pattern), 每个实体都有自己的的仓库.

首先执行下面的命令来创建用户 module 和 service

```bash
nest g module user
nest g service user
```

然后在自动生成的 `src/user` 目录下创建一个 `user.entity.ts` 文件

```ts user.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

const nullable = true

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 80 })
  email: string

  @Column({ length: 20 })
  username: string

  @Column({ nullable, type: 'text' })
  bio: null | string

  @Column({ nullable, type: 'text' })
  image: null | string
}
```

然后编辑 `user.service.ts`, 注入 userRepository 在 UserService 中

```ts user.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
}
```

然后 `user.module.ts` 中导入 `User` entity

```ts user.module.ts
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
})
export class UserModule {}
```

最后, 启动服务, 我们就可以看到, 数据库表中已经多了一张 user 表啦

# 5. 实现注册功能

现在所有的东西都准备好了, 接下来就在 user service 中实现一个注册方法来看看我们是怎么来做 TDD 的.

> 不了解 TDD 的同学这里简单介绍一下 TDD  
> TDD 要求我们先设计 Task, 将我们的需求拆成一个个的 Task, 然后每个 Task 写至少一个测试用例,解决语法错误的问题(如将要调用的方法还未声明)后, 跑一遍测试, 这时测试应该是“红”(不通过)的, 然后开始写实现, 写到刚好“绿”(通过测试)为止, 不要写多余的方法. 经过“红-绿”后,对自己的代码进行重构. 这个过程就是 TDD 三角 “红-绿-重构”

我们的代码应当按照 TDD 金字塔来设计: 首先要保证我们的代码通过测试, 其次最求最小元素实现功能、保证传达测试的意图,最后消除重复的代码.

![TDD 金字塔](https://static.mutoe.com/2020/TDD-nestjs-realworld-example-app/TDD-pyramid.png 'TDD 金字塔')

## 5.1 添加路由

首先我们要在应用添加一个注册入口, 根据 ConduitAPI 需求, 用户注册的路由是 POST `/auth/register`, request 和 response 应该长这样

```json request body
{
  "user": {
    "email": "mutoe@foxmail.com",
    "username": "mutoe",
    "password": "12345678"
  }
}
```

```json response body
{
  "user": {
    "id": 1,
    "email": "mutoe@foxmail.com",
    "createdAt": "2019-10-22T03:22:54.038Z",
    "updatedAt": "2019-10-22T03:22:54.046Z",
    "username": "mutoe",
    "bio": null,
    "image": null,
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1N..."
  }
}
```

根据软件设计三层架构(User Interface Layer, Business Logic Layer, Data Access Layer), 我们知道, 在 Controller 中需要调用用户相关的 Service, 那我们测 Controller 时只需要断言是否调用了 Service 即可, 我们也信任 Service 返回的内容是我们需要的, 因为我们也会通过单元测试验证 Service 返回的内容.

打开 `app.controller.spec.ts`, 添加按照 Given-When-Then 以下测试用例

```diff app.controller.spec.ts
  import { Test, TestingModule } from '@nestjs/testing'
  import { AppController } from './app.controller'
- import { AppService } from './app.service'
+ import { UserService } from './user/user.service'

  describe('# AppController', () => {
    let appController: AppController
+   let userService: UserService

    beforeEach(async () => {
      const app: TestingModule = await Test.createTestingModule({
        controllers: [AppController],
-       providers: [AppService],
+       providers: [
+         UserService,
+         {
+           provide: getRepositoryToken(User),
+           useClass: Repository,
+         },
+       ],
      }).compile()

      appController = app.get(AppController)
+     userService = app.get(UserService)
    })

+   describe('Register', function () {
+     it('should return user response', async function () {
+       // Given
+       const requestBody = {
+         email: 'mutoe@foxmail.com',
+         username: 'mutoe',
+         password: '12345678',
+       }
+       jest.spyOn(userService, 'createUser').mockResolvedValue({ user: {} })
+
+       // When
+       const response = await appController.register(requestBody)
+
+       // Then
+       expect(userService.createUser).toBeCalledTimes(1)
+       expect(response).toHaveProperty('user', expect.any(Object))
+     })
    })
  })
```

简单解释一下上面的代码

Given 部分我们首先构造了一个 request body, 方便我们在接下来的调用时使用. 然后我们将 `userService` 下的 `createUser` 方法 mock 掉

接下来我们要消除语法错误, 我们可以看到, `appController` 下是没有 `register` 这个方法的, 而且 `userService` 下也没有 `createUser` 方法.

我们进入 `app.controller.ts` 声明一下 `register` 方法

```diff app.controller.ts
...
export class AppController {
  ...
+ @Post('/auth/register')
+ register (@Body() requestBody: { email: string; username: string; password: string }): any {}
}
```

然后进入 `user.service.ts` 声明一个 `createUser` 的方法

```diff user.service.ts
...
export class UserService {
  ...
+ async createUser (user: { email: string; username: string; password: string }): Promise<any> {}
}
```

消除语法错误后, 我们就可以跑一下测试啦

```bash
yarn test
```

好, 测试成功的失败了

![Test failed](https://static.mutoe.com/2020/TDD-nestjs-realworld-example-app/test-failed.png)

这就是“红”的过程

接下来我们进行实现, 让测试变“绿”

![green](https://static.mutoe.com/2020/TDD-nestjs-realworld-example-app/green.png)

```ts app.controller.ts
import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { UserService } from './user/user.service'

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  // ...

  @Post('/auth/register')
  register(
    @Body() requestBody: { email: string; username: string; password: string },
  ): any {
    return this.userService.createUser(requestBody)
  }
}
```

然后 Run 一下测试, 当当当当~

![Test passed](https://static.mutoe.com/2020/TDD-nestjs-realworld-example-app/test-passed.png)

好, 我们的 TDD Controller 就完成啦!

## 5.2 创建用户

接下来的思路是一样的, 首先编写测试代码

```ts user.service.ts
import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'

describe('UserService', () => {
  let service: UserService
  let repository: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(() => true),
          },
        },
      ],
    }).compile()

    service = module.get(UserService)
    repository = module.get(getRepositoryToken(User))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(repository).toBeDefined()
  })

  it('should create user correctly', async function() {
    const user = {
      email: 'mutoe@foxmail.com',
      username: 'mutoe',
      password: '12345678',
    }
    await service.createUser(user)

    expect(repository.save).toBeCalledWith(Object.assign(new User(), user))
  })
})
```

写实现

```ts user.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  createUser(userInfo: { email: string; username: string; password: string }) {
    return this.userRepository.save(Object.assign(new User(), userInfo))
  }
}
```

Run 一下测试, 单元测试应该是全通过的

# 6. E2E 测试

接下来我们验证一下功能是不是正确, 发起一个真实的请求, 看看数据库是不是多了一个用户, 首先启动服务, 然后发起一个 POST 请求

```bash
yarn start
curl -X POST http://localhost:3000/auth/register -d '{"username":"mutoe","email":"mutoe@foxmail.com","password":"12345678"}' -H "Content-Type: application/json"
```

应该会返回一个含有用户 ID 的 json 格式响应

![json response](https://static.mutoe.com/2020/TDD-nestjs-realworld-example-app/json-response.png)

那我们总不能每次写完一个功能都手动测试一次吧! 这太 Low 了, 我们要自动化!

## 6.1 创建测试数据库

E2E 是连接的真实的数据库,所以我们要为了这些自动化测试创建一个用于单独的数据库, 避免影响我们开发环境的数据.

```bash
psql postgres
CREATE DATABASE nestjs_test OWNER realworld;
GRANT ALL PRIVILEGES ON DATABASE nestjs_test TO realworld;
```

然后编辑 `app.e2e-spec.ts`

```ts app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'realworld',
  password: '123456',
  database: 'nestjs_test',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: true, // 这个选项将会在每次测试运行前扔掉所有数据,请不要连错数据库
}

describe('AppController (e2e)', () => {
  let app

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(ormConfig), AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })
})
```

在每次 E2E 测试启动时, 都会自动连入我们的测试数据库

## 6.2 编写 E2E 测试

开始写我们的 E2E 测试

```ts test/app.e2e-spec.ts
it('/auth/register (POST)', async () => {
  const requestBody = {
    username: 'mutoe',
    email: 'mutoe@foxmail.com',
    password: '12345678',
  }
  await request(app.getHttpServer())
    .post('/auth/register')
    .send(requestBody)
    .expect(201)
})
```

然后运行

```bash
yarn test:e2e
```

成功啦!

![e2e passed](https://static.mutoe.com/2020/TDD-nestjs-realworld-example-app/e2e-passed.png)

好, 到这里, 我们这一章所有的内容就结束了, 如果你有什么疑惑和问题, 欢迎在下方留言.

# 参考资料

- [Database | NestJS](https://docs.nestjs.com/techniques/database)
- [数据库管理 | wiki.postgresql.org](https://wiki.postgresql.org/wiki/9.1%E7%AC%AC%E4%BA%8C%E5%8D%81%E4%B8%80%E7%AB%A0)
- [How to unit test controller | GitHub nestjs/nest#1209](https://github.com/nestjs/nest/issues/1209)
- [Testing: Backend Testing - Unit Testing - Services](https://www.carloscaballero.io/part-9-clock-in-out-system-testing-backend-unit-test-services/)
