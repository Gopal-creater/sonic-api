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
exports.SonickeyGuestController = void 0;
const openapi = require("@nestjs/swagger");
const sonicKey_dto_1 = require("../dtos/sonicKey.dto");
const jsonparse_pipe_1 = require("../../../shared/pipes/jsonparse.pipe");
const common_1 = require("@nestjs/common");
const sonickey_service_1 = require("../services/sonickey.service");
const platform_express_1 = require("@nestjs/platform-express");
const makeDir = require("make-dir");
const multer_1 = require("multer");
const config_1 = require("../../../config");
const swagger_1 = require("@nestjs/swagger");
const uniqid = require("uniqid");
const file_handler_service_1 = require("../../../shared/services/file-handler.service");
const public_encode_dto_1 = require("../dtos/public-encode.dto");
const public_decode_dto_1 = require("../dtos/public-decode.dto");
const Enums_1 = require("../../../constants/Enums");
const detection_service_1 = require("../../detection/detection.service");
let SonickeyGuestController = class SonickeyGuestController {
    constructor(sonicKeyService, fileHandlerService, detectionService) {
        this.sonicKeyService = sonicKeyService;
        this.fileHandlerService = fileHandlerService;
        this.detectionService = detectionService;
    }
    encode(sonicKeyDto, file, req) {
        const channel = Enums_1.ChannelEnums.MOBILEAPP;
        console.log('file', file);
        const owner = 'guest';
        const licenseId = 'guest_license';
        return this.sonicKeyService
            .encodeAndUploadToS3(file, owner, sonicKeyDto.encodingStrength, Enums_1.S3ACL.PUBLIC_READ)
            .then(async (data) => {
            var _a;
            const sonicKeyDtoWithMeta = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto);
            const newSonicKey = new this.sonicKeyService.sonicKeyModel(Object.assign(Object.assign({}, sonicKeyDtoWithMeta), { contentFilePath: (_a = data.s3UploadResult) === null || _a === void 0 ? void 0 : _a.Location, s3FileMeta: data.s3UploadResult, s3OriginalFileMeta: data.s3OriginalFileUploadResult, originalFileName: file === null || file === void 0 ? void 0 : file.originalname, fingerPrintMetaData: data.fingerPrintMetaData, fingerPrintStatus: data.fingerPrintStatus, fingerPrintErrorData: data.fingerPrintErrorData, owner: owner, channel: channel, sonicKey: data.sonicKey, _id: data.sonicKey, license: licenseId }));
            return newSonicKey.save();
        })
            .finally(() => {
            this.fileHandlerService.deleteFileAtPath(file.path);
        });
    }
    async decode(file) {
        return this.sonicKeyService
            .decodeAllKeys(file)
            .then(async ({ sonicKeys }) => {
            var e_1, _a;
            console.log('Detected keys from Decode', sonicKeys);
            var sonicKeysMetadata = [];
            try {
                for (var sonicKeys_1 = __asyncValues(sonicKeys), sonicKeys_1_1; sonicKeys_1_1 = await sonicKeys_1.next(), !sonicKeys_1_1.done;) {
                    const sonicKey = sonicKeys_1_1.value;
                    const validSonicKey = await this.sonicKeyService.findBySonicKey(sonicKey.sonicKey);
                    if (!validSonicKey) {
                        continue;
                    }
                    const newDetection = await this.detectionService.detectionModel.create({
                        sonicKey: sonicKey.sonicKey,
                        owner: validSonicKey.owner,
                        sonicKeyOwnerId: validSonicKey.owner,
                        sonicKeyOwnerName: validSonicKey.contentOwner,
                        channel: Enums_1.ChannelEnums.MOBILEAPP,
                        detectedTimestamps: sonicKey.timestamps,
                        detectedAt: new Date(),
                    });
                    await newDetection.save().catch((err) => {
                        console.log("error", err);
                    });
                    sonicKeysMetadata.push(validSonicKey);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (sonicKeys_1_1 && !sonicKeys_1_1.done && (_a = sonicKeys_1.return)) await _a.call(sonicKeys_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return sonicKeysMetadata;
        });
    }
    async decodeV2(file) {
        return this.sonicKeyService
            .decodeAllKeys(file)
            .then(async ({ sonicKeys }) => {
            var e_2, _a;
            console.log('Detected keys from Decode', sonicKeys);
            var sonicKeysMetadata = [];
            try {
                for (var sonicKeys_2 = __asyncValues(sonicKeys), sonicKeys_2_1; sonicKeys_2_1 = await sonicKeys_2.next(), !sonicKeys_2_1.done;) {
                    const sonicKey = sonicKeys_2_1.value;
                    const validSonicKey = await this.sonicKeyService.findBySonicKey(sonicKey.sonicKey);
                    if (!validSonicKey) {
                        continue;
                    }
                    const newDetection = await this.detectionService.detectionModel.create({
                        sonicKey: sonicKey.sonicKey,
                        owner: validSonicKey.owner,
                        sonicKeyOwnerId: validSonicKey.owner,
                        sonicKeyOwnerName: validSonicKey.contentOwner,
                        channel: Enums_1.ChannelEnums.MOBILEAPP,
                        detectedTimestamps: sonicKey.timestamps,
                        detectedAt: new Date(),
                    });
                    const savedDetection = await newDetection.save();
                    savedDetection.sonicKey = validSonicKey;
                    sonicKeysMetadata.push(savedDetection);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (sonicKeys_2_1 && !sonicKeys_2_1.done && (_a = sonicKeys_2.return)) await _a.call(sonicKeys_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return sonicKeysMetadata;
        });
    }
};
__decorate([
    (0, swagger_1.ApiExcludeEndpoint)(true),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('mediaFile', {
        storage: (0, multer_1.diskStorage)({
            destination: async (req, file, cb) => {
                const currentUserId = 'guest';
                const imagePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/${currentUserId}`);
                await makeDir(`${config_1.appConfig.MULTER_DEST}/${currentUserId}/encodedFiles`);
                cb(null, imagePath);
            },
            filename: (req, file, cb) => {
                let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
                const randomName = uniqid();
                cb(null, `${randomName}-${orgName}`);
            },
        }),
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'File To Encode',
        type: public_encode_dto_1.PublicEncodeDto,
    }),
    (0, common_1.Post)('/encode'),
    (0, swagger_1.ApiOperation)({ summary: 'Encode File And save to database' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)('sonickey', jsonparse_pipe_1.JsonParsePipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sonicKey_dto_1.SonicKeyDto, Object, Object]),
    __metadata("design:returntype", void 0)
], SonickeyGuestController.prototype, "encode", null);
__decorate([
    (0, swagger_1.ApiExcludeEndpoint)(true),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('mediaFile', {
        storage: (0, multer_1.diskStorage)({
            destination: async (req, file, cb) => {
                const currentUserId = 'guest';
                const imagePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/${currentUserId}`);
                cb(null, imagePath);
            },
            filename: (req, file, cb) => {
                let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
                const randomName = uniqid();
                cb(null, `${randomName}-${orgName}`);
            },
        }),
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'File To Decode',
        type: public_decode_dto_1.PublicDecodeDto,
    }),
    (0, common_1.Post)('/decode'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Decode File and retrive key information' }),
    openapi.ApiResponse({ status: 201, type: [require("../schemas/sonickey.schema").SonicKey] }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SonickeyGuestController.prototype, "decode", null);
__decorate([
    (0, swagger_1.ApiExcludeEndpoint)(true),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('mediaFile', {
        storage: (0, multer_1.diskStorage)({
            destination: async (req, file, cb) => {
                const currentUserId = 'guest';
                const imagePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/${currentUserId}`);
                cb(null, imagePath);
            },
            filename: (req, file, cb) => {
                let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
                const randomName = uniqid();
                cb(null, `${randomName}-${orgName}`);
            },
        }),
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'File To Decode',
        type: public_decode_dto_1.PublicDecodeDto,
    }),
    (0, common_1.Version)('2'),
    (0, common_1.Post)('/decode'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Decode File and retrive key information' }),
    openapi.ApiResponse({ status: 201, type: [require("../../detection/schemas/detection.schema").Detection] }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SonickeyGuestController.prototype, "decodeV2", null);
SonickeyGuestController = __decorate([
    (0, swagger_1.ApiTags)('Public Controller'),
    (0, common_1.Controller)('sonic-keys-guest'),
    __metadata("design:paramtypes", [sonickey_service_1.SonickeyService,
        file_handler_service_1.FileHandlerService,
        detection_service_1.DetectionService])
], SonickeyGuestController);
exports.SonickeyGuestController = SonickeyGuestController;
//# sourceMappingURL=sonickey.guest.controller.js.map