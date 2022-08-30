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
exports.ThirdpartyDetectionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const thirdparty_detection_schema_1 = require("./schemas/thirdparty-detection.schema");
const mongoose_2 = require("mongoose");
let ThirdpartyDetectionService = class ThirdpartyDetectionService {
    constructor(thirdpartyDetectionModel) {
        this.thirdpartyDetectionModel = thirdpartyDetectionModel;
    }
    async findAll(queryDto) {
        const { limit, skip, sort, page, filter, select, populate } = queryDto;
        var paginateOptions = {};
        paginateOptions['sort'] = sort;
        paginateOptions['select'] = select;
        paginateOptions['populate'] = populate;
        paginateOptions['offset'] = skip;
        paginateOptions['page'] = page;
        paginateOptions['limit'] = limit;
        return await this.thirdpartyDetectionModel["paginate"](filter, paginateOptions);
    }
    findById(id) {
        return this.thirdpartyDetectionModel.findById(id);
    }
    update(id, updateThirdpartyDetectionDto) {
        return this.thirdpartyDetectionModel.findByIdAndUpdate(id, updateThirdpartyDetectionDto, { new: true });
    }
    remove(id) {
        return this.thirdpartyDetectionModel.findByIdAndDelete(id, { new: true });
    }
};
ThirdpartyDetectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(thirdparty_detection_schema_1.ThirdpartyDetection.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ThirdpartyDetectionService);
exports.ThirdpartyDetectionService = ThirdpartyDetectionService;
//# sourceMappingURL=thirdparty-detection.service.js.map