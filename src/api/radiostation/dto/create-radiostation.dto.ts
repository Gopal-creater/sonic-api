import { ApiProperty } from '@nestjs/swagger';

export class Credential {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
  }

export class CreateRadiostationDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    streamingUrl: string;

    @ApiProperty()
    website?: string;

    @ApiProperty()
    logo?: string;

    @ApiProperty()
    credential?: Credential;

    @ApiProperty()
    owner: string;

    @ApiProperty()
    logs: { [key: string]: any };
}