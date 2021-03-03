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
exports.RadiostationSonicKeysService = void 0;
const common_1 = require("@nestjs/common");
const radiostation_repository_1 = require("../../../repositories/radiostation.repository");
const radiostationSonickey_repository_1 = require("../../../repositories/radiostationSonickey.repository");
const radiostationSonickey_schema_1 = require("../../../schemas/radiostationSonickey.schema");
let RadiostationSonicKeysService = class RadiostationSonicKeysService {
    constructor(radioStationRepository, radioStationSonicKeysRepository) {
        this.radioStationRepository = radioStationRepository;
        this.radioStationSonicKeysRepository = radioStationSonicKeysRepository;
    }
    create(createRadiostationSonicKeyDto) {
        const dataToSave = Object.assign(new radiostationSonickey_schema_1.RadioStationSonicKey(), createRadiostationSonicKeyDto, { count: 1 });
        return this.radioStationSonicKeysRepository.put(dataToSave);
    }
    async findAllSonicKeysForRadioStation(radioStation) {
        var e_1, _a;
        const items = [];
        try {
            for (var _b = __asyncValues(this.radioStationSonicKeysRepository.query(radiostationSonickey_schema_1.RadioStationSonicKey, { radioStation: radioStation })), _c; _c = await _b.next(), !_c.done;) {
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
    async findOne(radioStation, sonicKey) {
        return this.radioStationSonicKeysRepository.get(Object.assign(new radiostationSonickey_schema_1.RadioStationSonicKey, { radioStation: radioStation, sonicKey: sonicKey }));
    }
    async incrementCount(radioStation, sonicKey) {
        const radioStationSonicKey = await this.findOne(radioStation, sonicKey);
        if (radioStationSonicKey) {
            return this.radioStationSonicKeysRepository.update(Object.assign(radioStationSonicKey, { count: radioStationSonicKey.count + 1 }));
        }
    }
};
RadiostationSonicKeysService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [radiostation_repository_1.RadioStationRepository, radiostationSonickey_repository_1.RadioStationSonicKeyRepository])
], RadiostationSonicKeysService);
exports.RadiostationSonicKeysService = RadiostationSonicKeysService;
//# sourceMappingURL=radiostation-sonickeys.service.js.map