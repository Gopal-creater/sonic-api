import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty } from '@nestjs/swagger';

export class EncodeDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  mediaFile: any;

  @ApiProperty()
  data: SonicKeyDto;
}
