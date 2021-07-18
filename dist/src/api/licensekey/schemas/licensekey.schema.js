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
exports.LicenseKeySchema = exports.LicenseKey = exports.LKOwner = exports.LicenseKeySchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
exports.LicenseKeySchemaName = 'LicenseKey';
let LKOwner = class LKOwner {
};
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], LKOwner.prototype, "ownerId", void 0);
LKOwner = __decorate([
    mongoose_1.Schema()
], LKOwner);
exports.LKOwner = LKOwner;
let LicenseKey = class LicenseKey extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiHideProperty(),
    mongoose_1.Prop({
        type: String,
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], LicenseKey.prototype, "_id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], LicenseKey.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], LicenseKey.prototype, "key", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], LicenseKey.prototype, "disabled", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], LicenseKey.prototype, "suspended", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "maxEncodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "encodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "maxDecodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "decodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: Date,
        default: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    }),
    __metadata("design:type", Date)
], LicenseKey.prototype, "validity", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Map)
], LicenseKey.prototype, "metaData", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop([LKOwner]),
    __metadata("design:type", Array)
], LicenseKey.prototype, "owners", void 0);
LicenseKey = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.LicenseKeySchemaName })
], LicenseKey);
exports.LicenseKey = LicenseKey;
exports.LicenseKeySchema = mongoose_1.SchemaFactory.createForClass(LicenseKey);
//# sourceMappingURL=licensekey.schema.js.map