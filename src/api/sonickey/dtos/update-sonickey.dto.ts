import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class UpdateSonicKeyDto extends PartialType(
  OmitType(SonicKeyDto, [
    'encodingStrength',
    'contentType',
    'contentDuration',
    'contentCreatedDate',
    'contentEncoding',
    'contentFileName',
    'contentFileType',
    'contentSamplingFrequency',
    'contentSize',
  ] as const),
) {}
