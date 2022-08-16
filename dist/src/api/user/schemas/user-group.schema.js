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
exports.UserGroupSchema = exports.UserGroup = exports.UserGroupSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const group_schema_1 = require("../../group/schemas/group.schema");
exports.UserGroupSchemaName = 'UserGroup';
let UserGroup = class UserGroup extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: group_schema_1.GroupSchemaName,
        autopopulate: true,
        required: true
    }),
    __metadata("design:type", Object)
], UserGroup.prototype, "group", void 0);
UserGroup = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.UserGroupSchemaName })
], UserGroup);
exports.UserGroup = UserGroup;
exports.UserGroupSchema = mongoose_1.SchemaFactory.createForClass(UserGroup);
//# sourceMappingURL=user-group.schema.js.map