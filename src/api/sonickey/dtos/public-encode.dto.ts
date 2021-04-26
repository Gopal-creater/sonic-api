import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PublicEncodeDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  mediaFile: any;

  @ApiProperty()
  sonickey: SonicKeyDto;
}
