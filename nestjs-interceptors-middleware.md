
# Using Interceptors and Middleware in NestJS

## Interceptors vs Middleware

In NestJS, middleware and interceptors both let you handle cross-cutting concerns, but they run at different points in the request lifecycle and serve different purposes.

- **Middleware** runs before the route handler and has direct access to the raw request, response, and `next()` function. It is useful for tasks such as logging, authentication preprocessing, and request mutation.
- **Interceptors** wrap the execution of the route handler. They can run logic both before and after the handler, transform returned data, map exceptions, and measure execution time.

NestJS documents middleware as functions or classes that run before the route handler, and documents interceptors as classes implementing `NestInterceptor` that can add logic before/after method execution and transform responses or exceptions.

## Built-in Interceptors

NestJS includes useful built-in interceptors such as `ClassSerializerInterceptor`, which serializes class instances returned from handlers using `class-transformer`. This is especially useful for hiding fields like passwords or controlling what gets exposed in API responses.

Example:

```typescript
@UseInterceptors(ClassSerializerInterceptor)
@Get()
findOne(): UserEntity {
  return new UserEntity({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    password: 'secret',
  });
}
```

With the proper class-transformer decorators, the password field can be excluded from the response.

## Example Logging Interceptor

A simple logging interceptor can log request method, URL, and response time:

```typescript
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const start = Date.now();

    console.log(`[Interceptor] ${method} ${url} - before handler`);

    return next.handle().pipe(
      tap(() =>
        console.log(
          `[Interceptor] ${method} ${url} - ${Date.now() - start}ms`,
        ),
      ),
    );
  }
}
```

Interceptors work with the ExecutionContext and CallHandler, which allows them to inspect the request before the handler and the response stream after the handler.

## Example Middleware

A simple middleware can log each incoming request before it reaches the controller:

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[Middleware] ${req.method} ${req.originalUrl}`);
    next();
  }
}
```

To apply it in module:

```typescript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

NestJS middleware is equivalent in concept to Express middleware and is commonly used for tasks that must happen before routing logic.

## Reflection

What is the difference between an interceptor and middleware in NestJS?

Middleware runs before the route handler and works directly with the request/response objects, while an interceptor wraps the handler execution and can transform responses, map exceptions, and run logic before and after the handler.

When would you use an interceptor instead of middleware?

I would use an interceptor when I need access to the response after the route handler runs, such as measuring execution time, transforming response data, serializing returned objects, or mapping exceptions. Middleware is better for early request preprocessing.

How does LoggerErrorInterceptor help?

LoggerErrorInterceptor is typically used with nestjs-pino to expose richer error information in automatic HTTP logs, including improved error details on failed requests, which makes troubleshooting easier. It is not part of Nest’s built-in interceptors, but rather a logging-package helper commonly used in production logging setups.
