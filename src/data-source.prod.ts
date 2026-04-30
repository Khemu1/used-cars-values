import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../../.env.production') });

export const appDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [join(__dirname, '/../**/*.entity.js')],
  migrations: [join(__dirname, '/migrations/*.js')],
});
