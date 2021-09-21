import { RadioStation } from '../schemas/radiostation.schema';
declare const CreateRadiostationDto_base: import("@nestjs/common").Type<Omit<RadioStation, "error" | "startedAt" | "stopAt" | "isStreamStarted" | "isError">>;
export declare class CreateRadiostationDto extends CreateRadiostationDto_base {
}
export {};
