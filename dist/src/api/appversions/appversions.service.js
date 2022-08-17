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
exports.AppVersionService = void 0;
const file_handler_service_1 = require("../../shared/services/file-handler.service");
const file_operation_service_1 = require("../../shared/services/file-operation.service");
const common_1 = require("@nestjs/common");
const appversions_schema_1 = require("./schemas/appversions.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const s3fileupload_service_1 = require("../s3fileupload/s3fileupload.service");
let AppVersionService = class AppVersionService {
    constructor(versionModel, fileOperationService, fileHandlerService, s3FileUploadService) {
        this.versionModel = versionModel;
        this.fileOperationService = fileOperationService;
        this.fileHandlerService = fileHandlerService;
        this.s3FileUploadService = s3FileUploadService;
    }
    async uploadVersionToS3(file, s3Acl) {
        return this.s3FileUploadService.upload(file, `versions`, s3Acl)
            .then(s3UploadResult => {
            return {
                downloadFileUrl: s3UploadResult.Location,
                s3UploadResult: s3UploadResult
            };
        }).catch(err => {
            throw new common_1.InternalServerErrorException(err);
        });
    }
    async saveVersion(version) {
        const newVersion = new this.versionModel(version);
        const res = await newVersion.save();
        return res;
    }
    async findOne(id) {
        return this.versionModel.findOne({ _id: id });
    }
    getAllVersions(queryDto) {
        const { filter, sort } = queryDto;
        return this.versionModel.find(Object.assign({}, filter)).sort(sort);
    }
    async downloadFromVersionCode(versionCode, platform, res) {
        return this.versionModel.findOne({ versionCode: versionCode, platform: platform })
            .then(VersionFromCode => {
            if (!VersionFromCode)
                throw new common_1.NotFoundException("verson with this version code not found.");
            return this.s3FileUploadService.downloadFile(VersionFromCode.s3FileMeta.Key, res, VersionFromCode.originalVersionFileName);
        }).catch(err => {
            console.log(err);
            throw new common_1.InternalServerErrorException(err);
        });
    }
    async downloadLatest(platform, res) {
        return this.versionModel.findOne({ latest: true, platform: platform })
            .then(latestVersion => {
            return this.s3FileUploadService.downloadFile(latestVersion.s3FileMeta.Key, res, latestVersion.originalVersionFileName);
        });
    }
    async downloadFromVersionId(id, res) {
        return this.versionModel.findOne({ _id: id })
            .then(latestVersion => {
            return this.s3FileUploadService.downloadFile(latestVersion.s3FileMeta.Key, res, latestVersion.originalVersionFileName);
        });
    }
    async makeLatest(id, platform) {
        let dbResponse = await this.versionModel.findOne({ latest: true, platform: platform });
        if (dbResponse) {
            return this.versionModel.findByIdAndUpdate(id, { latest: true }, { new: true })
                .then(async (result) => {
                return this.versionModel.findByIdAndUpdate(dbResponse._id, { latest: false })
                    .then(updateRes => {
                    return result;
                }).catch(err => {
                    throw new common_1.InternalServerErrorException(err);
                });
            });
        }
        else {
            return this.versionModel.findByIdAndUpdate(id, { latest: true }, { new: true })
                .then(updateRes => {
                return updateRes;
            }).catch(err => {
                throw new common_1.InternalServerErrorException(err);
            });
        }
    }
    async update(id, platform, updateAppVersionDto) {
        if (updateAppVersionDto.latest) {
            let dbResponse = await this.versionModel.findOne({ latest: true, platform: platform });
            if (dbResponse) {
                return this.versionModel.findByIdAndUpdate(id, { latest: true }, { new: true })
                    .then(async (result) => {
                    return this.versionModel.findByIdAndUpdate(dbResponse._id, { latest: false })
                        .then(async (updateRes) => {
                        const finalVersion = await this.versionModel.findOneAndUpdate({ _id: id }, Object.assign({}, updateAppVersionDto), { new: true });
                        if (!finalVersion) {
                            throw new common_1.NotFoundException();
                        }
                        return finalVersion;
                    }).catch(err => {
                        throw new common_1.InternalServerErrorException(err);
                    });
                });
            }
            else {
                return this.versionModel.findByIdAndUpdate(id, { latest: true }, { new: true })
                    .then(updateRes => {
                    return updateRes;
                }).catch(err => {
                    throw new common_1.InternalServerErrorException(err);
                });
            }
        }
        else {
            return this.versionModel.findOneAndUpdate({ _id: id }, Object.assign({}, updateAppVersionDto), { new: true });
        }
    }
    async deleteRecordWithFile(id) {
        let keyToDeleteFromS3;
        return this.findOne(id)
            .then(async (toDeleteRecord) => {
            if (!toDeleteRecord)
                throw new common_1.NotFoundException("Record not found associated with the passed Id.");
            keyToDeleteFromS3 = toDeleteRecord.s3FileMeta.Key;
            return this.s3FileUploadService.deleteFile(keyToDeleteFromS3)
                .then(async (deleteRecord) => {
                await this.versionModel.deleteOne({ _id: id });
                return ({ "message": "record successfully deleted fom db as well as s3." });
            });
        }).catch(err => {
            throw new common_1.InternalServerErrorException(err);
        });
    }
    async VersionAndPlatformCheck(versiondto) {
        let dbResponse = await this.versionModel.findOne({ versionCode: versiondto.versionCode, platform: versiondto.platform });
        return dbResponse;
    }
};
AppVersionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(appversions_schema_1.AppVersion.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        file_operation_service_1.FileOperationService,
        file_handler_service_1.FileHandlerService,
        s3fileupload_service_1.S3FileUploadService])
], AppVersionService);
exports.AppVersionService = AppVersionService;
//# sourceMappingURL=appversions.service.js.map