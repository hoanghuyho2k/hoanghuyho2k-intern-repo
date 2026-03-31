
# Connecting to PostgreSQL with TypeORM in NestJS

## Install Dependencies

```bash
npm install @nestjs/typeorm typeorm pg
```

## Create the entity

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}
```

## Update task.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

## Update task.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

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
```

## Update task.controller.ts

```typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.tasksService.create(body.title);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateTaskDto,
  ) {
    return this.tasksService.update(id, body.title);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
```

## Update task.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'focusbear_dev',
      entities: [Task],
      synchronize: true,
    }),
    TasksModule,
  ],
})
export class AppModule {}
```

## Run Postgres in Docker

```bash
docker compose up -d postgres
```

## Start NestJS

```bash
npm run start:dev
```

## Test a API

Create a task:

```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Learn TypeORM"}'
```

Get all tasks:

```bash
curl http://localhost:3000/tasks
```

Get one task:

```bash
curl http://localhost:3000/tasks/1
```

Update a task:

```bash
curl -X PUT http://localhost:3000/tasks/1 \
-H "Content-Type: application/json" \
-d '{"title":"Updated task"}'
```

Delete a task:

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Reflection

How does `@nestjs/typeorm` simplify database interactions?

`@nestjs/typeorm` simplifies database interactions by integrating TypeORM with NestJS modules and dependency injection, making it easier to configure connections and inject repositories into services.

What is the difference between an entity and a repository in TypeORM?

An entity defines the structure of a database table, while a repository provides methods to query, create, update, and delete records for that entity.

How does TypeORM handle migrations in a NestJS project?

TypeORM handles migrations by generating versioned files that describe schema changes and applying them through migration commands, which is safer than automatic schema synchronization in production.

What are the advantages of using PostgreSQL over other databases in a NestJS app?

PostgreSQL is a strong choice because it is a reliable relational database with strong SQL support, transactions, constraints, indexing, and advanced data types, which are useful for structured application data. PostgreSQL’s documentation highlights its standards compliance, extensibility, and reliability.
