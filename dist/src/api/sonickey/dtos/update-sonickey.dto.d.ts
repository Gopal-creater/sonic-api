import { SonicKeyDto } from './sonicKey.dto';
declare const UpdateSonicKeyDto_base: import("@nestjs/common").Type<Partial<Omit<SonicKeyDto, "encodingStrength" | "contentType" | "contentCreatedDate" | "contentDuration" | "contentSize" | "contentFilePath" | "contentFileType" | "contentEncoding" | "contentSamplingFrequency" | "contentFileName">>>;
export declare class UpdateSonicKeyDto extends UpdateSonicKeyDto_base {
}
export {};
