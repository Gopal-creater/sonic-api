import {
  attribute,
  hashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';

@table('SonicKey-New-Schema')
export class SonicKey {
  constructor(data?: Partial<SonicKey>) {
    Object.assign(this, data);
  }

  @hashKey()
  sonicKey?: string;

  @attribute({
    indexKeyConfigurations: {
      ownerIndex: 'HASH',
    },
  })
  owner: string;

  @attribute()
  licenseId?: string;

  @rangeKey({ defaultProvider: () => new Date() })
  createdAt: Date;

  @attribute({ defaultProvider: () => true })
  status?: boolean;

  //Sonic Content Part
  @attribute()
  encodingStrength: number;

  @attribute()
  contentType?: string;

  @attribute()
  contentDescription: string;

  @attribute({ defaultProvider: () => new Date() })
  contentCreatedDate: Date;

  @attribute()
  contentDuration?: number;

  @attribute()
  contentSize: number;

  @attribute()
  contentFilePath: string;

  @attribute()
  contentFileType: string;

  @attribute()
  contentEncoding: string;

  @attribute()
  contentSamplingFrequency: string;

  @attribute()
  contentName?: string;

  @attribute()
  contentOwner?: string;

  @attribute()
  contentValidation?: boolean;

  @attribute()
  contentFileName: string;

  @attribute()
  contentQuality: string;

  @attribute()
  additionalMetadata: { [key: string]: any };
}
