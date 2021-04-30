import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Job } from '../schemas/job.schema';
import { CreateJobFileDto } from './create-job-file.dto';
export class CreateJobDto extends OmitType(Job, [
    'isComplete',
    'jobFiles'
  ]) {
    @ApiProperty({isArray:true,type:CreateJobFileDto,required:false})
    jobFiles?:CreateJobFileDto[]
  }