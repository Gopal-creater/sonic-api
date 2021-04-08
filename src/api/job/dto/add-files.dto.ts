import { ApiProperty } from '@nestjs/swagger';

export class AddFilesDto {
    @ApiProperty()
    jobFiles: { [key: string]: any }[];
}