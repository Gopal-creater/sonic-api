import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Partner } from '../schemas/partner.schema';
import { Model } from 'mongoose';
import { UserService } from '../../user/services/user.service';
import { AccountTypes } from 'src/constants/Enums';
import { CreatePartnerUserDto } from '../dto/partneruser/partner-user';

@Injectable()
export class PartnerUserService {
  constructor(
    @InjectModel(Partner.name)
    public readonly partnerModel: Model<Partner>,

    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,
  ) {}
  async changeAdminUser(user: string, partner: string) {
    const partnerFromDb = await this.partnerModel.findById(partner);
    const updatedPartner = await this.partnerModel.findByIdAndUpdate(
      partner,
      {
        owner: user,
      },
      {
        new: true,
      },
    );
    await this.userService.userModel.findByIdAndUpdate(user, {
      accountType: AccountTypes.PARTNER_ADMIN,
      adminPartner: partner,
      partner: partner,
    });
    if (partnerFromDb.owner) {
      //Remove ownership of old user
      await this.userService.userModel.findByIdAndUpdate(partnerFromDb.owner, {
        accountType: AccountTypes.PARTNER,
        adminPartner: null,
      });
    }
    return updatedPartner;
  }

  async createPartnerUser(createPartnerUserDto:CreatePartnerUserDto){

  }


}
