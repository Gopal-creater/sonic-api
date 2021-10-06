import { ApiProperty, OmitType,PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DownloadS3FileDto{
    @ApiProperty()
    @IsNotEmpty()
    key:string
}