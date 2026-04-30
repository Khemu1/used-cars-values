import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

config({ path: join(__dirname, '../.env.development') });

console.log(
  'Using DATABASE_URL from noarmal data srouce:',
  process.env.DATABASE_URL,
  join(__dirname, '../.env.development'),
);

export const appDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
} as DataSourceOptions);
