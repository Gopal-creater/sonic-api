import { StaticMetadata } from '../schemas/staticmetadata.schema';
import { VolatileMetadata } from '../schemas/volatilemetadata.schema';
export declare class SonicContent {
    constructor(data?: Partial<SonicContent>);
    staticMetadata?: StaticMetadata;
    volatileMetadata?: VolatileMetadata;
    additionalMetadata?: {
        [key: string]: any;
    };
}
