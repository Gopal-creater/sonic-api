import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SonicKey } from '../schemas/sonickey.schema';
export class SonicKeyDto extends OmitType(SonicKey, [
    'sonicKey',
    'owner',
    'job',
    'channel',
    'contentFilePath',
    'apiKey',
    'license',
    'status',
    's3FileMeta'
  ]) {}
