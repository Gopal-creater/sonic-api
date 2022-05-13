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
import * as _ from 'lodash';
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
  UnprocessableEntityException,
  Delete,
} from '@nestjs/common';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { Roles, SystemGroup, SystemRoles } from 'src/constants/Enums';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { User } from '../../auth/decorators';
import { CognitoUserSession } from '../schemas/user.aws.schema';
import { GroupService } from '../../group/group.service';
import { CompanyService } from '../../company/company.service';
import { UserDB } from '../schemas/user.db.schema';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { ConditionalAuthGuard } from '../../auth/guards/conditional-auth.guard';
import { ValidationTestDto, CreateUserDto } from '../dtos/create-user.dto';
import { toObjectId } from 'src/shared/utils/mongoose.utils';
import { PartnerService } from '../../partner/services/partner.service';
import { FailedAlwaysGuard } from '../../auth/guards/failedAlways.guard';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UpdateUserSecurityGuard } from '../guards/update-user-security.guard';
import { CreateUserSecurityGuard } from '../guards/create-user-security.guard';
import { EnableDisableUserSecurityGuard } from '../guards/enabledisable-user-security.guard';

@ApiTags('User Controller')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService,
    private readonly companyService: CompanyService,
    private readonly partnerService: PartnerService,
    private readonly licensekeyService: LicensekeyService,
  ) {}

  @RolesAllowed(Roles.ADMIN, Roles.PARTNER_ADMIN, Roles.COMPANY_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard, CreateUserSecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create user' })
  @Post()
  async create(
    @User() loggedInUser: UserDB,
    @Body() createUserDto: CreateUserDto,
  ) {
    var { company, partner, userName, email } = createUserDto;
    const userFromDb = await this.userService.findOne({
      $or: [{ email: email }, { username: userName }],
    });
    if (userFromDb) {
      throw new UnprocessableEntityException(
        'User with given email or username already exists',
      );
    }

    if (partner) {
      const partnerFromDb = await this.partnerService.findById(partner);
      if (!partnerFromDb) throw new NotFoundException('Unknown partner');
    }
    if (company) {
      const companyFormDb = await this.companyService.findById(company);
      if (!companyFormDb) throw new NotFoundException('Unknown company');
    }
    const createdUser = await this.userService.createUserInCognito(
      createUserDto,
      true,
    );
    await this.userService.update(createdUser?.userDb?._id, {
      createdBy: loggedInUser?._id,
    });
    return createdUser;
  }
  @ApiOperation({
    summary: 'Get users',
  })
  @RolesAllowed(Roles.ADMIN, Roles.PARTNER_ADMIN, Roles.COMPANY_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @Get()
  findAll(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.userService.listUsers(queryDto);
  }

  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @Get(':id')
  async findById(@Param('id') userId: string) {
    const user = await this.userService.getUserProfile(userId);
    if (!user) {
      return new NotFoundException();
    }
    return user;
  }

  @Put(':id/disable-user')
  @RolesAllowed(Roles.ADMIN, Roles.COMPANY_ADMIN, Roles.PARTNER_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard, EnableDisableUserSecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable user' })
  async disableUser(@User() loggedInUser: UserDB, @Param('id') userId: string) {
    const userFromDb = await this.partnerService.userService.getUserProfile(
      userId,
    );
    if (!userFromDb) throw new NotFoundException('User not found');
    await this.userService.adminDisableUser(userFromDb.username);
    const updatedUser = await this.userService.userModel.findByIdAndUpdate(
      userFromDb._id,
      {
        enabled: false,
        updatedBy: loggedInUser?._id,
      },
      { new: true },
    );
    return updatedUser;
  }

  @Put(':id/enable-user')
  @RolesAllowed(Roles.ADMIN, Roles.COMPANY_ADMIN, Roles.PARTNER_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard, EnableDisableUserSecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable user' })
  async enableUser(@User() loggedInUser: UserDB, @Param('id') userId: string) {
    const userFromDb = await this.partnerService.userService.getUserProfile(
      userId,
    );
    if (!userFromDb) throw new NotFoundException('User not found');
    await this.userService.adminEnableUser(userFromDb.username);
    const updatedUser = await this.userService.userModel.findByIdAndUpdate(
      userFromDb._id,
      {
        enabled: true,
        updatedBy: loggedInUser?._id,
      },
      { new: true },
    );
    return updatedUser;
  }

  @Put(':id')
  @RolesAllowed(Roles.ADMIN, Roles.COMPANY_ADMIN, Roles.PARTNER_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard, UpdateUserSecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  async update(
    @Param('id') id: string,
    @User() loggedInUser: UserDB,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    var { company, partner } = updateUserDto;
    if (partner) {
      const partnerFromDb = await this.partnerService.findById(partner);
      if (!partnerFromDb) throw new NotFoundException('Unknown partner');
    }
    if (company) {
      const companyFormDb = await this.companyService.findById(company);
      if (!companyFormDb) throw new NotFoundException('Unknown company');
    }
    return this.userService.update(id, {
      ...updateUserDto,
      updatedBy: loggedInUser?._id,
    });
  }

  @Delete(':id')
  @RolesAllowed(Roles.ADMIN, Roles.PARTNER_ADMIN, Roles.COMPANY_ADMIN)
  @UseGuards(FailedAlwaysGuard, JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove user' })
  async remove(@Param('id') id: string) {
    const deletedUser = await this.userService.removeById(id);
    if (!deletedUser) {
      return new NotFoundException();
    }
    return deletedUser;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all licenses of particular user or his belongs to companies',
  })
  @ApiQuery({ name: 'includeCompanies', type: Boolean, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('/:userId/licenses')
  async getUserLicenses(
    @Param('userId') userId: string,
    @User() user: UserDB,
    @Query(new ParseQueryValue()) parsedQueryDto?: ParsedQueryDto,
  ) {
    var includeCompanies = parsedQueryDto.filter['includeCompanies'] as boolean;
    delete parsedQueryDto.filter['includeCompanies'];
    if (includeCompanies == false) {
      parsedQueryDto.filter = _.merge({}, parsedQueryDto.filter, {
        users: user._id,
      });
    } else {
      const userCompaniesIds = user.companies.map(com => toObjectId(com._id));
      parsedQueryDto.relationalFilter = _.merge(
        {},
        parsedQueryDto.relationalFilter,
        {
          $or: [
            { 'users._id': user._id },
            { company: { $in: userCompaniesIds } },
          ],
        },
      );
    }
    return this.licensekeyService.findAll(parsedQueryDto);
  }

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @AnyApiQueryTemplate()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'list users' })
  @Get('/list-users')
  async listUsers(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.userService.listUsers(queryDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @AnyApiQueryTemplate()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all users also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.userService.getCount(queryDto);
  }

  @Get('/estimate-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all users',
  })
  async getEstimateCount() {
    return this.userService.getEstimateCount();
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
    return this.userService
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
    return this.userService.addBulkNewLicenses(
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

    // const adminCompany = await this.companyService
    //   .findById(loggedInUser?.adminCompany._id)
    //   .catch(err => {
    //     throw new ForbiddenException(
    //       err.message || 'Autenticated User must be an admin of valid company',
    //     );
    //   });
    // cognitoCreateUser.company = loggedInUser?.adminCompany._id;

    const { email, userName } = cognitoCreateUser;
    //Check if user already present if preseent return existing user orelse create new user
    var userInDb = await this.userService.findByEmail(email);
    if (!userInDb) {
      const userCreated = await this.userService.cognitoCreateUser(
        cognitoCreateUser,
      );
      userInDb = userCreated.userDb;
    }
    const apiKey = await this.userService.apiKeyService.findOrCreateApiKeyForCompanyUser(
      userInDb._id,
      loggedInUser._id,
    );

    return {
      user: userInDb,
      apiKey: apiKey,
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
    return this.userService.cognitoCreateUser(cognitoCreateUserDto);
  }

  @Get('sync-with-cognito')
  @RolesAllowed(Roles.ADMIN, Roles.THIRDPARTY_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiQuery({ name: 'user', type: String, required: false })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync user from cognito to our database' })
  async syncUsers(@Query('user') user?: string) {
    if (user) {
      const cognitoUser = await this.userService
        .getCognitoUser(user)
        .catch(err => {
          throw new NotFoundException('Invalid user');
        });
      if (!cognitoUser)
        throw new NotFoundException('User not found in cognito');
      return this.userService.syncUserFromCognitoToMongooDb(user);
    }
    return this.userService.syncUsersFromCognitoToMongooDb();
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
    const user = await this.userService.getUserProfile(usernameOrSub);
    if (!user) {
      throw new NotFoundException('Invalid user');
    }

    return this.userService.addMonitoringSubscriptionFromMonitoringGroup(
      usernameOrSub,
    );
  }
}
