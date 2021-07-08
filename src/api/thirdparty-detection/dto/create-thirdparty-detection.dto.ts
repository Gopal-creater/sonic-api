import { ApiProperty, OmitType } from '@nestjs/swagger';
export class CreateThirdpartyDetectionDto{
    @ApiProperty()
    sonicKey: string;
  
    @ApiProperty()
    detectionTime?: Date=new Date();
  
    @ApiProperty()
    metaData?: Map<string, any>; 
}