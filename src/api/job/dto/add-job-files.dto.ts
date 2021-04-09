import { ApiProperty } from '@nestjs/swagger';
import { CreateJobFileDto } from './create-job-file.dto';

export class AddJobFilesDto {
    @ApiProperty()
    jobFiles: CreateJobFileDto[];
}