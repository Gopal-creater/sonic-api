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
exports.RawUserModel = exports.UserSchema = exports.UserDB = exports.MFAOption = exports.UserSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const group_schema_1 = require("../../group/schemas/group.schema");
const company_schema_1 = require("../../company/schemas/company.schema");
exports.UserSchemaName = 'User';
class MFAOption {
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], MFAOption.prototype, "AttributeName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], MFAOption.prototype, "DeliveryMedium", void 0);
exports.MFAOption = MFAOption;
let UserDB = class UserDB extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiHideProperty(),
    mongoose_1.Prop({
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], UserDB.prototype, "_id", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    mongoose_1.Prop({
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], UserDB.prototype, "username", void 0);
__decorate([
    swagger_1.ApiHideProperty(),
    mongoose_1.Prop({
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], UserDB.prototype, "sub", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop([
        {
            type: mongoose_2.Schema.Types.ObjectId,
            ref: group_schema_1.GroupSchemaName,
            autopopulate: { maxDepth: 2 },
        },
    ]),
    __metadata("design:type", Array)
], UserDB.prototype, "groups", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Boolean)
], UserDB.prototype, "email_verified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Boolean)
], UserDB.prototype, "phone_number_verified", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], UserDB.prototype, "phone_number", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], UserDB.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], UserDB.prototype, "user_status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Boolean)
], UserDB.prototype, "enabled", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop([MFAOption]),
    __metadata("design:type", Array)
], UserDB.prototype, "mfa_options", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop([{
            type: mongoose_2.Schema.Types.ObjectId,
            ref: company_schema_1.CompanySchemaName,
            autopopulate: { maxDepth: 2 },
        }]),
    __metadata("design:type", Array)
], UserDB.prototype, "companies", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: company_schema_1.CompanySchemaName,
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], UserDB.prototype, "adminCompany", void 0);
UserDB = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.UserSchemaName })
], UserDB);
exports.UserDB = UserDB;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(UserDB);
exports.RawUserModel = mongoose_2.model('User', exports.UserSchema);
//# sourceMappingURL=user.db.schema.js.map