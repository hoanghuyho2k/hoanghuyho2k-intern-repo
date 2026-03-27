
# Validating Requests with Pipes in NestJS

Nest’s official validation guide shows the exact pattern: install class-validator and class-transformer, create a DTO class with validation decorators, and register a global ValidationPipe in main.ts so all endpoints are validated automatically.

## Install validation packages

```bash
npm install class-validator class-transformer
```

## Create a DTO

Create src/tasks/create-task.dto.ts

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
```

## Update the controller to use the DTO and ParseIntPipe

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

## Enable Global Validation in main.ts

```typescript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

This does three helpful things:

whitelist: true strips properties that are not in the DTO
forbidNonWhitelisted: true rejects unexpected properties
transform: true enables type transformation where applicable

## Start the app

```bash
npm run start:dev
```

## Test Valid and Invalid requests

Valid request:

```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Write NestJS validation notes"}'
```

Invalid request: empty title

```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":""}'
```

Invalid request: Extra unexpected field

```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Task","extra":"not allowed"}'
```

Test `ParseIntPipe`

```bash
curl http://localhost:3000/tasks/abc
```

This should fail because abc is not a valid integer. Nest lists ParseIntPipe as one of its built-in pipes for this kind of parameter validation.

## Reflection

What is the purpose of pipes in NestJS?

Pipes are used to validate and transform incoming request data before it reaches the controller method. This helps keep request handling safer and more structured.

How does ValidationPipe improve API security and data integrity?

ValidationPipe improves API security and data integrity by rejecting invalid or unexpected input before it is processed, which reduces the risk of incorrect data entering the application.

What is the difference between built-in and custom pipes?

Built-in pipes handle common validation and transformation tasks provided by NestJS, while custom pipes are written by developers to support application-specific rules or formatting.

How do decorators like @IsString() and @IsNumber() work with DTOs?

Decorators such as @IsString() and @IsNumber() define validation rules for DTO properties. When ValidationPipe is enabled, NestJS checks incoming request data against those rules and throws an error if validation fails.
