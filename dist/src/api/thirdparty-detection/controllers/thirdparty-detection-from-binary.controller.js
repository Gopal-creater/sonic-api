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
exports.ThirdpartyDetectionFromBinaryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const thirdparty_detection_service_1 = require("../thirdparty-detection.service");
const create_thirdparty_detection_dto_1 = require("../dto/create-thirdparty-detection.dto");
const update_thirdparty_detection_dto_1 = require("../dto/update-thirdparty-detection.dto");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const query_dto_1 = require("../../../shared/dtos/query.dto");
const swagger_1 = require("@nestjs/swagger");
const apikey_auth_guard_1 = require("../../auth/guards/apikey-auth.guard");
const apikey_decorator_1 = require("../../auth/decorators/apikey.decorator");
let ThirdpartyDetectionFromBinaryController = class ThirdpartyDetectionFromBinaryController {
    constructor(thirdpartyDetectionService) {
        this.thirdpartyDetectionService = thirdpartyDetectionService;
    }
    create(createThirdpartyDetectionDto, customer) {
        if (!createThirdpartyDetectionDto.detectionTime) {
            createThirdpartyDetectionDto.detectionTime = new Date();
        }
        const newDetection = new this.thirdpartyDetectionService.thirdpartyDetectionModel(Object.assign(Object.assign({}, createThirdpartyDetectionDto), { customer: customer }));
        return newDetection.save();
    }
    findAll(queryDto) {
        return this.thirdpartyDetectionService.findAll(queryDto);
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
    swagger_1.ApiOperation({ summary: 'Create Detection' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Post(),
    openapi.ApiResponse({ status: 201, type: require("../schemas/thirdparty-detection.schema").ThirdpartyDetection }),
    __param(0, common_1.Body()), __param(1, apikey_decorator_1.ApiKey('customer')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_thirdparty_detection_dto_1.CreateThirdpartyDetectionDto, String]),
    __metadata("design:returntype", void 0)
], ThirdpartyDetectionFromBinaryController.prototype, "create", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Get All Detection' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: [require("../schemas/thirdparty-detection.schema").ThirdpartyDetection] }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryDto]),
    __metadata("design:returntype", void 0)
], ThirdpartyDetectionFromBinaryController.prototype, "findAll", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Get One Detection' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200, type: require("../schemas/thirdparty-detection.schema").ThirdpartyDetection }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThirdpartyDetectionFromBinaryController.prototype, "findById", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Update One Detection' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200, type: require("../schemas/thirdparty-detection.schema").ThirdpartyDetection }),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_thirdparty_detection_dto_1.UpdateThirdpartyDetectionDto]),
    __metadata("design:returntype", Promise)
], ThirdpartyDetectionFromBinaryController.prototype, "update", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Remove One Detection' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Delete(':id'),
    openapi.ApiResponse({ status: 200, type: require("../schemas/thirdparty-detection.schema").ThirdpartyDetection }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThirdpartyDetectionFromBinaryController.prototype, "remove", null);
ThirdpartyDetectionFromBinaryController = __decorate([
    swagger_1.ApiTags('ThirdParty-Binary Controller (protected by x-api-key)'),
    swagger_1.ApiSecurity('x-api-key'),
    common_1.Controller('thirdparty-detection-from-binary'),
    __metadata("design:paramtypes", [thirdparty_detection_service_1.ThirdpartyDetectionService])
], ThirdpartyDetectionFromBinaryController);
exports.ThirdpartyDetectionFromBinaryController = ThirdpartyDetectionFromBinaryController;
//# sourceMappingURL=thirdparty-detection-from-binary.controller.js.map