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
exports.RadioStationSonicKeySchema = exports.RadioStationSonicKey = exports.RadioStationSonicKeySchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const radiostation_schema_1 = require("./radiostation.schema");
const sonickey_schema_1 = require("./sonickey.schema");
exports.RadioStationSonicKeySchemaName = 'RadioStationSonicKey';
let RadioStationSonicKey = class RadioStationSonicKey extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.ObjectId, ref: radiostation_schema_1.RadioStationSchemaName, required: true, autopopulate: true }),
    __metadata("design:type", Object)
], RadioStationSonicKey.prototype, "radioStation", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: String, required: true }),
    __metadata("design:type", Object)
], RadioStationSonicKey.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], RadioStationSonicKey.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Map)
], RadioStationSonicKey.prototype, "metaData", void 0);
RadioStationSonicKey = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.RadioStationSonicKeySchemaName, toJSON: { virtuals: true } })
], RadioStationSonicKey);
exports.RadioStationSonicKey = RadioStationSonicKey;
exports.RadioStationSonicKeySchema = mongoose_1.SchemaFactory.createForClass(RadioStationSonicKey);
exports.RadioStationSonicKeySchema.virtual('sonicKeyData', {
    ref: sonickey_schema_1.SonicKeySchemaName,
    localField: 'sonicKey',
    foreignField: 'sonicKey',
    justOne: true,
    autopopulate: true
});
//# sourceMappingURL=radiostation-sonickey.schema.js.map