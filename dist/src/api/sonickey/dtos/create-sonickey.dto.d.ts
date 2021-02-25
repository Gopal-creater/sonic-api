import { SonicKeyDto } from './sonicKey.dto';
export declare class CreateSonicKeyDto extends SonicKeyDto {
    sonicKey: string;
    job: string;
}
export declare class CreateSonicKeyFromJobDto extends SonicKeyDto {
    sonicKey: string;
    job: string;
    licenseId: string;
}
