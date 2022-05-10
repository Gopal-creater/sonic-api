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
exports.TrackService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const track_schema_1 = require("./schemas/track.schema");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../user/services/user.service");
const mm = require("music-metadata");
const s3fileupload_service_1 = require("../s3fileupload/s3fileupload.service");
let TrackService = class TrackService {
    constructor(trackModel, s3FileUploadService, userService) {
        this.trackModel = trackModel;
        this.s3FileUploadService = s3FileUploadService;
        this.userService = userService;
    }
    async create(doc) {
        return this.trackModel.create(doc).then(createdTrack => {
            return createdTrack.save();
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
    update(id, updateTrackDto, additionalObj) {
        return this.trackModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateTrackDto), additionalObj), {
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