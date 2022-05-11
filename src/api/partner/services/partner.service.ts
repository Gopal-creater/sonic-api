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
    //Make this user as admin user for this partner
    if (createPartnerDto.owner) {
      await this.userService.userModel.findByIdAndUpdate(
        createPartnerDto.owner,
        {
          userRole: SystemRoles.PARTNER_ADMIN,
          adminPartner: createdPartner._id,
          partner: createdPartner._id,
        },
      );
    }
    return createdPartner
  }

  async makePartnerAdminUser(user: string, partner: string) {
    const partnerFromDb = await this.partnerModel.findById(partner);
    await this.partnerModel.findByIdAndUpdate(
      partner,
      {
        owner: user,
      },
      {
        new: true,
      },
    );
    await this.userService.userModel.findByIdAndUpdate(user, {
      userRole: SystemRoles.PARTNER_ADMIN,
      adminPartner: partner,
      partner: partner,
    });
    if (partnerFromDb.owner) {
      //Remove ownership of old user
      await this.userService.userModel.findByIdAndUpdate(partnerFromDb.owner, {
        userRole: SystemRoles.PARTNER,
        adminPartner: null,
      });
    }
    return this.partnerModel.findById(partner);
  }

  findAll(queryDto: ParsedQueryDto) {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          createdAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
    ];
    const aggregate = this.partnerModel.aggregate(aggregateArray);
    return this.partnerModel['aggregatePaginate'](aggregate, paginateOptions);
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
