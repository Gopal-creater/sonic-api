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
exports.MongoosePaginateJobFileDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const jobfile_schema_1 = require("../schemas/jobfile.schema");
class MongoosePaginateJobFileDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { docs: { required: true }, totalDocs: { required: true, type: () => Number }, offset: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number }, page: { required: true, type: () => Number }, pagingCounter: { required: true, type: () => Number }, hasPrevPage: { required: true, type: () => Boolean }, hasNextPage: { required: true, type: () => Boolean }, prevPage: { required: true, type: () => Number }, nextPage: { required: true, type: () => Number } };
    }
}
__decorate([
    swagger_1.ApiProperty({ isArray: true, type: jobfile_schema_1.JobFile }),
    __metadata("design:type", Array)
], MongoosePaginateJobFileDto.prototype, "docs", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateJobFileDto.prototype, "totalDocs", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateJobFileDto.prototype, "offset", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateJobFileDto.prototype, "limit", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateJobFileDto.prototype, "totalPages", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateJobFileDto.prototype, "page", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateJobFileDto.prototype, "pagingCounter", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], MongoosePaginateJobFileDto.prototype, "hasPrevPage", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], MongoosePaginateJobFileDto.prototype, "hasNextPage", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateJobFileDto.prototype, "prevPage", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateJobFileDto.prototype, "nextPage", void 0);
exports.MongoosePaginateJobFileDto = MongoosePaginateJobFileDto;
//# sourceMappingURL=mongoosepaginate-jobfile.dto.js.map