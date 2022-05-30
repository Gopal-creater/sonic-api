import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiKeyType, Roles, SystemRoles } from 'src/constants/Enums';
import { UserDB } from '../../user/schemas/user.db.schema';
import { AddUserToLicense } from '../dto/update-licensekey.dto';
import { LicensekeyService } from '../services/licensekey.service';

@Injectable()
export class AddUserToLicenseSecurityGuard implements CanActivate {
  constructor(private readonly licensekeyService: LicensekeyService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const loggedInUser = request?.user as UserDB;
    const licenseKeyId = request?.params?.id;
    const addUserToLicense = request?.body as AddUserToLicense;
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN:
      case Roles.THIRDPARTY_ADMIN:
        break;

      case SystemRoles.PARTNER_ADMIN:
        const partnerId = loggedInUser?.partner?.id;
        const licenseKey = await this.licensekeyService.findOneAggregate({
          filter: {
            _id: licenseKeyId,
          },
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
        const ownerId = loggedInUser?.id;
        if (addUserToLicense.user !== ownerId) {
          throw new UnprocessableEntityException(
            'Resource mismatch, Please provide your own user id',
          );
        }
        const licenseKeyfromdb = await this.licensekeyService.findById(
          licenseKeyId,
        );
        if (licenseKeyfromdb.type !== ApiKeyType.INDIVIDUAL) {
          throw new UnprocessableEntityException(
            'Only Individual license is allowed to add',
          );
        }

        if (
          licenseKeyfromdb.type == ApiKeyType.INDIVIDUAL &&
          licenseKeyfromdb.users?.length > 0
        ) {
          throw new UnprocessableEntityException(
            'Given license is already used by someone',
          );
        }
    }

    return true;
  }
}
