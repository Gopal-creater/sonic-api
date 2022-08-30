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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuejobService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const queuejob_schema_1 = require("./schemas/queuejob.schema");
let QueuejobService = class QueuejobService {
    constructor(queueJobModel) {
        this.queueJobModel = queueJobModel;
    }
    find(filter) {
        return this.queueJobModel.find(filter);
    }
    findById(id) {
        return this.queueJobModel.findById(id);
    }
    async create(doc) {
        const newSonicKey = await this.queueJobModel.create(doc);
        return newSonicKey.save();
    }
    update(id, updateSonicKeyDto) {
        return this.queueJobModel.findByIdAndUpdate(id, updateSonicKeyDto, {
            new: true,
        });
    }
    findOne(filter) {
        return this.queueJobModel.findOne(filter).lean();
    }
    async removeById(id) {
        return this.queueJobModel.findByIdAndRemove(id);
    }
};
QueuejobService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(queuejob_schema_1.QueueJob.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], QueuejobService);
exports.QueuejobService = QueuejobService;
//# sourceMappingURL=queuejob.service.js.map