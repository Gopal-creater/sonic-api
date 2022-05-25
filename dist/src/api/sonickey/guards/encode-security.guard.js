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
exports.EncodeSecurityGuard = void 0;
const common_1 = require("@nestjs/common");
const Enums_1 = require("../../../constants/Enums");
let EncodeSecurityGuard = class EncodeSecurityGuard {
    constructor() { }
    async canActivate(context) {
        var _a, _b, _c, _d, _e, _f;
        const request = context.switchToHttp().getRequest();
        const loggedInUser = request === null || request === void 0 ? void 0 : request.user;
        var createSonicKeyDto;
        if (typeof ((_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.data) == 'string') {
            createSonicKeyDto = JSON.parse((_b = request === null || request === void 0 ? void 0 : request.body) === null || _b === void 0 ? void 0 : _b.data);
        }
        else {
            createSonicKeyDto = (_c = request === null || request === void 0 ? void 0 : request.body) === null || _c === void 0 ? void 0 : _c.data;
        }
        switch (loggedInUser.userRole) {
            case Enums_1.SystemRoles.ADMIN:
                break;
            case Enums_1.SystemRoles.PARTNER_ADMIN:
            case Enums_1.SystemRoles.PARTNER_USER:
                const partnerId = (_d = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.partner) === null || _d === void 0 ? void 0 : _d.id;
                if (!createSonicKeyDto.partner) {
                    throw new common_1.BadRequestException('Please provide partner id in the request body');
                }
                if (createSonicKeyDto.partner !== partnerId) {
                    throw new common_1.UnprocessableEntityException('Resource mismatch, Please provide your own partner id');
                }
                createSonicKeyDto === null || createSonicKeyDto === void 0 ? true : delete createSonicKeyDto.owner;
                createSonicKeyDto === null || createSonicKeyDto === void 0 ? true : delete createSonicKeyDto.company;
                break;
            case Enums_1.SystemRoles.COMPANY_ADMIN:
            case Enums_1.SystemRoles.COMPANY_USER:
                const companyId = (_e = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.company) === null || _e === void 0 ? void 0 : _e.id;
                if (!createSonicKeyDto.company) {
                    throw new common_1.BadRequestException('Please provide company id in the request body');
                }
                if (createSonicKeyDto.company !== companyId) {
                    throw new common_1.UnprocessableEntityException('Resource mismatch, Please provide your own company id');
                }
                createSonicKeyDto === null || createSonicKeyDto === void 0 ? true : delete createSonicKeyDto.owner;
                createSonicKeyDto === null || createSonicKeyDto === void 0 ? true : delete createSonicKeyDto.partner;
                break;
            default:
                const ownerId = loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.id;
                if (!createSonicKeyDto.owner) {
                    throw new common_1.BadRequestException('Please provide owner id in the request body');
                }
                if (createSonicKeyDto.owner !== ownerId) {
                    throw new common_1.UnprocessableEntityException('Resource mismatch, Please provide your own user/owner id');
                }
                createSonicKeyDto === null || createSonicKeyDto === void 0 ? true : delete createSonicKeyDto.partner;
                createSonicKeyDto === null || createSonicKeyDto === void 0 ? true : delete createSonicKeyDto.company;
                break;
        }
        if (typeof ((_f = request === null || request === void 0 ? void 0 : request.body) === null || _f === void 0 ? void 0 : _f.data) == 'string') {
            request.body.data = JSON.stringify(createSonicKeyDto);
        }
        else {
            request.body.data = createSonicKeyDto;
        }
        return true;
    }
};
EncodeSecurityGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], EncodeSecurityGuard);
exports.EncodeSecurityGuard = EncodeSecurityGuard;
//# sourceMappingURL=encode-security.guard.js.map