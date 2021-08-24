import { SonicKey } from '../schemas/sonickey.schema';
declare const SonicKeyDto_base: import("@nestjs/common").Type<Omit<SonicKey, "sonicKey" | "job" | "owner" | "license" | "apiKey" | "channel" | "status">>;
export declare class SonicKeyDto extends SonicKeyDto_base {
}
export {};
