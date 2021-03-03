import { ApiProperty } from '@nestjs/swagger';

export class CreateRadiostationSonicKeyDto {
    @ApiProperty()
    radioStation: string;

    @ApiProperty()
    sonicKey: string;

    @ApiProperty()
    owner: string;
}