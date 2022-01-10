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
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const group_schema_1 = require("./schemas/group.schema");
let GroupService = class GroupService {
    constructor(groupModel) {
        this.groupModel = groupModel;
    }
    async create(createGroupDto) {
        const newGroup = await this.groupModel.create(createGroupDto);
        return newGroup.save();
    }
    findAll() {
        return this.groupModel.find();
    }
    findOne(id) {
        return this.groupModel.findById(id);
    }
    update(id, updateGroupDto) {
        return this.groupModel.findByIdAndUpdate(id, updateGroupDto);
    }
    remove(id) {
        return this.groupModel.findByIdAndRemove(id);
    }
};
GroupService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(group_schema_1.Group.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GroupService);
exports.GroupService = GroupService;
//# sourceMappingURL=group.service.js.map