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
exports.ExternalSonickeyController = void 0;
const openapi = require("@nestjs/swagger");
const sonicKey_dto_1 = require("./../../sonickey/dtos/sonicKey.dto");
const sonickey_service_1 = require("../../sonickey/sonickey.service");
const sonickey_schema_1 = require("../../../schemas/sonickey.schema");
const extdecode_dto_1 = require("./dtos/extdecode.dto");
const extencode_dto_1 = require("./dtos/extencode.dto");
const jsonparse_pipe_1 = require("../../../shared/pipes/jsonparse.pipe");
const common_1 = require("@nestjs/common");
const externalsonickey_service_1 = require("./externalsonickey.service");
const platform_express_1 = require("@nestjs/platform-express");
const makeDir = require("make-dir");
const multer_1 = require("multer");
const config_1 = require("../../../config");
const swagger_1 = require("@nestjs/swagger");
const uniqid = require("uniqid");
let ExternalSonickeyController = class ExternalSonickeyController {
    constructor(externalSonicKeyService, sonickeyService) {
        this.externalSonicKeyService = externalSonicKeyService;
        this.sonickeyService = sonickeyService;
    }
    encode(sonicKeyDto, file) {
        var downloadFileUrl;
        var outFilePath;
        var sonicKey;
        return this.sonickeyService
            .encode(file, sonicKeyDto.encodingStrength)
            .then(async (data) => {
            downloadFileUrl = data.downloadFileUrl;
            outFilePath = data.outFilePath;
            sonicKey = data.sonicKey;
            console.log('Going to save key in db.');
            const sonicKeyDtoWithAudioData = await this.sonickeyService.autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto);
            const dataToSave = Object.assign(sonicKeyDtoWithAudioData, new sonickey_schema_1.SonicKey({
                owner: 'rmTestUser',
                sonicKey: sonicKey,
            }));
            return this.sonickeyService.sonicKeyRepository
                .put(dataToSave);
        });
    }
    decode(file) {
        return this.sonickeyService.decode(file).then(({ sonicKey }) => {
            return this.sonickeyService.findBySonicKeyOrFail(sonicKey);
        });
    }
};
__decorate([
    common_1.UseInterceptors(platform_express_1.FileInterceptor('mediaFile', {
        fileFilter: (req, file, cb) => {
            const mimetype = file.mimetype;
            if (mimetype.includes('audio')) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Unsupported file type'), false);
            }
        },
        storage: multer_1.diskStorage({
            destination: async (req, file, cb) => {
                const currentUserId = 'fromExternal';
                const imagePath = await makeDir(`${config_1.default.MULTER_DEST}/${currentUserId}`);
                await makeDir(`${config_1.default.MULTER_DEST}/${currentUserId}/encodedFiles`);
                cb(null, imagePath);
            },
            filename: (req, file, cb) => {
                const uniqueId = uniqid();
                let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
                cb(null, `${uniqueId}-${orgName}`);
            },
        }),
    })),
    common_1.Post('/encode'),
    swagger_1.ApiConsumes('multipart/form-data'),
    swagger_1.ApiOperation({ summary: 'Encode File' }),
    swagger_1.ApiBody({
        description: 'File To Encode',
        type: extencode_dto_1.ExtEncodeDto,
    }),
    openapi.ApiResponse({ status: 201, type: require("../../../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.Body('data', jsonparse_pipe_1.JsonParsePipe)),
    __param(1, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sonicKey_dto_1.SonicKeyDto, Object]),
    __metadata("design:returntype", void 0)
], ExternalSonickeyController.prototype, "encode", null);
__decorate([
    common_1.UseInterceptors(platform_express_1.FileInterceptor('mediaFile', {
        fileFilter: (req, file, cb) => {
            const mimetype = file.mimetype;
            if (mimetype.includes('audio')) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Unsupported file type'), false);
            }
        },
        storage: multer_1.diskStorage({
            destination: async (req, file, cb) => {
                const currentUserId = 'fromExternal';
                const imagePath = await makeDir(`${config_1.default.MULTER_DEST}/${currentUserId}`);
                cb(null, imagePath);
            },
            filename: (req, file, cb) => {
                const uniqueId = uniqid();
                let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
                cb(null, `${uniqueId}-${orgName}`);
            },
        }),
    })),
    swagger_1.ApiConsumes('multipart/form-data'),
    swagger_1.ApiBody({
        description: 'File To Decode',
        type: extdecode_dto_1.ExtDecodeDto,
    }),
    common_1.Post('/decode'),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    swagger_1.ApiOperation({ summary: 'Decode File' }),
    openapi.ApiResponse({ status: 201, type: require("../../../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExternalSonickeyController.prototype, "decode", null);
ExternalSonickeyController = __decorate([
    swagger_1.ApiTags('External SonicKeys Controller (Public for now, But in future will be protected by API KEY)'),
    common_1.Controller('external/sonickeys'),
    __metadata("design:paramtypes", [externalsonickey_service_1.ExternalSonickeyService,
        sonickey_service_1.SonickeyService])
], ExternalSonickeyController);
exports.ExternalSonickeyController = ExternalSonickeyController;
//# sourceMappingURL=externalsonickey.controller.js.map