import { ApiProperty, OmitType } from '@nestjs/swagger';
import { JobFile } from '../../job/schemas/jobfile.schema';
import { ThirdpartyDetection } from '../schemas/thirdparty-detection.schema';
export class CreateThirdpartyDetectionDto extends ThirdpartyDetection {}