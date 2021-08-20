import { ApiProperty } from '@nestjs/swagger';

export class AddOwnerDto {
  
    @ApiProperty()
    usernameOrSub: string;
}