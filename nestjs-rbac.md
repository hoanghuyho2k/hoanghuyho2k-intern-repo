
# Role-Based Authorization (RBAC) in NestJS

## Create roles.decorator.ts

Create the file: nestjs-demo/src/auth/roles.decorator.ts

```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

## Create roles.guard.ts

Create the file: nestjs-demo/src/auth/roles.guard.ts

```typescript
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('No roles found for this user');
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
```

## Create a simple mock auth middleware

This is just for testing locally before real AuthO integration

Create the file: nestjs-demo/src/auth/mock-user.middleware.ts

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MockUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.user = {
      id: '123',
      email: 'admin@example.com',
      roles: ['admin'],
    };

    next();
  }
}
```

## Create an admin controller

Create the file: nestjs-demo/src/auth/admin.controller.ts

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  @Get()
  @Roles('admin')
  getAdminData() {
    return {
      message: 'Admin access granted',
    };
  }
}
```

## Create auth.module.ts

Create the file: nestjs-demo/src/auth/auth.module.ts

```typescript
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { RolesGuard } from './roles.guard';

@Module({
  controllers: [AdminController],
  providers: [RolesGuard],
})
export class AuthModule {}
```

## Update app.module.ts

Add the module and middleware

```typescript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MockUserMiddleware } from './auth/mock-user.middleware';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'focusbear_dev',
      entities: [Task],
      synchronize: false,
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MockUserMiddleware).forRoutes('*');
  }
}
```

## Testing

Start the app:

```bash
npm run start:dev
```

Test endpoint:

```bash
curl http://localhost:3000/admin
```

Expected ouput:

```bash
{"messgae":"Admin access granted"}
```

### Test forbidden case

To test access denial, change the middleware roles:

```typescript
roles: ['user']
```

Run again:

```bash
curl http://localhost:3000/admin
```

Expected output:

```json
{
  "statusCode": 403,
  "message": "You do not have permission to access this resource",
  "error": "Forbidden"
}
```

## Reflection

How does Auth0 store and manage user roles?

Auth0 stores roles centrally and lets administrators assign permissions to those roles. When RBAC is enabled for an API, the resulting access token can include permission information, and roles can also be exposed through custom claims depending on configuration.

What is the purpose of a guard in NestJS?

A guard decides whether a request is allowed to continue to a route handler. It is commonly used for authentication and authorization checks, such as verifying tokens or enforcing RBAC rules.

How would you restrict access to an API endpoint based on user roles?

I would use a custom decorator such as `@Roles('admin')` on the route and enforce it with a guard that reads the authenticated user’s roles or permissions from the token and denies access if the required role is missing.

What are the security risks of improper authorization, and how can they be mitigated?

Improper authorization can let users access sensitive data or admin-only actions they should not have. This can be mitigated by validating tokens correctly, enforcing role or permission checks with guards, using least-privilege role design, and relying on server-side checks rather than trusting the client. This follows the RBAC guidance in NestJS and Auth0’s protected API patterns.
