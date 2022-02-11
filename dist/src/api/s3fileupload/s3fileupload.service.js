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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileUploadService = void 0;
const global_aws_service_1 = require("../../shared/modules/global-aws/global-aws.service");
const common_1 = require("@nestjs/common");
const fs = require("fs");
const uniqid = require("uniqid");
const Enums_1 = require("../../constants/Enums");
const utils_1 = require("../../shared/utils");
let S3FileUploadService = class S3FileUploadService {
    constructor(globalAwsService) {
        this.globalAwsService = globalAwsService;
        this.s3 = this.globalAwsService.getS3();
        this.s3ClientV2 = this.globalAwsService.getS3ClientV2();
        this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    }
    async upload(file, destinationFolder, acl = Enums_1.S3ACL.PRIVATE) {
        const { originalname } = file;
        const bucketS3Destination = destinationFolder
            ? `${this.bucketName}/${destinationFolder}`
            : this.bucketName;
        return this.uploadS3(file.buffer, bucketS3Destination, originalname, acl);
    }
    async uploadFromPath(filePath, destinationFolder, acl = Enums_1.S3ACL.PRIVATE) {
        const fileContect = fs.createReadStream(filePath);
        const fileName = utils_1.extractFileName(filePath);
        console.log('filename', fileName);
        const bucketS3Destination = destinationFolder
            ? `${this.bucketName}/${destinationFolder}`
            : this.bucketName;
        return this.uploadS3(fileContect, bucketS3Destination, fileName, acl);
    }
    async uploadS3(file, bucket, name, acl) {
        const params = {
            Bucket: bucket,
            Key: `${uniqid()}-${name}`,
            Body: file,
            ACL: acl,
        };
        console.log('name--------', name);
        return this.s3.upload(params).promise();
    }
    getFile(key) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
        };
        return this.s3.getObject(params).promise();
    }
    downloadFile(key, res) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
        };
        return this.s3.getObject(params).createReadStream().pipe(res);
    }
    getFiles() {
        const params = {
            Bucket: this.bucketName,
        };
        return this.s3.listObjectsV2(params).promise();
    }
    getSignedUrl(key, expiry = 60 * 1) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
            Expires: expiry,
        };
        return this.s3.getSignedUrlPromise('getObject', params);
    }
    async deleteFile(key) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
        };
        return this.s3.deleteObject(params).promise();
    }
};
S3FileUploadService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [global_aws_service_1.GlobalAwsService])
], S3FileUploadService);
exports.S3FileUploadService = S3FileUploadService;
//# sourceMappingURL=s3fileupload.service.js.map