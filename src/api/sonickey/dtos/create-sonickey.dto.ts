import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';


export class CreateSonicKeyFromJobDto extends SonicKeyDto {
    @ApiProperty()
    sonicKey:string

    @ApiProperty()
    job:string

    @ApiProperty()
    owner:string

    @ApiProperty()
    licenseId:string
}
