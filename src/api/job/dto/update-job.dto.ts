import { ApiProperty, OmitType,PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';
export class UpdateJobDto extends PartialType(
  OmitType(CreateJobDto, ['license', 'owner']),
) {}
