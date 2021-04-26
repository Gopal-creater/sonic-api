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
exports.ThirdpartyDetectionSchema = exports.ThirdpartyDetection = exports.ThirdpartyDetectionSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
exports.ThirdpartyDetectionSchemaName = 'ThirdpartyDetection';
let ThirdpartyDetection = class ThirdpartyDetection extends mongoose_2.Document {
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ThirdpartyDetection.prototype, "customer", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ThirdpartyDetection.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Date }),
    __metadata("design:type", Date)
], ThirdpartyDetection.prototype, "detectionTime", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Map)
], ThirdpartyDetection.prototype, "metaData", void 0);
ThirdpartyDetection = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.ThirdpartyDetectionSchemaName })
], ThirdpartyDetection);
exports.ThirdpartyDetection = ThirdpartyDetection;
exports.ThirdpartyDetectionSchema = mongoose_1.SchemaFactory.createForClass(ThirdpartyDetection);
//# sourceMappingURL=thirdparty-detection.schema.js.map