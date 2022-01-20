import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Address } from '../schemas/company.schema';

export class CreateCompanyDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  contactNo: string;

  @ApiProperty()
  address: Address;

  @IsNotEmpty()
  @ApiProperty()
  owner: string;
}
