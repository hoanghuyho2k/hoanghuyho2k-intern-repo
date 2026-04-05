
# Handling Environment Variables and Configuration in NestJS

## Install packages

```bash
npm install @nestjs/config joi
```

`@nestjs/config` is Nest’s official configuration module, and it supports schema validation for env vars during startup.

## Create `.env` file

```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=focusbear_dev
JWT_SECRET=mysecretkey
REDIS_HOST=localhost
REDIS_PORT=6379
```

Nest loads `.env` from the project root by default with `ConfigModule.forRoot()`. Runtime env vars override `.env` values when both exist.

## Update app.module.ts

```typescript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { MockUserMiddleware } from './auth/mock-user.middleware';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MockUserMiddleware).forRoutes('*');
  }
}
```

This uses:

`ConfigModule.forRoot()` to load .env
`validationSchema` with Joi so the app fails fast if required vars are missing
`forRootAsync()` with `ConfigService` so TypeORM and BullMQ use env vars cleanly

## Make sure .env is ignored by Git

In .gitignore, add:

```bash
nestjs-demo/.env
.env
```

Secrets should not be committed to source control. Nest’s config guidance is built around keeping config in the environment instead of hardcoding it.

## Start require services

```bash
docker compose up -d postgres redis
```

```bash
npm run start:dev
```

## Test the app

Verify the app still works

```bash
curl http://localhost:3000/tasks
```

And BullMQ endpoint:

```bash
curl -X POST http://localhost:3000/tasks/queue \
-H "Content-Type: application/json" \
-d '{"title":"Test background job"}'
```

## Reflection

How does `@nestjs/config` help manage environment variables?

`@nestjs/config` helps by loading environment variables from `.env` files, merging them with `process.env`, and exposing them through ConfigService, which makes configuration cleaner and easier to manage across environments.

Why should secrets (e.g., API keys, database passwords) never be stored in source code?

Secrets should never be stored in source code because they can be exposed through the repository, which creates serious security risks such as unauthorized database access, API abuse, or account compromise. Keeping them in environment variables reduces that risk.

How can you validate environment variables before the app starts?

You can validate environment variables by using a validation schema when configuring `ConfigModule.forRoot()`, which allows the app to fail early if required values are missing or invalid. NestJS supports this directly in its configuration module.

How can you separate configuration for different environments (e.g., local vs. production)?

You can separate configuration by using different `.env` files such as `.env`.development and `.env.production`, and selecting them with `envFilePath`. NestJS supports custom and multiple env file paths so the correct configuration can be loaded for each environment.
