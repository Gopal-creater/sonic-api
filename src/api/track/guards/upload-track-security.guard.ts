import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SystemRoles } from 'src/constants/Enums';
import { TrackService } from '../track.service';
import { UserDB } from '../../user/schemas/user.db.schema';
import { UploadTrackDto } from '../dto/create-track.dto';

@Injectable()
export class UploadTrackSecurityGuard implements CanActivate {
  constructor(
    private readonly trackService: TrackService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const loggedInUser = request?.user as UserDB;
    const uploadTrackDto = request?.body as UploadTrackDto;
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN:
        break;

      case SystemRoles.PARTNER_ADMIN:
      case SystemRoles.PARTNER_USER:
        const partnerId = loggedInUser?.partner?._id;
        if(!uploadTrackDto.partner){
          throw new BadRequestException("Please provide partner id in the request body")
        }
        if (uploadTrackDto.partner!==partnerId) {
          throw new UnprocessableEntityException("Resource mismatch, Please provide your own partner id");
        }
        //Delete fields that are not applicable for this role
        delete uploadTrackDto?.owner;
        delete uploadTrackDto?.company;
        request.body = uploadTrackDto;
        break;

      case SystemRoles.COMPANY_ADMIN:
      case SystemRoles.COMPANY_USER:
        const companyId = loggedInUser?.company?._id;
        if(!uploadTrackDto.company){
          throw new BadRequestException("Please provide company id in the request body")
        }
        if (uploadTrackDto.company!==companyId) {
          throw new UnprocessableEntityException("Resource mismatch, Please provide your own company id");
        }
        //Delete fields that are not applicable for this role
        delete uploadTrackDto?.owner;
        delete uploadTrackDto?.partner;
        request.body = uploadTrackDto;
        break;

      default:
        const ownerId = loggedInUser?._id;
        if(!uploadTrackDto.owner){
          throw new BadRequestException("Please provide owner id in the request body")
        }
        if (uploadTrackDto.owner!==ownerId) {
          throw new UnprocessableEntityException("Resource mismatch, Please provide your own user/owner id");
        }
        //Delete fields that are not applicable for this role
        delete uploadTrackDto?.partner;
        delete uploadTrackDto?.company;
        request.body = uploadTrackDto;
        break;
    }

    return true;
  }
}
