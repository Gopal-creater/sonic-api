import { PartialType } from '@nestjs/mapped-types';
import { CreateChargebeeDto } from './create-chargebee.dto';

export class UpdateChargebeeDto extends PartialType(CreateChargebeeDto) {}