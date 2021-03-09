import { ApiProperty } from '@nestjs/swagger';

export class BulkRadiostationDto {
  @ApiProperty({ type: [String] })
  ids: [string];
}
