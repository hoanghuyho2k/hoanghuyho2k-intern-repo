
# Using Jest and Supertest for API Testing in NestJS

## Install packages

```bash
npm install --save-dev supertest @types/supertest @nestjs/testing jest ts-jest @types/jest
```

## Create a simple API test file

src/tasks.api.spec.ts

```typescript
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('Tasks API', () => {
  let app;
  let mockTasksService;

  beforeEach(async () => {
    mockTasksService = {
      findAll: jest.fn().mockResolvedValue([{ id: 1, title: 'Mock task' }]),
      findOne: jest.fn().mockImplementation((id: number) => ({
        id,
        title: 'Mock task',
      })),
      create: jest.fn().mockImplementation((title: string) => ({
        id: 1,
        title,
      })),
      update: jest.fn().mockImplementation((id: number, title: string) => ({
        id,
        title,
      })),
      remove: jest.fn().mockImplementation((id: number) => ({
        id,
        title: 'Deleted task',
      })),
      addBackgroundTask: jest.fn().mockResolvedValue({
        message: 'Task added to background queue',
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /tasks should return 200 and tasks', async () => {
    const response = await request(app.getHttpServer())
      .get('/tasks')
      .expect(200);

    expect(response.body).toEqual([{ id: 1, title: 'Mock task' }]);
  });

  it('POST /tasks should create a task with valid input', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'API test task' })
      .expect(201);

    expect(response.body).toEqual({
      id: 1,
      title: 'API test task',
    });
  });

  it('POST /tasks should reject invalid input', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: '' })
      .expect(400);
  });

  it('GET /tasks/:id should reject invalid id', async () => {
    await request(app.getHttpServer())
      .get('/tasks/abc')
      .expect(400);
  });

  it('POST /tasks/queue should return success message', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks/queue')
      .send({ title: 'Queued task' })
      .expect(201);

    expect(response.body).toEqual({
      message: 'Task added to background queue',
    });
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

 PASS  src/app.service.spec.ts
 PASS  src/demo/demo.service.spec.ts
 PASS  src/app.controller.spec.ts
 PASS  src/demo/demo.controller.spec.ts
 PASS  src/tasks.service.spec.ts
 PASS  src/tasks.controller.spec.ts
 PASS  src/tasks.api.spec.ts

Test Suites: 7 passed, 7 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        1.282 s, estimated 2 s
Ran all test suites.
```

## Reflection

How does Supertest help test API endpoints?

Supertest helps by sending HTTP requests directly to a NestJS application instance and making assertions on status codes, headers, and response bodies. This makes it well suited for integration and end-to-end style API tests.

What is the difference between unit tests and API tests?

Unit tests check individual classes or methods in isolation, often with mocked dependencies. API tests exercise HTTP routes and verify how multiple parts of the app work together, such as controllers, validation, filters, and middleware.

Why should authentication be mocked in integration tests?

Authentication should be mocked in integration tests so the test stays focused on API behavior and does not depend on external identity systems or real token issuance. This makes tests faster, more reliable, and easier to control.

How can you structure API tests to cover both success and failure cases?

API tests should include both valid requests and invalid ones, such as missing fields, malformed input, unauthorized access, and not-found routes. This helps ensure the endpoint behaves correctly in normal and error scenarios.
