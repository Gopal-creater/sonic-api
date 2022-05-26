import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { UserDB } from '../../user/schemas/user.db.schema';
import { SystemRoles } from 'src/constants/Enums';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import parsedQueryValueFromQuery from '../../../shared/utils/parsedQueryValueFromQuery';

@Injectable()
export class GetPartnerSecurityGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();
    // const queries = request?.query
    const partnerId = request?.params?.id as string
    const loggedInUser = request?.user as UserDB
    // const parsedQueryValue = parsedQueryValueFromQuery(queries)
    // const{filter}=parsedQueryValue
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN: 
        break;

      case SystemRoles.COMPANY_ADMIN:
      case SystemRoles.COMPANY_USER:
        throw new ForbiddenException("You dont have permission to do this action.")

      case SystemRoles.PARTNER_ADMIN:
      case SystemRoles.PARTNER_USER:
          if(partnerId!==loggedInUser?.partner?.id){
            throw new ForbiddenException("You dont have permission to do this action, resource mismatch")
          }
          break;
      default:
        throw new ForbiddenException("You dont have permission to do this action.")
    }

    return true
  }

}
