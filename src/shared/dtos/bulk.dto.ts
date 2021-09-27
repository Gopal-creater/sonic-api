import { ApiProperty } from '@nestjs/swagger';

export class BulkByIdsDto {
    @ApiProperty({ type: [String] })
    ids: [string];
  }