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