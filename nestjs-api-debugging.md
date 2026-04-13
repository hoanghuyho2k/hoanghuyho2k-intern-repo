
# Inspecting API Requests and Responses

## Why inspect requests and responses?

Inspecting incoming requests and outgoing responses is one of the fastest ways to debug API issues in NestJS. It helps confirm that:
- the request body contains the expected payload
- headers such as `Authorization` or `Content-Type` are present
- route parameters are parsed correctly
- the API returns the correct response structure and HTTP status code

NestJS controllers are responsible for handling incoming requests and sending responses, so this is a natural place to inspect request data while debugging.

## Tools for inspecting API requests

Common tools include:
- **Bruno**: lightweight GUI API client with collections
- **Postman**: popular API client for manual request testing
- **cURL**: command-line tool for sending HTTP requests
- **Browser DevTools / Network tab**: useful when requests come from a frontend

## Add temporary request logging in your controller

```typescript
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
```

## Test with cURL

```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-H "Authorization: Bearer test-token" \
-d '{"title":"Debug request"}'
```

Output:

```bash
{"id":9,"title":"Debug request"}%
```

NestJS response:

```bash
[12:53:28.352] INFO (20825): request completed
    req: {
      "id": "req-2",
      "method": "GET",
      "url": "/tasks",
      "query": {},
      "headers": {
        "host": "localhost:3000",
        "user-agent": "curl/8.4.0",
        "accept": "*/*",
        "authorization": "Bearer test-token"
      },
      "remoteAddress": "::1",
      "remotePort": 60742
    }
    res: {
      "statusCode": 200,
      "headers": {
        "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
        "cross-origin-opener-policy": "same-origin",
        "cross-origin-resource-policy": "same-origin",
        "origin-agent-cluster": "?1",
        "referrer-policy": "no-referrer",
        "strict-transport-security": "max-age=31536000; includeSubDomains",
        "x-content-type-options": "nosniff",
        "x-dns-prefetch-control": "off",
        "x-download-options": "noopen",
        "x-frame-options": "SAMEORIGIN",
        "x-permitted-cross-domain-policies": "none",
        "x-xss-protection": "0",
        "x-ratelimit-limit": 5,
        "x-ratelimit-remaining": 3,
        "x-ratelimit-reset": 53,
        "content-type": "application/json; charset=utf-8",
        "content-length": "282"
      }
    }
    responseTime: 18
```

## Reflection

How can logging request payloads help with debugging?

Logging request payloads helps confirm whether the server is receiving the expected body, headers, and parameters. This makes it easier to identify issues such as empty payloads, missing headers, invalid DTO fields, or incorrectly formatted requests. NestJS middleware and controllers are both suitable places to inspect request data during debugging.

What tools can you use to inspect API requests and responses?

You can use Bruno, Postman, cURL, and browser developer tools to inspect API requests and responses. These tools help verify headers, payloads, query parameters, and returned status codes before diving deeper into backend logic.

How would you debug an issue where an API returns the wrong status code?

I would first reproduce the request using Bruno or cURL, then inspect the controller input, service result, and any thrown exceptions. I would also check middleware, guards, interceptors, and exception filters because these parts of the NestJS request lifecycle can change the final response.

What are some security concerns when logging request data?

The main concern is exposing sensitive information such as passwords, tokens, API keys, and personal data in logs. To reduce risk, logs should be limited to relevant debugging data and sensitive fields should be masked or omitted.
