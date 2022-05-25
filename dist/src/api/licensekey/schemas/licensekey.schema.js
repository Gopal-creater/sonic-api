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
exports.LicenseKeySchema = exports.LicenseKey = exports.LKReserve = exports.LKOwner = exports.LicenseKeySchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const Enums_1 = require("../../../constants/Enums");
exports.LicenseKeySchemaName = 'LicenseKey';
let LKOwner = class LKOwner {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: String, ref: 'User', required: true, autopopulate: true }),
    __metadata("design:type", Object)
], LKOwner.prototype, "ownerId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", String)
], LKOwner.prototype, "username", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], LKOwner.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], LKOwner.prototype, "name", void 0);
LKOwner = __decorate([
    mongoose_1.Schema()
], LKOwner);
exports.LKOwner = LKOwner;
let LKReserve = class LKReserve {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", String)
], LKReserve.prototype, "jobId", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", Number)
], LKReserve.prototype, "count", void 0);
LKReserve = __decorate([
    mongoose_1.Schema()
], LKReserve);
exports.LKReserve = LKReserve;
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
    mongoose_1.Prop({ required: true, default: 0 }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "maxEncodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true, default: 0 }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "oldMaxEncodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "encodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: false, default: false }),
    __metadata("design:type", Boolean)
], LicenseKey.prototype, "isUnlimitedEncode", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true, default: 0 }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "maxDecodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true, default: 0 }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "oldMaxDecodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "decodeUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: false, default: false }),
    __metadata("design:type", Boolean)
], LicenseKey.prototype, "isUnlimitedDecode", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true, default: 0 }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "maxMonitoringUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true, default: 0 }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "oldMaxMonitoringUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], LicenseKey.prototype, "monitoringUses", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: false, default: false }),
    __metadata("design:type", Boolean)
], LicenseKey.prototype, "isUnlimitedMonitor", void 0);
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
    mongoose_1.Prop({
        type: Date
    }),
    __metadata("design:type", Date)
], LicenseKey.prototype, "oldValidity", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Map)
], LicenseKey.prototype, "metaData", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", String)
], LicenseKey.prototype, "createdBy", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], LicenseKey.prototype, "updatedBy", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Company',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], LicenseKey.prototype, "company", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop([
        { type: String, ref: 'User', autopopulate: { maxDepth: 2 }, default: [] },
    ]),
    __metadata("design:type", Array)
], LicenseKey.prototype, "users", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: String, enum: Enums_1.ApiKeyType, default: 'Individual' }),
    __metadata("design:type", String)
], LicenseKey.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop([LKReserve]),
    __metadata("design:type", Array)
], LicenseKey.prototype, "reserves", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Plan',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], LicenseKey.prototype, "previousPlan", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Plan',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], LicenseKey.prototype, "activePlan", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop([
        {
            type: mongoose_2.Schema.Types.ObjectId,
            ref: 'Plan',
            autopopulate: { maxDepth: 2 },
            default: [],
        },
    ]),
    __metadata("design:type", Array)
], LicenseKey.prototype, "payments", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], LicenseKey.prototype, "planType", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], LicenseKey.prototype, "notes", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop([String]),
    __metadata("design:type", Array)
], LicenseKey.prototype, "logs", void 0);
LicenseKey = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.LicenseKeySchemaName })
], LicenseKey);
exports.LicenseKey = LicenseKey;
exports.LicenseKeySchema = mongoose_1.SchemaFactory.createForClass(LicenseKey);
//# sourceMappingURL=licensekey.schema.js.map