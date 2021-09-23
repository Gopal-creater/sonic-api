import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EncodeDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  mediaFile: any;

  @IsNotEmpty()
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
