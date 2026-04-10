
# Introduction to Testing NestJS

## Install packages

```bash
npm install --save-dev @nestjs/testing
```

## Default test file Nest created

app.controller.spec.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
```

## Update package.json to include test script

```json
"script": {
    "test": "jest"
}
```

## Test

```bash
npm test
```

Output:

```bash
> nestjs-demo@0.0.1 test
> jest

 PASS  src/demo/demo.service.spec.ts
 PASS  src/demo/demo.controller.spec.ts
 PASS  src/app.controller.spec.ts

Test Suites: 3 passed, 3 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.834 s
Ran all test suites.
```

## Reflection

What are the key differences between unit, integration, and E2E tests?

Unit tests focus on one piece of code in isolation. Integration tests check how multiple parts of the system work together. E2E tests validate complete application flows through real HTTP requests. NestJS’s official testing guide describes support for all of these testing styles.

Why is testing important for a NestJS backend?

Testing is important because it helps catch bugs early, prevents regressions, and improves confidence when making changes. For a backend, testing helps ensure that services, controllers, and application flows continue to work reliably as the codebase grows. NestJS explicitly includes testing features to promote good development practices.

How does NestJS use @nestjs/testing to simplify testing?

NestJS uses @nestjs/testing to create testing modules that mimic real NestJS modules, giving access to dependency injection and making it easier to mock or replace providers during tests. This reduces boilerplate and keeps tests aligned with the application structure.

What are the challenges of writing tests for a NestJS application?

Common challenges include mocking dependencies correctly, setting up modules with the right providers, handling asynchronous behavior, and testing features that depend on framework wiring such as guards, interceptors, or database connections. Nest’s FAQ also highlights dependency-resolution issues as a common problem during development and testing.
