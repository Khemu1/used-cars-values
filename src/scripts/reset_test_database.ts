import { config } from 'dotenv';
import { join } from 'path';
import { Client } from 'pg';

const DB_NAME = 'used_cars_values_test';
config({ path: join(__dirname, '../../.env.test') });

async function resetTestDatabase(): Promise<void> {
  console.log('DB_NAME', DB_NAME);
  console.log('connectionString ', process.env.DATABASE_URL);

  const client = new Client({
    connectionString: 'postgresql://postgres:khemu123456@localhost:5432/postgres',
  });

  await client.connect();

  await client.query(`
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = '${DB_NAME}'
      AND pid <> pg_backend_pid()
  `);

  await client.query(`DROP DATABASE IF EXISTS "${DB_NAME}"`);
  await client.query(`CREATE DATABASE "${DB_NAME}"`);

  await client.end();
  console.log('Test database reset successfully');
}

export { resetTestDatabase };
