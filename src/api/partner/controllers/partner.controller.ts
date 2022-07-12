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
  UseGuards,
  Version,
} from '@nestjs/common';
import { PartnerService } from '../services/partner.service';
import { CreatePartnerDto } from '../dto/create-partner.dto';
import { UpdatePartnerDto } from '../dto/update-partner.dto';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ParseQueryValue } from 'src/shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetPartnerSecurityGuard } from '../guards/get-partner-security.guard';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { RolesAllowed } from 'src/api/auth/decorators';
import { Roles, SystemRoles } from 'src/constants/Enums';
import { UpdatePartnerSecurityGuard } from '../guards/update-partner-security.guard';
import { User } from '../../auth/decorators/user.decorator';
import { UserDB } from '../../user/schemas/user.db.schema';

@ApiTags('Partners Controller (D & M May 2022)')
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create partner' })
  async create(
    @User() loggedInUser: UserDB,
    @Body() createPartnerDto: CreatePartnerDto,
  ) {
    if (createPartnerDto.owner) {
      const user = await this.partnerService.userService.getUserProfile(
        createPartnerDto.owner,
      );
      if (!user) throw new NotFoundException('Unknown user');
      const isalreadyOwnPartner = await this.partnerService.findOne({
        owner: createPartnerDto.owner,
      });
      if (isalreadyOwnPartner || user.adminPartner)
        throw new NotFoundException(
          'Given user already own the company, please choose different user',
        );
    }

    return this.partnerService.create({
      ...createPartnerDto,
      createdBy: loggedInUser?._id,
    });
  }

  @ApiOperation({
    summary: 'Get partners',
  })
  @RolesAllowed(Roles.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @Get()
  findAll(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.partnerService.findAll(queryDto);
  }

  @Get('/count')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all partners also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.partnerService.getCount(queryDto);
  }

  @Get('/estimate-count')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all partners',
  })
  async getEstimateCount() {
    return this.partnerService.getEstimateCount();
  }

  @ApiOperation({
    summary: 'Get partner by id',
  })
  @RolesAllowed(Roles.ADMIN, Roles.PARTNER_ADMIN, Roles.PARTNER_USER)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleBasedGuard, GetPartnerSecurityGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.partnerService.findById(id);
  }

  @RolesAllowed(Roles.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @Put(':id/change-partner-admin-user')
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
    @Param('id') partner: string,
    @Body('user') user: string,
    @User() loggedInUser: UserDB,
  ) {
    const userFromDb = await this.partnerService.userService.getUserProfile(
      user,
    );
    if (!userFromDb) throw new NotFoundException('Unknown user');
    if (userFromDb.adminPartner) {
      throw new UnprocessableEntityException(
        'Given user already own the partner, please choose different user as a partner admin',
      );
    }
    const partnerFromDb = await this.partnerService.findById(partner);
    if (!partnerFromDb) throw new NotFoundException('Unknown partner');
    await this.partnerService.makePartnerAdminUser(user, partner);
    return this.partnerService.update(partner, {
      updatedBy: loggedInUser?._id,
    });
  }

  @ApiOperation({
    summary: 'Update partner by id',
  })
  @RolesAllowed(Roles.ADMIN, Roles.PARTNER_ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleBasedGuard, UpdatePartnerSecurityGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @User() loggedInUser: UserDB,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    return this.partnerService.update(id, {
      ...updatePartnerDto,
      updatedBy: loggedInUser?._id,
    });
  }


  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Remove partner' })
  remove(@Param('id') id: string) {
    return this.partnerService.removeById(id);
  }
}
