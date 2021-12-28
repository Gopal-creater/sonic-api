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
const makeDir = require("make-dir");
const fs = require("fs");
const xlsx = require("xlsx");
const XLSXChart = require("xlsx-chart");
const moment = require("moment");
const app_config_1 = require("../../config/app.config");
const file_handler_service_1 = require("../../shared/services/file-handler.service");
const AdmZip = require("adm-zip");
let DetectionService = class DetectionService {
    constructor(detectionModel, userService, fileHandlerService) {
        this.detectionModel = detectionModel;
        this.userService = userService;
        this.fileHandlerService = fileHandlerService;
    }
    async getPlaysDashboardData(filter) {
        const playsCount = await this.getTotalPlaysCount({ filter: filter });
        const radioStationsCount = await this.detectionModel.aggregate([
            {
                $match: Object.assign(Object.assign({}, filter), { channel: Enums_1.ChannelEnums.STREAMREADER }),
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
                    _id: { $exists: true, $ne: '' },
                },
            },
        ]);
        const countriesCount = await this.detectionModel.aggregate([
            {
                $match: Object.assign(Object.assign({}, filter), { channel: Enums_1.ChannelEnums.STREAMREADER }),
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
                    _id: { $exists: true, $ne: '' },
                },
            },
        ]);
        return {
            playsCount: (playsCount === null || playsCount === void 0 ? void 0 : playsCount.playsCount) || 0,
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
                    total: { $sum: 1 },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: null },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: '' },
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
                    total: { $sum: 1 },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: null },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: '' },
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
                    total: { $sum: 1 },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: null },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: '' },
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
                    total: { $sum: 1 },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: null },
                },
            },
            {
                $match: {
                    _id: { $exists: true, $ne: '' },
                },
            },
        ]);
        return {
            playsCountryWise,
            playsSongWise,
            playsStationWise,
            playsArtistWise,
        };
    }
    async exportDashboardPlaysView(queryDto, ownerId, format) {
        const { filter, limit } = queryDto;
        return new Promise(async (resolve, reject) => {
            var e_1, _a, e_2, _b;
            var _c, _d, _e, _f, _g, _h, _j, _k;
            const playsLists = (await this.listPlays(queryDto, true));
            const topRadioStationsWithPlaysCount = await this.findTopRadioStationsWithPlaysCountForOwner(ownerId, queryDto.limit, queryDto.filter);
            const chartsData = await this.getPlaysDashboardGraphData(queryDto.filter);
            var playsListInJsonFormat = [];
            var topRadioStationsWithPlaysCountInJsonFormat = [];
            var chartsDataInJsonFormat = [];
            try {
                for (var playsLists_1 = __asyncValues(playsLists), playsLists_1_1; playsLists_1_1 = await playsLists_1.next(), !playsLists_1_1.done;) {
                    const plays = playsLists_1_1.value;
                    var playsExcelData = {
                        SonicKey: (_c = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _c === void 0 ? void 0 : _c._id,
                        'Radio Station': (_d = plays === null || plays === void 0 ? void 0 : plays.radioStation) === null || _d === void 0 ? void 0 : _d.name,
                        Date: moment((plays === null || plays === void 0 ? void 0 : plays.detectedAt) || (plays === null || plays === void 0 ? void 0 : plays.createdAt))
                            .utc()
                            .format('DD/MM/YYYY'),
                        Time: moment((plays === null || plays === void 0 ? void 0 : plays.detectedAt) || (plays === null || plays === void 0 ? void 0 : plays.createdAt))
                            .utc()
                            .format('HH:mm'),
                        Duration: moment
                            .utc(((plays === null || plays === void 0 ? void 0 : plays.detectedDuration) || ((_e = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _e === void 0 ? void 0 : _e.contentDuration)) * 1000)
                            .format('HH:mm:ss'),
                        'Track File Name': (_f = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _f === void 0 ? void 0 : _f.originalFileName,
                        Artist: (_g = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _g === void 0 ? void 0 : _g.contentOwner,
                        Country: (_h = plays === null || plays === void 0 ? void 0 : plays.radioStation) === null || _h === void 0 ? void 0 : _h.country,
                    };
                    playsListInJsonFormat.push(playsExcelData);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (playsLists_1_1 && !playsLists_1_1.done && (_a = playsLists_1.return)) await _a.call(playsLists_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (playsListInJsonFormat.length <= 0) {
                playsListInJsonFormat.push({
                    SonicKey: '',
                    'Radio Station': '',
                    Date: '',
                    Time: '',
                    Duration: '',
                    'Track File Name': '',
                    Artist: '',
                    Country: '',
                });
            }
            try {
                for (var topRadioStationsWithPlaysCount_1 = __asyncValues(topRadioStationsWithPlaysCount), topRadioStationsWithPlaysCount_1_1; topRadioStationsWithPlaysCount_1_1 = await topRadioStationsWithPlaysCount_1.next(), !topRadioStationsWithPlaysCount_1_1.done;) {
                    const topRadioStation = topRadioStationsWithPlaysCount_1_1.value;
                    var topRadioStationExcelData = {
                        'Radio Station': (_j = topRadioStation === null || topRadioStation === void 0 ? void 0 : topRadioStation.radioStation) === null || _j === void 0 ? void 0 : _j.name,
                        Country: (_k = topRadioStation === null || topRadioStation === void 0 ? void 0 : topRadioStation.radioStation) === null || _k === void 0 ? void 0 : _k.country,
                        Plays: topRadioStation === null || topRadioStation === void 0 ? void 0 : topRadioStation.playsCount.playsCount,
                        'Unique Track Played': topRadioStation === null || topRadioStation === void 0 ? void 0 : topRadioStation.playsCount.uniquePlaysCount,
                    };
                    topRadioStationsWithPlaysCountInJsonFormat.push(topRadioStationExcelData);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (topRadioStationsWithPlaysCount_1_1 && !topRadioStationsWithPlaysCount_1_1.done && (_b = topRadioStationsWithPlaysCount_1.return)) await _b.call(topRadioStationsWithPlaysCount_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (topRadioStationsWithPlaysCountInJsonFormat.length <= 0) {
                topRadioStationsWithPlaysCountInJsonFormat.push({
                    'Radio Station': '',
                    Country: '',
                    Plays: '',
                    'Unique Track Played': '',
                });
            }
            const destination = await makeDir(app_config_1.appConfig.MULTER_EXPORT_DEST);
            var finalFilePath = `${destination}/plays_view_${Date.now()}.zip`;
            var zip = new AdmZip();
            try {
                const file = xlsx.utils.book_new();
                const wsPlaysListInJsonFormat = xlsx.utils.json_to_sheet(playsListInJsonFormat);
                const wsTopRadioStationsWithPlaysCountInJsonFormat = xlsx.utils.json_to_sheet(topRadioStationsWithPlaysCountInJsonFormat);
                xlsx.utils.book_append_sheet(file, wsPlaysListInJsonFormat, 'Sheet1');
                xlsx.utils.book_append_sheet(file, wsTopRadioStationsWithPlaysCountInJsonFormat, 'Sheet2');
                if (format == 'xlsx') {
                    const nonChartsFilePath = `${destination}/${`plays_view_${Date.now()}`}.xlsx`;
                    const chartsFilePath = `${destination}/${`charts_${Date.now()}`}.xlsx`;
                    xlsx.writeFile(file, nonChartsFilePath);
                    await this.addChartsToExcel(chartsFilePath, chartsData);
                    zip.addLocalFile(nonChartsFilePath, '', 'plays_view.xlsx');
                    zip.addLocalFile(chartsFilePath, '', 'chart_view.xlsx');
                    zip.writeZip(finalFilePath, (err => {
                        this.fileHandlerService.deleteFileAtPath(nonChartsFilePath);
                        this.fileHandlerService.deleteFileAtPath(chartsFilePath);
                        if (err) {
                            reject(err);
                        }
                        resolve(finalFilePath);
                    }));
                }
                else if (format == 'csv') {
                    const playsCsvPath = `${destination}/${`plays_view_${Date.now()}`}.csv`;
                    const topStationsCsvPath = `${destination}/${`topStations_${Date.now()}`}.csv`;
                    xlsx.writeFile(file, playsCsvPath, { bookType: 'csv', sheet: "Sheet1" });
                    xlsx.writeFile(file, topStationsCsvPath, { bookType: 'csv', sheet: "Sheet2" });
                    zip.addLocalFile(playsCsvPath, '', 'plays_view.csv');
                    zip.addLocalFile(topStationsCsvPath, '', 'top_station_view.csv');
                    zip.writeZip(finalFilePath, (err => {
                        this.fileHandlerService.deleteFileAtPath(playsCsvPath);
                        this.fileHandlerService.deleteFileAtPath(topStationsCsvPath);
                        if (err) {
                            reject(err);
                        }
                        resolve(finalFilePath);
                    }));
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async addChartsToExcel(filePath, chartsData) {
        return new Promise((resolve, reject) => {
            let xlsxChart = new XLSXChart();
            let opts = {
                charts: [
                    {
                        chart: 'column',
                        titles: ['Plays-Country-Wise'],
                        fields: chartsData.playsCountryWise.map(item => item._id),
                        data: {
                            'Plays-Country-Wise': chartsData.playsCountryWise.reduce((obj, item) => Object.assign(obj, { [item._id]: item.total }), {}),
                        },
                        chartTitle: 'Plays-Country-Wise',
                    },
                    {
                        chart: 'column',
                        titles: ['Plays-Song-Wise'],
                        fields: chartsData.playsSongWise.map(item => item._id),
                        data: {
                            'Plays-Song-Wise': chartsData.playsSongWise.reduce((obj, item) => Object.assign(obj, { [item._id]: item.total }), {}),
                        },
                        chartTitle: 'Plays-Song-Wise',
                    },
                    {
                        chart: 'column',
                        titles: ['Plays-Station-Wise'],
                        fields: chartsData.playsStationWise.map(item => item._id),
                        data: {
                            'Plays-Station-Wise': chartsData.playsStationWise.reduce((obj, item) => Object.assign(obj, { [item._id]: item.total }), {}),
                        },
                        chartTitle: 'Plays-Station-Wise',
                    },
                    {
                        chart: 'column',
                        titles: ['Plays-Artist-Wise'],
                        fields: chartsData.playsArtistWise.map(item => item._id),
                        data: {
                            'Plays-Artist-Wise': chartsData.playsArtistWise.reduce((obj, item) => Object.assign(obj, { [item._id]: item.total }), {}),
                        },
                        chartTitle: 'Plays-Artist-Wise',
                    },
                ],
            };
            xlsxChart.generate(opts, function (err, data) {
                if (err) {
                    reject(err);
                }
                fs.writeFileSync(filePath, data);
                resolve(filePath);
            });
        });
    }
    async exportHistoryOfSonicKeyPlays(queryDto, ownerId, sonickey, format) {
        return new Promise(async (resolve, reject) => {
            var e_3, _a, e_4, _b;
            var _c, _d, _e, _f, _g, _h, _j, _k;
            queryDto.filter['sonicKey'] = sonickey;
            const playsLists = (await this.listPlays(queryDto, true));
            const topRadioStationsWithPlaysCount = await this.findTopRadioStationsWithPlaysCountForOwner(ownerId, queryDto.limit, queryDto.filter);
            var playsListInJsonFormat = [];
            var topRadioStationsWithPlaysCountInJsonFormat = [];
            try {
                for (var playsLists_2 = __asyncValues(playsLists), playsLists_2_1; playsLists_2_1 = await playsLists_2.next(), !playsLists_2_1.done;) {
                    const plays = playsLists_2_1.value;
                    var playsExcelData = {
                        SonicKey: (_c = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _c === void 0 ? void 0 : _c._id,
                        'Radio Station': (_d = plays === null || plays === void 0 ? void 0 : plays.radioStation) === null || _d === void 0 ? void 0 : _d.name,
                        Date: moment((plays === null || plays === void 0 ? void 0 : plays.detectedAt) || (plays === null || plays === void 0 ? void 0 : plays.createdAt))
                            .utc()
                            .format('DD/MM/YYYY'),
                        Time: moment((plays === null || plays === void 0 ? void 0 : plays.detectedAt) || (plays === null || plays === void 0 ? void 0 : plays.createdAt))
                            .utc()
                            .format('HH:mm'),
                        Duration: moment
                            .utc(((plays === null || plays === void 0 ? void 0 : plays.detectedDuration) || ((_e = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _e === void 0 ? void 0 : _e.contentDuration)) * 1000)
                            .format('HH:mm:ss'),
                        'Track File Name': (_f = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _f === void 0 ? void 0 : _f.originalFileName,
                        Artist: (_g = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _g === void 0 ? void 0 : _g.contentOwner,
                        Country: (_h = plays === null || plays === void 0 ? void 0 : plays.radioStation) === null || _h === void 0 ? void 0 : _h.country,
                    };
                    playsListInJsonFormat.push(playsExcelData);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (playsLists_2_1 && !playsLists_2_1.done && (_a = playsLists_2.return)) await _a.call(playsLists_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            if (playsListInJsonFormat.length <= 0) {
                playsListInJsonFormat.push({
                    SonicKey: '',
                    'Radio Station': '',
                    Date: '',
                    Time: '',
                    Duration: '',
                    'Track File Name': '',
                    Artist: '',
                    Country: '',
                });
            }
            try {
                for (var topRadioStationsWithPlaysCount_2 = __asyncValues(topRadioStationsWithPlaysCount), topRadioStationsWithPlaysCount_2_1; topRadioStationsWithPlaysCount_2_1 = await topRadioStationsWithPlaysCount_2.next(), !topRadioStationsWithPlaysCount_2_1.done;) {
                    const topRadioStation = topRadioStationsWithPlaysCount_2_1.value;
                    var topRadioStationExcelData = {
                        'Radio Station': (_j = topRadioStation === null || topRadioStation === void 0 ? void 0 : topRadioStation.radioStation) === null || _j === void 0 ? void 0 : _j.name,
                        Country: (_k = topRadioStation === null || topRadioStation === void 0 ? void 0 : topRadioStation.radioStation) === null || _k === void 0 ? void 0 : _k.country,
                        Plays: topRadioStation === null || topRadioStation === void 0 ? void 0 : topRadioStation.playsCount.playsCount,
                        'Unique Track Played': topRadioStation === null || topRadioStation === void 0 ? void 0 : topRadioStation.playsCount.uniquePlaysCount,
                    };
                    topRadioStationsWithPlaysCountInJsonFormat.push(topRadioStationExcelData);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (topRadioStationsWithPlaysCount_2_1 && !topRadioStationsWithPlaysCount_2_1.done && (_b = topRadioStationsWithPlaysCount_2.return)) await _b.call(topRadioStationsWithPlaysCount_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
            if (topRadioStationsWithPlaysCountInJsonFormat.length <= 0) {
                topRadioStationsWithPlaysCountInJsonFormat.push({
                    'Radio Station': '',
                    Country: '',
                    Plays: '',
                    'Unique Track Played': '',
                });
            }
            const destination = await makeDir(app_config_1.appConfig.MULTER_EXPORT_DEST);
            var finalFilePath = '';
            var zip = new AdmZip();
            try {
                const file = xlsx.utils.book_new();
                const wsPlaysListInJsonFormat = xlsx.utils.json_to_sheet(playsListInJsonFormat);
                const wsTopRadioStationsWithPlaysCountInJsonFormat = xlsx.utils.json_to_sheet(topRadioStationsWithPlaysCountInJsonFormat);
                xlsx.utils.book_append_sheet(file, wsPlaysListInJsonFormat, 'Sheet1');
                xlsx.utils.book_append_sheet(file, wsTopRadioStationsWithPlaysCountInJsonFormat, 'Sheet2');
                if (format == "xlsx") {
                    const excelFilePath = `${destination}/${`history_of_sonickey${Date.now()}`}.xlsx`;
                    xlsx.writeFile(file, excelFilePath);
                    finalFilePath = excelFilePath;
                    resolve(excelFilePath);
                }
                else if (format == 'csv') {
                    const historyOfSonicKeyCsvPath = `${destination}/${`history_of_sonickey${Date.now()}`}.csv`;
                    const topStationsCsvPath = `${destination}/${`topStations_${Date.now()}`}.csv`;
                    xlsx.writeFile(file, historyOfSonicKeyCsvPath, { bookType: 'csv', sheet: "Sheet1" });
                    xlsx.writeFile(file, topStationsCsvPath, { bookType: 'csv', sheet: "Sheet2" });
                    zip.addLocalFile(historyOfSonicKeyCsvPath, '', 'history_of_sonickey.csv');
                    zip.addLocalFile(topStationsCsvPath, '', 'top_station_view.csv');
                    const zipFilePath = `${destination}/${`history_of_sonickey${Date.now()}`}.zip`;
                    finalFilePath = zipFilePath;
                    zip.writeZip(zipFilePath, (err => {
                        this.fileHandlerService.deleteFileAtPath(historyOfSonicKeyCsvPath);
                        this.fileHandlerService.deleteFileAtPath(topStationsCsvPath);
                        if (err) {
                            reject(err);
                        }
                        resolve(zipFilePath);
                    }));
                }
            }
            catch (error) {
                return reject(error);
            }
        });
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
            },
        ];
        if (recentPlays) {
            aggregateArray.push({
                $limit: limit,
            });
            if (select) {
                aggregateArray.push({
                    $project: select,
                });
            }
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
                $match: Object.assign({}, filter),
            },
            {
                $group: {
                    _id: {
                        sonicKey: '$sonicKey',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey',
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    playsCount: {
                        $sum: '$plays',
                    },
                    uniquePlaysCount: {
                        $sum: {
                            $size: '$sonicKeys',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    playsCount: 1,
                    uniquePlaysCount: 1,
                },
            },
        ]);
        return playsCountDetails[0];
    }
    async findTopRadioStationsWithPlaysCountForOwner(ownerId, topLimit, filter = {}) {
        return this.detectionModel.aggregate([
            {
                $match: Object.assign(Object.assign({}, filter), { owner: ownerId, channel: Enums_1.ChannelEnums.STREAMREADER }),
            },
            {
                $group: {
                    _id: {
                        radioStation: '$radioStation',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey',
                    },
                },
            },
            {
                $sort: {
                    plays: -1,
                },
            },
            { $limit: topLimit },
            {
                $lookup: {
                    from: 'RadioStation',
                    localField: '_id.radioStation',
                    foreignField: '_id',
                    as: 'radioStation',
                },
            },
            {
                $project: {
                    _id: 0,
                    radioStation: { $first: '$radioStation' },
                    playsCount: {
                        playsCount: '$plays',
                        uniquePlaysCount: { $size: '$sonicKeys' },
                    },
                },
            },
        ]);
    }
    async findTopRadioStationsWithSonicKeysForOwner(ownerId, topLimit, filter = {}) {
        var e_5, _a;
        const topStations = await this.findTopRadioStations(Object.assign(Object.assign({}, filter), { owner: ownerId }), topLimit);
        var topStationsWithTopKeys = [];
        try {
            for (var topStations_1 = __asyncValues(topStations), topStations_1_1; topStations_1_1 = await topStations_1.next(), !topStations_1_1.done;) {
                const station = topStations_1_1.value;
                const sonicKeys = await this.findTopSonicKeysForRadioStation(station._id, topLimit, filter);
                station['sonicKeys'] = sonicKeys;
                topStationsWithTopKeys.push(station);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (topStations_1_1 && !topStations_1_1.done && (_a = topStations_1.return)) await _a.call(topStations_1);
            }
            finally { if (e_5) throw e_5.error; }
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
        user_service_1.UserService,
        file_handler_service_1.FileHandlerService])
], DetectionService);
exports.DetectionService = DetectionService;
//# sourceMappingURL=detection.service.js.map