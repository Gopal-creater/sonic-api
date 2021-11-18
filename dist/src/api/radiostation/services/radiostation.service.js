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
exports.RadiostationService = void 0;
const common_1 = require("@nestjs/common");
const radiostation_schema_1 = require("../schemas/radiostation.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const sonickey_service_1 = require("../../sonickey/services/sonickey.service");
const constants_1 = require("../listeners/constants");
const fs = require("fs");
const xlsx = require("xlsx");
const _ = require("lodash");
const appRootPath = require("app-root-path");
const Enums_1 = require("../../../constants/Enums");
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
            station.toObject();
            const newObj = Object.assign({ sn: index + 1 }, station.toObject());
            obj.stations.push(newObj);
        });
        var json = JSON.stringify(obj);
        fs.writeFileSync('exported_radiostations.json', json, 'utf8');
        return 'Done';
    }
    async exportToExcel(stationsToMakeExcel = null) {
        var e_1, _a;
        var _b, _c, _d, _e, _f;
        const stations = stationsToMakeExcel || (await this.radioStationModel.find());
        var stationsInJosnFormat = [];
        try {
            for (var stations_1 = __asyncValues(stations), stations_1_1; stations_1_1 = await stations_1.next(), !stations_1_1.done;) {
                const station = stations_1_1.value;
                const toJsonData = station.toJSON();
                toJsonData.monitorGroups = (_f = (_e = (_d = (_c = (_b = toJsonData === null || toJsonData === void 0 ? void 0 : toJsonData.monitorGroups) === null || _b === void 0 ? void 0 : _b.map(gr => gr.name)) === null || _c === void 0 ? void 0 : _c.join) === null || _d === void 0 ? void 0 : _d.call(_c, ",")) === null || _e === void 0 ? void 0 : _e.toString) === null || _f === void 0 ? void 0 : _f.call(_e);
                stationsInJosnFormat.push(toJsonData);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (stations_1_1 && !stations_1_1.done && (_a = stations_1.return)) await _a.call(stations_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const pathToStore = `${appRootPath.toString()}/exported_radiostations_${Date.now()}.xlsx`;
        const fd = fs.openSync(pathToStore, 'w');
        const file = xlsx.readFile(pathToStore);
        const ws = xlsx.utils.json_to_sheet(stationsInJosnFormat);
        xlsx.utils.book_append_sheet(file, ws);
        xlsx.writeFile(file, pathToStore);
        return 'Done';
    }
    async addMonitorGroupsFromExcel() {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d;
        const europestationsAIM = xlsx.readFile(`${appRootPath.toString()}/sample_test/Europe 500 Stations_Working_list_AIM.xlsx`);
        const radiodancestationsAFEM = xlsx.readFile(`${appRootPath.toString()}/sample_test/Radio - Dance. Multi Territory_AFEM.xlsx`);
        const sheetsNameAIM = europestationsAIM.SheetNames;
        const sheetsNameAFEM = radiodancestationsAFEM.SheetNames;
        try {
            for (var sheetsNameAIM_1 = __asyncValues(sheetsNameAIM), sheetsNameAIM_1_1; sheetsNameAIM_1_1 = await sheetsNameAIM_1.next(), !sheetsNameAIM_1_1.done;) {
                const sheetNameAIM = sheetsNameAIM_1_1.value;
                console.log('sheetNameAIM', sheetNameAIM);
                const aimJson = xlsx.utils.sheet_to_json(europestationsAIM.Sheets[sheetNameAIM]);
                console.log(aimJson);
                try {
                    for (var aimJson_1 = (e_3 = void 0, __asyncValues(aimJson)), aimJson_1_1; aimJson_1_1 = await aimJson_1.next(), !aimJson_1_1.done;) {
                        const data = aimJson_1_1.value;
                        const monitorGroup = new radiostation_schema_1.MonitorGroup();
                        monitorGroup.name = Enums_1.MonitorGroupsEnum.AIM;
                        const radioStation = await this.radioStationModel.findOne({
                            $or: [
                                { name: { $regex: new RegExp(data['Station Name'], 'i') } },
                                { website: data['Website'] },
                            ],
                        });
                        if (radioStation) {
                            radioStation.monitorGroups.push(monitorGroup);
                            radioStation.monitorGroups = _.uniqBy(radioStation.monitorGroups, 'name');
                            await radioStation.save().catch(err => console.log(err));
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (aimJson_1_1 && !aimJson_1_1.done && (_b = aimJson_1.return)) await _b.call(aimJson_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (sheetsNameAIM_1_1 && !sheetsNameAIM_1_1.done && (_a = sheetsNameAIM_1.return)) await _a.call(sheetsNameAIM_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var sheetsNameAFEM_1 = __asyncValues(sheetsNameAFEM), sheetsNameAFEM_1_1; sheetsNameAFEM_1_1 = await sheetsNameAFEM_1.next(), !sheetsNameAFEM_1_1.done;) {
                const sheetNameAFEM = sheetsNameAFEM_1_1.value;
                const afemJson = xlsx.utils.sheet_to_json(radiodancestationsAFEM.Sheets[sheetNameAFEM]);
                console.log(afemJson);
                try {
                    for (var afemJson_1 = (e_5 = void 0, __asyncValues(afemJson)), afemJson_1_1; afemJson_1_1 = await afemJson_1.next(), !afemJson_1_1.done;) {
                        const data = afemJson_1_1.value;
                        const monitorGroup = new radiostation_schema_1.MonitorGroup();
                        monitorGroup.name = Enums_1.MonitorGroupsEnum.AFEM;
                        const radioStation = await this.radioStationModel.findOne({
                            $or: [
                                { name: { $regex: new RegExp(data['Station Name'], 'i') } },
                                { website: data['Website'] },
                            ],
                        });
                        if (radioStation) {
                            radioStation.monitorGroups.push(monitorGroup);
                            radioStation.monitorGroups = _.uniqBy(radioStation.monitorGroups, 'name');
                            await radioStation.save().catch(err => console.log(err));
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (afemJson_1_1 && !afemJson_1_1.done && (_d = afemJson_1.return)) await _d.call(afemJson_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (sheetsNameAFEM_1_1 && !sheetsNameAFEM_1_1.done && (_c = sheetsNameAFEM_1.return)) await _c.call(sheetsNameAFEM_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        const undonRadios = await this.radioStationModel.find({
            monitorGroups: null,
        });
        await this.exportToExcel(undonRadios);
        return 'Done';
    }
    async updateFromJson() {
        await this.radioStationModel.updateMany({}, { $unset: { owner: '' } });
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