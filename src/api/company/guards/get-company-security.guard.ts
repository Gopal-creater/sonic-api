import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { UserDB } from '../../user/schemas/user.db.schema';
import { SystemRoles } from 'src/constants/Enums';
import { CompanyService } from '../company.service';

@Injectable()
export class GetCompanySecurityGuard implements CanActivate {
  constructor(private readonly companyService: CompanyService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const companyId = request?.param?.id as string;
    const loggedInUser = request?.user as UserDB;
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN:
        break;

      case SystemRoles.COMPANY_ADMIN:
      case SystemRoles.COMPANY_USER:
        if (companyId !== loggedInUser?.company?.id) {
          throw new ForbiddenException('Resource mismatch');
        }
        break;

      case SystemRoles.PARTNER_ADMIN:
        const partnerId = loggedInUser?.adminPartner?.id;
        const company = await this.companyService.findOne({
          _id: companyId,
          partner: partnerId,
        });
        if (!company) {
          throw new ForbiddenException('Resource mismatch');
        }
        break;
        
      default:
        throw new ForbiddenException(
          'You dont have permission to do this action.',
        );
    }

    return true;
  }
}
