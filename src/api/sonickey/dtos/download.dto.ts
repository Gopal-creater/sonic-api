import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DownloadDto {
    @IsNotEmpty()
    @ApiProperty()
    fileURL: string;

    @ApiProperty()
    contentType?: string;
}

export class S3DownloadDto {
    @IsNotEmpty()
    @ApiProperty()
    key: string
}