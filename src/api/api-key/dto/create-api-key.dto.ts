import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiKey } from '../schemas/api-key.schema';
import { ApiKeyType } from 'src/constants/Enums';

  export class CreateApiKeyDto{
    @ApiProperty()
    customer: string;
  
    @ApiProperty({type:String,isArray:true})
    groups: [string];

    @ApiProperty()
    company: string;
  
    @ApiProperty()
    validity?: Date;
  
    @ApiProperty()
    disabled?: boolean;
  
    @ApiProperty()
    type?: string;
  
    @ApiProperty()
    suspended?: boolean;
  
    @ApiProperty()
    revoked?: boolean;
  
    @ApiProperty()
    metaData?: Map<string, any>;
  }

  export class AdminCreateApiKeyDto{
    @ApiProperty()
    customer: string;
  
    @ApiProperty({type:String,isArray:true})
    groups: [string];

    @ApiProperty()
    company: string;
  
    @ApiProperty()
    validity?: Date;
  
    @ApiProperty()
    disabled?: boolean;
  
    @ApiProperty({enum:ApiKeyType})
    type?: string;
  
    @ApiProperty()
    suspended?: boolean;
  
    @ApiProperty()
    revoked?: boolean;
  
    @ApiProperty()
    metaData?: Map<string, any>;
  }