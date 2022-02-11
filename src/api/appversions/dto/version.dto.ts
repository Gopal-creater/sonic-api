import { ApiProperty, OmitType } from '@nestjs/swagger';
import { AppVersion } from '../schemas/appversions.schema';
export class Version extends OmitType(AppVersion,  [
  's3FileMeta',
  'contentVersionFilePath', 
  'originalVersionFileName' 
]) {}
