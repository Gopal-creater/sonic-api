import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}