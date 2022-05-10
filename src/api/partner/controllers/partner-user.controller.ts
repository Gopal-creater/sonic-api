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
import { PartnerUserService } from '../services/partner-user.service';
import {
  CreatePartnerUserDto,
  EditPartnerUserDto,
} from '../dto/partneruser/partner-user';
import { SystemRoles } from 'src/constants/Enums';
import { CompanyService } from '../../company/company.service';

@ApiTags('Partners Controller')
@Controller('partners/:partner/users')
export class PartnerUserController {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly companyService: CompanyService,
    private readonly partnerUserService: PartnerUserService,
  ) {}

  @Put('/change-admin-user')
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
    @Body('user') user: string,
  ) {
    const userFromDb = await this.partnerService.userService.getUserProfile(
      user,
    );
    if (!userFromDb) throw new NotFoundException('Unknown user');
    if (userFromDb.adminPartner) {
      throw new UnprocessableEntityException(
        'Given user already own the partner, please choose different user as a partner',
      );
    }
    const partnerFromDb = await this.partnerService.findById(partner);
    if (!partnerFromDb) throw new NotFoundException('Unknown partner');
    return this.partnerUserService.changeAdminUser(user, partner);
  }

  @Post('/create-partner-user')
  @ApiOperation({
    summary:
      'Create partner user can also be company user id company field is present',
  })
  async createUser(
    @Param('partner') partner: string,
    @Body() createPartnerUserDto: CreatePartnerUserDto,
  ) {
    const { company, email, userName } = createPartnerUserDto;
    const userFromDb = await this.partnerService.userService.findOne({
      $or: [{ email: email }, { username: userName }],
    });
    if (userFromDb)
      throw new UnprocessableEntityException(
        'User with given email or username already exists',
      );
    const partnerFromDb = await this.partnerService.findById(partner);
    if (!partnerFromDb) throw new NotFoundException('Unknown partner');

    if (company) {
      //If Account type is Company User
      const companyFromDb = await this.companyService.findOne({
        _id: company,
        partner: partner,
      });
      if (!companyFromDb) throw new NotFoundException('Unknown company');
      return this.partnerUserService.userService.createUserInCognito(
        createPartnerUserDto,
        true,
        {
          userRole: SystemRoles.COMPANY,
          company: company,
        },
      );
    } else {
      //If Account type is Partner User
      return await this.partnerUserService.userService.createUserInCognito(
        createPartnerUserDto,
        true,
        {
          userRole: SystemRoles.PARTNER,
          partner: partner,
        },
      );
    }
  }

  @Put('/update-partner-user/:usernameOrSub')
  @ApiOperation({ summary: 'Update partner user' })
  async updatePartnerUser(
    @Param('partner') partner: string,
    @Param('usernameOrSub') usernameOrSub: string,
    @Body() editPartnerUserDto: EditPartnerUserDto,
  ) {
    const userFromDb = await this.partnerService.userService.getUserProfile(
      usernameOrSub,
    );
    if (!userFromDb) throw new NotFoundException('User not found');
    const partnerFromDb = await this.partnerService.findById(partner);
    if (!partnerFromDb) throw new NotFoundException('Unknown partner');
    const updatedUser = await this.partnerService.userService.userModel.findByIdAndUpdate(
      userFromDb._id,
      {
        ...editPartnerUserDto,
      },
      { new: true },
    );
    return updatedUser;
  }

  @Put('/disable-user/:usernameOrSub')
  @ApiOperation({ summary: 'Disable partner user' })
  async disablePartnerUser(
    @Param('partner') partner: string,
    @Param('usernameOrSub') usernameOrSub: string,
  ) {
    const userFromDb = await this.partnerService.userService.getUserProfile(
      usernameOrSub,
    );
    if (!userFromDb) throw new NotFoundException('User not found');
    const partnerFromDb = await this.partnerService.findById(partner);
    if (!partnerFromDb) throw new NotFoundException('Unknown partner');
    await this.partnerService.userService.adminDisableUser(userFromDb.username);
    const updatedUser = await this.partnerService.userService.userModel.findByIdAndUpdate(
      userFromDb._id,
      {
        enabled: false,
      },
      { new: true },
    );
    return updatedUser;
  }

  @Put('/enable-user/:usernameOrSub')
  @ApiOperation({ summary: 'Disable partner user' })
  async enablePartnerUser(
    @Param('partner') partner: string,
    @Param('usernameOrSub') usernameOrSub: string,
  ) {
    const userFromDb = await this.partnerService.userService.getUserProfile(
      usernameOrSub,
    );
    if (!userFromDb) throw new NotFoundException('User not found');
    const partnerFromDb = await this.partnerService.findById(partner);
    if (!partnerFromDb) throw new NotFoundException('Unknown partner');
    await this.partnerService.userService.adminEnableUser(userFromDb.username);
    const updatedUser = await this.partnerService.userService.userModel.findByIdAndUpdate(
      userFromDb._id,
      {
        enabled: true,
      },
      { new: true },
    );
    return updatedUser;
  }
}
