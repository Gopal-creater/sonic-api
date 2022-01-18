import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateGroupDto {

    @IsNotEmpty()
    @ApiProperty()
    name: string;
  
    @ApiProperty()
    description: string;
}