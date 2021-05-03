import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ThirdpartyDetection } from '../schemas/thirdparty-detection.schema';
export class CreateThirdpartyDetectionDto extends OmitType(ThirdpartyDetection,['id','customer']) {}