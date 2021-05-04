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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SonickeyService = void 0;
const file_handler_service_1 = require("../../../shared/services/file-handler.service");
const file_operation_service_1 = require("../../../shared/services/file-operation.service");
const common_1 = require("@nestjs/common");
const sonickey_schema_1 = require("../schemas/sonickey.schema");
const mm = require("music-metadata");
const upath = require("upath");
const nanoid_1 = require("nanoid");
const config_1 = require("../../../config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SonickeyService = class SonickeyService {
    constructor(sonicKeyModel, fileOperationService, fileHandlerService) {
        this.sonicKeyModel = sonicKeyModel;
        this.fileOperationService = fileOperationService;
        this.fileHandlerService = fileHandlerService;
    }
    generateUniqueSonicKey() {
        return nanoid_1.nanoid(11);
    }
    async createFromJob(createSonicKeyDto) {
        const newSonicKey = new this.sonicKeyModel(createSonicKeyDto);
        return newSonicKey.save();
    }
    async getAll(queryDto = {}) {
        var _a;
        const { _limit, _start, _sort } = queryDto, query = __rest(queryDto, ["_limit", "_start", "_sort"]);
        var sort = {};
        if (_sort) {
            var sortItems = (_sort === null || _sort === void 0 ? void 0 : _sort.split(',')) || [];
            for (let index = 0; index < sortItems.length; index++) {
                const sortItem = sortItems[index];
                var sortKeyValue = sortItem === null || sortItem === void 0 ? void 0 : sortItem.split(':');
                sort[sortKeyValue[0]] =
                    ((_a = sortKeyValue[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == 'desc' ? -1 : 1;
            }
        }
        return this.sonicKeyModel
            .find(query || {})
            .skip(_start)
            .limit(_limit)
            .sort(sort)
            .exec();
    }
    async encode(file, encodingStrength = 10) {
        const random11CharKey = this.generateUniqueSonicKey();
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
        const sonicEncodeCmd = `${config_1.appConfig.ENCODER_EXE_PATH}` + argList;
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
        });
    }
    async decode(file) {
        file.path = upath.toUnix(file.path);
        const inFilePath = file.path;
        const logFilePath = inFilePath + '.log';
        const argList = ' ' + inFilePath + ' ' + logFilePath;
        const sonicDecodeCmd = `${config_1.appConfig.DECODER_EXE_PATH}` + argList;
        return (this.fileOperationService
            .decodeFile(sonicDecodeCmd, logFilePath)
            .finally(() => {
            this.fileHandlerService.deleteFileAtPath(inFilePath);
        }));
    }
    async decodeAllKeys(file) {
        file.path = upath.toUnix(file.path);
        const inFilePath = file.path;
        const logFilePath = inFilePath + '.log';
        const argList = ' ' + inFilePath + ' ' + logFilePath;
        const sonicDecodeCmd = `${config_1.appConfig.DECODER_EXE_PATH}` + argList;
        var validkeys = ['VctJ2KQyBj1', 'nC7c3ZyOJGe', 'xIbt68PcTGF'];
        var invalidkeys = ['jdjhjdhsjdhsj', 'sdskdjksdjk', 'jdskdksdj'];
        var dummykeys = [...validkeys, ...invalidkeys];
        return Promise.resolve({
            sonicKeys: [dummykeys[Math.floor(Math.random() * dummykeys.length)]],
        }).finally(() => {
            this.fileHandlerService.deleteFileAtPath(inFilePath);
        });
    }
    async exractMusicMetaFromFile(filePath) {
        return mm.parseFile(filePath);
    }
    async autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const musicData = await this.exractMusicMetaFromFile(file.path);
        sonicKeyDto.contentSize = sonicKeyDto.contentSize || (file === null || file === void 0 ? void 0 : file.size);
        sonicKeyDto.contentFileName = sonicKeyDto.contentFileName || (file === null || file === void 0 ? void 0 : file.filename);
        sonicKeyDto.contentType = sonicKeyDto.contentType || (file === null || file === void 0 ? void 0 : file.mimetype);
        sonicKeyDto.contentFileType = sonicKeyDto.contentFileType || (file === null || file === void 0 ? void 0 : file.mimetype);
        sonicKeyDto.contentDuration =
            sonicKeyDto.contentDuration || ((_a = musicData === null || musicData === void 0 ? void 0 : musicData.format) === null || _a === void 0 ? void 0 : _a.duration);
        sonicKeyDto.contentEncoding =
            sonicKeyDto.contentEncoding ||
                `${(_b = musicData === null || musicData === void 0 ? void 0 : musicData.format) === null || _b === void 0 ? void 0 : _b.codec}, ${(_c = musicData === null || musicData === void 0 ? void 0 : musicData.format) === null || _c === void 0 ? void 0 : _c.sampleRate} Hz, ${((_d = musicData === null || musicData === void 0 ? void 0 : musicData.format) === null || _d === void 0 ? void 0 : _d.codecProfile) || 'codecProfile'}, ${(_e = musicData === null || musicData === void 0 ? void 0 : musicData.format) === null || _e === void 0 ? void 0 : _e.bitrate} ch`;
        sonicKeyDto.contentSamplingFrequency =
            sonicKeyDto.contentSamplingFrequency ||
                `${(_f = musicData === null || musicData === void 0 ? void 0 : musicData.format) === null || _f === void 0 ? void 0 : _f.sampleRate} Hz`;
        sonicKeyDto.contentName =
            sonicKeyDto.contentName || ((_g = musicData === null || musicData === void 0 ? void 0 : musicData.common) === null || _g === void 0 ? void 0 : _g.title) || '';
        sonicKeyDto.contentOwner =
            sonicKeyDto.contentOwner || ((_h = musicData === null || musicData === void 0 ? void 0 : musicData.common) === null || _h === void 0 ? void 0 : _h.artist) || '';
        return sonicKeyDto;
    }
    async findBySonicKey(sonicKey) {
        return this.sonicKeyModel.findOne({ sonicKey: sonicKey }).lean();
    }
    async findBySonicKeyOrFail(sonicKey) {
        return this.findBySonicKey(sonicKey).then(data => {
            if (!data)
                throw new common_1.NotFoundException('Not found');
            return data;
        });
    }
};
SonickeyService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(sonickey_schema_1.SonicKey.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        file_operation_service_1.FileOperationService,
        file_handler_service_1.FileHandlerService])
], SonickeyService);
exports.SonickeyService = SonickeyService;
//# sourceMappingURL=sonickey.service.js.map