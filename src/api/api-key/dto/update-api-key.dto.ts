import { PartialType } from '@nestjs/mapped-types';
import { CreateApiKeyDto,AdminCreateApiKeyDto } from './create-api-key.dto';

export class UpdateApiKeyDto extends PartialType(CreateApiKeyDto) {}

export class AdminUpdateApiKeyDto extends PartialType(AdminCreateApiKeyDto) {}