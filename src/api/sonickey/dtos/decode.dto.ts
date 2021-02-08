import { ApiProperty } from '@nestjs/swagger';

export class DecodeDto {

    @ApiProperty({ type: 'string', format: 'binary' })
    mediaFile:any;
  }