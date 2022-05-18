import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TestMailDto {
  @IsNotEmpty()
  @ApiProperty()
  toEmail: string;

  @IsNotEmpty()
  @ApiProperty()
  htmlBody: string;
}
