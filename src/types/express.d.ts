// src/types/express.d.ts

import { Role } from '../users/user.entity';

declare global {
  namespace Express {
    interface Request {
      session?: {
        userId?: number;
        userRole?: Role;
      };
      userId?: number;
      userRole?: Role;
    }
  }
}
