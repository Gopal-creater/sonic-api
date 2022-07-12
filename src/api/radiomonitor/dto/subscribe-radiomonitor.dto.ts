import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SubscribeRadioMonitorDto {
  @IsNotEmpty()
  @ApiProperty()
  radio: string;

  // @ApiProperty()
  // owner?: string;

  // @ApiProperty()
  // company?: string;

  // @ApiProperty()
  // partner?: string;
}
