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
exports.DetectionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const detection_schema_1 = require("./schemas/detection.schema");
const mongoose_2 = require("mongoose");
const Enums_1 = require("../../constants/Enums");
const mongoose_utils_1 = require("../../shared/utils/mongoose.utils");
const types_1 = require("../../shared/types");
const user_service_1 = require("../user/user.service");
let DetectionService = class DetectionService {
    constructor(detectionModel, userService) {
        this.detectionModel = detectionModel;
        this.userService = userService;
    }
    async getPlaysDashboardData(filter) {
        const playsCount = await this.getTotalPlaysCount({ filter: filter });
        const radioStationsCount = await this.detectionModel.aggregate([
            {
                $match: Object.assign({}, filter),
            },
            {
                $group: {
                    _id: '$radioStation',
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: null },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: "" },
                },
            },
        ]);
        const countriesCount = await this.detectionModel.aggregate([
            {
                $match: Object.assign({}, filter),
            },
            {
                $lookup: {
                    from: 'RadioStation',
                    localField: 'radioStation',
                    foreignField: '_id',
                    as: 'radioStation',
                },
            },
            { $addFields: { radioStation: { $first: '$radioStation' } } },
            {
                $group: {
                    _id: '$radioStation.country',
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: null },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: "" },
                },
            },
        ]);
        return {
            playsCount: playsCount.playsCount,
            radioStationsCount: radioStationsCount.length,
            countriesCount: countriesCount.length,
        };
    }
    async getPlaysDashboardGraphData(filter) {
        const playsCountryWise = await this.detectionModel.aggregate([
            {
                $match: Object.assign({}, filter),
            },
            {
                $lookup: {
                    from: 'RadioStation',
                    localField: 'radioStation',
                    foreignField: '_id',
                    as: 'radioStation',
                },
            },
            { $addFields: { radioStation: { $first: '$radioStation' } } },
            {
                $group: {
                    _id: '$radioStation.country',
                    total: { $sum: 1 }
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: null },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: "" },
                },
            },
        ]);
        const playsStationWise = await this.detectionModel.aggregate([
            {
                $match: Object.assign({}, filter),
            },
            {
                $lookup: {
                    from: 'RadioStation',
                    localField: 'radioStation',
                    foreignField: '_id',
                    as: 'radioStation',
                },
            },
            { $addFields: { radioStation: { $first: '$radioStation' } } },
            {
                $group: {
                    _id: '$radioStation.name',
                    total: { $sum: 1 }
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: null },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: "" },
                },
            },
        ]);
        const playsSongWise = await this.detectionModel.aggregate([
            {
                $match: Object.assign({}, filter),
            },
            {
                $lookup: {
                    from: 'SonicKey',
                    localField: 'sonicKey',
                    foreignField: '_id',
                    as: 'sonicKey',
                },
            },
            { $addFields: { sonicKey: { $first: '$sonicKey' } } },
            {
                $group: {
                    _id: '$sonicKey.contentName',
                    total: { $sum: 1 }
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: null },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: "" },
                },
            },
        ]);
        const playsArtistWise = await this.detectionModel.aggregate([
            {
                $match: Object.assign({}, filter),
            },
            {
                $lookup: {
                    from: 'SonicKey',
                    localField: 'sonicKey',
                    foreignField: '_id',
                    as: 'sonicKey',
                },
            },
            { $addFields: { sonicKey: { $first: '$sonicKey' } } },
            {
                $group: {
                    _id: '$sonicKey.contentOwner',
                    total: { $sum: 1 }
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: null },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: "" },
                },
            },
        ]);
        return {
            playsCountryWise,
            playsSongWise,
            playsStationWise,
            playsArtistWise
        };
    }
    async listPlays(queryDto, recentPlays = false) {
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
                $sort: Object.assign({ detectedAt: -1 }, sort),
            },
            {
                $lookup: {
                    from: 'SonicKey',
                    localField: 'sonicKey',
                    foreignField: '_id',
                    as: 'sonicKey',
                },
            },
            { $addFields: { sonicKey: { $first: '$sonicKey' } } },
            {
                $lookup: {
                    from: 'RadioStation',
                    localField: 'radioStation',
                    foreignField: '_id',
                    as: 'radioStation',
                },
            },
            { $addFields: { radioStation: { $first: '$radioStation' } } },
            {
                $match: Object.assign({}, relationalFilter),
            }
        ];
        if (recentPlays) {
            aggregateArray.push({
                $limit: limit
            });
            return this.detectionModel.aggregate(aggregateArray);
        }
        const aggregate = this.detectionModel.aggregate(aggregateArray);
        return this.detectionModel['aggregatePaginate'](aggregate, paginateOptions);
    }
    async findAll(queryDto, aggregateQuery) {
        const { limit, skip, sort, page, filter, select, populate, aggregateSearch, includeGroupData, } = queryDto;
        var paginateOptions = {};
        paginateOptions['sort'] = sort;
        paginateOptions['select'] = select;
        paginateOptions['populate'] = populate;
        paginateOptions['offset'] = skip;
        paginateOptions['page'] = page;
        paginateOptions['limit'] = limit;
        const aggregate = this.detectionModel.aggregate([
            {
                $match: Object.assign({}, filter),
            },
            { $group: { _id: '$sonicKey', totalHits: { $sum: 1 } } },
            {
                $lookup: {
                    from: 'SonicKey',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'sonicKey',
                },
            },
            {
                $project: {
                    sonicKey: { $first: '$sonicKey' },
                    totalHits: 1,
                    otherField: 1,
                },
            },
            { $sort: { totalHits: -1 } },
        ]);
        if (aggregateQuery) {
            return this.detectionModel['aggregatePaginate'](aggregate, paginateOptions);
        }
        else {
            return this.detectionModel['paginate'](filter, paginateOptions);
        }
    }
    async getTotalHitsCount(queryDto) {
        const { filter, includeGroupData } = queryDto;
        return this.detectionModel
            .find(filter || {})
            .countDocuments()
            .exec();
    }
    async getTotalPlaysCount(queryDto) {
        const { filter } = queryDto;
        const playsCountDetails = await this.detectionModel.aggregate([
            {
                $match: filter,
            },
            {
                $sort: {
                    detectedAt: -1,
                },
            },
            {
                $group: {
                    _id: null,
                    sonicKeys: {
                        $push: '$sonicKey',
                    },
                    initialResults: {
                        $push: '$$ROOT',
                    },
                },
            },
            {
                $project: {
                    initialResults: {
                        $concatArrays: [
                            '$initialResults',
                            [
                                {
                                    sonicKey: 'Unknown',
                                },
                            ],
                        ],
                    },
                    uniqueSonicKeys: {
                        $setUnion: {
                            $reduce: {
                                input: '$sonicKeys',
                                initialValue: [],
                                in: {
                                    $concatArrays: ['$$value', ['$$this']],
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    uniqueSonicKeys: 1,
                    sonicKeysWithCount: {
                        $reduce: {
                            input: '$initialResults',
                            initialValue: {
                                item: null,
                                count: 1,
                                dates: [
                                    {
                                        $first: '$initialResults.detectedAt',
                                    },
                                ],
                                results: [],
                            },
                            in: {
                                $cond: [
                                    {
                                        $eq: [
                                            {
                                                $strcasecmp: ['$$value.item', '$$this.sonicKey'],
                                            },
                                            0,
                                        ],
                                    },
                                    {
                                        results: '$$value.results',
                                        item: '$$this.sonicKey',
                                        count: {
                                            $add: ['$$value.count', 1],
                                        },
                                        dates: {
                                            $concatArrays: ['$$value.dates', ['$$this.detectedAt']],
                                        },
                                    },
                                    {
                                        results: {
                                            $concatArrays: [
                                                '$$value.results',
                                                [
                                                    {
                                                        item: '$$value.item',
                                                        count: '$$value.count',
                                                        dates: '$$value.dates',
                                                    },
                                                ],
                                            ],
                                        },
                                        item: '$$this.sonicKey',
                                        count: 1,
                                        dates: ['$$this.detectedAt'],
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    uniqueSonicKeys: 1,
                    sonicKeysWithCount: {
                        $slice: [
                            '$sonicKeysWithCount.results',
                            1,
                            {
                                $size: '$sonicKeysWithCount.results',
                            },
                        ],
                    },
                },
            },
            {
                $addFields: {
                    playsCount: {
                        $size: '$sonicKeysWithCount',
                    },
                    uniquePlaysCount: {
                        $size: '$uniqueSonicKeys',
                    },
                },
            },
            {
                $project: {
                    playsCount: 1,
                    uniquePlaysCount: 1,
                },
            },
        ]);
        return playsCountDetails[0];
    }
    async findTopRadioStationsWithPlaysCountForOwner(ownerId, topLimit, filter = {}) {
        var e_1, _a;
        const topStations = await this.findTopRadioStations(Object.assign(Object.assign({}, filter), { owner: ownerId }), topLimit);
        var topStationsWithTopKeys = [];
        try {
            for (var topStations_1 = __asyncValues(topStations), topStations_1_1; topStations_1_1 = await topStations_1.next(), !topStations_1_1.done;) {
                const station = topStations_1_1.value;
                const playsCount = await this.getTotalPlaysCount({
                    filter: Object.assign(Object.assign({}, filter), { owner: ownerId, radioStation: station._id }),
                });
                station['playsCount'] = playsCount;
                topStationsWithTopKeys.push(station);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (topStations_1_1 && !topStations_1_1.done && (_a = topStations_1.return)) await _a.call(topStations_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return topStationsWithTopKeys;
    }
    async findTopRadioStationsWithSonicKeysForOwner(ownerId, topLimit, filter = {}) {
        var e_2, _a;
        const topStations = await this.findTopRadioStations(Object.assign(Object.assign({}, filter), { owner: ownerId }), topLimit);
        var topStationsWithTopKeys = [];
        try {
            for (var topStations_2 = __asyncValues(topStations), topStations_2_1; topStations_2_1 = await topStations_2.next(), !topStations_2_1.done;) {
                const station = topStations_2_1.value;
                const sonicKeys = await this.findTopSonicKeysForRadioStation(station._id, topLimit, filter);
                station['sonicKeys'] = sonicKeys;
                topStationsWithTopKeys.push(station);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (topStations_2_1 && !topStations_2_1.done && (_a = topStations_2.return)) await _a.call(topStations_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return topStationsWithTopKeys;
    }
    async findTopRadioStations(filter, topLimit) {
        filter['channel'] = Enums_1.ChannelEnums.STREAMREADER;
        const topRadioStations = await this.detectionModel.aggregate([
            {
                $match: filter,
            },
            { $group: { _id: '$radioStation', totalKeysDetected: { $sum: 1 } } },
            { $sort: { totalKeysDetected: -1 } },
            { $limit: topLimit },
            {
                $lookup: {
                    from: 'RadioStation',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'radioStation',
                },
            },
            {
                $project: {
                    radioStation: { $first: '$radioStation' },
                    totalKeysDetected: 1,
                    otherField: 1,
                },
            },
        ]);
        return topRadioStations;
    }
    async findTopSonicKeysForRadioStation(radioStationId, topLimit, filter = {}) {
        const stationId = mongoose_utils_1.toObjectId(radioStationId);
        const topSonicKeys = await this.detectionModel.aggregate([
            {
                $match: Object.assign(Object.assign({}, filter), { radioStation: stationId }),
            },
            { $group: { _id: '$sonicKey', totalHits: { $sum: 1 } } },
            {
                $lookup: {
                    from: 'SonicKey',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'sonicKey',
                },
            },
            {
                $project: {
                    sonicKey: { $first: '$sonicKey' },
                    totalHits: 1,
                    otherField: 1,
                },
            },
            { $sort: { totalHits: -1 } },
            { $limit: topLimit },
        ]);
        return topSonicKeys;
    }
    async findGraphOfSonicKeysForRadioStationInSpecificTime(radioStationId, groupByTime, filter = {}) {
        const stationId = mongoose_utils_1.toObjectId(radioStationId);
        var group_id = {};
        if (groupByTime == 'year') {
            group_id['year'] = { $year: '$detectedAt' };
        }
        else if (groupByTime == 'month') {
            group_id['month'] = { $month: '$detectedAt' };
        }
        else if (groupByTime == 'dayOfMonth') {
            group_id['dayOfMonth'] = { $dayOfMonth: '$detectedAt' };
        }
        else {
            group_id['dayOfMonth'] = { $dayOfMonth: '$detectedAt' };
        }
        const graphData = await this.detectionModel.aggregate([
            {
                $match: Object.assign(Object.assign({}, filter), { radioStation: stationId }),
            },
            {
                $group: {
                    _id: group_id,
                    detectedAt: { $first: '$detectedAt' },
                    hits: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 1,
                    year: { $year: '$detectedAt' },
                    month: { $month: '$detectedAt' },
                    day: { $dayOfMonth: '$detectedAt' },
                    hits: 1,
                },
            },
        ]);
        return graphData;
    }
};
DetectionService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(detection_schema_1.Detection.name)),
    __param(1, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService])
], DetectionService);
exports.DetectionService = DetectionService;
//# sourceMappingURL=detection.service.js.map