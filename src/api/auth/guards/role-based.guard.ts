import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Roles, SystemRoles } from 'src/constants/Enums';
import { ForbiddenException } from '@nestjs/common';
import { UserDB } from '../../user/schemas/user.db.schema';

@Injectable()
export class RoleBasedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles =
      this.reflector.getAllAndMerge<String[]>('roles', [
        context.getClass(),
        context.getHandler(),
      ]) || [];

    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length<=0 || isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const currentUser = request?.user as UserDB
    const userRole = currentUser?.userRole
    //No check for Admin or SonicAdmin
    if(currentUser.isSonicAdmin||currentUser.userRole==SystemRoles.ADMIN){
      return true
    }
    if(!userRole){
      throw new ForbiddenException("User role not found")
    }
    const isAllowed = roles.includes(userRole)
    if(!isAllowed){
      throw new ForbiddenException("You dont have permission to do this.")
    }
    return true
  }
}
