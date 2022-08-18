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
const dtos_1 = require("../dtos");
const _ = require("lodash");
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
const create_user_dto_1 = require("../dtos/create-user.dto");
const mongoose_utils_1 = require("../../../shared/utils/mongoose.utils");
const partner_service_1 = require("../../partner/services/partner.service");
const failedAlways_guard_1 = require("../../auth/guards/failedAlways.guard");
const update_user_dto_1 = require("../dtos/update-user.dto");
const update_user_security_guard_1 = require("../guards/update-user-security.guard");
const create_user_security_guard_1 = require("../guards/create-user-security.guard");
const enabledisable_user_security_guard_1 = require("../guards/enabledisable-user-security.guard");
const update_profile_dto_1 = require("../dtos/update-profile.dto");
const change_user_password_security_guard_copy_1 = require("../guards/change-user-password-security.guard copy");
let UserController = class UserController {
    constructor(userService, groupService, companyService, partnerService, licensekeyService) {
        this.userService = userService;
        this.groupService = groupService;
        this.companyService = companyService;
        this.partnerService = partnerService;
        this.licensekeyService = licensekeyService;
    }
    async create(loggedInUser, createUserDto) {
        var { company, partner, userName, email } = createUserDto;
        const userFromDb = await this.userService.findOne({
            $or: [{ email: email }, { username: userName }],
        });
        if (userFromDb) {
            throw new common_1.UnprocessableEntityException('User with given email or username already exists');
        }
        if (partner) {
            const partnerFromDb = await this.partnerService.findById(partner);
            if (!partnerFromDb)
                throw new common_1.NotFoundException('Unknown partner');
        }
        if (company) {
            const companyFormDb = await this.companyService.findById(company);
            if (!companyFormDb)
                throw new common_1.NotFoundException('Unknown company');
        }
        const createdUser = await this.userService.createUserInCognito(createUserDto, true, {
            createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id,
        });
        return createdUser;
    }
    findAll(queryDto) {
        return this.userService.listUsers(queryDto);
    }
    async findMe(user) {
        return user;
    }
    async updateMe(loggedInUser, updateUserDto) {
        const user = await this.userService.getUserProfile(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub);
        if (!user)
            throw new common_1.NotFoundException('Unknown user');
        return this.userService.update(loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id, Object.assign({}, updateUserDto));
    }
    async disableUser(loggedInUser, userId) {
        const userFromDb = await this.partnerService.userService.getUserProfile(userId);
        if (!userFromDb)
            throw new common_1.NotFoundException('User not found');
        await this.userService.adminDisableUser(userFromDb.username);
        const updatedUser = await this.userService.userModel.findByIdAndUpdate(userFromDb._id, {
            enabled: false,
            updatedBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id,
        }, { new: true });
        return updatedUser;
    }
    async changeUserPassword(loggedInUser, password, userId) {
        const userFromDb = await this.partnerService.userService.getUserProfile(userId);
        if (!userFromDb)
            throw new common_1.NotFoundException('User not found');
        await this.userService.adminSetUserPassword(userFromDb.username, password);
        const updatedUser = await this.userService.userModel.findByIdAndUpdate(userFromDb._id, {
            updatedBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id,
        }, { new: true });
        return updatedUser;
    }
    async enableUser(loggedInUser, userId) {
        const userFromDb = await this.partnerService.userService.getUserProfile(userId);
        if (!userFromDb)
            throw new common_1.NotFoundException('User not found');
        await this.userService.adminEnableUser(userFromDb.username);
        const updatedUser = await this.userService.userModel.findByIdAndUpdate(userFromDb._id, {
            enabled: true,
            updatedBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id,
        }, { new: true });
        return updatedUser;
    }
    async update(id, loggedInUser, updateUserDto) {
        var { company, partner, enabled, password } = updateUserDto;
        if (partner) {
            const partnerFromDb = await this.partnerService.findById(partner);
            if (!partnerFromDb)
                throw new common_1.NotFoundException('Unknown partner');
        }
        if (company) {
            const companyFormDb = await this.companyService.findById(company);
            if (!companyFormDb)
                throw new common_1.NotFoundException('Unknown company');
        }
        const user = await this.userService.getUserProfile(id);
        if (!user)
            throw new common_1.NotFoundException('Unknown user');
        if (updateUserDto.phoneNumber) {
            await this.userService.updateUserWithCustomField(user.username, [
                { Name: 'phone_number', Value: updateUserDto.phoneNumber }
            ]);
            updateUserDto['phone_number'] = updateUserDto.phoneNumber;
        }
        if (typeof enabled !== 'undefined' && user.enabled !== enabled) {
            if (enabled) {
                await this.userService.adminEnableUser(user.username);
            }
            else {
                await this.userService.adminDisableUser(user.username);
            }
        }
        if (password) {
            await this.userService.adminSetUserPassword(user.username, password);
        }
        return this.userService.update(id, Object.assign(Object.assign({}, updateUserDto), { updatedBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser._id }));
    }
    async remove(id) {
        const deletedUser = await this.userService.removeById(id);
        if (!deletedUser) {
            return new common_1.NotFoundException();
        }
        return deletedUser;
    }
    async getUserLicenses(userId, user, parsedQueryDto) {
        var includeCompanies = parsedQueryDto.filter['includeCompanies'];
        delete parsedQueryDto.filter['includeCompanies'];
        if (includeCompanies == false) {
            parsedQueryDto.filter = _.merge({}, parsedQueryDto.filter, {
                users: user._id,
            });
        }
        else {
            const userCompaniesIds = user.companies.map(com => (0, mongoose_utils_1.toObjectId)(com._id));
            parsedQueryDto.relationalFilter = _.merge({}, parsedQueryDto.relationalFilter, {
                $or: [
                    { 'users._id': user._id },
                    { company: { $in: userCompaniesIds } },
                ],
            });
        }
        return this.licensekeyService.findAll(parsedQueryDto);
    }
    async listUsers(queryDto) {
        return this.userService.listUsers(queryDto);
    }
    async getCount(queryDto) {
        return this.userService.getCount(queryDto);
    }
    async getEstimateCount() {
        return this.userService.getEstimateCount();
    }
    async checkAuthorization(user) {
        return {
            ok: true,
            user: user,
        };
    }
    async addNewLicense(userIdOrUsername, addNewLicenseDto) {
        return this.userService
            .addNewLicense(addNewLicenseDto.licenseKey, userIdOrUsername)
            .catch(err => {
            if (err.status == 404) {
                throw new common_1.NotFoundException(err.message);
            }
            throw err;
        });
    }
    async addBulkNewLicense(userIdOrUsername, addBulkNewLicensesDto) {
        return this.userService.addBulkNewLicenses(addBulkNewLicensesDto.licenseKeys, userIdOrUsername);
    }
    async getUserProfile(user) {
        return user;
    }
    async companyFindOrCreateUser(loggedInUser, companyFindOrCreateUser) {
        const cognitoCreateUser = Object.assign({}, companyFindOrCreateUser, new dtos_1.CognitoCreateUserDTO());
        const { email, userName } = cognitoCreateUser;
        var userInDb = await this.userService.findByEmail(email);
        if (!userInDb) {
            const userCreated = await this.userService.cognitoCreateUser(cognitoCreateUser);
            userInDb = userCreated.userDb;
        }
        const apiKey = await this.userService.apiKeyService.findOrCreateApiKeyForCompanyUser(userInDb._id, loggedInUser._id);
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
        return this.userService.cognitoCreateUser(cognitoCreateUserDto);
    }
    async syncUsers(user) {
        if (user) {
            const cognitoUser = await this.userService
                .getCognitoUser(user)
                .catch(err => {
                throw new common_1.NotFoundException('Invalid user');
            });
            if (!cognitoUser)
                throw new common_1.NotFoundException('User not found in cognito');
            return this.userService.syncUserFromCognitoToMongooDb(user);
        }
        return this.userService.syncUsersFromCognitoToMongooDb();
    }
    async findById(userId) {
        const user = await this.userService.getUserProfile(userId);
        if (!user) {
            return new common_1.NotFoundException();
        }
        return user;
    }
};
__decorate([
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN, Enums_1.Roles.PARTNER_ADMIN, Enums_1.Roles.COMPANY_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, create_user_security_guard_1.CreateUserSecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create user' }),
    (0, common_1.Post)(),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_db_schema_1.UserDB,
        create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get users',
    }),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN, Enums_1.Roles.PARTNER_ADMIN, Enums_1.Roles.COMPANY_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-user.dto").MongoosePaginateUserDto }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get User profile by token' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('/@me'),
    openapi.ApiResponse({ status: 200, type: require("../schemas/user.db.schema").UserDB }),
    __param(0, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_db_schema_1.UserDB]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findMe", null);
