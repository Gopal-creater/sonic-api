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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SonickeyService = void 0;
const file_handler_service_1 = require("./../../shared/services/file-handler.service");
const file_operation_service_1 = require("./../../shared/services/file-operation.service");
const sonickey_repository_1 = require("./../../repositories/sonickey.repository");
const common_1 = require("@nestjs/common");
const sonickey_schema_1 = require("../../schemas/sonickey.schema");
const mm = require("music-metadata");
const config_1 = require("../../config");
const upath = require("upath");
const nanoid_1 = require("nanoid");
let SonickeyService = class SonickeyService {
    constructor(sonicKeyRepository, fileOperationService, fileHandlerService) {
        this.sonicKeyRepository = sonicKeyRepository;
        this.fileOperationService = fileOperationService;
        this.fileHandlerService = fileHandlerService;
    }
    async getAll() {
        var e_1, _a;
        const items = [];
        try {
            for (var _b = __asyncValues(this.sonicKeyRepository.scan(sonickey_schema_1.SonicKey)), _c; _c = await _b.next(), !_c.done;) {
                const item = _c.value;
                items.push(item);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return items;
    }
    async getAllWithFilter(queryParams) {
        var e_2, _a;
        const items = [];
        try {
            for (var _b = __asyncValues(this.sonicKeyRepository.query(sonickey_schema_1.SonicKey, queryParams)), _c; _c = await _b.next(), !_c.done;) {
                const item = _c.value;
                items.push(item);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return items;
    }
    async encode(file, encodingStrength = 10) {
        const random11CharKey = nanoid_1.nanoid(11);
        file.path = upath.toUnix(file.path);
        file.destination = upath.toUnix(file.destination);
        const inFilePath = file.path;
        const outFilePath = file.destination + '/' + 'encodedFiles' + '/' + file.filename;
        const argList = ' -h ' +
            encodingStrength +
            ' ' +
            inFilePath +
            ' ' +
            outFilePath +
            ' ' +
            random11CharKey;
        const sonicEncodeCmd = `${config_1.default.ENCODER_EXE_PATH}` + argList;
        return Promise.resolve({
            downloadFileUrl: inFilePath,
            outFilePath: inFilePath,
            sonicKey: random11CharKey
        });
        return this.fileOperationService
            .encodeFile(sonicEncodeCmd, outFilePath)
            .then(async () => {
            return {
                downloadFileUrl: `storage/${outFilePath.split('storage/').pop()}`,
                outFilePath: outFilePath,
                sonicKey: random11CharKey,
            };
        })
            .finally(() => {
            this.fileHandlerService.deleteFileAtPath(inFilePath);
        });
    }
    async decode(file) {
        console.log('file to decode', file);
        file.path = upath.toUnix(file.path);
        const inFilePath = file.path;
        const logFilePath = inFilePath + '.log';
        const argList = ' ' + inFilePath + ' ' + logFilePath;
        const sonicDecodeCmd = `${config_1.default.DECODER_EXE_PATH}` + argList;
        return (this.fileOperationService
            .decodeFile(sonicDecodeCmd, logFilePath)
            .finally(() => {
        }));
    }
    async search() {
        var e_3, _a;
        var items = [];
        try {
            for (var _b = __asyncValues(this.sonicKeyRepository.query(sonickey_schema_1.SonicKey, { "sonicKey.sonicContent.volatileMetadata.contentOwner": "Arba" })), _c; _c = await _b.next(), !_c.done;) {
                const item = _c.value;
                items.push(item);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return items[0];
    }
    async exractMusicMetaFromFile(filePath) {
        return mm.parseFile(filePath);
    }
    async autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto) {
        const musicData = await this.exractMusicMetaFromFile(file.path);
        sonicKeyDto.contentDuration = musicData.format.duration;
        sonicKeyDto.contentEncoding = `${musicData.format.codec}, ${musicData.format.sampleRate} Hz, ${musicData.format.codecProfile}, ${musicData.format.bitrate} ch`;
        sonicKeyDto.contentSamplingFrequency = `${musicData.format.sampleRate} Hz`;
        sonicKeyDto.contentName = musicData.common.title || "";
        sonicKeyDto.contentOwner = musicData.common.artist || "";
        sonicKeyDto.contentDescription = musicData.common.description ? musicData.common.description[0] : "";
        return sonicKeyDto;
    }
    async findBySonicKey(sonicKey) {
        var e_4, _a;
        var items = [];
        try {
            for (var _b = __asyncValues(this.sonicKeyRepository.query(sonickey_schema_1.SonicKey, { sonicKey: sonicKey })), _c; _c = await _b.next(), !_c.done;) {
                const item = _c.value;
                items.push(item);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return items[0];
    }
    async findByOwner(owner) {
        var e_5, _a;
        var items = [];
        try {
            for (var _b = __asyncValues(this.sonicKeyRepository.query(sonickey_schema_1.SonicKey, { owner: owner }, { indexName: 'ownerIndex' })), _c; _c = await _b.next(), !_c.done;) {
                const item = _c.value;
                items.push(item);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return items;
    }
    async findBySonicKeyOrFail(sonicKey) {
        return this.findBySonicKey(sonicKey).then(data => {
            if (!data)
                throw new common_1.NotFoundException('key not found');
            return data;
        });
    }
};
SonickeyService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [sonickey_repository_1.SonicKeyRepository,
        file_operation_service_1.FileOperationService,
        file_handler_service_1.FileHandlerService])
], SonickeyService);
exports.SonickeyService = SonickeyService;
//# sourceMappingURL=sonickey.service.js.map