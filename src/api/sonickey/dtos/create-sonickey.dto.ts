import { SonicKeyDto } from './sonicKey.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class CreateSonicKeyDto extends SonicKeyDto {
    @ApiProperty()
    sonicKey:string
}
