import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/constants/Enums';
import { ForbiddenException } from '@nestjs/common';
import { UserDB } from '../../user/schemas/user.db.schema';
import { Group } from 'src/api/group/schemas/group.schema';

@Injectable()
export class RoleBasedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles =
      this.reflector.getAllAndMerge<Roles[]>('roles', [
        context.getClass(),
        context.getHandler(),
      ]) || [];

    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const currentUser = request?.user as UserDB
    const userRoles:Group[] = currentUser['groups'] || [];
    const isAllowed = this.matchRoles(roles, userRoles);
    if(!isAllowed){
      throw new ForbiddenException("You dont have permission to do this.")
    }
    return true
  }

  matchRoles(definedRoles: string[], userRoles: Group[]): boolean {
    return userRoles.some((role) => definedRoles.includes(role.name));
  }
}
