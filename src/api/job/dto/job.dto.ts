import { ApiProperty } from '@nestjs/swagger';
export class JobDto {
    @ApiProperty()
    owner: string;

    @ApiProperty()
    licenseId: string
  
    @ApiProperty()
    jobDetails: Record<string,any>[]
}