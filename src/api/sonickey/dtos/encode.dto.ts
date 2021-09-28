import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class EncodeDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  mediaFile: any;

  @IsNotEmpty()
  @Transform((value, obj) => value && JSON.parse(value))
  @ApiProperty()
  data: SonicKeyDto;
}

export class EncodeFromUrlDto {
  @IsNotEmpty()
  @ApiProperty()
  mediaFile: string;

  @IsNotEmpty()
  @ApiProperty()
  data: SonicKeyDto;
}
