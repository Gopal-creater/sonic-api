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
let CompanyService = class CompanyService {
    constructor(companyModel, userService) {
        this.companyModel = companyModel;
        this.userService = userService;
    }
    async create(createCompanyDto) {
        const { name } = createCompanyDto;
        const newCompany = await this.companyModel.create(createCompanyDto);
        const cognitoGroupName = `COM_${name}`;
        await this.userService.cognitoCreateGroup(cognitoGroupName).catch(err => console.warn("Warning: Error creating cognito group", err));
        return newCompany.save();
    }
    findAll() {
        return this.companyModel.find();
    }
    findOne(filter) {
        return this.companyModel.findOne(filter);
    }
    findById(id) {
        return this.companyModel.findById(id);
    }
    update(id, updateCompanyDto) {
        return this.companyModel.findByIdAndUpdate(id, updateCompanyDto);
    }
    async getCount(queryDto) {
        const { filter, includeGroupData } = queryDto;
        return this.companyModel
            .find(filter || {})
            .count();
    }
    async getEstimateCount() {
        return this.companyModel.estimatedDocumentCount();
    }
    async removeById(id) {
        const company = await this.findById(id);
        const deletedCompany = await this.companyModel.findByIdAndRemove(id);
        await this.userService.cognitoDeleteGroup(company.name).catch(err => console.warn("Warning: Error deleting cognito group", err));
        return deletedCompany;
    }
};
CompanyService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(company_schema_1.Company.name)),
    __param(1, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService])
], CompanyService);
exports.CompanyService = CompanyService;
//# sourceMappingURL=company.service.js.map