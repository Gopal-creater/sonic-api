import { ApiProperty } from '@nestjs/swagger';


export class BulkRadiostationDto {
    @ApiProperty()
    ids: [string];
}