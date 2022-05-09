import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Address } from 'src/api/company/schemas/company.schema';

export class CreatePartnerDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @ApiProperty()
  contactNo: string;

  @ApiProperty()
  address: Address;

  @ApiProperty()
  owner: string;
}
