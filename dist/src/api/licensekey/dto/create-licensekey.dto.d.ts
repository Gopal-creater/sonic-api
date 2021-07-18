export declare class CreateLicensekeyDto {
    name: string;
    disabled?: boolean;
    suspended?: boolean;
    maxEncodeUses: number;
    encodeUses: number;
    maxDecodeUses: number;
    decodeUses: number;
    validity: Date;
    metaData?: Map<string, any>;
}
