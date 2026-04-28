/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty */
import { rmSync } from 'fs';
import { join } from 'path';

global.beforeEach(() => {
  try {
    rmSync(join(__dirname, '..', 'db.test.sqlite'));
  } catch (e) {}
});
