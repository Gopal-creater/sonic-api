import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateLicensekeyDto } from '../dto/create-licensekey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LicenseKey, LKOwner, LKReserve } from '../schemas/licensekey.schema';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { MongoosePaginateLicensekeyDto } from '../dto/mongoosepaginate-licensekey.dto';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { UserService } from '../../user/user.service';

type usesFor = 'encode' | 'decode' | 'monitor';

@Injectable()
export class LicensekeyService {
  constructor(
    @InjectModel(LicenseKey.name)
    public readonly licenseKeyModel: Model<LicenseKey>,
    public readonly keygenService: KeygenService,

    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,
  ) {}

  create(createLicensekeyDto: CreateLicensekeyDto, createdBy: string) {
    const key = uuidv4();
    const newLicenseKey = new this.licenseKeyModel({
      ...createLicensekeyDto,
      _id: key,
      key: key,
      createdBy: createdBy,
    });
    return newLicenseKey.save();
  }

  async findAll(
    queryDto: ParsedQueryDto,
  ): Promise<MongoosePaginateLicensekeyDto> {
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

  async validateLicence(id: string) {
    var validationResult = {
      valid: true,
      message: '',
    };
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) {
      validationResult.valid = false;
      validationResult.message = 'Invalid license key';
    } else if (new Date(licenseKey.validity).getTime() < new Date().getTime()) {
      validationResult.valid = false;
      validationResult.message = 'This license key is expired';
    } else if (licenseKey.disabled || licenseKey.suspended) {
      validationResult.valid = false;
      validationResult.message =
        'This license key is either disabled or suspended';
    }

    return { validationResult, licenseKey };
  }

