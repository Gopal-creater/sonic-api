import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class CreateSonicKeyDto extends SonicKeyDto {
    @ApiProperty()
    sonicKey:string

    @ApiProperty()
    job:string
}


export class CreateSonicKeyFromJobDto extends SonicKeyDto {
    @ApiProperty()
    sonicKey:string

    @ApiProperty()
    job:string

    @ApiProperty()
    licenseId:string
}
