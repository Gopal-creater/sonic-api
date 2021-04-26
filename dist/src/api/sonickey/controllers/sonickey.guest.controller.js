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
exports.SonickeyGuestController = void 0;
const openapi = require("@nestjs/swagger");
const sonicKey_dto_1 = require("../dtos/sonicKey.dto");
const jsonparse_pipe_1 = require("../../../shared/pipes/jsonparse.pipe");
const common_1 = require("@nestjs/common");
const sonickey_service_1 = require("../services/sonickey.service");
const platform_express_1 = require("@nestjs/platform-express");
const makeDir = require("make-dir");
const multer_1 = require("multer");
const config_1 = require("../../../config");
const swagger_1 = require("@nestjs/swagger");
const uniqid = require("uniqid");
const file_handler_service_1 = require("../../../shared/services/file-handler.service");
const public_encode_dto_1 = require("../dtos/public-encode.dto");
const public_decode_dto_1 = require("../dtos/public-decode.dto");
let SonickeyGuestController = class SonickeyGuestController {
    constructor(sonicKeyService, fileHandlerService) {
        this.sonicKeyService = sonicKeyService;
        this.fileHandlerService = fileHandlerService;
    }
    encode(sonicKeyDto, file, req) {
        console.log('file', file);
        const owner = 'guest';
        const licenseId = "guest_license";
        return this.sonicKeyService
            .encode(file, sonicKeyDto.encodingStrength)
            .then(data => {
            const newSonicKey = new this.sonicKeyService.sonicKeyModel(Object.assign(Object.assign({}, sonicKeyDto), { contentFilePath: data.downloadFileUrl, owner: owner, sonicKey: data.sonicKey, licenseId: licenseId }));
            return newSonicKey.save().finally(() => {
                this.fileHandlerService.deleteFileAtPath(file.path);
            });
        });
    }
    async decode(file) {
        return this.sonicKeyService
            .decodeAllKeys(file)
            .then(async ({ sonicKeys }) => {
            var e_1, _a;
            console.log('Detected keys from Decode', sonicKeys);
            var sonicKeysMetadata = [];
            try {
                for (var sonicKeys_1 = __asyncValues(sonicKeys), sonicKeys_1_1; sonicKeys_1_1 = await sonicKeys_1.next(), !sonicKeys_1_1.done;) {
                    const sonicKey = sonicKeys_1_1.value;
                    const metadata = await this.sonicKeyService.findBySonicKey(sonicKey);
                    if (!metadata) {
                        continue;
                    }
                    sonicKeysMetadata.push(metadata);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (sonicKeys_1_1 && !sonicKeys_1_1.done && (_a = sonicKeys_1.return)) await _a.call(sonicKeys_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return sonicKeysMetadata;
        });
    }
};
__decorate([
    common_1.UseInterceptors(platform_express_1.FileInterceptor('mediaFile', {
        storage: multer_1.diskStorage({
            destination: async (req, file, cb) => {
                const currentUserId = 'guest';
                const imagePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/${currentUserId}`);
                await makeDir(`${config_1.appConfig.MULTER_DEST}/${currentUserId}/encodedFiles`);
                cb(null, imagePath);
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
        type: public_encode_dto_1.PublicEncodeDto,
    }),
    common_1.Post('/encode'),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Encode File And save to database' }),
    openapi.ApiResponse({ status: 201, type: require("../../../schemas/sonickey.schema").SonicKey }),
    __param(0, common_1.Body('sonickey', jsonparse_pipe_1.JsonParsePipe)),
    __param(1, common_1.UploadedFile()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sonicKey_dto_1.SonicKeyDto, Object, Object]),
    __metadata("design:returntype", void 0)
], SonickeyGuestController.prototype, "encode", null);
__decorate([
    common_1.UseInterceptors(platform_express_1.FileInterceptor('mediaFile', {
        storage: multer_1.diskStorage({
            destination: async (req, file, cb) => {
                const currentUserId = 'guest';
                const imagePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/${currentUserId}`);
                cb(null, imagePath);
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
        description: 'File To Decode',
        type: public_decode_dto_1.PublicDecodeDto,
    }),
    common_1.Post('/decode'),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    swagger_1.ApiOperation({ summary: 'Decode File and retrive key information' }),
    openapi.ApiResponse({ status: 201, type: [require("../../../schemas/sonickey.schema").SonicKey] }),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SonickeyGuestController.prototype, "decode", null);
SonickeyGuestController = __decorate([
    swagger_1.ApiTags('Public Controller'),
    common_1.Controller('sonic-keys-guest'),
    __metadata("design:paramtypes", [sonickey_service_1.SonickeyService,
        file_handler_service_1.FileHandlerService])
], SonickeyGuestController);
exports.SonickeyGuestController = SonickeyGuestController;
//# sourceMappingURL=sonickey.guest.controller.js.map