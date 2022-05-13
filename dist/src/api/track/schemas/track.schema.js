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
exports.TrackSchema = exports.Track = exports.TrackSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const api_key_schema_1 = require("../../api-key/schemas/api-key.schema");
const Enums_1 = require("../../../constants/Enums");
const sonickey_schema_1 = require("../../sonickey/schemas/sonickey.schema");
exports.TrackSchemaName = 'Track';
let Track = class Track extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiHideProperty(),
    mongoose_1.Prop({
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], Track.prototype, "_id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: String,
        ref: 'User',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", String)
], Track.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Company',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", String)
], Track.prototype, "company", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Partner',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", String)
], Track.prototype, "partner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: api_key_schema_1.ApiKeySchemaName,
        select: false,
    }),
    __metadata("design:type", Object)
], Track.prototype, "apiKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: String, enum: Enums_1.ChannelEnums, required: true }),
    __metadata("design:type", String)
], Track.prototype, "channel", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: String }),
    __metadata("design:type", String)
], Track.prototype, "channelUuid", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        required: true,
        select: false,
    }),
    __metadata("design:type", String)
], Track.prototype, "license", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Track.prototype, "mimeType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Track.prototype, "artist", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Track.prototype, "title", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Track.prototype, "duration", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Track.prototype, "fileSize", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Track.prototype, "localFilePath", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: sonickey_schema_1.S3FileMeta }),
    __metadata("design:type", sonickey_schema_1.S3FileMeta)
], Track.prototype, "s3OriginalFileMeta", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Track.prototype, "fileType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Track.prototype, "encoding", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Track.prototype, "samplingFrequency", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Track.prototype, "originalFileName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], Track.prototype, "iExtractedMetaData", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: String,
        ref: 'User',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", String)
], Track.prototype, "createdBy", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: String,
        ref: 'User',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", String)
], Track.prototype, "updatedBy", void 0);
Track = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.TrackSchemaName })
], Track);
exports.Track = Track;
exports.TrackSchema = mongoose_1.SchemaFactory.createForClass(Track);
//# sourceMappingURL=track.schema.js.map