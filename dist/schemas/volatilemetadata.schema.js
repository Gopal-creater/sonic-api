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
exports.VolatileMetadata = void 0;
const swagger_1 = require("@nestjs/swagger");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
class VolatileMetadata {
    constructor(data) {
        Object.assign(this, data);
    }
}
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], VolatileMetadata.prototype, "contentName", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], VolatileMetadata.prototype, "contentDescription", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], VolatileMetadata.prototype, "contentOwner", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Boolean)
], VolatileMetadata.prototype, "contentValidation", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], VolatileMetadata.prototype, "contentFileName", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], VolatileMetadata.prototype, "contentQuality", void 0);
exports.VolatileMetadata = VolatileMetadata;
//# sourceMappingURL=volatilemetadata.schema.js.map