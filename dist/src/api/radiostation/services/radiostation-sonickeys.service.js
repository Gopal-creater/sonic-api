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
exports.RadiostationSonicKeysService = void 0;
const common_1 = require("@nestjs/common");
const radiostation_sonickey_schema_1 = require("../schemas/radiostation-sonickey.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sonickey_service_1 = require("../../sonickey/services/sonickey.service");
const radiostation_service_1 = require("./radiostation.service");
let RadiostationSonicKeysService = class RadiostationSonicKeysService {
    constructor(radioStationSonickeyModel, radiostationService, sonickeyService) {
        this.radioStationSonickeyModel = radioStationSonickeyModel;
        this.radiostationService = radiostationService;
        this.sonickeyService = sonickeyService;
        this.streamingLogger = new common_1.Logger('Streaming');
    }
    async create(createRadiostationSonicKeyDto) {
        const newRadioStationSonicKey = new this.radioStationSonickeyModel(Object.assign({}, createRadiostationSonicKeyDto));
        return newRadioStationSonicKey.save();
    }
    async createOrUpdate(createRadiostationSonicKeyDto) {
        const presentData = await this.findOne(createRadiostationSonicKeyDto.radioStation, createRadiostationSonicKeyDto.sonicKey);
        if (!presentData) {
            var newRadioStationSonicKey = new this.radioStationSonickeyModel(Object.assign({}, createRadiostationSonicKeyDto));
            newRadioStationSonicKey.count = 1;
            newRadioStationSonicKey.detectedDetails.push({ detectedAt: new Date() });
            return newRadioStationSonicKey.save();
        }
        else {
            presentData.count = presentData.count + 1;
            presentData.detectedDetails.unshift({ detectedAt: new Date() });
            return presentData.save();
        }
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
        return await this.radioStationSonickeyModel["paginate"](filter, paginateOptions);
    }
    async findTopRadioStations(filter, topLimit) {
        const top3RadioStations = await this.radioStationSonickeyModel.aggregate([
            { $match: filter },
            { $group: { _id: '$radioStation', totalKeysDetected: { $sum: '$count' } } },
            {
                $lookup: {
                    from: "RadioStation",
                    localField: "_id",
                    foreignField: "_id",
                    as: "radioStation"
                }
            },
            { $sort: { totalKeysDetected: -1 } },
            { $limit: topLimit },
        ]);
        return top3RadioStations;
    }
    async findOne(radioStation, sonicKey) {
        return this.radioStationSonickeyModel.findOne({
            radioStation: radioStation,
            sonicKey: sonicKey,
        });
    }
    async findById(id) {
        return this.radioStationSonickeyModel.findById(id);
    }
};
RadiostationSonicKeysService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(radiostation_sonickey_schema_1.RadioStationSonicKey.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        radiostation_service_1.RadiostationService,
        sonickey_service_1.SonickeyService])
], RadiostationSonicKeysService);
exports.RadiostationSonicKeysService = RadiostationSonicKeysService;
//# sourceMappingURL=radiostation-sonickeys.service.js.map