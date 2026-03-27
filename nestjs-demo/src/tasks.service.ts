import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks = [
    { id: 1, title: 'Learn NestJS' },
    { id: 2, title: 'Build REST API' },
  ];

  findAll() {
    return this.tasks;
  }

  findOne(id: number) {
    return this.tasks.find((task) => task.id === id);
  }

  create(title: string) {
    const newTask = {
      id: this.tasks.length + 1,
      title,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  update(id: number, title: string) {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      return { message: 'Task not found' };
    }

    task.title = title;
    return task;
  }

  remove(id: number) {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      return { message: 'Task not found' };
    }

    return this.tasks.splice(index, 1)[0];
  }
}