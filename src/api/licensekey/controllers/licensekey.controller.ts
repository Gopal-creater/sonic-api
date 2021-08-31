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
import { Roles } from 'src/constants/Enums';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { FailedAlwaysGuard } from '../../auth/guards/failedAlways.guard';

@ApiTags('License Keys Management Controller')
@Controller('license-keys')
export class LicensekeyController {
  constructor(private readonly licensekeyService: LicensekeyService) {}

  @Get('/migrate-from-keygen')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard,FailedAlwaysGuard)
  @ApiBearerAuth()
  migrate() {
    return this.licensekeyService.migrateKeyFromKeygenToDB();
  }

  @Post()
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create License Key' })
  create(
    @Body() createLicensekeyDto: CreateLicensekeyDto,
    @User('sub') createdBy: string,
  ) {
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
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all license-keys also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    const filter = queryDto.filter || {};
    return this.licensekeyService.licenseKeyModel
      .where(filter)
      .countDocuments();
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
