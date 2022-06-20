import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsIn } from 'class-validator';
import { companyTypes } from '../constant';
import { Address } from '../schemas/company.schema';

export class CreateCompanyDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(companyTypes)
  companyType: string;

  @ApiProperty()
  companyUrnOrId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  contactNo: string;

  @ApiProperty()
  address: Address;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  partner: string;
}
