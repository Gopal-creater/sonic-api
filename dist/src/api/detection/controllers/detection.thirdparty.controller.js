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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
const radiostation_service_1 = require("../../radiostation/services/radiostation.service");
let DetectionThirdPartyController = class DetectionThirdPartyController {
    constructor(sonickeyServive, detectionService, radiostationService) {
        this.sonickeyServive = sonickeyServive;
        this.detectionService = detectionService;
        this.radiostationService = radiostationService;
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
            company: isKeyFound.company,
            partner: isKeyFound.partner,
            sonicKeyOwnerId: isKeyFound.owner,
            sonicKeyOwnerName: isKeyFound.contentOwner,
            channel: Enums_1.ChannelEnums.BINARY,
        });
        return newDetection.save();
    }
    async createThirdPartyRadioDetectionFromBinary(createThirdPartyStreamReaderDetectionFromBinaryDto, customer, apiKey) {
        var { sonicKey, detectedAt, metaData, thirdpartyStreamReaderDetection, } = createThirdPartyStreamReaderDetectionFromBinaryDto;
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
            metaData: metaData,
            apiKey: apiKey,
            owner: isKeyFound.owner,
            company: isKeyFound.company,
            partner: isKeyFound.partner,
            sonicKeyOwnerId: isKeyFound.owner,
            sonicKeyOwnerName: isKeyFound.contentOwner,
            channel: Enums_1.ChannelEnums.THIRDPARTY_STREAMREADER,
            thirdpartyStreamReaderDetection: thirdpartyStreamReaderDetection,
        });
        return newDetection.save();
    }
    async createThirdPartyRadioDetectionFromLamda(createThirdPartyStreamReaderDetectionFromLamdaDto, customer, apiKey) {
        var e_1, _a;
        var { decodeResponsesFromBinary, radioStation, detectedAt, metaData, detectionSourceFileName, streamDetectionInterval, } = createThirdPartyStreamReaderDetectionFromLamdaDto;
        const isValidRadioStation = await this.radiostationService.radioStationModel.findById(radioStation);
        if (!isValidRadioStation) {
            throw new common_1.NotFoundException('Given radio doesnot exists in our database');
        }
        var detectionOrigins = [];
        var isAlreadyDetectionWithSameDetectionSourceFileName = await this.detectionService.detectionModel.findOne({
            radioStation: radioStation,
            detectionSourceFileName: detectionSourceFileName
        });
        if (isAlreadyDetectionWithSameDetectionSourceFileName) {
            detectionOrigins = isAlreadyDetectionWithSameDetectionSourceFileName.detectionOrigins;
        }
        detectionOrigins.push(Enums_1.DETECTION_ORIGINS.SONICKEY);
        var savedKeys = [];
        var errorKeys = [];
        try {
            for (var decodeResponsesFromBinary_1 = __asyncValues(decodeResponsesFromBinary), decodeResponsesFromBinary_1_1; decodeResponsesFromBinary_1_1 = await decodeResponsesFromBinary_1.next(), !decodeResponsesFromBinary_1_1.done;) {
                const decodeRes = decodeResponsesFromBinary_1_1.value;
                const isKeyPresent = await this.sonickeyServive.findBySonicKey(decodeRes.sonicKey);
                if (isKeyPresent) {
                    const sonicKeyContentDurationInSec = isKeyPresent.contentDuration || 60;
                    var detection = await this.detectionService.detectionModel.findOne({
                        radioStation: radioStation,
                        sonicKey: decodeRes.sonicKey,
                        detectedAt: {
                            $gt: new Date(new Date().getTime() - 1000 * sonicKeyContentDurationInSec),
                        },
                    });
                    if (detection &&
                        detection.detectedDuration < sonicKeyContentDurationInSec) {
                        detection.detectedDuration =
                            detection.detectedDuration + streamDetectionInterval >
                                sonicKeyContentDurationInSec
                                ? sonicKeyContentDurationInSec
                                : detection.detectedDuration + streamDetectionInterval;
                        detection.detectionSourceFileName = detectionSourceFileName;
                        detection.detectionOrigins = detectionOrigins;
                        detection.detectedTimestamps = [
                            ...detection.detectedTimestamps,
                            ...decodeRes.timestamps || [],
                        ];
                        detection.metaData = Object.assign(Object.assign({}, detection.metaData), metaData);
                    }
                    else {
                        detection = await this.detectionService.detectionModel.create({
                            radioStation: radioStation,
                            sonicKey: decodeRes.sonicKey,
                            owner: isKeyPresent.owner,
                            company: isKeyPresent.company,
                            partner: isKeyPresent.partner,
                            sonicKeyOwnerId: isKeyPresent.owner,
                            sonicKeyOwnerName: isKeyPresent.contentOwner,
                            channel: Enums_1.ChannelEnums.STREAMREADER,
                            detectedDuration: streamDetectionInterval,
                            detectedTimestamps: decodeRes.timestamps,
                            detectedAt: detectedAt || new Date(),
                            detectionSourceFileName: detectionSourceFileName,
                            detectionOrigins: detectionOrigins,
                            apiKey: apiKey,
                            metaData: metaData,
                        });
                    }
                    await detection
                        .save()
                        .then(() => {
                        savedKeys.push(decodeRes.sonicKey);
                    })
                        .catch(err => { });
                }
                else {
                    errorKeys.push(decodeRes.sonicKey);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (decodeResponsesFromBinary_1_1 && !decodeResponsesFromBinary_1_1.done && (_a = decodeResponsesFromBinary_1.return)) await _a.call(decodeResponsesFromBinary_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return {
            savedSonicKeys: savedKeys,
            errorOrNotFoundSonicKeys: errorKeys
        };
    }
    async createThirdPartyRadioDetectionFromFingerPrint(createThirdPartyStreamReaderDetectionFromFingerPrintDto, customer) {
        var e_2, _a;
        var { decodeResponsesFromFingerPrint, radioStation, detectedAt, metaData, detectionSourceFileName, streamDetectionInterval, } = createThirdPartyStreamReaderDetectionFromFingerPrintDto;
        const isValidRadioStation = await this.radiostationService.radioStationModel.findById(radioStation);
        if (!isValidRadioStation) {
            throw new common_1.NotFoundException('Given radio doesnot exists in our database');
        }
        var detectionOrigins = [];
        var isAlreadyDetectionWithSameDetectionSourceFileName = await this.detectionService.detectionModel.findOne({
            radioStation: radioStation,
            detectionSourceFileName: detectionSourceFileName
        });
        if (isAlreadyDetectionWithSameDetectionSourceFileName) {
            detectionOrigins = isAlreadyDetectionWithSameDetectionSourceFileName.detectionOrigins;
        }
        detectionOrigins.push(Enums_1.DETECTION_ORIGINS.FINGERPRINT);
        var savedKeys = [];
        var errorKeys = [];
        try {
            for (var decodeResponsesFromFingerPrint_1 = __asyncValues(decodeResponsesFromFingerPrint), decodeResponsesFromFingerPrint_1_1; decodeResponsesFromFingerPrint_1_1 = await decodeResponsesFromFingerPrint_1.next(), !decodeResponsesFromFingerPrint_1_1.done;) {
                const decodeRes = decodeResponsesFromFingerPrint_1_1.value;
                const isKeyPresent = await this.sonickeyServive.findOne({
                    "fingerPrintMetaData.song_id": decodeRes.songId
                });
                if (isKeyPresent) {
                    const sonicKeyContentDurationInSec = isKeyPresent.contentDuration || 60;
                    var detection = await this.detectionService.detectionModel.findOne({
                        radioStation: radioStation,
                        sonicKey: isKeyPresent.sonicKey,
                        detectedAt: {
                            $gt: new Date(new Date().getTime() - 1000 * sonicKeyContentDurationInSec),
                        },
                    });
                    if (detection &&
                        detection.detectedDuration < sonicKeyContentDurationInSec) {
                        detection.detectedDuration =
                            detection.detectedDuration + streamDetectionInterval >
                                sonicKeyContentDurationInSec
                                ? sonicKeyContentDurationInSec
                                : detection.detectedDuration + streamDetectionInterval;
                        detection.detectionSourceFileName = detectionSourceFileName;
                        detection.detectionOrigins = detectionOrigins;
                        detection.detectedTimestamps = [
                            ...detection.detectedTimestamps,
                            ...decodeRes.timestamps || [],
                        ];
                        detection.metaData = Object.assign(Object.assign({}, detection.metaData), metaData);
                    }
                    else {
                        detection = await this.detectionService.detectionModel.create({
                            radioStation: radioStation,
                            sonicKey: isKeyPresent.sonicKey,
                            owner: isKeyPresent.owner,
                            company: isKeyPresent.company,
                            partner: isKeyPresent.partner,
                            sonicKeyOwnerId: isKeyPresent.owner,
                            sonicKeyOwnerName: isKeyPresent.contentOwner,
                            channel: Enums_1.ChannelEnums.STREAMREADER,
                            detectedDuration: streamDetectionInterval,
                            detectedTimestamps: decodeRes.timestamps,
                            detectedAt: detectedAt || new Date(),
                            detectionSourceFileName: detectionSourceFileName,
                            detectionOrigins: detectionOrigins,
                            metaData: metaData,
                        });
                    }
                    await detection
                        .save()
                        .then(() => {
                        savedKeys.push(isKeyPresent.sonicKey);
                    })
                        .catch(err => { });
                }
                else {
                    errorKeys.push(decodeRes.songId);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (decodeResponsesFromFingerPrint_1_1 && !decodeResponsesFromFingerPrint_1_1.done && (_a = decodeResponsesFromFingerPrint_1.return)) await _a.call(decodeResponsesFromFingerPrint_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return {
            savedSonicKeys: savedKeys,
            errorOrNotFoundSongIds: errorKeys
        };
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
            company: isKeyFound.company,
            partner: isKeyFound.partner,
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
    swagger_1.ApiSecurity('x-api-key'),
    common_1.Post('detection-from-binary'),
    openapi.ApiResponse({ status: 201, type: Object }),
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
    swagger_1.ApiSecurity('x-api-key'),
    common_1.Post('stream-detection-from-binary'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __param(2, apikey_decorator_1.ApiKey('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateThirdPartyStreamReaderDetectionFromBinaryDto, String, String]),
    __metadata("design:returntype", Promise)
], DetectionThirdPartyController.prototype, "createThirdPartyRadioDetectionFromBinary", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Create Stream Detection From Lamda Function' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    swagger_1.ApiSecurity('x-api-key'),
    common_1.Post('stream-detection-from-lamda'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __param(2, apikey_decorator_1.ApiKey('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateThirdPartyStreamReaderDetectionFromLamdaDto, String, String]),
    __metadata("design:returntype", Promise)
], DetectionThirdPartyController.prototype, "createThirdPartyRadioDetectionFromLamda", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Create Stream Detection From Fingerprint Function' }),
    common_1.Post('stream-detection-from-fingerprint'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Body()),
    __param(1, user_decorator_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detection_dto_1.CreateThirdPartyStreamReaderDetectionFromFingerPrintDto, String]),
    __metadata("design:returntype", Promise)
], DetectionThirdPartyController.prototype, "createThirdPartyRadioDetectionFromFingerPrint", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Create Detection From Hardware' }),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    swagger_1.ApiSecurity('x-api-key'),
    common_1.Post('detection-from-hardware'),
    openapi.ApiResponse({ status: 201, type: Object }),
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
        detection_service_1.DetectionService,
        radiostation_service_1.RadiostationService])
], DetectionThirdPartyController);
exports.DetectionThirdPartyController = DetectionThirdPartyController;
//# sourceMappingURL=detection.thirdparty.controller.js.map