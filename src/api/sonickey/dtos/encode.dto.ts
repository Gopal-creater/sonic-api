import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsJSON,ValidateNested } from 'class-validator';
import { Transform ,plainToClass,Type} from 'class-transformer';

export class EncodeDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  mediaFile: any;

  @ValidateNested({ each: true })
  @Transform((data) => plainToClass(SonicKeyDto, JSON.parse(data)))
  @Type(() => SonicKeyDto)
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
