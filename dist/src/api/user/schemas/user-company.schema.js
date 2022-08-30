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
exports.UserCompanySchema = exports.UserCompany = exports.UserCompanySchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const company_schema_1 = require("../../company/schemas/company.schema");
exports.UserCompanySchemaName = 'UserCompany';
let UserCompany = class UserCompany extends mongoose_2.Document {
};
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: company_schema_1.CompanySchemaName,
        autopopulate: true,
        required: true,
    }),
    __metadata("design:type", Object)
], UserCompany.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], UserCompany.prototype, "isAdmin", void 0);
UserCompany = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: exports.UserCompanySchemaName })
], UserCompany);
exports.UserCompany = UserCompany;
exports.UserCompanySchema = mongoose_1.SchemaFactory.createForClass(UserCompany);
//# sourceMappingURL=user-company.schema.js.map