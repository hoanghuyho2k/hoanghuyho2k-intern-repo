# Dependency Injection in NestJS

## Overview

Dependency Injection (DI) is a design pattern used in NestJS to manage how different parts of an application depend on each other. Instead of creating dependencies manually, NestJS automatically provides them where needed.

This makes the code more modular, testable, and maintainable.

---

## How Dependency Injection Works in NestJS

In NestJS, services (providers) are registered in a module and then injected into controllers or other services.

Example:

```typescript
@Injectable()
export class UserService {
  getUsers() {
    return ['User1', 'User2'];
  }
}
```

```typescript
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.getUsers();
  }
}
```

Here, NestJS automatically creates an instance of UserService and injects it into UserController.

## Role of `Providers` and `@Injectable()`

Providers are classes (usually services) that can be injected as dependencies.

The `@Injectable()` decorator:

Marks a class as a provider
Allows NestJS to manage its lifecycle
Enables it to be injected into other classes

Without `@Injectable()`, NestJS would not know that the class can be used for dependency injection.

## How NestJS resolves Dependencies

NestJS uses an internal IoC (Inversion of Control) container to manage dependencies.

When the application starts:

NestJS scans modules for providers
Registers them in the container
Resolves dependencies automatically when needed
Injects them into constructors

This means developers do not need to manually create instances of services.

## Provider Scopes

NestJS supports different provider scopes that control how instances are created.

Singleton (Default)
One shared instance for the entire application
Most commonly used
Efficient for performance

Example:

```typescript
@Injectable()
export class UserService {}
```

Request Scope
A new instance is created for each incoming request
Useful when handling request-specific data (e.g., user session)

Example:

```typescript
@Injectable({ scope: Scope.REQUEST })
export class RequestService {}
```

Transient Scope
A new instance is created every time it is injected
Useful for lightweight, stateless operations

Example:

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {}
```

## Reflection

How does dependency injection improve maintainability?

Dependency injection improves maintainability by separating concerns and reducing tight coupling between components. It allows developers to modify or replace parts of the system without affecting the entire codebase.

What is the purpose of the @Injectable() decorator?

The @Injectable() decorator marks a class as a provider so that NestJS can manage it and inject it into other parts of the application automatically.

What are the different types of provider scopes, and when would you use each?

Singleton is used for most services to share one instance across the app. Request scope is used when data should be unique per request. Transient scope is used when a new instance is needed every time a dependency is injected.

How does NestJS automatically resolve dependencies?

NestJS uses a built-in dependency injection container that scans modules, registers providers, and injects dependencies into constructors automatically at runtime.
