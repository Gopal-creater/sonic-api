import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { UserDB } from '../../user/schemas/user.db.schema';
import { SystemRoles } from 'src/constants/Enums';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CompanyService } from '../../company/company.service';

@Injectable()
export class CreateUserSecurityGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const loggedInUser = request?.user as UserDB;
    const createUserDto = request?.body as CreateUserDto;
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN:
        break;

      case SystemRoles.PARTNER_ADMIN:
        const partnerId = loggedInUser?.adminPartner?._id;
        if(!createUserDto.partner && !createUserDto.company){
            throw new UnprocessableEntityException(
                'Please provide at least one partner or company for this user',
            );
        }
        if (createUserDto.partner) {
          console.log("createUserDto.partner",createUserDto.partner)
          if (createUserDto.partner !== String(partnerId)) {
            throw new ForbiddenException(
              'Resource mismatch, Provide your own partner id',
            );
          }
          createUserDto.userRole = SystemRoles.PARTNER_USER;
        }
        if (createUserDto.company) {
          const companyFromDb = await this.companyService.findOne({
            _id: createUserDto.company,
            partner: partnerId,
          });
          if (!companyFromDb) throw new NotFoundException('Unknown company');
          createUserDto.userRole = SystemRoles.COMPANY_USER;
        }
        break;

      case SystemRoles.COMPANY_ADMIN:
        const companyId = loggedInUser?.adminCompany?._id;
        if(!createUserDto.company){
            throw new UnprocessableEntityException(
                'Please provide your company id in the body for this user',
            );
        }
        if (createUserDto.company !== String(companyId)) {
          throw new ForbiddenException(
            'Resource mismatch, Provide your own company id',
          );
        }
        createUserDto.userRole = SystemRoles.COMPANY_USER;
        break;

      default:
        throw new ForbiddenException(
          'You dont have permission to do this action.',
        );
    }

    return true;
  }
}
