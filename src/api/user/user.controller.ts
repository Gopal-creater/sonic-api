import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
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
import { LicensekeyService } from '../licensekey/services/licensekey.service';

@ApiTags('User Controller')
@Controller('users')
export class UserController {
  constructor(
    private readonly userServices: UserService,
    private readonly licensekeyService: LicensekeyService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all licenses of particular user' })
  @Get('/:userId/licenses')
  async getUserLicenses(
    @Param('userId') userId: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    queryDto.filter['owners.ownerId'] = userId;
    return this.licensekeyService.findAll(queryDto);
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
  @ApiOkResponse({
    description: `
  <b>Response Example from <a href="https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminGetUser.html" target="_blank">Cognito GetUser</a> </b>
  <pre>
  {
    "Enabled": boolean,
    "MFAOptions": [ 
       { 
          "AttributeName": "string",
          "DeliveryMedium": "string"
       }
    ],
    "PreferredMfaSetting": "string",
    "UserAttributes": [ 
       { 
          "Name": "string",
          "Value": "string"
       }
    ],
    "UserCreateDate": number,
    "UserLastModifiedDate": number,
    "UserMFASettingList": [ "string" ],
    "Username": "string",
    "UserStatus": "string"
 }
 </pre>
 <b>UserAttributes Will Contains</b>
 <pre>
 {
  sub: string,
  'cognito:groups'?: string[],
  email_verified?: boolean,
  phone_number_verified?: boolean,
  phone_number?: string,
  email: string
 }
 </pre>
  `,
  })
  @ApiOperation({ summary: 'Get User profile by username or sub id' })
  @Get('/:username/profile')
  async getUserProfile(@Param('username') username: string) {
    return this.userServices.getUserProfile(username);
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOkResponse({
    description: `
  <b>Response Example from <a href="https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminListGroupsForUser.html" target="_blank">Cognito AdminListGroupsForUser</a> </b>
  <pre>
  {
    "Groups": [ 
       { 
          "CreationDate": number,
          "Description": "string",
          "GroupName": "string",
          "LastModifiedDate": number,
          "Precedence": number,
          "RoleArn": "string",
          "UserPoolId": "string"
       }
    ],
    "NextToken": "string"
 }
 </pre>
  `,
  })
  @ApiOperation({ summary: 'Get User groups by username or sub id' })
  @Get('/:username/groups')
  async getGroupsOfUser(@Param('username') username: string) {
    return this.userServices.getGroupsForUser(username);
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Update user profile by username' })
  // @Post('/:username/update-profile')
  // async updateProfile(
  //   @Param('username') username: string,
  //   @Body() updateProfileDto: UpdateProfileDto,
  // ) {
  //   const updatedAttributes = updateProfileDto.attributes;
  //   return this.userServices.updateUserWithCustomField(
  //     username,
  //     updatedAttributes,
  //   );
  // }
}
