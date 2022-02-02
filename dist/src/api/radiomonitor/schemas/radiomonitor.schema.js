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
exports.RadioMonitorSchema = exports.RadioMonitor = exports.RadioMonitorSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const radiostation_schema_1 = require("../../radiostation/schemas/radiostation.schema");
const licensekey_schema_1 = require("../../licensekey/schemas/licensekey.schema");
exports.RadioMonitorSchemaName = 'RadioMonitor';
let RadioMonitor = class RadioMonitor extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: radiostation_schema_1.RadioStationSchemaName,
        required: true,
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], RadioMonitor.prototype, "radio", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: radiostation_schema_1.RadioStation }),
    __metadata("design:type", radiostation_schema_1.RadioStation)
], RadioMonitor.prototype, "radioSearch", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: mongoose_2.Schema.Types.String,
        ref: licensekey_schema_1.LicenseKeySchemaName,
        required: true,
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], RadioMonitor.prototype, "license", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        required: true,
    }),
    __metadata("design:type", String)
], RadioMonitor.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Date }),
    __metadata("design:type", Date)
], RadioMonitor.prototype, "startedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Date }),
    __metadata("design:type", Date)
], RadioMonitor.prototype, "stopAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], RadioMonitor.prototype, "isListeningStarted", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], RadioMonitor.prototype, "isError", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: null }),
    __metadata("design:type", Map)
], RadioMonitor.prototype, "error", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Map)
], RadioMonitor.prototype, "metaData", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop([String]),
    __metadata("design:type", Array)
], RadioMonitor.prototype, "groups", void 0);
RadioMonitor = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.RadioMonitorSchemaName })
], RadioMonitor);
exports.RadioMonitor = RadioMonitor;
exports.RadioMonitorSchema = mongoose_1.SchemaFactory.createForClass(RadioMonitor);
//# sourceMappingURL=radiomonitor.schema.js.map