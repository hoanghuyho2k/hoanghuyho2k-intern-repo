
# Seeding and Migrations in TypeORM

## Install extra packages

```bash
npm install @nestjs/typeorm typeorm pg
npm install -D ts-node
```

## Create src/data-source.ts

```typescript
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Task } from './tasks/task.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'focusbear_dev',
  entities: [Task],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
```

## Update src/app.module.ts

For migrations, it is better to turn off `synchronize`.

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
      synchronize: false,
    }),
    TasksModule,
  ],
})
export class AppModule {}
```

## Add script to nestjs-demo/package.json

```json
"scripts": {
  "start": "nest start",
  "start:dev": "nest start --watch",
  "build": "nest build",
  "typeorm": "typeorm-ts-node-commonjs -d src/data-source.ts",
  "migration:generate": "npm run typeorm -- migration:generate src/migrations/InitMigration",
  "migration:run": "npm run typeorm -- migration:run",
  "migration:revert": "npm run typeorm -- migration:revert",
  "seed": "ts-node src/seed.ts"
}
```

## Generate a migration

```bash
npm run migration:generate
```

## Run migration

```bash
npm run migration:run
```

## Create src/seed.ts

```typescript
import { AppDataSource } from './data-source';
import { Task } from './tasks/task.entity';

async function seed() {
  await AppDataSource.initialize();

  const taskRepository = AppDataSource.getRepository(Task);

  const sampleTasks = [
    { title: 'Morning routine' },
    { title: 'Exercise habit' },
    { title: 'Review app settings' },
  ];

  for (const task of sampleTasks) {
    const exists = await taskRepository.findOneBy({ title: task.title });

    if (!exists) {
      const newTask = taskRepository.create(task);
      await taskRepository.save(newTask);
    }
  }

  console.log('Seeding completed');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
});
```

## Run the seed script

```bash
npm run seed
```

## Test it

```bash
npm run start:dev
```

## Check URL

```bash 
curl http://localhost:3000/tasks
```

## Reflection

What is the purpose of database migrations in TypeORM?

Database migrations are used to apply schema changes in a controlled, versioned, and repeatable way so the database stays in sync with the application safely.

How do migrations differ from seeding?

Migrations change the database structure, such as creating or altering tables, while seeding inserts initial or sample data into tables that already exist. This difference is implied by TypeORM’s separate migration workflow and standard repository-based data insertion patterns.

Why is it important to version-control database schema changes?

Version-controlling schema changes helps teams review, track, and reproduce database updates across development, testing, and production environments without relying on manual changes.

How can you roll back a migration if an issue occurs?

You can roll back the most recent migration using `typeorm migration:revert`, which undoes the last applied migration and helps recover from schema issues.

