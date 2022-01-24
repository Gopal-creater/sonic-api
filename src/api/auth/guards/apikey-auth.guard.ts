import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ApiKeyService } from '../../api-key/api-key.service';
import { UserService } from '../../user/services/user.service';
import { UserDB } from '../../user/schemas/user.db.schema';
import { ApiKeyType } from 'src/constants/Enums';
import { CompanyService } from '../../company/company.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const apikey = request.headers['x-api-key'];

    if (!apikey)
      throw new ForbiddenException('Forbidden resource deuto no apikey');

    const apikeyFromDb = await this.apiKeyService
      .findById(apikey)
      .catch(err => {
        throw new ForbiddenException('Forbidden resource deuto invalid apikey');
      });

    if (!apikeyFromDb)
      throw new ForbiddenException('Forbidden resource deuto invalid apikey');

    if (apikeyFromDb.revoked)
      throw new ForbiddenException('This api key is revoked');

    if (apikeyFromDb.disabled || apikeyFromDb.suspended)
      throw new ForbiddenException(
        'Forbidden resource deuto apikey is disabled or suspended',
      );

    if (new Date(apikeyFromDb.validity).getTime() < new Date().getTime())
      throw new ForbiddenException(
        'Forbidden resource deuto apikey is expired',
      );
    var ownerUser: UserDB;
    if (apikeyFromDb.type == ApiKeyType.INDIVIDUAL) {
      ownerUser = await this.userService.getUserProfile(
        apikeyFromDb?.customer?.sub,
      );
    } else if (apikeyFromDb.type == ApiKeyType.COMPANY) {
      const ownerCompany = await this.companyService.findById(
        apikeyFromDb?.company?._id,
      );
      if (!ownerCompany)
        throw new ForbiddenException('Company not found for this apikey');
      ownerUser = await this.userService.findOne({
        adminCompany: ownerCompany._id,
      });
    }
    if (!ownerUser)
      throw new ForbiddenException('User not found for this apikey');
    request.user = ownerUser;
    request.apikey = apikeyFromDb;
    return true;
  }
}