  async addOwnersToLicense(id: string, owners: LKOwner[]) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    licenseKey.owners.push(...owners);
    licenseKey.owners = _.uniqBy(licenseKey.owners, 'ownerId');
    return licenseKey.save();
  }

  async addOwnerToLicense(id: string, lKOwner: LKOwner) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    licenseKey.owners.push(lKOwner);
    licenseKey.owners = _.uniqBy(licenseKey.owners, 'ownerId');
    return licenseKey.save();
  }

  async removeOwnerFromLicense(id: string, ownerId: string) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    licenseKey.owners = licenseKey.owners.filter(ow => ow.ownerId !== ownerId);
    return licenseKey.save();
  }

  async removeOwnersFromLicense(id: string, ownerIds: string[]) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    var oldOwners = licenseKey.owners;
    for (let index = 0; index < ownerIds.length; index++) {
      const owner = ownerIds[index];
      _.remove(oldOwners, ow => ow.ownerId == owner);
    }
    licenseKey.owners = oldOwners;
    return licenseKey.save();
  }

  async incrementUses(id: string, usesFor: usesFor, incrementBy: number = 1) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) throw new NotFoundException();
    if (usesFor == 'decode') {
      if (!licenseKey.isUnlimitedDecode) {
        licenseKey.decodeUses = licenseKey.decodeUses + incrementBy;
        if (licenseKey.decodeUses > licenseKey.maxDecodeUses) {
          throw new UnprocessableEntityException(
            "Can't increment uses because this increment will exceed the maxUses.",
          );
        }
      }
    } else if (usesFor == 'encode') {
      if (!licenseKey.isUnlimitedEncode) {
        licenseKey.encodeUses = licenseKey.encodeUses + incrementBy;
        if (licenseKey.encodeUses > licenseKey.maxEncodeUses) {
          throw new UnprocessableEntityException(
            "Can't increment uses because this increment will exceed the maxUses.",
          );
        }
      }
    } else if (usesFor == 'monitor') {
      if (!licenseKey.isUnlimitedMonitor) {
        licenseKey.monitoringUses = licenseKey.monitoringUses + incrementBy;
        if (licenseKey.monitoringUses > licenseKey.maxMonitoringUses) {
          throw new UnprocessableEntityException(
            "Can't increment uses because this increment will exceed the maxUses for monitor.",
          );
        }
      }
    }
    return licenseKey.save();
  }

  async decrementUses(id: string, usesFor: usesFor, decrementBy: number = 1) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) throw new NotFoundException();
    if (usesFor == 'decode') {
      if (!licenseKey.isUnlimitedDecode) {
        licenseKey.decodeUses = licenseKey.decodeUses - decrementBy;
        if (licenseKey.decodeUses < 0) {
          throw new UnprocessableEntityException(
            "Can't decrement uses because this decrement will become less than 0.",
          );
        }
      }
    } else if (usesFor == 'encode') {
      if (!licenseKey.isUnlimitedEncode) {
        licenseKey.encodeUses = licenseKey.encodeUses - decrementBy;
        if (licenseKey.encodeUses < 0) {
          throw new UnprocessableEntityException(
            "Can't decrement uses because this decrement will become less than 0.",
          );
        }
      }
    } else if (usesFor == 'monitor') {
      if (!licenseKey.isUnlimitedMonitor) {
        licenseKey.monitoringUses = licenseKey.monitoringUses - decrementBy;
        if (licenseKey.monitoringUses < 0) {
          throw new UnprocessableEntityException(
            "Can't decrement uses because this decrement will become less than 0 for monitor.",
          );
        }
      }
    }
    return licenseKey.save();
  }

  async resetUses(id: string, usesFor: usesFor | 'both') {
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) throw new NotFoundException();
    if (usesFor == 'decode') {
      licenseKey.decodeUses = 0;
    } else if (usesFor == 'encode') {
      licenseKey.encodeUses = 0;
    } else if (usesFor == 'both') {
      licenseKey.decodeUses = 0;
      licenseKey.encodeUses = 0;
    }
    return licenseKey.save();
  }

  async addReservedDetailsInLicence(licenseId: string, reserves: LKReserve[]) {
    const license = await this.licenseKeyModel.findById(licenseId);
    license.reserves.push(...reserves);
    return license.save();
  }
  async removeReservedDetailsInLicence(licenseId: string, jobId: string) {
    const license = await this.licenseKeyModel.findById(licenseId);
    license.reserves = license.reserves.filter(reser => reser.jobId !== jobId);
    return license.save();
  }

  async incrementReservedDetailsInLicenceBy(
    licenseId: string,
    jobId: string,
    count: number,
  ) {
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

  async decrementReservedDetailsInLicenceBy(
    licenseId: string,
    jobId: string,
    count: number,
  ) {
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
    const { data, error } = await this.keygenService.getAllLicenses('limit=90');
    for await (const license of data) {
      const oldLicense = license?.attributes;
      const { reserves, ...oldOwners } = oldLicense?.metadata || {};
      console.log('Name', oldLicense?.name);
      const oldOwnersArr = Object.values(oldOwners || {}) as string[];
      console.log('oldOwners', oldOwnersArr);
      var newOwners: LKOwner[] = [];
      for await (const ownerId of oldOwnersArr) {
        const user = await this.userService.getUserProfile(ownerId);
        if (user) {
          const lkOwner = new LKOwner();
          lkOwner.ownerId = ownerId;
          lkOwner.username = user.Username;
          lkOwner.email = user.UserAttributes.find(
            attr => attr.Name == 'email',
          ).Value;
          lkOwner.name = user.Username;
          newOwners.push(lkOwner);
        }
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
        createdBy:
          process.env.NODE_ENV == 'production'
            ? '9ab5a58b-09e0-46ce-bb50-1321d927c382'
            : '5728f50d-146b-47d2-aa7b-a50bc37d641d',
        owners: newOwners,
      });

      await newLicense.save().catch(err => {
        console.log(`Error saving license ${oldLicense.name}`, err);
      });
    }
    return data.length || 0;
  }
}
