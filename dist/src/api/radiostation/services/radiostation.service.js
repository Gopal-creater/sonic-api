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
exports.RadiostationService = void 0;
const common_1 = require("@nestjs/common");
const radiostation_schema_1 = require("../../../schemas/radiostation.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let RadiostationService = class RadiostationService {
    constructor(radioStationModel) {
        this.radioStationModel = radioStationModel;
    }
    create(createRadiostationDto) {
        const newRadioStation = new this.radioStationModel(createRadiostationDto);
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
        radioStation.stopAt = new Date();
        radioStation.isStreamStarted = false;
        return this.radioStationModel.findOneAndUpdate({ _id: id, radioStation });
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
        radioStation.startedAt = new Date();
        radioStation.isStreamStarted = true;
        return this.radioStationModel.findOneAndUpdate({ _id: id, radioStation });
    }
    async findAll(queryDto = {}) {
        const { limit, offset } = queryDto, query = __rest(queryDto, ["limit", "offset"]);
        const options = {
            limit,
            offset
        };
        return this.radioStationModel
            .find(query || {})
            .skip(offset)
            .limit(limit)
            .exec();
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
        ;
        if (!radioStation) {
            return Promise.reject({
                notFound: true,
                status: 404,
                message: 'Item not found',
            });
        }
        return this.radioStationModel.remove(id);
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
};
RadiostationService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(radiostation_schema_1.RadioStation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RadiostationService);
exports.RadiostationService = RadiostationService;
//# sourceMappingURL=radiostation.service.js.map