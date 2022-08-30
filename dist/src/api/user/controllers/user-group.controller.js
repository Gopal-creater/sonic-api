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
exports.UserGroupController = void 0;
const openapi = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("../dtos/index");
const user_service_1 = require("../services/user.service");
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const Enums_1 = require("../../../constants/Enums");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const user_group_service_1 = require("../services/user-group.service");
const group_service_1 = require("../../group/group.service");
let UserGroupController = class UserGroupController {
    constructor(userServices, groupService, userGroupService) {
        this.userServices = userServices;
        this.groupService = groupService;
        this.userGroupService = userGroupService;
    }
    async addUserToGroup(addUserToGroupDto) {
        const { user, group } = addUserToGroupDto;
        const validUser = await this.userServices.findById(user);
        const validGroup = await this.groupService.findById(group);
        if (!validUser) {
            throw new common_1.BadRequestException("Invalid user");
        }
        if (!validGroup) {
            throw new common_1.BadRequestException("Invalid group");
        }
        return this.userGroupService.addUserToGroup(validUser, validGroup);
    }
    async removeUserFromGroup(removeUserFromGroupDto) {
        const { user, group } = removeUserFromGroupDto;
        const validUser = await this.userServices.findById(user);
        const validGroup = await this.groupService.findById(group);
        if (!validUser) {
            throw new common_1.BadRequestException("Invalid user");
        }
        if (!validGroup) {
            throw new common_1.BadRequestException("Invalid group");
        }
        return this.userGroupService.removeUserFromGroup(validUser, validGroup);
    }
    async listAllGroupsForUser(user) {
        const validUser = await this.userServices.findById(user);
        if (!validUser) {
            throw new common_1.BadRequestException("Invalid user");
        }
        return this.userGroupService.listAllGroupsForUser(validUser);
    }
};
__decorate([
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'add user to group' }),
    (0, common_1.Post)('/groups/add-user-to-group'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.AddUserToGroupDto]),
    __metadata("design:returntype", Promise)
], UserGroupController.prototype, "addUserToGroup", null);
__decorate([
    (0, roles_decorator_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'remove user from group' }),
    (0, common_1.Delete)('/groups/remove-user-from-group'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.RemoveUserFromGroupDto]),
    __metadata("design:returntype", Promise)
], UserGroupController.prototype, "removeUserFromGroup", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'list groups of particular user' }),
    (0, common_1.Get)('/groups/list-groups/:user'),
    openapi.ApiResponse({ status: 200, type: [require("../../group/schemas/group.schema").Group] }),
    __param(0, (0, common_1.Param)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserGroupController.prototype, "listAllGroupsForUser", null);
UserGroupController = __decorate([
    (0, swagger_1.ApiTags)('User Controller'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        group_service_1.GroupService,
        user_group_service_1.UserGroupService])
], UserGroupController);
exports.UserGroupController = UserGroupController;
//# sourceMappingURL=user-group.controller.js.map