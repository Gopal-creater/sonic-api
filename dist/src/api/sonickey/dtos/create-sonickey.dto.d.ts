import { SonicKeyDto } from './sonicKey.dto';
export declare class CreateSonicKeyFromJobDto extends SonicKeyDto {
    sonicKey: string;
    job: string;
    owner: string;
    license: string;
}
export declare class CreateSonicKeyFromBinaryDto extends SonicKeyDto {
    sonicKey: string;
    license: string;
}
