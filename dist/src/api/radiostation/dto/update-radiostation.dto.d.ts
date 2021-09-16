import { CreateRadiostationDto } from './create-radiostation.dto';
declare const UpdateRadiostationDto_base: import("@nestjs/common").Type<Omit<Partial<CreateRadiostationDto>, "streamingUrl" | "credential" | "owner">>;
export declare class UpdateRadiostationDto extends UpdateRadiostationDto_base {
}
export {};
