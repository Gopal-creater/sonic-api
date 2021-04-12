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
exports.JobFileSchema = exports.JobFile = exports.JobFileSchemaName = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const job_schema_1 = require("./job.schema");
const sonickey_schema_1 = require("./sonickey.schema");
exports.JobFileSchemaName = "JobFile";
let JobFile = class JobFile extends mongoose_2.Document {
    constructor(data) {
        super();
        Object.assign(this, data);
    }
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", String)
], JobFile.prototype, "sonicKeyToBe", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Sonickey' }),
    __metadata("design:type", sonickey_schema_1.SonicKey)
], JobFile.prototype, "sonicKey", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], JobFile.prototype, "isComplete", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", Map)
], JobFile.prototype, "metaData", void 0);
__decorate([
    swagger_1.ApiProperty({ type: String }),
    mongoose_1.Prop({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Job', required: true }),
    __metadata("design:type", job_schema_1.Job)
], JobFile.prototype, "job", void 0);
JobFile = __decorate([
    mongoose_1.Schema({ timestamps: true, collection: exports.JobFileSchemaName }),
    __metadata("design:paramtypes", [Object])
], JobFile);
exports.JobFile = JobFile;
exports.JobFileSchema = mongoose_1.SchemaFactory.createForClass(JobFile);
//# sourceMappingURL=jobfile.schema.js.map