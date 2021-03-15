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
exports.SonickeyController = void 0;
const openapi = require("@nestjs/swagger");
const create_sonickey_dto_1 = require("./dtos/create-sonickey.dto");
const update_sonickey_dto_1 = require("./dtos/update-sonickey.dto");
const decode_dto_1 = require("./dtos/decode.dto");
const encode_dto_1 = require("./dtos/encode.dto");
const sonicKey_dto_1 = require("./dtos/sonicKey.dto");
const keygen_service_1 = require("./../../shared/modules/keygen/keygen.service");
const jsonparse_pipe_1 = require("./../../shared/pipes/jsonparse.pipe");
const common_1 = require("@nestjs/common");
const sonickey_service_1 = require("./sonickey.service");
const sonickey_schema_1 = require("../../schemas/sonickey.schema");
const platform_express_1 = require("@nestjs/platform-express");
const makeDir = require("make-dir");
const multer_1 = require("multer");
const config_1 = require("../../config");
const license_validation_guard_1 = require("../auth/guards/license-validation.guard");
const swagger_1 = require("@nestjs/swagger");
const uniqid = require("uniqid");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const file_handler_service_1 = require("../../shared/services/file-handler.service");
const download_dto_1 = require("./dtos/download.dto");
const appRootPath = require("app-root-path");
let SonickeyController = class SonickeyController {
    constructor(sonicKeyService, keygenService, fileHandlerService) {
        this.sonicKeyService = sonicKeyService;
        this.keygenService = keygenService;
        this.fileHandlerService = fileHandlerService;
    }
    async getAll() {
        return await this.sonicKeyService.getAll();
    }
    async create(createSonicKeyDto, owner, req) {
        var _a;
        if (!createSonicKeyDto.sonicKey) {
            throw new common_1.BadRequestException('sonicKey must be present');
        }
        const licenseId = (_a = req === null || req === void 0 ? void 0 : req.validLicense) === null || _a === void 0 ? void 0 : _a.id;
        return this.keygenService.incrementUsage(licenseId, 1)
            .then(async (keygenResult) => {
            if (keygenResult['errors']) {
                throw new common_1.BadRequestException('Unable to increment the license usage!');
            }
            console.log('Going to save key in db.');
            const dataToSave = new sonickey_schema_1.SonicKey(Object.assign(createSonicKeyDto, {
                owner: owner,
                licenseId: licenseId,
            }));
            return this.sonicKeyService.sonicKeyRepository
                .put(dataToSave);
        });
    }
    async getOwnersKeys(ownerId) {
        return await this.sonicKeyService.findByOwner(ownerId);
    }
    async getOne(sonickey) {
        return this.sonicKeyService.findBySonicKeyOrFail(sonickey);
    }
    encode(sonicKeyDto, file, owner, req) {
        var _a;
        console.log("file", file);
        const licenseId = (_a = req === null || req === void 0 ? void 0 : req.validLicense) === null || _a === void 0 ? void 0 : _a.id;
        var downloadFileUrl;
        var outFilePath;
        var sonicKey;
        return this.sonicKeyService
            .encode(file, sonicKeyDto.encodingStrength)
            .then(data => {
            downloadFileUrl = data.downloadFileUrl;
            outFilePath = data.outFilePath;
            sonicKey = data.sonicKey;
            console.log('Increment Usages upon successfull encode');
            return this.keygenService.incrementUsage(licenseId, 1);
        })
            .then(async (keygenResult) => {
            if (keygenResult['errors']) {
                throw new common_1.BadRequestException('Unable to increment the license usage!');
            }
            console.log('Going to save key in db.');
            const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto);
            const dataToSave = new sonickey_schema_1.SonicKey(Object.assign(sonicKeyDtoWithAudioData, {
                contentFilePath: downloadFileUrl,
                owner: owner,
                sonicKey: sonicKey,
                licenseId: licenseId,
            }));
            return this.sonicKeyService.sonicKeyRepository
                .put(dataToSave)
                .finally(() => {
                this.fileHandlerService.deleteFileAtPath(file.path);
            });
        });
    }
    async decode(file) {
        return this.sonicKeyService.decodeAllKeys(file).then(async ({ sonicKeys }) => {
            var e_1, _a;
            console.log("Detected keys from Decode", sonicKeys);
            var sonicKeysMetadata = [];
            try {
                for (var sonicKeys_1 = __asyncValues(sonicKeys), sonicKeys_1_1; sonicKeys_1_1 = await sonicKeys_1.next(), !sonicKeys_1_1.done;) {
                    const sonicKey = sonicKeys_1_1.value;
                    const metadata = await this.sonicKeyService.findBySonicKey(sonicKey);
                    if (!metadata) {
                        continue;
                    }
                    sonicKeysMetadata.push(metadata);
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
    async updateMeta(sonickey, updateSonicKeyDto) {
        const oldKey = await this.sonicKeyService.findBySonicKeyOrFail(sonickey);
        const dataToUpdate = new sonickey_schema_1.SonicKey(Object.assign(oldKey, updateSonicKeyDto));
        return this.sonicKeyService.sonicKeyRepository.update(dataToUpdate);
    }
    async delete(sonickey) {
        const found = await this.sonicKeyService.findBySonicKeyOrFail(sonickey);
        return this.sonicKeyService.sonicKeyRepository.delete(found);
    }
    async downloadFile(data, userId, response) {
        try {
            var checkForAuth = false;
            console.log('url', data.fileURL);
            console.log('uid', userId);
            if (data.fileURL.includes(userId)) {
                console.log('Inside if');
                checkForAuth = true;
            }
            if (checkForAuth == false) {
                throw new common_1.BadRequestException('You are not authenticated to download the file.');
            }
            if (!(data.contentType.includes('audio') || data.contentType.includes('video'))) {
                throw new common_1.BadRequestException('Only audio and video files are supported');
            }
            const filePath = `${appRootPath.toString()}` + data.fileURL;
            console.log('file-path:', filePath);
            const fileStream = await this.fileHandlerService.downloadFileFromPath(filePath);
            response.set({
                'Content-Type': data.contentType,
            });
            return fileStream.pipe(response).on('close', function (err) {
                console.log('Stream has been destroyed and file has been closed');
            });
        }
        catch (e) {
            throw new common_1.BadRequestException(e.message);
        }
    }
    async createTable() {
        return await this.sonicKeyService.sonicKeyRepository
            .ensureTableExistsAndCreate()
            .then(() => 'Created New Table');
    }
};
__decorate([
    common_1.Get('/'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get All Sonic Keys' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getAll", null);
__decorate([
    common_1.UseGuards(guards_1.JwtAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    common_1.Post('/'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Save to database after local encode.' }),
    openapi.ApiResponse({ status: 201, type: require("../../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.Body()),
    __param(1, decorators_1.User('sub')),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyDto, String, Object]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "create", null);
__decorate([
    common_1.Get('/owner/:ownerId'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get All Sonic Keys of particular user' }),
    openapi.ApiResponse({ status: 200, type: [require("../../schemas/sonickey.schema").SonicKey] }),
    __param(0, common_1.Param('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getOwnersKeys", null);
__decorate([
    common_1.Get('/:sonickey'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Single SonicKey' }),
    openapi.ApiResponse({ status: 200, type: require("../../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.Param('sonickey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getOne", null);
__decorate([
    common_1.UseInterceptors(platform_express_1.FileInterceptor('mediaFile', {
        fileFilter: (req, file, cb) => {
            const mimetype = file.mimetype;
            if (mimetype.includes('audio')) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Unsupported file type'), false);
            }
        },
        storage: multer_1.diskStorage({
            destination: async (req, file, cb) => {
                const currentUserId = req['user']['sub'];
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
    swagger_1.ApiConsumes('multipart/form-data'),
    swagger_1.ApiBody({
        description: 'File To Encode',
        type: encode_dto_1.EncodeDto,
    }),
    common_1.UseGuards(guards_1.JwtAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    common_1.Post('/encode'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Encode File And save to database' }),
    openapi.ApiResponse({ status: 201, type: require("../../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.Body('data', jsonparse_pipe_1.JsonParsePipe)),
    __param(1, common_1.UploadedFile()),
    __param(2, decorators_1.User('sub')),
    __param(3, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sonicKey_dto_1.SonicKeyDto, Object, String, Object]),
    __metadata("design:returntype", void 0)
], SonickeyController.prototype, "encode", null);
__decorate([
    common_1.UseInterceptors(platform_express_1.FileInterceptor('mediaFile', {
        fileFilter: (req, file, cb) => {
            const mimetype = file.mimetype;
            if (mimetype.includes('audio')) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Unsupported file type'), false);
            }
        },
        storage: multer_1.diskStorage({
            destination: async (req, file, cb) => {
                const currentUserId = req['user']['sub'];
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
    swagger_1.ApiConsumes('multipart/form-data'),
    swagger_1.ApiBody({
        description: 'File To Decode',
        type: decode_dto_1.DecodeDto,
    }),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    common_1.Post('/decode'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Decode File and retrive key information' }),
    openapi.ApiResponse({ status: 201, type: [Object] }),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "decode", null);
__decorate([
    common_1.Patch('/:sonickey'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Update Sonic Keys meta data' }),
    openapi.ApiResponse({ status: 200, type: require("../../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.Param('sonickey')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sonickey_dto_1.UpdateSonicKeyDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "updateMeta", null);
__decorate([
    common_1.Delete('/:sonickey'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Delete Sonic Key data' }),
    openapi.ApiResponse({ status: 200, type: require("../../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.Param('sonickey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "delete", null);
__decorate([
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Post('/download-file'),
    swagger_1.ApiOperation({ summary: 'Secure Download of a file' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body()), __param(1, decorators_1.User('sub')), __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [download_dto_1.DownloadDto, String, Object]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "downloadFile", null);
__decorate([
    common_1.Get('/new/create-table'),
    swagger_1.ApiOperation({ summary: 'Create Sonic Key table in Dynamo DB' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "createTable", null);
SonickeyController = __decorate([
    swagger_1.ApiTags('SonicKeys Contrller'),
    common_1.Controller('sonic-keys'),
    __metadata("design:paramtypes", [sonickey_service_1.SonickeyService,
        keygen_service_1.KeygenService,
        file_handler_service_1.FileHandlerService])
], SonickeyController);
exports.SonickeyController = SonickeyController;
//# sourceMappingURL=sonickey.controller.js.map