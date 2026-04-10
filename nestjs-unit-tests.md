
# Writing Unit Tests for Services and Controllers in NestJS

## Install packages

```bash
npm install --save-dev jest ts-jest @types/jest @nestjs/testing
```

## Initialize Jest config for TypeScript

```bash
npx ts-jest config:init
```

This creates a Jest config suitable for TypeScript projects.

## Create a simple service test

app.service.spec.ts

```typescript
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('should return Hello World!', () => {
    expect(service.getHello()).toBe('Hello World!');
  });
});
```

## Create a controller test using a mocked service

app.controller.spec.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    findAll: jest.fn().mockReturnValue([{ id: 1, title: 'Mock task' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should return mocked tasks', () => {
    expect(controller.findAll()).toEqual([{ id: 1, title: 'Mock task' }]);
  });
});
```

## Test

```bash
npm test
```

Output:

```bash
> nestjs-demo@0.0.1 test
> jest

 PASS  src/tasks.controller.spec.ts
 PASS  src/app.service.spec.ts
 PASS  src/app.controller.spec.ts
 PASS  src/demo/demo.service.spec.ts
 PASS  src/demo/demo.controller.spec.ts

Test Suites: 5 passed, 5 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.08 s
Ran all test suites.
```

## Reflection

Why is it important to test services separately from controllers?

It is important to test services separately because services contain business logic, while controllers mainly handle incoming requests and responses. Testing them separately makes it easier to identify where a failure comes from and keeps tests more focused.

How does mocking dependencies improve unit testing?

Mocking dependencies improves unit testing by isolating the code under test from external systems and complex dependencies. This makes tests faster, more predictable, and easier to control for both success and failure scenarios.

What are common pitfalls when writing unit tests in NestJS?

Common pitfalls include failing to mock dependencies properly, accidentally relying on real database connections, not handling asynchronous methods correctly, and creating tests that check too many things at once. Nest’s docs and database testing guidance both emphasize isolating dependencies to avoid these problems.

How can you ensure that unit tests cover all edge cases?

You can improve edge-case coverage by testing normal behavior, invalid input, empty results, thrown errors, and boundary conditions. It also helps to write tests for both successful and failing dependency responses using mocks.
