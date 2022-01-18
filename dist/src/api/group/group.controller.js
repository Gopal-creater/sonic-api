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
exports.GroupController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const group_service_1 = require("./group.service");
const create_group_dto_1 = require("./dtos/create-group.dto");
const update_group_dto_1 = require("./dtos/update-group.dto");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../auth/decorators");
const Enums_1 = require("../../constants/Enums");
const guards_1 = require("../auth/guards");
let GroupController = class GroupController {
    constructor(groupService) {
        this.groupService = groupService;
    }
    create(createGroupDto) {
        return this.groupService.create(createGroupDto);
    }
    findAll() {
        return this.groupService.findAll();
    }
    findOne(id) {
        return this.groupService.findById(id);
    }
    update(id, updateGroupDto) {
        return this.groupService.update(id, updateGroupDto);
    }
    remove(id) {
        return this.groupService.removeById(id);
    }
};
__decorate([
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Create Group' }),
    common_1.Post(),
    openapi.ApiResponse({ status: 201, type: require("./schemas/group.schema").Group }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_group_dto_1.CreateGroupDto]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "create", null);
__decorate([
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Groups' }),
    common_1.Get(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "findAll", null);
__decorate([
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Single Group' }),
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "findOne", null);
__decorate([
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Update Group' }),
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_group_dto_1.UpdateGroupDto]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "update", null);
__decorate([
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(guards_1.JwtAuthGuard, guards_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Delete Group' }),
    common_1.Delete(':id'),
    openapi.ApiResponse({ status: 200, type: require("./schemas/group.schema").Group }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "remove", null);
GroupController = __decorate([
    swagger_1.ApiTags('Group Controller'),
    common_1.Controller('groups'),
    __metadata("design:paramtypes", [group_service_1.GroupService])
], GroupController);
exports.GroupController = GroupController;
//# sourceMappingURL=group.controller.js.map