export declare class CreateApiKeyDto {
    customer: string;
    groups: [string];
    validity?: Date;
    disabled?: boolean;
    type?: string;
    suspended?: boolean;
    revoked?: boolean;
    metaData?: Map<string, any>;
}
export declare class AdminCreateApiKeyDto {
    customer: string;
    groups: [string];
    validity?: Date;
    disabled?: boolean;
    type?: string;
    suspended?: boolean;
    revoked?: boolean;
    metaData?: Map<string, any>;
}
