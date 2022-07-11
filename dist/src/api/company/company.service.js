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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const company_schema_1 = require("./schemas/company.schema");
const user_service_1 = require("../user/services/user.service");
const parsedquery_dto_1 = require("../../shared/dtos/parsedquery.dto");
const user_company_service_1 = require("../user/services/user-company.service");
const Enums_1 = require("../../constants/Enums");
const makeDir = require("make-dir");
const xlsx = require("xlsx");
const file_handler_service_1 = require("../../shared/services/file-handler.service");
const config_1 = require("../../config");
let CompanyService = class CompanyService {
    constructor(companyModel, userService, userCompanyService, fileHandlerService) {
        this.companyModel = companyModel;
        this.userService = userService;
        this.userCompanyService = userCompanyService;
        this.fileHandlerService = fileHandlerService;
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
        return this.findById(createdCompany._id);
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
    async getEncodesByCompaniesReport(queryDto) {
        const { limit, skip, sort = { encodesCount: -1 }, page, filter, select, populate, relationalFilter, } = queryDto;
        const sonickeyFilter = {};
        if (filter === null || filter === void 0 ? void 0 : filter.createdAt) {
            sonickeyFilter['createdAt'] = filter === null || filter === void 0 ? void 0 : filter.createdAt;
        }
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
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $lookup: {
                    from: 'SonicKey',
                    let: { id: '$_id' },
                    pipeline: [
                        {
                            $match: Object.assign(Object.assign({ $expr: { $eq: ['$$id', '$company'] } }, sonickeyFilter), relationalFilter),
                        },
                        { $count: 'total' },
                    ],
                    as: 'encodesCount',
                },
            },
            {
                $addFields: {
                    encodesCount: { $sum: '$encodesCount.total' },
                },
            },
        ];
        const aggregate = this.companyModel.aggregate(aggregateArray);
        return this.companyModel['aggregatePaginate'](aggregate, paginateOptions);
    }
    async exportEncodeByCompaniesReport(queryDto, format) {
        var e_1, _a;
        const getEncodesByCompaniesReport = await this.getEncodesByCompaniesReport(queryDto);
        var jsonFormat = [];
        try {
            for (var _b = __asyncValues((getEncodesByCompaniesReport === null || getEncodesByCompaniesReport === void 0 ? void 0 : getEncodesByCompaniesReport.docs) || []), _c; _c = await _b.next(), !_c.done;) {
                const data = _c.value;
                var excelData = {
                    Company: (data === null || data === void 0 ? void 0 : data.name) || '--',
                    Encodes: (data === null || data === void 0 ? void 0 : data.encodesCount) || 0
                };
                jsonFormat.push(excelData);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (jsonFormat.length <= 0) {
            jsonFormat.push({
                Company: '',
                Encodes: ''
            });
        }
        const destination = await makeDir(config_1.appConfig.MULTER_EXPORT_DEST);
        var tobeStorePath = '';
        const file = xlsx.utils.book_new();
        const jsonToWorkSheet = xlsx.utils.json_to_sheet(jsonFormat);
        xlsx.utils.book_append_sheet(file, jsonToWorkSheet, 'Encodes By Companies');
        if (format == 'xlsx') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Encodes_By_Companies`}.xlsx`;
            xlsx.writeFile(file, tobeStorePath);
        }
        else if (format == 'csv') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Encodes_By_Companies`}.csv`;
            xlsx.writeFile(file, tobeStorePath, {
                bookType: 'csv',
                sheet: 'Encodes By Companies',
            });
        }
        return tobeStorePath;
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
        user_company_service_1.UserCompanyService,
        file_handler_service_1.FileHandlerService])
], CompanyService);
exports.CompanyService = CompanyService;
//# sourceMappingURL=company.service.js.map