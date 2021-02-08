import { SonicKeyDto } from './../../../sonickey/dtos/sonicKey.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ExtEncodeDto {

    @ApiProperty({ type: 'string', format: 'binary' })
    mediaFile:any;

    @ApiProperty()
    data?:SonicKeyDto
  }