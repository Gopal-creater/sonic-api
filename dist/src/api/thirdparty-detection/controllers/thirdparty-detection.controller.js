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
exports.ThirdpartyDetectionController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const thirdparty_detection_service_1 = require("../thirdparty-detection.service");
const update_thirdparty_detection_dto_1 = require("../dto/update-thirdparty-detection.dto");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const query_dto_1 = require("../../../shared/dtos/query.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let ThirdpartyDetectionController = class ThirdpartyDetectionController {
    constructor(thirdpartyDetectionService) {
        this.thirdpartyDetectionService = thirdpartyDetectionService;
    }
    findAll(queryDto) {
        return this.thirdpartyDetectionService.findAll(queryDto);
    }
    async getOwnersKeys(ownerId, queryDto) {
        const query = Object.assign(Object.assign({}, queryDto), { customer: ownerId });
        return this.thirdpartyDetectionService.findAll(query);
    }
    async getCount(query) {
        return this.thirdpartyDetectionService.thirdpartyDetectionModel.estimatedDocumentCount(Object.assign({}, query));
    }
    async findById(id) {
        const detection = await this.thirdpartyDetectionService.findById(id);
        if (!detection) {
            throw new common_1.NotFoundException();
        }
        return detection;
    }
    async update(id, updateThirdpartyDetectionDto) {
        const detection = await this.thirdpartyDetectionService.update(id, updateThirdpartyDetectionDto);
        if (!detection) {
            throw new common_1.NotFoundException();
        }
        return detection;
    }
    async remove(id) {
        const detection = await this.thirdpartyDetectionService.remove(id);
        if (!detection) {
            throw new common_1.NotFoundException();
        }
        return detection;
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: 'Get All Detection' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-thirdpartydetection.dto").MongoosePaginateThirdPartyDetectionDto }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryDto]),
    __metadata("design:returntype", void 0)
], ThirdpartyDetectionController.prototype, "findAll", null);
__decorate([
    common_1.Get('/customers/:targetUser'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get All Detection of particular user' }),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-thirdpartydetection.dto").MongoosePaginateThirdPartyDetectionDto }),
    __param(0, common_1.Param('targetUser')), __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_dto_1.QueryDto]),
    __metadata("design:returntype", Promise)
], ThirdpartyDetectionController.prototype, "getOwnersKeys", null);
__decorate([
    common_1.Get('/count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get count of all thirdparty detections' }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ThirdpartyDetectionController.prototype, "getCount", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Get One Detection' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200, type: require("../schemas/thirdparty-detection.schema").ThirdpartyDetection }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThirdpartyDetectionController.prototype, "findById", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Update One Detection' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200, type: require("../schemas/thirdparty-detection.schema").ThirdpartyDetection }),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_thirdparty_detection_dto_1.UpdateThirdpartyDetectionDto]),
    __metadata("design:returntype", Promise)
], ThirdpartyDetectionController.prototype, "update", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Remove One Detection' }),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    openapi.ApiResponse({ status: 200, type: require("../schemas/thirdparty-detection.schema").ThirdpartyDetection }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThirdpartyDetectionController.prototype, "remove", null);
ThirdpartyDetectionController = __decorate([
    swagger_1.ApiTags('ThirdParty Controller'),
    common_1.Controller('thirdparty-detection'),
    __metadata("design:paramtypes", [thirdparty_detection_service_1.ThirdpartyDetectionService])
], ThirdpartyDetectionController);
exports.ThirdpartyDetectionController = ThirdpartyDetectionController;
//# sourceMappingURL=thirdparty-detection.controller.js.map