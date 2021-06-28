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
exports.AnyQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AnyQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { query: { required: false, type: () => Object } };
    }
}
__decorate([
    class_validator_1.IsOptional(),
    swagger_1.ApiProperty({ description: "Here you can add any query string as you need for your query options, But please follow the standard here https://www.npmjs.com/package/mongoose-query-parser" }),
    __metadata("design:type", Object)
], AnyQueryDto.prototype, "query", void 0);
exports.AnyQueryDto = AnyQueryDto;
//# sourceMappingURL=anyquery.dto.js.map