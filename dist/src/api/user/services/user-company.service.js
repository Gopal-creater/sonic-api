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
exports.UserCompanyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_db_schema_1 = require("../schemas/user.db.schema");
const company_schema_1 = require("../../company/schemas/company.schema");
const company_service_1 = require("../../company/company.service");
const user_service_1 = require("./user.service");
const user_group_service_1 = require("./user-group.service");
const Enums_1 = require("../../../constants/Enums");
let UserCompanyService = class UserCompanyService {
    constructor(userService, userGroupService, companyService, userModel) {
        this.userService = userService;
        this.userGroupService = userGroupService;
        this.companyService = companyService;
        this.userModel = userModel;
    }
    async addUserToCompany(user, company) {
        await this.userService.adminAddUserToGroup(user.username, `COM_${company.name}`)
            .catch(err => console.warn("Warning: Error adding user to cognito group", err));
        const alreadyInCompany = await this.userModel.findOne({
            _id: user._id,
            companies: { $in: [company._id] },
        });
        if (alreadyInCompany) {
            return alreadyInCompany;
        }
        return this.userModel.findOneAndUpdate({ _id: user.id }, {
            $push: {
                companies: company
            }
        }, {
            new: true,
        });
    }
    async addUserToCompanies(user, companies) {
        var e_1, _a;
        var updatedUser = user;
        try {
            for (var companies_1 = __asyncValues(companies), companies_1_1; companies_1_1 = await companies_1.next(), !companies_1_1.done;) {
                const company = companies_1_1.value;
                updatedUser = await this.addUserToCompany(user, company);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (companies_1_1 && !companies_1_1.done && (_a = companies_1.return)) await _a.call(companies_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return updatedUser;
    }
    async removeUserFromCompany(user, company) {
        await this.userService.adminRemoveUserFromGroup(user.username, `COM_${company.name}`)
            .catch(err => console.warn("Warning: Error removing user from cognito group", err));
        return this.userModel.findOneAndUpdate({ _id: user.id }, {
            $pull: {
                companies: company._id
            },
        }, {
            new: true,
        });
    }
    async removeUserFromGCompanies(user, companies) {
        var e_2, _a;
        var updatedUser = user;
        try {
            for (var companies_2 = __asyncValues(companies), companies_2_1; companies_2_1 = await companies_2.next(), !companies_2_1.done;) {
                const company = companies_2_1.value;
                updatedUser = await this.removeUserFromCompany(user, company);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (companies_2_1 && !companies_2_1.done && (_a = companies_2.return)) await _a.call(companies_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return updatedUser;
    }
    async listAllCompaniesForUser(user) {
        const userWithCompanies = await this.userModel.findById(user.id);
        return {
            companies: userWithCompanies.companies,
            adminCompany: userWithCompanies.adminCompany
        };
    }
    async getCompanyAdmin(user) {
        const userWithAdminCompany = await this.userModel.findById(user.id);
        return userWithAdminCompany.adminCompany;
    }
};
UserCompanyService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => user_group_service_1.UserGroupService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => company_service_1.CompanyService))),
    __param(3, mongoose_1.InjectModel(user_db_schema_1.UserSchemaName)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        user_group_service_1.UserGroupService,
        company_service_1.CompanyService,
        mongoose_2.Model])
], UserCompanyService);
exports.UserCompanyService = UserCompanyService;
//# sourceMappingURL=user-company.service.js.map