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
exports.RadioStation = void 0;
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const swagger_1 = require("@nestjs/swagger");
class Credential {
}
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], Credential.prototype, "username", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], Credential.prototype, "password", void 0);
let RadioStation = class RadioStation {
    constructor(data) {
        Object.assign(this, data);
    }
};
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.autoGeneratedHashKey(),
    __metadata("design:type", String)
], RadioStation.prototype, "id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], RadioStation.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], RadioStation.prototype, "streamingUrl", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], RadioStation.prototype, "website", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", String)
], RadioStation.prototype, "logo", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute({ memberType: dynamodb_data_mapper_1.embed(Credential) }),
    __metadata("design:type", Credential)
], RadioStation.prototype, "credential", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute({
        indexKeyConfigurations: {
            ownerIndex: 'HASH',
        },
    }),
    __metadata("design:type", String)
], RadioStation.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.rangeKey({ defaultProvider: () => new Date() }),
    __metadata("design:type", Date)
], RadioStation.prototype, "createdAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", Date)
], RadioStation.prototype, "startedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", Date)
], RadioStation.prototype, "stopAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute({ defaultProvider: () => false }),
    __metadata("design:type", Boolean)
], RadioStation.prototype, "isStreamStarted", void 0);
__decorate([
    swagger_1.ApiProperty(),
    dynamodb_data_mapper_annotations_1.attribute(),
    __metadata("design:type", Object)
], RadioStation.prototype, "logs", void 0);
RadioStation = __decorate([
    dynamodb_data_mapper_annotations_1.table('RadioStation'),
    __metadata("design:paramtypes", [Object])
], RadioStation);
exports.RadioStation = RadioStation;
//# sourceMappingURL=radiostation.schema.js.map