---
title: 手把手带你实践 TDD Nestjs Realworld 项目 - 4. 输入校验和转化
date: 2020-01-08 20:36:22
update: 2020-05-03 16:58:16
categories: 教程
tags:
  - Nestjs
  - TypeScript
  - Postgres
  - TypeORM
---

上一章中, 我们完成了鉴权功能, 也就是 Auth 模块, 顺便简单实现了下注册和登录功能. 这一章我们就来正式的将登录和实现功能做完, 含有完整的数据校验和转化.

在正式的开始完善功能之前, 我们现清理重构一下已有的代码.

# 1. 重构代码

## 1.1 整理路由

我们上一张的登录和注册是写在 `app.controller.ts` 中的, 如果所有的路由都写在这里的话就会比较杂乱, 所以我们将它移动到 Auth 模块下.

首先生成 AuthController

```bash
nest g controller auth
```

然后将 `/auth/register` 和 `/auth/login` 移到 AuthController 下

```ts auth.controller.ts
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async register(
    @Body() requestBody: { email: string; username: string; password: string },
  ) {
    const user = await this.userService.createUser(requestBody)
    const token = this.authService.generateToken(user.id, user.username)
    return {
      user: { ...user, token },
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    const { user } = req
    const token = this.authService.generateToken(user.id, user.username)
    return {
      user: { ...user, token },
    }
  }
}
```

顺便也移动下测试, 这里就不再赘述了.

# 2. 增加 DTO

我们在 Auth 模块下添加一个 dto 目录, 然后新建一个 `src/auth/dto/register.dto.ts` 用于存储 Data Transfer Object

```ts register.dto.ts
export class RegisterDto {
  readonly email: string
  readonly username: string
  readonly password: string
}
```

同理，增加 `src/auth/dto/login.dto.ts`, 这里就不在赘述了。

然后在 register 方法中修改入参

```ts auth.controller.ts
// ...
export class AuthController {
  // ...
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.userService.createUser(registerDto)
    const token = this.authService.generateToken(user.id, user.username)
    return {
      user: { ...user, token },
    }
  }
  
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return loginDto
  }

  //  ...
}
```

# 3. 自动验证类型

nest 推荐我们使用`class-validator`做类型验证, 首先安装这个依赖

```bash
yarn add class-validator class-transformer
```

然后在 `main.ts` 中加入自动验证的 pipe

```diff main.ts
  import { NestFactory } from '@nestjs/core'
  import { AppModule } from './app.module'
+ import { ValidationPipe } from '@nestjs/common'

  async function bootstrap () {
    const app = await NestFactory.create(AppModule)
+   app.useGlobalPipes(new ValidationPipe())
    await app.listen(3000)
  }

  bootstrap()
```

然后在 DTO 中加入注解

```ts register.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  readonly username: string

  @IsNotEmpty()
  readonly password: string
}
```

# 4. 响应类型

为了保证我们能有正确的返回值，我们需要自己声明 Response Object

在 `auth` 下建立 `auth.interface.ts`

```ts auth.interface.ts
export interface AuthData {
  username: string
  email: string
  bio: string
  image?: string
  token: string
}

export interface AuthRO {
  user: AuthData
}
```

然后在 controller 里补充 DTO 和返回值类型

```diff auth.controller.ts
  @Controller('auth')
  export class AuthController {
    constructor (
      private readonly userService: UserService,
      private readonly authService: AuthService,
    ) {}

    @Post('/register')
+   async register (@Body() registerDto: RegisterDto): Promise<AuthRO> {
      const user = await this.userService.createUser(requestBody)
      const token = this.authService.generateToken(user.id, user.username)
      return {
        user: { ...user, token },
      }
    }

   @UseGuards(AuthGuard('local'))
    @Post('/login')
+   async login (@Body() loginDto: LoginDto): Promise<AuthRO> {
      return loginDto
    }
  }
```

# 参考资料

- [Controllers | NestJS](https://docs.nestjs.com/controllers#request-payloads)
- [Validation | NestJS](https://docs.nestjs.com/techniques/validation)
