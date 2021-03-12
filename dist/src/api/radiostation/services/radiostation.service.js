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
exports.RadiostationService = void 0;
const common_1 = require("@nestjs/common");
const radiostation_repository_1 = require("../../../repositories/radiostation.repository");
const radiostation_schema_1 = require("../../../schemas/radiostation.schema");
let RadiostationService = class RadiostationService {
    constructor(radioStationRepository) {
        this.radioStationRepository = radioStationRepository;
    }
    create(createRadiostationDto) {
        const dataToSave = Object.assign(new radiostation_schema_1.RadioStation(), createRadiostationDto);
        return this.radioStationRepository.put(dataToSave);
    }
    async stopListeningStream(id) {
        const radioStation = await this.findById(id);
        if (!radioStation) {
            return Promise.reject({ notFound: true, status: 404, message: "Item not found" });
        }
        if (!radioStation.isStreamStarted) {
            return radioStation;
        }
        radioStation.stopAt = new Date();
        radioStation.isStreamStarted = false;
        return this.radioStationRepository.update(radioStation);
    }
    async startListeningStream(id) {
        const radioStation = await this.findById(id);
        if (!radioStation) {
            return Promise.reject({ notFound: true, status: 404, message: "Item not found" });
        }
        if (radioStation.isStreamStarted) {
            return radioStation;
        }
        radioStation.startedAt = new Date();
        radioStation.isStreamStarted = true;
        return this.radioStationRepository.update(radioStation);
    }
    async findAll(scanOption) {
        var e_1, _a;
        const items = [];
        const iterator = this.radioStationRepository.scan(radiostation_schema_1.RadioStation, Object.assign({}, scanOption));
        try {
            for (var iterator_1 = __asyncValues(iterator), iterator_1_1; iterator_1_1 = await iterator_1.next(), !iterator_1_1.done;) {
                const item = iterator_1_1.value;
                items.push(item);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (iterator_1_1 && !iterator_1_1.done && (_a = iterator_1.return)) await _a.call(iterator_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return items;
    }
    async findAllWithPagination(scanOption) {
        var e_2, _a;
        var items = [];
        const paginator = this.radioStationRepository.scan(radiostation_schema_1.RadioStation, Object.assign({}, scanOption)).pages();
        try {
            for (var paginator_1 = __asyncValues(paginator), paginator_1_1; paginator_1_1 = await paginator_1.next(), !paginator_1_1.done;) {
                const item = paginator_1_1.value;
                console.log(paginator.count, paginator.scannedCount, paginator.lastEvaluatedKey);
                items = item;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (paginator_1_1 && !paginator_1_1.done && (_a = paginator_1.return)) await _a.call(paginator_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        console.log("paginator", paginator);
        return items;
    }
    async findById(id) {
        var e_3, _a;
        const items = [];
        try {
            for (var _b = __asyncValues(this.radioStationRepository.query(radiostation_schema_1.RadioStation, {
                id: id,
            })), _c; _c = await _b.next(), !_c.done;) {
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
    async findByIdOrFail(id) {
        const radioStation = await this.findById(id);
        if (!radioStation) {
            throw new common_1.NotFoundException();
        }
        return radioStation;
    }
    async update(id, updateRadiostationDto) {
        const radioStation = await this.findByIdOrFail(id);
        return this.radioStationRepository.update(Object.assign(radioStation, updateRadiostationDto));
    }
    async findByOwner(owner, queryOptions) {
        var e_4, _a;
        var items = [];
        const iterator = this.radioStationRepository.query(radiostation_schema_1.RadioStation, { owner: owner }, Object.assign({ indexName: 'ownerIndex' }, queryOptions));
        try {
            for (var iterator_2 = __asyncValues(iterator), iterator_2_1; iterator_2_1 = await iterator_2.next(), !iterator_2_1.done;) {
                const item = iterator_2_1.value;
                items.push(item);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (iterator_2_1 && !iterator_2_1.done && (_a = iterator_2.return)) await _a.call(iterator_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return items;
    }
    async removeById(id) {
        const radioStation = await this.findById(id);
        if (!radioStation) {
            return Promise.reject({ notFound: true, status: 404, message: "Item not found" });
        }
        return this.radioStationRepository.delete(radioStation);
    }
    async bulkRemove(ids) {
        const promises = ids.map(id => this.removeById(id).catch(err => ({ promiseError: err, data: id })));
        return Promise.all(promises).then(values => {
            const failedData = values.filter(item => item["promiseError"]);
            const passedData = values.filter(item => !item["promiseError"]);
            return {
                passedData: passedData,
                failedData: failedData
            };
        });
    }
    async bulkStartListeningStream(ids) {
        const promises = ids.map(id => this.startListeningStream(id).catch(err => ({ promiseError: err, data: id })));
        return Promise.all(promises).then(values => {
            const failedData = values.filter(item => item["promiseError"]);
            const passedData = values.filter(item => !item["promiseError"]);
            return {
                passedData: passedData,
                failedData: failedData
            };
        });
    }
    async bulkStopListeningStream(ids) {
        const promises = ids.map(id => this.stopListeningStream(id).catch(err => ({ promiseError: err, data: id })));
        return Promise.all(promises).then(values => {
            const failedData = values.filter(item => item["promiseError"]);
            const passedData = values.filter(item => !item["promiseError"]);
            return {
                passedData: passedData,
                failedData: failedData
            };
        });
    }
};
RadiostationService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [radiostation_repository_1.RadioStationRepository])
], RadiostationService);
exports.RadiostationService = RadiostationService;
//# sourceMappingURL=radiostation.service.js.map