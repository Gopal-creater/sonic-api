export interface LicenceAttributeI {
    name?: string;
    key?: string;
    expiry?: string;
    uses?: number;
    protected?: boolean;
    suspended?: boolean;
    metadata?: {
        [key: string]: any;
    };
}
export interface CreateLicenceI {
    attribute?: LicenceAttributeI;
    relation: {
        policyId: string;
        userId: string;
    };
}
export interface LicenceI {
    attribute?: LicenceAttributeI;
    relation: {
        policyId: string;
        userId: string;
    };
}
export interface UpdateLicenceI extends Omit<LicenceAttributeI, 'uses'> {
}
