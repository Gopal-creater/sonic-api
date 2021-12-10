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
exports.ParsedQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const types_1 = require("../types");
class ParsedQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Object)
], ParsedQueryDto.prototype, "filter", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Object)
], ParsedQueryDto.prototype, "sort", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Number)
], ParsedQueryDto.prototype, "limit", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Number)
], ParsedQueryDto.prototype, "skip", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Object)
], ParsedQueryDto.prototype, "select", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Object)
], ParsedQueryDto.prototype, "populate", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Array)
], ParsedQueryDto.prototype, "aggregateSearch", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Number)
], ParsedQueryDto.prototype, "page", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Number)
], ParsedQueryDto.prototype, "topLimit", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Boolean)
], ParsedQueryDto.prototype, "includeGraph", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Boolean)
], ParsedQueryDto.prototype, "advanceSearch", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Boolean)
], ParsedQueryDto.prototype, "includeGroupData", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", String)
], ParsedQueryDto.prototype, "groupByTime", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    __metadata("design:type", Object)
], ParsedQueryDto.prototype, "relationalFilter", void 0);
exports.ParsedQueryDto = ParsedQueryDto;
//# sourceMappingURL=parsedquery.dto.js.map