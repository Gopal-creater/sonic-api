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
exports.DetectionController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const detection_service_1 = require("./detection.service");
const create_detection_dto_1 = require("./dto/create-detection.dto");
const sonickey_service_1 = require("../sonickey/services/sonickey.service");
const apikey_auth_guard_1 = require("../auth/guards/apikey-auth.guard");
const apikey_decorator_1 = require("../auth/decorators/apikey.decorator");
const swagger_1 = require("@nestjs/swagger");
const Channels_enum_1 = require("../../constants/Channels.enum");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const parseQueryValue_pipe_1 = require("../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../shared/dtos/parsedquery.dto");
const anyapiquerytemplate_decorator_1 = require("../../shared/decorators/anyapiquerytemplate.decorator");
let DetectionController = class DetectionController {
    constructor(detectionService, sonickeyServive) {
        this.detectionService = detectionService;
        this.sonickeyServive = sonickeyServive;
    }
    findAll(queryDto) {
        return this.detectionService.findAll(queryDto);
    }
    async createFromBinary(createDetectionFromBinaryDto, customer, apiKey) {
        const keyFound = await this.sonickeyServive.findBySonicKey(createDetectionFromBinaryDto.sonicKey);
        if (!keyFound) {
            throw new common_1.NotFoundException('Provided sonickey is not found on our database.');
        }
        if (!createDetectionFromBinaryDto.detectedAt) {
            createDetectionFromBinaryDto.detectedAt = new Date();
        }
        const newDetection = new this.detectionService.detectionModel(Object.assign(Object.assign({}, createDetectionFromBinaryDto), { apiKey: apiKey, owner: customer, sonicKeyOwnerId: keyFound.owner, sonicKeyOwnerName: keyFound.contentOwner, channel: Channels_enum_1.ChannelEnums.BINARY }));
        return newDetection.save();
    }
    async createFromHardware(createDetectionFromHardwareDto, customer, apiKey) {
        const keyFound = await this.sonickeyServive.findBySonicKey(createDetectionFromHardwareDto.sonicKey);
        if (!keyFound) {
            throw new common_1.NotFoundException('Provided sonickey is not found on our database.');
        }
        if (!createDetectionFromHardwareDto.detectedAt) {
            createDetectionFromHardwareDto.detectedAt = new Date();
        }
        const newDetection = new this.detectionService.detectionModel(Object.assign(Object.assign({}, createDetectionFromHardwareDto), { apiKey: apiKey, owner: customer, sonicKeyOwnerId: keyFound.owner, sonicKeyOwnerName: keyFound.contentOwner, channel: Channels_enum_1.ChannelEnums.HARDWARE }));
        return newDetection.save();
    }
    async getCount(queryDto) {
        const filter = queryDto.filter || {};
        return this.detectionService.detectionModel.where(filter).countDocuments();
    }
};
__decorate([
    common_1.Get(),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Get All Detections' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/mongoosepaginate-radiostationsonickey.dto").MongoosePaginateDeectionDto }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", void 0)
], DetectionController.prototype, "findAll", null);
__decorate([
    swagger_1.ApiSecurity('x-api-key'),
    swagger_1.ApiOperation({ summary: 'Create Detection From Binary [protected by x-api-key]' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Post(`/${Channels_enum_1.ChannelEnums.BINARY}`),
    openapi.ApiResponse({ status: 201, type: require("./schemas/detection.schema").Detection }),
    __param(0, common_1.Body()),
    __param(1, apikey_decorator_1.ApiKey('customer')),
    __param(2, apikey_decorator_1.ApiKey('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateDetectionFromBinaryDto, String, String]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "createFromBinary", null);
__decorate([
    swagger_1.ApiSecurity('x-api-key'),
    swagger_1.ApiOperation({ summary: 'Create Detection From Hardware [protected by x-api-key]' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Post(`/${Channels_enum_1.ChannelEnums.HARDWARE}`),
    openapi.ApiResponse({ status: 201, type: require("./schemas/detection.schema").Detection }),
    __param(0, common_1.Body()),
    __param(1, apikey_decorator_1.ApiKey('customer')),
    __param(2, apikey_decorator_1.ApiKey('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateDetectionFromHardwareDto, String, String]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "createFromHardware", null);
__decorate([
    common_1.Get('/count'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get count of all detection also accept filter as query params' }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], DetectionController.prototype, "getCount", null);
DetectionController = __decorate([
    swagger_1.ApiTags('Detection Controller'),
    common_1.Controller('detection'),
    __metadata("design:paramtypes", [detection_service_1.DetectionService,
        sonickey_service_1.SonickeyService])
], DetectionController);
exports.DetectionController = DetectionController;
//# sourceMappingURL=detection.controller.js.map