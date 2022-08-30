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
exports.CurrentTrack = exports.UploadedFileFromTrack = exports.FileFromTrackInterceptor = void 0;
const common_1 = require("@nestjs/common");
const makeDir = require("make-dir");
const app_config_1 = require("../../config/app.config");
const utils_1 = require("../utils");
const uniqid = require("uniqid");
const fs = require("fs");
const http = require("https");
const mime = require("mime");
const track_service_1 = require("../../api/track/track.service");
const s3fileupload_service_1 = require("../../api/s3fileupload/s3fileupload.service");
const FileFromTrackInterceptor = (fieldName = 'track') => {
    let FileFromUrlInterceptorClass = class FileFromUrlInterceptorClass {
        constructor(trackService, s3FileUploadService) {
            this.trackService = trackService;
            this.s3FileUploadService = s3FileUploadService;
        }
        async intercept(context, next) {
            const req = context.switchToHttp().getRequest();
            const track = req.body[fieldName];
            if (!track) {
                throw new common_1.BadRequestException(`${fieldName} is missing in request body`);
            }
            const trackFromDb = await this.trackService.findById(track);
            if (!trackFromDb) {
                throw new common_1.NotFoundException('track not found');
            }
            const signedUrlForTrack = await this.s3FileUploadService.getSignedUrl(trackFromDb.s3OriginalFileMeta.Key, 10 * 60);
            const loggedInUser = req['user'];
            const { destinationFolder, resourceOwnerObj, } = (0, utils_1.identifyDestinationFolderAndResourceOwnerFromUser)(loggedInUser);
            const filePath = await makeDir(`${app_config_1.appConfig.MULTER_DEST}/${destinationFolder}`);
            await makeDir(`${filePath}/encodedFiles`);
            const originalname = (0, utils_1.extractFileName)(signedUrlForTrack);
            const filename = `${uniqid()}-${originalname}`;
            const destination = `${filePath}/${filename}`;
            const uploaded = await download(signedUrlForTrack, destination);
            const fileStat = fs.statSync(destination);
            const mimeType = mime.getType(destination);
            const fileUploadResult = {
                fieldname: fieldName,
                url: signedUrlForTrack,
                originalname: originalname,
                destination: filePath,
                filename: filename,
                path: destination,
                size: fileStat.size,
                mimetype: mimeType,
            };
            req['fileUploadFromTrackResult'] = fileUploadResult;
            req['currentTrack'] = trackFromDb;
            return next.handle();
        }
    };
    FileFromUrlInterceptorClass = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [track_service_1.TrackService,
            s3fileupload_service_1.S3FileUploadService])
    ], FileFromUrlInterceptorClass);
    return (0, common_1.mixin)(FileFromUrlInterceptorClass);
};
exports.FileFromTrackInterceptor = FileFromTrackInterceptor;
exports.UploadedFileFromTrack = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
        return req.fileUploadFromTrackResult[data];
    }
    else {
        return req.fileUploadFromTrackResult;
    }
});
exports.CurrentTrack = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
        return req.currentTrack[data];
    }
    else {
        return req.currentTrack;
    }
});
function download(url, dest) {
    return new Promise((resolve, reject) => {
        var file = fs.createWriteStream(dest);
        var request = http
            .get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close();
                resolve({
                    url: url,
                    dest: dest,
                });
            });
        })
            .on('error', function (err) {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}
//# sourceMappingURL=FileFromTrack.interceptor.js.map