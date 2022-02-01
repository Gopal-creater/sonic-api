"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const openapi = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("../dtos/index");
const user_service_1 = require("../services/user.service");
const common_1 = require("@nestjs/common");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const Enums_1 = require("../../../constants/Enums");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const decorators_1 = require("../../auth/decorators");
const user_aws_schema_1 = require("../schemas/user.aws.schema");
const group_service_1 = require("../../group/group.service");
const company_service_1 = require("../../company/company.service");
const user_db_schema_1 = require("../schemas/user.db.schema");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
const conditional_auth_guard_1 = require("../../auth/guards/conditional-auth.guard");
let UserController = class UserController {
    constructor(userServices, groupService, companyService, licensekeyService) {
        this.userServices = userServices;
        this.groupService = groupService;
        this.companyService = companyService;
        this.licensekeyService = licensekeyService;
    }
    async getUserLicenses(userId, queryDto) {
        queryDto.filter['users'] = userId;
        return this.licensekeyService.findAll(queryDto);
    }
    async listUsers(queryDto) {
        return this.userServices.listUsers(queryDto);
    }
    async getCount(queryDto) {
        return this.userServices.getCount(queryDto);
    }
    async getEstimateCount() {
        return this.userServices.getEstimateCount();
    }
    async checkAuthorization(user) {
        return {
            ok: true,
            user: user,
        };
    }
    async addNewLicense(userIdOrUsername, addNewLicenseDto) {
        return this.userServices
            .addNewLicense(addNewLicenseDto.licenseKey, userIdOrUsername)
            .catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException(err.message);
            }
            throw err;
        });
    }
    async addBulkNewLicense(userIdOrUsername, addBulkNewLicensesDto) {
        return this.userServices.addBulkNewLicenses(addBulkNewLicensesDto.licenseKeys, userIdOrUsername);
    }
    async getUserProfile(user) {
        return user;
    }
    async companyFindOrCreateUser(loggedInUser, companyFindOrCreateUser) {
        const cognitoCreateUser = Object.assign({}, companyFindOrCreateUser, new index_1.CognitoCreateUserDTO());
        const { email, userName } = cognitoCreateUser;
        var userInDb = await this.userServices.findByEmail(email);
        if (!userInDb) {
            const userCreated = await this.userServices.cognitoCreateUser(cognitoCreateUser);
            userInDb = userCreated.userDb;
        }
        const apiKey = await this.userServices.apiKeyService.findOrCreateApiKeyForCompanyUser(userInDb._id, loggedInUser._id);
        return {
            user: userInDb,
            apiKey: apiKey,
        };
    }
    async cognitoCreateUser(cognitoCreateUserDto) {
        if (cognitoCreateUserDto.group) {
            await this.groupService
                .findById(cognitoCreateUserDto.group)
                .catch(err => {
                throw new common_1.BadRequestException(err.message || 'Invalid group');
            });
        }
        if (cognitoCreateUserDto.company) {
            await this.companyService
                .findById(cognitoCreateUserDto.company)
                .catch(err => {
                throw new common_1.BadRequestException(err.message || 'Invalid company');
            });
        }
        return this.userServices.cognitoCreateUser(cognitoCreateUserDto);
    }
    async syncUsers(user) {
        if (user) {
            const cognitoUser = await this.userServices
                .getCognitoUser(user)
                .catch(err => {
                throw new common_1.NotFoundException('Invalid user');
            });
            if (!cognitoUser)
                throw new common_1.NotFoundException('User not found in cognito');
            return this.userServices.syncUserFromCognitoToMongooDb(user);
        }
        return this.userServices.syncUsersFromCognitoToMongooDb();
    }
    async addMonitoringSubscriptionFromMonitoringGroup(usernameOrSub) {
        const user = await this.userServices.getUserProfile(usernameOrSub);
        if (!user) {
            throw new common_1.NotFoundException('Invalid user');
        }
        return this.userServices.addMonitoringSubscriptionFromMonitoringGroup(usernameOrSub);
    }
};
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get all licenses of particular user' }),
    common_1.Get('/:userId/licenses'),
    openapi.ApiResponse({ status: 200, type: require("../../licensekey/dto/mongoosepaginate-licensekey.dto").MongoosePaginateLicensekeyDto }),
    __param(0, common_1.Param('userId')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserLicenses", null);
__decorate([
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'list users' }),
    common_1.Get('/list-users'),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-user.dto").MongoosePaginateUserDto }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "listUsers", null);
__decorate([
    common_1.Get('/count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get count of all users also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getCount", null);
__decorate([
    common_1.Get('/estimate-count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get all count of all users',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getEstimateCount", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'authorize user with their token' }),
    common_1.Get('/authorize'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, decorators_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_aws_schema_1.CognitoUserSession]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkAuthorization", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Add Single License Key' }),
    common_1.Post('/:userIdOrUsername/add-new-license'),
    openapi.ApiResponse({ status: 201, type: require("../../licensekey/schemas/licensekey.schema").LicenseKey }),
    __param(0, common_1.Param('userIdOrUsername')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, index_1.AddNewLicenseDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addNewLicense", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Add Bulk License Keys' }),
    common_1.Post('/:userIdOrUsername/add-new-licenses'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Param('userIdOrUsername')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, index_1.AddBulkNewLicensesDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addBulkNewLicense", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get User profile by username or sub id' }),
    common_1.Get('/:username/profile'),
    openapi.ApiResponse({ status: 200, type: require("../schemas/user.db.schema").UserDB }),
    __param(0, decorators_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_db_schema_1.UserDB]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
    common_1.Post('/company-find-or-create-user'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.COMPANY_ADMIN),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiSecurity('x-api-key'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Company find or create user' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, decorators_1.User()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_db_schema_1.UserDB,
        index_1.CompanyFindOrCreateUser]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "companyFindOrCreateUser", null);
__decorate([
    common_1.Post('admin-create-user'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN, Enums_1.Roles.THIRDPARTY_ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Admin create user' }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.CognitoCreateUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "cognitoCreateUser", null);
__decorate([
    common_1.Get('sync-with-cognito'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN, Enums_1.Roles.THIRDPARTY_ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiQuery({ name: 'user', type: String, required: false }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Sync user from cognito to our database' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Query('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "syncUsers", null);
__decorate([
    common_1.Post('add-monitoring-subscription-from-monitoring-group/:usernameOrSub'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Add monitoring Subscription From Monitoring Group',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Param('usernameOrSub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addMonitoringSubscriptionFromMonitoringGroup", null);
UserController = __decorate([
    swagger_1.ApiTags('User Controller'),
    common_1.Controller('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        group_service_1.GroupService,
        company_service_1.CompanyService,
        licensekey_service_1.LicensekeyService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map