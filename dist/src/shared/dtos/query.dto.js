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
exports.QueryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const paginationquery_dto_1 = require("./paginationquery.dto");
class QueryDto extends paginationquery_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { filter: { required: false, type: () => Object }, _sort: { required: false, type: () => String } };
    }
}
__decorate([
    class_validator_1.IsOptional(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], QueryDto.prototype, "filter", void 0);
__decorate([
    class_validator_1.IsOptional(),
    swagger_1.ApiProperty({ description: "Eg: createdAt:desc Or createdAt:desc,email:asc" }),
    __metadata("design:type", String)
], QueryDto.prototype, "_sort", void 0);
exports.QueryDto = QueryDto;
//# sourceMappingURL=query.dto.js.map