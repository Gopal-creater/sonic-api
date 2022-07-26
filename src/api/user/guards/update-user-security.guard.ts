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
import { UpdateUserDto } from '../dtos/update-user.dto';
import { toObjectId } from 'src/shared/utils/mongoose.utils';

/**
 * Check ownership of the user here
 */
@Injectable()
export class UpdateUserSecurityGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const loggedInUser = request?.user as UserDB;
    const userId = request?.params?.id;
    const updateUserDto = request?.body as UpdateUserDto;
    if (userId == loggedInUser?.sub) {
      throw new UnprocessableEntityException(
        'You can not update your own details using this endpoint',
      );
    }
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN:
        if (updateUserDto.partner) {
          updateUserDto.userRole = SystemRoles.PARTNER_USER;
        }
        if (updateUserDto.company) {
          updateUserDto.userRole = SystemRoles.COMPANY_USER;
        }
        break;

      case SystemRoles.PARTNER_ADMIN:
        const partnerId = loggedInUser?.adminPartner?.id
        const userFromDb = await this.userService.getUserProfile(userId)
        if(!userFromDb){
          throw new NotFoundException('User not found')
        }
        if(userFromDb.userRole!==SystemRoles.PARTNER_USER && userFromDb.userRole!==SystemRoles.COMPANY_USER && userFromDb.userRole!==SystemRoles.COMPANY_ADMIN){
          throw new UnprocessableEntityException('User can not be modified')
        }
        if(userFromDb.userRole==SystemRoles.PARTNER_USER){
            if(userFromDb?.partner?.id!==partnerId){
              throw new NotFoundException('User not found');
            }
        }
        if(userFromDb.userRole==SystemRoles.COMPANY_USER || userFromDb.userRole==SystemRoles.COMPANY_ADMIN ){
          const isOwnUser = await this.userService.findOneAggregate({
            filter:{
              _id:userId
            },
            relationalFilter:{
              'company.partner':toObjectId(partnerId)
            }
          })
          if(!isOwnUser){
            throw new NotFoundException('User not found');
          }
      }

            //Delete fields that are not applicable for this role
            delete updateUserDto.userRole;
            delete updateUserDto.partner;
            if (updateUserDto.company) {
              updateUserDto.userRole = SystemRoles.COMPANY_USER;
            }
            request.body = updateUserDto;

        break;

      case SystemRoles.COMPANY_ADMIN:
        const companyId = loggedInUser?.adminCompany?.id
        const userFromDatabase = await this.userService.findOne({
          _id:userId,
          'company':toObjectId(companyId)
        })
        if(!userFromDatabase){
          throw new NotFoundException('User not found')
        }
        if(userFromDatabase.userRole!==SystemRoles.COMPANY_USER){
          throw new UnprocessableEntityException('User can not be modified')
        }
         //Delete fields that are not applicable for this role
         delete updateUserDto.userRole;
         delete updateUserDto.partner;
         delete updateUserDto.company;
         request.body = updateUserDto;
        break;

      default:
        throw new ForbiddenException(
          'You dont have permission to do this action.',
        );
    }

    return true;
  }
}
