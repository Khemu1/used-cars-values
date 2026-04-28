import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../users/user.entity';

export const WithRoles = (...roles: Role[]) =>
  // Store the allowed roles as metadata on the route handler
  // so RolesGuard can read them later via Reflector
  applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard, RolesGuard));
