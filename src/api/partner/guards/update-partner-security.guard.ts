import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { UserDB } from '../../user/schemas/user.db.schema';
import { SystemRoles } from 'src/constants/Enums';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import parsedQueryValueFromQuery from '../../../shared/utils/parsedQueryValueFromQuery';

@Injectable()
export class UpdatePartnerSecurityGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();
    // const queries = request?.query
    const partnerId = request?.param?.id as string
    const loggedInUser = request?.user as UserDB
    // const parsedQueryValue = parsedQueryValueFromQuery(queries)
    // const{filter}=parsedQueryValue
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN: 
        break;

      case SystemRoles.PARTNER_ADMIN:
          if(partnerId!==loggedInUser?.adminPartner?.id){
            throw new ForbiddenException("You dont have permission to do this action, resource mismatch")
          }
          //Remove data that can not be modified by this user role
          delete request?.body?.owner
          break;
      default:
        throw new ForbiddenException("You dont have permission to do this action.")
    }

    return true
  }

}
