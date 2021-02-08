import { ApiProperty } from '@nestjs/swagger';
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