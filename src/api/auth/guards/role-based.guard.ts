import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleBasedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!roles || roles.length<=0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles,user.roles)
  }

  matchRoles(definedRoles:string[],userRoles: string[]):boolean{
   return userRoles.some((role: string) => definedRoles.includes(role))
  //  return intersection(userRoles,definedRoles).length===userRoles.length
  }
}


