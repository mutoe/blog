---
title: 手把手带你实践 TDD Nestjs Realworld 项目 - 3. 鉴权认证
date: 2020-01-08 15:32:50
categories: 教程
tags:
  - Nestjs
  - TypeScript
  - Postgres
  - TypeORM
  - JWT
---

上一张我们创建了一个用户表, 但是还没有实现真正的注册和登录. 要实现注册登录以及后续的权限校验, 我们还有一些工作要做.

目前有比较多的思路来对用户进行鉴权, 我们选用 Conduit 示例中展示的也是现在比较广泛的做法 JWT 进行认证.

# 1. 安装依赖

要实现 JWT 鉴权, NestJS 为我们做好了这一切. 安装下面的依赖

```bash
yarn add @nestjs/passport passport passport-local
yarn add -D @types/passport-local
```

Passport 你可以把它看作是一个小型的框架, 因为你可以通过一些简单的回调函数来进行配置. Passport 会在适当的时候对其进行调用.

而 `@nestjs/passport` 则对 Passport 进行了很好的集成.

<!-- more -->

# 2. 修改用户表

我们在 `user.entity.ts` 增加一个密码字段

```diff user.entity.ts
...
export class User {
  ...

  @Column({ length: 20 })
  username: string

+ @Column()
+ password: string
+
  @Column({ nullable, type: 'text' })
  bio: null | string

  ...
}
```

然后清空数据表, 重新请求 register 方法, 可以看到, 我们的密码字段自动更新在了表中

# 3. 创建 Auth 模块

```bash
nest g module auth
nest g service auth
```

我们的 AuthService 提供一个验证用户密码是否匹配的接口. 好, 先写测试

```ts auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('AuthService', () => {
  let authService: AuthService
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile()

    authService = module.get(AuthService)
    userService = module.get(UserService)
  })

  it('should get user profile after validateUser', async function() {
    const password = '12345678'
    const username = 'mutoe'
    jest
      .spyOn(userService, 'findOne')
      .mockResolvedValue({ username, password } as User)

    const user = await authService.validateUser(username, password)

    expect(user).toHaveProperty('username', username)
    expect(user).not.toHaveProperty('password')
  })

  it('should return null when invalid password', async function() {
    jest.spyOn(userService, 'findOne').mockResolvedValue(undefined)

    const result = await authService.validateUser('mutoe', 'invalidPassword')

    expect(result).toBeNull()
  })
})
```

我们期望 AuthService 中验证通过后, 返回的用户信息中不含有 `password` 字段; 如果密码输入错误, 应该返回 `null`

然后写实现

```ts auth.service.ts
import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username)
    if (user?.password === password) {
      const { password, ...profile } = user
      return profile
    }
    return null
  }
}
```

