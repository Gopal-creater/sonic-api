import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreatePartnerUserDto {
    @ApiProperty()
    @IsNotEmpty()
    userName: string;
  
    @ApiProperty()
    @IsNotEmpty()
    password: string;
  
    @ApiProperty()
    phoneNumber?: string;
  
    @ApiProperty()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty()
    isEmailVerified: boolean;
  
    @ApiProperty()
    isPhoneNumberVerified: boolean;
  
    @ApiProperty()
    company?: string;
  
    @ApiProperty()
    sendInvitationByEmail: boolean;
  }

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