import { ApiProperty } from '@nestjs/swagger';


export class DeleteBulkRadiostationDto {
    @ApiProperty()
    ids: [string];
}