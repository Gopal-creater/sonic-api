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
var RadioStationListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioStationListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const constants_1 = require("./constants");
const radiostation_schema_1 = require("../schemas/radiostation.schema");
const schedule_1 = require("@nestjs/schedule");
const app_config_1 = require("../../../config/app.config");
const fs = require("fs");
const sonickey_service_1 = require("../../sonickey/services/sonickey.service");
const children = require("child_process");
const appRootPath = require("app-root-path");
const makeDir = require("make-dir");
const uniqid = require("uniqid");
const radiostation_service_1 = require("../services/radiostation.service");
const detection_service_1 = require("../../detection/detection.service");
const Enums_1 = require("../../../constants/Enums");
const radiomonitor_service_1 = require("../../radiomonitor/radiomonitor.service");
let RadioStationListener = RadioStationListener_1 = class RadioStationListener {
    constructor(schedulerRegistry, sonickeyService, radiostationService, radioMonitorService, detectionService) {
        this.schedulerRegistry = schedulerRegistry;
        this.sonickeyService = sonickeyService;
        this.radiostationService = radiostationService;
        this.radioMonitorService = radioMonitorService;
        this.detectionService = detectionService;
        this.radioStationListenerLogger = new common_1.Logger(RadioStationListener_1.name);
        this.streamingIntervalLogger = new common_1.Logger('StreamingInterval');
    }
    async onApplicationBootstrap() {
        this.streamingIntervalLogger.debug('Called once after 0 seconds very firsttime, do restoring of listening of stream');
        if (!app_config_1.appConfig.ENABLE_STREAMING_LISTENER) {
            return;
        }
        const radioStations = await this.radiostationService.radioStationModel.find({ isStreamStarted: true });
        this.streamingIntervalLogger.debug(`${radioStations.length} number of streaming need to be restart deuto server reboot`);
        const callback = async (radioStationData) => {
            await makeDir(`${appRootPath.toString()}/storage/streaming/${radioStationData._id}`);
            const outputPath = `${appRootPath.toString()}/storage/streaming/${radioStationData._id}/${uniqid()}.wav`;
            this.startListeningLikeAStreamAndUpdateTable(radioStationData, outputPath);
        };
        radioStations.forEach(radioStation => {
            const interval = setInterval(() => callback(radioStation), app_config_1.appConfig.TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS * 1000);
            const intervalName = radioStation._id;
            this.schedulerRegistry.addInterval(intervalName, interval);
        });
    }
    handleStartListeningEvent(radioStation) {
        this.radioStationListenerLogger.log(`Start Listening Event on radioStation id ${radioStation._id}`);
        const callback = async (radioStationData) => {
            this.streamingIntervalLogger.log(`${app_config_1.appConfig.TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS}sec Interval STARTED For radio station: ${radioStationData.name} with id ${radioStationData._id} having streamingURL :${radioStationData.streamingUrl} `);
            await makeDir(`${appRootPath.toString()}/storage/streaming/${radioStation._id}`);
            const outputPath = `${appRootPath.toString()}/storage/streaming/${radioStation._id}/${uniqid()}.wav`;
            this.startListeningLikeAStreamAndUpdateTable(radioStationData, outputPath);
        };
        const interval = setInterval(() => callback(radioStation), app_config_1.appConfig.TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS * 1000);
        const intervalName = radioStation._id;
        this.schedulerRegistry.addInterval(intervalName, interval);
    }
    handleStopListeningEvent(radioStation) {
        this.radioStationListenerLogger.log(`Stop Listening Event on radioStation id ${radioStation._id}`);
        const intervalName = radioStation._id;
        const isPresentInterval = this.schedulerRegistry.doesExists('interval', intervalName);
        if (isPresentInterval) {
            this.schedulerRegistry.deleteInterval(intervalName);
        }
    }
    async startListeningLikeAStreamAndUpdateTable(radioStation, outputPath) {
        const intervalName = radioStation._id;
        try {
            var ffm = children.spawn('ffmpeg', `-i ${radioStation.streamingUrl} -y -f 16_le -ar 41000 -ac 2 -f wav -t 00:00:${app_config_1.appConfig.TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS} ${outputPath}`.split(' '), { shell: true });
            ffm.stdout.on('data', data => {
            });
            ffm.stderr.on('data', data => {
            });
            ffm.on('error', err => {
            });
            ffm.on('close', async (code) => {
                var e_1, _a;
                if (code !== 0) {
                    this.streamingIntervalLogger.log(`Error listening for stream with code ${code}-stopping listening and interval`);
                    var error = new Map();
                    error.set('message', 'Error while listening, please double check the streaming Url');
                    this.schedulerRegistry.deleteInterval(intervalName);
                    await this.radiostationService.radioStationModel.findOneAndUpdate({ _id: radioStation._id }, {
                        stopAt: new Date(),
                        isStreamStarted: false,
                        error: error,
                        isError: true,
                    }, { new: true });
                }
                else {
                    var stats = fs.statSync(outputPath);
                    var file = {
                        path: outputPath,
                        size: stats.size,
                    };
                    const { sonicKeys } = await this.sonickeyService.decodeAllKeys(file);
                    this.streamingIntervalLogger.log(`found ${sonicKeys.length} sonicKeys for radioStationName-${radioStation.name} id-${radioStation._id}`);
                    this.streamingIntervalLogger.log(`${app_config_1.appConfig.TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS}sec Interval STOPPED For radio station: ${radioStation.name} with id ${radioStation._id} having streamingURL :${radioStation.streamingUrl} `);
                    var savedKeys = [];
                    try {
                        for (var sonicKeys_1 = __asyncValues(sonicKeys), sonicKeys_1_1; sonicKeys_1_1 = await sonicKeys_1.next(), !sonicKeys_1_1.done;) {
                            const sonicKey = sonicKeys_1_1.value;
                            const isKeyPresent = await this.sonickeyService.findBySonicKey(sonicKey);
                            if (isKeyPresent) {
                                const isSubscribedForMonitor = await this.radioMonitorService.radioMonitorModel.findOne({ owner: isKeyPresent.owner, radio: radioStation._id });
                                if (!isSubscribedForMonitor)
                                    continue;
                                const newDetection = await this.detectionService.detectionModel.create({
                                    radioStation: radioStation._id,
                                    sonicKey: sonicKey,
                                    sonicKeyOwnerId: isKeyPresent.owner,
                                    sonicKeyOwnerName: isKeyPresent.contentOwner,
                                    channel: Enums_1.ChannelEnums.STREAMREADER,
                                    detectedAt: new Date(),
                                });
                                await newDetection
                                    .save()
                                    .then(() => {
                                    savedKeys.push(sonicKey);
                                })
                                    .catch(err => { });
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (sonicKeys_1_1 && !sonicKeys_1_1.done && (_a = sonicKeys_1.return)) await _a.call(sonicKeys_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (savedKeys.length > 0) {
                        this.streamingIntervalLogger.log(`Saved # of sonicKeys ${savedKeys.length} for radioStationId-${radioStation.name} id-${radioStation._id} outof ${sonicKeys.length}`);
                    }
                }
            });
        }
        catch (error) {
            this.streamingIntervalLogger.log(`error listening for stream ${error} -stopping listening and interval`);
            this.schedulerRegistry.deleteInterval(intervalName);
            this.radiostationService.radioStationModel.findOneAndUpdate({ _id: radioStation._id }, {
                stopAt: new Date(),
                isStreamStarted: false,
                error: error,
                isError: true,
            }, { new: true });
        }
    }
};
__decorate([
    event_emitter_1.OnEvent(constants_1.START_LISTENING_STREAM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [radiostation_schema_1.RadioStation]),
    __metadata("design:returntype", void 0)
], RadioStationListener.prototype, "handleStartListeningEvent", null);
__decorate([
    event_emitter_1.OnEvent(constants_1.STOP_LISTENING_STREAM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [radiostation_schema_1.RadioStation]),
    __metadata("design:returntype", void 0)
], RadioStationListener.prototype, "handleStopListeningEvent", null);
RadioStationListener = RadioStationListener_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry,
        sonickey_service_1.SonickeyService,
        radiostation_service_1.RadiostationService,
        radiomonitor_service_1.RadioMonitorService,
        detection_service_1.DetectionService])
], RadioStationListener);
exports.RadioStationListener = RadioStationListener;
//# sourceMappingURL=radiostation.listener.js.map