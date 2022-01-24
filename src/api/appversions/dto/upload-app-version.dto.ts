import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsJSON,ValidateNested } from 'class-validator';
import { Version } from './version.dto';


export class UploadAppVersionDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  mediaFile: any;

  @ApiProperty()
  data: Version;
}

