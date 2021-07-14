import { Injectable } from '@nestjs/common';
import { CreateLicensekeyDto } from './dto/create-licensekey.dto';
import { UpdateLicensekeyDto } from './dto/update-licensekey.dto';

@Injectable()
export class LicensekeyService {
  create(createLicensekeyDto: CreateLicensekeyDto) {
    return 'This action adds a new licensekey';
  }

  findAll() {
    return `This action returns all licensekey`;
  }

  findOne(id: number) {
    return `This action returns a #${id} licensekey`;
  }

  update(id: number, updateLicensekeyDto: UpdateLicensekeyDto) {
    return `This action updates a #${id} licensekey`;
  }

  remove(id: number) {
    return `This action removes a #${id} licensekey`;
  }
}
