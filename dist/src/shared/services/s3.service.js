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
exports.FileUpload = exports.S3Service = void 0;
const global_aws_service_1 = require("../../shared/modules/global-aws/global-aws.service");
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
let S3Service = class S3Service {
    constructor(globalAwsService) {
        this.globalAwsService = globalAwsService;
        this.BUCKET = process.env.AWS_S3_BUCKET_NAME;
        this.s3 = this.globalAwsService.getS3();
        this.upload = multer({
            storage: multerS3({
                s3: this.s3,
                bucket: this.BUCKET,
                acl: 'public-read',
                key: function (request, file, cb) {
                    cb(null, `${Date.now().toString()} - ${file.originalname}`);
                },
            }),
        }).array('upload', 100);
    }
    async fileupload(req, res) {
        try {
            this.upload(req, res, function (error) {
                if (error) {
                    console.log(error);
                    return res.status(404).json(`Failed to upload image file: ${error}`);
                }
                return res.status(201).json(req.files[0].location);
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json(`Failed to upload image file: ${error}`);
        }
    }
    getFiles() {
        const params = {
            Bucket: this.BUCKET,
        };
        return new Promise((resolve, reject) => {
            s3.listObjectsV2(params, function (err, data) {
                if (err) {
                    console.log('There was an error getting your files: ' + err);
                    reject('There was an error getting your files');
                }
                console.log('Successfully get files.', data);
                const fileDetails = data.Contents;
                const files = fileDetails.map((file, index) => {
                    return new FileUpload(file.Key, 'https://s3.amazonaws.com/' + params.Bucket + '/' + file.Key);
                });
                resolve(files);
            });
        });
    }
    async deleteFile(file) {
        const params = {
            Bucket: this.BUCKET,
            Key: file.name,
        };
        return new Promise((resolve, reject) => {
            s3.deleteObject(params, function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
};
__decorate([
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], S3Service.prototype, "fileupload", null);
S3Service = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [global_aws_service_1.GlobalAwsService])
], S3Service);
exports.S3Service = S3Service;
class FileUpload {
    constructor(name, url) {
        this.name = name;
        this.url = url;
    }
}
exports.FileUpload = FileUpload;
//# sourceMappingURL=s3.service.js.map