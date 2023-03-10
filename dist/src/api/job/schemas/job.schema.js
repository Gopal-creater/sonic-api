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
exports.JobSchema = exports.Job = exports.JobSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
exports.JobSchemaName = "Job";
let Job = class Job extends mongoose_2.Document {
};
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        required: true
    }),
    __metadata("design:type", String)
], Job.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        required: true
    }),
    __metadata("design:type", String)
], Job.prototype, "owner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: 10 }),
    __metadata("design:type", Number)
], Job.prototype, "encodingStrength", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        required: true,
        select: false
    }),
    __metadata("design:type", String)
], Job.prototype, "license", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], Job.prototype, "isComplete", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'JobFile', autopopulate: { maxDepth: 2 } }] }),
    __metadata("design:type", Array)
], Job.prototype, "jobFiles", void 0);
Job = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.JobSchemaName })
], Job);
exports.Job = Job;
exports.JobSchema = mongoose_1.SchemaFactory.createForClass(Job);
//# sourceMappingURL=job.schema.js.map