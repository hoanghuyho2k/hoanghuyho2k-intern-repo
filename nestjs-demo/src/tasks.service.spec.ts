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