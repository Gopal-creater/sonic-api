"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadedFileFromUrl = exports.FileFromUrlInterceptor = void 0;
const common_1 = require("@nestjs/common");
const makeDir = require("make-dir");
const app_config_1 = require("../../config/app.config");
const utils_1 = require("../utils");
const uniqid = require("uniqid");
const fs = require("fs");
const http = require("https");
const mime = require("mime");
const FileFromUrlInterceptor = (fieldName) => {
    let FileFromUrlInterceptorClass = class FileFromUrlInterceptorClass {
        async intercept(context, next) {
            var _a, _b;
            const req = context.switchToHttp().getRequest();
            const url = req.body[fieldName];
            const sonicKeyDto = (_a = req.body) === null || _a === void 0 ? void 0 : _a.data;
            if (!url) {
                throw new common_1.BadRequestException(`${fieldName} is missing in request body`);
            }
            if (!utils_1.isValidHttpUrl(url)) {
                throw new common_1.BadRequestException('Invalid mediaFile Url');
            }
            if (!sonicKeyDto)
                throw new common_1.BadRequestException('data is required');
            if (!sonicKeyDto.contentOwner)
                throw new common_1.BadRequestException('contentOwner is required');
            const currentUserId = ((_b = req['user']) === null || _b === void 0 ? void 0 : _b['sub']) || 'guestUser';
            const imagePath = await makeDir(`${app_config_1.appConfig.MULTER_DEST}/${currentUserId}`);
            await makeDir(`${app_config_1.appConfig.MULTER_DEST}/${currentUserId}/encodedFiles`);
            const originalname = utils_1.extractFileName(url);
            const filename = `${uniqid()}-${originalname}`;
            const destination = `${imagePath}/${filename}`;
            const uploaded = await this.download(url, destination);
            const fileStat = fs.statSync(destination);
            const mimeType = mime.getType(destination);
            const fileUploadResult = {
                fieldname: fieldName,
                url: url,
                originalname: originalname,
                destination: imagePath,
                filename: filename,
                path: destination,
                size: fileStat.size,
                mimetype: mimeType,
            };
            req['fileUploadResult'] = fileUploadResult;
            return next.handle();
        }
        download(url, dest) {
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
    };
    FileFromUrlInterceptorClass = __decorate([
        common_1.Injectable()
    ], FileFromUrlInterceptorClass);
    return common_1.mixin(FileFromUrlInterceptorClass);
};
exports.FileFromUrlInterceptor = FileFromUrlInterceptor;
exports.UploadedFileFromUrl = common_1.createParamDecorator((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
        return req.fileUploadResult[data];
    }
    else {
        return req.fileUploadResult;
    }
});
//# sourceMappingURL=FileFromUrl.interceptor.js.map