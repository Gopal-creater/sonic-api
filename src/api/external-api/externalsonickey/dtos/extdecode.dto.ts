import { ApiProperty } from '@nestjs/swagger';

export class ExtDecodeDto {

    @ApiProperty({ type: 'string', format: 'binary' })
    mediaFile:any;
  }