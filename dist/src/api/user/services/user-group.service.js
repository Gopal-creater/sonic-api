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
exports.UserGroupService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_db_schema_1 = require("../schemas/user.db.schema");
const group_schema_1 = require("../../group/schemas/group.schema");
const group_service_1 = require("../../group/group.service");
const user_service_1 = require("./user.service");
let UserGroupService = class UserGroupService {
    constructor(userService, groupService, userModel) {
        this.userService = userService;
        this.groupService = groupService;
        this.userModel = userModel;
    }
    async addUserToGroup(user, group) {
        await this.userService.adminAddUserToGroup(user.username, group.name)
            .catch(err => console.warn("Warning: Error adding user to cognito group", err));
        const alreadyInGroup = await this.userModel.findOne({
            _id: user.id,
            groups: { $in: [group._id] },
        });
        console.log("alreadyInGroup", alreadyInGroup);
        if (alreadyInGroup) {
            return alreadyInGroup;
        }
        return this.userModel.findOneAndUpdate({ _id: user.id }, {
            $push: {
                groups: group,
            },
        }, {
            new: true,
        });
    }
    async addUserToGroups(user, groups) {
        var e_1, _a;
        var updatedUser = user;
        try {
            for (var groups_1 = __asyncValues(groups), groups_1_1; groups_1_1 = await groups_1.next(), !groups_1_1.done;) {
                const group = groups_1_1.value;
                updatedUser = await this.addUserToGroup(user, group);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (groups_1_1 && !groups_1_1.done && (_a = groups_1.return)) await _a.call(groups_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return updatedUser;
    }
    async removeUserFromGroup(user, group) {
        await this.userService.adminRemoveUserFromGroup(user.username, group.name)
            .catch(err => console.warn("Warning: Error removing user from cognito group", err));
        return this.userModel.findOneAndUpdate({ _id: user.id }, {
            $pull: {
                groups: group,
            },
        }, {
            new: true,
        });
    }
    async removeUserFromGroups(user, groups) {
        var e_2, _a;
        var updatedUser = user;
        try {
            for (var groups_2 = __asyncValues(groups), groups_2_1; groups_2_1 = await groups_2.next(), !groups_2_1.done;) {
                const group = groups_2_1.value;
                updatedUser = await this.removeUserFromGroup(user, group);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (groups_2_1 && !groups_2_1.done && (_a = groups_2.return)) await _a.call(groups_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return updatedUser;
    }
    async listAllGroupsForUser(user) {
        const userWithGroups = await this.userModel.findById(user.id);
        return userWithGroups.groups;
    }
};
UserGroupService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __param(2, mongoose_1.InjectModel(user_db_schema_1.UserSchemaName)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        group_service_1.GroupService,
        mongoose_2.Model])
], UserGroupService);
exports.UserGroupService = UserGroupService;
//# sourceMappingURL=user-group.service.js.map