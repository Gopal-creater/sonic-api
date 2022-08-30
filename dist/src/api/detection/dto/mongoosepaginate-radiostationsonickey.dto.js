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
exports.MongoosePaginatePlaysByRadioStationDto = exports.MongoosePaginatePlaysByTrackDto = exports.MongoosePaginatePlaysByCountryDto = exports.MongoosePaginatePlaysByArtistDto = exports.MongoosePaginatePlaysDto = exports.MongoosePaginateDetectionDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const detection_schema_1 = require("../schemas/detection.schema");
const general_dto_1 = require("./general.dto");
class MongoosePaginateDetectionDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { docs: { required: true }, totalDocs: { required: true, type: () => Number }, offset: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number }, page: { required: true, type: () => Number }, pagingCounter: { required: true, type: () => Number }, hasPrevPage: { required: true, type: () => Boolean }, hasNextPage: { required: true, type: () => Boolean }, prevPage: { required: true, type: () => Number }, nextPage: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: detection_schema_1.Detection }),
    __metadata("design:type", Array)
], MongoosePaginateDetectionDto.prototype, "docs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateDetectionDto.prototype, "totalDocs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateDetectionDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateDetectionDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateDetectionDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateDetectionDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateDetectionDto.prototype, "pagingCounter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MongoosePaginateDetectionDto.prototype, "hasPrevPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MongoosePaginateDetectionDto.prototype, "hasNextPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateDetectionDto.prototype, "prevPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginateDetectionDto.prototype, "nextPage", void 0);
exports.MongoosePaginateDetectionDto = MongoosePaginateDetectionDto;
class MongoosePaginatePlaysDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { docs: { required: true }, totalDocs: { required: true, type: () => Number }, offset: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number }, page: { required: true, type: () => Number }, pagingCounter: { required: true, type: () => Number }, hasPrevPage: { required: true, type: () => Boolean }, hasNextPage: { required: true, type: () => Boolean }, prevPage: { required: true, type: () => Number }, nextPage: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: general_dto_1.PlaysListResponseDto }),
    __metadata("design:type", Array)
], MongoosePaginatePlaysDto.prototype, "docs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginatePlaysDto.prototype, "totalDocs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginatePlaysDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginatePlaysDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginatePlaysDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginatePlaysDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginatePlaysDto.prototype, "pagingCounter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MongoosePaginatePlaysDto.prototype, "hasPrevPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MongoosePaginatePlaysDto.prototype, "hasNextPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginatePlaysDto.prototype, "prevPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MongoosePaginatePlaysDto.prototype, "nextPage", void 0);
exports.MongoosePaginatePlaysDto = MongoosePaginatePlaysDto;
class MongoosePaginatePlaysByArtistDto extends (0, swagger_1.OmitType)(MongoosePaginatePlaysDto, ['docs']) {
    static _OPENAPI_METADATA_FACTORY() {
        return { docs: { required: true } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: general_dto_1.PlaysByArtistDto }),
    __metadata("design:type", Array)
], MongoosePaginatePlaysByArtistDto.prototype, "docs", void 0);
exports.MongoosePaginatePlaysByArtistDto = MongoosePaginatePlaysByArtistDto;
class MongoosePaginatePlaysByCountryDto extends (0, swagger_1.OmitType)(MongoosePaginatePlaysDto, ['docs']) {
    static _OPENAPI_METADATA_FACTORY() {
        return { docs: { required: true } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: general_dto_1.PlaysByCountryDto }),
    __metadata("design:type", Array)
], MongoosePaginatePlaysByCountryDto.prototype, "docs", void 0);
exports.MongoosePaginatePlaysByCountryDto = MongoosePaginatePlaysByCountryDto;
class MongoosePaginatePlaysByTrackDto extends (0, swagger_1.OmitType)(MongoosePaginatePlaysDto, ['docs']) {
    static _OPENAPI_METADATA_FACTORY() {
        return { docs: { required: true } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: general_dto_1.PlaysByTrackDto }),
    __metadata("design:type", Array)
], MongoosePaginatePlaysByTrackDto.prototype, "docs", void 0);
exports.MongoosePaginatePlaysByTrackDto = MongoosePaginatePlaysByTrackDto;
class MongoosePaginatePlaysByRadioStationDto extends (0, swagger_1.OmitType)(MongoosePaginatePlaysDto, ['docs']) {
    static _OPENAPI_METADATA_FACTORY() {
        return { docs: { required: true } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: general_dto_1.PlaysByRadioStationDto }),
    __metadata("design:type", Array)
], MongoosePaginatePlaysByRadioStationDto.prototype, "docs", void 0);
exports.MongoosePaginatePlaysByRadioStationDto = MongoosePaginatePlaysByRadioStationDto;
//# sourceMappingURL=mongoosepaginate-radiostationsonickey.dto.js.map