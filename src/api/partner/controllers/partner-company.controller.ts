import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PartnerService } from '../services/partner.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CompanyService } from '../../company/company.service';
import {
  CreatePartnerCompanyDto,
  UpdatePartnerCompanyDto,
} from '../dto/partnercompany/partner-company';
import { PartnerCompanyService } from '../services/partner-company.service';

@ApiTags('Partners Controller')
@Controller('partners/:partner/companies')
export class PartnerCompanyController {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly companyService: CompanyService,
    private readonly partnerCompanyService: PartnerCompanyService,
  ) {}

  @Put('/create-new-company')
  @ApiOperation({ summary: 'Create new company under given partner' })
  async createNewCompany(
    @Param('partner') partner: string,
    @Body() createPartnerCompanyDto: CreatePartnerCompanyDto,
  ) {
    const { owner } = createPartnerCompanyDto;
    const userFromDb = await this.partnerService.userService.getUserProfile(
      owner,
    );
    if (!userFromDb) throw new NotFoundException('Unknown user');
    if (userFromDb.adminCompany) {
      throw new UnprocessableEntityException(
        'Given user already own the company, please choose different user as a company admin',
      );
    }
    const partnerFromDb = await this.partnerService.findById(partner);
    if (!partnerFromDb) throw new NotFoundException('Unknown partner');

    return this.companyService.create({
      ...createPartnerCompanyDto,
      partner: partner,
    });
  }

  @Put('/:company/update-company')
  @ApiOperation({
    summary: 'Update company details under given partner',
  })
  async updateCompany(
    @Param('partner') partner: string,
    @Param('company') company: string,
    @Body() updatePartnerCompanyDto: UpdatePartnerCompanyDto,
  ) {
    const partnerFromDb = await this.partnerService.findById(partner);
    if (!partnerFromDb) throw new NotFoundException('Unknown partner');

    const companyFromDb = await this.companyService.findOne({
      _id: company,
      partner: partner,
    });
    if (!companyFromDb) throw new NotFoundException('Unknown company');

    return this.companyService.companyModel.findByIdAndUpdate(
      company,
      {
        ...updatePartnerCompanyDto,
      },
      { new: true },
    );
  }

  @Put('/:company/change-company-admin-user')
  @ApiOperation({ summary: 'Change admin user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: { type: 'string' },
      },
    },
  })
  async changeAdminUser(
    @Param('partner') partner: string,
    @Param('company') company: string,
    @Body('user') user: string,
  ) {
    const partnerFromDb = await this.partnerService.findById(partner);
    if (!partnerFromDb) throw new NotFoundException('Unknown partner');

    const companyFromDb = await this.companyService.findOne({
      _id: company,
      partner: partner,
    });
    if (!companyFromDb) throw new NotFoundException('Unknown company');

    return this.companyService.makeCompanyAdminUser(company,user)
  }

  @Put('/:company/disable-company')
  @ApiOperation({
    summary: 'Disable company',
  })
  async disableCompany(
    @Param('partner') partner: string,
    @Param('company') company: string,
  ) {
    const partnerFromDb = await this.partnerService.findById(partner);
    if (!partnerFromDb) throw new NotFoundException('Unknown partner');

    const companyFromDb = await this.companyService.findOne({
      _id: company,
      partner: partner,
    });
    if (!companyFromDb) throw new NotFoundException('Unknown company');

    return this.companyService.companyModel.findByIdAndUpdate(
      company,
      {
        enabled:false,
      },
      { new: true },
    );
  }

  @Put('/:company/enable-company')
  @ApiOperation({
    summary: 'Enable Company',
  })
  async enableCompany(
    @Param('partner') partner: string,
    @Param('company') company: string,
  ) {
    const partnerFromDb = await this.partnerService.findById(partner);
    if (!partnerFromDb) throw new NotFoundException('Unknown partner');

    const companyFromDb = await this.companyService.findOne({
      _id: company,
      partner: partner,
    });
    if (!companyFromDb) throw new NotFoundException('Unknown company');

    return this.companyService.companyModel.findByIdAndUpdate(
      company,
      {
        enabled:true,
      },
      { new: true },
    );
  }
}
