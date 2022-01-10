import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {

    @IsNotEmpty()
    @ApiProperty()
    name: string;
  
    @ApiProperty()
    description: string;
}