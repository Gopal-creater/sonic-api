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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LicensekeyService } from '../services/licensekey.service';
import { AdminUpdateLicensekeyDto, CreateLicensekeyDto } from '../dto/create-licensekey.dto';
import { UpdateLicensekeyDto } from '../dto/update-licensekey.dto';
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
import { FailedAlwaysGuard } from '../../auth/guards/failedAlways.guard';
import * as _ from 'lodash';

@ApiTags('License Keys Management Controller')
@Controller('license-keys')
export class LicensekeyController {
  constructor(private readonly licensekeyService: LicensekeyService) {}

  @Get('/convert-owners-to-users')
  // @UseGuards(FailedAlwaysGuard)
  // @ApiBearerAuth()
 async migrate() {
  //  var licenses = await this.licensekeyService.licenseKeyModel.find()
  // console.log("licenses length",licenses.length)
  //  for await (var license of licenses) {
  //   license = license.depopulate('users')
  //    const users = license.owners.map(o=>o?.ownerId?._id).filter(Boolean)
  //    console.log("users",users)
  //    var newUsers = license.users||[]
  //    newUsers.push(...users)
  //    newUsers=_.uniq(newUsers)
  //    await this.licensekeyService.licenseKeyModel.findByIdAndUpdate(license._id,{users:newUsers})
  //  }
  // await this.licensekeyService.licenseKeyModel.updateMany({},{type:ApiKeyType.INDIVIDUAL})
   return "Disabled"
  }

  @Post()
  @RolesAllowed(Roles.ADMIN,Roles.THIRDPARTY_ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create License Key' })
  async create(
    @Body() createLicensekeyDto: CreateLicensekeyDto,
    @User('sub') createdBy: string,
  ) {
    if (createLicensekeyDto.type == ApiKeyType.INDIVIDUAL) {
      const user = await this.licensekeyService.userService.getUserProfile(
        createLicensekeyDto.user,
      );
      if (!user) throw new NotFoundException('Unknown user');
      createLicensekeyDto.user = user?.sub;
      delete createLicensekeyDto.company
    } else if (createLicensekeyDto.type == ApiKeyType.COMPANY) {
      const company = await this.licensekeyService.companyService.findById(
        createLicensekeyDto.company,
      );
      if (!company) throw new NotFoundException('Unknown company');
      if (!company?.owner?.sub)
        throw new NotFoundException(
          'The given company doesnot have any valid admin user',
        );
        createLicensekeyDto.user = company.owner.sub
    }
    return this.licensekeyService.create(createLicensekeyDto, createdBy);
  }

  @Get()
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All LicenseJKeys' })
  findAll(@Query(new ParseQueryValue()) queryDto?: ParsedQueryDto) {
    return this.licensekeyService.findAll(queryDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all licenskeys',
  })
  async getEstimateCount() {
    return this.licensekeyService.getEstimateCount();
  }
  

  @Get(':id')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
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
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Single License key' })
  async update(
    @Param('id') id: string,
    @Body() updateLicensekeyDto: AdminUpdateLicensekeyDto,
    @User('sub') updatedBy: string,
  ) {
    const updatedKey = await this.licensekeyService.licenseKeyModel.findOneAndUpdate(
      { _id: id },
      { ...updateLicensekeyDto, updatedBy: updatedBy },
      { new: true },
    );
    if (!updatedKey) {
      throw new NotFoundException();
    }
    return updatedKey;
  }

  @Delete(':id')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete License key' })
  remove(@Param('id') id: string) {
    return this.licensekeyService.licenseKeyModel.findByIdAndRemove(id);
  }
}
