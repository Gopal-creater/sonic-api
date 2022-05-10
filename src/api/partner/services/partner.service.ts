import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CreatePartnerDto } from '../dto/create-partner.dto';
import { UpdatePartnerDto } from '../dto/update-partner.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Partner } from '../schemas/partner.schema';
import { Model, FilterQuery } from 'mongoose';
import { UserService } from '../../user/services/user.service';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { SystemRoles } from 'src/constants/Enums';

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner.name)
    public readonly partnerModel: Model<Partner>,

    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,
  ) {}
  async create(createPartnerDto: CreatePartnerDto) {
    const newPartner = await this.partnerModel.create(createPartnerDto);
    const createdPartner = await newPartner.save();
    if (createPartnerDto.owner) {//Make this user as admin user
      await this.userService.userModel.findByIdAndUpdate(
        createPartnerDto.owner,
        {
          userRole: SystemRoles.PARTNER_ADMIN,
          adminPartner: createdPartner._id,
          partner: createdPartner._id,
        },
      );
    }
  }

  findAll() {
    return this.partnerModel.find();
  }

  findOne(filter: FilterQuery<Partner>) {
    return this.partnerModel.findOne(filter);
  }

  findById(id: string) {
    return this.partnerModel.findById(id);
  }

  update(id: string, updatePartnerDto: UpdatePartnerDto) {
    return this.partnerModel.findByIdAndUpdate(id, updatePartnerDto, {
      new: true,
    });
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    return this.partnerModel.find(filter || {}).count();
  }

  async getEstimateCount() {
    return this.partnerModel.estimatedDocumentCount();
  }

  async removeById(id: string) {
    const deletedPartner = await this.partnerModel.findByIdAndRemove(id);
    return deletedPartner;
  }
}
