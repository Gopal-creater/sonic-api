import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Roles, SystemRoles } from 'src/constants/Enums';
import { UserDB } from '../../user/schemas/user.db.schema';
import { LicensekeyService } from '../services/licensekey.service';

@Injectable()
export class DeleteLicenseSecurityGuard implements CanActivate {
  constructor(private readonly licensekeyService: LicensekeyService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const loggedInUser = request?.user as UserDB;
    const licenseKeyId = request?.params?.id;
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN:
      case Roles.THIRDPARTY_ADMIN:
        break;

      case SystemRoles.PARTNER_ADMIN:
        const partnerId = loggedInUser?.partner?._id;
        const licenseKey = await this.licensekeyService.findOneAggregate({
          filter: {},
          relationalFilter: {
            $or: [
              { 'users.partner': partnerId },
              { 'company.partner': partnerId },
            ],
          },
        });
        if (!licenseKey) {
          throw new NotFoundException();
        }
        break;

      case SystemRoles.COMPANY_ADMIN:
        const companyId = loggedInUser?.company?.id;
        const licenseKeyFromdb = await this.licensekeyService.findOne({
          _id: licenseKeyId,
          company: companyId,
        });
        if (!licenseKeyFromdb) {
          throw new NotFoundException();
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
