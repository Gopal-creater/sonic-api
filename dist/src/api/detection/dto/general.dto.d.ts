import { SonicKey } from 'src/api/sonickey/schemas/sonickey.schema';
import { RadioStation } from '../../radiostation/schemas/radiostation.schema';
export declare class TopRadioStation {
    _id: string;
    totalKeysDetected: number;
    radioStation: RadioStation;
}
export declare class TopSonicKey {
    _id: string;
    totalHits: number;
    sonicKey: SonicKey;
}
export declare class GraphData {
    _id: any;
    year: number;
    month: number;
    day: number;
    hits: number;
}
export declare class TopRadioStationWithTopSonicKey extends TopRadioStation {
    sonicKeys: TopSonicKey[];
    graphs?: GraphData[];
}
