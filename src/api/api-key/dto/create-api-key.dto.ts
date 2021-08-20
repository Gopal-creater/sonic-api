import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiKey } from '../schemas/api-key.schema';
export class CreateApiKeyDto extends OmitType(ApiKey, [
    'disabled',
    'customer',
    'suspended',
    'validity',
    'groups',
    'type'
  ]) {}

  export class AdminCreateApiKeyDto extends OmitType(ApiKey, []) {}