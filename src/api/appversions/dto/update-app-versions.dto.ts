import { PartialType } from '@nestjs/mapped-types';
import { Version } from './version.dto';

export class UpdateAppVersionDto extends PartialType(Version) {}