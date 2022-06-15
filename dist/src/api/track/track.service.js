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
exports.TrackService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const track_schema_1 = require("./schemas/track.schema");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../user/services/user.service");
const mm = require("music-metadata");
const s3fileupload_service_1 = require("../s3fileupload/s3fileupload.service");
const nanoid_1 = require("nanoid");
const Enums_1 = require("../../constants/Enums");
const AdmZip = require("adm-zip");
const makeDir = require("make-dir");
const xlsx = require("xlsx");
const moment = require("moment");
const config_1 = require("../../config");
let TrackService = class TrackService {
    constructor(trackModel, s3FileUploadService, userService) {
        this.trackModel = trackModel;
        this.s3FileUploadService = s3FileUploadService;
        this.userService = userService;
    }
    async create(doc) {
        const trackId = this.generateTrackId();
        return this.trackModel
            .create(Object.assign(Object.assign({}, doc), { _id: trackId }))
            .then(createdTrack => {
            return createdTrack.save();
        });
    }
    async uploadAndCreate(file, doc, s3destinationFolder, acl) {
        const { channel, artist, title } = doc;
        const s3FileUploadResponse = await this.s3FileUploadService.uploadFromPath(file.path, `${s3destinationFolder}/originalFiles`);
        const extractFileMeta = await this.exractMusicMetaFromFile(file);
        const trackId = this.generateTrackId();
        const createdTrack = await this.create(Object.assign(Object.assign({ _id: trackId }, doc), { channel: channel || Enums_1.ChannelEnums.PORTAL, mimeType: extractFileMeta.mimeType, duration: extractFileMeta.duration, artist: artist, title: title, fileSize: extractFileMeta.size, localFilePath: file.path, s3OriginalFileMeta: s3FileUploadResponse, encoding: extractFileMeta.encoding, samplingFrequency: extractFileMeta.samplingFrequency, originalFileName: file.originalname, iExtractedMetaData: extractFileMeta }));
        return createdTrack;
    }
    generateTrackId() {
        return `T${nanoid_1.customAlphabet('1234567890', 10)(8)}`;
    }
    async exportTracks(queryDto, format) {
        return new Promise(async (resolve, reject) => {
            var e_1, _a;
            var _b, _c, _d, _e, _f;
            const tracks = await this.findAll(queryDto);
            var tracksListInJsonFormat = [];
            try {
                for (var _g = __asyncValues(tracks.docs), _h; _h = await _g.next(), !_h.done;) {
                    const track = _h.value;
                    var trackExcelData = {
                        TrackId: track === null || track === void 0 ? void 0 : track._id,
                        Title: ((_b = track === null || track === void 0 ? void 0 : track.trackMetaData) === null || _b === void 0 ? void 0 : _b.contentName) || "--",
                        Version: ((_c = track === null || track === void 0 ? void 0 : track.trackMetaData) === null || _c === void 0 ? void 0 : _c.version) || "--",
                        Artist: ((_d = track === null || track === void 0 ? void 0 : track.trackMetaData) === null || _d === void 0 ? void 0 : _d.contentOwner) || "--",
                        Distributor: ((_e = track === null || track === void 0 ? void 0 : track.trackMetaData) === null || _e === void 0 ? void 0 : _e.distributor) || "--",
                        FileType: (track === null || track === void 0 ? void 0 : track.fileType) || "--",
                        Date: moment(track === null || track === void 0 ? void 0 : track['createdAt'])
                            .utc()
                            .format('DD/MM/YYYY'),
                        "System / Partner Id": ((_f = track === null || track === void 0 ? void 0 : track.partner) === null || _f === void 0 ? void 0 : _f._id) || "--"
                    };
                    tracksListInJsonFormat.push(trackExcelData);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_a = _g.return)) await _a.call(_g);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (tracksListInJsonFormat.length <= 0) {
                tracksListInJsonFormat.push({
                    TrackId: '',
                    Title: '',
                    Version: '',
                    Artist: '',
                    Distributor: '',
                    FileType: '',
                    Date: '',
                    "System / Partner Id": ''
                });
            }
            const destination = await makeDir(config_1.appConfig.MULTER_EXPORT_DEST);
            var finalFilePath = '';
            var zip = new AdmZip();
            try {
                const file = xlsx.utils.book_new();
                const wsTracksListInJsonFormat = xlsx.utils.json_to_sheet(tracksListInJsonFormat);
                xlsx.utils.book_append_sheet(file, wsTracksListInJsonFormat, 'Tracks');
                if (format == "xlsx") {
                    const excelFilePath = `${destination}/${`tracks${Date.now()}`}.xlsx`;
                    xlsx.writeFile(file, excelFilePath);
                    finalFilePath = excelFilePath;
                    resolve(excelFilePath);
                }
                else if (format == 'csv') {
                    const csvFilePath = `${destination}/${`tracks${Date.now()}`}.csv`;
                    xlsx.writeFile(file, csvFilePath, { bookType: 'csv', sheet: "Tracks" });
                    finalFilePath = csvFilePath;
                    resolve(csvFilePath);
                }
            }
            catch (error) {
                return reject(error);
            }
        });
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
        const aggregate = this.trackModel.aggregate(aggregateArray);
        return this.trackModel['aggregatePaginate'](aggregate, paginateOptions);
    }
    findOne(filter) {
        return this.trackModel.findOne(filter);
    }
    findById(id) {
        return this.trackModel.findById(id);
    }
    update(id, updateTrackDto) {
        return this.trackModel.findByIdAndUpdate(id, updateTrackDto, {
            new: true,
        });
    }
    async getCount(queryDto) {
        const { filter, includeGroupData } = queryDto;
        return this.trackModel.find(filter || {}).count();
    }
    async getEstimateCount() {
        return this.trackModel.estimatedDocumentCount();
    }
    async removeById(id) {
        const deletedTrack = await this.trackModel.findByIdAndRemove(id);
        return deletedTrack;
    }
    async exractMusicMetaFromFile(file) {
        var _a, _b, _c, _d, _e, _f;
        const musicData = await mm.parseFile(file.path);
        return {
            size: file.size,
            originalFileName: file.originalname,
            mimeType: file.mimetype,
            duration: (_a = musicData === null || musicData === void 0 ? void 0 : musicData.format) === null || _a === void 0 ? void 0 : _a.duration,
            encoding: `${(_b = musicData === null || musicData === void 0 ? void 0 : musicData.format) === null || _b === void 0 ? void 0 : _b.codec}, ${(_c = musicData === null || musicData === void 0 ? void 0 : musicData.format) === null || _c === void 0 ? void 0 : _c.sampleRate} Hz, ${((_d = musicData === null || musicData === void 0 ? void 0 : musicData.format) === null || _d === void 0 ? void 0 : _d.codecProfile) || 'codecProfile'}, ${(_e = musicData === null || musicData === void 0 ? void 0 : musicData.format) === null || _e === void 0 ? void 0 : _e.bitrate} ch`,
            samplingFrequency: `${(_f = musicData === null || musicData === void 0 ? void 0 : musicData.format) === null || _f === void 0 ? void 0 : _f.sampleRate} Hz`,
            medaData: musicData,
        };
    }
};
TrackService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(track_schema_1.Track.name)),
    __param(2, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        s3fileupload_service_1.S3FileUploadService,
        user_service_1.UserService])
], TrackService);
exports.TrackService = TrackService;
//# sourceMappingURL=track.service.js.map