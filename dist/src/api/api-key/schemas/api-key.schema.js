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
exports.ApiKeySchema = exports.ApiKey = exports.ApiKeySchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
exports.ApiKeySchemaName = 'ApiKey';
let ApiKey = class ApiKey extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", String)
], ApiKey.prototype, "customer", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Date, default: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) }),
    __metadata("design:type", Date)
], ApiKey.prototype, "validity", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], ApiKey.prototype, "disabled", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], ApiKey.prototype, "suspended", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], ApiKey.prototype, "encodeUsageCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], ApiKey.prototype, "decodeUsageCount", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Map)
], ApiKey.prototype, "metaData", void 0);
ApiKey = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.ApiKeySchemaName })
], ApiKey);
exports.ApiKey = ApiKey;
exports.ApiKeySchema = mongoose_1.SchemaFactory.createForClass(ApiKey);
//# sourceMappingURL=api-key.schema.js.map