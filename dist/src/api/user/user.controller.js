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
const jwt_auth_guard_1 = require("./../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("./dtos/index");
const user_service_1 = require("./user.service");
const common_1 = require("@nestjs/common");
const parseQueryValue_pipe_1 = require("../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../shared/dtos/parsedquery.dto");
const licensekey_service_1 = require("../licensekey/services/licensekey.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const Enums_1 = require("../../constants/Enums");
const role_based_guard_1 = require("../auth/guards/role-based.guard");
const decorators_1 = require("../auth/decorators");
const user_aws_schema_1 = require("./schemas/user.aws.schema");
let UserController = class UserController {
    constructor(userServices, licensekeyService) {
        this.userServices = userServices;
        this.licensekeyService = licensekeyService;
    }
    async getUserLicenses(userId, queryDto) {
        queryDto.filter['owners.ownerId'] = userId;
        return this.licensekeyService.findAll(queryDto);
    }
    async checkAuthorization(user) {
        return {
            ok: true,
            user: user
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
    async getUserProfile(username) {
        const profile = await this.userServices.getUserProfile(username);
        if (!profile) {
            throw new common_1.NotFoundException("User not found");
        }
        return profile;
    }
    async getGroupsOfUser(username) {
        return this.userServices.adminListGroupsForUser(username);
    }
    async adminCreateUser(adminCreateUserDTO) {
        if (adminCreateUserDTO.group) {
            await this.userServices.getGroup(adminCreateUserDTO.group)
                .catch(err => {
                throw new common_1.BadRequestException(err.message || "Invalid group");
            });
        }
        return this.userServices.adminCreateUser(adminCreateUserDTO);
    }
    async addMonitoringSubscriptionFromMonitoringGroup(usernameOrSub) {
        const user = await this.userServices.getUserProfile(usernameOrSub);
        if (!user) {
            throw new common_1.NotFoundException("Invalid user");
        }
        return this.userServices.addMonitoringSubscriptionFromMonitoringGroup(usernameOrSub);
    }
};
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get all licenses of particular user' }),
    common_1.Get('/:userId/licenses'),
    openapi.ApiResponse({ status: 200, type: require("../licensekey/dto/mongoosepaginate-licensekey.dto").MongoosePaginateLicensekeyDto }),
    __param(0, common_1.Param('userId')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserLicenses", null);
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
    openapi.ApiResponse({ status: 201, type: require("../licensekey/schemas/licensekey.schema").LicenseKey }),
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
    openapi.ApiResponse({ status: 200, type: require("./schemas/user.aws.schema").UserProfile }),
    __param(0, common_1.Param('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOkResponse({
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
    }),
    swagger_1.ApiOperation({ summary: 'Get User groups by username or sub id' }),
    common_1.Get('/:username/groups'),
    __param(0, common_1.Param('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getGroupsOfUser", null);
__decorate([
    common_1.Post('admin-create-user'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN, Enums_1.Roles.THIRDPARTY_ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Admin create user' }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.AdminCreateUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminCreateUser", null);
__decorate([
    common_1.Post('add-monitoring-subscription-from-monitoring-group/:usernameOrSub'),
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Add monitoring Subscription From Monitoring Group' }),
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
        licensekey_service_1.LicensekeyService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map