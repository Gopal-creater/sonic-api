import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  AddNewLicenseDto,
  AddBulkNewLicensesDto,
  UpdateProfileDto,
} from './dtos/index';
import { UserService } from './user.service';
import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Body,
  Query,
  BadRequestException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ParseQueryValue } from '../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { LicensekeyService } from '../licensekey/licensekey.service';


@ApiTags('User Controller')
@Controller('users')
export class UserController {
  constructor(private readonly userServices: UserService,private readonly licensekeyService: LicensekeyService,) {}

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all licenses of particular user' })
  @Get('/:userId/licenses')
  async getUserLicenses(
    @Param('userId') userId: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    queryDto.filter["owners.ownerId"]=userId
    return this.licensekeyService.findAll(queryDto)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add Single License Key' })
  @Post('/:userId/add-new-license')
  async addNewLicense(
    @Param('userId') userId: string,
    @Body() addNewLicenseDto: AddNewLicenseDto,
  ) {
    return this.userServices
      .addNewLicense(addNewLicenseDto.licenseKey, userId)
      .catch(err => {
        if (err.status == 404) {
          throw new NotFoundException(err.message);
        }
        throw err;
      });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add Bulk License Keys' })
  @Post('/:userId/add-new-licenses')
  async addBulkNewLicense(
    @Param('userId') userId: string,
    @Body() addBulkNewLicensesDto: AddBulkNewLicensesDto,
  ) {
    return this.userServices.addBulkNewLicenses(
      addBulkNewLicensesDto.licenseKeys,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get User profile by username' })
  @Get('/:username/profile')
  async getUserProfile(@Param('username') username: string) {
    return this.userServices.getUserProfile(username);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile by username' })
  @Post('/:username/update-profile')
  async updateProfile(
    @Param('username') username: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedAttributes = updateProfileDto.attributes;
    return this.userServices.updateUserWithCustomField(
      username,
      updatedAttributes,
    );
  }
}
