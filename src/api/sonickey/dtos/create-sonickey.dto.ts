import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class CreateSonicKeyFromJobDto extends SonicKeyDto {
    @ApiProperty()
    sonicKey:string

    @ApiProperty()
    job:string

    @ApiProperty()
    owner:string

    @ApiProperty()
    license:string

    @ApiProperty()
    licenseId:string
}


export class CreateSonicKeyFromBinaryDto extends SonicKeyDto {

    @IsNotEmpty()
    @ApiProperty()
    sonicKey:string

    @IsNotEmpty()
    @ApiProperty()
    license:string
}
