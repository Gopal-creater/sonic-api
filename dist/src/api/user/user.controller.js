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
let UserController = class UserController {
    constructor(userServices, licensekeyService) {
        this.userServices = userServices;
        this.licensekeyService = licensekeyService;
    }
    async getUserLicenses(userId, queryDto) {
        queryDto.filter['owners.ownerId'] = userId;
        return this.licensekeyService.findAll(queryDto);
    }
    async addNewLicense(userId, addNewLicenseDto) {
        return this.userServices
            .addNewLicense(addNewLicenseDto.licenseKey, userId)
            .catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException(err.message);
            }
            throw err;
        });
    }
    async addBulkNewLicense(userId, addBulkNewLicensesDto) {
        return this.userServices.addBulkNewLicenses(addBulkNewLicensesDto.licenseKeys, userId);
    }
    async getUserProfile(username) {
        return this.userServices.getUserProfile(username);
    }
    async getGroupsOfUser(username) {
        return this.userServices.getGroupsForUser(username);
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
    swagger_1.ApiOperation({ summary: 'Add Single License Key' }),
    common_1.Post('/:userId/add-new-license'),
    openapi.ApiResponse({ status: 201, type: require("../licensekey/schemas/licensekey.schema").LicenseKey }),
    __param(0, common_1.Param('userId')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, index_1.AddNewLicenseDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addNewLicense", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Add Bulk License Keys' }),
    common_1.Post('/:userId/add-new-licenses'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Param('userId')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, index_1.AddBulkNewLicensesDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addBulkNewLicense", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOkResponse({
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
    }),
    swagger_1.ApiOperation({ summary: 'Get User profile by username or sub id' }),
    common_1.Get('/:username/profile'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
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
UserController = __decorate([
    swagger_1.ApiTags('User Controller'),
    common_1.Controller('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        licensekey_service_1.LicensekeyService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map