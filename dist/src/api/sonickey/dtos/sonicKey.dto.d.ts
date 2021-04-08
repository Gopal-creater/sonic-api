import { SonicKey } from '../../../schemas/sonickey.schema';
declare const SonicKeyDto_base: import("@nestjs/common").Type<Pick<SonicKey, "encodingStrength" | "contentType" | "contentDescription" | "contentCreatedDate" | "contentDuration" | "contentSize" | "contentFilePath" | "contentFileType" | "contentEncoding" | "contentSamplingFrequency" | "isrcCode" | "iswcCode" | "tuneCode" | "contentName" | "contentOwner" | "contentValidation" | "contentFileName" | "contentQuality" | "additionalMetadata">>;
export declare class SonicKeyDto extends SonicKeyDto_base {
}
export {};
