import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '../../Models/user.model';
import { ROLES_KEYS } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEYS,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userIdToUpdate = request.params.id;
    const profileKey = request.url.trim().split("/")[2]
    // console.log(request.url.trim().split("/")[2]);
    // console.log('Request Params:', request.params);
    // console.log('User object:', user);

    // Check if the user exists and matches required roles
    if (!user) {
      throw new ForbiddenException('You are not authenticated.');
    }

    // Allow access if the user is an admin
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Allow access if the user is updating their own data
    if (user.role === UserRole.USER && (user.userId === userIdToUpdate || profileKey === 'me')) {
      return true;
    }

    // Otherwise, deny access
    throw new ForbiddenException(
      'You do not have the necessary permissions to access this resource.',
    );
  }
}
