import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateRadiostationDto } from './create-radiostation.dto';

export class UpdateRadiostationDto extends OmitType(
  PartialType(CreateRadiostationDto),
  ['streamingUrl','credential','owner'],
) {}
