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
exports.QueueJobSchema = exports.QueueJob = exports.QueueJobSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
exports.QueueJobSchemaName = 'QueueJob';
let QueueJob = class QueueJob extends mongoose_2.Document {
};
__decorate([
    mongoose_1.Prop({
        type: String,
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], QueueJob.prototype, "_id", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], QueueJob.prototype, "name", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], QueueJob.prototype, "jobData", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], QueueJob.prototype, "metaData", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Company',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], QueueJob.prototype, "company", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: String,
        ref: 'User',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], QueueJob.prototype, "user", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({
        type: String,
        ref: 'Partner',
        autopopulate: { maxDepth: 2 },
    }),
    __metadata("design:type", Object)
], QueueJob.prototype, "partner", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], QueueJob.prototype, "completed", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], QueueJob.prototype, "error", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], QueueJob.prototype, "errorData", void 0);
QueueJob = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.QueueJobSchemaName })
], QueueJob);
exports.QueueJob = QueueJob;
exports.QueueJobSchema = mongoose_1.SchemaFactory.createForClass(QueueJob);
//# sourceMappingURL=queuejob.schema.js.map