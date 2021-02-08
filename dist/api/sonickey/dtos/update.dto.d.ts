import { SonicContent } from './../../../schemas/soniccontent.schema';
export declare class UpdateDto {
    readonly sonicContent: Omit<SonicContent, 'staticMetadata'>;
}
