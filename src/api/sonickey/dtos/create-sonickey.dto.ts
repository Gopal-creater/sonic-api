import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class CreateSonicKeyFromJobDto extends SonicKeyDto {
    @IsNotEmpty()
    @ApiProperty()
    sonicKey:string

    @ApiProperty()
    contentFilePath:string

    @IsNotEmpty()
    @ApiProperty()
    job:string

    @IsNotEmpty()
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

    @ApiProperty()
    contentFilePath:string

    @IsNotEmpty()
    @ApiProperty()
    license:string
}
