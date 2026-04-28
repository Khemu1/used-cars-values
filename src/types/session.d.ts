// src/types/session.d.ts

import 'cookie-session';

declare module 'cookie-session' {
  interface SessionData {
    userId: number | null;
  }
}
