import { CreateCompanyDto } from './create-company.dto';
import { OmitType,PartialType } from '@nestjs/swagger';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}