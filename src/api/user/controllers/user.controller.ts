import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
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
  AdminCreateUserDTO,
} from '../dtos/index';
import { UserService } from '../services/user.service';
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
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { Roles } from 'src/constants/Enums';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { User } from '../../auth/decorators';
import { CognitoUserSession } from '../schemas/user.aws.schema';

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
  @ApiOperation({ summary: 'authorize user with their token' })
  @Get('/authorize')
  async checkAuthorization(@User() user:CognitoUserSession) {
    return {
      ok:true,
      user:user
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add Single License Key' })
  @Post('/:userIdOrUsername/add-new-license')
  async addNewLicense(
    @Param('userIdOrUsername') userIdOrUsername: string,
    @Body() addNewLicenseDto: AddNewLicenseDto,
  ) {
    return this.userServices
      .addNewLicense(addNewLicenseDto.licenseKey, userIdOrUsername)
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
  @Post('/:userIdOrUsername/add-new-licenses')
  async addBulkNewLicense(
    @Param('userIdOrUsername') userIdOrUsername: string,
    @Body() addBulkNewLicensesDto: AddBulkNewLicensesDto,
  ) {
    return this.userServices.addBulkNewLicenses(
      addBulkNewLicensesDto.licenseKeys,
      userIdOrUsername,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get User profile by username or sub id' })
  @Get('/:username/profile')
  async getUserProfile(@Param('username') username: string) {
    const profile = await this.userServices.getUserProfile(username)
    if(!profile){
      throw new NotFoundException("User not found");
    }
    return profile
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
    return this.userServices.adminListGroupsForUser(username);
  }



  @Post('admin-create-user')
  @RolesAllowed(Roles.ADMIN,Roles.THIRDPARTY_ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin create user' })
  async adminCreateUser(@Body() adminCreateUserDTO: AdminCreateUserDTO) {
    if(adminCreateUserDTO.group){
      await this.userServices.getGroup(adminCreateUserDTO.group)
      .catch(err=>{
        throw new BadRequestException(err.message||"Invalid group")
      })
    }
    return this.userServices.adminCreateUser(adminCreateUserDTO);
  }

  @Post('add-monitoring-subscription-from-monitoring-group/:usernameOrSub')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add monitoring Subscription From Monitoring Group' })
  async addMonitoringSubscriptionFromMonitoringGroup(@Param('usernameOrSub') usernameOrSub: string) {
     const user =  await this.userServices.getUserProfile(usernameOrSub)
     if(!user){
      throw new NotFoundException("Invalid user")
     }
     
    return this.userServices.addMonitoringSubscriptionFromMonitoringGroup(usernameOrSub);
  }
}
