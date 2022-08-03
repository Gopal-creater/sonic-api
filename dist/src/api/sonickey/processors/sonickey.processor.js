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
var SonicKeyProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SonicKeyProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const sonickey_service_1 = require("../services/sonickey.service");
const Enums_1 = require("../../../constants/Enums");
const queuejob_service_1 = require("../../../queuejob/queuejob.service");
const user_db_schema_1 = require("../../user/schemas/user.db.schema");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
const licensekey_schema_1 = require("../../licensekey/schemas/licensekey.schema");
const sonickey_utils_1 = require("./utils/sonickey.utils");
const utils_1 = require("../../../shared/utils");
let SonicKeyProcessor = SonicKeyProcessor_1 = class SonicKeyProcessor {
    constructor(sonicKeyService, sonickeyUtils, licensekeyService, queuejobService) {
        this.sonicKeyService = sonicKeyService;
        this.sonickeyUtils = sonickeyUtils;
        this.licensekeyService = licensekeyService;
        this.queuejobService = queuejobService;
        this.logger = new common_1.Logger(SonicKeyProcessor_1.name);
    }
    async handleBulkEncode(job) {
        this.logger.debug(`Start encode for job id: ${job.id}`);
        this.logger.debug(job.data);
        await this.encodeFileFromJobData(job)
            .then(async (data) => {
            await this.queuejobService.queueJobModel.updateOne({ _id: job.id }, {
                completed: true,
            }, { new: true });
            return Promise.resolve(data);
        })
            .catch(async (err) => {
            this.logger.debug(`Encode failed for job id: ${job.id}`);
            this.logger.error(err);
            await this.queuejobService.queueJobModel.updateOne({ _id: job.id }, {
                error: true,
                errorData: err,
            }, { new: true });
            return Promise.reject(new Error(err.message || 'Encode failed'));
        });
        this.logger.debug(`Encode completed for job id: ${job.id}`);
    }
    async handleEncodeAgainForNextDownload(job) {
        var _a;
        this.logger.debug(`Start encode again job for job id: ${job.id}`);
        this.logger.debug(job.data);
        const { user, trackId, sonicKeyDto, metaData, } = job.data;
        const license = await this.sonickeyUtils.checkAndGetValidLicenseForEncode(user);
        const { fileUploadFromTrackResult: file, currentTrack: track, } = await this.sonickeyUtils.downloadFileFromTrack(trackId);
        const oldLatestSonicKey = await this.sonicKeyService.findOneAggregate({
            filter: { track: trackId },
            sort: { createdAt: -1 },
        });
        const { destinationFolder, resourceOwnerObj, } = utils_1.identifyDestinationFolderAndResourceOwnerFromUser(user);
        await this.queuejobService
            .create(Object.assign({ _id: job.id, name: job.name, jobData: job.data }, resourceOwnerObj))
            .catch(err => {
            throw new Error("Can't save queue job details to db");
        });
        var sonickeyDoc;
        if (oldLatestSonicKey) {
            sonickeyDoc = Object.assign((_a = oldLatestSonicKey === null || oldLatestSonicKey === void 0 ? void 0 : oldLatestSonicKey.toObject) === null || _a === void 0 ? void 0 : _a.call(oldLatestSonicKey), sonicKeyDto, {
                createdBy: user === null || user === void 0 ? void 0 : user.sub,
            });
        }
        else {
            sonicKeyDto.contentFileType =
                sonicKeyDto.contentFileType || track.mimeType;
            sonicKeyDto.contentOwner = sonicKeyDto.contentOwner || track.artist;
            sonicKeyDto.contentName = sonicKeyDto.contentName || track.title;
            sonicKeyDto.contentDuration =
                sonicKeyDto.contentDuration || track.duration;
            sonicKeyDto.contentSize = sonicKeyDto.contentSize || track.fileSize;
            sonicKeyDto.contentType = sonicKeyDto.contentType || track.fileType;
            sonicKeyDto.contentEncoding =
                sonicKeyDto.contentEncoding || track.encoding;
            sonicKeyDto.contentSamplingFrequency =
                sonicKeyDto.contentSamplingFrequency || track.samplingFrequency;
            sonicKeyDto.originalFileName =
                track.originalFileName || sonicKeyDto.originalFileName;
            sonickeyDoc = Object.assign(sonicKeyDto, resourceOwnerObj, {
                createdBy: user === null || user === void 0 ? void 0 : user.sub,
            });
        }
        const encodingStrength = sonickeyDoc.encodingStrength || 30;
        await this.sonicKeyService
            .encodeSonicKeyFromTrack({
            trackId: track === null || track === void 0 ? void 0 : track.id,
            file,
            licenseId: license._id,
            sonickeyDoc,
            encodingStrength,
            s3destinationFolder: destinationFolder,
        })
            .then(async (res) => {
            await this.queuejobService.queueJobModel.updateOne({ _id: job.id }, {
                completed: true,
            }, { new: true });
        })
            .catch(async (err) => {
            await this.queuejobService.queueJobModel.updateOne({ _id: job.id }, {
                error: true,
                errorData: err,
            }, { new: true });
        });
        this.logger.debug(`Encode Again For next download job completed for job id: ${job.id}`);
    }
    async encodeFileFromJobData(encodeJobData) {
        const { id, data } = encodeJobData;
        const { file, owner, company, licenseId, metaData } = data;
        return new Promise(async (resolve, reject) => {
            try {
                const { s3UploadResult, sonicKey, s3OriginalFileUploadResult, fingerPrintMetaData, fingerPrintErrorData, fingerPrintStatus, } = await this.sonicKeyService.encodeAndUploadToS3(file, owner, metaData === null || metaData === void 0 ? void 0 : metaData.encodingStrength, Enums_1.S3ACL.PRIVATE, true);
                this.logger.debug('Encode & upload to s3 finished for job', id);
                await this.sonicKeyService.licensekeyService.incrementUses(data.licenseId, 'encode', 1);
                this.logger.debug('Increment Usages upon successfull encode for job', id);
                this.logger.debug('Going to save key in db for job', id);
                const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(file, metaData);
                const channel = Enums_1.ChannelEnums.THIRDPARTY_BULK;
                const newSonicKey = Object.assign(Object.assign({}, sonicKeyDtoWithAudioData), { contentFilePath: s3UploadResult.Location, originalFileName: file === null || file === void 0 ? void 0 : file.originalname, owner: owner, company: company, sonicKey: sonicKey, channel: channel, downloadable: true, s3FileMeta: s3UploadResult, s3OriginalFileMeta: s3OriginalFileUploadResult, fingerPrintMetaData: fingerPrintMetaData, fingerPrintErrorData: fingerPrintErrorData, fingerPrintStatus: fingerPrintStatus, queueJobId: id, _id: sonicKey, license: licenseId });
                const savedSonicKey = await this.sonicKeyService.saveSonicKeyForUser(owner, newSonicKey);
                resolve(savedSonicKey);
            }
            catch (error) {
                reject(error);
            }
        }).finally(() => {
        });
    }
};
__decorate([
    bull_1.Process('bulk_encode'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SonicKeyProcessor.prototype, "handleBulkEncode", null);
__decorate([
    bull_1.Process('encode_again'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SonicKeyProcessor.prototype, "handleEncodeAgainForNextDownload", null);
SonicKeyProcessor = SonicKeyProcessor_1 = __decorate([
    bull_1.Processor('sonickey'),
    __metadata("design:paramtypes", [sonickey_service_1.SonickeyService,
        sonickey_utils_1.SonickeyUtils,
        licensekey_service_1.LicensekeyService,
        queuejob_service_1.QueuejobService])
], SonicKeyProcessor);
exports.SonicKeyProcessor = SonicKeyProcessor;
//# sourceMappingURL=sonickey.processor.js.map