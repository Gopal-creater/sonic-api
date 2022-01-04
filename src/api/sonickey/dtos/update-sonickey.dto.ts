import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty, OmitType, PartialType,PickType } from '@nestjs/swagger';

export class UpdateSonicKeyDto extends PartialType(
  PickType(SonicKeyDto, [
    'contentName',
    'version',
    'isrcCode',
    'iswcCode',
    'tuneCode',
    'contentOwner',
    'distributor',
    'contentDescription',
    'additionalMetadata'
  ] as const),
) {}
