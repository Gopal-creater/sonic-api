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
exports.MongoosePaginateRadioMonitorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const radiomonitor_schema_1 = require("../schemas/radiomonitor.schema");
class MongoosePaginateRadioMonitorDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: radiomonitor_schema_1.RadioMonitor }),
    __metadata("design:type", Array)
], MongoosePaginateRadioMonitorDto.prototype, "docs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateRadioMonitorDto.prototype, "totalDocs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateRadioMonitorDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateRadioMonitorDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateRadioMonitorDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateRadioMonitorDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateRadioMonitorDto.prototype, "pagingCounter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MongoosePaginateRadioMonitorDto.prototype, "hasPrevPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MongoosePaginateRadioMonitorDto.prototype, "hasNextPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateRadioMonitorDto.prototype, "prevPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateRadioMonitorDto.prototype, "nextPage", void 0);
exports.MongoosePaginateRadioMonitorDto = MongoosePaginateRadioMonitorDto;
//# sourceMappingURL=mongoosepaginate-radiomonitordto.js.map