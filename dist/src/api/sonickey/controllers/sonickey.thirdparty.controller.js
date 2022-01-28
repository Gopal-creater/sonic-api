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
const sonicKey_dto_1 = require("../dtos/sonicKey.dto");
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
let SonickeyThirdPartyController = class SonickeyThirdPartyController {
    constructor(sonicKeyService, fileHandlerService, licensekeyService) {
        this.sonicKeyService = sonicKeyService;
        this.fileHandlerService = fileHandlerService;
        this.licensekeyService = licensekeyService;
    }
    encodeFromUrl(sonicKeyDto, file, owner, licenseId) {
        var s3UploadResult;
        var sonicKey;
        return this.sonicKeyService
            .encodeAndUploadToS3(file, owner, sonicKeyDto.encodingStrength)
            .then(data => {
            s3UploadResult = data.s3UploadResult;
            sonicKey = data.sonicKey;
            console.log('Increment Usages upon successfull encode');
            return this.licensekeyService.incrementUses(licenseId, 'encode', 1);
        })
            .then(async (result) => {
            console.log('Going to save key in db.');
            const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto);
            const channel = Enums_1.ChannelEnums.THIRDPARTY;
            const newSonicKey = Object.assign(Object.assign({}, sonicKeyDtoWithAudioData), { contentFilePath: s3UploadResult.Location, originalFileName: file === null || file === void 0 ? void 0 : file.originalname, owner: owner, sonicKey: sonicKey, channel: channel, downloadable: true, s3FileMeta: s3UploadResult, _id: sonicKey, license: licenseId });
            return this.sonicKeyService.saveSonicKeyForUser(owner, newSonicKey);
        })
            .catch(err => {
            throw new common_1.InternalServerErrorException(err);
        })
            .finally(() => {
            this.fileHandlerService.deleteFileAtPath(file.path);
        });
    }
    async createFormBinary(createSonicKeyDto, customer, apiKey, licenseKey) {
        const channel = Enums_1.ChannelEnums.BINARY;
        const newSonicKey = Object.assign(Object.assign({}, createSonicKeyDto), { owner: customer, apiKey: apiKey, channel: channel, license: licenseKey, _id: createSonicKeyDto.sonicKey });
        const savedSonicKey = await this.sonicKeyService.createFromBinaryForUser(customer, newSonicKey);
        await this.licensekeyService.incrementUses(licenseKey, "encode", 1)
            .catch(async (err) => {
            await this.sonicKeyService.sonicKeyModel.deleteOne({ _id: savedSonicKey.id });
            throw new common_2.BadRequestException('Unable to increment the license usage!');
        });
        return savedSonicKey;
    }
};
__decorate([
    common_1.UseInterceptors(FileFromUrl_interceptor_1.FileFromUrlInterceptor('mediaFile')),
    swagger_1.ApiBody({
        description: 'File To Encode',
        type: encode_dto_1.EncodeFromUrlDto,
    }),
    common_2.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    common_1.Post('/encode-from-url'),
    swagger_1.ApiOperation({ summary: 'Encode File From URL And save to database' }),
    openapi.ApiResponse({ status: 201, type: require("../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.Body('data')),
    __param(1, FileFromUrl_interceptor_1.UploadedFileFromUrl()),
    __param(2, decorators_1.User('sub')),
    __param(3, validatedlicense_decorator_1.ValidatedLicense('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sonicKey_dto_1.SonicKeyDto, Object, String, String]),
    __metadata("design:returntype", void 0)
], SonickeyThirdPartyController.prototype, "encodeFromUrl", null);
__decorate([
    common_2.UseGuards(apikey_auth_guard_1.ApiKeyAuthGuard, license_validation_guard_1.LicenseValidationGuard),
    common_1.Post('/create-from-binary'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Save to database after local encode from binary.' }),
    openapi.ApiResponse({ status: 201, type: require("../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.Body()),
    __param(1, decorators_1.User('sub')),
    __param(2, apikey_decorator_1.ApiKey('_id')),
    __param(3, validatedlicense_decorator_1.ValidatedLicense('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sonickey_dto_1.CreateSonicKeyFromBinaryDto, String, String, String]),
    __metadata("design:returntype", Promise)
], SonickeyThirdPartyController.prototype, "createFormBinary", null);
SonickeyThirdPartyController = __decorate([
    swagger_1.ApiTags('ThirdParty Integration Controller, Protected By XAPI-Key'),
    swagger_1.ApiSecurity('x-api-key'),
    common_1.Controller('thirdparty/sonic-keys'),
    __metadata("design:paramtypes", [sonickey_service_1.SonickeyService,
        file_handler_service_1.FileHandlerService,
        licensekey_service_1.LicensekeyService])
], SonickeyThirdPartyController);
exports.SonickeyThirdPartyController = SonickeyThirdPartyController;
//# sourceMappingURL=sonickey.thirdparty.controller.js.map