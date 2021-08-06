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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicensekeyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const licensekey_schema_1 = require("../schemas/licensekey.schema");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
const _ = require("lodash");
let LicensekeyService = class LicensekeyService {
    constructor(licenseKeyModel) {
        this.licenseKeyModel = licenseKeyModel;
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
        _.remove(oldOwners, (ow) => ow.ownerId == ownerId);
        licenseKey.owners = oldOwners;
        return licenseKey.save();
    }
    async removeOwnersFromLicense(id, ownerIds) {
        const licenseKey = await this.licenseKeyModel.findById(id);
        var oldOwners = licenseKey.owners;
        for (let index = 0; index < ownerIds.length; index++) {
            const owner = ownerIds[index];
            _.remove(oldOwners, (ow) => ow.ownerId == owner);
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
};
LicensekeyService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(licensekey_schema_1.LicenseKey.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LicensekeyService);
exports.LicensekeyService = LicensekeyService;
//# sourceMappingURL=licensekey.service.js.map