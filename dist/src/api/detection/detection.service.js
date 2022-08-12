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
const user_service_1 = require("../user/services/user.service");
const makeDir = require("make-dir");
const fs = require("fs");
const xlsx = require("xlsx");
const XLSXChart = require("xlsx-chart");
const moment = require("moment");
const app_config_1 = require("../../config/app.config");
const file_handler_service_1 = require("../../shared/services/file-handler.service");
const AdmZip = require("adm-zip");
const constants_1 = require("../../constants");
let DetectionService = class DetectionService {
    constructor(detectionModel, userService, fileHandlerService) {
        this.detectionModel = detectionModel;
        this.userService = userService;
        this.fileHandlerService = fileHandlerService;
    }
    async getMonitorDashboardData(queryDto) {
        const myPlaysCount = await this.countPlays(queryDto);
        const myTracksCount = await this.countPlaysByTracks(queryDto);
        const myArtistsCount = await this.countPlaysByArtists(queryDto);
        const myRadioStationCount = await this.countPlaysByRadioStations(queryDto);
        const myCountriesCount = await this.countPlaysByCountries(queryDto);
        const myCompaniesCount = await this.countPlaysByCompanies(queryDto);
        const mostRecentPlays = await this.listPlays(queryDto, true);
        return {
            myPlaysCount,
            myTracksCount,
            myArtistsCount,
            myRadioStationCount,
            myCountriesCount,
            myCompaniesCount,
            mostRecentPlays,
        };
    }
    async getMonitorCountData(queryDto) {
        const myPlaysCount = await this.countPlays(queryDto);
        const myTracksCount = await this.countPlaysByTracks(queryDto);
        const myArtistsCount = await this.countPlaysByArtists(queryDto);
        const myRadioStationCount = await this.countPlaysByRadioStations(queryDto);
        const myCountriesCount = await this.countPlaysByCountries(queryDto);
        return {
            myPlaysCount,
            myTracksCount,
            myArtistsCount,
            myRadioStationCount,
            myCountriesCount,
        };
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
    async removeEntriesFromArBaTestRadio() {
        const radioStationId = '618bb1f83ac8d27c53b10d66';
        return this.detectionModel.deleteMany({
            radioStation: radioStationId,
        });
    }
    async exportDashboardPlaysView(queryDto, format) {
        return new Promise(async (resolve, reject) => {
            var e_1, _a, e_2, _b;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
            const playsLists = (await this.listPlays(queryDto, true));
            const topRadioStationsWithPlaysCount = await this.findTopRadioStationsWithPlaysCountForOwner(queryDto.limit, queryDto);
            const chartsData = await this.getPlaysDashboardGraphData(queryDto.filter);
            var playsListInJsonFormat = [];
            var topRadioStationsWithPlaysCountInJsonFormat = [];
            var chartsDataInJsonFormat = [];
            try {
                for (var playsLists_1 = __asyncValues(playsLists), playsLists_1_1; playsLists_1_1 = await playsLists_1.next(), !playsLists_1_1.done;) {
                    const plays = playsLists_1_1.value;
                    var playsExcelData = {
                        SonicKey: (_c = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _c === void 0 ? void 0 : _c._id,
                        'Radio Station': ((_d = plays === null || plays === void 0 ? void 0 : plays.radioStation) === null || _d === void 0 ? void 0 : _d.name) || '--',
                        Date: moment((plays === null || plays === void 0 ? void 0 : plays.detectedAt) || (plays === null || plays === void 0 ? void 0 : plays.createdAt))
                            .utc()
                            .format('DD/MM/YYYY'),
                        Time: moment((plays === null || plays === void 0 ? void 0 : plays.detectedAt) || (plays === null || plays === void 0 ? void 0 : plays.createdAt))
                            .utc()
                            .format('HH:mm'),
                        Duration: moment
                            .utc(((plays === null || plays === void 0 ? void 0 : plays.detectedDuration) || ((_e = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _e === void 0 ? void 0 : _e.contentDuration)) *
                            1000)
                            .format('HH:mm:ss'),
                        'Track File Name': ((_f = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _f === void 0 ? void 0 : _f.originalFileName) || '--',
                        Artist: ((_g = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _g === void 0 ? void 0 : _g.contentOwner) || '--',
                        Country: ((_h = plays === null || plays === void 0 ? void 0 : plays.radioStation) === null || _h === void 0 ? void 0 : _h.country) || '--',
                        ISRC: ((_j = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _j === void 0 ? void 0 : _j.isrcCode) || '--',
                        ISWC: ((_k = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _k === void 0 ? void 0 : _k.iswcCode) || '--',
                        'Tune Code': ((_l = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _l === void 0 ? void 0 : _l.tuneCode) || '--',
                        'Quality Grade': ((_m = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _m === void 0 ? void 0 : _m.contentQuality) || '--',
                        Desciption: ((_o = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _o === void 0 ? void 0 : _o.contentDescription) || '--',
                        Distributor: ((_p = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _p === void 0 ? void 0 : _p.distributor) || '--',
                        Version: ((_q = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _q === void 0 ? void 0 : _q.version) || '--',
                        Label: ((_r = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _r === void 0 ? void 0 : _r.label) || '--',
                        'Additional Metadata': ((_t = (_s = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _s === void 0 ? void 0 : _s.additionalMetadata) === null || _t === void 0 ? void 0 : _t['message']) || '--',
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
                    ISRC: '',
                    ISWC: '',
                    'Tune Code': '',
                    'Quality Grade': '',
                    Desciption: '',
                    Distributor: '',
                    Version: '',
                    Label: '',
                    'Additional Metadata': '',
                });
            }
            try {
                for (var topRadioStationsWithPlaysCount_1 = __asyncValues(topRadioStationsWithPlaysCount), topRadioStationsWithPlaysCount_1_1; topRadioStationsWithPlaysCount_1_1 = await topRadioStationsWithPlaysCount_1.next(), !topRadioStationsWithPlaysCount_1_1.done;) {
                    const topRadioStation = topRadioStationsWithPlaysCount_1_1.value;
                    var topRadioStationExcelData = {
                        'Radio Station': (_u = topRadioStation === null || topRadioStation === void 0 ? void 0 : topRadioStation.radioStation) === null || _u === void 0 ? void 0 : _u.name,
                        Country: (_v = topRadioStation === null || topRadioStation === void 0 ? void 0 : topRadioStation.radioStation) === null || _v === void 0 ? void 0 : _v.country,
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
                xlsx.utils.book_append_sheet(file, wsPlaysListInJsonFormat, 'Plays');
                xlsx.utils.book_append_sheet(file, wsTopRadioStationsWithPlaysCountInJsonFormat, 'Radio Plays');
                if (format == 'xlsx') {
                    const nonChartsFilePath = `${destination}/${`plays_view_${Date.now()}`}.xlsx`;
                    const chartsFilePath = `${destination}/${`charts_${Date.now()}`}.xlsx`;
                    xlsx.writeFile(file, nonChartsFilePath);
                    await this.addChartsToExcel(chartsFilePath, chartsData);
                    zip.addLocalFile(nonChartsFilePath, '', 'Plays.xlsx');
                    zip.addLocalFile(chartsFilePath, '', 'Radio Plays.xlsx');
                    zip.writeZip(finalFilePath, err => {
                        this.fileHandlerService.deleteFileAtPath(nonChartsFilePath);
                        this.fileHandlerService.deleteFileAtPath(chartsFilePath);
                        if (err) {
                            reject(err);
                        }
                        resolve(finalFilePath);
                    });
                }
                else if (format == 'csv') {
                    const playsCsvPath = `${destination}/${`plays_view_${Date.now()}`}.csv`;
                    const topStationsCsvPath = `${destination}/${`topStations_${Date.now()}`}.csv`;
                    xlsx.writeFile(file, playsCsvPath, {
                        bookType: 'csv',
                        sheet: 'Plays',
                    });
                    xlsx.writeFile(file, topStationsCsvPath, {
                        bookType: 'csv',
                        sheet: 'Radio Plays',
                    });
                    zip.addLocalFile(playsCsvPath, '', 'Plays.csv');
                    zip.addLocalFile(topStationsCsvPath, '', 'Radio Plays.csv');
                    zip.writeZip(finalFilePath, err => {
                        this.fileHandlerService.deleteFileAtPath(playsCsvPath);
                        this.fileHandlerService.deleteFileAtPath(topStationsCsvPath);
                        if (err) {
                            reject(err);
                        }
                        resolve(finalFilePath);
                    });
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
    async exportHistoryOfSonicKeyPlays(queryDto, format) {
        return new Promise(async (resolve, reject) => {
            var e_3, _a, e_4, _b;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
            const playsLists = (await this.listPlays(queryDto, true));
            const topRadioStationsWithPlaysCount = await this.findTopRadioStationsWithPlaysCountForOwner(queryDto.limit, queryDto);
            var playsListInJsonFormat = [];
            var topRadioStationsWithPlaysCountInJsonFormat = [];
            try {
                for (var playsLists_2 = __asyncValues(playsLists), playsLists_2_1; playsLists_2_1 = await playsLists_2.next(), !playsLists_2_1.done;) {
                    const plays = playsLists_2_1.value;
                    var playsExcelData = {
                        SonicKey: (_c = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _c === void 0 ? void 0 : _c._id,
                        'Radio Station': ((_d = plays === null || plays === void 0 ? void 0 : plays.radioStation) === null || _d === void 0 ? void 0 : _d.name) || '--',
                        Date: moment((plays === null || plays === void 0 ? void 0 : plays.detectedAt) || (plays === null || plays === void 0 ? void 0 : plays.createdAt))
                            .utc()
                            .format('DD/MM/YYYY'),
                        Time: moment((plays === null || plays === void 0 ? void 0 : plays.detectedAt) || (plays === null || plays === void 0 ? void 0 : plays.createdAt))
                            .utc()
                            .format('HH:mm'),
                        Duration: moment
                            .utc(((plays === null || plays === void 0 ? void 0 : plays.detectedDuration) || ((_e = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _e === void 0 ? void 0 : _e.contentDuration)) *
                            1000)
                            .format('HH:mm:ss'),
                        'Track File Name': ((_f = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _f === void 0 ? void 0 : _f.originalFileName) || '--',
                        Artist: (_g = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _g === void 0 ? void 0 : _g.contentOwner,
                        Country: (_h = plays === null || plays === void 0 ? void 0 : plays.radioStation) === null || _h === void 0 ? void 0 : _h.country,
                        ISRC: ((_j = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _j === void 0 ? void 0 : _j.isrcCode) || '--',
                        ISWC: ((_k = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _k === void 0 ? void 0 : _k.iswcCode) || '--',
                        'Tune Code': ((_l = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _l === void 0 ? void 0 : _l.tuneCode) || '--',
                        'Quality Grade': ((_m = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _m === void 0 ? void 0 : _m.contentQuality) || '--',
                        Desciption: ((_o = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _o === void 0 ? void 0 : _o.contentDescription) || '--',
                        Distributor: ((_p = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _p === void 0 ? void 0 : _p.distributor) || '--',
                        Version: ((_q = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _q === void 0 ? void 0 : _q.version) || '--',
                        Label: ((_r = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _r === void 0 ? void 0 : _r.label) || '--',
                        'Additional Metadata': ((_t = (_s = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _s === void 0 ? void 0 : _s.additionalMetadata) === null || _t === void 0 ? void 0 : _t['message']) || '--',
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
                    ISRC: '',
                    ISWC: '',
                    'Tune Code': '',
                    'Quality Grade': '',
                    Desciption: '',
                    Distributor: '',
                    Version: '',
                    Label: '',
                    'Additional Metadata': '',
                });
            }
            try {
                for (var topRadioStationsWithPlaysCount_2 = __asyncValues(topRadioStationsWithPlaysCount), topRadioStationsWithPlaysCount_2_1; topRadioStationsWithPlaysCount_2_1 = await topRadioStationsWithPlaysCount_2.next(), !topRadioStationsWithPlaysCount_2_1.done;) {
                    const topRadioStation = topRadioStationsWithPlaysCount_2_1.value;
                    var topRadioStationExcelData = {
                        'Radio Station': (_u = topRadioStation === null || topRadioStation === void 0 ? void 0 : topRadioStation.radioStation) === null || _u === void 0 ? void 0 : _u.name,
                        Country: (_v = topRadioStation === null || topRadioStation === void 0 ? void 0 : topRadioStation.radioStation) === null || _v === void 0 ? void 0 : _v.country,
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
                xlsx.utils.book_append_sheet(file, wsPlaysListInJsonFormat, 'SonicKey Plays');
                xlsx.utils.book_append_sheet(file, wsTopRadioStationsWithPlaysCountInJsonFormat, 'SonicKey Plays on Radio');
                if (format == 'xlsx') {
                    const excelFilePath = `${destination}/${`history_of_sonickey${Date.now()}`}.xlsx`;
                    xlsx.writeFile(file, excelFilePath);
                    finalFilePath = excelFilePath;
                    resolve(excelFilePath);
                }
                else if (format == 'csv') {
                    const historyOfSonicKeyCsvPath = `${destination}/${`history_of_sonickey${Date.now()}`}.csv`;
                    const topStationsCsvPath = `${destination}/${`topStations_${Date.now()}`}.csv`;
                    xlsx.writeFile(file, historyOfSonicKeyCsvPath, {
                        bookType: 'csv',
                        sheet: 'SonicKey Plays',
                    });
                    xlsx.writeFile(file, topStationsCsvPath, {
                        bookType: 'csv',
                        sheet: 'SonicKey Plays on Radio',
                    });
                    zip.addLocalFile(historyOfSonicKeyCsvPath, '', 'SonicKey Plays.csv');
                    zip.addLocalFile(topStationsCsvPath, '', 'SonicKey Plays on Radio.csv');
                    const zipFilePath = `${destination}/${`history_of_sonickey${Date.now()}`}.zip`;
                    finalFilePath = zipFilePath;
                    zip.writeZip(zipFilePath, err => {
                        this.fileHandlerService.deleteFileAtPath(historyOfSonicKeyCsvPath);
                        this.fileHandlerService.deleteFileAtPath(topStationsCsvPath);
                        if (err) {
                            reject(err);
                        }
                        resolve(zipFilePath);
                    });
                }
            }
            catch (error) {
                return reject(error);
            }
        });
    }
    async countPlays(queryDto) {
        var _a;
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'sonicKey.partner',
                    foreignField: '_id',
                    as: 'sonicKey.partner',
                },
            },
            { $addFields: { 'sonicKey.partner': { $first: '$sonicKey.partner' } } },
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
            {
                $count: 'count',
            },
        ];
        const aggregate = await this.detectionModel.aggregate(aggregateArray);
        return ((_a = aggregate[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
    }
    async countPlaysByArtists(queryDto) {
        var _a;
        const { limit, skip, sort = { playsCount: -1 }, page, filter, select, populate, relationalFilter, } = queryDto;
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'sonicKey.partner',
                    foreignField: '_id',
                    as: 'sonicKey.partner',
                },
            },
            { $addFields: { 'sonicKey.partner': { $first: '$sonicKey.partner' } } },
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
            {
                $group: {
                    _id: {
                        artist: '$sonicKey.contentOwner',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey.sonicKey',
                    },
                    radioStations: {
                        $addToSet: '$radioStation._id',
                    },
                    countries: {
                        $addToSet: '$radioStation.country',
                    },
                },
            },
            {
                $match: {
                    '_id.artist': { $exists: true, $ne: null },
                },
            },
            {
                $count: 'count',
            },
        ];
        const aggregate = await this.detectionModel.aggregate(aggregateArray);
        return ((_a = aggregate[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
    }
    async countPlaysByCountries(queryDto) {
        var _a;
        const { limit, skip, sort = { playsCount: -1 }, page, filter, select, populate, relationalFilter, } = queryDto;
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'sonicKey.partner',
                    foreignField: '_id',
                    as: 'sonicKey.partner',
                },
            },
            { $addFields: { 'sonicKey.partner': { $first: '$sonicKey.partner' } } },
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
            {
                $group: {
                    _id: {
                        country: '$radioStation.country',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey.sonicKey',
                    },
                    radioStations: {
                        $addToSet: '$radioStation._id',
                    },
                    artists: {
                        $addToSet: '$sonicKey.contentOwner',
                    },
                },
            },
            {
                $match: {
                    '_id.country': { $exists: true, $ne: null },
                },
            },
            {
                $count: 'count',
            },
        ];
        const aggregate = await this.detectionModel.aggregate(aggregateArray);
        return ((_a = aggregate[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
    }
    async countPlaysByTracks(queryDto) {
        var _a;
        const { limit, skip, sort = { playsCount: -1 }, page, filter, select, populate, relationalFilter, } = queryDto;
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'sonicKey.partner',
                    foreignField: '_id',
                    as: 'sonicKey.partner',
                },
            },
            { $addFields: { 'sonicKey.partner': { $first: '$sonicKey.partner' } } },
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
            {
                $group: {
                    _id: {
                        trackName: '$sonicKey.contentName',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey.sonicKey',
                    },
                    radioStations: {
                        $addToSet: '$radioStation._id',
                    },
                    countries: {
                        $addToSet: '$radioStation.country',
                    },
                },
            },
            {
                $match: {
                    '_id.trackName': { $exists: true, $ne: null },
                },
            },
            {
                $count: 'count',
            },
        ];
        const aggregate = await this.detectionModel.aggregate(aggregateArray);
        return ((_a = aggregate[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
    }
    async countPlaysByRadioStations(queryDto) {
        var _a;
        const { limit, skip, sort = { playsCount: -1 }, page, filter, select, populate, relationalFilter, } = queryDto;
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'sonicKey.partner',
                    foreignField: '_id',
                    as: 'sonicKey.partner',
                },
            },
            { $addFields: { 'sonicKey.partner': { $first: '$sonicKey.partner' } } },
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
            {
                $group: {
                    _id: {
                        radioStation: '$radioStation._id',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey.sonicKey',
                    },
                    artists: {
                        $addToSet: '$sonicKey.contentOwner',
                    },
                    countries: {
                        $addToSet: '$radioStation.country',
                    },
                },
            },
            {
                $match: {
                    '_id.radioStation': { $exists: true, $ne: null },
                },
            },
            {
                $count: 'count',
            },
        ];
        const aggregate = await this.detectionModel.aggregate(aggregateArray);
        return ((_a = aggregate[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
    }
    async countPlaysByCompanies(queryDto) {
        var _a;
        const { limit, skip, sort = { playsCount: -1 }, page, filter, select, populate, relationalFilter, } = queryDto;
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'sonicKey.partner',
                    foreignField: '_id',
                    as: 'sonicKey.partner',
                },
            },
            { $addFields: { 'sonicKey.partner': { $first: '$sonicKey.partner' } } },
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
            {
                $group: {
                    _id: {
                        company: '$sonicKey.company._id',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey.sonicKey',
                    },
                },
            },
            {
                $match: {
                    '_id.company': { $exists: true, $ne: null },
                },
            },
            {
                $count: 'count',
            },
        ];
        const aggregate = await this.detectionModel.aggregate(aggregateArray);
        return ((_a = aggregate[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
    }
    async exportPlays(queryDto, format) {
        var e_5, _a;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        const playsLists = (await this.listPlays(queryDto));
        var playsListInJsonFormat = [];
        try {
            for (var _x = __asyncValues((playsLists === null || playsLists === void 0 ? void 0 : playsLists.docs) || []), _y; _y = await _x.next(), !_y.done;) {
                const plays = _y.value;
                var playsExcelData = {
                    Company: ((_b = plays === null || plays === void 0 ? void 0 : plays.company) === null || _b === void 0 ? void 0 : _b.name) || '--',
                    'Company Type': ((_c = plays === null || plays === void 0 ? void 0 : plays.company) === null || _c === void 0 ? void 0 : _c.companyType) || '--',
                    Artist: ((_d = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _d === void 0 ? void 0 : _d.contentOwner) || '--',
                    Title: ((_e = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _e === void 0 ? void 0 : _e.contentName) || '--',
                    'Radio Station': ((_f = plays === null || plays === void 0 ? void 0 : plays.radioStation) === null || _f === void 0 ? void 0 : _f.name) || '--',
                    Date: moment((plays === null || plays === void 0 ? void 0 : plays.detectedAt) || (plays === null || plays === void 0 ? void 0 : plays.createdAt))
                        .utc()
                        .format('DD/MM/YYYY'),
                    Time: moment((plays === null || plays === void 0 ? void 0 : plays.detectedAt) || (plays === null || plays === void 0 ? void 0 : plays.createdAt))
                        .utc()
                        .format('HH:mm'),
                    Duration: moment
                        .utc(((plays === null || plays === void 0 ? void 0 : plays.detectedDuration) || ((_g = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _g === void 0 ? void 0 : _g.contentDuration)) *
                        1000)
                        .format('HH:mm:ss'),
                    Country: ((_h = plays === null || plays === void 0 ? void 0 : plays.radioStation) === null || _h === void 0 ? void 0 : _h.country) || '--',
                    'Track Id': ((_k = (_j = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _j === void 0 ? void 0 : _j.track) === null || _k === void 0 ? void 0 : _k._id) || '--',
                    SonicKey: (_l = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _l === void 0 ? void 0 : _l._id,
                    'SK/SID': this.getSKSIDFromDetectionOrigin(plays === null || plays === void 0 ? void 0 : plays.detectionOrigins) || '--',
                    Version: ((_m = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _m === void 0 ? void 0 : _m.version) || '--',
                    Distributor: ((_o = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _o === void 0 ? void 0 : _o.distributor) || '--',
                    Label: ((_p = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _p === void 0 ? void 0 : _p.label) || '--',
                    ISRC: ((_q = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _q === void 0 ? void 0 : _q.isrcCode) || '--',
                    ISWC: ((_r = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _r === void 0 ? void 0 : _r.iswcCode) || '--',
                    'Tune Code': ((_s = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _s === void 0 ? void 0 : _s.tuneCode) || '--',
                    Description: ((_t = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _t === void 0 ? void 0 : _t.contentDescription) || '--',
                    'File Type': ((_u = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _u === void 0 ? void 0 : _u.contentFileType) || '--',
                    'Additional Metadata': ((_v = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _v === void 0 ? void 0 : _v.additionalMetadata)
                        ? JSON.stringify((_w = plays === null || plays === void 0 ? void 0 : plays.sonicKey) === null || _w === void 0 ? void 0 : _w.additionalMetadata)
                        : '--',
                };
                playsListInJsonFormat.push(playsExcelData);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_y && !_y.done && (_a = _x.return)) await _a.call(_x);
            }
            finally { if (e_5) throw e_5.error; }
        }
        if (playsListInJsonFormat.length <= 0) {
            playsListInJsonFormat.push({
                Company: '',
                'Company Type': '',
                Artist: '',
                Title: '',
                'Radio Station': '',
                Date: '',
                Time: '',
                Duration: '',
                Country: '',
                'Track Id': '',
                SonicKey: '',
                'SK/SID': '',
                Version: '',
                Distributor: '',
                Label: '',
                ISRC: '',
                ISWC: '',
                'Tune Code': '',
                Description: '',
                'File Type': '',
                'Additional Metadata': '',
            });
        }
        const destination = await makeDir(app_config_1.appConfig.MULTER_EXPORT_DEST);
        var tobeStorePath = '';
        const file = xlsx.utils.book_new();
        const wsPlaysListInJsonFormat = xlsx.utils.json_to_sheet(playsListInJsonFormat);
        xlsx.utils.book_append_sheet(file, wsPlaysListInJsonFormat, 'My Plays');
        if (format == 'xlsx') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_My_Plays`}.xlsx`;
            xlsx.writeFile(file, tobeStorePath);
        }
        else if (format == 'csv') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_My_Plays`}.csv`;
            xlsx.writeFile(file, tobeStorePath, {
                bookType: 'csv',
                sheet: 'My Plays',
            });
        }
        return tobeStorePath;
    }
    async exportPlaysByArtists(queryDto, format) {
        var e_6, _a;
        const playsListsByArtists = await this.listPlaysByArtists(queryDto);
        var jsonFormat = [];
        try {
            for (var _b = __asyncValues((playsListsByArtists === null || playsListsByArtists === void 0 ? void 0 : playsListsByArtists.docs) || []), _c; _c = await _b.next(), !_c.done;) {
                const data = _c.value;
                var excelData = {
                    Artist: (data === null || data === void 0 ? void 0 : data.artist) || '--',
                    Plays: (data === null || data === void 0 ? void 0 : data.playsCount) || 0,
                    Tracks: (data === null || data === void 0 ? void 0 : data.uniquePlaysCount) || 0,
                    'Radio Station': (data === null || data === void 0 ? void 0 : data.radioStationCount) || 0,
                    Country: (data === null || data === void 0 ? void 0 : data.countriesCount) || 0,
                };
                jsonFormat.push(excelData);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        if (jsonFormat.length <= 0) {
            jsonFormat.push({
                Artist: '',
                Plays: '',
                Tracks: '',
                'Radio Station': '',
                Country: '',
            });
        }
        const destination = await makeDir(app_config_1.appConfig.MULTER_EXPORT_DEST);
        var tobeStorePath = '';
        const file = xlsx.utils.book_new();
        const jsonToWorkSheet = xlsx.utils.json_to_sheet(jsonFormat);
        xlsx.utils.book_append_sheet(file, jsonToWorkSheet, 'Artists');
        if (format == 'xlsx') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Artists`}.xlsx`;
            xlsx.writeFile(file, tobeStorePath);
        }
        else if (format == 'csv') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Artists`}.csv`;
            xlsx.writeFile(file, tobeStorePath, {
                bookType: 'csv',
                sheet: 'Artists',
            });
        }
        return tobeStorePath;
    }
    async exportPlaysByCountries(queryDto, format) {
        var e_7, _a;
        const playsListsByCountries = await this.listPlaysByCountries(queryDto);
        var jsonFormat = [];
        try {
            for (var _b = __asyncValues((playsListsByCountries === null || playsListsByCountries === void 0 ? void 0 : playsListsByCountries.docs) || []), _c; _c = await _b.next(), !_c.done;) {
                const data = _c.value;
                var excelData = {
                    Country: (data === null || data === void 0 ? void 0 : data.country) || '--',
                    Plays: (data === null || data === void 0 ? void 0 : data.playsCount) || 0,
                    Tracks: (data === null || data === void 0 ? void 0 : data.uniquePlaysCount) || 0,
                    Artist: (data === null || data === void 0 ? void 0 : data.artistsCount) || 0,
                    'Radio Station': (data === null || data === void 0 ? void 0 : data.radioStationCount) || 0,
                };
                jsonFormat.push(excelData);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        if (jsonFormat.length <= 0) {
            jsonFormat.push({
                Country: '',
                Plays: '',
                Tracks: '',
                Artist: '',
                'Radio Station': '',
            });
        }
        const destination = await makeDir(app_config_1.appConfig.MULTER_EXPORT_DEST);
        var tobeStorePath = '';
        const file = xlsx.utils.book_new();
        const jsonToWorkSheet = xlsx.utils.json_to_sheet(jsonFormat);
        xlsx.utils.book_append_sheet(file, jsonToWorkSheet, 'Countries');
        if (format == 'xlsx') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Countries`}.xlsx`;
            xlsx.writeFile(file, tobeStorePath);
        }
        else if (format == 'csv') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Countries`}.csv`;
            xlsx.writeFile(file, tobeStorePath, {
                bookType: 'csv',
                sheet: 'Countries',
            });
        }
        return tobeStorePath;
    }
    async exportPlaysByTracks(queryDto, format) {
        var e_8, _a;
        const playsListsByTracks = await this.listPlaysByTracks(queryDto);
        var jsonFormat = [];
        try {
            for (var _b = __asyncValues((playsListsByTracks === null || playsListsByTracks === void 0 ? void 0 : playsListsByTracks.docs) || []), _c; _c = await _b.next(), !_c.done;) {
                const data = _c.value;
                var excelData = {
                    'Track Name': (data === null || data === void 0 ? void 0 : data.trackName) || '--',
                    Plays: (data === null || data === void 0 ? void 0 : data.playsCount) || 0,
                    Tracks: (data === null || data === void 0 ? void 0 : data.uniquePlaysCount) || 0,
                    Artist: (data === null || data === void 0 ? void 0 : data.artistsCount) || 0,
                    'Radio Station': (data === null || data === void 0 ? void 0 : data.radioStationCount) || 0,
                    Country: (data === null || data === void 0 ? void 0 : data.countriesCount) || 0,
                };
                jsonFormat.push(excelData);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
        if (jsonFormat.length <= 0) {
            jsonFormat.push({
                'Track Name': '',
                Plays: '',
                Tracks: '',
                Artist: '',
                'Radio Station': '',
                Country: '',
            });
        }
        const destination = await makeDir(app_config_1.appConfig.MULTER_EXPORT_DEST);
        var tobeStorePath = '';
        const file = xlsx.utils.book_new();
        const jsonToWorkSheet = xlsx.utils.json_to_sheet(jsonFormat);
        xlsx.utils.book_append_sheet(file, jsonToWorkSheet, 'My_Tracks');
        if (format == 'xlsx') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_My_Tracks`}.xlsx`;
            xlsx.writeFile(file, tobeStorePath);
        }
        else if (format == 'csv') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_My_Tracks`}.csv`;
            xlsx.writeFile(file, tobeStorePath, {
                bookType: 'csv',
                sheet: 'My_Tracks',
            });
        }
        return tobeStorePath;
    }
    async exportPlaysByRadioStations(queryDto, format) {
        var e_9, _a;
        var _b;
        const playsListsByRadioStations = await this.listPlaysByRadioStations(queryDto);
        var jsonFormat = [];
        try {
            for (var _c = __asyncValues((playsListsByRadioStations === null || playsListsByRadioStations === void 0 ? void 0 : playsListsByRadioStations.docs) || []), _d; _d = await _c.next(), !_d.done;) {
                const data = _d.value;
                var excelData = {
                    'Radio Station': ((_b = data === null || data === void 0 ? void 0 : data.radioStation) === null || _b === void 0 ? void 0 : _b.name) || '--',
                    Country: (data === null || data === void 0 ? void 0 : data.countriesCount) || 0,
                    Plays: (data === null || data === void 0 ? void 0 : data.playsCount) || 0,
                    Tracks: (data === null || data === void 0 ? void 0 : data.uniquePlaysCount) || 0,
                    Artist: (data === null || data === void 0 ? void 0 : data.artistsCount) || 0,
                };
                jsonFormat.push(excelData);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) await _a.call(_c);
            }
            finally { if (e_9) throw e_9.error; }
        }
        if (jsonFormat.length <= 0) {
            jsonFormat.push({
                'Radio Station': '',
                Country: '',
                Plays: '',
                Tracks: '',
                Artist: '',
            });
        }
        const destination = await makeDir(app_config_1.appConfig.MULTER_EXPORT_DEST);
        var tobeStorePath = '';
        const file = xlsx.utils.book_new();
        const jsonToWorkSheet = xlsx.utils.json_to_sheet(jsonFormat);
        xlsx.utils.book_append_sheet(file, jsonToWorkSheet, 'Radio_Stations');
        if (format == 'xlsx') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Radio_Stations`}.xlsx`;
            xlsx.writeFile(file, tobeStorePath);
        }
        else if (format == 'csv') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Radio_Stations`}.csv`;
            xlsx.writeFile(file, tobeStorePath, {
                bookType: 'csv',
                sheet: 'Radio_Stations',
            });
        }
        return tobeStorePath;
    }
    async exportPlaysByCompanies(queryDto, format) {
        var e_10, _a;
        var _b;
        const playsListsByCompanies = await this.listPlaysByCompanies(queryDto);
        var jsonFormat = [];
        try {
            for (var _c = __asyncValues((playsListsByCompanies === null || playsListsByCompanies === void 0 ? void 0 : playsListsByCompanies.docs) || []), _d; _d = await _c.next(), !_d.done;) {
                const data = _d.value;
                var excelData = {
                    Company: ((_b = data === null || data === void 0 ? void 0 : data.company) === null || _b === void 0 ? void 0 : _b.name) || '--',
                    Plays: (data === null || data === void 0 ? void 0 : data.playsCount) || 0,
                    Tracks: (data === null || data === void 0 ? void 0 : data.uniquePlaysCount) || 0,
                    Artist: (data === null || data === void 0 ? void 0 : data.artistsCount) || 0,
                };
                jsonFormat.push(excelData);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) await _a.call(_c);
            }
            finally { if (e_10) throw e_10.error; }
        }
        if (jsonFormat.length <= 0) {
            jsonFormat.push({
                Company: '',
                Plays: '',
                Tracks: '',
                Artist: '',
            });
        }
        const destination = await makeDir(app_config_1.appConfig.MULTER_EXPORT_DEST);
        var tobeStorePath = '';
        const file = xlsx.utils.book_new();
        const jsonToWorkSheet = xlsx.utils.json_to_sheet(jsonFormat);
        xlsx.utils.book_append_sheet(file, jsonToWorkSheet, 'Companies');
        if (format == 'xlsx') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Companies`}.xlsx`;
            xlsx.writeFile(file, tobeStorePath);
        }
        else if (format == 'csv') {
            tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Companies`}.csv`;
            xlsx.writeFile(file, tobeStorePath, {
                bookType: 'csv',
                sheet: 'Companies',
            });
        }
        return tobeStorePath;
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'sonicKey.partner',
                    foreignField: '_id',
                    as: 'sonicKey.partner',
                },
            },
            { $addFields: { 'sonicKey.partner': { $first: '$sonicKey.partner' } } },
            {
                $lookup: {
                    from: 'Track',
                    localField: 'sonicKey.track',
                    foreignField: '_id',
                    as: 'sonicKey.track',
                },
            },
            { $addFields: { 'sonicKey.track': { $first: '$sonicKey.track' } } },
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
        if (recentPlays) {
            aggregateArray.push({
                $limit: limit || 10,
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
    async listPlaysByArtists(queryDto) {
        const { limit, skip, sort = { playsCount: -1 }, page, filter, select, populate, relationalFilter, } = queryDto;
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'sonicKey.partner',
                    foreignField: '_id',
                    as: 'sonicKey.partner',
                },
            },
            { $addFields: { 'sonicKey.partner': { $first: '$sonicKey.partner' } } },
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
            {
                $group: {
                    _id: {
                        artist: '$sonicKey.contentOwner',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey.sonicKey',
                    },
                    radioStations: {
                        $addToSet: '$radioStation._id',
                    },
                    countries: {
                        $addToSet: '$radioStation.country',
                    },
                },
            },
            {
                $match: {
                    '_id.artist': { $exists: true, $ne: null },
                },
            },
            {
                $project: {
                    _id: 0,
                    artist: '$_id.artist',
                    playsCount: '$plays',
                    uniquePlaysCount: { $size: '$sonicKeys' },
                    radioStationCount: { $size: '$radioStations' },
                    countriesCount: { $size: '$countries' },
                },
            },
        ];
        const aggregate = this.detectionModel.aggregate(aggregateArray);
        return this.detectionModel['aggregatePaginate'](aggregate, paginateOptions);
    }
    async listPlaysByCountries(queryDto) {
        const { limit, skip, sort = { playsCount: -1 }, page, filter, select, populate, relationalFilter, } = queryDto;
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'sonicKey.partner',
                    foreignField: '_id',
                    as: 'sonicKey.partner',
                },
            },
            { $addFields: { 'sonicKey.partner': { $first: '$sonicKey.partner' } } },
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
            {
                $group: {
                    _id: {
                        country: '$radioStation.country',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey.sonicKey',
                    },
                    radioStations: {
                        $addToSet: '$radioStation._id',
                    },
                    artists: {
                        $addToSet: '$sonicKey.contentOwner',
                    },
                },
            },
            {
                $match: {
                    '_id.country': { $exists: true, $ne: null },
                },
            },
            {
                $project: {
                    _id: 0,
                    country: '$_id.country',
                    playsCount: '$plays',
                    uniquePlaysCount: { $size: '$sonicKeys' },
                    radioStationCount: { $size: '$radioStations' },
                    artistsCount: { $size: '$artists' },
                },
            },
        ];
        const aggregate = this.detectionModel.aggregate(aggregateArray);
        return this.detectionModel['aggregatePaginate'](aggregate, paginateOptions);
    }
    async listPlaysByTracks(queryDto) {
        const { limit, skip, sort = { playsCount: -1 }, page, filter, select, populate, relationalFilter, } = queryDto;
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'sonicKey.partner',
                    foreignField: '_id',
                    as: 'sonicKey.partner',
                },
            },
            { $addFields: { 'sonicKey.partner': { $first: '$sonicKey.partner' } } },
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
            {
                $group: {
                    _id: {
                        trackName: '$sonicKey.contentName',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey.sonicKey',
                    },
                    artists: {
                        $addToSet: '$sonicKey.contentOwner',
                    },
                    radioStations: {
                        $addToSet: '$radioStation._id',
                    },
                    countries: {
                        $addToSet: '$radioStation.country',
                    },
                },
            },
            {
                $match: {
                    '_id.trackName': { $exists: true, $ne: null },
                },
            },
            {
                $project: {
                    _id: 0,
                    trackName: '$_id.trackName',
                    playsCount: '$plays',
                    uniquePlaysCount: { $size: '$sonicKeys' },
                    radioStationCount: { $size: '$radioStations' },
                    artistsCount: { $size: '$artists' },
                    countriesCount: { $size: '$countries' },
                },
            },
        ];
        const aggregate = this.detectionModel.aggregate(aggregateArray);
        return this.detectionModel['aggregatePaginate'](aggregate, paginateOptions);
    }
    async listPlaysByRadioStations(queryDto) {
        const { limit, skip, sort = { playsCount: -1 }, page, filter, select, populate, relationalFilter, } = queryDto;
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'sonicKey.partner',
                    foreignField: '_id',
                    as: 'sonicKey.partner',
                },
            },
            { $addFields: { 'sonicKey.partner': { $first: '$sonicKey.partner' } } },
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
            {
                $group: {
                    _id: {
                        radioStation: '$radioStation._id',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey.sonicKey',
                    },
                    artists: {
                        $addToSet: '$sonicKey.contentOwner',
                    },
                    countries: {
                        $addToSet: '$radioStation.country',
                    },
                },
            },
            {
                $match: {
                    '_id.radioStation': { $exists: true, $ne: null },
                },
            },
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
                    playsCount: '$plays',
                    uniquePlaysCount: { $size: '$sonicKeys' },
                    artistsCount: { $size: '$artists' },
                    countriesCount: { $size: '$countries' },
                },
            },
        ];
        const aggregate = this.detectionModel.aggregate(aggregateArray);
        return this.detectionModel['aggregatePaginate'](aggregate, paginateOptions);
    }
    async listPlaysByCompanies(queryDto) {
        const { limit, skip, sort = { playsCount: -1 }, page, filter, select, populate, relationalFilter, } = queryDto;
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'sonicKey.partner',
                    foreignField: '_id',
                    as: 'sonicKey.partner',
                },
            },
            { $addFields: { 'sonicKey.partner': { $first: '$sonicKey.partner' } } },
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
            {
                $group: {
                    _id: {
                        company: '$sonicKey.company._id',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey.sonicKey',
                    },
                    artists: {
                        $addToSet: '$sonicKey.contentOwner',
                    },
                },
            },
            {
                $match: {
                    '_id.company': { $exists: true, $ne: null },
                },
            },
            {
                $lookup: {
                    from: 'Company',
                    localField: '_id.company',
                    foreignField: '_id',
                    as: 'company',
                },
            },
            {
                $project: {
                    _id: 0,
                    company: { $first: '$company' },
                    playsCount: '$plays',
                    uniquePlaysCount: { $size: '$sonicKeys' },
                    artistsCount: { $size: '$artists' },
                },
            },
        ];
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
    async getSonicKeysDetails(queryDto, aggregateQuery) {
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
        const { filter } = queryDto;
        return this.detectionModel
            .find(filter || {})
            .countDocuments()
            .exec();
    }
    async getCount(queryDto) {
        const { filter } = queryDto;
        return this.detectionModel.find(filter || {}).count();
    }
    async getEstimateCount() {
        return this.detectionModel.estimatedDocumentCount();
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
    async findTopRadioStationsWithPlaysCountForOwner(topLimit, queryDto) {
        const { filter, relationalFilter } = queryDto;
        return this.detectionModel.aggregate([
            {
                $match: Object.assign(Object.assign({}, filter), { channel: Enums_1.ChannelEnums.STREAMREADER }),
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
                    from: 'User',
                    localField: 'sonicKey.owner',
                    foreignField: '_id',
                    as: 'sonicKey.owner',
                },
            },
            { $addFields: { 'sonicKey.owner': { $first: '$sonicKey.owner' } } },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'sonicKey.company',
                    foreignField: '_id',
                    as: 'sonicKey.company',
                },
            },
            { $addFields: { 'sonicKey.company': { $first: '$sonicKey.company' } } },
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
            {
                $group: {
                    _id: {
                        radioStation: '$radioStation._id',
                    },
                    plays: {
                        $sum: 1,
                    },
                    sonicKeys: {
                        $addToSet: '$sonicKey.sonicKey',
                    },
                },
            },
            { $match: { plays: { $gt: 0 } } },
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
        var e_11, _a;
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
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (topStations_1_1 && !topStations_1_1.done && (_a = topStations_1.return)) await _a.call(topStations_1);
            }
            finally { if (e_11) throw e_11.error; }
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
        const stationId = (0, mongoose_utils_1.toObjectId)(radioStationId);
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
        const stationId = (0, mongoose_utils_1.toObjectId)(radioStationId);
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
    getSKSIDFromDetectionOrigin(detectionOriginsArr) {
        var skSid = [];
        if (detectionOriginsArr && (detectionOriginsArr === null || detectionOriginsArr === void 0 ? void 0 : detectionOriginsArr.length) > 0) {
            detectionOriginsArr.forEach(origin => {
                if (origin === constants_1.DETECTION_ORIGINS_OBJ.SONICKEY.name)
                    skSid.push(constants_1.DETECTION_ORIGINS_OBJ.SONICKEY.shortName);
                if (origin === constants_1.DETECTION_ORIGINS_OBJ.FINGERPRINT.name)
                    skSid.push(constants_1.DETECTION_ORIGINS_OBJ.FINGERPRINT.shortName);
            });
        }
        else {
            skSid = [constants_1.DETECTION_ORIGINS_OBJ.SONICKEY.shortName];
        }
        return skSid.join(', ');
    }
};
DetectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(detection_schema_1.Detection.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService,
        file_handler_service_1.FileHandlerService])
], DetectionService);
exports.DetectionService = DetectionService;
//# sourceMappingURL=detection.service.js.map