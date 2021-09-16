import { RadioStation } from '../schemas/radiostation.schema';
declare const CreateRadiostationDto_base: import("@nestjs/common").Type<Omit<RadioStation, "startedAt" | "stopAt" | "isStreamStarted" | "isError" | "error">>;
export declare class CreateRadiostationDto extends CreateRadiostationDto_base {
}
export {};
