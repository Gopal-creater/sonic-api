import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SystemRoles } from 'src/constants/Enums';
import { UserDB } from '../../user/schemas/user.db.schema';
import { CreateSonicKeyDto } from '../dtos/create-sonickey.dto';

@Injectable()
export class EncodeSecurityGuard implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const loggedInUser = request?.user as UserDB;
    var createSonicKeyDto: CreateSonicKeyDto;
    if (typeof request?.body?.data == 'string') {
      createSonicKeyDto = JSON.parse(request?.body?.data);
    } else {
      createSonicKeyDto = request?.body?.data;
    }
    console.log("request?.body",request?.body)
    console.log("createSonicKeyDto",createSonicKeyDto)
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN:
        break;

      case SystemRoles.PARTNER_ADMIN:
      case SystemRoles.PARTNER_USER:
        const partnerId = loggedInUser?.partner?.id;
        if (!createSonicKeyDto.partner) {
          throw new BadRequestException(
            'Please provide partner id in the request body',
          );
        }
        if (createSonicKeyDto.partner !== partnerId) {
          throw new UnprocessableEntityException(
            'Resource mismatch, Please provide your own partner id',
          );
        }
        //Delete fields that are not applicable for this role
        delete createSonicKeyDto?.owner;
        delete createSonicKeyDto?.company;
        break;

      case SystemRoles.COMPANY_ADMIN:
      case SystemRoles.COMPANY_USER:
        const companyId = loggedInUser?.company?.id;
        if (!createSonicKeyDto.company) {
          throw new BadRequestException(
            'Please provide company id in the request body',
          );
        }
        if (createSonicKeyDto.company !== companyId) {
          throw new UnprocessableEntityException(
            'Resource mismatch, Please provide your own company id',
          );
        }
        //Delete fields that are not applicable for this role
        delete createSonicKeyDto?.owner;
        delete createSonicKeyDto?.partner;
        break;

      default:
        const ownerId = loggedInUser?.id;
        if (!createSonicKeyDto.owner) {
          throw new BadRequestException(
            'Please provide owner id in the request body',
          );
        }
        if (createSonicKeyDto.owner !== ownerId) {
          throw new UnprocessableEntityException(
            'Resource mismatch, Please provide your own user/owner id',
          );
        }
        //Delete fields that are not applicable for this role
        delete createSonicKeyDto?.partner;
        delete createSonicKeyDto?.company;
        break;
    }
    if (typeof request?.body?.data == 'string') {
      request.body.data = JSON.stringify(createSonicKeyDto);
    } else {
      request.body.data = createSonicKeyDto;
    }

    return true;
  }
}
