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
exports.SonickeyThirdPartyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const sonickey_service_1 = require("../services/sonickey.service");
const swagger_1 = require("@nestjs/swagger");
const file_handler_service_1 = require("../../../shared/services/file-handler.service");
const Enums_1 = require("../../../constants/Enums");
const FileFromUrl_interceptor_1 = require("../../../shared/interceptors/FileFromUrl.interceptor");
const encode_dto_1 = require("../dtos/encode.dto");
const common_2 = require("@nestjs/common");
const decorators_1 = require("../../auth/decorators");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
const create_sonickey_dto_1 = require("../dtos/create-sonickey.dto");
const apikey_auth_guard_1 = require("../../auth/guards/apikey-auth.guard");
const license_validation_guard_1 = require("../../licensekey/guards/license-validation.guard");
const validatedlicense_decorator_1 = require("../../licensekey/decorators/validatedlicense.decorator");
const apikey_decorator_1 = require("../../api-key/decorators/apikey.decorator");
const update_sonickey_dto_1 = require("../dtos/update-sonickey.dto");
const user_db_schema_1 = require("../../user/schemas/user.db.schema");
const utils_1 = require("../../../shared/utils");
let SonickeyThirdPartyController = class SonickeyThirdPartyController {
    constructor(sonicKeyService, fileHandlerService, licensekeyService) {
        this.sonicKeyService = sonicKeyService;
        this.fileHandlerService = fileHandlerService;
        this.licensekeyService = licensekeyService;
    }
    async encodeFromUrl(sonicKeyDto, file, loggedInUser, owner, licenseId) {
        const { destinationFolder, resourceOwnerObj, } = (0, utils_1.identifyDestinationFolderAndResourceOwnerFromUser)(loggedInUser);
        const encodingStrength = sonicKeyDto.encodingStrength;
        const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto);
        const sonickeyDoc = Object.assign(Object.assign(Object.assign({}, sonicKeyDtoWithAudioData), resourceOwnerObj), { createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub });
        return this.sonicKeyService.encodeSonicKeyFromFile({
            file,
            licenseId,
            sonickeyDoc,
            encodingStrength,
            s3destinationFolder: destinationFolder,
        });
    }
    async createFormBinary(createSonicKeyDto, loggedInUser, apiKey, licenseId) {
        createSonicKeyDto.channel = Enums_1.ChannelEnums.BINARY;
        var { sonicKey, channel, contentFileType, contentName, contentOwner, contentType, contentDuration, contentSize, contentEncoding, contentSamplingFrequency, contentFilePath } = createSonicKeyDto;
        if (!sonicKey) {
            throw new common_2.BadRequestException('SonicKey is required');
        }
        const { resourceOwnerObj, } = (0, utils_1.identifyDestinationFolderAndResourceOwnerFromUser)(loggedInUser);
        const newTrack = Object.assign(Object.assign({ channel: channel, artist: contentOwner, title: contentName, fileType: contentType, mimeType: contentFileType, duration: contentDuration, fileSize: contentSize, encoding: contentEncoding, localFilePath: contentFilePath, samplingFrequency: contentSamplingFrequency, trackMetaData: createSonicKeyDto }, resourceOwnerObj), { createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub });
        var track = await this.sonicKeyService.trackService.findOne({
            mimeType: contentFileType,
            fileSize: contentSize,
            duration: contentDuration
        });
        if (!track) {
            track = await this.sonicKeyService.trackService.create(newTrack);
        }
        const sonickeyDoc = Object.assign(Object.assign(Object.assign({}, createSonicKeyDto), resourceOwnerObj), { _id: createSonicKeyDto.sonicKey, apiKey: apiKey, license: licenseId, createdBy: loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.sub, track: track === null || track === void 0 ? void 0 : track._id });
        const savedSonicKey = await this.sonicKeyService.create(sonickeyDoc);
        await this.licensekeyService
            .incrementUses(licenseId, 'encode', 1)
            .catch(async (err) => {
            await this.sonicKeyService.sonicKeyModel.deleteOne({
                _id: savedSonicKey.id,
            });
            throw new common_2.BadRequestException('Unable to increment the license usage!');
        });
        return savedSonicKey;
    }
    async updateMeta(sonickey, updateSonicKeyFromBinaryDto, owner) {
        const updatedSonickey = await this.sonicKeyService.sonicKeyModel.findOneAndUpdate({ sonicKey: sonickey }, updateSonicKeyFromBinaryDto, { new: true });
        if (!updatedSonickey) {
            throw new common_2.NotFoundException('Given sonickey is either not present or doest not belongs to you');
        }
        return updatedSonickey;
    }
};
__decorate([
    (0, common_1.UseInterceptors)((0, FileFromUrl_interceptor_1.FileFromUrlInterceptor)('mediaFile')),
    (0, swagger_1.ApiBody)({
        description: 'File To Encode',
        type: encode_dto_1.EncodeFromUrlDto,
    }),
    (0, common_2.UseGuards)(apikey_auth_guard_1.ApiKeyAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, common_1.Post)('/encode-from-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Encode File From URL And save to database' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)('data')),
    __param(1, (0, FileFromUrl_interceptor_1.UploadedFileFromUrl)()),
    __param(2, (0, decorators_1.User)()),
    __param(3, (0, decorators_1.User)('sub')),
    __param(4, (0, validatedlicense_decorator_1.ValidatedLicense)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyDto, Object, user_db_schema_1.UserDB, String, String]),
    __metadata("design:returntype", Promise)
], SonickeyThirdPartyController.prototype, "encodeFromUrl", null);
__decorate([
    (0, common_2.UseGuards)(apikey_auth_guard_1.ApiKeyAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    (0, common_1.Post)('/create-from-binary'),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, swagger_1.ApiOperation)({ summary: 'Save to database after local encode from binary.' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.User)()),
    __param(2, (0, apikey_decorator_1.ApiKey)('_id')),
    __param(3, (0, validatedlicense_decorator_1.ValidatedLicense)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyDto,
        user_db_schema_1.UserDB, String, String]),
    __metadata("design:returntype", Promise)
], SonickeyThirdPartyController.prototype, "createFormBinary", null);
__decorate([
    (0, common_1.Patch)('/:sonickey'),
    (0, common_2.UseGuards)(apikey_auth_guard_1.ApiKeyAuthGuard),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update Sonic Keys meta data from binary including s3FileMeta',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_2.Param)('sonickey')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sonickey_dto_1.UpdateSonicKeyFromBinaryDto, String]),
    __metadata("design:returntype", Promise)
], SonickeyThirdPartyController.prototype, "updateMeta", null);
SonickeyThirdPartyController = __decorate([
    (0, swagger_1.ApiTags)('ThirdParty Integration Controller, Protected By XAPI-Key'),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, common_1.Controller)('thirdparty/sonic-keys'),
    __metadata("design:paramtypes", [sonickey_service_1.SonickeyService,
        file_handler_service_1.FileHandlerService,
        licensekey_service_1.LicensekeyService])
], SonickeyThirdPartyController);
exports.SonickeyThirdPartyController = SonickeyThirdPartyController;
//# sourceMappingURL=sonickey.thirdparty.controller.js.map