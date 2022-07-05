"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModule = void 0;
const common_1 = require("@nestjs/common");
const report_service_1 = require("./report.service");
const report_controller_1 = require("./report.controller");
const detection_module_1 = require("../detection/detection.module");
const sonickey_module_1 = require("../sonickey/sonickey.module");
const company_module_1 = require("../company/company.module");
const user_module_1 = require("../user/user.module");
const auth_module_1 = require("../auth/auth.module");
const file_handler_service_1 = require("../../shared/services/file-handler.service");
let ReportModule = class ReportModule {
};
ReportModule = __decorate([
    common_1.Module({
        imports: [
            common_1.forwardRef(() => user_module_1.UserModule),
            common_1.forwardRef(() => company_module_1.CompanyModule),
            common_1.forwardRef(() => auth_module_1.AuthModule),
            detection_module_1.DetectionModule,
            sonickey_module_1.SonickeyModule
        ],
        controllers: [report_controller_1.ReportController],
        providers: [report_service_1.ReportService, file_handler_service_1.FileHandlerService],
    })
], ReportModule);
exports.ReportModule = ReportModule;
//# sourceMappingURL=report.module.js.map