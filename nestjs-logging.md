
# Logging & Error Handling in NestJS

## Install logging packages

```bash
npm install nestjs-pino pino pino-http pino-pretty
```

## Create src/all-exceptions.filter.ts

```typescript
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorResponse,
    });
  }
}
```

## Update src/app.module.ts to include LoggerModule

```bash
import { LoggerModule } from 'nestjs-pino';

LoggerModule.forRoot({
  pinoHttp: {
    transport: {
      target: 'pino-pretty',
    },
  },
}),
```

## Update src/main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
```

## Start the app

```bash
npm run start:dev
```

## And test an error response, for example with an invalid route:

```bash
curl http://localhost:3000/does-not-exist
```

Output of the test:

```bash
{"statusCode":404,"timestamp":"2026-04-06T00:26:00.426Z","path":"/does-not-exist","error":{"message":"Cannot GET /does-not-exist","error":"Not Found","statusCode":404}}%
```

## Reflection

What are the benefits of using `nestjs-pino` for logging?

`nestjs-pino` provides structured, machine-readable logs, integrates with NestJS dependency injection, and supports request-aware logging. This makes debugging, monitoring, and production log analysis much easier.

How does global exception handling improve API consistency?

Global exception handling ensures that all API errors follow the same response structure, which makes the API easier to debug and easier for frontend applications to handle consistently.

What is the difference between a logging interceptor and an exception filter?

A logging interceptor is used to log request and response flow around route execution, while an exception filter is used specifically to catch exceptions and format error responses.

How can logs be structured to provide useful debugging information?

Logs should include fields such as timestamp, log level, message, request ID, route, HTTP method, and error details when relevant. Structured JSON logging makes it easier to trace requests and diagnose issues. `pino` and `nestjs-pino` are both designed around this style of logging.
