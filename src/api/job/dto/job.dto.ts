import { ApiProperty } from '@nestjs/swagger';
export class JobDto {
    @ApiProperty()
    owner: string;

    @ApiProperty()
    licenseId: string
  
    @ApiProperty()
    jobDetails: [{ [key: string]: any }]
}