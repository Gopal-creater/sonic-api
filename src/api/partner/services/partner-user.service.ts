import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Partner } from '../schemas/partner.schema';
import { Model } from 'mongoose';
import { UserService } from '../../user/services/user.service';
import { SystemRoles } from 'src/constants/Enums';
import { CreatePartnerUserDto } from '../dto/partneruser/partner-user';

@Injectable()
export class PartnerUserService {
  constructor(
    @InjectModel(Partner.name)
    public readonly partnerModel: Model<Partner>,

    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,
  ) {}

}