__decorate([
    (0, common_1.Put)('/updateme'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile by token' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_db_schema_1.UserDB,
        update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Put)(':id/disable-user'),
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN, Enums_1.Roles.COMPANY_ADMIN, Enums_1.Roles.PARTNER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, enabledisable_user_security_guard_1.EnableDisableUserSecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Disable user' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_db_schema_1.UserDB, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "disableUser", null);
__decorate([
    (0, common_1.Put)(':id/change-user-password'),
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN, Enums_1.Roles.COMPANY_ADMIN, Enums_1.Roles.PARTNER_ADMIN),
    (0, swagger_1.ApiBody)({
        type: dtos_1.ChangePassword,
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, change_user_password_security_guard_copy_1.ChangeUserPasswordSecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change user password' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_db_schema_1.UserDB, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeUserPassword", null);
__decorate([
    (0, common_1.Put)(':id/enable-user'),
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN, Enums_1.Roles.COMPANY_ADMIN, Enums_1.Roles.PARTNER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, enabledisable_user_security_guard_1.EnableDisableUserSecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Disable user' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_db_schema_1.UserDB, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "enableUser", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN, Enums_1.Roles.COMPANY_ADMIN, Enums_1.Roles.PARTNER_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, update_user_security_guard_1.UpdateUserSecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_db_schema_1.UserDB,
        update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN, Enums_1.Roles.PARTNER_ADMIN, Enums_1.Roles.COMPANY_ADMIN),
    (0, common_1.UseGuards)(failedAlways_guard_1.FailedAlwaysGuard, jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove user' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all licenses of particular user or his belongs to companies',
    }),
    (0, swagger_1.ApiQuery)({ name: 'includeCompanies', type: Boolean, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, common_1.Get)('/:userId/licenses'),
    openapi.ApiResponse({ status: 200, type: require("../../licensekey/dto/mongoosepaginate-licensekey.dto").MongoosePaginateLicensekeyDto }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, decorators_1.User)()),
    __param(2, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_db_schema_1.UserDB,
        parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserLicenses", null);
__decorate([
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'list users' }),
    (0, common_1.Get)('/list-users'),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-user.dto").MongoosePaginateUserDto }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)('/count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get count of all users also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)('/estimate-count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all count of all users',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getEstimateCount", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'authorize user with their token' }),
    (0, common_1.Get)('/authorize'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_aws_schema_1.CognitoUserSession]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkAuthorization", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add Single License Key' }),
    (0, common_1.Post)('/:userIdOrUsername/add-new-license'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('userIdOrUsername')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.AddNewLicenseDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addNewLicense", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add Bulk License Keys' }),
    (0, common_1.Post)('/:userIdOrUsername/add-new-licenses'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('userIdOrUsername')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.AddBulkNewLicensesDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addBulkNewLicense", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get User profile by username or sub id' }),
    (0, common_1.Get)('/:username/profile'),
    openapi.ApiResponse({ status: 200, type: require("../schemas/user.db.schema").UserDB }),
    __param(0, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_db_schema_1.UserDB]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Post)('/company-find-or-create-user'),
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.COMPANY_ADMIN),
    (0, common_1.UseGuards)(conditional_auth_guard_1.ConditionalAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Company find or create user' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_db_schema_1.UserDB,
        dtos_1.CompanyFindOrCreateUser]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "companyFindOrCreateUser", null);
__decorate([
    (0, common_1.Post)('admin-create-user'),
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN, Enums_1.Roles.THIRDPARTY_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Admin create user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CognitoCreateUserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "cognitoCreateUser", null);
__decorate([
    (0, common_1.Get)('sync-with-cognito'),
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN, Enums_1.Roles.THIRDPARTY_ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiQuery)({ name: 'user', type: String, required: false }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Sync user from cognito to our database' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "syncUsers", null);
__decorate([
    (0, roles_decorator_1.RolesAllowed)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findById", null);
UserController = __decorate([
    (0, swagger_1.ApiTags)('User Controller (D & M May 2022)'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        group_service_1.GroupService,
        company_service_1.CompanyService,
        partner_service_1.PartnerService,
        licensekey_service_1.LicensekeyService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map