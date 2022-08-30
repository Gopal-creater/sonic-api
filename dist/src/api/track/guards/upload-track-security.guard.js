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
exports.UploadTrackSecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
const track_service_1 = require("../track.service");
let UploadTrackSecurityGuard = class UploadTrackSecurityGuard {
    constructor(trackService) {
        this.trackService = trackService;
    }
    async canActivate(context) {
        var _a, _b;
        const request = context.switchToHttp().getRequest();
        const loggedInUser = request === null || request === void 0 ? void 0 : request.user;
        const uploadTrackDto = request === null || request === void 0 ? void 0 : request.body;
        switch (loggedInUser.userRole) {
            case Enums_1.SystemRoles.ADMIN:
                break;
            case Enums_1.SystemRoles.PARTNER_ADMIN:
            case Enums_1.SystemRoles.PARTNER_USER:
                const partnerId = (_a = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.partner) === null || _a === void 0 ? void 0 : _a.id;
                if (!uploadTrackDto.partner) {
                    throw new common_1.BadRequestException("Please provide partner id in the request body");
                }
                if (uploadTrackDto.partner !== partnerId) {
                    throw new common_1.UnprocessableEntityException("Resource mismatch, Please provide your own partner id");
                }
                uploadTrackDto === null || uploadTrackDto === void 0 ? true : delete uploadTrackDto.owner;
                uploadTrackDto === null || uploadTrackDto === void 0 ? true : delete uploadTrackDto.company;
                request.body = uploadTrackDto;
                break;
            case Enums_1.SystemRoles.COMPANY_ADMIN:
            case Enums_1.SystemRoles.COMPANY_USER:
                const companyId = (_b = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.company) === null || _b === void 0 ? void 0 : _b.id;
                if (!uploadTrackDto.company) {
                    throw new common_1.BadRequestException("Please provide company id in the request body");
                }
                if (uploadTrackDto.company !== companyId) {
                    throw new common_1.UnprocessableEntityException("Resource mismatch, Please provide your own company id");
                }
                uploadTrackDto === null || uploadTrackDto === void 0 ? true : delete uploadTrackDto.owner;
                uploadTrackDto === null || uploadTrackDto === void 0 ? true : delete uploadTrackDto.partner;
                request.body = uploadTrackDto;
                break;
            default:
                const ownerId = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id;
                if (!uploadTrackDto.owner) {
                    throw new common_1.BadRequestException("Please provide owner id in the request body");
                }
                if (uploadTrackDto.owner !== ownerId) {
                    throw new common_1.UnprocessableEntityException("Resource mismatch, Please provide your own user/owner id");
                }
                uploadTrackDto === null || uploadTrackDto === void 0 ? true : delete uploadTrackDto.partner;
                uploadTrackDto === null || uploadTrackDto === void 0 ? true : delete uploadTrackDto.company;
                request.body = uploadTrackDto;
                break;
        }
        return true;
    }
};
UploadTrackSecurityGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [track_service_1.TrackService])
], UploadTrackSecurityGuard);
exports.UploadTrackSecurityGuard = UploadTrackSecurityGuard;
//# sourceMappingURL=upload-track-security.guard.js.map