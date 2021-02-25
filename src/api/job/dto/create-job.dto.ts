import { ApiProperty } from '@nestjs/swagger';
export class CreateJobDto {
    @ApiProperty()
    owner: string;

    @ApiProperty()
    licenseId: string
  
    @ApiProperty()
    jobDetails: Record<string, any>[]
}