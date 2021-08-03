import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateLicensekeyDto } from './dto/create-licensekey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LicenseKey, LKOwner } from './schemas/licensekey.schema';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash'
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { MongoosePaginateLicensekeyDto } from './dto/mongoosepaginate-licensekey.dto';

type usesFor = 'encode' | 'decode';

@Injectable()
export class LicensekeyService {
  constructor(
    @InjectModel(LicenseKey.name)
    public readonly licenseKeyModel: Model<LicenseKey>,
  ) {}

  create(createLicensekeyDto: CreateLicensekeyDto,createdBy:string) {
    const key = uuidv4();
    const newLicenseKey = new this.licenseKeyModel({
      ...createLicensekeyDto,
      _id: key,
      key: key,
      createdBy:createdBy
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

  async addOwnersToLicense(id:string,owners:LKOwner[]){
    const licenseKey = await this.licenseKeyModel.findById(id)
    licenseKey.owners.push(...owners)
    licenseKey.owners = _.uniqBy(licenseKey.owners,'ownerId')
    return licenseKey.save()
  }

  async addOwnerToLicense(id:string,lKOwner:LKOwner){
    const licenseKey = await this.licenseKeyModel.findById(id)
    licenseKey.owners.push(lKOwner)
    licenseKey.owners = _.uniqBy(licenseKey.owners,'ownerId')
    return licenseKey.save()
  }

  async removeOwnerFromLicense(id:string,ownerId:string){
    const licenseKey = await this.licenseKeyModel.findById(id)
    var oldOwners = licenseKey.owners;
    _.remove(oldOwners,(ow)=>ow.ownerId==ownerId);
    licenseKey.owners = oldOwners
    return licenseKey.save()
  }

  async removeOwnersFromLicense(id:string,ownerIds:string[]){
    const licenseKey = await this.licenseKeyModel.findById(id)
    var oldOwners = licenseKey.owners
    for (let index = 0; index < ownerIds.length; index++) {
      const owner = ownerIds[index];
      _.remove(oldOwners,(ow)=>ow.ownerId==owner)
    }
    licenseKey.owners = oldOwners
    return licenseKey.save()
  }

  async incrementUses(id: string, usesFor: usesFor, incrementBy: number = 1) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) throw new NotFoundException();
    if (usesFor == 'decode') {
      licenseKey.decodeUses = licenseKey.decodeUses + incrementBy;
      if (licenseKey.decodeUses > licenseKey.maxDecodeUses) {
        throw new UnprocessableEntityException(
          "Can't increment uses because this increment will exceed the maxUses.",
        );
      }
    } else if (usesFor == 'encode') {
      licenseKey.encodeUses = licenseKey.encodeUses + incrementBy;
      if (licenseKey.encodeUses > licenseKey.maxEncodeUses) {
        throw new UnprocessableEntityException(
          "Can't increment uses because this increment will exceed the maxUses.",
        );
      }
    }
    return licenseKey.save();
  }

  async decrementUses(id: string, usesFor: usesFor, decrementBy: number = 1) {
    const licenseKey = await this.licenseKeyModel.findById(id);
    if (!licenseKey) throw new NotFoundException();
    if (usesFor == 'decode') {
      licenseKey.decodeUses = licenseKey.decodeUses - decrementBy;
      if (licenseKey.decodeUses < 0) {
        throw new UnprocessableEntityException(
          "Can't decrement uses because this decrement will become less than 0.",
        );
      }
    } else if (usesFor == 'encode') {
      licenseKey.encodeUses = licenseKey.encodeUses - decrementBy;
      if (licenseKey.encodeUses < 0) {
        throw new UnprocessableEntityException(
          "Can't decrement uses because this decrement will become less than 0.",
        );
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
}
