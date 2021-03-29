import { SonicKeyDto } from './sonicKey.dto';
export declare class CreateSonicKeyFromJobDto extends SonicKeyDto {
    sonicKey: string;
    job: string;
    owner: string;
    licenseId: string;
}
