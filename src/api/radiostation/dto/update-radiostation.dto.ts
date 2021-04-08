import { PartialType } from '@nestjs/mapped-types';
import { CreateRadiostationDto } from './create-radiostation.dto';

export class UpdateRadiostationDto extends PartialType(CreateRadiostationDto) {}