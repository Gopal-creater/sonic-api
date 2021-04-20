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
exports.ExternalSonickeyController = void 0;
const openapi = require("@nestjs/swagger");
const sonickey_service_1 = require("../../sonickey/sonickey.service");
const extdecode_dto_1 = require("./dtos/extdecode.dto");
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
    async decode(file) {
        return this.sonickeyService.decodeAllKeys(file).then(async ({ sonicKeys }) => {
            var e_1, _a;
            console.log("Detected keys from Decode", sonicKeys);
            var sonicKeysMetadata = [];
            try {
                for (var sonicKeys_1 = __asyncValues(sonicKeys), sonicKeys_1_1; sonicKeys_1_1 = await sonicKeys_1.next(), !sonicKeys_1_1.done;) {
                    const sonicKey = sonicKeys_1_1.value;
                    const metadata = await this.sonickeyService.findBySonicKey(sonicKey);
                    console.log("metadata", metadata);
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
                const imagePath = await makeDir(`${config_1.appConfig.MULTER_DEST}/${currentUserId}`);
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
    openapi.ApiResponse({ status: 201, type: [require("../../../schemas/sonickey.schema").SonicKey] }),
    __param(0, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSonickeyController.prototype, "decode", null);
ExternalSonickeyController = __decorate([
    swagger_1.ApiTags('External SonicKeys Controller (Public for now, But in future will be protected by API KEY)'),
    common_1.Controller('external/sonickeys'),
    __metadata("design:paramtypes", [externalsonickey_service_1.ExternalSonickeyService,
        sonickey_service_1.SonickeyService])
], ExternalSonickeyController);
exports.ExternalSonickeyController = ExternalSonickeyController;
//# sourceMappingURL=externalsonickey.controller.js.map