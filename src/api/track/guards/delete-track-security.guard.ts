import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SystemRoles } from 'src/constants/Enums';
import { TrackService } from '../track.service';
import { UserDB } from '../../user/schemas/user.db.schema';

@Injectable()
export class DeleteTrackSecurityGuard implements CanActivate {
  constructor(
    private readonly trackService: TrackService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const loggedInUser = request?.user as UserDB;
    const trackId = request?.param?.id;
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
        break;
    }

    return true;
  }
}
