import { PartialType, OmitType } from '@nestjs/mapped-types';
import { TrackDto } from './create-track.dto';

export class UpdateTrackDto extends PartialType(
  OmitType(TrackDto, ['apiKey', 'license','createdByUser']),
) {}
