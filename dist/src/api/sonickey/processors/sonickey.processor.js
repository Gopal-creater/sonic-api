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
const file_handler_service_1 = require("../../../shared/services/file-handler.service");
let SonicKeyProcessor = SonicKeyProcessor_1 = class SonicKeyProcessor {
    constructor(sonicKeyService, fileHandlerService) {
        this.sonicKeyService = sonicKeyService;
        this.fileHandlerService = fileHandlerService;
        this.logger = new common_1.Logger(SonicKeyProcessor_1.name);
    }
    async handleBulkEncode(job) {
        this.logger.debug(`Start encode for job id: ${job.id}`);
        this.logger.debug(job.data);
        this.logger.debug(`Encode completed for job id: ${job.id}`);
    }
    async encodeFileFromJobData(encodeJobData) {
        const { id, data } = encodeJobData;
        const { file, owner, licenseId, metaData } = data;
        return new Promise(async (resolve, reject) => {
            const { s3UploadResult, sonicKey, s3OriginalFileUploadResult, fingerPrintMetaData, fingerPrintErrorData, fingerPrintStatus, } = await this.sonicKeyService.encodeAndUploadToS3(file, owner, metaData === null || metaData === void 0 ? void 0 : metaData.encodingStrength, Enums_1.S3ACL.PRIVATE, true);
            this.logger.debug('Encode & upload to s3 finished for job', id);
            await this.sonicKeyService.licensekeyService.incrementUses(data.licenseId, 'encode', 1);
            this.logger.debug('Increment Usages upon successfull encode for job', id);
            this.logger.debug('Going to save key in db for job', id);
            const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(file, metaData);
            const channel = Enums_1.ChannelEnums.PORTAL;
            const newSonicKey = Object.assign(Object.assign({}, sonicKeyDtoWithAudioData), { contentFilePath: s3UploadResult.Location, originalFileName: file === null || file === void 0 ? void 0 : file.originalname, owner: owner, sonicKey: sonicKey, channel: channel, downloadable: true, s3FileMeta: s3UploadResult, s3OriginalFileMeta: s3OriginalFileUploadResult, fingerPrintMetaData: fingerPrintMetaData, fingerPrintErrorData: fingerPrintErrorData, fingerPrintStatus: fingerPrintStatus, queueJobId: id, _id: sonicKey, license: licenseId });
            const savedSonicKey = await this.sonicKeyService.saveSonicKeyForUser(owner, newSonicKey);
            resolve(savedSonicKey);
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
SonicKeyProcessor = SonicKeyProcessor_1 = __decorate([
    bull_1.Processor('sonickey'),
    __metadata("design:paramtypes", [sonickey_service_1.SonickeyService,
        file_handler_service_1.FileHandlerService])
], SonicKeyProcessor);
exports.SonicKeyProcessor = SonicKeyProcessor;
//# sourceMappingURL=sonickey.processor.js.map