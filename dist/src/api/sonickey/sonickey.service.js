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
const file_handler_service_1 = require("./../../shared/services/file-handler.service");
const file_operation_service_1 = require("./../../shared/services/file-operation.service");
const common_1 = require("@nestjs/common");
const sonickey_schema_1 = require("../../schemas/sonickey.schema");
const mm = require("music-metadata");
const upath = require("upath");
const nanoid_1 = require("nanoid");
const config_1 = require("../../config");
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
        const dataToSave = Object.assign(new sonickey_schema_1.SonicKey(), createSonicKeyDto);
        const newSonicKey = new this.sonicKeyModel(dataToSave);
        return newSonicKey.save();
    }
    async getAll(queryDto = {}) {
        const { limit, offset } = queryDto, query = __rest(queryDto, ["limit", "offset"]);
        const options = {
            limit,
            offset
        };
        return this.sonicKeyModel
            .find(query || {})
            .skip(offset)
            .limit(limit)
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
        console.log('file to decode', file);
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
        console.log('file', file);
        file.path = upath.toUnix(file.path);
        const inFilePath = file.path;
        const logFilePath = inFilePath + '.log';
        const argList = ' ' + inFilePath + ' ' + logFilePath;
        const sonicDecodeCmd = `${config_1.appConfig.DECODER_EXE_PATH}` + argList;
        console.log('sonicDecodeCmd: ', sonicDecodeCmd);
        return this.fileOperationService
            .decodeFileForMultipleKeys(sonicDecodeCmd, logFilePath)
            .finally(() => {
            this.fileHandlerService.deleteFileAtPath(inFilePath);
        });
    }
    async exractMusicMetaFromFile(filePath) {
        return mm.parseFile(filePath);
    }
    async autoPopulateSonicContentWithMusicMetaForFile(file, sonicKeyDto) {
        const musicData = await this.exractMusicMetaFromFile(file.path);
        sonicKeyDto.contentSize = file.size;
        sonicKeyDto.contentFileName = file.filename;
        sonicKeyDto.contentType = file.mimetype;
        sonicKeyDto.contentFileType = file.mimetype;
        sonicKeyDto.contentDuration = musicData.format.duration;
        sonicKeyDto.contentEncoding = `${musicData.format.codec}, ${musicData.format.sampleRate} Hz, ${musicData.format.codecProfile}, ${musicData.format.bitrate} ch`;
        sonicKeyDto.contentSamplingFrequency = `${musicData.format.sampleRate} Hz`;
        sonicKeyDto.contentName =
            sonicKeyDto.contentName || musicData.common.title || '';
        sonicKeyDto.contentOwner =
            sonicKeyDto.contentOwner || musicData.common.artist || '';
        sonicKeyDto.contentDescription = musicData.common.description
            ? musicData.common.description[0]
            : '';
        return sonicKeyDto;
    }
    async findBySonicKey(sonicKey) {
        return this.sonicKeyModel.findOne({ sonicKey: sonicKey });
    }
    async findByOwner(owner, queryDto = {}) {
        const { limit, offset } = queryDto, query = __rest(queryDto, ["limit", "offset"]);
        const options = {
            limit,
            offset
        };
        return this.sonicKeyModel
            .find(Object.assign({ owner: owner }, query))
            .skip(offset)
            .limit(limit)
            .exec();
    }
    async findByJob(job, queryDto = {}) {
        const { limit, offset } = queryDto, query = __rest(queryDto, ["limit", "offset"]);
        const options = {
            limit,
            offset
        };
        return this.sonicKeyModel
            .find(Object.assign({ job: job }, query))
            .skip(offset)
            .limit(limit)
            .exec();
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