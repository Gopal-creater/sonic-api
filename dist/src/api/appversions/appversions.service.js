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
const upath = require("upath");
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
        file.path = upath.toUnix(file.path);
        file.destination = upath.toUnix(file.destination);
        const inFilePath = file.path;
        return this.s3FileUploadService.uploadFromPath(inFilePath, `versions`, s3Acl)
            .then(s3UploadResult => {
            return {
                downloadFileUrl: s3UploadResult.Location,
                s3UploadResult: s3UploadResult
            };
        })
            .finally(() => {
            this.fileHandlerService.deleteFileAtPath(inFilePath);
        });
    }
    async saveVersion(version) {
        var newVersion = new this.versionModel(Object.assign({}, version));
        return newVersion.save();
    }
    async findOne(id) {
        return this.versionModel.findOne({ _id: id });
    }
    async getAllVersions() {
        return this.versionModel.find();
    }
    async downloadLatest(platform) {
        const response = await this.versionModel.findOne({ latest: true, platform: platform });
        return this.getFile(response.s3FileMeta.key);
    }
    async makeLatest(id) {
        var res = await this.versionModel.findOne({ 'latest': true });
        if (res) {
            return this.versionModel.findByIdAndUpdate(res._id, { latest: false })
                .then(result => {
                return this.versionModel.findByIdAndUpdate(id, { latest: true }, { new: true })
                    .then(updateRes => {
                    return updateRes;
                });
            });
        }
        else {
            return this.versionModel.findByIdAndUpdate(id, { latest: true }, { new: true })
                .then(updateRes => {
                return updateRes;
            });
        }
    }
    async getFile(key) {
        return this.s3FileUploadService.getFile(key);
    }
    async deleteFile(key) {
        return this.s3FileUploadService.deleteFile(key);
    }
};
AppVersionService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(appversions_schema_1.AppVersion.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        file_operation_service_1.FileOperationService,
        file_handler_service_1.FileHandlerService,
        s3fileupload_service_1.S3FileUploadService])
], AppVersionService);
exports.AppVersionService = AppVersionService;
//# sourceMappingURL=appversions.service.js.map