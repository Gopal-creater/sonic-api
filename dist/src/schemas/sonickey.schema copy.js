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
exports.SonicKey = void 0;
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
let SonicKey = class SonicKey {
    constructor(data) {
        Object.assign(this, data);
    }
};
__decorate([
    dynamodb_data_mapper_annotations_1.hashKey(),
    __metadata("design:type", String)
], SonicKey.prototype, "sonicKey", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute({
        indexKeyConfigurations: {
            ownerIndex: 'HASH',
        },
    }),
    __metadata("design:type", String)
], SonicKey.prototype, "owner", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], SonicKey.prototype, "licenseId", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.rangeKey({ defaultProvider: () => new Date() }),
    __metadata("design:type", Date)
], SonicKey.prototype, "createdAt", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute({ defaultProvider: () => true }),
    __metadata("design:type", Boolean)
], SonicKey.prototype, "status", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", Number)
], SonicKey.prototype, "encodingStrength", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], SonicKey.prototype, "contentType", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], SonicKey.prototype, "contentDescription", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute({ defaultProvider: () => new Date() }),
    __metadata("design:type", Date)
], SonicKey.prototype, "contentCreatedDate", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", Number)
], SonicKey.prototype, "contentDuration", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", Number)
], SonicKey.prototype, "contentSize", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], SonicKey.prototype, "contentFilePath", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], SonicKey.prototype, "contentFileType", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], SonicKey.prototype, "contentEncoding", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], SonicKey.prototype, "contentSamplingFrequency", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], SonicKey.prototype, "contentName", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], SonicKey.prototype, "contentOwner", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", Boolean)
], SonicKey.prototype, "contentValidation", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], SonicKey.prototype, "contentFileName", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], SonicKey.prototype, "contentQuality", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", Object)
], SonicKey.prototype, "additionalMetadata", void 0);
SonicKey = __decorate([
    dynamodb_data_mapper_annotations_1.table('SonicKey-New-Schema'),
    __metadata("design:paramtypes", [Object])
], SonicKey);
exports.SonicKey = SonicKey;
//# sourceMappingURL=sonickey.schema copy.js.map