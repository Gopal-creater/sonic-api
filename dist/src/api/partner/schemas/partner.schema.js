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
exports.PartnerSchema = exports.Partner = exports.PartnerSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const company_schema_1 = require("../../company/schemas/company.schema");
exports.PartnerSchemaName = 'Partner';
let Partner = class Partner extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        required: true
    }),
    __metadata("design:type", String)
], Partner.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Partner.prototype, "description", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Partner.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Partner.prototype, "contactNo", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: company_schema_1.Address }),
    __metadata("design:type", company_schema_1.Address)
], Partner.prototype, "address", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: String,
        ref: 'User',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], Partner.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Partner.prototype, "createdBy", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Partner.prototype, "updatedBy", void 0);
Partner = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.PartnerSchemaName })
], Partner);
exports.Partner = Partner;
exports.PartnerSchema = mongoose_1.SchemaFactory.createForClass(Partner);
//# sourceMappingURL=partner.schema.js.map