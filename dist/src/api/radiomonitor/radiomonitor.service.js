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
exports.RadioMonitorService = void 0;
const common_1 = require("@nestjs/common");
const radiomonitor_schema_1 = require("./schemas/radiomonitor.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const radiostation_service_1 = require("../radiostation/services/radiostation.service");
const licensekey_service_1 = require("../licensekey/services/licensekey.service");
const user_service_1 = require("../user/services/user.service");
let RadioMonitorService = class RadioMonitorService {
    constructor(radioMonitorModel, radiostationService, licensekeyService, userService) {
        this.radioMonitorModel = radioMonitorModel;
        this.radiostationService = radiostationService;
        this.licensekeyService = licensekeyService;
        this.userService = userService;
    }
    async create(doc) {
        return this.radioMonitorModel
            .create(Object.assign({}, doc))
            .then(created => {
            return created.save();
        });
    }
    async findAll(queryDto) {
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
                    from: 'RadioStation',
                    localField: 'radio',
                    foreignField: '_id',
                    as: 'radio',
                },
            },
            { $addFields: { radio: { $first: '$radio' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                },
            },
            { $addFields: { company: { $first: '$company' } } },
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
        const aggregate = this.radioMonitorModel.aggregate(aggregateArray);
        return this.radioMonitorModel['aggregatePaginate'](aggregate, paginateOptions);
    }
    async getCount(queryDto) {
        const { filter } = queryDto;
        return this.radioMonitorModel
            .find(filter || {})
            .countDocuments()
            .exec();
    }
    async getEstimateCount() {
        return this.radioMonitorModel.estimatedDocumentCount();
    }
    async subscribeRadioToMonitor(radio, license, doc) {
        const isValidRadioStation = await this.radiostationService.radioStationModel.findById(radio);
        if (!isValidRadioStation) {
            return Promise.reject({
                status: 404,
                message: 'Radiostation not found',
            });
        }
        const newMonitor = await this.radioMonitorModel.create(Object.assign(Object.assign({ radioSearch: isValidRadioStation }, doc), { radio: radio, license: license }));
        const savedMonitor = await newMonitor.save();
        await this.licensekeyService
            .incrementUses(license, 'monitor', 1)
            .catch(async (err) => {
            await this.radioMonitorModel.findOneAndDelete({ _id: savedMonitor.id });
            return Promise.reject({
                status: 422,
                message: err === null || err === void 0 ? void 0 : err.message,
            });
        });
        return savedMonitor;
    }
    async subscribeRadioToMonitorBulkWithInsertManyOperation(radioMonitors, owner, validLicense) {
        if (radioMonitors.length <= 0) {
            return {};
        }
        const isAllowedForSubscribe = await this.licensekeyService.allowedForIncrementUses(validLicense, 'monitor', radioMonitors.length);
        if (!isAllowedForSubscribe) {
            return Promise.reject({
                status: 422,
                message: `Not allowed for monitoring subscription deuto invalid license :${validLicense}`,
            });
        }
        const inserted = await this.radioMonitorModel.collection.insertMany(radioMonitors);
        await this.licensekeyService.incrementUses(validLicense, 'monitor', inserted.insertedCount);
        return inserted;
    }
    findOne(filter) {
        return this.radioMonitorModel.findOne(filter);
    }
    findById(id) {
        return this.radioMonitorModel.findById(id);
    }
    async unsubscribeMonitor(id) {
        const isValidRadioMonitor = await this.radioMonitorModel.findById(id);
        if (!isValidRadioMonitor) {
            return Promise.reject({
                status: 404,
                message: 'Not found',
            });
        }
        return this.radioMonitorModel.findByIdAndRemove(id);
    }
};
RadioMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(radiomonitor_schema_1.RadioMonitor.name)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        radiostation_service_1.RadiostationService,
        licensekey_service_1.LicensekeyService,
        user_service_1.UserService])
], RadioMonitorService);
exports.RadioMonitorService = RadioMonitorService;
//# sourceMappingURL=radiomonitor.service.js.map