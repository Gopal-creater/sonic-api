import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Partner } from '../schemas/partner.schema';
import { Model } from 'mongoose';
import { UserService } from '../../user/services/user.service';
import { SystemRoles } from 'src/constants/Enums';
import { CreatePartnerUserDto } from '../dto/partneruser/partner-user';
import { CompanyService } from '../../company/company.service';
import { CreatePartnerCompanyDto } from '../dto/partnercompany/partner-company';

@Injectable()
export class PartnerCompanyService {
  constructor(
    @InjectModel(Partner.name)
    public readonly partnerModel: Model<Partner>,

    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,

    @Inject(forwardRef(() => CompanyService))
    public readonly companyService: CompanyService,
  ) {}

}
