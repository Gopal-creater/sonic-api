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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const company_schema_1 = require("./schemas/company.schema");
const user_service_1 = require("../user/services/user.service");
const parsedquery_dto_1 = require("../../shared/dtos/parsedquery.dto");
const user_company_service_1 = require("../user/services/user-company.service");
const Enums_1 = require("../../constants/Enums");
let CompanyService = class CompanyService {
    constructor(companyModel, userService, userCompanyService) {
        this.companyModel = companyModel;
        this.userService = userService;
        this.userCompanyService = userCompanyService;
    }
    async create(doc) {
        const { owner } = doc;
        const newCompany = await this.companyModel.create(doc);
        const createdCompany = await newCompany.save();
        if (owner) {
            await this.userService.userModel.findByIdAndUpdate(owner, {
                userRole: Enums_1.SystemRoles.COMPANY_ADMIN,
                adminCompany: createdCompany._id,
                company: createdCompany._id,
            });
        }
        return createdCompany;
    }
    async makeCompanyAdminUser(company, user) {
        const companyFromDb = await this.companyModel.findById(company);
        await this.companyModel.findByIdAndUpdate(company, {
            owner: user,
        }, {
            new: true,
        });
        await this.userService.userModel.findByIdAndUpdate(user, {
            userRole: Enums_1.SystemRoles.COMPANY_ADMIN,
            adminCompany: company,
            company: company,
        });
        if (companyFromDb.owner) {
            await this.userService.userModel.findByIdAndUpdate(companyFromDb.owner, {
                userRole: Enums_1.SystemRoles.COMPANY_USER,
                adminCompany: null,
            });
        }
        return this.companyModel.findById(company);
    }
    findAll(queryDto) {
        const { limit, skip, sort, page, filter, select, populate, relationalFilter, } = queryDto;
        var paginateOptions = {};
        paginateOptions['sort'] = sort;
        paginateOptions['select'] = select;
        paginateOptions['populate'] = populate;
        paginateOptions['offset'] = skip;
        paginateOptions['page'] = page;
        paginateOptions['limit'] = limit;
        var aggregateArray = [
            {
                $match: Object.assign({}, filter),
            },
            {
                $sort: Object.assign({ createdAt: -1 }, sort),
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                },
            },
            { $addFields: { owner: { $first: '$owner' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'partner',
                    foreignField: '_id',
                    as: 'partner',
                },
            },
            { $addFields: { partner: { $first: '$partner' } } },
            {
                $match: Object.assign({}, relationalFilter),
            },
        ];
        const aggregate = this.companyModel.aggregate(aggregateArray);
        return this.companyModel['aggregatePaginate'](aggregate, paginateOptions);
    }
    findOne(filter) {
        return this.companyModel.findOne(filter);
    }
    findById(id) {
        return this.companyModel.findById(id);
    }
    async update(id, updateCompanyDto) {
        const { owner } = updateCompanyDto;
        const updatedCompany = await this.companyModel.findByIdAndUpdate(id, updateCompanyDto, {
            new: true,
        });
        if (owner) {
            await this.userService.userModel.findByIdAndUpdate(owner, {
                userRole: Enums_1.SystemRoles.COMPANY_ADMIN,
                adminCompany: updatedCompany._id,
                company: updatedCompany._id,
            });
        }
        return updatedCompany;
    }
    async getCount(queryDto) {
        const { filter, includeGroupData } = queryDto;
        return this.companyModel.find(filter || {}).count();
    }
    async getEstimateCount() {
        return this.companyModel.estimatedDocumentCount();
    }
    async removeById(id) {
        const company = await this.findById(id);
        const deletedCompany = await this.companyModel.findByIdAndRemove(id);
        await this.userService
            .cognitoDeleteGroup(company.name)
            .catch(err => console.warn('Warning: Error deleting cognito group', err));
        return deletedCompany;
    }
};
CompanyService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(company_schema_1.Company.name)),
    __param(1, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => user_company_service_1.UserCompanyService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService,
        user_company_service_1.UserCompanyService])
], CompanyService);
exports.CompanyService = CompanyService;
//# sourceMappingURL=company.service.js.map