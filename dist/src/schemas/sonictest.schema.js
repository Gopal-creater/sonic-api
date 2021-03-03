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
exports.SonicTest = void 0;
const swagger_1 = require("@nestjs/swagger");
class SonicTest {
    constructor(data) {
        Object.assign(this, data);
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicTest.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicTest.prototype, "licenseId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], SonicTest.prototype, "createdAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], SonicTest.prototype, "status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], SonicTest.prototype, "encodingStrength", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicTest.prototype, "contentType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicTest.prototype, "contentDescription", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], SonicTest.prototype, "contentCreatedDate", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], SonicTest.prototype, "contentDuration", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], SonicTest.prototype, "contentSize", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicTest.prototype, "contentFilePath", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicTest.prototype, "contentFileType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicTest.prototype, "contentEncoding", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicTest.prototype, "contentSamplingFrequency", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicTest.prototype, "contentName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicTest.prototype, "contentOwner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], SonicTest.prototype, "contentValidation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicTest.prototype, "contentFileName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], SonicTest.prototype, "contentQuality", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], SonicTest.prototype, "additionalMetadata", void 0);
exports.SonicTest = SonicTest;
//# sourceMappingURL=sonictest.schema.js.map