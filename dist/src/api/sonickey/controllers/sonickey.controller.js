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
const nanoid_1 = require("nanoid");
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
const FileFromTrack_interceptor_1 = require("../../../shared/interceptors/FileFromTrack.interceptor");
const license_validation_guard_1 = require("../../licensekey/guards/license-validation.guard");
const validatedlicense_decorator_1 = require("../../licensekey/decorators/validatedlicense.decorator");
const conditional_auth_guard_1 = require("../../auth/guards/conditional-auth.guard");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const user_db_schema_1 = require("../../user/schemas/user.db.schema");
const job_license_validation_guard_1 = require("../../licensekey/guards/job-license-validation.guard");
const apikey_auth_guard_1 = require("../../auth/guards/apikey-auth.guard");
const utils_1 = require("../../../shared/utils");
const track_schema_1 = require("../../track/schemas/track.schema");
const encode_security_guard_1 = require("../guards/encode-security.guard");
const update_sonickey_security_guard_1 = require("../guards/update-sonickey-security.guard");
const delete_sonickey_security_guard_1 = require("../guards/delete-sonickey-security.guard");
const encode_security_interceptor_1 = require("../interceptors/encode-security.interceptor");
const apikey_decorator_1 = require("../../api-key/decorators/apikey.decorator");
const s3fileupload_service_1 = require("../../s3fileupload/s3fileupload.service");
let SonickeyController = class SonickeyController {
    constructor(sonicKeyService, licensekeyService, fileHandlerService, detectionService, s3FileUploadService) {
        this.sonicKeyService = sonicKeyService;
        this.licensekeyService = licensekeyService;
        this.fileHandlerService = fileHandlerService;
        this.detectionService = detectionService;
        this.s3FileUploadService = s3FileUploadService;
    }
    async getAll(parsedQueryDto, loggedInUser) {
        return this.sonicKeyService.getAll(parsedQueryDto);
    }
    async exportSonicKeys(res, parsedQueryDto, format, loggedInUser) {
        var _a, _b;
        if (!['xlsx', 'csv'].includes(format))
            throw new common_1.BadRequestException('Unsupported format');
        parsedQueryDto.limit =
            (parsedQueryDto === null || parsedQueryDto === void 0 ? void 0 : parsedQueryDto.limit) <= 2000 ? parsedQueryDto === null || parsedQueryDto === void 0 ? void 0 : parsedQueryDto.limit : 2000;
        if (((_a = parsedQueryDto.filter) === null || _a === void 0 ? void 0 : _a.channel) == 'ALL') {
            (_b = parsedQueryDto.filter) === null || _b === void 0 ? true : delete _b.channel;
        }
        const exportedFilePath = await this.sonicKeyService.exportSonicKeys(parsedQueryDto, format);
        const fileName = (0, utils_1.extractFileName)(exportedFilePath);
        res.download(exportedFilePath, `${fileName.split('_nameseperator_')[1]}`, err => {
            if (err) {
                this.fileHandlerService.deleteFileAtPath(exportedFilePath);
                res.send(err);
            }
            this.fileHandlerService.deleteFileAtPath(exportedFilePath);
        });
    }
    async getDownloadUrlByMetadata(parsedQueryDto, loggedInUser) {
        var _a;
        const { resourceOwnerObj, } = (0, utils_1.identifyDestinationFolderAndResourceOwnerFromUser)(loggedInUser);
        console.log('resourceOwnerObj', resourceOwnerObj);
        parsedQueryDto.filter = Object.assign(Object.assign({}, parsedQueryDto.filter), resourceOwnerObj);
        console.log('parsedQueryDto.filter', parsedQueryDto.filter);
        parsedQueryDto.sort = {
            createdAt: -1,
        };
        const sonicKey = await this.sonicKeyService.findOneAggregate(parsedQueryDto);
        if (!sonicKey) {
            throw new common_1.NotFoundException('Sonickey not found');
        }
        const downloadSignedUrl = await this.s3FileUploadService.getSignedUrl(sonicKey.s3FileMeta.Key, 60 * 10, (sonicKey === null || sonicKey === void 0 ? void 0 : sonicKey.contentFileName) || (sonicKey === null || sonicKey === void 0 ? void 0 : sonicKey.originalFileName));
        const encodeAgainForNextDownloadJobData = {
            trackId: (_a = sonicKey === null || sonicKey === void 0 ? void 0 : sonicKey.track) === null || _a === void 0 ? void 0 : _a._id,
            user: loggedInUser,
            sonicKeyDto: {},
            metaData: {
                purpose: 'Encode again for next download job',
            },
        };
        await this.sonicKeyService.sonicKeyQueue.add('encode_again', encodeAgainForNextDownloadJobData, { jobId: (0, nanoid_1.nanoid)(15) });
        return {
            sonicKey: sonicKey === null || sonicKey === void 0 ? void 0 : sonicKey._id,
            downloadUrl: downloadSignedUrl,
        };
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
    async create(createSonicKeyDto, loggedInUser, apiKey, licenseId) {
        const { sonicKey, channel, contentFileType, contentName, contentOwner, contentType, contentDuration, contentSize, contentEncoding, contentSamplingFrequency, contentFilePath, } = createSonicKeyDto;
        if (!sonicKey) {
            throw new common_1.BadRequestException('SonicKey is required');
        }
        if (!channel) {
            throw new common_1.BadRequestException('Channel is required');
        }
        const { resourceOwnerObj, } = (0, utils_1.identifyDestinationFolderAndResourceOwnerFromUser)(loggedInUser);
        const newTrack = Object.assign(Object.assign({ channel: channel, artist: contentOwner, title: contentName, fileType: contentType, mimeType: contentFileType, duration: contentDuration, fileSize: contentSize, encoding: contentEncoding, localFilePath: contentFilePath, samplingFrequency: contentSamplingFrequency, trackMetaData: createSonicKeyDto }, resourceOwnerObj), { createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub });
        var track = await this.sonicKeyService.trackService.findOne({
            mimeType: contentFileType,
            fileSize: contentSize,
            duration: contentDuration,
        });
        if (!track) {
            track = await this.sonicKeyService.trackService.create(newTrack);
        }
        const sonickeyDoc = Object.assign(Object.assign(Object.assign({}, createSonicKeyDto), resourceOwnerObj), { _id: createSonicKeyDto.sonicKey, apiKey: apiKey, license: licenseId, createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub, track: track === null || track === void 0 ? void 0 : track._id });
        const savedSonicKey = await this.sonicKeyService.create(sonickeyDoc);
        await this.licensekeyService
            .incrementUses(licenseId, 'encode', 1)
            .catch(async (err) => {
            await this.sonicKeyService.sonicKeyModel.deleteOne({
                _id: savedSonicKey.id,
            });
            throw new common_1.BadRequestException('Unable to increment the license usage!');
        });
        return savedSonicKey;
    }
    async createForJob(createSonicKeyDto, loggedInUser) {
        const { resourceOwnerObj, } = (0, utils_1.identifyDestinationFolderAndResourceOwnerFromUser)(loggedInUser);
        const sonickeyDoc = Object.assign(Object.assign(Object.assign({}, createSonicKeyDto), resourceOwnerObj), { _id: createSonicKeyDto.sonicKey, createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub });
        return this.sonicKeyService.create(sonickeyDoc);
    }
    async listSonickeys(parsedQueryDto) {
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
        const key = await this.sonicKeyService.findOne({ sonickey: sonickey });
        if (!key) {
            return new common_1.NotFoundException();
        }
        return key;
    }
    async encode(sonicKeyDto, file, loggedInUser, licenseId) {
        const { destinationFolder, resourceOwnerObj, } = (0, utils_1.identifyDestinationFolderAndResourceOwnerFromUser)(loggedInUser);
        const encodingStrength = sonicKeyDto.encodingStrength;
        const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto);
        const sonickeyDoc = Object.assign(Object.assign(Object.assign({}, sonicKeyDtoWithAudioData), resourceOwnerObj), { createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub });
        return this.sonicKeyService.encodeSonicKeyFromFile({
            file,
            licenseId,
            sonickeyDoc,
            encodingStrength,
            s3destinationFolder: destinationFolder,
        });
    }
    async encodeByFile(sonicKeyDto, file, loggedInUser, licenseId) {
        const { destinationFolder, resourceOwnerObj, } = (0, utils_1.identifyDestinationFolderAndResourceOwnerFromUser)(loggedInUser);
        const encodingStrength = sonicKeyDto.encodingStrength;
        const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto);
        const sonickeyDoc = Object.assign(Object.assign(Object.assign({}, sonicKeyDtoWithAudioData), resourceOwnerObj), { createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub });
        return this.sonicKeyService.encodeSonicKeyFromFile({
            file,
            licenseId,
            sonickeyDoc,
            encodingStrength,
            s3destinationFolder: destinationFolder,
        });
    }
    async encodeByTrack(sonicKeyDto, track, file, loggedInUser, licenseId) {
        const { destinationFolder, resourceOwnerObj, } = (0, utils_1.identifyDestinationFolderAndResourceOwnerFromUser)(loggedInUser);
        sonicKeyDto.contentFileType = sonicKeyDto.contentFileType || track.mimeType;
        sonicKeyDto.contentOwner = sonicKeyDto.contentOwner || track.artist;
        sonicKeyDto.contentName = sonicKeyDto.contentName || track.title;
        sonicKeyDto.contentDuration = sonicKeyDto.contentDuration || track.duration;
        sonicKeyDto.contentSize = sonicKeyDto.contentSize || track.fileSize;
        sonicKeyDto.contentType = sonicKeyDto.contentType || track.fileType;
        sonicKeyDto.contentEncoding = sonicKeyDto.contentEncoding || track.encoding;
        sonicKeyDto.contentSamplingFrequency =
            sonicKeyDto.contentSamplingFrequency || track.samplingFrequency;
        sonicKeyDto.originalFileName =
            sonicKeyDto.originalFileName || track.originalFileName;
        const encodingStrength = sonicKeyDto.encodingStrength;
        const sonickeyDoc = Object.assign(Object.assign(Object.assign({}, sonicKeyDto), resourceOwnerObj), { createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub });
        return this.sonicKeyService.encodeSonicKeyFromTrack({
            trackId: track === null || track === void 0 ? void 0 : track.id,
            file,
            licenseId,
            sonickeyDoc,
            encodingStrength,
            s3destinationFolder: destinationFolder,
        });
    }
    async encodeFromUrl(sonicKeyDto, file, loggedInUser, owner, licenseId) {
        const { destinationFolder, resourceOwnerObj, } = (0, utils_1.identifyDestinationFolderAndResourceOwnerFromUser)(loggedInUser);
        const encodingStrength = sonicKeyDto.encodingStrength;
        const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto);
        const sonickeyDoc = Object.assign(Object.assign(Object.assign({}, sonicKeyDtoWithAudioData), resourceOwnerObj), { createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub });
        return this.sonicKeyService.encodeSonicKeyFromFile({
            file,
            licenseId,
            sonickeyDoc,
            encodingStrength,
            s3destinationFolder: destinationFolder,
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
                        company: validSonicKey.company,
                        partner: validSonicKey.partner,
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
                        company: validSonicKey.company,
                        partner: validSonicKey.partner,
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
                        company: validSonicKey.company,
                        partner: validSonicKey.partner,
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
                        company: validSonicKey.company,
                        partner: validSonicKey.partner,
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
    async updateMeta(sonickey, updateSonicKeyDto, loggedInUser) {
        const key = await this.sonicKeyService.findOne({ sonicKey: sonickey });
        if (!key) {
            return new common_1.NotFoundException();
        }
        return this.sonicKeyService.update(key._id, Object.assign(Object.assign({}, updateSonicKeyDto), { updatedBy: loggedInUser.sub }));
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
        const key = await this.sonicKeyService.findOne({ sonicKey: sonickey });
        if (!key) {
            return new common_1.NotFoundException();
        }
        return this.sonicKeyService.sonicKeyModel.findByIdAndRemove(key._id);
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
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)({
        additionalHtmlDescription: `<div>
      To Get sonickeys for specific company ?company=companyId <br/>
      To Get sonickeys for specific partner ?partner=partnerId <br/>
      To Get sonickeys for specific user ?owner=ownerId
    <div>`,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'channel',
        enum: [...Object.values(Enums_1.ChannelEnums), 'ALL'],
        required: false,
    }),
    (0, common_1.Get)('/'),
    (0, decorators_1.RolesAllowed)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List Sonic Keys' }),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __param(1, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto,
        user_db_schema_1.UserDB]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getAll", null);
__decorate([
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)({
        additionalHtmlDescription: `<div>
      To Get sonickeys for specific company ?company=companyId <br/>
      To Get sonickeys for specific partner ?partner=partnerId <br/>
      To Get sonickeys for specific user ?owner=ownerId
    <div>`,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'channel',
        enum: [...Object.values(Enums_1.ChannelEnums), 'ALL'],
        required: false,
    }),
    (0, swagger_1.ApiParam)({ name: 'format', enum: ['xlsx', 'csv'] }),
    (0, common_1.Get)('/export-sonickeys/:format'),
    (0, decorators_1.RolesAllowed)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Export Sonic Keys' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __param(2, (0, common_1.Param)('format')),
    __param(3, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, parsedquery_dto_1.ParsedQueryDto, String, user_db_schema_1.UserDB]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "exportSonicKeys", null);
__decorate([
    (0, common_1.Get)('/get-download-url-by-metadata'),
    (0, common_1.UseGuards)(conditional_auth_guard_1.ConditionalAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        name: 'query',
        type: 'object',
        required: false,
    }),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, swagger_1.ApiOperation)({ summary: 'get download url by metadata' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __param(1, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto,
        user_db_schema_1.UserDB]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getDownloadUrlByMetadata", null);
__decorate([
    (0, common_1.Post)('/encode-bulk/companies/:companyId/clients/:clientId'),
    (0, common_1.UseGuards)(apikey_auth_guard_1.ApiKeyAuthGuard, job_license_validation_guard_1.BulkEncodeWithQueueLicenseValidationGuard),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, swagger_1.ApiOperation)({
        summary: 'API for companies to import their media to sonic on behalf of their user',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('clientId')),
    __param(2, (0, decorators_1.User)('sub')),
    __param(3, (0, validatedlicense_decorator_1.ValidatedLicense)('key')),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, encode_dto_1.EncodeFromQueueDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "encodeToSonicFromPath", null);
__decorate([
    (0, common_1.Get)('/encode-bulk/companies/:companyId/get-job-status/:jobId'),
    (0, common_1.UseGuards)(apikey_auth_guard_1.ApiKeyAuthGuard),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Job Status From Queue' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getJobStatusFromQueue", null);
__decorate([
    (0, common_1.Get)('/generate-unique-sonic-key'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate unique sonic key' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SonickeyController.prototype, "generateUniqueSonicKey", null);
__decorate([
    (0, common_1.UseGuards)(conditional_auth_guard_1.ConditionalAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    (0, common_1.Post)('/create-from-outside'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, swagger_1.ApiOperation)({
        summary: '[NEW]: Save to database after local encode. ',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.User)()),
    __param(2, (0, apikey_decorator_1.ApiKey)('_id')),
    __param(3, (0, validatedlicense_decorator_1.ValidatedLicense)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyDto,
        user_db_schema_1.UserDB, String, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    (0, common_1.Post)('/create-from-job'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Save to database after local encode from job desktop app.',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyFromJobDto,
        user_db_schema_1.UserDB]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "createForJob", null);
__decorate([
    (0, decorators_1.RolesAllowed)(Enums_1.Roles.ADMIN),
    (0, common_1.Get)('/list-sonickeys'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, swagger_1.ApiOperation)({ summary: 'List Sonic Keys' }),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "listSonickeys", null);
__decorate([
    (0, common_1.Get)('/jobs/:jobId'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get All Sonic Keys of particular job' }),
    openapi.ApiResponse({ status: 200, type: require("../dtos/mongoosepaginate-sonickey.dto").MongoosePaginateSonicKeyDto }),
    __param(0, (0, common_1.Param)('jobId')),
    __param(1, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getKeysByJob", null);
__decorate([
    (0, common_1.Get)('/count'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, anyapiquerytemplate_decorator_1.AnyApiQueryTemplate)(),
    (0, swagger_1.ApiQuery)({ name: 'includeGroupData', type: Boolean, required: false }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get count of all sonickeys also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, (0, common_1.Query)(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)('/estimate-count'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all count of all sonickeys',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getEstimateCount", null);
__decorate([
    (0, common_1.Get)('/:sonickey'),
    (0, common_1.UseGuards)(conditional_auth_guard_1.ConditionalAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Single SonicKey' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('sonickey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "getOne", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('mediaFile', {
        storage: (0, multer_1.diskStorage)({
            destination: async (req, file, cb) => {
                var _a, _b;
                const loggedInUser = req['user'];
                var filePath;
                if (loggedInUser.partner) {
                    filePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/partners/${(_a = loggedInUser.partner) === null || _a === void 0 ? void 0 : _a.id}`);
                }
                else if (loggedInUser.company) {
                    filePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/companies/${(_b = loggedInUser.company) === null || _b === void 0 ? void 0 : _b.id}`);
                }
                else {
                    filePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/${loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub}`);
                }
                cb(null, filePath);
            },
            filename: (req, file, cb) => {
                let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
                const randomName = uniqid();
                cb(null, `${randomName}-${orgName}`);
            },
        }),
    }), encode_security_interceptor_1.EncodeSecurityInterceptor),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'File To Encode',
        type: encode_dto_1.EncodeDto,
    }),
    (0, decorators_1.RolesAllowed)(),
    (0, common_1.UseGuards)(conditional_auth_guard_1.ConditionalAuthGuard, role_based_guard_1.RoleBasedGuard, license_validation_guard_1.LicenseValidationGuard),
    (0, common_1.Post)('/encode'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Encode File And save to database' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)('data', jsonparse_pipe_1.JsonParsePipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, decorators_1.User)()),
    __param(3, (0, validatedlicense_decorator_1.ValidatedLicense)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sonicKey_dto_1.SonicKeyDto, Object, user_db_schema_1.UserDB, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "encode", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('mediaFile', {
        storage: (0, multer_1.diskStorage)({
            destination: async (req, file, cb) => {
                var _a, _b;
                const loggedInUser = req['user'];
                var filePath;
                if (loggedInUser.partner) {
                    filePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/partners/${(_a = loggedInUser.partner) === null || _a === void 0 ? void 0 : _a.id}`);
                }
                else if (loggedInUser.company) {
                    filePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/companies/${(_b = loggedInUser.company) === null || _b === void 0 ? void 0 : _b.id}`);
                }
                else {
                    filePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/${loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub}`);
                }
                cb(null, filePath);
            },
            filename: (req, file, cb) => {
                let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
                const randomName = uniqid();
                cb(null, `${randomName}-${orgName}`);
            },
        }),
    }), encode_security_interceptor_1.EncodeSecurityInterceptor),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'File To Encode',
        type: encode_dto_1.EncodeFromFileDto,
    }),
    (0, decorators_1.RolesAllowed)(),
    (0, common_1.UseGuards)(conditional_auth_guard_1.ConditionalAuthGuard, role_based_guard_1.RoleBasedGuard, license_validation_guard_1.LicenseValidationGuard),
    (0, common_1.Post)('/encode-from-file'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, swagger_1.ApiOperation)({
        summary: 'Encode File And save to database & into track table',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)('data', jsonparse_pipe_1.JsonParsePipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, decorators_1.User)()),
    __param(3, (0, validatedlicense_decorator_1.ValidatedLicense)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyDto, Object, user_db_schema_1.UserDB, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "encodeByFile", null);
__decorate([
    (0, common_1.UseInterceptors)((0, FileFromTrack_interceptor_1.FileFromTrackInterceptor)('track')),
    (0, swagger_1.ApiBody)({
        description: 'File To Encode',
        type: encode_dto_1.EncodeFromTrackDto,
    }),
    (0, decorators_1.RolesAllowed)(),
    (0, common_1.UseGuards)(conditional_auth_guard_1.ConditionalAuthGuard, role_based_guard_1.RoleBasedGuard, license_validation_guard_1.LicenseValidationGuard, encode_security_guard_1.EncodeSecurityGuard),
    (0, common_1.Post)('/encode-from-track'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, swagger_1.ApiOperation)({
        summary: 'Encode File And save to database & into track table',
    }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)('data')),
    __param(1, (0, FileFromTrack_interceptor_1.CurrentTrack)()),
    __param(2, (0, FileFromTrack_interceptor_1.UploadedFileFromTrack)()),
    __param(3, (0, decorators_1.User)()),
    __param(4, (0, validatedlicense_decorator_1.ValidatedLicense)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyDto,
        track_schema_1.Track, Object, user_db_schema_1.UserDB, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "encodeByTrack", null);
__decorate([
    (0, common_1.UseInterceptors)((0, FileFromUrl_interceptor_1.FileFromUrlInterceptor)('mediaFile')),
    (0, swagger_1.ApiBody)({
        description: 'File To Encode',
        type: encode_dto_1.EncodeFromUrlDto,
    }),
    (0, decorators_1.RolesAllowed)(),
    (0, common_1.UseGuards)(conditional_auth_guard_1.ConditionalAuthGuard, role_based_guard_1.RoleBasedGuard, license_validation_guard_1.LicenseValidationGuard, encode_security_guard_1.EncodeSecurityGuard),
    (0, common_1.Post)('/encode-from-url'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, swagger_1.ApiOperation)({ summary: 'Encode File From URL And save to database' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)('data')),
    __param(1, (0, FileFromUrl_interceptor_1.UploadedFileFromUrl)()),
    __param(2, (0, decorators_1.User)()),
    __param(3, (0, decorators_1.User)('sub')),
    __param(4, (0, validatedlicense_decorator_1.ValidatedLicense)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyDto, Object, user_db_schema_1.UserDB, String, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "encodeFromUrl", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('mediaFile', {
        storage: (0, multer_1.diskStorage)({
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
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'File To Decode',
        type: decode_dto_1.DecodeDto,
    }),
    (0, decorators_1.RolesAllowed)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard),
    (0, common_1.Post)('/decode'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Decode File and retrive key information' }),
    openapi.ApiResponse({ status: 201, type: [require("../schemas/sonickey.schema").SonicKey] }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "decode", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('mediaFile', {
        storage: (0, multer_1.diskStorage)({
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
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'File To Decode',
        type: decode_dto_1.DecodeDto,
    }),
    (0, common_1.Version)('2'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Post)('/decode'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Decode File and retrive key information' }),
    openapi.ApiResponse({ status: 201, type: [require("../../detection/schemas/detection.schema").Detection] }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "decodeV2", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('mediaFile', {
        storage: (0, multer_1.diskStorage)({
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
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'File To Decode',
        type: decode_dto_1.DecodeDto,
    }),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Post)(':channel/decode'),
    (0, swagger_1.ApiParam)({ name: 'channel', enum: [...Object.values(Enums_1.ChannelEnums)] }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: '[NEW]: Decode File and retrive key information' }),
    openapi.ApiResponse({ status: 201, type: [require("../schemas/sonickey.schema").SonicKey] }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('channel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "decodeFromChannel", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('mediaFile', {
        storage: (0, multer_1.diskStorage)({
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
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'File To Decode',
        type: decode_dto_1.DecodeDto,
    }),
    (0, common_1.Version)('2'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Post)(':channel/decode'),
    (0, swagger_1.ApiParam)({ name: 'channel', enum: [...Object.values(Enums_1.ChannelEnums)] }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Decode File and retrive key information' }),
    openapi.ApiResponse({ status: 201, type: [require("../../detection/schemas/detection.schema").Detection] }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('channel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "decodeFromChannelV2", null);
__decorate([
    (0, common_1.Patch)('/:sonickey'),
    (0, decorators_1.RolesAllowed)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, update_sonickey_security_guard_1.UpdateSonicKeySecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update Sonic Keys meta data' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('sonickey')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sonickey_dto_1.UpdateSonicKeyDto,
        user_db_schema_1.UserDB]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "updateMeta", null);
__decorate([
    (0, common_1.Patch)('/fingerprint-events/:sonicKey/success'),
    (0, swagger_1.ApiOperation)({
        summary: 'Call this endpoint on fingerprint success, only from fingerprint server',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('sonicKey')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sonickey_dto_1.UpdateSonicKeyFingerPrintMetaDataDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "onFingerPrintSuccess", null);
__decorate([
    (0, common_1.Patch)('/fingerprint-events/:sonicKey/failed'),
    (0, swagger_1.ApiOperation)({
        summary: 'Call this endpoint on fingerprint failed, only from fingerprint server',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('sonicKey')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sonickey_dto_1.UpdateSonicKeyFingerPrintMetaDataDto]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "onFingerPrintFailed", null);
__decorate([
    (0, common_1.Delete)('/:sonickey'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, delete_sonickey_security_guard_1.DeleteSonicKeySecurityGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete Sonic Key data' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('sonickey')),
    __param(1, (0, decorators_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('/download-file'),
    (0, swagger_1.ApiOperation)({ summary: 'Secure Download of a file' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.User)('sub')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [download_dto_1.DownloadDto, String, Object]),
    __metadata("design:returntype", Promise)
], SonickeyController.prototype, "downloadFile", null);
SonickeyController = __decorate([
    (0, swagger_1.ApiTags)('SonicKeys Controller'),
    (0, common_1.Controller)('sonic-keys'),
    __metadata("design:paramtypes", [sonickey_service_1.SonickeyService,
        licensekey_service_1.LicensekeyService,
        file_handler_service_1.FileHandlerService,
        detection_service_1.DetectionService,
        s3fileupload_service_1.S3FileUploadService])
], SonickeyController);
exports.SonickeyController = SonickeyController;
//# sourceMappingURL=sonickey.controller.js.map