> 你知道吗  
> `user?.password` 是 TS3.7 的新语法: ["optional-chaining"](https://github.com/tc39/proposal-optional-chaining), 这个语法在 ES 中目前是 Stage4, 可以放心的在项目中使用.

UserService 下没有实现 `findOne` ?, 写!

```ts user.service.spec.ts
// ...

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UserService,
      {
        provide: getRepositoryToken(User),
        useValue: {
          save: jest.fn(),
          findOne: jest.fn(),
        },
      },
    ],
  }).compile()

  service = module.get(UserService)
  repository = module.get(getRepositoryToken(User))
})

// ...

it('should find user correctly', async function() {
  const user = {
    email: 'mutoe@foxmail.com',
    username: 'mutoe',
    password: '12345678',
  }
  jest.spyOn(repository, 'findOne').mockResolvedValue(user as User)
  const userResult = await service.findOne(user.username)

  expect(userResult).toBe(user)
  expect(repository.findOne).toBeCalledWith({
    where: { username: user.username },
  })
})
```

实现

```ts user.service.ts
export class UserService {
  // ...
  async findOne(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }
}
```

<!-- TODO: 补充 e2e 测试 -->

# 4. 密码散列和环境变量

为了避免用户的明文密码暴露, 我们存在数据库的密码必须经过[散列加密](https://zh.wikipedia.org/wiki/%E5%AF%86%E7%A2%BC%E9%9B%9C%E6%B9%8A%E5%87%BD%E6%95%B8).

我们使用 nodejs 自带的 crypto 库的 `cryptoHmac` 进行散列加密. 为了提高安全性, 我们还可以添加自己的加密 key, 这个 key 我们要放在环境变量中, 避免把它硬编码在代码中上传到代码库.

那如何做呢? 一种方法是创建我们的模版配置文件, 这个可以参考我以前写的帖子 [在 Git 中使用模版来管理配置文件](/2016/manage-config-template-in-git/), 另一种方法就是使用 `dotenv` 库. 我更偏向于使用后一种方式.

## 5.1 设置环境变量

幸运的是, TypeORM 中内置了这个 `dotenv` 库, 所以我们不必在额外安装它了.

在项目根目录下创建一个 `.env.template` 文件. 我们在使用时, 可以将该文件拷贝一份并且重命名为 `.env`, dotenv 就会读取 `.env` 中的配置.

我们还可以将我们的数据库连接信息加入到该文件中, 避免信息泄露. 有关 TypeORM 提供的环境变量 key, 可以[参阅这里](https://typeorm.io/#/using-ormconfig/%E4%BD%BF%E7%94%A8%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)

```ini .env.template
# App
NEST_SECRET = change-me

# Database
TYPEORM_CONNECTION = postgres
TYPEORM_HOST = localhost
TYPEORM_USERNAME = root
TYPEORM_PASSWORD =
TYPEORM_DATABASE = nestjs
TYPEORM_PORT = 5432
TYPEORM_SYNCHRONIZE = true
TYPEORM_LOGGING = true
TYPEORM_ENTITIES = dist/**/*.entity.js
```

现在我们的环境变量的模版文件就创建好啦, 我们使用时应该将该文件复制一份为`.env`

```bash
cp .env.template .env
```

复制完毕后将其中的 secret 和数据库连接信息修改成我们自己的数据

我们还应该将 `.env` 文件加入 git 忽略列表, 避免我们的这些敏感信息泄漏.

然后创建 `src/config.ts`, 读取这些环境变量

```ts config.ts
export const NEST_SECRET = process.env.NEST_SECRET ?? 'secret'
```

因为我们刚才已经将数据库连接信息写在了环境变量中, 所以我们之前在代码中的硬编码就可以移除啦

```diff app.module.ts
@Module({
  imports: [
-   TypeOrmModule.forRoot({
-     type: 'postgres',
-     host: 'localhost',
-     port: 5432,
-     username: 'realworld',
-     password: '123456',
-     database: 'nestjs',
-     entities: ['dist/**/*.entity.js'],
-     synchronize: true,
-   }),
+   TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    AuthModule,
  ],
  exports: [TypeOrmModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {
  constructor (private readonly connection: Connection) {}
}
```

环境变量创建好之后, 我们以后读取配置就在 `src/config.ts` 中使用啦!

## 5.2 密码散列函数

我们在 `src` 目录下创建一个 `utils.ts` 的文件, 用于存放我们的工具类方法.

```ts utils.ts
import * as crypto from 'crypto'
import { NEST_SECRET } from './config'

export function cryptoPassword(password: string) {
  const hmac = crypto.createHmac('sha256', NEST_SECRET)
  return hmac.update(password).digest('hex')
}
```

对了, 测试还没写, 补个测试 (这一点都不 TDD 啊!)

```ts utils.spec.ts
import { cryptoPassword } from './utils'

describe('Utilities', function() {
  it('cryptoPassword', function() {
    const hashedPassword = cryptoPassword('foobar')
    const hashedResult =
      '4fcc06915b43d8a49aff193441e9e18654e6a27c2c428b02e8fcc41ccc2299f9'

    expect(hashedPassword).toBe(hashedResult)
  })
})
```

## 5.3 密码散列加密

现在散列加密函数有了, 我们应该在哪里对密码进行加密呢. TypeORM 提供了一组监听器, 当我们对数据进行操作时, 如果设置了监听器, TypeORM 就会出发这个监听器.

我们要在用户创建和更新的时候, 对密码进行加密, 所以我们要使用 `BeforeInsert` 和 `BeforeUpdate` 两个监听器

```ts user.entity.ts
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { cryptoPassword } from '../utils'

@Entity('user)
export class UserEntity {
  //...

  @Column({ password: 64 })
  password: string

  @BeforeInsert
  @BeforeUpdate
  hashPassword() {
    this.password = cryptoPassword(this.password)
  }
}
```

重启下服务器, 然后发起一个 register 请求, 看看用户密码是不是被散列加密保存了

![hashed password](https://static.mutoe.com/2020/TDD-nestjs-realworld-example-app/hashed-password.png)

不要忘记修改我们 AuthService 中验证密码的方法哦

```ts auth.service.ts
import { BadRequestException, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { cryptoPassword } from '../utils'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username)
    if (!user) {
      throw new BadRequestException('user is not exist')
    }
    if (user.password !== cryptoPassword(password)) {
      throw new BadRequestException('password is invalid')
    }
    const { password: _, ...profile } = user
    return profile
  }
}
```

# 5. 实现本地认证策略

为了简化我们的认证策略, 我们使用了一个名为 `passport-local` 的库, 在使用时,我们只需要将自己的类继承该库, 然后在构造函数中调用父类的构造函数即可.

我们在 `auth` 目录下创建一个 `local.strategy.ts` 文件

对于每种策略, Passport 要求实现一个具有以下签名的方法

```ts
validate(username: string, password: string): any
```

任何 Passport 策略都将遵循这个模式.

我们的 `validate` 方法, 调用 `AuthService` 的 `validateUser` 方法, 如果没有通过校验, 就抛出一个 401 错误, 否则返回该用户的信息

```ts local.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super()
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
```

然后在 AuthModule 中引用这个策略

```ts auth.module.ts
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

# 5. 实现登录功能

nestjs 为我们提供了一个非常方便的功能用来检测请求是否由路由处理程序, 这个功能就是守卫.

守卫内部实现了一个名为 `canActive` 的方法, 它返回一个 boolean 值, 如果为真, 就会处理这个路由,否则将会忽略当前的请求.

利用守卫, 我们可以方便的进行权限校验. 有点麻烦的是, 当用户未登录时, 我们首先应该校验用户访问的路由是否受限, 当没有经过身份验证的用户尝试登录时, 应该启动身份验证步骤.

不用担心, `@nestjs/passport` 为我们提供了一个比较便捷的守卫 `AuthGuard`

由于<ruby>篇幅问题<rt>tōu lǎn<rt></ruby>, 我就省略测试的部分了, 直接亮代码!

登录入口

```ts
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { UserService } from './user/user.service'
import { AuthService } from './auth/auth.service'
import { AuthGuard } from '@nestjs/passport'

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // ...

  @UseGuards(AuthGuard('local'))
  @Post('/auth/login')
  async login(@Body() requestBody: { username: string; password: string }) {
    const { username, password } = requestBody
    const user = await this.authService.validateUser(username, password)
    return { user }
  }
}
```

然后发起一个 login 请求, 现在应该可以正常返回用户的信息了.

# 6. JWT 认证

等等! 现在只是得到了一个用户信息, 那我怎么得到的我的 token 用来后续的鉴权呢?

## 6.1 生成 Token

生成 Token 使用 `passport-jwt` 和 `@nestjs/jwt`

```bash
yarn add @nestjs/jwt passport-jwt
yarn add -D @types/passport-jwt
```

我们将生成 token 的部分放在 AuthService 中

```ts auth.service.ts
// ...
import { JwtService } from '@nestjs/jwt'

export class AuthService {
  // ...

  generateToken(userId: number, username: string) {
    return this.jwtService.sign({ userId, username })
  }
}
```

> 注意: 上面 `sign` 的参数的内容并不是加密的, 拿到 token 后可以解密成明文内容, 所以这部分不要放敏感信息.

在使用前我们还需要一点点准备工作, 我们需要注册这个 JWT module.

在 AuthModule 中导入 `JwtModule` 的 `register` 方法, 传入我们签名的 `secret`

```ts auth.module.ts
// ...
import { JwtModule } from '@nestjs/jwt'
import { NEST_SECRET } from '../config'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: NEST_SECRET,
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

修改一下我们的 login 方法, 首先读取到用户信息后, 生成一个 token 给用户. 按照 Conduit 的规则, 我们将 token 注入在 `profile` 对象中

```ts app.controller.ts
  // ...

  @UseGuards(AuthGuard('local'))
  @Post('/auth/login')
  async login (@Body() requestBody: { username: string; password: string }) {
    const { username, password } = requestBody
    const userProfile = await this.authService.validateUser(username, password)
    const token = this.authService.generateToken(userProfile.id, username)
    return {
      user: { ...userProfile, token },
    }
  }
```

现在调用 login 方法, 返回的信息中应该含有 token 了, 我们在客户端拿到后, 应该将它进行持久化保存, 以便于后续的受保护的请求使用

## 6.2 实现 JWT 策略

在 Auth 模块下创建一个`jwt.strategy.ts` 的文件

```ts jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { NEST_SECRET } from '../config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: NEST_SECRET,
    })
  }

  validate(payload: { userId: number; username: string }) {
    const { userId, username } = payload
    return { userId, username }
  }
}
```

因为有了 `passport-jwt`, 我们的 jwt 策略依旧很简单, 继承 Passport 策略后我们只需要设置如何获取 jwt, 解析规则即可

最后我们将 JWT 策略提供给我们的 AuthModule

```ts auth.module.ts
@Module({
  // ...
  providers: [AuthService, LocalStrategy, JwtStrategy],
  ...
})
export class AuthModule {}
```

好, 现在我们就有了 2 个策略, 'local' 策略用来保护我们的路由, 'jwt' 策略用来鉴别请求有效性并且提供用户信息

## 6.3 验证一下

一切准备工作就绪后, 我们怎么使用 JWT 呢? 上一步我们实现 JWT 策略之后, 可以继续用 Guard 来保护我们的路由

为了演示使用方法, 我们实现一个读取个人资料的功能,

根据 Conduit 的要求, 我们的请求地址是 GET `/user`, 返回的内容暂时读取 jwt 的 payload 好啦

首先创建一个路由

```ts app.controller.ts
  // ...

  @UseGuards(AuthGuard('jwt'))
  @Get('/user')
  async profile (@Request() req) {
    return req.user
  }
```

重启服务, 然后我们发起一个不带有 Token 的请求头的 GET 请求访问一下这个路由

```bash
curl http://localhost:3000/user

#> {"statusCode":401,"error":"Unauthorized"}
```

成功的返回了 401 错误, 接下来带上我们的 token 试试

```bash
curl -X POST http://localhost:3000/auth/login -H 'Content-Type:application/json' -d '{"username":"foo","password":"12345678"}'

#> {"user":{"id":5,"email":"foo@bar.com","username":"foo","bio":null,"image":null,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInVzZXJuYW1lIjoiZm9vIiwiaWF0IjoxNTc4NDY2OTI4fQ.4k5F5VVY-lS86FxAwLIQ9lc8fB8_VRLA0E2_ekbP_lE"}}

curl http://localhost:3000/user -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInVzZXJuYW1lIjoiZm9vIiwiaWF0IjoxNTc4NDY2OTI4fQ.4k5F5VVY-lS86FxAwLIQ9lc8fB8_VRLA0E2_ekbP_lE"

#> {"userId":5,"username":"foo"}
```

嗯.. 大功告成!

# 参考资料

- [Authentication | NestJS](https://docs.nestjs.com/techniques/authentication)
- [Guards | NestJS](https://docs.nestjs.com/guards)
