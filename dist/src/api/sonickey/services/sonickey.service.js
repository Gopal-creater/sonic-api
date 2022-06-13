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
const axios_1 = require("axios");
const makeDir = require("make-dir");
const Enums_1 = require("../../../constants/Enums");
const s3fileupload_service_1 = require("../../s3fileupload/s3fileupload.service");
const detection_service_1 = require("../../detection/detection.service");
const detection_schema_1 = require("../../detection/schemas/detection.schema");
const user_service_1 = require("../../user/services/user.service");
const licensekey_service_1 = require("../../licensekey/services/licensekey.service");
const bull_1 = require("@nestjs/bull");
const path = require("path");
const config_2 = require("@nestjs/config");
const queuejob_service_1 = require("../../../queuejob/queuejob.service");
const track_service_1 = require("../../track/track.service");
const track_schema_1 = require("../../track/schemas/track.schema");
let SonickeyService = class SonickeyService {
    constructor(sonicKeyModel, fileOperationService, licensekeyService, sonicKeyQueue, fileHandlerService, s3FileUploadService, configService, detectionService, userService, queuejobService, trackService) {
        this.sonicKeyModel = sonicKeyModel;
        this.fileOperationService = fileOperationService;
        this.licensekeyService = licensekeyService;
        this.sonicKeyQueue = sonicKeyQueue;
        this.fileHandlerService = fileHandlerService;
        this.s3FileUploadService = s3FileUploadService;
        this.configService = configService;
        this.detectionService = detectionService;
        this.userService = userService;
        this.queuejobService = queuejobService;
        this.trackService = trackService;
        console.log(`FingerPrint BASE URL: ${this.configService.get('FINGERPRINT_SERVER.baseUrl')}`);
    }
    generateUniqueSonicKey() {
        return nanoid_1.nanoid(11);
    }
    async testUploadFromPath() {
        const filePath = `${config_1.appConfig.MULTER_DEST}/guest/4fqq9xz8ckosgjzea-SonicTest_Detect.wav`;
        const result = await this.s3FileUploadService.uploadFromPath(filePath, 'userId1234345/encodedFiles', Enums_1.S3ACL.PRIVATE);
        return {
            msg: 'uploaded',
            result: result,
        };
    }
    async encodeBulkWithQueue(owner, company, license, encodeFromQueueDto) {
        var e_1, _a;
        var { fileSpecs } = encodeFromQueueDto;
        const addedJobsDetails = [];
        const jobsToInsertIntoDb = [];
        const failedData = [];
        try {
            for (var fileSpecs_1 = __asyncValues(fileSpecs), fileSpecs_1_1; fileSpecs_1_1 = await fileSpecs_1.next(), !fileSpecs_1_1.done;) {
                var fileSpec = fileSpecs_1_1.value;
                const jobId = `${owner}_${fileSpec.filePath}`;
                const isAlreadyDone = await this.findByQueueJobId(jobId);
                if (isAlreadyDone) {
                    fileSpec['message'] = 'File already encoded, duplicate file';
                    failedData.push(fileSpec);
                    continue;
                }
                const absoluteFilePath = path.join(config_1.appConfig.ROOT_RSYNC_UPLOADS, company, fileSpec.filePath);
                const [fileDetailsFromFilePath, error,] = await this.fileHandlerService.getFileDetailsFromFile(absoluteFilePath);
                if (error) {
                    fileSpec['message'] = 'Can not resolve file, possibly file not found';
                    fileSpec['error'] = error;
                    failedData.push(fileSpec);
                }
                else {
                    const jobData = {
                        file: fileDetailsFromFilePath,
                        metaData: fileSpec.metaData,
                        owner: owner,
                        company: company,
                        licenseId: license,
                    };
                    const jobInfo = {
                        name: 'bulk_encode',
                        data: jobData,
                        opts: { delay: 10000, jobId: jobId },
                    };
                    const jobToDb = {
                        _id: jobId,
                        name: 'bulk_encode',
                        jobData: jobData,
                        company: company,
                    };
                    jobsToInsertIntoDb.push(jobToDb);
                    addedJobsDetails.push(jobInfo);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (fileSpecs_1_1 && !fileSpecs_1_1.done && (_a = fileSpecs_1.return)) await _a.call(fileSpecs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        await this.queuejobService.queueJobModel
            .insertMany(jobsToInsertIntoDb)
            .catch(err => {
            throw new common_1.UnprocessableEntityException("Can't save queue job details to db");
        });
        const addedJobsQueueResponse = await this.sonicKeyQueue.addBulk(addedJobsDetails);
        return {
            addedJobsQueueResponse: addedJobsQueueResponse,
            failedData: failedData,
        };
    }
    async getJobStatus(jobId) {
        return this.sonicKeyQueue.getJob(jobId);
    }
    async testDownloadFile() {
        const key = 'userId1234345/encodedFiles/4fqq9xz8ckosgjzea-SonicTest_Detect.wav';
        return this.s3FileUploadService.getSignedUrl(key);
    }
    async createFromJob(createSonicKeyDto) {
        const channel = Enums_1.ChannelEnums.PCAPP;
        const userGroups = await this.userService.adminListGroupsForUser(createSonicKeyDto.owner);
        const newSonicKey = new this.sonicKeyModel(Object.assign(Object.assign({}, createSonicKeyDto), { license: createSonicKeyDto.licenseId || createSonicKeyDto.license, channel: channel, groups: userGroups.groupNames, _id: createSonicKeyDto.sonicKey }));
        return newSonicKey.save();
    }
    async createFromBinaryForUser(ownerId, sonickey) {
        const newSonicKey = new this.sonicKeyModel(Object.assign(Object.assign({}, sonickey), { owner: ownerId }));
        return newSonicKey.save();
    }
    async saveSonicKeyForUser(ownerId, sonickey) {
        const newSonicKey = new this.sonicKeyModel(Object.assign(Object.assign({}, sonickey), { owner: ownerId }));
        return newSonicKey.save();
    }
    async getAll(queryDto) {
        const { limit, skip, sort, page, filter, select, populate, relationalFilter, } = queryDto;
        var paginateOptions = {};
        paginateOptions['sort'] = sort;
        paginateOptions['select'] = select;
        paginateOptions['populate'] = populate;
        paginateOptions['offset'] = skip;
        paginateOptions['page'] = page;
        paginateOptions['limit'] = limit;
        const aggregate = this.sonicKeyModel.aggregate([
            {
                $match: Object.assign({}, filter),
            },
            {
                $sort: Object.assign({ createdAt: -1 }, sort),
            },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                },
            },
            { $addFields: { company: { $first: '$company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'partner',
                    foreignField: '_id',
                    as: 'partner',
                },
            },
            { $addFields: { partner: { $first: '$partner' } } },
            {
                $lookup: {
                    from: 'User',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                },
            },
            { $addFields: { owner: { $first: '$owner' } } },
            {
                $match: Object.assign({}, relationalFilter),
            },
        ]);
        return this.sonicKeyModel['aggregatePaginate'](aggregate, paginateOptions);
    }
    async findOneAggregate(queryDto) {
        const { limit, skip, sort, page, filter, select, populate, relationalFilter, } = queryDto;
        var paginateOptions = {};
        paginateOptions['sort'] = sort;
        paginateOptions['select'] = select;
        paginateOptions['populate'] = populate;
        paginateOptions['offset'] = skip;
        paginateOptions['page'] = page;
        paginateOptions['limit'] = limit;
        const aggregate = this.sonicKeyModel.aggregate([
            {
                $match: Object.assign({}, filter),
            },
            {
                $sort: Object.assign({ createdAt: -1 }, sort),
            },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                },
            },
            { $addFields: { company: { $first: '$company' } } },
            {
                $lookup: {
                    from: 'Partner',
                    localField: 'partner',
                    foreignField: '_id',
                    as: 'partner',
                },
            },
            { $addFields: { partner: { $first: '$partner' } } },
            {
                $lookup: {
                    from: 'User',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
                },
            },
            { $addFields: { owner: { $first: '$owner' } } },
            {
                $match: Object.assign({}, relationalFilter),
            },
            {
                $limit: 1
            }
        ]);
        const datas = await this.sonicKeyModel['aggregatePaginate'](aggregate, paginateOptions);
        return datas[0];
    }
    async getCount(queryDto) {
        const { filter, includeGroupData } = queryDto;
        return this.sonicKeyModel.find(filter || {}).count();
    }
    async getEstimateCount() {
        return this.sonicKeyModel.estimatedDocumentCount();
    }
    async encode(file, encodingStrength = 15) {
        const random11CharKey = this.generateUniqueSonicKey();
        file.path = upath.toUnix(file.path);
        file.destination = upath.toUnix(file.destination);
        const inFilePath = file.path;
        await makeDir(`${file.destination}/encodedFiles`);
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
            this.fileHandlerService.deleteFileAtPath(inFilePath);
        });
    }
    async encodeAndUploadToS3(file, user, encodingStrength = 15, s3Acl, fingerPrint = true) {
        const random11CharKey = this.generateUniqueSonicKey();
        file.path = upath.toUnix(file.path);
        file.destination = upath.toUnix(file.destination);
        const inFilePath = file.path;
        await makeDir(`${file.destination}/encodedFiles`);
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
            .then(() => {
            const encodedFileUploadToS3 = this.s3FileUploadService
                .uploadFromPath(outFilePath, `${user}/encodedFiles`, s3Acl)
                .then(data => Promise.resolve(data))
                .catch(error => Promise.resolve(error));
            const originalFileUploadToS3 = this.s3FileUploadService
                .uploadFromPath(inFilePath, `${user}/originalFiles`, s3Acl)
                .then(data => Promise.resolve(data))
                .catch(error => Promise.resolve(error));
            return Promise.all([encodedFileUploadToS3, originalFileUploadToS3]);
        })
            .then(async ([s3EncodedUploadResult, s3OriginalUploadResult]) => {
            var resultObj = {
                downloadFileUrl: s3EncodedUploadResult.Location,
                s3UploadResult: s3EncodedUploadResult,
                s3OriginalFileUploadResult: s3OriginalUploadResult,
                sonicKey: random11CharKey,
                fingerPrintMetaData: null,
                fingerPrintErrorData: null,
                fingerPrintStatus: Enums_1.FingerPrintStatus.PENDING,
            };
            const fingerPrintMetaData = await this.fingerPrintRequestToFPServer(resultObj.s3OriginalFileUploadResult, random11CharKey, file.originalname, file.size)
                .then(data => {
                resultObj.fingerPrintStatus = Enums_1.FingerPrintStatus.PROCESSING;
                return Promise.resolve(null);
            })
                .catch(err => {
                var _a;
                console.log('err', err);
                resultObj.fingerPrintStatus = Enums_1.FingerPrintStatus.FAILED;
                resultObj.fingerPrintErrorData = {
                    message: err === null || err === void 0 ? void 0 : err.message,
                    data: (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data,
                };
                return Promise.resolve(null);
            });
            resultObj.fingerPrintMetaData = fingerPrintMetaData;
            return resultObj;
        })
            .finally(() => {
            this.fileHandlerService.deleteFileAtPath(outFilePath);
        });
    }
    async encodeAndUpload(file, s3destinationFolder, doc, encodingStrength = 15, s3Acl, fingerPrint = true) {
        const random11CharKey = this.generateUniqueSonicKey();
        file.path = upath.toUnix(file.path);
        file.destination = upath.toUnix(file.destination);
        const inFilePath = file.path;
        await makeDir(`${file.destination}/encodedFiles`);
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
            .then(() => {
            const encodedFileUploadToS3 = this.s3FileUploadService
                .uploadFromPath(outFilePath, `${s3destinationFolder}/encodedFiles`, s3Acl)
                .then(data => Promise.resolve(data))
                .catch(error => Promise.resolve(error));
            return Promise.all([encodedFileUploadToS3]);
        })
            .then(async ([s3EncodedUploadResult]) => {
            const sonicKeyDtoWithAudioData = await this.autoPopulateSonicContentWithMusicMetaForFile(file, doc);
            const newSonicKey = Object.assign(Object.assign({}, sonicKeyDtoWithAudioData), { contentFilePath: s3EncodedUploadResult.Location, originalFileName: file === null || file === void 0 ? void 0 : file.originalname, sonicKey: random11CharKey, downloadable: true, s3FileMeta: s3EncodedUploadResult, fingerPrintStatus: Enums_1.FingerPrintStatus.PENDING, _id: random11CharKey });
            return;
        })
            .finally(() => {
            this.fileHandlerService.deleteFileAtPath(inFilePath);
            this.fileHandlerService.deleteFileAtPath(outFilePath);
        });
    }
    async encodeSonicKeyFromFile(config) {
        const { file, licenseId, s3destinationFolder, sonickeyDoc, encodingStrength = 15, s3Acl, fingerPrint = true, } = config;
        const { owner, partner, company } = sonickeyDoc;
        const trackDoc = {
            channel: sonickeyDoc.channel,
            artist: sonickeyDoc.contentOwner,
            title: sonickeyDoc.contentName,
            fileType: sonickeyDoc.contentFileType,
            trackMetaData: sonickeyDoc,
            owner,
            partner,
            company,
            createdBy: sonickeyDoc.createdBy,
        };
        console.log('Saving Track');
        const track = await this.trackService.uploadAndCreate(file, trackDoc, s3destinationFolder);
        console.log('Track Saved');
        console.log('Encoding....');
        const { outFilePath, sonicKey } = await this.encode(file, encodingStrength);
        console.log('Encoding Done');
        console.log('Uploading encoded file to s3');
        const s3EncodedUploadResult = await this.s3FileUploadService.uploadFromPath(outFilePath, `${s3destinationFolder}/encodedFiles`, s3Acl)
            .finally(() => {
            this.fileHandlerService.deleteFileAtPath(outFilePath);
        });
        console.log('Uploading encoded file to s3 Done');
        const newSonicKey = Object.assign(Object.assign({}, sonickeyDoc), { contentFilePath: s3EncodedUploadResult.Location, originalFileName: file === null || file === void 0 ? void 0 : file.originalname, sonicKey: sonicKey, downloadable: true, license: licenseId, channel: sonickeyDoc.channel || Enums_1.ChannelEnums.PORTAL, track: track === null || track === void 0 ? void 0 : track._id, s3FileMeta: s3EncodedUploadResult, fingerPrintStatus: Enums_1.FingerPrintStatus.PENDING, _id: sonicKey });
        if (fingerPrint) {
            await this.fingerPrintRequestToFPServer(track.s3OriginalFileMeta, sonicKey, file.originalname, file.size).then(data => {
                newSonicKey.fingerPrintStatus = Enums_1.FingerPrintStatus.PROCESSING;
            })
                .catch(err => {
                var _a;
                newSonicKey.fingerPrintStatus = Enums_1.FingerPrintStatus.FAILED;
                newSonicKey.fingerPrintErrorData = {
                    message: err === null || err === void 0 ? void 0 : err.message,
                    data: (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data,
                };
            });
        }
        console.log('Going to save key in db.');
        const savedSonnicKey = await this.create(newSonicKey);
        console.log('Sonickey saved.');
        console.log('Increment License Usages upon successfull encode & save');
        await this.licensekeyService.incrementUses(licenseId, 'encode', 1);
        console.log('Increment License Usages upon successfull encode & save Done');
        return this.findById(savedSonnicKey._id);
    }
    async encodeSonicKeyFromTrack(config) {
        const { trackId, file, licenseId, s3destinationFolder, sonickeyDoc, encodingStrength = 15, s3Acl, fingerPrint = true, } = config;
        console.log('Fetching Track');
        const track = await this.trackService.findById(trackId);
        console.log('Track Fetched');
        console.log('Encoding....');
        const { outFilePath, sonicKey } = await this.encode(file, encodingStrength);
        console.log('Encoding Done');
        console.log('Uploading encoded file to s3');
        const s3EncodedUploadResult = await this.s3FileUploadService.uploadFromPath(outFilePath, `${s3destinationFolder}/encodedFiles`, s3Acl)
            .finally(() => {
            this.fileHandlerService.deleteFileAtPath(outFilePath);
        });
        console.log('Uploading encoded file to s3 Done');
        const newSonicKey = Object.assign(Object.assign({}, sonickeyDoc), { contentFilePath: s3EncodedUploadResult.Location, originalFileName: track === null || track === void 0 ? void 0 : track.originalFileName, sonicKey: sonicKey, downloadable: true, license: licenseId, channel: sonickeyDoc.channel || Enums_1.ChannelEnums.PORTAL, track: track === null || track === void 0 ? void 0 : track._id, s3FileMeta: s3EncodedUploadResult, fingerPrintStatus: Enums_1.FingerPrintStatus.PENDING, _id: sonicKey });
        if (fingerPrint) {
            await this.fingerPrintRequestToFPServer(track.s3OriginalFileMeta, sonicKey, file.originalname, file.size).then(data => {
                newSonicKey.fingerPrintStatus = Enums_1.FingerPrintStatus.PROCESSING;
            })
                .catch(err => {
                var _a;
                newSonicKey.fingerPrintStatus = Enums_1.FingerPrintStatus.FAILED;
                newSonicKey.fingerPrintErrorData = {
                    message: err === null || err === void 0 ? void 0 : err.message,
                    data: (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data,
                };
            });
        }
        console.log('Going to save key in db.');
        const savedSonnicKey = await this.create(newSonicKey);
        console.log('Sonickey saved.');
        console.log('Increment License Usages upon successfull encode & save');
        await this.licensekeyService.incrementUses(licenseId, 'encode', 1);
        console.log('Increment License Usages upon successfull encode & save Done');
        return this.findById(savedSonnicKey._id);
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
    async fingerPrintRequestToFPServer(originalFileS3Meta, sonicKey, originalFileName, fileSize) {
        const fingerPrintUrl = this.configService.get('FINGERPRINT_SERVER.fingerPrintUrl');
        const signedS3UrlToOriginalFile = await this.s3FileUploadService.getSignedUrl(originalFileS3Meta.Key, 60 * 10);
        return axios_1.default
            .post(fingerPrintUrl, {
            s3FileUrl: signedS3UrlToOriginalFile,
            sonicKey: sonicKey,
            originalFileName: originalFileName,
            fileSize: fileSize,
        })
            .then(res => {
            return res.data;
        });
    }
    async findAndGetValidSonicKeyFromRandomDecodedKeys(keys, saveDetection, detectionToSave) {
        var e_2, _a;
        var sonicKeys = [];
        try {
            for (var keys_1 = __asyncValues(keys), keys_1_1; keys_1_1 = await keys_1.next(), !keys_1_1.done;) {
                const key = keys_1_1.value;
                const sonickey = await this.findBySonicKey(key);
                if (!sonickey) {
                    continue;
                }
                if (saveDetection) {
                    const newDetection = await this.detectionService.detectionModel.create(detectionToSave);
                    await newDetection.save();
                }
                sonicKeys.push(sonickey);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) await _a.call(keys_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return sonicKeys;
    }
    async decodeAllKeys(file) {
        file.path = upath.toUnix(file.path);
        const inFilePath = file.path;
        const logFilePath = inFilePath + '.log';
        const argList = ' ' + inFilePath + ' ' + logFilePath;
        const sonicDecodeCmd = `${config_1.appConfig.DECODER_EXE_PATH}` + argList;
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
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const musicData = await this.exractMusicMetaFromFile(file.path);
        sonicKeyDto.contentSize = sonicKeyDto.contentSize || (file === null || file === void 0 ? void 0 : file.size);
        sonicKeyDto.contentFileName =
            sonicKeyDto.contentFileName || (file === null || file === void 0 ? void 0 : file.originalname);
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
    async findByQueueJobId(queueJobId) {
        return this.sonicKeyModel.findOne({ queueJobId: queueJobId }).lean();
    }
    findById(id) {
        return this.sonicKeyModel.findById(id);
    }
    async create(doc) {
        const newSonicKey = await this.sonicKeyModel.create(doc);
        return newSonicKey.save();
    }
    update(id, updateSonicKeyDto) {
        return this.sonicKeyModel.findByIdAndUpdate(id, updateSonicKeyDto, {
            new: true,
        });
    }
    findOne(filter) {
        return this.sonicKeyModel.findOne(filter).lean();
    }
    async removeById(id) {
        return this.sonicKeyModel.findByIdAndRemove(id);
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
    __param(3, bull_1.InjectQueue('sonickey')),
    __param(8, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        file_operation_service_1.FileOperationService,
        licensekey_service_1.LicensekeyService, Object, file_handler_service_1.FileHandlerService,
        s3fileupload_service_1.S3FileUploadService,
        config_2.ConfigService,
        detection_service_1.DetectionService,
        user_service_1.UserService,
        queuejob_service_1.QueuejobService,
        track_service_1.TrackService])
], SonickeyService);
exports.SonickeyService = SonickeyService;
//# sourceMappingURL=sonickey.service.js.map