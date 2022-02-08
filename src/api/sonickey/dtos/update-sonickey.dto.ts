import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty, OmitType, PartialType,PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { S3FileMeta } from '../schemas/sonickey.schema';

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

export class UpdateSonicKeyFromBinaryDto extends PartialType(
  PickType(SonicKeyDto, [
    'contentName',
    'version',
    'isrcCode',
    'iswcCode',
    'tuneCode',
    'contentOwner',
    'distributor',
    'contentDescription',
    'additionalMetadata',
    
  ] as const),
) {
  @IsOptional()
  @ApiProperty()
  s3FileMeta?: S3FileMeta;
}
