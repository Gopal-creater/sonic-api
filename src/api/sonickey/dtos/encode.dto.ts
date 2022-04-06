import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsJSON,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  Length
} from 'class-validator';
import { Transform, plainToClass, Type } from 'class-transformer';

export class EncodeDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  mediaFile: any;

  @ValidateNested()
  @Transform(value => plainToClass(SonicKeyDto, JSON.parse(value)))
  // @Type(() => SonicKeyDto)
  // @IsNotEmpty()
  // @IsJSON()
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

export class QueueFileSpecDto {
  @IsNotEmpty()
  @ApiProperty()
  filePath: string;

  @ApiProperty()
  metaData: SonicKeyDto;
}
export class EncodeFromQueueDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QueueFileSpecDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @ApiProperty({ type: [QueueFileSpecDto] })
  fileSpecs: [QueueFileSpecDto];
}
