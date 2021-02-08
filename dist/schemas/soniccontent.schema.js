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
exports.SonicContent = void 0;
const swagger_1 = require("@nestjs/swagger");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const staticmetadata_schema_1 = require("../schemas/staticmetadata.schema");
const volatilemetadata_schema_1 = require("../schemas/volatilemetadata.schema");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
class SonicContent {
    constructor(data) {
        Object.assign(this, data);
    }
}
__decorate([
    dynamodb_data_mapper_annotations_1.attribute({ memberType: dynamodb_data_mapper_1.embed(staticmetadata_schema_1.StaticMetadata) }),
    swagger_1.ApiProperty(),
    __metadata("design:type", staticmetadata_schema_1.StaticMetadata)
], SonicContent.prototype, "staticMetadata", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute({ memberType: dynamodb_data_mapper_1.embed(volatilemetadata_schema_1.VolatileMetadata) }),
    swagger_1.ApiProperty(),
    __metadata("design:type", volatilemetadata_schema_1.VolatileMetadata)
], SonicContent.prototype, "volatileMetadata", void 0);
__decorate([
    dynamodb_data_mapper_annotations_1.attribute(),
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], SonicContent.prototype, "additionalMetadata", void 0);
exports.SonicContent = SonicContent;
//# sourceMappingURL=soniccontent.schema.js.map