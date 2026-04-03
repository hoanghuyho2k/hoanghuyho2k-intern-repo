
# Background Jobs with BullMQ and Redis in NestJS

## Install packages

```bash
npm install @nestjs/bullmq bullmq ioredis
```

## Make sure Redis is running inside docker-compose.yml file

```yaml
services:
  api:
    build:
      context: ./nestjs-demo
      dockerfile: Dockerfile
    container_name: focusbear-nestjs
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USER: postgres
      DATABASE_PASSWORD: postgres
      DATABASE_NAME: focusbear_dev
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:17
    container_name: focusbear-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: focusbear_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: focusbear-redis
    restart: unless-stopped
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Run Redis

```bash
docker compose up -d redis
```

## Create BullMQ processor

Add tasks.processor.ts file

```typescript
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('tasks')
export class TasksProcessor extends WorkerHost {
  async process(job: Job<any>): Promise<any> {
    console.log('Processing job:', job.name, job.data);

    if (job.name === 'create-task') {
      return {
        status: 'done',
        message: `Task processed: ${job.data.title}`,
      };
    }

    return { status: 'unknown job' };
  }
}
```

## Update tasks.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

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
```

## Update tasks.controller.ts

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

  @Post('queue')
  addToQueue(@Body() body: CreateTaskDto) {
    return this.tasksService.addBackgroundTask(body.title);
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

## Update tasks.module.ts

```typescript
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksProcessor } from './tasks.processor';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    BullModule.registerQueue({
      name: 'tasks',
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksProcessor],
})
export class TasksModule {}
```

## Update app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
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
      synchronize: false,
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TasksModule,
  ],
})
export class AppModule {}
```

## Start services

```bash
docker compose up -d postgres redis
```

```bash
npm run start:dev
```

## Test the queue endpoint

Add a job
```bash
curl -X POST http://localhost:3000/tasks/queue \
-H "Content-Type: application/json" \
-d '{"title":"Send notification"}'
```

Expected response

```bash
{"message":"Task added to background queue"}
```

## Reflection

Why is BullMQ used instead of handling tasks directly in API requests?

BullMQ is used because it allows time-consuming tasks to run in the background, which keeps API responses fast and prevents the application from blocking while long tasks are processed.

How does Redis help manage job queues in BullMQ?

Redis stores the state of queued jobs, including waiting, active, completed, failed, and delayed jobs, which allows BullMQ to manage background processing efficiently.

What happens if a job fails? How can failed jobs be retried?

If a job fails, BullMQ moves it to the failed state. It can automatically retry failed jobs if retry attempts and backoff options are configured when the job is created.

How does Focus Bear use BullMQ for background tasks?

Focus Bear can use BullMQ for backend tasks that should run asynchronously, such as sending notifications, processing analytics, syncing data, or handling other background operations without slowing down API requests.
