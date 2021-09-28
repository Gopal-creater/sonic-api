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
exports.RadiostationService = void 0;
const common_1 = require("@nestjs/common");
const radiostation_schema_1 = require("../schemas/radiostation.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const sonickey_service_1 = require("../../sonickey/services/sonickey.service");
const constants_1 = require("../listeners/constants");
const fs = require("fs");
let RadiostationService = class RadiostationService {
    constructor(radioStationModel, sonickeyService, eventEmitter) {
        this.radioStationModel = radioStationModel;
        this.sonickeyService = sonickeyService;
        this.eventEmitter = eventEmitter;
    }
    create(createRadiostationDto, additionalAttribute) {
        const newRadioStation = new this.radioStationModel(Object.assign(Object.assign({}, createRadiostationDto), additionalAttribute));
        return newRadioStation.save();
    }
    async stopListeningStream(id) {
        const radioStation = await this.radioStationModel.findById(id);
        if (!radioStation) {
            return Promise.reject({
                notFound: true,
                status: 404,
                message: 'Item not found',
            });
        }
        if (!radioStation.isStreamStarted) {
            return radioStation;
        }
        this.eventEmitter.emit(constants_1.STOP_LISTENING_STREAM, radioStation);
        return this.radioStationModel.findOneAndUpdate({ _id: id }, {
            stopAt: new Date(),
            isStreamStarted: false,
        }, { new: true });
    }
    async startListeningStream(id) {
        const radioStation = await this.radioStationModel.findById(id);
        if (!radioStation) {
            return Promise.reject({
                notFound: true,
                status: 404,
                message: 'Item not found',
            });
        }
        if (radioStation.isStreamStarted) {
            return radioStation;
        }
        this.eventEmitter.emit(constants_1.START_LISTENING_STREAM, radioStation);
        return this.radioStationModel.findOneAndUpdate({ _id: id }, {
            startedAt: new Date(),
            isStreamStarted: true,
            error: null,
            isError: false,
        }, { new: true });
    }
    async findAll(queryDto) {
        const { limit, skip, sort, page, filter, select, populate } = queryDto;
        var paginateOptions = {};
        paginateOptions['sort'] = sort;
        paginateOptions['select'] = select;
        paginateOptions['populate'] = populate;
        paginateOptions['offset'] = skip;
        paginateOptions['page'] = page;
        paginateOptions['limit'] = limit;
        return this.radioStationModel['paginate'](filter, paginateOptions);
    }
    async findByIdOrFail(id) {
        const radioStation = await this.radioStationModel.findById(id);
        if (!radioStation) {
            throw new common_1.NotFoundException();
        }
        return radioStation;
    }
    async removeById(id) {
        const radioStation = await this.radioStationModel.findById(id);
        if (!radioStation) {
            return Promise.reject({
                notFound: true,
                status: 404,
                message: 'Item not found',
            });
        }
        return this.radioStationModel.findByIdAndRemove(id);
    }
    async bulkRemove(ids) {
        const promises = ids.map(id => this.removeById(id).catch(err => ({ promiseError: err, data: id })));
        return Promise.all(promises).then(values => {
            const failedData = values.filter(item => item['promiseError']);
            const passedData = values.filter(item => !item['promiseError']);
            return {
                passedData: passedData,
                failedData: failedData,
            };
        });
    }
    async bulkStartListeningStream(ids) {
        const promises = ids.map(id => this.startListeningStream(id).catch(err => ({
            promiseError: err,
            data: id,
        })));
        return Promise.all(promises).then(values => {
            const failedData = values.filter(item => item['promiseError']);
            const passedData = values.filter(item => !item['promiseError']);
            return {
                passedData: passedData,
                failedData: failedData,
            };
        });
    }
    async bulkStopListeningStream(ids) {
        const promises = ids.map(id => this.stopListeningStream(id).catch(err => ({
            promiseError: err,
            data: id,
        })));
        return Promise.all(promises).then(values => {
            const failedData = values.filter(item => item['promiseError']);
            const passedData = values.filter(item => !item['promiseError']);
            return {
                passedData: passedData,
                failedData: failedData,
            };
        });
    }
    async exportToJson() {
        var obj = {
            stations: [],
        };
        const stations = await this.radioStationModel.find();
        stations.forEach((station, index) => {
            const newObj = {
                sn: index + 1,
                id: station.id,
                streamingUrl: station.streamingUrl,
                website: station.website,
            };
            obj.stations.push(newObj);
        });
        var json = JSON.stringify(obj);
        fs.writeFileSync('stations.json', json, 'utf8');
        return 'Done';
    }
    async updateFromJson() {
        await this.radioStationModel.updateMany({}, { $unset: { owner: "" } });
        return 'Done';
    }
};
RadiostationService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(radiostation_schema_1.RadioStation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        sonickey_service_1.SonickeyService,
        event_emitter_1.EventEmitter2])
], RadiostationService);
exports.RadiostationService = RadiostationService;
//# sourceMappingURL=radiostation.service.js.map