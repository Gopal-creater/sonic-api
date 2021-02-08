import { SonicContent } from '../../../../schemas/soniccontent.schema';
export interface IMetaUpdate extends Omit<SonicContent, 'staticMetadata'> {
}
export declare class ExtUpdateDto {
    readonly sonicContent: IMetaUpdate;
}
