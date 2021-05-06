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
const create_sonickey_dto_1 = require("../dtos/create-sonickey.dto");
const update_sonickey_dto_1 = require("../dtos/update-sonickey.dto");
const decode_dto_1 = require("../dtos/decode.dto");
const encode_dto_1 = require("../dtos/encode.dto");
const sonicKey_dto_1 = require("../dtos/sonicKey.dto");
const keygen_service_1 = require("../../../shared/modules/keygen/keygen.service");
const jsonparse_pipe_1 = require("../../../shared/pipes/jsonparse.pipe");
const common_1 = require("@nestjs/common");
const sonickey_service_1 = require("../services/sonickey.service");
const platform_express_1 = require("@nestjs/platform-express");
const makeDir = require("make-dir");
const multer_1 = require("multer");
const config_1 = require("../../../config");
const license_validation_guard_1 = require("../../auth/guards/license-validation.guard");
const swagger_1 = require("@nestjs/swagger");
const uniqid = require("uniqid");
const guards_1 = require("../../auth/guards");
const decorators_1 = require("../../auth/decorators");
const file_handler_service_1 = require("../../../shared/services/file-handler.service");
const download_dto_1 = require("../dtos/download.dto");
const appRootPath = require("app-root-path");
const query_dto_1 = require("../../../shared/dtos/query.dto");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
let SonickeyController = class SonickeyController {
    constructor(sonicKeyService, keygenService, fileHandlerService) {
        this.sonicKeyService = sonicKeyService;
        this.keygenService = keygenService;
        this.fileHandlerService = fileHandlerService;
    }
    async getAll(queryDto) {
        console.log("queryDto", queryDto);
        return this.sonicKeyService.getAll(queryDto);
    }
    async generateUniqueSonicKey() {
        return await this.sonicKeyService.generateUniqueSonicKey();
    }
    async createForJob(createSonicKeyDto, owner, req) {
        createSonicKeyDto.owner = owner;
        return this.sonicKeyService.createFromJob(createSonicKeyDto);
    }
    async getOwnersKeys(ownerId, queryDto) {
        const query = Object.assign(Object.assign({}, queryDto), { owner: ownerId });
        const keys = await this.sonicKeyService.getAll(query);
        return keys;
    }
    async getKeysByJob(jobId, queryDto) {
        const query = Object.assign(Object.assign({}, queryDto), { job: jobId });
        return await this.sonicKeyService.getAll(query);
    }
    async getCount(query) {
        return this.sonicKeyService.sonicKeyModel.estimatedDocumentCount(Object.assign({}, query));
    }
    async getOne(sonickey) {
        return this.sonicKeyService.findBySonicKeyOrFail(sonickey);
    }
    encode(sonicKeyDto, file, owner, req) {
        var _a;
        console.log('file', file);
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
            const newSonicKey = new this.sonicKeyService.sonicKeyModel(Object.assign(Object.assign({}, sonicKeyDtoWithAudioData), { contentFilePath: downloadFileUrl, owner: owner, sonicKey: sonicKey, licenseId: licenseId }));
            return newSonicKey.save().finally(() => {
                this.fileHandlerService.deleteFileAtPath(file.path);
            });
        })
            .catch(err => {
            this.fileHandlerService.deleteFileAtPath(file.path);
            throw new common_1.InternalServerErrorException(err);
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
        })
            .catch(err => {
            this.fileHandlerService.deleteFileAtPath(file.path);
            throw new common_1.BadRequestException(err);
        });
    }
    async updateMeta(sonickey, updateSonicKeyDto) {
        const updatedSonickey = await this.sonicKeyService.sonicKeyModel.findOneAndUpdate({ sonicKey: sonickey }, updateSonicKeyDto, { new: true });
        if (!updatedSonickey) {
            throw new common_1.NotFoundException();
        }
        return updatedSonickey;
    }
    async delete(sonickey) {
        const deletedSonickey = await this.sonicKeyService.sonicKeyModel.deleteOne({ sonicKey: sonickey });
        if (!deletedSonickey) {
            throw new common_1.NotFoundException();
        }
        return deletedSonickey;
    }
    async downloadFile(downloadDto, userId, response) {
        var _a;
        if (!((_a = downloadDto === null || downloadDto === void 0 ? void 0 : downloadDto.fileURL) === null || _a === void 0 ? void 0 : _a.includes(userId))) {
            throw new common_1.UnauthorizedException('You are not the owner of this file');
        }
        const filePath = `${appRootPath.toString()}/` + downloadDto.fileURL;
        console.log('file-path:', filePath);
        const isFileExist = await this.fileHandlerService.fileExistsAtPath(filePath);
        if (!isFileExist) {
            throw new common_1.BadRequestException('Sorry, file not found');
        }
        return response.sendFile(filePath, (err) => {
            if (err) {
                console.log(err);
                return response.status(400).json({ message: 'Error sending file.' });
            }
        });
    }
};
__decorate([
    common_1.Get('/'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get All Sonic Keys' }),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.QueryDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getAll", null);
__decorate([
    common_1.Get('/generate-unique-sonic-key'),
    swagger_1.ApiOperation({ summary: 'Generate unique sonic key' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "generateUniqueSonicKey", null);
__decorate([
    common_1.UseGuards(guards_1.JwtAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    common_1.Post('/create-from-job'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Save to database after local encode from job.' }),
    openapi.ApiResponse({ status: 201, type: require("../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.Body()),
    __param(1, decorators_1.User('sub')),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyFromJobDto, String, Object]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "createForJob", null);
__decorate([
    common_1.Get('/owners/:ownerId'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get All Sonic Keys of particular user' }),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto }),
    __param(0, common_1.Param('ownerId')), __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_dto_1.QueryDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getOwnersKeys", null);
__decorate([
    common_1.Get('/jobs/:jobId'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get All Sonic Keys of particular job' }),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto }),
    __param(0, common_1.Param('jobId')), __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_dto_1.QueryDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getKeysByJob", null);
__decorate([
    common_1.Get('/count'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get count of all sonickeys' }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getCount", null);
__decorate([
    common_1.Get('/:sonickey'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get Single SonicKey' }),
    openapi.ApiResponse({ status: 200, type: require("../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.Param('sonickey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getOne", null);
__decorate([
    common_1.UseInterceptors(platform_express_1.FileInterceptor('mediaFile', {
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
    openapi.ApiResponse({ status: 201, type: require("../schemas/sonickey.schema").SonicKey }),
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
    openapi.ApiResponse({ status: 200, type: require("../schemas/sonickey.schema").SonicKey }),
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
    openapi.ApiResponse({ status: 200, type: Object }),
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
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Body()),
    __param(1, decorators_1.User('sub')),
    __param(2, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [download_dto_1.DownloadDto, String, Object]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "downloadFile", null);
SonickeyController = __decorate([
    swagger_1.ApiTags('SonicKeys Controller'),
    common_1.Controller('sonic-keys'),
    __metadata("design:paramtypes", [sonickey_service_1.SonickeyService,
        keygen_service_1.KeygenService,
        file_handler_service_1.FileHandlerService])
], SonickeyController);
exports.SonickeyController = SonickeyController;
//# sourceMappingURL=sonickey.controller.js.map