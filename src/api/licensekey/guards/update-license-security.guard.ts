import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ApiKeyType, Roles, SystemRoles } from 'src/constants/Enums';
import { UserDB } from '../../user/schemas/user.db.schema';
import { UpdateLicensekeyDto } from '../dto/update-licensekey.dto';
import { LicensekeyService } from '../services/licensekey.service';

@Injectable()
export class UpdateLicenseSecurityGuard implements CanActivate {
    constructor(private readonly licensekeyService: LicensekeyService) { }
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const loggedInUser = request?.user as UserDB;
        const licenseKeyId = request?.params?.id;
        const updateLicensekeyDto = request?.body as UpdateLicensekeyDto;
        console.log("loggedInUser",loggedInUser)
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
                        $or: [{ 'users.partner': partnerId }, { 'company.partner': partnerId }]
                    }
                });
                if (!licenseKey) {
                    throw new NotFoundException();
                }
                //Delete fields that are not applicable for this role
                // delete updateLicensekeyDto?.owner;
                // delete updateLicensekeyDto?.company;
                request.body = updateLicensekeyDto;
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

                //Delete fields that are not applicable for this role
                // delete updateLicensekeyDto?.owner;
                // delete updateLicensekeyDto?.partner;
                request.body = updateLicensekeyDto;
                break;

            default:
                throw new ForbiddenException(
                    'You dont have permission to do this action.',
                );
        }

        return true;
    }
}
