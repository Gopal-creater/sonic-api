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
exports.PaginationQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class PaginationQueryDto {
    constructor() {
        this._limit = 100;
        this._offset = 0;
        this._page = 1;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { _limit: { required: false, type: () => Number, default: 100 }, _offset: { required: false, type: () => Number, default: 0 }, _sort: { required: false, type: () => String }, _page: { required: false, type: () => Number, default: 1 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "_limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "_offset", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ description: "Eg: createdAt:desc Or createdAt:desc,email:asc" }),
    __metadata("design:type", String)
], PaginationQueryDto.prototype, "_sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "_page", void 0);
exports.PaginationQueryDto = PaginationQueryDto;
//# sourceMappingURL=paginationquery.dto.js.map