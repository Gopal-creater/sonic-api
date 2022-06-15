import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SystemRoles } from 'src/constants/Enums';
import { TrackService } from '../track.service';
import { UserDB } from '../../user/schemas/user.db.schema';
import { UpdateTrackDto } from '../dto/update-track.dto';

@Injectable()
export class UpdateTrackSecurityGuard implements CanActivate {
  constructor(
    private readonly trackService: TrackService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const loggedInUser = request?.user as UserDB;
    const trackId = request?.params?.id;
    const updateTrackDto = request?.body as UpdateTrackDto;
    switch (loggedInUser.userRole) {
      case SystemRoles.ADMIN:
        break;

      case SystemRoles.PARTNER_ADMIN:
      case SystemRoles.PARTNER_USER:
        const partnerId = loggedInUser?.partner?.id;
        const track = await this.trackService.findOne({
          _id: trackId,
          partner: partnerId,
        });
        if (!track) {
          throw new NotFoundException();
        }
        //Delete fields that are not applicable for this role
        delete updateTrackDto?.duration;
        delete updateTrackDto?.encoding;
        delete updateTrackDto?.fileSize;
        delete updateTrackDto?.fileType;
        delete updateTrackDto?.iExtractedMetaData;
        delete updateTrackDto?.localFilePath;
        delete updateTrackDto?.mimeType;
        delete updateTrackDto?.originalFileName;
        delete updateTrackDto?.s3OriginalFileMeta;
        delete updateTrackDto?.samplingFrequency;
        delete updateTrackDto?.channel;
        delete updateTrackDto?.company;
        delete updateTrackDto?.owner;
        delete updateTrackDto?.partner;
        request.body = updateTrackDto;
        break;

      case SystemRoles.COMPANY_ADMIN:
      case SystemRoles.COMPANY_USER:
        const companyId = loggedInUser?.company?.id;
        const trackfromdb = await this.trackService.findOne({
          _id: trackId,
          company: companyId,
        });
        if (!trackfromdb) {
          throw new NotFoundException();
        }
        //Delete fields that are not applicable for this role
        delete updateTrackDto?.duration;
        delete updateTrackDto?.encoding;
        delete updateTrackDto?.fileSize;
        delete updateTrackDto?.fileType;
        delete updateTrackDto?.iExtractedMetaData;
        delete updateTrackDto?.localFilePath;
        delete updateTrackDto?.mimeType;
        delete updateTrackDto?.originalFileName;
        delete updateTrackDto?.s3OriginalFileMeta;
        delete updateTrackDto?.samplingFrequency;
        delete updateTrackDto?.channel;
        delete updateTrackDto?.company;
        delete updateTrackDto?.owner;
        delete updateTrackDto?.partner;
        request.body = updateTrackDto;
        break;

      default:
        const ownerId = loggedInUser?.id;
        const trackfromdb1 = await this.trackService.findOne({
          _id: trackId,
          owner: ownerId,
        });
        if (!trackfromdb1) {
          throw new NotFoundException();
        }
        //Delete fields that are not applicable for this role
        delete updateTrackDto?.duration;
        delete updateTrackDto?.encoding;
        delete updateTrackDto?.fileSize;
        delete updateTrackDto?.fileType;
        delete updateTrackDto?.iExtractedMetaData;
        delete updateTrackDto?.localFilePath;
        delete updateTrackDto?.mimeType;
        delete updateTrackDto?.originalFileName;
        delete updateTrackDto?.s3OriginalFileMeta;
        delete updateTrackDto?.samplingFrequency;
        delete updateTrackDto?.channel;
        delete updateTrackDto?.company;
        delete updateTrackDto?.owner;
        delete updateTrackDto?.partner;
        request.body = updateTrackDto;
        break;
    }

    return true;
  }
}
