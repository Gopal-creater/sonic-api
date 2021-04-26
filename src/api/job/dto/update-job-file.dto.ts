import { ApiProperty, OmitType,PartialType } from '@nestjs/swagger';
import { CreateSonicKeyFromJobDto } from '../../sonickey/dtos/create-sonickey.dto';
import { CreateJobFileDto } from './create-job-file.dto';

export class UpdateJobFileDto extends PartialType(CreateJobFileDto) {
    @ApiProperty()
    isComplete?:boolean
}

export class AddKeyAndUpdateJobFileDto {
    @ApiProperty()
    jobFile:UpdateJobFileDto

    @ApiProperty()
    sonicKeyDetail:CreateSonicKeyFromJobDto
}