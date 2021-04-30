import { ApiProperty,OmitType } from '@nestjs/swagger';
import { RadioStation } from '../schemas/radiostation.schema';

export class CreateRadiostationDto extends OmitType(RadioStation, [
 'startedAt',
 'stopAt',
 'isStreamStarted'
]) {}