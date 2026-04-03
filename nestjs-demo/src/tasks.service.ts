import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { Task } from './tasks/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectQueue('tasks')
    private readonly tasksQueue: Queue,
  ) {}

  findAll() {
    return this.taskRepository.find();
  }

  findOne(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  create(title: string) {
    const task = this.taskRepository.create({ title });
    return this.taskRepository.save(task);
  }

  async update(id: number, title: string) {
    await this.taskRepository.update(id, { title });
    return this.taskRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const task = await this.taskRepository.findOneBy({ id });

    if (task) {
      await this.taskRepository.remove(task);
    }

    return task;
  }

  async addBackgroundTask(title: string) {
    await this.tasksQueue.add(
      'create-task',
      { title },
      {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 1000,
        },
      },
    );

    return { message: 'Task added to background queue' };
  }
}