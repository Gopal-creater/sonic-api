import { SonicContent } from '../../../schemas/soniccontent.schema';
export declare class UpdateMetaDto {
    readonly sonicContent: Omit<SonicContent, 'staticMetadata'>;
}
