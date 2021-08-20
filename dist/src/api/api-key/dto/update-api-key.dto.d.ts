import { CreateApiKeyDto, AdminCreateApiKeyDto } from './create-api-key.dto';
declare const UpdateApiKeyDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateApiKeyDto>>;
export declare class UpdateApiKeyDto extends UpdateApiKeyDto_base {
}
declare const AdminUpdateApiKeyDto_base: import("@nestjs/mapped-types").MappedType<Partial<AdminCreateApiKeyDto>>;
export declare class AdminUpdateApiKeyDto extends AdminUpdateApiKeyDto_base {
}
export {};
