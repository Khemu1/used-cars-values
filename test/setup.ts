import { resetTestDatabase } from '../src/scripts/reset_test_database';

beforeAll(async () => {
  await resetTestDatabase();
});
