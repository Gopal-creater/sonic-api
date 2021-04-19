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
exports.RadiostationSonicKeysService = void 0;
const common_1 = require("@nestjs/common");
const radiostation_sonickey_schema_1 = require("../../../schemas/radiostation-sonickey.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const radiostation_schema_1 = require("../../../schemas/radiostation.schema");
const sonickey_schema_1 = require("../../../schemas/sonickey.schema");
let RadiostationSonicKeysService = class RadiostationSonicKeysService {
    constructor(radioStationSonickeyModel, radioStationModel, sonicKeyModel) {
        this.radioStationSonickeyModel = radioStationSonickeyModel;
        this.radioStationModel = radioStationModel;
        this.sonicKeyModel = sonicKeyModel;
    }
    async create(createRadiostationSonicKeyDto) {
        const newRadioStationSonicKey = new this.radioStationSonickeyModel(Object.assign(Object.assign({}, createRadiostationSonicKeyDto), { count: 1 }));
        return newRadioStationSonicKey.save();
    }
    async findOrCreateAndIncrementCount(radioStation, sonicKey, count = 1) {
        const radioStationSonicKey = await this.findOne(radioStation, sonicKey);
        if (!radioStationSonicKey) {
            const newRadioStationSonicKey = new this.radioStationSonickeyModel({
                radioStation: radioStation,
                sonicKey: sonicKey,
                count: count,
            });
            return newRadioStationSonicKey.save();
        }
        else {
            radioStationSonicKey.count = radioStationSonicKey.count + count;
            return radioStationSonicKey.update();
        }
    }
    async findAll(queryDto = {}) {
        const { limit, offset } = queryDto, query = __rest(queryDto, ["limit", "offset"]);
        const options = {
            limit,
            offset,
        };
        return this.radioStationSonickeyModel
            .find(query || {})
            .skip(offset)
            .limit(limit)
            .exec();
    }
    async findOne(radioStation, sonicKey) {
        return this.radioStationSonickeyModel.findOne({
            radioStation: radioStation,
            sonicKey: sonicKey,
        });
    }
    async findById(id) {
        return this.radioStationSonickeyModel.findById(id);
    }
    async incrementCount(radioStation, sonicKey, count = 1) {
        const radioStationSonicKey = await this.findOne(radioStation, sonicKey);
        if (!radioStationSonicKey) {
            return Promise.reject({
                notFound: true,
                status: 404,
                message: 'Item not found',
            });
        }
        radioStationSonicKey.count = radioStationSonicKey.count + count;
        return radioStationSonicKey.update();
    }
};
RadiostationSonicKeysService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(radiostation_sonickey_schema_1.RadioStationSonicKey.name)),
    __param(1, mongoose_1.InjectModel(radiostation_schema_1.RadioStation.name)),
    __param(2, mongoose_1.InjectModel(sonickey_schema_1.SonicKey.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], RadiostationSonicKeysService);
exports.RadiostationSonicKeysService = RadiostationSonicKeysService;
//# sourceMappingURL=radiostation-sonickeys.service.js.map