
# Creating REST APIs with NestJS

## REST APIs in NestJS

NestJS structures REST APIs mainly through **controllers** and **services**. According to the NestJS docs, controllers are responsible for handling incoming requests and returning responses, while decorators such as `@Get()` define which HTTP method and route are mapped to each handler. :contentReference[oaicite:0]{index=0}

A simple REST API usually includes routes such as:

- `GET` → retrieve data
- `POST` → create data
- `PUT` → update data
- `DELETE` → remove data

## Example Controller with CRUD Routes

```typescript
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: { title: string }) {
    return this.tasksService.create(body.title);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { title: string }) {
    return this.tasksService.update(Number(id), body.title);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(Number(id));
  }
}
```

NestJS maps these handlers to routes using decorators such as @Controller() and @Get(). The docs explain that route paths are built from the controller prefix plus the method decorator path.

## Example Service for Business Logic

```typescript
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
```

NestJS providers are classes that can be injected into controllers and other classes. Providers are a central concept in Nest, and they support modular, testable business logic.

## Testing Endpoints

We can test endpoints with curl:

```bash
curl http://localhost:3000/tasks
curl http://localhost:3000/tasks/1
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Write reflection"}'
curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"title":"Updated task"}'
curl -X DELETE http://localhost:3000/tasks/1
```

We could also test the same routes in Postman by selecting the correct method, URL, and JSON body.

## Reflection

A controller handles incoming HTTP requests, maps routes to handler methods, and returns responses to the client. NestJS uses decorators such as @Controller() and @Get() to define this routing behavior.

How should business logic be separated from the controller?

Business logic should be placed in a service rather than directly inside the controller, so the controller stays focused on request handling and routing.

Why is it important to use services instead of handling logic inside controllers?

Using services improves maintainability, reusability, and testability because the logic is separated from transport concerns such as HTTP routing. This also matches NestJS’s provider-based architecture.

How does NestJS automatically map request methods (GET, POST, etc.) to handlers?

NestJS uses method decorators such as @Get(), @Post(), @Put(), and @Delete() to associate HTTP methods and route paths with specific controller methods. The framework reads this metadata and builds the routing map automatically.
