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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SonickeyUtils = void 0;
const common_1 = require("@nestjs/common");
const licensekey_schema_1 = require("../../../licensekey/schemas/licensekey.schema");
const licensekey_service_1 = require("../../../licensekey/services/licensekey.service");
const track_service_1 = require("../../../track/track.service");
const s3fileupload_service_1 = require("../../../s3fileupload/s3fileupload.service");
const makeDir = require("make-dir");
const config_1 = require("../../../../config");
const utils_1 = require("../../../../shared/utils");
const uniqid = require("uniqid");
const fs = require("fs");
const http = require("https");
const mime = require("mime");
const UploadedFile_interface_1 = require("../../../../shared/interfaces/UploadedFile.interface");
let SonickeyUtils = class SonickeyUtils {
    constructor(licensekeyService, trackService, s3FileUploadService) {
        this.licensekeyService = licensekeyService;
        this.trackService = trackService;
        this.s3FileUploadService = s3FileUploadService;
    }
    async checkAndGetValidLicenseForEncode(user) {
        var e_1, _a;
        const licenses = await this.licensekeyService.findValidLicesesForUser(user.sub);
        if (!licenses || licenses.length <= 0) {
            throw new Error('No active license, please get atleast one to perform this action');
        }
        var currentValidLicense;
        var valid;
        var message;
        var remainingUses;
        var reservedLicenceCount;
        var remaniningUsesAfterReservedCount;
        var usesToBeUsed;
        var maxEncodeUses;
        var statusCode;
        try {
            for (var licenses_1 = __asyncValues(licenses), licenses_1_1; licenses_1_1 = await licenses_1.next(), !licenses_1_1.done;) {
                const license = licenses_1_1.value;
                const validationResults = await this.isValidLicenseForEncode(license.key);
                if (validationResults.valid) {
                    valid = true;
                    currentValidLicense = license;
                    break;
                }
                valid = false;
                statusCode = validationResults.statusCode || 422;
                message = validationResults.message || 'License validation failded';
                remainingUses = validationResults.remainingUses;
                reservedLicenceCount = validationResults.reservedLicenceCount;
                remaniningUsesAfterReservedCount =
                    validationResults.remaniningUsesAfterReservedCount;
                usesToBeUsed = validationResults.usesToBeUsed;
                maxEncodeUses = validationResults.maxEncodeUses;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (licenses_1_1 && !licenses_1_1.done && (_a = licenses_1.return)) await _a.call(licenses_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!valid) {
            return Promise.reject({
                valid: valid,
                message: message,
                remainingUses: remainingUses,
                reservedLicenceCount: reservedLicenceCount,
                remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
                usesToBeUsed: usesToBeUsed,
                maxEncodeUses: maxEncodeUses,
                statusCode: statusCode,
            });
        }
        return currentValidLicense;
    }
    async isValidLicenseForEncode(id) {
        const { validationResult, licenseKey, } = await this.licensekeyService.validateLicence(id);
        if (!validationResult.valid) {
            return {
                valid: false,
                message: validationResult.message,
                statusCode: 422,
                usesExceeded: false,
            };
        }
        if (licenseKey.isUnlimitedEncode) {
            return {
                valid: true,
            };
        }
        var reservedLicenceCount = 0;
        if (licenseKey.reserves && Array.isArray(licenseKey.reserves)) {
            reservedLicenceCount = licenseKey.reserves.reduce((sum, { count }) => sum + count, 0);
        }
        const uses = licenseKey.encodeUses;
        const maxUses = licenseKey.maxEncodeUses;
        const remainingUses = maxUses - uses;
        const remaniningUsesAfterReservedCount = remainingUses - reservedLicenceCount;
        const usesToBeUsed = 1;
        if (remaniningUsesAfterReservedCount < usesToBeUsed) {
            return {
                valid: false,
                message: 'Error deuto your maximum license usage count exceeded.',
                statusCode: 422,
                usesExceeded: true,
                remainingUses: remainingUses,
                reservedLicenceCount: reservedLicenceCount,
                remaniningUsesAfterReservedCount: remaniningUsesAfterReservedCount,
                usesToBeUsed: usesToBeUsed,
                maxEncodeUses: maxUses,
            };
        }
        return {
            valid: true,
        };
    }
    async downloadFileFromTrack(track) {
        const trackFromDb = await this.trackService.findById(track);
        if (!trackFromDb) {
            throw new Error('track not found');
        }
        const signedUrlForTrack = await this.s3FileUploadService.getSignedUrl(trackFromDb.s3OriginalFileMeta.Key, 10 * 60);
        const filePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/fileFromTrackStore`);
        await makeDir(`${filePath}/encodedFiles`);
        const originalname = (0, utils_1.extractFileName)(signedUrlForTrack);
        const filename = `${uniqid()}-${originalname}`;
        const destination = `${filePath}/${filename}`;
        const uploaded = await this.download(signedUrlForTrack, destination);
        const fileStat = fs.statSync(destination);
        const mimeType = mime.getType(destination);
        const fileUploadResult = {
            url: signedUrlForTrack,
            originalname: originalname,
            destination: filePath,
            filename: filename,
            path: destination,
            size: fileStat.size,
            mimetype: mimeType,
        };
        return {
            fileUploadFromTrackResult: fileUploadResult,
            currentTrack: trackFromDb,
        };
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
SonickeyUtils = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService,
        track_service_1.TrackService,
        s3fileupload_service_1.S3FileUploadService])
], SonickeyUtils);
exports.SonickeyUtils = SonickeyUtils;
//# sourceMappingURL=sonickey.utils.js.map