import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRadioMonitorDto {
  @IsNotEmpty()
  @ApiProperty()
  radio: string;
}
