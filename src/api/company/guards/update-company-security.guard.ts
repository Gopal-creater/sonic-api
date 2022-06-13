import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { UserDB } from '../../user/schemas/user.db.schema';
import { SystemRoles } from 'src/constants/Enums';
import { CompanyService } from '../company.service';

@Injectable()
export class UpdateCompanySecurityGuard implements CanActivate {
  constructor(private readonly companyService: CompanyService) {}
  async canActivate(
    context: ExecutionContext,
  ) {

    const request = context.switchToHttp().getRequest();
    const companyId = request?.params?.id as string
    const loggedInUser = request?.user as UserDB
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN: 
      delete request?.body?.owner
      delete request?.body?.partner
        break;

      case SystemRoles.PARTNER_ADMIN:
        const partnerId = loggedInUser?.adminPartner?.id
        const company = await this.companyService.findOne({_id:companyId,partner:partnerId})
        if(!company){
          throw new ForbiddenException("Resource mismatch")
        }
          //Remove data that can not be modified by this user role
        delete request?.body?.owner
        delete request?.body?.partner
        break;

      case SystemRoles.COMPANY_ADMIN:
        if(companyId!==loggedInUser?.adminCompany?.id){
          throw new ForbiddenException("Resource mismatch")
        }
        //Remove data that can not be modified by this user role
        delete request?.body?.owner
        delete request?.body?.partner
        delete request?.body?.enabled
        break;

      default:
        throw new ForbiddenException("You dont have permission to do this action.")
    }

    return true
  }

}
