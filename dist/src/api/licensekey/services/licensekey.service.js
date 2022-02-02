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
exports.LicensekeyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const licensekey_schema_1 = require("../schemas/licensekey.schema");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
const keygen_service_1 = require("../../../shared/modules/keygen/keygen.service");
const user_service_1 = require("../../user/services/user.service");
const company_service_1 = require("../../company/company.service");
let LicensekeyService = class LicensekeyService {
    constructor(licenseKeyModel, keygenService, companyService, userService) {
        this.licenseKeyModel = licenseKeyModel;
        this.keygenService = keygenService;
        this.companyService = companyService;
        this.userService = userService;
    }
    async create(createLicensekeyDto, createdBy) {
        const { user } = createLicensekeyDto, dtos = __rest(createLicensekeyDto, ["user"]);
        const key = uuid_1.v4();
        const newLicenseKey = await this.licenseKeyModel.create(Object.assign(Object.assign({}, dtos), { users: [user], _id: key, key: key, createdBy: createdBy }));
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
            users: userId,
            disabled: false,
            suspended: false,
            validity: { $gte: startOfToday },
            $or: [
                { isUnlimitedMonitor: true },
                { createdBy: 'system_generate' },
                { createdBy: 'auto_generate' },
            ],
        });
        return license;
    }
    async findPreferedLicenseToGetRadioMonitoringListFor(userId) {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var validLicenseForMonitor = await this.licenseKeyModel.findOne({
            users: userId,
            disabled: false,
            suspended: false,
            validity: { $gte: startOfToday },
            $or: [{ isUnlimitedMonitor: true }, { maxMonitoringUses: { $gt: 0 } }],
        });
        return validLicenseForMonitor;
    }
    async findValidLicesesForUser(user, filter) {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var validLicenses;
        var userFromDb = await this.userService.userModel.findById(user);
        userFromDb = userFromDb.depopulate('companies');
        var validLicenseForUserWithInCompany = await this.licenseKeyModel.aggregate([
            {
                $match: Object.assign({ disabled: false, suspended: false, validity: { $gte: startOfToday } }, filter),
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'users',
                    foreignField: '_id',
                    as: 'users',
                },
            },
            {
                $match: {
                    'users.companies': { $in: userFromDb.companies },
                },
            },
        ]);
        if (validLicenseForUserWithInCompany.length > 0) {
            validLicenses = validLicenseForUserWithInCompany;
        }
        else {
            var validLicenseForUser = await this.licenseKeyModel.find(Object.assign({ disabled: false, suspended: false, validity: { $gte: startOfToday }, users: user }, filter));
            validLicenses = validLicenseForUser;
        }
        return validLicenses;
    }
    async findAll(queryDto) {
        const { limit, skip, sort, page, filter, relationalFilter, select, populate, } = queryDto;
        var paginateOptions = {};
        paginateOptions['sort'] = sort;
        paginateOptions['select'] = select;
        paginateOptions['populate'] = populate;
        paginateOptions['offset'] = skip;
        paginateOptions['page'] = page;
        paginateOptions['limit'] = limit;
        const aggregate = this.licenseKeyModel.aggregate([
            {
                $match: Object.assign({}, filter),
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'users',
                    foreignField: '_id',
                    as: 'users',
                },
            },
            {
                $lookup: {
                    from: 'Company',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                },
            },
            {
                $match: Object.assign({}, relationalFilter),
            },
        ]);
        return this.licenseKeyModel['aggregatePaginate'](aggregate, paginateOptions);
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
    async addOwnersToLicense(id, users) {
        return this.licenseKeyModel.findOneAndUpdate({ _id: id }, {
            $addToSet: {
                users: { $each: users },
            },
        }, {
            new: true,
        });
    }
    async addOwnerToLicense(id, user) {
        return this.licenseKeyModel.findOneAndUpdate({ _id: id }, {
            $addToSet: {
                users: user,
            },
        }, {
            new: true,
        });
    }
    async removeOwnerFromLicense(id, user) {
        return this.licenseKeyModel.findOneAndUpdate({ _id: id }, {
            $pull: {
                users: user,
            },
        }, {
            new: true,
        });
    }
    async removeOwnersFromLicense(id, users) {
        return this.licenseKeyModel.findOneAndUpdate({ _id: id }, {
            $pull: {
                users: { $in: users },
            },
        }, {
            new: true,
        });
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
    async getCount(queryDto) {
        const { filter, includeGroupData } = queryDto;
        return this.licenseKeyModel.find(filter || {}).count();
    }
    async getEstimateCount() {
        return this.licenseKeyModel.estimatedDocumentCount();
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
};
LicensekeyService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(licensekey_schema_1.LicenseKey.name)),
    __param(3, common_1.Inject(common_1.forwardRef(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        keygen_service_1.KeygenService,
        company_service_1.CompanyService,
        user_service_1.UserService])
], LicensekeyService);
exports.LicensekeyService = LicensekeyService;
//# sourceMappingURL=licensekey.service.js.map