import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PublicDecodeDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  mediaFile: any;
}

