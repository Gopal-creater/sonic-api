import { CreateApiKeyDto,AdminCreateApiKeyDto } from './create-api-key.dto';
import { PartialType,OmitType } from '@nestjs/swagger';

export class UpdateApiKeyDto extends PartialType(OmitType(CreateApiKeyDto,['company','customer','type'])) {}

export class AdminUpdateApiKeyDto extends PartialType(AdminCreateApiKeyDto) {}