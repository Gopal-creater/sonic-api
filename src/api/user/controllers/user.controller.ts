import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  AddNewLicenseDto,
  AddBulkNewLicensesDto,
  UpdateProfileDto,
  CognitoCreateUserDTO,
  CompanyFindOrCreateUser,
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
  ForbiddenException,
} from '@nestjs/common';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { Roles, SystemGroup } from 'src/constants/Enums';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { User } from '../../auth/decorators';
import { CognitoUserSession } from '../schemas/user.aws.schema';
import { GroupService } from '../../group/group.service';
import { CompanyService } from '../../company/company.service';
import { UserDB } from '../schemas/user.db.schema';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { ConditionalAuthGuard } from '../../auth/guards/conditional-auth.guard';

@ApiTags('User Controller')
@Controller('users')
export class UserController {
  constructor(
    private readonly userServices: UserService,
    private readonly groupService: GroupService,
    private readonly companyService: CompanyService,
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

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @AnyApiQueryTemplate()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'list users' })
  @Get('/list-users')
  async listUsers(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.userServices.listUsers(queryDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @AnyApiQueryTemplate()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all users also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.userServices.getCount(queryDto);
  }

  @Get('/estimate-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all users',
  })
  async getEstimateCount() {
    return this.userServices.getEstimateCount();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'authorize user with their token' })
  @Get('/authorize')
  async checkAuthorization(@User() user: CognitoUserSession) {
    return {
      ok: true,
      user: user,
    };
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
  async getUserProfile(@User() user: UserDB) {
    return user;
  }

  @Post('/company-find-or-create-user')
  @RolesAllowed(Roles.COMPANY_ADMIN)
  @UseGuards(ConditionalAuthGuard, RoleBasedGuard)
  @ApiSecurity('x-api-key')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Company find or create user' })
  async companyFindOrCreateUser(
    @User() loggedInUser: UserDB,
    @Body() companyFindOrCreateUser: CompanyFindOrCreateUser,
  ) {
    const cognitoCreateUser = Object.assign(
      {},
      companyFindOrCreateUser,
      new CognitoCreateUserDTO(),
    );

    const adminCompany = await this.companyService
      .findById(loggedInUser?.adminCompany._id)
      .catch(err => {
        throw new ForbiddenException(
          err.message || 'Autenticated User must be an admin of valid company',
        );
      });
    cognitoCreateUser.company = loggedInUser?.adminCompany._id;

    //Add Default Group for newly created user
    cognitoCreateUser.group = SystemGroup.PORTAL_USER;
    const { email, userName } = cognitoCreateUser;
    //Check if user already present if preseent return existing user orelse create new user
    var userInDb = await this.userServices.findByEmail(email);
    if (userInDb) {
      userInDb = await this.userServices.userCompanyService.addUserToCompany(
        userInDb,
        adminCompany,
      );
    } else {
      const userCreated = await this.userServices.cognitoCreateUser(
        cognitoCreateUser,
      );
      userInDb = userCreated.userDb;
    }
    // const apiKey = await this.userServices.apiKeyService.findOrCreateApiKeyForCompanyUser(userInDb._id,adminCompany._id)

    return {
      user:userInDb,
      // apiKey:apiKey
    };
  }

  @Post('admin-create-user')
  @RolesAllowed(Roles.ADMIN, Roles.THIRDPARTY_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin create user' })
  async cognitoCreateUser(@Body() cognitoCreateUserDto: CognitoCreateUserDTO) {
    if (cognitoCreateUserDto.group) {
      await this.groupService
        .findById(cognitoCreateUserDto.group)
        .catch(err => {
          throw new BadRequestException(err.message || 'Invalid group');
        });
    }
    if (cognitoCreateUserDto.company) {
      await this.companyService
        .findById(cognitoCreateUserDto.company)
        .catch(err => {
          throw new BadRequestException(err.message || 'Invalid company');
        });
    }
    return this.userServices.cognitoCreateUser(cognitoCreateUserDto);
  }

  @Get('sync-with-cognito')
  @RolesAllowed(Roles.ADMIN, Roles.THIRDPARTY_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiQuery({ name: 'user', type: String, required: false })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync user from cognito to our database' })
  async syncUsers(@Query('user') user?: string) {
    if (user) {
      const cognitoUser = await this.userServices
        .getCognitoUser(user)
        .catch(err => {
          throw new NotFoundException('Invalid user');
        });
      if (!cognitoUser)
        throw new NotFoundException('User not found in cognito');
      return this.userServices.syncUserFromCognitoToMongooDb(user);
    }
    return this.userServices.syncUsersFromCognitoToMongooDb();
  }

  @Post('add-monitoring-subscription-from-monitoring-group/:usernameOrSub')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add monitoring Subscription From Monitoring Group',
  })
  async addMonitoringSubscriptionFromMonitoringGroup(
    @Param('usernameOrSub') usernameOrSub: string,
  ) {
    const user = await this.userServices.getUserProfile(usernameOrSub);
    if (!user) {
      throw new NotFoundException('Invalid user');
    }

    return this.userServices.addMonitoringSubscriptionFromMonitoringGroup(
      usernameOrSub,
    );
  }
}
