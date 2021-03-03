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
        const radioStation = await this.findOne(id);
        if (!radioStation.isStreamStarted) {
            throw new common_1.BadRequestException('Not started to stop.');
        }
        radioStation.stopAt = new Date();
        radioStation.isStreamStarted = false;
        return this.radioStationRepository.update(radioStation);
    }
    async startListeningStream(id) {
        const radioStation = await this.findOne(id);
        if (radioStation.isStreamStarted) {
            throw new common_1.BadRequestException('Already started');
        }
        radioStation.startedAt = new Date();
        radioStation.isStreamStarted = true;
        return this.radioStationRepository.update(radioStation);
    }
    async findAll() {
        var e_1, _a;
        const items = [];
        try {
            for (var _b = __asyncValues(this.radioStationRepository.scan(radiostation_schema_1.RadioStation)), _c; _c = await _b.next(), !_c.done;) {
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
    async findOne(id) {
        var e_2, _a;
        const items = [];
        try {
            for (var _b = __asyncValues(this.radioStationRepository.query(radiostation_schema_1.RadioStation, {
                id: id,
            })), _c; _c = await _b.next(), !_c.done;) {
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
        return items[0];
    }
    async update(id, updateRadiostationDto) {
        const radioStation = await this.findOne(id);
        return this.radioStationRepository.update(Object.assign(radioStation, updateRadiostationDto));
    }
    async findByOwner(owner) {
        var e_3, _a;
        var items = [];
        try {
            for (var _b = __asyncValues(this.radioStationRepository.query(radiostation_schema_1.RadioStation, { owner: owner }, { indexName: 'ownerIndex' })), _c; _c = await _b.next(), !_c.done;) {
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
        return items;
    }
    async remove(id) {
        const radioStation = await this.findOne(id);
        return this.radioStationRepository.delete(radioStation);
    }
    bulkRemove(ids) {
        const promises = ids.map(id => this.remove(id));
        return Promise.all(promises);
    }
    bulkStartListeningStream(ids) {
        const promises = ids.map(id => this.startListeningStream(id));
        return Promise.all(promises);
    }
    bulkStopListeningStream(ids) {
        const promises = ids.map(id => this.stopListeningStream(id));
        return Promise.all(promises);
    }
};
RadiostationService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [radiostation_repository_1.RadioStationRepository])
], RadiostationService);
exports.RadiostationService = RadiostationService;
//# sourceMappingURL=radiostation.service.js.map