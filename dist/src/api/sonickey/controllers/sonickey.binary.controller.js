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
exports.SonickeyBinaryController = void 0;
const openapi = require("@nestjs/swagger");
const create_sonickey_dto_1 = require("../dtos/create-sonickey.dto");
const common_1 = require("@nestjs/common");
const sonickey_service_1 = require("../services/sonickey.service");
const swagger_1 = require("@nestjs/swagger");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
const apikey_auth_guard_1 = require("../../auth/guards/apikey-auth.guard");
const apikey_decorator_1 = require("../../api-key/decorators/apikey.decorator");
const validatedlicense_decorator_1 = require("../../licensekey/decorators/validatedlicense.decorator");
const license_validation_guard_1 = require("../../licensekey/guards/license-validation.guard");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
const utils_1 = require("../../../shared/utils");
const user_db_schema_1 = require("../../user/schemas/user.db.schema");
const track_schema_1 = require("../../track/schemas/track.schema");
const Enums_1 = require("../../../constants/Enums");
let SonickeyBinaryController = class SonickeyBinaryController {
    constructor(sonicKeyService, licensekeyService) {
        this.sonicKeyService = sonicKeyService;
        this.licensekeyService = licensekeyService;
    }
    async createFormBinary(createSonicKeyDto, loggedInUser, apiKey, licenseId) {
        createSonicKeyDto.channel = Enums_1.ChannelEnums.BINARY;
        var { sonicKey, channel, contentFileType, contentName, contentOwner, contentType, contentDuration, contentSize, contentEncoding, contentSamplingFrequency, contentFilePath } = createSonicKeyDto;
        if (!sonicKey) {
            throw new common_1.BadRequestException('SonicKey is required');
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
        await this.licensekeyService.incrementUses(licenseId, "encode", 1)
            .catch(async (err) => {
            await this.sonicKeyService.sonicKeyModel.deleteOne({ _id: savedSonicKey.id });
            throw new common_1.BadRequestException('Unable to increment the license usage!');
        });
        return savedSonicKey;
    }
};
__decorate([
    (0, common_1.UseGuards)(apikey_auth_guard_1.ApiKeyAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    (0, common_1.Post)('/create-from-binary'),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, swagger_1.ApiOperation)({ summary: 'Save to database after local encode from binary.' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, apikey_decorator_1.ApiKey)('_id')),
    __param(3, (0, validatedlicense_decorator_1.ValidatedLicense)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyDto,
        user_db_schema_1.UserDB, String, String]),
    __metadata("design:returntype", Promise)
], SonickeyBinaryController.prototype, "createFormBinary", null);
SonickeyBinaryController = __decorate([
    (0, swagger_1.ApiTags)('SonicKeys ThirdParty-Binary Controller (protected by x-api-key)'),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, common_1.Controller)('sonic-keys/binary'),
    __metadata("design:paramtypes", [sonickey_service_1.SonickeyService,
        licensekey_service_1.LicensekeyService])
], SonickeyBinaryController);
exports.SonickeyBinaryController = SonickeyBinaryController;
//# sourceMappingURL=sonickey.binary.controller.js.map