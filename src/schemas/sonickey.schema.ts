import {
  attribute,
  hashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty,IsArray } from 'class-validator';

@table('SonicKey-New-Schema')
export class SonicKey {
  constructor(data?: Partial<SonicKey>) {
    Object.assign(this, data);
  }

  @IsNotEmpty()
  @ApiProperty()
  @hashKey()
  sonicKey?: string;

  @IsNotEmpty()
  @ApiProperty()
  @attribute({
    indexKeyConfigurations: {
      ownerIndex: 'HASH',
    },
  })
  owner: string;

  @IsNotEmpty()
  @ApiProperty()
  @attribute({
    indexKeyConfigurations: {
      jobIndex: 'HASH',
    },
  })
  job: string; //Relation

  @IsNotEmpty()
  @ApiProperty()
  @attribute()
  licenseId?: string;

  @ApiProperty()
  @rangeKey({ defaultProvider: () => new Date() })
  createdAt: Date;

  @ApiProperty()
  @attribute({ defaultProvider: () => true })
  status?: boolean;

  //Sonic Content Part
  @ApiProperty()
  @attribute()
  encodingStrength: number;

  @ApiProperty()
  @attribute()
  contentType?: string;

  @ApiProperty()
  @attribute()
  contentDescription: string;

  @ApiProperty()
  @attribute({ defaultProvider: () => new Date() })
  contentCreatedDate: Date;

  @ApiProperty()
  @attribute()
  contentDuration?: number;

  @ApiProperty()
  @attribute()
  contentSize: number;

  @ApiProperty()
  @attribute()
  contentFilePath: string;

  @ApiProperty()
  @attribute()
  contentFileType: string;

  @ApiProperty()
  @attribute()
  contentEncoding: string;

  @ApiProperty()
  @attribute()
  contentSamplingFrequency: string;

  @ApiProperty()
  @attribute()
  contentName?: string;

  @ApiProperty()
  @attribute()
  contentOwner?: string;

  @ApiProperty()
  @attribute()
  contentValidation?: boolean;

  @ApiProperty()
  @attribute()
  contentFileName: string;

  @ApiProperty()
  @attribute()
  contentQuality: string;

  @ApiProperty()
  @attribute()
  additionalMetadata: { [key: string]: any };
}
