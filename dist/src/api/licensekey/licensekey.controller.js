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
exports.LicensekeyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const licensekey_service_1 = require("./licensekey.service");
const create_licensekey_dto_1 = require("./dto/create-licensekey.dto");
const update_licensekey_dto_1 = require("./dto/update-licensekey.dto");
const swagger_1 = require("@nestjs/swagger");
let LicensekeyController = class LicensekeyController {
    constructor(licensekeyService) {
        this.licensekeyService = licensekeyService;
    }
    create(createLicensekeyDto) {
        return this.licensekeyService.create(createLicensekeyDto);
    }
    findAll() {
        return this.licensekeyService.findAll();
    }
    findOne(id) {
        return this.licensekeyService.findOne(+id);
    }
    update(id, updateLicensekeyDto) {
        return this.licensekeyService.update(+id, updateLicensekeyDto);
    }
    remove(id) {
        return this.licensekeyService.remove(+id);
    }
};
__decorate([
    common_1.Post(),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_licensekey_dto_1.CreateLicensekeyDto]),
    __metadata("design:returntype", void 0)
], LicensekeyController.prototype, "create", null);
__decorate([
    common_1.Get(),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LicensekeyController.prototype, "findAll", null);
__decorate([
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LicensekeyController.prototype, "findOne", null);
__decorate([
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_licensekey_dto_1.UpdateLicensekeyDto]),
    __metadata("design:returntype", void 0)
], LicensekeyController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LicensekeyController.prototype, "remove", null);
LicensekeyController = __decorate([
    swagger_1.ApiTags("License Keys Management"),
    common_1.Controller('licensekey'),
    __metadata("design:paramtypes", [licensekey_service_1.LicensekeyService])
], LicensekeyController);
exports.LicensekeyController = LicensekeyController;
//# sourceMappingURL=licensekey.controller.js.map