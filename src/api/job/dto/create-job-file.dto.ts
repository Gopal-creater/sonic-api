import { ApiProperty, OmitType } from '@nestjs/swagger';
import { JobFile } from '../../../schemas/jobfile.schema';
export class CreateJobFileDto extends OmitType(JobFile, [
    'isComplete',
    'sonicKey'
  ]) {}