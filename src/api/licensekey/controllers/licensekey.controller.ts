import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LicensekeyService } from '../services/licensekey.service';
import {
  AdminUpdateLicensekeyDto,
  CreateLicensekeyDto,
} from '../dto/create-licensekey.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { User } from 'src/api/auth/decorators';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { ApiKeyType, Roles } from 'src/constants/Enums';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import * as _ from 'lodash';
import { LicenseKey } from '../schemas/licensekey.schema';
import { UserDB } from '../../user/schemas/user.db.schema';
import { CreateLicenseSecurityGuard } from '../guards/create-license-security.guard';
import { UpdateLicenseSecurityGuard } from '../guards/update-license-security.guard';
import { DeleteLicenseSecurityGuard } from '../guards/delete-license-security.guard';
import { AddUserToLicense } from '../dto/update-licensekey.dto';
import { AddUserToLicenseSecurityGuard } from '../guards/adduserto-license-security.guard copy';
import { GetOneLicenseSecurityGuard } from '../guards/getone-license-security.guard';

@ApiTags('License Keys Management Controller (D & M)')
@Controller('license-keys')
export class LicensekeyController {
  constructor(private readonly licensekeyService: LicensekeyService) {}

  @Post()
  @RolesAllowed(
    Roles.ADMIN,
    Roles.THIRDPARTY_ADMIN,
    Roles.PARTNER_ADMIN,
    Roles.COMPANY_ADMIN,
  )
  @UseGuards(JwtAuthGuard, RoleBasedGuard, CreateLicenseSecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create License Key' })
  async create(
    @Body() createLicensekeyDto: CreateLicensekeyDto,
    @User() loggedInUser: UserDB,
  ) {
    const doc: Partial<LicenseKey> = {
      ...createLicensekeyDto,
      createdBy: loggedInUser?.sub,
    };

    if (createLicensekeyDto.type == ApiKeyType.INDIVIDUAL) {
      const user = await this.licensekeyService.userService.getUserProfile(
        createLicensekeyDto.user,
      );
      if (!user) throw new NotFoundException('Unknown user');
      doc.users = [createLicensekeyDto.user];
    } else if (createLicensekeyDto.type == ApiKeyType.COMPANY) {
      const company = await this.licensekeyService.companyService.findById(
        createLicensekeyDto.company,
      );
      if (!company) throw new NotFoundException('Unknown company');
      if (createLicensekeyDto.user) {
        const user = await this.licensekeyService.userService.getUserProfile(
          createLicensekeyDto.user,
        );
        if (!user) throw new NotFoundException('Unknown user');
        doc.users = [createLicensekeyDto.user];
      }
    }
    return this.licensekeyService.create(doc);
  }

  @Get()
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All LicenseKeys' })
  findAll(@Query(new ParseQueryValue()) queryDto?: ParsedQueryDto) {
    return this.licensekeyService.findAll(queryDto);
  }

  @Get('/count')
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @AnyApiQueryTemplate()
  @ApiQuery({ name: 'includeGroupData', type: Boolean, required: false })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all licenskeys also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.licensekeyService.getCount(queryDto);
  }

  @Get('/estimate-count')
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all licenskeys',
  })
  async getEstimateCount() {
    return this.licensekeyService.getEstimateCount();
  }

  @Get(':id')
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard,GetOneLicenseSecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single License key' })
  async findOne(@Param('id') id: string) {
    const licenseKey = await this.licensekeyService.licenseKeyModel.findById(
      id,
    );
    if (!licenseKey) {
      throw new NotFoundException();
    }
    return licenseKey;
  }

  @Put(':id')
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard, UpdateLicenseSecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Single License key' })
  async update(
    @Param('id') id: string,
    @Body() updateLicensekeyDto: AdminUpdateLicensekeyDto,
    @User('sub') updatedBy: string,
  ) {
    const licenseKey = await this.licensekeyService.findById(id);
    if (!licenseKey) {
      throw new NotFoundException();
    }
    const updatedKey = await this.licensekeyService.update(id, {
      ...updateLicensekeyDto,
      updatedBy: updatedBy,
    });
    return updatedKey;
  }

  @Put(':id/add-new-user')
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard, AddUserToLicenseSecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add new user to license key' })
  async addNewUser(
    @Param('id') id: string,
    @Body() addUserToLicense: AddUserToLicense,
    @User('sub') updatedBy: string,
  ) {
    const { user } = addUserToLicense;
    const licenseKey = await this.licensekeyService.findById(id);
    if (!licenseKey) {
      throw new NotFoundException('Licensekey not found');
    }
    if (licenseKey.type==ApiKeyType.INDIVIDUAL && licenseKey.users.length>0) {
      throw new UnprocessableEntityException('Can not add user to individual license type');
    }
    const userformdb = await this.licensekeyService.userService.findById(user);
    if (!userformdb) {
      throw new NotFoundException('User not found');
    }
    const updatedKey = await this.licensekeyService.update(id, {
      $addToSet: {
        users: { $each: [user] },
      },
      updatedBy: updatedBy,
    });
    return updatedKey;
  }

  @Put(':id/remove-user')
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard, AddUserToLicenseSecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove user from license key' })
  async removeUser(
    @Param('id') id: string,
    @Body() addUserToLicense: AddUserToLicense,
    @User('sub') updatedBy: string,
  ) {
    const { user } = addUserToLicense;
    const licenseKey = await this.licensekeyService.findById(id);
    if (!licenseKey) {
      throw new NotFoundException('Licensekey not found');
    }
    const userformdb = await this.licensekeyService.userService.findById(user);
    if (!userformdb) {
      throw new NotFoundException('User not found');
    }
    const updatedKey = await this.licensekeyService.update(id, {
      $pull: {
        users: user,
      },
      updatedBy: updatedBy,
    });
    return updatedKey;
  }

  @Delete(':id')
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard, DeleteLicenseSecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete License key' })
  async remove(@Param('id') id: string) {
    const licenseKey = await this.licensekeyService.findById(id);
    if (!licenseKey) {
      throw new NotFoundException();
    }
    return this.licensekeyService.licenseKeyModel.findByIdAndRemove(id);
  }
}
