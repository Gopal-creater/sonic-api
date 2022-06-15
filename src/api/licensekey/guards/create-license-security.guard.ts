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
import { CreateLicensekeyDto } from '../dto/create-licensekey.dto';
import { LicensekeyService } from '../services/licensekey.service';

@Injectable()
export class CreateLicenseSecurityGuard implements CanActivate {
    constructor(private readonly trackService: LicensekeyService) { }
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const loggedInUser = request?.user as UserDB;
        const createLicensekeyDto = request?.body as CreateLicensekeyDto;
        switch (loggedInUser.userRole) {
            case SystemRoles.ADMIN:
            case Roles.THIRDPARTY_ADMIN:
                break;

            case SystemRoles.PARTNER_ADMIN:
                const partnerId = loggedInUser?.partner?.id;
                if (createLicensekeyDto.type == ApiKeyType.INDIVIDUAL) {
                    if (!createLicensekeyDto.user) {
                        throw new BadRequestException(
                            'Please provide user in the request body',
                        );
                    }
                    delete createLicensekeyDto.company;
                } else if (createLicensekeyDto.type == ApiKeyType.COMPANY) {
                    if (!createLicensekeyDto.company) {
                        throw new BadRequestException(
                            'Please provide company in the request body',
                        );
                    }
                    delete createLicensekeyDto.user;
                }
                //Delete fields that are not applicable for this role
                // delete createLicensekeyDto?.owner;
                // delete createLicensekeyDto?.company;
                request.body = createLicensekeyDto;
                break;

            case SystemRoles.COMPANY_ADMIN:
                const companyId = loggedInUser?.company?.id;
                if (!createLicensekeyDto.company) {
                    throw new BadRequestException(
                        'Please provide company id in the request body',
                    );
                }
                if (createLicensekeyDto.company !== companyId) {
                    throw new UnprocessableEntityException(
                        'Resource mismatch, Please provide your own company id',
                    );
                }
                if (createLicensekeyDto.type == ApiKeyType.INDIVIDUAL) {
                    if (!createLicensekeyDto.user) {
                        throw new BadRequestException(
                            'Please provide user in the request body',
                        );
                    }
                } else if (createLicensekeyDto.type == ApiKeyType.COMPANY) {
                }

                //Delete fields that are not applicable for this role
                // delete createLicensekeyDto?.owner;
                // delete createLicensekeyDto?.partner;
                request.body = createLicensekeyDto;
                break;

            default:
                throw new ForbiddenException(
                    'You dont have permission to do this action.',
                );
        }

        return true;
    }
}
