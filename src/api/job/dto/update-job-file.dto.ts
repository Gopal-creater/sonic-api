import { ApiProperty } from '@nestjs/swagger';
import { CreateSonicKeyFromJobDto } from '../../sonickey/dtos/create-sonickey.dto';

export class UpdateJobFileDto {
    @ApiProperty()
    fileDetail:{ [key: string]: any }
}


export class AddKeyAndUpdateJobFileDto {
    @ApiProperty()
    fileDetail:{ [key: string]: any }

    @ApiProperty()
    sonicKeyDetail:CreateSonicKeyFromJobDto
}