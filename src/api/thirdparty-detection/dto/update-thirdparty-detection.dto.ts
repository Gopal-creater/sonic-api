import { PartialType } from '@nestjs/mapped-types';
import { CreateThirdpartyDetectionDto } from './create-thirdparty-detection.dto';

export class UpdateThirdpartyDetectionDto extends PartialType(CreateThirdpartyDetectionDto) {}