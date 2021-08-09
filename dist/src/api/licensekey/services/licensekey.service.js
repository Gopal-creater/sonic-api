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
let LicensekeyService = class LicensekeyService {
    constructor(licenseKeyModel, keygenService) {
        this.licenseKeyModel = licenseKeyModel;
        this.keygenService = keygenService;
    }
    create(createLicensekeyDto, createdBy) {
        const key = uuid_1.v4();
        const newLicenseKey = new this.licenseKeyModel(Object.assign(Object.assign({}, createLicensekeyDto), { _id: key, key: key, createdBy: createdBy }));
        return newLicenseKey.save();
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
            validationResult.message = 'This license key is expired';
        }
        else if (licenseKey.disabled || licenseKey.suspended) {
            validationResult.valid = false;
            validationResult.message =
                'This license key is either disabled or suspended';
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
        var oldOwners = licenseKey.owners;
        _.remove(oldOwners, ow => ow.ownerId == ownerId);
        licenseKey.owners = oldOwners;
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
            licenseKey.decodeUses = licenseKey.decodeUses + incrementBy;
            if (licenseKey.decodeUses > licenseKey.maxDecodeUses) {
                throw new common_1.UnprocessableEntityException("Can't increment uses because this increment will exceed the maxUses.");
            }
        }
        else if (usesFor == 'encode') {
            licenseKey.encodeUses = licenseKey.encodeUses + incrementBy;
            if (licenseKey.encodeUses > licenseKey.maxEncodeUses) {
                throw new common_1.UnprocessableEntityException("Can't increment uses because this increment will exceed the maxUses.");
            }
        }
        return licenseKey.save();
    }
    async decrementUses(id, usesFor, decrementBy = 1) {
        const licenseKey = await this.licenseKeyModel.findById(id);
        if (!licenseKey)
            throw new common_1.NotFoundException();
        if (usesFor == 'decode') {
            licenseKey.decodeUses = licenseKey.decodeUses - decrementBy;
            if (licenseKey.decodeUses < 0) {
                throw new common_1.UnprocessableEntityException("Can't decrement uses because this decrement will become less than 0.");
            }
        }
        else if (usesFor == 'encode') {
            licenseKey.encodeUses = licenseKey.encodeUses - decrementBy;
            if (licenseKey.encodeUses < 0) {
                throw new common_1.UnprocessableEntityException("Can't decrement uses because this decrement will become less than 0.");
            }
        }
        return licenseKey.save();
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
        var e_1, _a;
        const { data, error } = await this.keygenService.getAllLicenses();
        console.log('allLicenses', data);
        try {
            for (var data_1 = __asyncValues(data), data_1_1; data_1_1 = await data_1.next(), !data_1_1.done;) {
                const license = data_1_1.value;
                const oldLicense = license === null || license === void 0 ? void 0 : license.attributes;
                const _b = (oldLicense === null || oldLicense === void 0 ? void 0 : oldLicense.metadata) || {}, { reserves } = _b, oldOwners = __rest(_b, ["reserves"]);
                console.log('Name', oldLicense === null || oldLicense === void 0 ? void 0 : oldLicense.name);
                const oldOwnersArr = Object.values(oldOwners || {});
                console.log('oldOwners', oldOwnersArr);
                const newOwners = oldOwnersArr.map((ownerId, index) => {
                    const lkOwner = new licensekey_schema_1.LKOwner();
                    lkOwner.ownerId = ownerId;
                    return lkOwner;
                });
                console.log('newOwners', newOwners);
                const newLicense = await this.licenseKeyModel.create({
                    _id: oldLicense.key,
                    key: oldLicense.key,
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
                await newLicense.save();
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
    __metadata("design:paramtypes", [mongoose_2.Model,
        keygen_service_1.KeygenService])
], LicensekeyService);
exports.LicensekeyService = LicensekeyService;
//# sourceMappingURL=licensekey.service.js.map