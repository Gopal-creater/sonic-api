import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Job } from '../../../schemas/job.schema';
export class CreateJobDto extends OmitType(Job, [
    'id',
    'isComplete',
    'createdAt',
    'completedAt',

  ]) {}