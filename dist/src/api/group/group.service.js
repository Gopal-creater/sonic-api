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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const group_schema_1 = require("./schemas/group.schema");
const Enums_1 = require("../../constants/Enums");
const user_service_1 = require("../user/services/user.service");
const parsedquery_dto_1 = require("../../shared/dtos/parsedquery.dto");
let GroupService = class GroupService {
    constructor(groupModel, userService) {
        this.groupModel = groupModel;
        this.userService = userService;
    }
    async create(createGroupDto) {
        const { name } = createGroupDto;
        const newGroup = await this.groupModel.create(createGroupDto);
        const groupDb = await newGroup.save();
        await this.userService.cognitoCreateGroup(name).catch(err => console.warn("Warning: Error creating cognito group", err));
        return groupDb;
    }
    findAll() {
        return this.groupModel.find();
    }
    findOne(filter) {
        return this.groupModel.findOne(filter);
    }
    findById(id) {
        return this.groupModel.findById(id);
    }
    async getCount(queryDto) {
        const { filter, includeGroupData } = queryDto;
        return this.groupModel
            .find(filter || {})
            .count();
    }
    async getEstimateCount() {
        return this.groupModel.estimatedDocumentCount();
    }
    update(id, updateGroupDto) {
        return this.groupModel.findByIdAndUpdate(id, updateGroupDto);
    }
    async removeById(id) {
        const group = await this.findById(id);
        const deletedGroup = await this.groupModel.findByIdAndRemove(id);
        await this.userService.cognitoDeleteGroup(group.name).catch(err => console.warn("Warning: Error deleting cognito group", err));
        return deletedGroup;
    }
    async createDefaultGroups() {
        var e_1, _a;
        const defaultGroups = Object.values(Enums_1.SystemGroup);
        try {
            for (var defaultGroups_1 = __asyncValues(defaultGroups), defaultGroups_1_1; defaultGroups_1_1 = await defaultGroups_1.next(), !defaultGroups_1_1.done;) {
                const grp = defaultGroups_1_1.value;
                await this.groupModel.findOneAndUpdate({
                    name: grp,
                }, { name: grp }, { upsert: true });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (defaultGroups_1_1 && !defaultGroups_1_1.done && (_a = defaultGroups_1.return)) await _a.call(defaultGroups_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return {
            message: "Created default groups",
            success: true
        };
    }
};
GroupService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(group_schema_1.Group.name)),
    __param(1, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService])
], GroupService);
exports.GroupService = GroupService;
//# sourceMappingURL=group.service.js.map