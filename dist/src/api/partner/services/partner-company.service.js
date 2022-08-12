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
exports.PartnerCompanyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const partner_schema_1 = require("../schemas/partner.schema");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../../user/services/user.service");
const Enums_1 = require("../../../constants/Enums");
const company_service_1 = require("../../company/company.service");
let PartnerCompanyService = class PartnerCompanyService {
    constructor(partnerModel, userService, companyService) {
        this.partnerModel = partnerModel;
        this.userService = userService;
        this.companyService = companyService;
    }
};
PartnerCompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(partner_schema_1.Partner.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => company_service_1.CompanyService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService,
        company_service_1.CompanyService])
], PartnerCompanyService);
exports.PartnerCompanyService = PartnerCompanyService;
//# sourceMappingURL=partner-company.service.js.map