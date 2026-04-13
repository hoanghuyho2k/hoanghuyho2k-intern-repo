import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './tasks/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Headers() headers: Record<string, string>) {
    console.log('GET /tasks headers:', {
      authorization: headers.authorization,
      contentType: headers['content-type'],
    });

    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers() headers: Record<string, string>,
  ) {
    console.log('GET /tasks/:id param:', id);
    console.log('GET /tasks/:id headers:', {
      authorization: headers.authorization,
    });

    return this.tasksService.findOne(id);
  }

  @Post()
  create(
    @Body() body: CreateTaskDto,
    @Headers() headers: Record<string, string>,
  ) {
    console.log('POST /tasks body:', body);
    console.log('POST /tasks headers:', {
      authorization: headers.authorization,
      contentType: headers['content-type'],
    });

    return this.tasksService.create(body.title);
  }

  @Post('queue')
  addToQueue(
    @Body() body: CreateTaskDto,
    @Headers() headers: Record<string, string>,
  ) {
    console.log('POST /tasks/queue body:', body);
    console.log('POST /tasks/queue headers:', {
      authorization: headers.authorization,
      contentType: headers['content-type'],
    });

    return this.tasksService.addBackgroundTask(body.title);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateTaskDto,
    @Headers() headers: Record<string, string>,
  ) {
    console.log('PUT /tasks/:id param:', id);
    console.log('PUT /tasks/:id body:', body);
    console.log('PUT /tasks/:id headers:', {
      authorization: headers.authorization,
      contentType: headers['content-type'],
    });

    return this.tasksService.update(id, body.title);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Headers() headers: Record<string, string>,
  ) {
    console.log('DELETE /tasks/:id param:', id);
    console.log('DELETE /tasks/:id headers:', {
      authorization: headers.authorization,
    });

    return this.tasksService.remove(id);
  }
}