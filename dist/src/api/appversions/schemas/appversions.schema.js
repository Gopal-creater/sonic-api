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
exports.AppVersionSchema = exports.AppVersion = exports.S3FileMeta = exports.AppVersionSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
exports.AppVersionSchemaName = 'AppVersion';
const Enums_1 = require("../../../constants/Enums");
let S3FileMeta = class S3FileMeta {
};
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], S3FileMeta.prototype, "ETag", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], S3FileMeta.prototype, "Location", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], S3FileMeta.prototype, "key", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], S3FileMeta.prototype, "Key", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], S3FileMeta.prototype, "Bucket", void 0);
S3FileMeta = __decorate([
    mongoose_1.Schema()
], S3FileMeta);
exports.S3FileMeta = S3FileMeta;
let AppVersion = class AppVersion extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        required: true
    }),
    __metadata("design:type", String)
], AppVersion.prototype, "versionCode", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], AppVersion.prototype, "contentVersionFilePath", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], AppVersion.prototype, "originalVersionFileName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        required: true
    }),
    __metadata("design:type", String)
], AppVersion.prototype, "releaseNote", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        default: false
    }),
    __metadata("design:type", Boolean)
], AppVersion.prototype, "latest", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: String, enum: Enums_1.Platform }),
    __metadata("design:type", String)
], AppVersion.prototype, "platform", void 0);
__decorate([
    class_validator_1.IsOptional(),
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: S3FileMeta }),
    __metadata("design:type", S3FileMeta)
], AppVersion.prototype, "s3FileMeta", void 0);
AppVersion = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.AppVersionSchemaName })
], AppVersion);
exports.AppVersion = AppVersion;
exports.AppVersionSchema = mongoose_1.SchemaFactory.createForClass(AppVersion);
exports.AppVersionSchema.index({ versionCode: 1, platform: 1 }, { unique: true });
//# sourceMappingURL=appversions.schema.js.map