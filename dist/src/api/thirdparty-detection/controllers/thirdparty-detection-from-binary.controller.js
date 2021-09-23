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
const swagger_1 = require("@nestjs/swagger");
const sonickey_service_1 = require("../../sonickey/services/sonickey.service");
const detection_service_1 = require("../../detection/detection.service");
const Enums_1 = require("../../../constants/Enums");
const apikey_auth_guard_1 = require("../../api-key/guards/apikey-auth.guard");
const apikey_decorator_1 = require("../../api-key/decorators/apikey.decorator");
let ThirdpartyDetectionFromBinaryController = class ThirdpartyDetectionFromBinaryController {
    constructor(thirdpartyDetectionService, sonickeyServive, detectionService) {
        this.thirdpartyDetectionService = thirdpartyDetectionService;
        this.sonickeyServive = sonickeyServive;
        this.detectionService = detectionService;
    }
    async create(createThirdpartyDetectionDto, customer, apiKey) {
        const isKeyFound = await this.sonickeyServive.findBySonicKey(createThirdpartyDetectionDto.sonicKey);
        if (!isKeyFound) {
            throw new common_1.NotFoundException('Provided sonickey is not found on our database.');
        }
        if (!createThirdpartyDetectionDto.detectionTime) {
            createThirdpartyDetectionDto.detectionTime = new Date();
        }
        const newDetection = new this.detectionService.detectionModel({
            sonicKey: createThirdpartyDetectionDto.sonicKey,
            detectedAt: createThirdpartyDetectionDto.detectionTime,
            metadata: createThirdpartyDetectionDto.metaData,
            apiKey: apiKey,
            owner: customer,
            sonicKeyOwnerId: isKeyFound.owner,
            sonicKeyOwnerName: isKeyFound.contentOwner,
            channel: Enums_1.ChannelEnums.BINARY,
        });
        return newDetection.save();
    }
};
__decorate([
    swagger_1.ApiOperation({ summary: 'Create Detection' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    common_1.Post(),
    openapi.ApiResponse({ status: 201, type: require("../../detection/schemas/detection.schema").Detection }),
    __param(0, common_1.Body()),
    __param(1, apikey_decorator_1.ApiKey('customer')),
    __param(2, apikey_decorator_1.ApiKey('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_thirdparty_detection_dto_1.CreateThirdpartyDetectionDto, String, String]),
    __metadata("design:returntype", Promise)
], ThirdpartyDetectionFromBinaryController.prototype, "create", null);
ThirdpartyDetectionFromBinaryController = __decorate([
    swagger_1.ApiTags('ThirdParty-Binary Controller (protected by x-api-key)'),
    swagger_1.ApiSecurity('x-api-key'),
    common_1.Controller('thirdparty-detection-from-binary'),
    __metadata("design:paramtypes", [thirdparty_detection_service_1.ThirdpartyDetectionService,
        sonickey_service_1.SonickeyService,
        detection_service_1.DetectionService])
], ThirdpartyDetectionFromBinaryController);
exports.ThirdpartyDetectionFromBinaryController = ThirdpartyDetectionFromBinaryController;
//# sourceMappingURL=thirdparty-detection-from-binary.controller.js.map