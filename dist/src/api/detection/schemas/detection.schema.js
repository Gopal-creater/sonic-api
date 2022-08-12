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
exports.DetectionSchema = exports.Detection = exports.ThirdpartyStreamReaderDetection = exports.RadioProgram = exports.DetectedTimeStamp = exports.DetectionSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const radiostation_schema_1 = require("../../radiostation/schemas/radiostation.schema");
const sonickey_schema_1 = require("../../sonickey/schemas/sonickey.schema");
const Enums_1 = require("../../../constants/Enums");
const common_interface_1 = require("../../../shared/interfaces/common.interface");
exports.DetectionSchemaName = "Detection";
let DetectedTimeStamp = class DetectedTimeStamp {
};
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DetectedTimeStamp.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DetectedTimeStamp.prototype, "end", void 0);
DetectedTimeStamp = __decorate([
    (0, mongoose_1.Schema)()
], DetectedTimeStamp);
exports.DetectedTimeStamp = DetectedTimeStamp;
let RadioProgram = class RadioProgram {
};
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RadioProgram.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RadioProgram.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RadioProgram.prototype, "dj", void 0);
RadioProgram = __decorate([
    (0, mongoose_1.Schema)()
], RadioProgram);
exports.RadioProgram = RadioProgram;
let ThirdpartyStreamReaderDetection = class ThirdpartyStreamReaderDetection {
};
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThirdpartyStreamReaderDetection.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThirdpartyStreamReaderDetection.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ThirdpartyStreamReaderDetection.prototype, "detectedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Map)
], ThirdpartyStreamReaderDetection.prototype, "metaData", void 0);
ThirdpartyStreamReaderDetection = __decorate([
    (0, mongoose_1.Schema)()
], ThirdpartyStreamReaderDetection);
exports.ThirdpartyStreamReaderDetection = ThirdpartyStreamReaderDetection;
let Detection = class Detection extends mongoose_2.Document {
};
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: radiostation_schema_1.RadioStationSchemaName, autopopulate: { maxDepth: 2 } }),
    __metadata("design:type", Object)
], Detection.prototype, "radioStation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ type: String, ref: sonickey_schema_1.SonicKeySchemaName, required: true, autopopulate: { maxDepth: 2 } }),
    __metadata("design:type", Object)
], Detection.prototype, "sonicKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", String)
], Detection.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", String)
], Detection.prototype, "licenseKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({
        type: String,
        ref: 'User',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], Detection.prototype, "owner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Partner',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], Detection.prototype, "partner", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Company',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], Detection.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Detection.prototype, "sonicKeyOwnerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Detection.prototype, "sonicKeyOwnerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ type: String, enum: Enums_1.ChannelEnums, required: true }),
    __metadata("design:type", String)
], Detection.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Detection.prototype, "channelUuid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ default: Date.now() }),
    __metadata("design:type", Date)
], Detection.prototype, "detectedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], Detection.prototype, "detectionSourceFileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)([{ type: String, default: [] }]),
    __metadata("design:type", Array)
], Detection.prototype, "detectionOrigins", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)([DetectedTimeStamp]),
    __metadata("design:type", Array)
], Detection.prototype, "detectedTimestamps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Detection.prototype, "detectedDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Map)
], Detection.prototype, "metaData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ type: ThirdpartyStreamReaderDetection }),
    __metadata("design:type", ThirdpartyStreamReaderDetection)
], Detection.prototype, "thirdpartyStreamReaderDetection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ type: RadioProgram }),
    __metadata("design:type", RadioProgram)
], Detection.prototype, "program", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Detection.prototype, "groups", void 0);
Detection = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: exports.DetectionSchemaName })
], Detection);
exports.Detection = Detection;
exports.DetectionSchema = mongoose_1.SchemaFactory.createForClass(Detection);
//# sourceMappingURL=detection.schema.js.map