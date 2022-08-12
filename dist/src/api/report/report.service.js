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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const Enums_1 = require("../../constants/Enums");
const mongoose_utils_1 = require("../../shared/utils/mongoose.utils");
const types_1 = require("../../shared/types");
const user_service_1 = require("../user/services/user.service");
const file_handler_service_1 = require("../../shared/services/file-handler.service");
const company_service_1 = require("../company/company.service");
const detection_service_1 = require("../detection/detection.service");
const sonickey_service_1 = require("../sonickey/services/sonickey.service");
let ReportService = class ReportService {
    constructor(userService, fileHandlerService, companyService, detectionService, sonickeyService) {
        this.userService = userService;
        this.fileHandlerService = fileHandlerService;
        this.companyService = companyService;
        this.detectionService = detectionService;
        this.sonickeyService = sonickeyService;
    }
};
ReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        file_handler_service_1.FileHandlerService,
        company_service_1.CompanyService,
        detection_service_1.DetectionService,
        sonickey_service_1.SonickeyService])
], ReportService);
exports.ReportService = ReportService;
//# sourceMappingURL=report.service.js.map