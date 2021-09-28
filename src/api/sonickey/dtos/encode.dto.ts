import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsJSON } from 'class-validator';
import { Transform } from 'class-transformer';

export class EncodeDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  mediaFile: any;

  @IsNotEmpty()
  @IsJSON()
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
