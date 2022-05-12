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
exports.PartnerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const partner_schema_1 = require("../schemas/partner.schema");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../../user/services/user.service");
const Enums_1 = require("../../../constants/Enums");
let PartnerService = class PartnerService {
    constructor(partnerModel, userService) {
        this.partnerModel = partnerModel;
        this.userService = userService;
    }
    async create(createPartnerDto) {
        const newPartner = await this.partnerModel.create(createPartnerDto);
        const createdPartner = await newPartner.save();
        if (createPartnerDto.owner) {
            await this.userService.userModel.findByIdAndUpdate(createPartnerDto.owner, {
                userRole: Enums_1.SystemRoles.PARTNER_ADMIN,
                adminPartner: createdPartner._id,
                partner: createdPartner._id,
            });
        }
        return createdPartner;
    }
    async makePartnerAdminUser(user, partner) {
        const partnerFromDb = await this.partnerModel.findById(partner);
        await this.partnerModel.findByIdAndUpdate(partner, {
            owner: user,
        }, {
            new: true,
        });
        await this.userService.userModel.findByIdAndUpdate(user, {
            userRole: Enums_1.SystemRoles.PARTNER_ADMIN,
            adminPartner: partner,
            partner: partner,
        });
        if (partnerFromDb.owner) {
            await this.userService.userModel.findByIdAndUpdate(partnerFromDb.owner, {
                userRole: Enums_1.SystemRoles.PARTNER_USER,
                adminPartner: null,
            });
        }
        return this.partnerModel.findById(partner);
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
                $match: Object.assign({}, relationalFilter),
            },
        ];
        const aggregate = this.partnerModel.aggregate(aggregateArray);
        return this.partnerModel['aggregatePaginate'](aggregate, paginateOptions);
    }
    findOne(filter) {
        return this.partnerModel.findOne(filter);
    }
    findById(id) {
        return this.partnerModel.findById(id);
    }
    update(id, updatePartnerDto) {
        return this.partnerModel.findByIdAndUpdate(id, updatePartnerDto, {
            new: true,
        });
    }
    async getCount(queryDto) {
        const { filter, includeGroupData } = queryDto;
        return this.partnerModel.find(filter || {}).count();
    }
    async getEstimateCount() {
        return this.partnerModel.estimatedDocumentCount();
    }
    async removeById(id) {
        const deletedPartner = await this.partnerModel.findByIdAndRemove(id);
        return deletedPartner;
    }
};
PartnerService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(partner_schema_1.Partner.name)),
    __param(1, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService])
], PartnerService);
exports.PartnerService = PartnerService;
//# sourceMappingURL=partner.service.js.map