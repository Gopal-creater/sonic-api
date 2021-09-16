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
exports.RadioMonitorService = void 0;
const common_1 = require("@nestjs/common");
const radiomonitor_schema_1 = require("./schemas/radiomonitor.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const radiostation_service_1 = require("../radiostation/services/radiostation.service");
const licensekey_service_1 = require("../licensekey/services/licensekey.service");
let RadioMonitorService = class RadioMonitorService {
    constructor(radioMonitorModel, radiostationService, licensekeyService) {
        this.radioMonitorModel = radioMonitorModel;
        this.radiostationService = radiostationService;
        this.licensekeyService = licensekeyService;
    }
    async subscribeRadioToMonitor(createRadioMonitorDto, owner, license) {
        const { radio } = createRadioMonitorDto;
        const isValidRadioStation = await this.radiostationService.radioStationModel.findById(radio);
        if (!isValidRadioStation) {
            return Promise.reject({
                status: 404,
                message: 'Radiostation not found',
            });
        }
        if (isValidRadioStation.isStreamStarted) {
            return Promise.reject({
                status: 422,
                message: 'Can not subscribe to this radio station since this radio station has not listening for any streams currently.',
            });
        }
        if (isValidRadioStation.isError) {
            return Promise.reject({
                status: 422,
                message: 'Can not subscribe to this radio station since this radio station has facing error currently.',
            });
        }
        const newMonitor = await this.radioMonitorModel.create({
            radio: radio,
            owner: owner,
            license: license,
        });
        const savedMonitor = await newMonitor.save();
        await this.licensekeyService.incrementUses(license, 'monitor', 1)
            .catch(async (err) => {
            await this.radioMonitorModel.findOneAndDelete({ _id: savedMonitor.id });
            return Promise.reject({
                status: 422,
                message: err === null || err === void 0 ? void 0 : err.message,
            });
        });
        return savedMonitor;
    }
    async subscribeRadioToMonitorBulk(createRadioMonitorsDto, owner, license) {
        const promises = createRadioMonitorsDto.map(createRadioMonitorDto => this.subscribeRadioToMonitor(createRadioMonitorDto, owner, license).catch(err => ({
            promiseError: err,
            data: createRadioMonitorDto,
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
    async findByIdOrFail(id) {
        const radioMonitor = await this.radioMonitorModel.findById(id);
        if (!radioMonitor) {
            throw new common_1.NotFoundException();
        }
        return radioMonitor;
    }
    async unsubscribeById(id) {
        const isValidRadioMonitor = await this.radioMonitorModel.findById(id);
        if (!isValidRadioMonitor) {
            return Promise.reject({
                status: 404,
                message: 'Not found',
            });
        }
        return this.radioMonitorModel.findByIdAndRemove(id);
    }
    async unsubscribeBulk(ids) {
        const promises = ids.map(id => this.unsubscribeById(id).catch(err => ({ promiseError: err, data: id })));
        return Promise.all(promises).then(values => {
            const failedData = values.filter(item => item['promiseError']);
            const passedData = values.filter(item => !item['promiseError']);
            return {
                passedData: passedData,
                failedData: failedData,
            };
        });
    }
    async stopListeningStream(id) {
        const isValidRadioMonitor = await this.radioMonitorModel.findById(id);
        if (!isValidRadioMonitor) {
            return Promise.reject({
                status: 404,
                message: 'Not found',
            });
        }
        return this.radioMonitorModel.findOneAndUpdate({ _id: id }, {
            stopAt: new Date(),
            isListeningStarted: false,
        }, { new: true });
    }
    async startListeningStream(id) {
        const isValidRadioMonitor = await this.radioMonitorModel.findById(id);
        if (!isValidRadioMonitor) {
            return Promise.reject({
                status: 404,
                message: 'Not found',
            });
        }
        const { radio } = isValidRadioMonitor;
        const isValidRadioStation = await this.radiostationService.radioStationModel.findById(radio);
        if (!isValidRadioStation) {
            return Promise.reject({
                status: 404,
                message: 'Radiostation not found',
            });
        }
        if (isValidRadioStation.isStreamStarted) {
            return Promise.reject({
                status: 422,
                message: 'Can not start listening to this radio station since this radio station has not listening for any streams currently.',
            });
        }
        if (isValidRadioStation.isError) {
            return Promise.reject({
                status: 422,
                message: 'Can not start listening to this radio station since this radio station has facing error currently.',
            });
        }
        return this.radioMonitorModel.findOneAndUpdate({ _id: id }, {
            startedAt: new Date(),
            isListeningStarted: true,
            error: null,
            isError: false,
        }, { new: true });
    }
    async startListeningStreamBulk(ids) {
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
    async stopListeningStreamBulk(ids) {
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
};
RadioMonitorService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(radiomonitor_schema_1.RadioMonitor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        radiostation_service_1.RadiostationService,
        licensekey_service_1.LicensekeyService])
], RadioMonitorService);
exports.RadioMonitorService = RadioMonitorService;
//# sourceMappingURL=radiomonitor.service.js.map