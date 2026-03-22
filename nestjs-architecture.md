
# NestJS Architecture: Modules, Controllers, and Providers

## Overview

NestJS organizes applications using a modular architecture. The three core building blocks are:

- **Modules** → group related features
- **Controllers** → handle incoming requests
- **Providers (Services)** → contain business logic

This structure helps keep applications scalable, maintainable, and easy to understand.

## Modules

Modules are used to organize the application into logical sections. Every NestJS application has at least one root module (`AppModule`).

Example:

```typescript
import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
```

The `@Module()` decorator defines:

controllers → classes that handle requests
providers → services used in the module

## Controllers

Controllers are responsible for handling HTTP requests and returning responses.

Example:

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

Key points:

Uses `@Controller()` decorator
Defines routes (e.g., /app)
Delegates logic to services

## Providers (services)

Providers contain business logic and are reusable across the application.

Example:

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

Key points:

Marked with `@Injectable()`
Can be injected into controllers or other services
Helps separate logic from request handling

## Dependency Injection in NestJS

NestJS uses dependency injection (DI) to manage relationships between classes.

Example:

```typescript
constructor(private readonly appService: AppService) {}
```

NestJS automatically:

Creates an instance of `AppService`
Injects it into `AppController`

This avoids manual object creation and improves code structure.

How They Work Together
A request is sent to /app
The controller receives the request
The controller calls a method from the service
The service processes the logic and returns data
The controller sends the response back to the client

## Reflection

What is the purpose of a module in NestJS?

A module organizes related components such as controllers and providers into a cohesive unit, making the application easier to manage and scale.

How does a controller differ from a provider?

A controller handles incoming requests and responses, while a provider contains the business logic and is used by controllers or other services.

Why is dependency injection useful in NestJS?

Dependency injection reduces manual object creation, improves code reusability, and makes testing easier by allowing dependencies to be easily replaced or mocked.

How does NestJS ensure modularity and separation of concerns?

NestJS separates responsibilities into modules, controllers, and providers, ensuring that each part of the application has a clear role, which improves maintainability and scalability.
