import { PartialType } from '@nestjs/mapped-types';
import { CreateLicensekeyDto } from './create-licensekey.dto';

export class UpdateLicensekeyDto extends PartialType(CreateLicensekeyDto) {}