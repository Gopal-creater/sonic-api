import { ApiProperty } from "@nestjs/swagger";

export class RegisterDTO {
  @ApiProperty()
  userName: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  licenseKey: string;
}
