import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getQueueToken } from '@nestjs/bullmq';
import { TasksService } from './tasks.service';
import { Task } from './tasks/task.entity';

describe('TasksService', () => {
  let service: TasksService;

  const mockRepo = {
    find: jest.fn(),
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
    mockRepo.find.mockResolvedValue([{ id: 1, title: 'DB task' }]);

    const result = await service.findAll();

    expect(result).toEqual([{ id: 1, title: 'DB task' }]);
    expect(mockRepo.find).toHaveBeenCalledTimes(1);
  });

  it('should return one task by id', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, title: 'Task 1' });

    const result = await service.findOne(1);

    expect(result).toEqual({ id: 1, title: 'Task 1' });
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should create and save a task', async () => {
    mockRepo.create.mockReturnValue({ title: 'New task' });
    mockRepo.save.mockResolvedValue({ id: 1, title: 'New task' });

    const result = await service.create('New task');

    expect(mockRepo.create).toHaveBeenCalledWith({ title: 'New task' });
    expect(mockRepo.save).toHaveBeenCalledWith({ title: 'New task' });
    expect(result).toEqual({ id: 1, title: 'New task' });
  });

  it('should update and return the updated task', async () => {
    mockRepo.update.mockResolvedValue(undefined);
    mockRepo.findOneBy.mockResolvedValue({ id: 1, title: 'Updated task' });

    const result = await service.update(1, 'Updated task');

    expect(mockRepo.update).toHaveBeenCalledWith(1, { title: 'Updated task' });
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual({ id: 1, title: 'Updated task' });
  });

  it('should remove and return the deleted task', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, title: 'Task to delete' });
    mockRepo.remove.mockResolvedValue({ id: 1, title: 'Task to delete' });

    const result = await service.remove(1);

    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockRepo.remove).toHaveBeenCalledWith({ id: 1, title: 'Task to delete' });
    expect(result).toEqual({ id: 1, title: 'Task to delete' });
  });

  it('should return null when deleting a missing task', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);

    const result = await service.remove(99);

    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 99 });
    expect(mockRepo.remove).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should add a background task to the queue', async () => {
    mockQueue.add.mockResolvedValue(undefined);

    const result = await service.addBackgroundTask('Queued task');

    expect(mockQueue.add).toHaveBeenCalledWith(
      'create-task',
      { title: 'Queued task' },
      {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 1000,
        },
      },
    );
    expect(result).toEqual({ message: 'Task added to background queue' });
  });
});