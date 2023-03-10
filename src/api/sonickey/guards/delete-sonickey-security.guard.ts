import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { SystemRoles } from 'src/constants/Enums';
  import { UserDB } from '../../user/schemas/user.db.schema';
import { SonickeyService } from '../services/sonickey.service';
  
  @Injectable()
  export class DeleteSonicKeySecurityGuard implements CanActivate {
    constructor(
      private readonly sonickeyService: SonickeyService,
    ) {}
    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const loggedInUser = request?.user as UserDB;
      const sonickey = request?.params?.sonickey;
      switch (loggedInUser.userRole) {
        case SystemRoles.ADMIN:
          break;
  
        case SystemRoles.PARTNER_ADMIN:
        case SystemRoles.PARTNER_USER:
          const partnerId = loggedInUser?.partner?.id;
          const sonickeydb1 = await this.sonickeyService.findOne({
            _id: sonickey,
            partner: partnerId,
          });
          if (!sonickeydb1) {
            throw new NotFoundException();
          }
          break;
  
        case SystemRoles.COMPANY_ADMIN:
        case SystemRoles.COMPANY_USER:
          const companyId = loggedInUser?.company?.id;
          const sonickeydb2 = await this.sonickeyService.findOne({
            _id: sonickey,
            company: companyId,
          });
          if (!sonickeydb2) {
            throw new NotFoundException();
          }
          break;
  
        default:
          const ownerId = loggedInUser?.id;
          const sonickeydb3 = await this.sonickeyService.findOne({
            _id: sonickey,
            owner: ownerId,
          });
          if (!sonickeydb3) {
            throw new NotFoundException();
          }
          break;
      }
  
      return true;
    }
  }
  