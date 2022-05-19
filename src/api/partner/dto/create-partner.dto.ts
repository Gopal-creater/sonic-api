import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { Address } from 'src/api/company/schemas/company.schema';
import { partnerTypes } from '../constant';

export class CreatePartnerDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(partnerTypes)
  partnerType: string;

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
