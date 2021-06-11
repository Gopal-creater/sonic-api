import { ApiProperty, OmitType } from '@nestjs/swagger';
import { RadioStationSonicKey } from '../../schemas/radiostation-sonickey.schema';

export class CreateRadiostationSonicKeyDto extends OmitType(
  RadioStationSonicKey,
  ['radioStation', 'sonicKey','detectedDetails'],
) {
  @ApiProperty()
  sonicKey: string;

  @ApiProperty()
  radioStation: string;
}
