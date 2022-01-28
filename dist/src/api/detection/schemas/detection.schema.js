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
exports.DetectionSchema = exports.Detection = exports.ThirdPartyRadioDetection = exports.DetectedTimeStamp = exports.DetectionSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const radiostation_schema_1 = require("../../radiostation/schemas/radiostation.schema");
const sonickey_schema_1 = require("../../sonickey/schemas/sonickey.schema");
const Enums_1 = require("../../../constants/Enums");
exports.DetectionSchemaName = "Detection";
let DetectedTimeStamp = class DetectedTimeStamp {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], DetectedTimeStamp.prototype, "start", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], DetectedTimeStamp.prototype, "end", void 0);
DetectedTimeStamp = __decorate([
    mongoose_1.Schema()
], DetectedTimeStamp);
exports.DetectedTimeStamp = DetectedTimeStamp;
let ThirdPartyRadioDetection = class ThirdPartyRadioDetection {
};
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ThirdPartyRadioDetection.prototype, "country", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ThirdPartyRadioDetection.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Date)
], ThirdPartyRadioDetection.prototype, "detectedAt", void 0);
ThirdPartyRadioDetection = __decorate([
    mongoose_1.Schema()
], ThirdPartyRadioDetection);
exports.ThirdPartyRadioDetection = ThirdPartyRadioDetection;
let Detection = class Detection extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.ObjectId, ref: radiostation_schema_1.RadioStationSchemaName, autopopulate: true }),
    __metadata("design:type", Object)
], Detection.prototype, "radioStation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: String, ref: sonickey_schema_1.SonicKeySchemaName, required: true, autopopulate: true }),
    __metadata("design:type", Object)
], Detection.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Detection.prototype, "apiKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Detection.prototype, "licenseKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", String)
], Detection.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", String)
], Detection.prototype, "sonicKeyOwnerId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Detection.prototype, "sonicKeyOwnerName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: String, enum: Enums_1.ChannelEnums, required: true }),
    __metadata("design:type", String)
], Detection.prototype, "channel", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: String }),
    __metadata("design:type", String)
], Detection.prototype, "channelUuid", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: Date.now() }),
    __metadata("design:type", Date)
], Detection.prototype, "detectedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop([DetectedTimeStamp]),
    __metadata("design:type", Array)
], Detection.prototype, "detectedTimestamps", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Detection.prototype, "detectedDuration", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Map)
], Detection.prototype, "metaData", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: ThirdPartyRadioDetection }),
    __metadata("design:type", ThirdPartyRadioDetection)
], Detection.prototype, "thirdpartyRadioDetection", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop([String]),
    __metadata("design:type", Array)
], Detection.prototype, "groups", void 0);
Detection = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.DetectionSchemaName })
], Detection);
exports.Detection = Detection;
exports.DetectionSchema = mongoose_1.SchemaFactory.createForClass(Detection);
//# sourceMappingURL=detection.schema.js.map