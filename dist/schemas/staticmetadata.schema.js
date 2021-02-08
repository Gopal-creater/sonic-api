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
exports.StaticMetadata = void 0;
const swagger_1 = require("@nestjs/swagger");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
class StaticMetadata {
    constructor(data) {
        this.encodingStrength = 10;
        Object.assign(this, data);
    }
}
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], StaticMetadata.prototype, "encodingStrength", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], StaticMetadata.prototype, "contentType", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute({ defaultProvider: () => new Date() }),
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], StaticMetadata.prototype, "contentCreatedDate", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], StaticMetadata.prototype, "contentDuration", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], StaticMetadata.prototype, "contentSize", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], StaticMetadata.prototype, "contentFilePath", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], StaticMetadata.prototype, "uniqueFileName", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], StaticMetadata.prototype, "originalFileName", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], StaticMetadata.prototype, "contentFileType", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], StaticMetadata.prototype, "contentEncoding", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], StaticMetadata.prototype, "contentSamplingFrequency", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], StaticMetadata.prototype, "isrcCode", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], StaticMetadata.prototype, "iswcCode", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], StaticMetadata.prototype, "tuneCode", void 0);
exports.StaticMetadata = StaticMetadata;
//# sourceMappingURL=staticmetadata.schema.js.map