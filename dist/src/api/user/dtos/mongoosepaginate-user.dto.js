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
exports.MongoosePaginateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const user_db_schema_1 = require("../schemas/user.db.schema");
class MongoosePaginateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { docs: { required: true }, totalDocs: { required: true, type: () => Number }, offset: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number }, page: { required: true, type: () => Number }, pagingCounter: { required: true, type: () => Number }, hasPrevPage: { required: true, type: () => Boolean }, hasNextPage: { required: true, type: () => Boolean }, prevPage: { required: true, type: () => Number }, nextPage: { required: true, type: () => Number } };
    }
}
__decorate([
    swagger_1.ApiProperty({ isArray: true, type: user_db_schema_1.UserDB }),
    __metadata("design:type", Array)
], MongoosePaginateUserDto.prototype, "docs", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateUserDto.prototype, "totalDocs", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateUserDto.prototype, "offset", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateUserDto.prototype, "limit", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateUserDto.prototype, "totalPages", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateUserDto.prototype, "page", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateUserDto.prototype, "pagingCounter", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], MongoosePaginateUserDto.prototype, "hasPrevPage", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], MongoosePaginateUserDto.prototype, "hasNextPage", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateUserDto.prototype, "prevPage", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], MongoosePaginateUserDto.prototype, "nextPage", void 0);
exports.MongoosePaginateUserDto = MongoosePaginateUserDto;
//# sourceMappingURL=mongoosepaginate-user.dto.js.map