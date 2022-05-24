import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { UserDB } from '../../user/schemas/user.db.schema';
import { SystemRoles } from 'src/constants/Enums';
import { CreateCompanyDto } from '../dtos/create-company.dto';

@Injectable()
export class CreateCompanySecurityGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const createCompanyDto = request?.body as CreateCompanyDto;
    const loggedInUser = request?.user as UserDB;
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN:
        break;
      case SystemRoles.PARTNER_ADMIN:
        if (!createCompanyDto.partner) {
          throw new BadRequestException('Please provide your partner id');
        }
        if (createCompanyDto.partner !== loggedInUser.adminPartner?.id) {
          throw new ForbiddenException(
            'You dont have permission to do this action, resource mismatch',
          );
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
