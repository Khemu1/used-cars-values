import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role, User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!allowedRoles) return true;

    const req = context.switchToHttp().getRequest<Request & { currentUser?: User; session?: { userId?: number } }>();

    const user = await this.userService.findUserById(req.session!.userId!);

    if (!user || !allowedRoles.includes(user.role)) {
      throw new ForbiddenException(`Access denied for your role: ${user?.role}`);
    }

    // attach for @CurrentUser decorator
    req.currentUser = user;

    return true;
  }
}
