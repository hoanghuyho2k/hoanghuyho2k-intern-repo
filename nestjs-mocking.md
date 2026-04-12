
# Mocking Dependencies & Database Interactions in NestJS

## Controller test (mock service)

src/tasks.controller.spec.ts

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

## Service test (mock database)

src/tasks.service.spec.ts

Add a mock for Bull Queue in the request:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getQueueToken } from '@nestjs/bullmq';
import { TasksService } from './tasks.service';
import { Task } from './tasks/task.entity';

describe('TasksService', () => {
  let service: TasksService;

  const mockRepo = {
    find: jest.fn().mockResolvedValue([{ id: 1, title: 'DB task' }]),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepo,
        },
        {
          provide: getQueueToken('tasks'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return tasks from mocked repository', async () => {
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, title: 'DB task' }]);
    expect(mockRepo.find).toHaveBeenCalled();
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

 PASS  src/tasks.service.spec.ts
 PASS  src/tasks.controller.spec.ts
 PASS  src/demo/demo.controller.spec.ts
 PASS  src/demo/demo.service.spec.ts
 PASS  src/app.controller.spec.ts
 PASS  src/app.service.spec.ts

Test Suites: 6 passed, 6 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        1.039 s
Ran all test suites.
```

## Reflection

Why is mocking important in unit tests?

Mocking is important because it isolates the code being tested from external dependencies such as databases or APIs. This makes tests faster, more reliable, and easier to control.

How do you mock a NestJS provider (e.g., a service in a controller test)?

You mock a provider by replacing it in the testing module using useValue with a mock object. This allows the controller to use the mocked version instead of the real service.

What are the benefits of mocking the database instead of using a real one?

Mocking the database avoids slow queries, setup complexity, and dependency on external systems. It ensures tests run quickly and consistently without needing a real database connection.

How do you decide what to mock vs. what to test directly?

You should mock external dependencies like databases, APIs, and services, while directly testing the core logic of the unit. This keeps tests focused and avoids unnecessary complexity.

