import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Address } from 'src/api/company/schemas/company.schema';
export class CreatePartnerCompanyDto {
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

    @ApiProperty()
    companyType: string;

    @ApiProperty()
    companyUrnOrId: string;
  
    @IsNotEmpty()
    @ApiProperty()
    owner: string;
  }

  export class UpdatePartnerCompanyDto extends OmitType(PartialType(CreatePartnerCompanyDto),['owner']) {}

  export class EditPartnerUserDto {
  
    @ApiProperty()
    name?: string;

    @ApiProperty()
    phoneNumber?: string;

    @ApiProperty()
    country?: string;

    @ApiProperty()
    enabled?: boolean;

  }