import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsJSON,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  Length,
} from 'class-validator';
import { Transform, plainToClass, Type } from 'class-transformer';
import { CreateSonicKeyDto } from './create-sonickey.dto';
import { BadRequestException } from '@nestjs/common';

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

export class EncodeFromFileDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  mediaFile: any;

  @ValidateNested()
  @Transform(value => {
    try {
      console.log('value', value);
      return value && JSON.parse(value);
    } catch (error) {
      throw new BadRequestException(error);
    }
  })
  @Type(() => CreateSonicKeyDto)
  @IsNotEmpty()
  @ApiProperty()
  data: CreateSonicKeyDto;
}

export class EncodeFromTrackDto {
  @IsNotEmpty()
  @ApiProperty()
  track: string;

  @IsNotEmpty()
  @ApiProperty()
  data: CreateSonicKeyDto;
}

export class EncodeFromUrlDto {
  @IsNotEmpty()
  @ApiProperty()
  mediaFile: string;

  @IsNotEmpty()
  @ApiProperty()
  data: CreateSonicKeyDto;
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
  @ArrayMaxSize(100)
  @ApiProperty({ type: [QueueFileSpecDto] })
  fileSpecs: [QueueFileSpecDto];

  @IsNotEmpty()
  @ApiProperty()
  license?: string;
}
