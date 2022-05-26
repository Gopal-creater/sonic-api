import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { UserDB } from '../schemas/user.db.schema';
import { SystemRoles } from 'src/constants/Enums';
import { UserService } from '../services/user.service';
import { CompanyService } from '../../company/company.service';

/**
 * Check ownership of the user here
 */
@Injectable()
export class ChangeUserPasswordSecurityGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const loggedInUser = request?.user as UserDB;
    const userId = request?.params?.id;
    console.log("userId",userId)
    if (userId == loggedInUser?.sub) {
      throw new UnprocessableEntityException(
        'You can not change your own password using this endpoint',
      );
    }
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN:
        break;

      case SystemRoles.PARTNER_ADMIN:
        const partnerId = loggedInUser?.adminPartner?.id
        const userFromDb = await this.userService.getUserProfile(userId)
        console.log("partnerId",partnerId)
        console.log("userFromDb?.partner?.id",userFromDb?.partner?.id)
        if(!userFromDb){
          throw new NotFoundException('User not found db')
        }
        if(userFromDb.userRole!==SystemRoles.PARTNER_USER && userFromDb.userRole!==SystemRoles.COMPANY_USER){
          throw new UnprocessableEntityException('User can not be modified')
        }
        if(userFromDb.userRole==SystemRoles.PARTNER_USER){
            if(userFromDb?.partner?.id!==partnerId){
              throw new NotFoundException('User not found cond');
            }
        }
        if(userFromDb.userRole==SystemRoles.COMPANY_USER){
          const isOwnUser = await this.userService.findOneAggregate({
            filter:{
              _id:userId
            },
            relationalFilter:{
              'company.partner':partnerId
            }
          })
          if(!isOwnUser){
            throw new NotFoundException('User not found');
          }
      }

        break;

      case SystemRoles.COMPANY_ADMIN:
        const companyId = loggedInUser?.adminCompany?.id
        const userFromDatabase = await this.userService.findOne({
          _id:userId,
          'company':companyId
        })
        if(!userFromDatabase){
          throw new NotFoundException('User not found')
        }
        if(userFromDb.userRole!==SystemRoles.COMPANY_USER){
          throw new UnprocessableEntityException('User can not be modified')
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
