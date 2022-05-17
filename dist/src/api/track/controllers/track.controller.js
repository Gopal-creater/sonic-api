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
exports.TrackController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const track_service_1 = require("../track.service");
const update_track_dto_1 = require("../dto/update-track.dto");
const swagger_1 = require("@nestjs/swagger");
const anyapiquerytemplate_decorator_1 = require("../../../shared/decorators/anyapiquerytemplate.decorator");
const parseQueryValue_pipe_1 = require("../../../shared/pipes/parseQueryValue.pipe");
const parsedquery_dto_1 = require("../../../shared/dtos/parsedquery.dto");
const create_track_dto_1 = require("../dto/create-track.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const makeDir = require("make-dir");
const config_1 = require("../../../config");
const uniqid = require("uniqid");
const user_db_schema_1 = require("../../user/schemas/user.db.schema");
const decorators_1 = require("../../auth/decorators");
const utils_1 = require("../../../shared/utils");
const Enums_1 = require("../../../constants/Enums");
const guards_1 = require("../../auth/guards");
const role_based_guard_1 = require("../../auth/guards/role-based.guard");
const update_track_security_guard_1 = require("../guards/update-track-security.guard");
const delete_track_security_guard_1 = require("../guards/delete-track-security.guard");
const failedAlways_guard_1 = require("../../auth/guards/failedAlways.guard");
const upload_track_security_guard_1 = require("../guards/upload-track-security.guard");
let TrackController = class TrackController {
    constructor(trackService) {
        this.trackService = trackService;
    }
    async uploadTrack(uploadTrackDto, file, loggedInUser) {
        const { mediaFile, channel, artist, title } = uploadTrackDto;
        const { destinationFolder, resourceOwnerObj, } = utils_1.identifyDestinationFolderAndResourceOwnerFromUser(loggedInUser);
        const s3FileUploadResponse = await this.trackService.s3FileUploadService.uploadFromPath(file.path, `${destinationFolder}/originalFiles`);
        const extractFileMeta = await this.trackService.exractMusicMetaFromFile(file);
        const trackId = this.trackService.generateTrackId();
        const createdTrack = await this.trackService.create(Object.assign(Object.assign({ _id: trackId }, resourceOwnerObj), { channel: channel || Enums_1.ChannelEnums.PORTAL, mimeType: extractFileMeta.mimeType, duration: extractFileMeta.duration, artist: artist, title: title, fileSize: extractFileMeta.size, localFilePath: file.path, s3OriginalFileMeta: s3FileUploadResponse, fileType: 'Audio', encoding: extractFileMeta.encoding, samplingFrequency: extractFileMeta.samplingFrequency, originalFileName: file.originalname, iExtractedMetaData: extractFileMeta, createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub }));
        return createdTrack;
    }
    findAll(queryDto, loggedInUser) {
        return this.trackService.findAll(queryDto);
    }
    async findById(id) {
        const track = await this.trackService.findById(id);
        if (!track) {
            return new common_1.NotFoundException();
        }
        return track;
    }
    async update(id, loggedInUser, updateTrackDto) {
        const track = await this.trackService.findById(id);
        if (!track) {
            return new common_1.NotFoundException();
        }
        return this.trackService.update(id, Object.assign(Object.assign({}, updateTrackDto), { updatedBy: loggedInUser.sub }));
    }
    async getCount(queryDto) {
        return this.trackService.getCount(queryDto);
    }
    async getEstimateCount() {
        return this.trackService.getEstimateCount();
    }
    async remove(id) {
        const track = await this.trackService.findById(id);
        if (!track) {
            return new common_1.NotFoundException();
        }
        return this.trackService.removeById(id);
    }
};
__decorate([
    common_1.UseInterceptors(platform_express_1.FileInterceptor('mediaFile', {
        storage: multer_1.diskStorage({
            destination: async (req, file, cb) => {
                var _a, _b;
                const loggedInUser = req['user'];
                var filePath;
                if (loggedInUser.partner) {
                    filePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/partners/${(_a = loggedInUser.partner) === null || _a === void 0 ? void 0 : _a._id}`);
                }
                else if (loggedInUser.company) {
                    filePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/companies/${(_b = loggedInUser.company) === null || _b === void 0 ? void 0 : _b._id}`);
                }
                else {
                    filePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/${loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub}`);
                }
                cb(null, filePath);
            },
            filename: (req, file, cb) => {
                let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
                const randomName = uniqid();
                cb(null, `${randomName}-${orgName}`);
            },
        }),
    })),
    swagger_1.ApiConsumes('multipart/form-data'),
    swagger_1.ApiBody({
        description: 'File To Encode',
        type: create_track_dto_1.UploadTrackDto,
    }),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate(),
    swagger_1.ApiOperation({ summary: 'Upload Track' }),
    decorators_1.RolesAllowed(),
    common_1.UseGuards(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, upload_track_security_guard_1.UploadTrackSecurityGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Post(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, common_1.Body()),
    __param(1, common_1.UploadedFile()),
    __param(2, decorators_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_track_dto_1.UploadTrackDto, Object, user_db_schema_1.UserDB]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "uploadTrack", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'List Tracks' }),
    common_1.Get(),
    swagger_1.ApiQuery({
        name: 'channel',
        enum: [...Object.values(Enums_1.ChannelEnums), 'ALL'],
        required: false,
    }),
    anyapiquerytemplate_decorator_1.AnyApiQueryTemplate({
        additionalHtmlDescription: `<div>
      To Get tracks for specific company ?company=companyId <br/>
      To Get tracks for specific partner ?partner=partnerId <br/>
      To Get plays for specific user ?owner=ownerId
    <div>`,
    }),
    common_1.UseGuards(guards_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    openapi.ApiResponse({ status: 200, type: require("../dto/mongoosepaginate-track.dto").MongoosePaginateTrackDto }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __param(1, decorators_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto,
        user_db_schema_1.UserDB]),
    __metadata("design:returntype", void 0)
], TrackController.prototype, "findAll", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Get track by id',
    }),
    common_1.Get(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "findById", null);
__decorate([
    swagger_1.ApiOperation({
        summary: 'Update track by id',
    }),
    decorators_1.RolesAllowed(),
    common_1.UseGuards(guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, update_track_security_guard_1.UpdateTrackSecurityGuard),
    swagger_1.ApiBearerAuth(),
    common_1.Put(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.User()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_db_schema_1.UserDB,
        update_track_dto_1.UpdateTrackDto]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "update", null);
__decorate([
    common_1.Get('/count'),
    swagger_1.ApiOperation({
        summary: 'Get count of all tracks also accept filter as query params',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, common_1.Query(new parseQueryValue_pipe_1.ParseQueryValue())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parsedquery_dto_1.ParsedQueryDto]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "getCount", null);
__decorate([
    common_1.Get('/estimate-count'),
    swagger_1.ApiOperation({
        summary: 'Get all count of all tracks',
    }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "getEstimateCount", null);
__decorate([
    common_1.Delete(':id'),
    decorators_1.RolesAllowed(),
    common_1.UseGuards(failedAlways_guard_1.FailedAlwaysGuard, guards_1.JwtAuthGuard, role_based_guard_1.RoleBasedGuard, delete_track_security_guard_1.DeleteTrackSecurityGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Remove track' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "remove", null);
TrackController = __decorate([
    swagger_1.ApiTags("Track Controller"),
    common_1.Controller('tracks'),
    __metadata("design:paramtypes", [track_service_1.TrackService])
], TrackController);
exports.TrackController = TrackController;
//# sourceMappingURL=track.controller.js.map