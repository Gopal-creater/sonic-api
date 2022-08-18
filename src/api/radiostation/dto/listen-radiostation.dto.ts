import { ApiProperty } from '@nestjs/swagger';

export class ListeningStreamDto {
  @ApiProperty({ type: String })
  streamUrl: string;
}