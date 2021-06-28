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
exports.RadioStationSchema = exports.RadioStation = exports.Credential = exports.RadioStationSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
exports.RadioStationSchemaName = "RadioStation";
let Credential = class Credential {
};
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Credential.prototype, "username", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], Credential.prototype, "password", void 0);
Credential = __decorate([
    mongoose_1.Schema()
], Credential);
exports.Credential = Credential;
let RadioStation = class RadioStation extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        required: true
    }),
    __metadata("design:type", String)
], RadioStation.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], RadioStation.prototype, "streamingUrl", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], RadioStation.prototype, "website", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], RadioStation.prototype, "logo", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Credential }),
    __metadata("design:type", Credential)
], RadioStation.prototype, "credential", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], RadioStation.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Date }),
    __metadata("design:type", Date)
], RadioStation.prototype, "startedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Date }),
    __metadata("design:type", Date)
], RadioStation.prototype, "stopAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], RadioStation.prototype, "isStreamStarted", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], RadioStation.prototype, "isError", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: null }),
    __metadata("design:type", Map)
], RadioStation.prototype, "error", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], RadioStation.prototype, "notes", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Map)
], RadioStation.prototype, "metaData", void 0);
RadioStation = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.RadioStationSchemaName })
], RadioStation);
exports.RadioStation = RadioStation;
exports.RadioStationSchema = mongoose_1.SchemaFactory.createForClass(RadioStation);
//# sourceMappingURL=radiostation.schema.js.map