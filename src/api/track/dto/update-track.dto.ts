import { ApiProperty, OmitType, PartialType,PickType } from '@nestjs/swagger';
import { TrackDto } from './create-track.dto';

export class UpdateTrackDto extends PartialType(
  OmitType(TrackDto, ['apiKey', 'license','createdByUser']),
) {}
