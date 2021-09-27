import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DecodeDto {

  @IsNotEmpty()
    @ApiProperty({ type: 'string', format: 'binary' })
    mediaFile:any;
  }