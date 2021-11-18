import { ApiProperty } from '@nestjs/swagger';
import { RegisterDTO } from '../../auth/dto/register.dto';
export class AddNewLicenseDto{
    @ApiProperty()
    licenseKey:string
}

export class AddBulkNewLicensesDto{
    @ApiProperty()
    licenseKeys:[string]
}

export class UpdateProfileDto{
    @ApiProperty()
    attributes:[{ Name: string, Value: any }]
}

export class AdminCreateUserDTO extends RegisterDTO {
    @ApiProperty()
    isEmailVerified: boolean;
  
    @ApiProperty()
    isPhoneNumberVerified: boolean;
  
    @ApiProperty()
    group: string;
  
    @ApiProperty()
    sendInvitationByEmail: boolean
  }