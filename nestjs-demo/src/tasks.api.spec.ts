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