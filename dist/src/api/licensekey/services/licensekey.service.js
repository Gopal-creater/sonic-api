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
exports.LicensekeyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const licensekey_schema_1 = require("../schemas/licensekey.schema");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
const _ = require("lodash");
const keygen_service_1 = require("../../../shared/modules/keygen/keygen.service");
const user_service_1 = require("../../user/user.service");
let LicensekeyService = class LicensekeyService {
    constructor(licenseKeyModel, keygenService, userService) {
        this.licenseKeyModel = licenseKeyModel;
        this.keygenService = keygenService;
        this.userService = userService;
    }
    create(createLicensekeyDto, createdBy) {
        const key = uuid_1.v4();
        const newLicenseKey = new this.licenseKeyModel(Object.assign(Object.assign({}, createLicensekeyDto), { _id: key, key: key, createdBy: createdBy }));
        return newLicenseKey.save();
    }
    createUnlimitedMonitoringLicense() {
        const key = uuid_1.v4();
        const newLicenseKey = new this.licenseKeyModel({
            _id: key,
            key: key,
            name: `7 Month Unlimited Monitoring_${Date.now()}`,
            isUnlimitedMonitor: true,
            validity: new Date(new Date().setMonth(new Date().getMonth() + 7)),
            createdBy: 'system_generate',
        });
        return newLicenseKey.save();
    }
    createDefaultLicenseToAssignUser() {
        const key = uuid_1.v4();
        const newLicenseKey = new this.licenseKeyModel({
            _id: key,
            key: key,
            name: `7 Month Unlimited Monitoring & Encode_${Date.now()}`,
            isUnlimitedMonitor: true,
            isUnlimitedEncode: true,
            validity: new Date(new Date().setMonth(new Date().getMonth() + 7)),
            createdBy: 'system_generate',
        });
        return newLicenseKey.save();
    }
    async findOrCreateUnlimitedMonitoringLicense() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var license = await this.licenseKeyModel.findOne({
            $or: [{ createdBy: 'system_generate' }, { createdBy: 'auto_generate' }],
            isUnlimitedMonitor: true,
            disabled: false,
            suspended: false,
            validity: { $gte: startOfToday },
        });
        if (!license) {
            license = await this.createUnlimitedMonitoringLicense();
        }
        return license;
    }
    async findOrCreateDefaultLicenseToAssignUser() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var license = await this.licenseKeyModel.findOne({
            $or: [{ createdBy: 'system_generate' }, { createdBy: 'auto_generate' }],
            isUnlimitedMonitor: true,
            isUnlimitedEncode: true,
            disabled: false,
            suspended: false,
            validity: { $gte: startOfToday },
        });
        if (!license) {
            license = await this.createDefaultLicenseToAssignUser();
        }
        return license;
    }
    async findUnlimitedMonitoringLicenseForUser(userId) {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var license = await this.licenseKeyModel.findOne({
            'owners.ownerId': userId,
            disabled: false,
            suspended: false,
            validity: { $gte: startOfToday },
            $or: [{ isUnlimitedMonitor: true }, { createdBy: 'system_generate' }, { createdBy: 'auto_generate' }],
        });
        return license;
    }
    async findPreferedLicenseToGetRadioMonitoringListFor(userId) {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var validLicenseForMonitor = await this.licenseKeyModel.findOne({
            'owners.ownerId': userId,
            disabled: false,
            suspended: false,
            validity: { $gte: startOfToday },
            $or: [{ isUnlimitedMonitor: true }, { maxMonitoringUses: { $gt: 0 } }]
        });
        return validLicenseForMonitor;
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
        return await this.licenseKeyModel['paginate'](filter, paginateOptions);
    }
    async validateLicence(id) {
        var validationResult = {
            valid: true,
            message: '',
        };
        const licenseKey = await this.licenseKeyModel.findById(id);
        if (!licenseKey) {
            validationResult.valid = false;
            validationResult.message = 'Invalid license key';
        }
        else if (new Date(licenseKey.validity).getTime() < new Date().getTime()) {
            validationResult.valid = false;
            validationResult.message = 'License key is expired';
        }
        else if (licenseKey.disabled || licenseKey.suspended) {
            validationResult.valid = false;
            validationResult.message = 'License key is either disabled or suspended';
        }
        return { validationResult, licenseKey };
    }
    async addOwnersToLicense(id, owners) {
        const licenseKey = await this.licenseKeyModel.findById(id);
        licenseKey.owners.push(...owners);
        licenseKey.owners = _.uniqBy(licenseKey.owners, 'ownerId');
        return licenseKey.save();
    }
    async addOwnerToLicense(id, lKOwner) {
        const licenseKey = await this.licenseKeyModel.findById(id);
        licenseKey.owners.push(lKOwner);
        licenseKey.owners = _.uniqBy(licenseKey.owners, 'ownerId');
        return licenseKey.save();
    }
    async removeOwnerFromLicense(id, ownerId) {
        const licenseKey = await this.licenseKeyModel.findById(id);
        licenseKey.owners = licenseKey.owners.filter(ow => ow.ownerId !== ownerId);
        return licenseKey.save();
    }
    async removeOwnersFromLicense(id, ownerIds) {
        const licenseKey = await this.licenseKeyModel.findById(id);
        var oldOwners = licenseKey.owners;
        for (let index = 0; index < ownerIds.length; index++) {
            const owner = ownerIds[index];
            _.remove(oldOwners, ow => ow.ownerId == owner);
        }
        licenseKey.owners = oldOwners;
        return licenseKey.save();
    }
    async incrementUses(id, usesFor, incrementBy = 1) {
        const licenseKey = await this.licenseKeyModel.findById(id);
        if (!licenseKey)
            throw new common_1.NotFoundException();
        if (usesFor == 'decode') {
            if (!licenseKey.isUnlimitedDecode) {
                licenseKey.decodeUses = licenseKey.decodeUses + incrementBy;
                if (licenseKey.decodeUses > licenseKey.maxDecodeUses) {
                    throw new common_1.UnprocessableEntityException("Can't increment uses because this increment will exceed the maxUses.");
                }
            }
        }
        else if (usesFor == 'encode') {
            if (!licenseKey.isUnlimitedEncode) {
                licenseKey.encodeUses = licenseKey.encodeUses + incrementBy;
                if (licenseKey.encodeUses > licenseKey.maxEncodeUses) {
                    throw new common_1.UnprocessableEntityException("Can't increment uses because this increment will exceed the maxUses.");
                }
            }
        }
        else if (usesFor == 'monitor') {
            if (!licenseKey.isUnlimitedMonitor) {
                licenseKey.monitoringUses = licenseKey.monitoringUses + incrementBy;
                if (licenseKey.monitoringUses > licenseKey.maxMonitoringUses) {
                    throw new common_1.UnprocessableEntityException("Can't increment uses because this increment will exceed the maxUses for monitor.");
                }
            }
        }
        return licenseKey.save();
    }
    async allowedForIncrementUses(id, usesFor, incrementBy = 1) {
        const licenseKey = await this.licenseKeyModel.findById(id);
        if (!licenseKey)
            return false;
        if (usesFor == 'decode') {
            if (!licenseKey.isUnlimitedDecode) {
                licenseKey.decodeUses = licenseKey.decodeUses + incrementBy;
                if (licenseKey.decodeUses > licenseKey.maxDecodeUses) {
                    return false;
                }
            }
        }
        else if (usesFor == 'encode') {
            if (!licenseKey.isUnlimitedEncode) {
                licenseKey.encodeUses = licenseKey.encodeUses + incrementBy;
                if (licenseKey.encodeUses > licenseKey.maxEncodeUses) {
                    return false;
                }
            }
        }
        else if (usesFor == 'monitor') {
            if (!licenseKey.isUnlimitedMonitor) {
                licenseKey.monitoringUses = licenseKey.monitoringUses + incrementBy;
                if (licenseKey.monitoringUses > licenseKey.maxMonitoringUses) {
                    return false;
                }
            }
        }
        return true;
    }
    async decrementUses(id, usesFor, decrementBy = 1) {
        const licenseKey = await this.licenseKeyModel.findById(id);
        if (!licenseKey)
            throw new common_1.NotFoundException();
        if (usesFor == 'decode') {
            if (!licenseKey.isUnlimitedDecode) {
                licenseKey.decodeUses = licenseKey.decodeUses - decrementBy;
                if (licenseKey.decodeUses < 0) {
                    throw new common_1.UnprocessableEntityException("Can't decrement uses because this decrement will become less than 0.");
                }
            }
        }
        else if (usesFor == 'encode') {
            if (!licenseKey.isUnlimitedEncode) {
                licenseKey.encodeUses = licenseKey.encodeUses - decrementBy;
                if (licenseKey.encodeUses < 0) {
                    throw new common_1.UnprocessableEntityException("Can't decrement uses because this decrement will become less than 0.");
                }
            }
        }
        else if (usesFor == 'monitor') {
            if (!licenseKey.isUnlimitedMonitor) {
                licenseKey.monitoringUses = licenseKey.monitoringUses - decrementBy;
                if (licenseKey.monitoringUses < 0) {
                    throw new common_1.UnprocessableEntityException("Can't decrement uses because this decrement will become less than 0 for monitor.");
                }
            }
        }
        return licenseKey.save();
    }
    async allowedForDecrementUses(id, usesFor, decrementBy = 1) {
        const licenseKey = await this.licenseKeyModel.findById(id);
        if (!licenseKey)
            return false;
        if (usesFor == 'decode') {
            if (!licenseKey.isUnlimitedDecode) {
                licenseKey.decodeUses = licenseKey.decodeUses - decrementBy;
                if (licenseKey.decodeUses < 0) {
                    return false;
                }
            }
        }
        else if (usesFor == 'encode') {
            if (!licenseKey.isUnlimitedEncode) {
                licenseKey.encodeUses = licenseKey.encodeUses - decrementBy;
                if (licenseKey.encodeUses < 0) {
                    return false;
                }
            }
        }
        else if (usesFor == 'monitor') {
            if (!licenseKey.isUnlimitedMonitor) {
                licenseKey.monitoringUses = licenseKey.monitoringUses - decrementBy;
                if (licenseKey.monitoringUses < 0) {
                    return false;
                }
            }
        }
        return true;
    }
    async resetUses(id, usesFor) {
        const licenseKey = await this.licenseKeyModel.findById(id);
        if (!licenseKey)
            throw new common_1.NotFoundException();
        if (usesFor == 'decode') {
            licenseKey.decodeUses = 0;
        }
        else if (usesFor == 'encode') {
            licenseKey.encodeUses = 0;
        }
        else if (usesFor == 'both') {
            licenseKey.decodeUses = 0;
            licenseKey.encodeUses = 0;
        }
        return licenseKey.save();
    }
    async addReservedDetailsInLicence(licenseId, reserves) {
        const license = await this.licenseKeyModel.findById(licenseId);
        license.reserves.push(...reserves);
        return license.save();
    }
    async removeReservedDetailsInLicence(licenseId, jobId) {
        const license = await this.licenseKeyModel.findById(licenseId);
        license.reserves = license.reserves.filter(reser => reser.jobId !== jobId);
        return license.save();
    }
    async incrementReservedDetailsInLicenceBy(licenseId, jobId, count) {
        const license = await this.licenseKeyModel.findById(licenseId);
        const updatedReserves = license.reserves.map(reserve => {
            if (reserve.jobId == jobId) {
                reserve.count = reserve.count + count;
            }
            return reserve;
        });
        license.reserves = updatedReserves;
        return license.save();
    }
    async decrementReservedDetailsInLicenceBy(licenseId, jobId, count) {
        const license = await this.licenseKeyModel.findById(licenseId);
        const updatedReserves = license.reserves.map(reserve => {
            if (reserve.jobId == jobId) {
                reserve.count = reserve.count - count;
            }
            return reserve;
        });
        license.reserves = updatedReserves;
        return license.save();
    }
    async migrateKeyFromKeygenToDB() {
        var e_1, _a, e_2, _b;
        const { data, error } = await this.keygenService.getAllLicenses('limit=90');
        try {
            for (var data_1 = __asyncValues(data), data_1_1; data_1_1 = await data_1.next(), !data_1_1.done;) {
                const license = data_1_1.value;
                const oldLicense = license === null || license === void 0 ? void 0 : license.attributes;
                const _c = (oldLicense === null || oldLicense === void 0 ? void 0 : oldLicense.metadata) || {}, { reserves } = _c, oldOwners = __rest(_c, ["reserves"]);
                console.log('Name', oldLicense === null || oldLicense === void 0 ? void 0 : oldLicense.name);
                const oldOwnersArr = Object.values(oldOwners || {});
                console.log('oldOwners', oldOwnersArr);
                var newOwners = [];
                try {
                    for (var oldOwnersArr_1 = (e_2 = void 0, __asyncValues(oldOwnersArr)), oldOwnersArr_1_1; oldOwnersArr_1_1 = await oldOwnersArr_1.next(), !oldOwnersArr_1_1.done;) {
                        const ownerId = oldOwnersArr_1_1.value;
                        const user = await this.userService.getUserProfile(ownerId);
                        if (user) {
                            const lkOwner = new licensekey_schema_1.LKOwner();
                            lkOwner.ownerId = ownerId;
                            lkOwner.username = user.username;
                            lkOwner.email = user.userAttributeObj.email;
                            lkOwner.name = user.username;
                            newOwners.push(lkOwner);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (oldOwnersArr_1_1 && !oldOwnersArr_1_1.done && (_b = oldOwnersArr_1.return)) await _b.call(oldOwnersArr_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                newOwners = _.uniqBy(newOwners, 'ownerId');
                console.log('newOwners', newOwners);
                const newLicense = new this.licenseKeyModel({
                    _id: license.id,
                    key: license.id,
                    name: oldLicense.name,
                    disabled: false,
                    suspended: oldLicense.suspended,
                    maxEncodeUses: oldLicense.maxUses,
                    encodeUses: oldLicense.uses,
                    maxDecodeUses: 0,
                    decodeUses: 0,
                    validity: oldLicense.expiry,
                    createdBy: process.env.NODE_ENV == 'production'
                        ? '9ab5a58b-09e0-46ce-bb50-1321d927c382'
                        : '5728f50d-146b-47d2-aa7b-a50bc37d641d',
                    owners: newOwners,
                });
                await newLicense.save().catch(err => {
                    console.log(`Error saving license ${oldLicense.name}`, err);
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) await _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return data.length || 0;
    }
};
LicensekeyService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(licensekey_schema_1.LicenseKey.name)),
    __param(2, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        keygen_service_1.KeygenService,
        user_service_1.UserService])
], LicensekeyService);
exports.LicensekeyService = LicensekeyService;
//# sourceMappingURL=licensekey.service.js.map