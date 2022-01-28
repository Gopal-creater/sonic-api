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
exports.DetectionThirdPartyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sonickey_service_1 = require("../../sonickey/services/sonickey.service");
const detection_service_1 = require("../../detection/detection.service");
const Enums_1 = require("../../../constants/Enums");
const create_detection_dto_1 = require("../dto/create-detection.dto");
const apikey_auth_guard_1 = require("../../auth/guards/apikey-auth.guard");
const apikey_decorator_1 = require("../../api-key/decorators/apikey.decorator");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
let DetectionThirdPartyController = class DetectionThirdPartyController {
    constructor(sonickeyServive, detectionService) {
        this.sonickeyServive = sonickeyServive;
        this.detectionService = detectionService;
    }
    async create(createDetectionFromBinaryDto, customer, apiKey) {
        const isKeyFound = await this.sonickeyServive.findBySonicKey(createDetectionFromBinaryDto.sonicKey);
        if (!isKeyFound) {
            throw new common_1.NotFoundException('Provided sonickey is not found on our database.');
        }
        if (!createDetectionFromBinaryDto.detectedAt) {
            createDetectionFromBinaryDto.detectedAt = new Date();
        }
        const newDetection = new this.detectionService.detectionModel({
            sonicKey: createDetectionFromBinaryDto.sonicKey,
            detectedAt: createDetectionFromBinaryDto.detectedAt,
            metadata: createDetectionFromBinaryDto.metaData,
            apiKey: apiKey,
            owner: isKeyFound.owner,
            sonicKeyOwnerId: isKeyFound.owner,
            sonicKeyOwnerName: isKeyFound.contentOwner,
            channel: Enums_1.ChannelEnums.BINARY,
        });
        return newDetection.save();
    }
    async createThirdPartyRadioDetectionFromBinary(createThirdPartyRadioDetectionFromBinaryDto, customer, apiKey) {
        var { sonicKey, detectedAt, metaData, thirdpartyRadioDetection } = createThirdPartyRadioDetectionFromBinaryDto;
        const isKeyFound = await this.sonickeyServive.findBySonicKey(sonicKey);
        if (!isKeyFound) {
            throw new common_1.NotFoundException('Provided sonickey is not found on our database.');
        }
        if (!detectedAt) {
            detectedAt = new Date();
        }
        const newDetection = new this.detectionService.detectionModel({
            sonicKey: sonicKey,
            detectedAt: detectedAt,
            metadata: metaData,
            apiKey: apiKey,
            owner: isKeyFound.owner,
            sonicKeyOwnerId: isKeyFound.owner,
            sonicKeyOwnerName: isKeyFound.contentOwner,
            channel: Enums_1.ChannelEnums.THIRDPARTY_STREAMREADER,
            thirdpartyRadioDetection: thirdpartyRadioDetection
        });
        return newDetection.save();
    }
    async createFromHardware(createDetectionFromHardwareDto, customer, apiKey) {
        const isKeyFound = await this.sonickeyServive.findBySonicKey(createDetectionFromHardwareDto.sonicKey);
        if (!isKeyFound) {
            throw new common_1.NotFoundException('Provided sonickey is not found on our database.');
        }
        if (!createDetectionFromHardwareDto.detectedAt) {
            createDetectionFromHardwareDto.detectedAt = new Date();
        }
        const newDetection = new this.detectionService.detectionModel({
            sonicKey: createDetectionFromHardwareDto.sonicKey,
            detectedAt: createDetectionFromHardwareDto.detectedAt,
            metadata: createDetectionFromHardwareDto.metaData,
            apiKey: apiKey,
            owner: isKeyFound.owner,
            sonicKeyOwnerId: isKeyFound.owner,
            sonicKeyOwnerName: isKeyFound.contentOwner,
            channel: Enums_1.ChannelEnums.HARDWARE,
        });
        return newDetection.save();
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: 'Create Detection From Binary' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Post('detection-from-binary'),
    openapi.ApiResponse({ status: 201, type: require("../schemas/detection.schema").Detection }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __param(2, apikey_decorator_1.ApiKey('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateDetectionFromBinaryDto, String, String]),
    __metadata("design:returntype", Promise)
], DetectionThirdPartyController.prototype, "create", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Create Radio Detection From Binary' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Post('radio-detection-from-binary'),
    openapi.ApiResponse({ status: 201, type: require("../schemas/detection.schema").Detection }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __param(2, apikey_decorator_1.ApiKey('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateThirdPartyRadioDetectionFromBinaryDto, String, String]),
    __metadata("design:returntype", Promise)
], DetectionThirdPartyController.prototype, "createThirdPartyRadioDetectionFromBinary", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Create Detection From Hardware' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Post('detection-from-hardware'),
    openapi.ApiResponse({ status: 201, type: require("../schemas/detection.schema").Detection }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __param(2, apikey_decorator_1.ApiKey('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateDetectionFromHardwareDto, String, String]),
    __metadata("design:returntype", Promise)
], DetectionThirdPartyController.prototype, "createFromHardware", null);
DetectionThirdPartyController = __decorate([
    swagger_1.ApiTags('ThirdParty Integration Controller, Protected By XAPI-Key'),
    swagger_1.ApiSecurity('x-api-key'),
    common_1.Controller('thirdparty/detection'),
    __metadata("design:paramtypes", [sonickey_service_1.SonickeyService,
        detection_service_1.DetectionService])
], DetectionThirdPartyController);
exports.DetectionThirdPartyController = DetectionThirdPartyController;
//# sourceMappingURL=detection.thirdparty.controller.js.map