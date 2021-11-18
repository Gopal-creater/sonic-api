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
exports.RadioMonitorService = void 0;
const common_1 = require("@nestjs/common");
const radiomonitor_schema_1 = require("./schemas/radiomonitor.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const radiostation_service_1 = require("../radiostation/services/radiostation.service");
const licensekey_service_1 = require("../licensekey/services/licensekey.service");
const Enums_1 = require("../../constants/Enums");
const user_service_1 = require("../user/user.service");
let RadioMonitorService = class RadioMonitorService {
    constructor(radioMonitorModel, radiostationService, licensekeyService, userService) {
        this.radioMonitorModel = radioMonitorModel;
        this.radiostationService = radiostationService;
        this.licensekeyService = licensekeyService;
        this.userService = userService;
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
        return this.radioMonitorModel['paginate'](filter, paginateOptions);
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
        const newMonitor = await this.radioMonitorModel.create({
            radio: radio,
            radioSearch: isValidRadioStation,
            isListeningStarted: true,
            owner: owner,
            license: license,
        });
        const savedMonitor = await newMonitor.save();
        await this.licensekeyService
            .incrementUses(license, 'monitor', 1)
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
    async subscribeRadioToMonitorBulkWithInsertManyOperation(radioMonitors) {
        var _a, _b, _c;
        const isAllowedForSubscribe = await this.licensekeyService.allowedForIncrementUses((_a = radioMonitors === null || radioMonitors === void 0 ? void 0 : radioMonitors[0]) === null || _a === void 0 ? void 0 : _a.license, 'monitor', radioMonitors.length);
        if (!isAllowedForSubscribe) {
            return Promise.reject({
                status: 422,
                message: `Not allowed for subscription deuto invalid license :${(_b = radioMonitors === null || radioMonitors === void 0 ? void 0 : radioMonitors[0]) === null || _b === void 0 ? void 0 : _b.license}`,
            });
        }
        const inserted = await this.radioMonitorModel.collection.insertMany(radioMonitors);
        await this.licensekeyService.incrementUses((_c = radioMonitors === null || radioMonitors === void 0 ? void 0 : radioMonitors[0]) === null || _c === void 0 ? void 0 : _c.license, 'monitor', inserted.insertedCount);
        return inserted;
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
        return isValidRadioMonitor;
    }
    async startListeningStream(id) {
        const isValidRadioMonitor = await this.radioMonitorModel.findById(id);
        if (!isValidRadioMonitor) {
            return Promise.reject({
                status: 404,
                message: 'Not found',
            });
        }
        if (isValidRadioMonitor.isListeningStarted) {
            return isValidRadioMonitor;
        }
        const { radio } = isValidRadioMonitor;
        const isValidRadioStation = await this.radiostationService.radioStationModel.findById(radio);
        if (!isValidRadioStation) {
            return Promise.reject({
                status: 404,
                message: 'Radiostation not found',
            });
        }
        return this.radioMonitorModel.findOneAndUpdate({ _id: id }, {
            startedAt: new Date(),
            isListeningStarted: true,
            radioSearch: isValidRadioStation,
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
    async addUserFromHisMonitoringGroupToSubscribeRadioMonitoring(usernameOrSub, unlimitedMonitoringLicense) {
        var e_1, _a;
        const user = await this.userService.getUserProfile(usernameOrSub, true);
        if (!user) {
            return Promise.reject({
                status: 404,
                message: 'User not found',
            });
        }
        if (!unlimitedMonitoringLicense) {
            const validLicence = await this.licensekeyService.findUnlimitedMonitoringLicenseForUser(user.sub);
            if (!validLicence) {
                return Promise.reject({
                    status: 422,
                    message: 'There is no valid license.',
                });
            }
            unlimitedMonitoringLicense = validLicence.key;
        }
        var aimSaveDataResult, afemSaveDataResult;
        try {
            for (var _b = __asyncValues(user.groups || []), _c; _c = await _b.next(), !_c.done;) {
                const group = _c.value;
                if (group == Enums_1.MonitorGroupsEnum.AIM) {
                    const radiosAlreadyMonitors = await this.radioMonitorModel.aggregate([
                        {
                            $match: { owner: user.sub },
                        },
                        { $group: { _id: '$radio', ids: { $push: '$radio' } } },
                    ]);
                    console.log('radiosAlreadyMonitors AIM', radiosAlreadyMonitors);
                    const radiosToMonitor = await this.radiostationService.radioStationModel.find({
                        'monitorGroups.name': group,
                        _id: { $nin: radiosAlreadyMonitors },
                    });
                    console.log('radiosToMonitor AIM', radiosToMonitor.length);
                    const radioMonitors = radiosToMonitor.map(rd => {
                        return {
                            radio: rd._id,
                            owner: user.sub,
                            license: unlimitedMonitoringLicense,
                            radioSearch: rd,
                            isListeningStarted: true,
                        };
                    });
                    aimSaveDataResult = await this.subscribeRadioToMonitorBulkWithInsertManyOperation(radioMonitors);
                }
                if (group == Enums_1.MonitorGroupsEnum.AFEM) {
                    const radiosAlreadyMonitors = await this.radioMonitorModel.aggregate([
                        {
                            $match: { owner: user.sub },
                        },
                        { $group: { _id: '$radio', ids: { $push: '$radio' } } },
                    ]);
                    console.log('radiosAlreadyMonitors AFEM', radiosAlreadyMonitors);
                    const radiosToMonitor = await this.radiostationService.radioStationModel.find({
                        'monitorGroups.name': group,
                        _id: { $nin: radiosAlreadyMonitors },
                    });
                    console.log('radiosToMonitor AFEM', radiosToMonitor.length);
                    const radioMonitors = radiosToMonitor.map(rd => {
                        return {
                            radio: rd._id,
                            owner: user.sub,
                            license: unlimitedMonitoringLicense,
                            radioSearch: rd,
                            isListeningStarted: true,
                        };
                    });
                    afemSaveDataResult = await this.subscribeRadioToMonitorBulkWithInsertManyOperation(radioMonitors);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return {
            aimSaveDataResult: aimSaveDataResult,
            afemSaveDataResult: afemSaveDataResult,
        };
    }
};
RadioMonitorService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(radiomonitor_schema_1.RadioMonitor.name)),
    __param(3, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        radiostation_service_1.RadiostationService,
        licensekey_service_1.LicensekeyService,
        user_service_1.UserService])
], RadioMonitorService);
exports.RadioMonitorService = RadioMonitorService;
//# sourceMappingURL=radiomonitor.service.js.map