import { CreateRadiostationDto } from './create-radiostation.dto';
declare const UpdateRadiostationDto_base: import("@nestjs/common").Type<Omit<Partial<CreateRadiostationDto>, "owner" | "streamingUrl" | "credential">>;
export declare class UpdateRadiostationDto extends UpdateRadiostationDto_base {
}
export {};
