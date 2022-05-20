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
const jsonparse_pipe_1 = require("../../../shared/pipes/jsonparse.pipe");
const common_1 = require("@nestjs/common");
const sonickey_service_1 = require("../services/sonickey.service");
const platform_express_1 = require("@nestjs/platform-express");
const makeDir = require("make-dir");
const multer_1 = require("multer");
const config_1 = require("../../../config");
const swagger_1 = require("@nestjs/swagger");
const uniqid = require("uniqid");
const guards_1 = require("../../auth/guards");
const decorators_1 = require("../../auth/decorators");
const file_handler_service_1 = require("../../../shared/services/file-handler.service");
const download_dto_1 = require("../dtos/download.dto");
const appRootPath = require("app-root-path");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
const Enums_1 = require("../../../constants/Enums");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
const detection_service_1 = require("../../detection/detection.service");
const FileFromUrl_interceptor_1 = require("../../../shared/interceptors/FileFromUrl.interceptor");
const license_validation_guard_1 = require("../../licensekey/guards/license-validation.guard");
const validatedlicense_decorator_1 = require("../../licensekey/decorators/validatedlicense.decorator");
const conditional_auth_guard_1 = require("../../auth/guards/conditional-auth.guard");
const detection_schema_1 = require("../../detection/schemas/detection.schema");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const user_db_schema_1 = require("../../user/schemas/user.db.schema");
const mongoose_utils_1 = require("../../../shared/utils/mongoose.utils");
const _ = require("lodash");
const job_license_validation_guard_1 = require("../../licensekey/guards/job-license-validation.guard");
const apikey_auth_guard_1 = require("../../auth/guards/apikey-auth.guard");
let SonickeyController = class SonickeyController {
    constructor(sonicKeyService, licensekeyService, fileHandlerService, detectionService) {
        this.sonicKeyService = sonicKeyService;
        this.licensekeyService = licensekeyService;
        this.fileHandlerService = fileHandlerService;
        this.detectionService = detectionService;
    }
    async getAll(parsedQueryDto) {
        return this.sonicKeyService.getAll(parsedQueryDto);
    }
    async encodeToSonicFromPath(company, client, owner, license, encodeFromQueueDto) {
        if (client !== owner) {
            throw new common_1.BadRequestException("client not matched with apikey's owner");
        }
        owner = owner;
        company = company;
        license = license;
        return this.sonicKeyService.encodeBulkWithQueue(owner, company, license, encodeFromQueueDto);
    }
    async getJobStatusFromQueue(companyId, jobId) {
        const job = await this.sonicKeyService.getJobStatus(jobId);
        if (!job) {
            throw new common_1.NotFoundException('Job doesnot exists or already completed');
        }
        if (job.failedReason) {
            return {
                completed: false,
                error: true,
                failedReason: job.failedReason,
                stacktrace: job.stacktrace,
                job: job,
            };
        }
        if (job.finishedOn) {
            return {
                completed: true,
                job: job,
            };
        }
        else {
            return {
                completed: false,
                job: job,
            };
        }
    }
    generateUniqueSonicKey() {
        return this.sonicKeyService.generateUniqueSonicKey();
    }
    async fileDownloadTest() {
        return this.sonicKeyService.testDownloadFile();
    }
    async createForJob(createSonicKeyDto, owner, req) {
        createSonicKeyDto.owner = owner;
        return this.sonicKeyService.createFromJob(createSonicKeyDto);
    }
    async listSonickeys(parsedQueryDto) {
        return this.sonicKeyService.getAll(parsedQueryDto);
    }
    async getOwnersKeys(ownerId, user, parsedQueryDto) {
        var includeCompanies = parsedQueryDto.filter['includeCompanies'];
        delete parsedQueryDto.filter['includeCompanies'];
        if (includeCompanies == false) {
            parsedQueryDto.relationalFilter = _.merge({}, parsedQueryDto.relationalFilter, {
                $or: [{ 'owner._id': user._id }],
            });
        }
        else {
            const userCompaniesIds = user.companies.map(com => mongoose_utils_1.toObjectId(com._id));
            parsedQueryDto.relationalFilter = _.merge({}, parsedQueryDto.relationalFilter, {
                $or: [
                    { 'owner._id': user._id },
                    { 'owner.companies': { $in: userCompaniesIds } },
                ],
            });
        }
        return this.sonicKeyService.getAll(parsedQueryDto);
    }
    async getKeysByJob(jobId, parsedQueryDto) {
        parsedQueryDto.filter['job'] = jobId;
        return this.sonicKeyService.getAll(parsedQueryDto);
    }
    async getCount(queryDto) {
        return this.sonicKeyService.getCount(queryDto);
    }
    async getEstimateCount() {
        return this.sonicKeyService.getEstimateCount();
    }
    async getOne(sonickey) {
        return this.sonicKeyService.findBySonicKeyOrFail(sonickey);
    }
    encode(sonicKeyDto, file, owner, req) {
        var _a;
        const licenseId = (_a = req === null || req === void 0 ? void 0 : req.validLicense) === null || _a === void 0 ? void 0 : _a.key;
        var s3UploadResult;
        var s3OriginalFileUploadResult;
        var sonicKey;
        var fingerPrintMetaData;
        var fingerPrintErrorData;
        var fingerPrintStatus;
        return this.sonicKeyService
            .encodeAndUploadToS3(file, owner, sonicKeyDto.encodingStrength)
            .then(data => {
            s3UploadResult = data.s3UploadResult;
            s3OriginalFileUploadResult = data.s3OriginalFileUploadResult;
            sonicKey = data.sonicKey;
            fingerPrintMetaData = data.fingerPrintMetaData;
            fingerPrintStatus = data.fingerPrintStatus;
            fingerPrintErrorData = data.fingerPrintErrorData;
            console.log('Increment Usages upon successfull encode');
            return this.licensekeyService.incrementUses(licenseId, 'encode', 1);
        })
            .then(async (result) => {
            console.log('Going to save key in db.');
            const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto);
            const channel = Enums_1.ChannelEnums.PORTAL;
            const newSonicKey = Object.assign(Object.assign({}, sonicKeyDtoWithAudioData), { contentFilePath: s3UploadResult.Location, originalFileName: file === null || file === void 0 ? void 0 : file.originalname, owner: owner, sonicKey: sonicKey, channel: channel, downloadable: true, s3FileMeta: s3UploadResult, s3OriginalFileMeta: s3OriginalFileUploadResult, fingerPrintMetaData: fingerPrintMetaData, fingerPrintErrorData: fingerPrintErrorData, fingerPrintStatus: fingerPrintStatus, _id: sonicKey, license: licenseId });
            return this.sonicKeyService.saveSonicKeyForUser(owner, newSonicKey);
        })
            .catch(err => {
            throw new common_1.InternalServerErrorException(err);
        })
            .finally(() => {
            this.fileHandlerService.deleteFileAtPath(file.path);
        });
    }
    encodeFromUrl(sonicKeyDto, file, owner, licenseId) {
        var s3UploadResult;
        var s3OriginalFileUploadResult;
        var sonicKey;
        var fingerPrintStatus;
        var fingerPrintMetaData;
        var fingerPrintErrorData;
        return this.sonicKeyService
            .encodeAndUploadToS3(file, owner, sonicKeyDto.encodingStrength)
            .then(data => {
            s3UploadResult = data.s3UploadResult;
            s3OriginalFileUploadResult = data.s3OriginalFileUploadResult;
            sonicKey = data.sonicKey;
            fingerPrintMetaData = data.fingerPrintMetaData;
            fingerPrintStatus = data.fingerPrintStatus;
            fingerPrintErrorData = data.fingerPrintErrorData;
            console.log('Increment Usages upon successfull encode');
            return this.licensekeyService.incrementUses(licenseId, 'encode', 1);
        })
            .then(async (result) => {
            console.log('Going to save key in db.');
            const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto);
            const channel = Enums_1.ChannelEnums.PORTAL;
            const newSonicKey = Object.assign(Object.assign({}, sonicKeyDtoWithAudioData), { contentFilePath: s3UploadResult.Location, originalFileName: file === null || file === void 0 ? void 0 : file.originalname, owner: owner, sonicKey: sonicKey, channel: channel, downloadable: true, s3FileMeta: s3UploadResult, s3OriginalFileMeta: s3OriginalFileUploadResult, fingerPrintMetaData: fingerPrintMetaData, fingerPrintErrorData: fingerPrintErrorData, fingerPrintStatus: fingerPrintStatus, _id: sonicKey, license: licenseId });
            return this.sonicKeyService.saveSonicKeyForUser(owner, newSonicKey);
        })
            .catch(err => {
            throw new common_1.InternalServerErrorException(err);
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
                        channel: Enums_1.ChannelEnums.PORTAL,
                        detectedTimestamps: sonicKey.timestamps,
                        detectedAt: new Date(),
                    });
                    await newDetection.save();
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
        })
            .catch(err => {
            this.fileHandlerService.deleteFileAtPath(file.path);
            throw new common_1.BadRequestException(err);
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
                        channel: Enums_1.ChannelEnums.PORTAL,
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
        })
            .catch(err => {
            this.fileHandlerService.deleteFileAtPath(file.path);
            throw new common_1.BadRequestException(err);
        });
    }
    async decodeFromChannel(file, channel) {
        return this.sonicKeyService
            .decodeAllKeys(file)
            .then(async ({ sonicKeys }) => {
            var e_3, _a;
            console.log('Detected keys from Decode', sonicKeys);
            var sonicKeysMetadata = [];
            try {
                for (var sonicKeys_3 = __asyncValues(sonicKeys), sonicKeys_3_1; sonicKeys_3_1 = await sonicKeys_3.next(), !sonicKeys_3_1.done;) {
                    const sonicKey = sonicKeys_3_1.value;
                    const validSonicKey = await this.sonicKeyService.findBySonicKey(sonicKey.sonicKey);
                    if (!validSonicKey) {
                        continue;
                    }
                    const newDetection = await this.detectionService.detectionModel.create({
                        sonicKey: sonicKey,
                        owner: validSonicKey.owner,
                        sonicKeyOwnerId: validSonicKey.owner,
                        sonicKeyOwnerName: validSonicKey.contentOwner,
                        channel: channel,
                        detectedAt: new Date(),
                        detectedTimestamps: sonicKey.timestamps,
                    });
                    await newDetection.save();
                    sonicKeysMetadata.push(validSonicKey);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (sonicKeys_3_1 && !sonicKeys_3_1.done && (_a = sonicKeys_3.return)) await _a.call(sonicKeys_3);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return sonicKeysMetadata;
        })
            .catch(err => {
            this.fileHandlerService.deleteFileAtPath(file.path);
            throw new common_1.BadRequestException(err);
        });
    }
    async decodeFromChannelV2(file, channel) {
        return this.sonicKeyService
            .decodeAllKeys(file)
            .then(async ({ sonicKeys }) => {
            var e_4, _a;
            console.log('Detected keys from Decode', sonicKeys);
            var sonicKeysMetadata = [];
            try {
                for (var sonicKeys_4 = __asyncValues(sonicKeys), sonicKeys_4_1; sonicKeys_4_1 = await sonicKeys_4.next(), !sonicKeys_4_1.done;) {
                    const sonicKey = sonicKeys_4_1.value;
                    const validSonicKey = await this.sonicKeyService.findBySonicKey(sonicKey.sonicKey);
                    if (!validSonicKey) {
                        continue;
                    }
                    const newDetection = await this.detectionService.detectionModel.create({
                        sonicKey: sonicKey,
                        owner: validSonicKey.owner,
                        sonicKeyOwnerId: validSonicKey.owner,
                        sonicKeyOwnerName: validSonicKey.contentOwner,
                        channel: channel,
                        detectedAt: new Date(),
                        detectedTimestamps: sonicKey.timestamps,
                    });
                    const savedDetection = await newDetection.save();
                    savedDetection.sonicKey = validSonicKey;
                    sonicKeysMetadata.push(savedDetection);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (sonicKeys_4_1 && !sonicKeys_4_1.done && (_a = sonicKeys_4.return)) await _a.call(sonicKeys_4);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return sonicKeysMetadata;
        })
            .catch(err => {
            this.fileHandlerService.deleteFileAtPath(file.path);
            throw new common_1.BadRequestException(err);
        });
    }
    async updateMeta(sonickey, updateSonicKeyDto, owner) {
        const updatedSonickey = await this.sonicKeyService.sonicKeyModel.findOneAndUpdate({ sonicKey: sonickey, owner: owner }, updateSonicKeyDto, { new: true });
        if (!updatedSonickey) {
            throw new common_1.NotFoundException('Given sonickey is either not present or doest not belongs to you');
        }
        return updatedSonickey;
    }
    async onFingerPrintSuccess(sonicKey, updateSonicKeyFingerPrintMetaDataDto) {
        const { fingerPrintMetaData } = updateSonicKeyFingerPrintMetaDataDto;
        const updatedSonickey = await this.sonicKeyService.sonicKeyModel.findOneAndUpdate({ sonicKey: sonicKey }, {
            fingerPrintMetaData: fingerPrintMetaData,
            fingerPrintStatus: Enums_1.FingerPrintStatus.SUCCESS,
        }, { new: true });
        if (!updatedSonickey) {
            throw new common_1.NotFoundException('Given sonickey is not found');
        }
        return updatedSonickey;
    }
    async onFingerPrintFailed(sonicKey, updateSonicKeyFingerPrintMetaDataDto) {
        const { fingerPrintMetaData } = updateSonicKeyFingerPrintMetaDataDto;
        const updatedSonickey = await this.sonicKeyService.sonicKeyModel.findOneAndUpdate({ sonicKey: sonicKey }, {
            fingerPrintErrorData: fingerPrintMetaData,
            fingerPrintStatus: Enums_1.FingerPrintStatus.FAILED,
        }, { new: true });
        if (!updatedSonickey) {
            throw new common_1.NotFoundException('Given sonickey is not found');
        }
        return updatedSonickey;
    }
    async delete(sonickey, owner) {
        const deletedSonickey = await this.sonicKeyService.sonicKeyModel.deleteOne({
            sonicKey: sonickey,
            owner: owner,
        });
        if (!deletedSonickey) {
            throw new common_1.NotFoundException('Given sonickey is either not present or doest not belongs to you');
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
        return response.sendFile(filePath, err => {
            if (err) {
                console.log(err);
                return response.status(400).json({ message: 'Error sending file.' });
            }
        });
    }
};
__decorate([
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    common_1.Get('/'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiQuery({ name: 'includeGroupData', type: Boolean, required: false }),
    swagger_1.ApiOperation({ summary: 'Get All Sonic Keys' }),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getAll", null);
__decorate([
    common_1.Post('/encode-bulk/companies/:companyId/clients/:clientId'),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard, job_license_validation_guard_1.BulkEncodeWithQueueLicenseValidationGuard),
    swagger_1.ApiSecurity('x-api-key'),
    swagger_1.ApiOperation({ summary: 'API for companies to import their media to sonic on behalf of their user' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Param('companyId')),
    __param(1, common_1.Param('clientId')),
    __param(2, decorators_1.User('sub')),
    __param(3, validatedlicense_decorator_1.ValidatedLicense('key')),
    __param(4, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, encode_dto_1.EncodeFromQueueDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "encodeToSonicFromPath", null);
__decorate([
    common_1.Get('/encode-bulk/companies/:companyId/get-job-status/:jobId'),
    common_1.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard),
    swagger_1.ApiSecurity('x-api-key'),
    swagger_1.ApiOperation({ summary: 'Get Job Status From Queue' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('companyId')),
    __param(1, common_1.Param('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getJobStatusFromQueue", null);
__decorate([
    common_1.Get('/generate-unique-sonic-key'),
    swagger_1.ApiOperation({ summary: 'Generate unique sonic key' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SonickeyController.prototype, "generateUniqueSonicKey", null);
__decorate([
    common_1.Get('/file-download-test'),
    swagger_1.ApiOperation({ summary: 'Generate unique sonic key' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "fileDownloadTest", null);
__decorate([
    common_1.UseGuards(guards_1.JwtAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    common_1.Post('/create-from-job'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Save to database after local encode from job.' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body()),
    __param(1, decorators_1.User('sub')),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyFromJobDto, String, Object]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "createForJob", null);
__decorate([
    decorators_1.RolesAllowed(Enums_1.Roles.ADMIN),
    common_1.Get('/list-sonickeys'),
    common_1.UseGuards(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'List Sonic Keys' }),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "listSonickeys", null);
__decorate([
    common_1.Get('/owners/:ownerId'),
    swagger_1.ApiQuery({ name: 'includeCompanies', type: Boolean, required: false }),
    swagger_1.ApiQuery({ name: 'limit', type: Number, required: false }),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({
        summary: 'Get All Sonic Keys of particular user or its companies',
    }),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto }),
    __param(0, common_1.Param('ownerId')),
    __param(1, decorators_1.User()),
    __param(2, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_db_schema_1.UserDB,
        parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getOwnersKeys", null);
__decorate([
    common_1.Get('/jobs/:jobId'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Get All Sonic Keys of particular job' }),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto }),
    __param(0, common_1.Param('jobId')),
    __param(1, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getKeysByJob", null);
__decorate([
    common_1.Get('/count'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiQuery({ name: 'includeGroupData', type: Boolean, required: false }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get count of all sonickeys also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getCount", null);
__decorate([
    common_1.Get('/estimate-count'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({
        summary: 'Get all count of all sonickeys',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getEstimateCount", null);
__decorate([
    common_1.Get('/:sonickey'),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiSecurity('x-api-key'),
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
                var _a;
                const currentUserId = (_a = req['user']) === null || _a === void 0 ? void 0 : _a['sub'];
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
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body('data', jsonparse_pipe_1.JsonParsePipe)),
    __param(1, common_1.UploadedFile()),
    __param(2, decorators_1.User('sub')),
    __param(3, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sonicKey_dto_1.SonicKeyDto, Object, String, Object]),
    __metadata("design:returntype", void 0)
], SonickeyController.prototype, "encode", null);
__decorate([
    common_1.UseInterceptors(FileFromUrl_interceptor_1.FileFromUrlInterceptor('mediaFile')),
    swagger_1.ApiBody({
        description: 'File To Encode',
        type: encode_dto_1.EncodeFromUrlDto,
    }),
    common_1.UseGuards(conditional_auth_guard_1.ConditionalAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    common_1.Post('/encode-from-url'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Encode File From URL And save to database' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body('data')),
    __param(1, FileFromUrl_interceptor_1.UploadedFileFromUrl()),
    __param(2, decorators_1.User('sub')),
    __param(3, validatedlicense_decorator_1.ValidatedLicense('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sonicKey_dto_1.SonicKeyDto, Object, String, String]),
    __metadata("design:returntype", void 0)
], SonickeyController.prototype, "encodeFromUrl", null);
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
    openapi.ApiResponse({ status: 201, type: [require("../schemas/sonickey.schema").SonicKey] }),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "decode", null);
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
    common_1.Version('2'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    common_1.Post('/decode'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Decode File and retrive key information' }),
    openapi.ApiResponse({ status: 201, type: [require("../../detection/schemas/detection.schema").Detection] }),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "decodeV2", null);
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
    common_1.Post(':channel/decode'),
    swagger_1.ApiParam({ name: 'channel', enum: [...Object.values(Enums_1.ChannelEnums)] }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Decode File and retrive key information' }),
    openapi.ApiResponse({ status: 201, type: [require("../schemas/sonickey.schema").SonicKey] }),
    __param(0, common_1.UploadedFile()),
    __param(1, common_1.Param('channel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "decodeFromChannel", null);
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
    common_1.Version('2'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    common_1.Post(':channel/decode'),
    swagger_1.ApiParam({ name: 'channel', enum: [...Object.values(Enums_1.ChannelEnums)] }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Decode File and retrive key information' }),
    openapi.ApiResponse({ status: 201, type: [require("../../detection/schemas/detection.schema").Detection] }),
    __param(0, common_1.UploadedFile()),
    __param(1, common_1.Param('channel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "decodeFromChannelV2", null);
__decorate([
    common_1.Patch('/:sonickey'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Update Sonic Keys meta data' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('sonickey')),
    __param(1, common_1.Body()),
    __param(2, decorators_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sonickey_dto_1.UpdateSonicKeyDto, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "updateMeta", null);
__decorate([
    common_1.Patch('/fingerprint-events/:sonicKey/success'),
    swagger_1.ApiOperation({
        summary: 'Call this endpoint on fingerprint success, only from fingerprint server',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('sonicKey')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sonickey_dto_1.UpdateSonicKeyFingerPrintMetaDataDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "onFingerPrintSuccess", null);
__decorate([
    common_1.Patch('/fingerprint-events/:sonicKey/failed'),
    swagger_1.ApiOperation({
        summary: 'Call this endpoint on fingerprint failed, only from fingerprint server',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('sonicKey')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sonickey_dto_1.UpdateSonicKeyFingerPrintMetaDataDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "onFingerPrintFailed", null);
__decorate([
    common_1.Delete('/:sonickey'),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Delete Sonic Key data' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('sonickey')),
    __param(1, decorators_1.User('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
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
        licensekey_service_1.LicensekeyService,
        file_handler_service_1.FileHandlerService,
        detection_service_1.DetectionService])
], SonickeyController);
exports.SonickeyController = SonickeyController;
//# sourceMappingURL=sonickey.controller.js.map