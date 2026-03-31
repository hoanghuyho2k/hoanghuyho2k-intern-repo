import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
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
}