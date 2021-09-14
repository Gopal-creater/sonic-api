import { ApiProperty } from '@nestjs/swagger';

export class DownloadDto {
    @ApiProperty()
    fileURL: string;

    @ApiProperty()
    contentType?: string;
}

export class S3DownloadDto {
    @ApiProperty()
    key: string
}