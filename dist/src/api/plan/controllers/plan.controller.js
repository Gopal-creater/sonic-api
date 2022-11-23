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
exports.PlanController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const plan_service_1 = require("../plan.service");
const create_plan_dto_1 = require("../dto/create-plan.dto");
const update_plan_dto_1 = require("../dto/update-plan.dto");
const swagger_1 = require("@nestjs/swagger");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const Enums_1 = require("../../../constants/Enums");
let PlanController = class PlanController {
    constructor(planService) {
        this.planService = planService;
    }
    create(createPlanDto) {
        return this.planService.create(createPlanDto);
    }
    findAll(parsedQueryDto) {
        return this.planService.findAll(parsedQueryDto);
    }
    findOne(id) {
        return this.planService.findById(id);
    }
    update(id, updatePlanDto) {
        return this.planService.update(id, updatePlanDto);
    }
    remove(id) {
        return this.planService.removeById(id);
    }
};
__decorate([
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Create Plan' }),
    common_1.Post(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.CreatePlanDto]),
    __metadata("design:returntype", void 0)
], PlanController.prototype, "create", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Get Plans' }),
    common_1.Get(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], PlanController.prototype, "findAll", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Get Single Plan' }),
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlanController.prototype, "findOne", null);
__decorate([
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Update Plan' }),
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plan_dto_1.UpdatePlanDto]),
    __metadata("design:returntype", void 0)
], PlanController.prototype, "update", null);
__decorate([
    roles_decorator_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Delete Plan' }),
    common_1.Delete(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlanController.prototype, "remove", null);
PlanController = __decorate([
    swagger_1.ApiTags('Plans Controller'),
    common_1.Controller('plans'),
    __metadata("design:paramtypes", [plan_service_1.PlanService])
], PlanController);
exports.PlanController = PlanController;
//# sourceMappingURL=plan.controller.js.map