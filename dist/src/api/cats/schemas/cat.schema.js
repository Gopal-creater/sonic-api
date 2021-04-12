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
exports.CatSchema = exports.Cat = exports.Credential = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
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
let Cat = class Cat extends mongoose_2.Document {
    constructor(data) {
        super();
        Object.assign(this, data);
    }
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        required: true
    }),
    __metadata("design:type", String)
], Cat.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Cat.prototype, "streamingUrl", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Cat.prototype, "website", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Cat.prototype, "logo", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Credential }),
    __metadata("design:type", Credential)
], Cat.prototype, "credential", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Cat.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Date }),
    __metadata("design:type", Date)
], Cat.prototype, "startedAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Date }),
    __metadata("design:type", Date)
], Cat.prototype, "stopAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], Cat.prototype, "isStreamStarted", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Cat.prototype, "notes", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Map)
], Cat.prototype, "metaData", void 0);
Cat = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: 'Cat' }),
    __metadata("design:paramtypes", [Object])
], Cat);
exports.Cat = Cat;
exports.CatSchema = mongoose_1.SchemaFactory.createForClass(Cat);
//# sourceMappingURL=cat.schema.js.map