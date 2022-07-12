import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UnSubscribeRadioMonitorDto {
  @IsNotEmpty()
  @ApiProperty()
  radioMonitor: string;
}
