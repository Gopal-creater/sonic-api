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
exports.UpdateTrackSecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
const track_service_1 = require("../track.service");
let UpdateTrackSecurityGuard = class UpdateTrackSecurityGuard {
    constructor(trackService) {
        this.trackService = trackService;
    }
    async canActivate(context) {
        var _a, _b, _c;
        const request = context.switchToHttp().getRequest();
        const loggedInUser = request === null || request === void 0 ? void 0 : request.user;
        const trackId = (_a = request === null || request === void 0 ? void 0 : request.param) === null || _a === void 0 ? void 0 : _a.id;
        const updateTrackDto = request === null || request === void 0 ? void 0 : request.body;
        switch (loggedInUser.userRole) {
            case Enums_1.SystemRoles.ADMIN:
                break;
            case Enums_1.SystemRoles.PARTNER_ADMIN:
            case Enums_1.SystemRoles.PARTNER_USER:
                const partnerId = (_b = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.partner) === null || _b === void 0 ? void 0 : _b.id;
                const track = await this.trackService.findOne({
                    _id: trackId,
                    partner: partnerId,
                });
                if (!track) {
                    throw new common_1.NotFoundException();
                }
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.duration;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.encoding;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.fileSize;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.fileType;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.iExtractedMetaData;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.localFilePath;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.mimeType;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.originalFileName;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.s3OriginalFileMeta;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.samplingFrequency;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.channel;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.company;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.owner;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.partner;
                request.body = updateTrackDto;
                break;
            case Enums_1.SystemRoles.COMPANY_ADMIN:
            case Enums_1.SystemRoles.COMPANY_USER:
                const companyId = (_c = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.company) === null || _c === void 0 ? void 0 : _c.id;
                const trackfromdb = await this.trackService.findOne({
                    _id: trackId,
                    company: companyId,
                });
                if (!trackfromdb) {
                    throw new common_1.NotFoundException();
                }
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.duration;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.encoding;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.fileSize;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.fileType;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.iExtractedMetaData;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.localFilePath;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.mimeType;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.originalFileName;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.s3OriginalFileMeta;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.samplingFrequency;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.channel;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.company;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.owner;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.partner;
                request.body = updateTrackDto;
                break;
            default:
                const ownerId = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id;
                const trackfromdb1 = await this.trackService.findOne({
                    _id: trackId,
                    owner: ownerId,
                });
                if (!trackfromdb1) {
                    throw new common_1.NotFoundException();
                }
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.duration;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.encoding;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.fileSize;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.fileType;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.iExtractedMetaData;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.localFilePath;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.mimeType;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.originalFileName;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.s3OriginalFileMeta;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.samplingFrequency;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.channel;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.company;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.owner;
                updateTrackDto === null || updateTrackDto === void 0 ? true : delete updateTrackDto.partner;
                request.body = updateTrackDto;
                break;
        }
        return true;
    }
};
UpdateTrackSecurityGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [track_service_1.TrackService])
], UpdateTrackSecurityGuard);
exports.UpdateTrackSecurityGuard = UpdateTrackSecurityGuard;
//# sourceMappingURL=update-track-security.guard.js.map