import { ApiProperty, OmitType } from '@nestjs/swagger';
import { RadioStationSonicKey } from '../../../../schemas/radiostation-sonickey.schema';

export class CreateRadiostationSonicKeyDto extends OmitType(
  RadioStationSonicKey,
  ['count', 'radioStation', 'sonicKey'],
) {
  @ApiProperty()
  sonicKey: string;

  @ApiProperty()
  radioStation: string;
}