export declare class UserAttributesObj {
    sub?: string;
    'cognito:groups'?: string[];
    email_verified?: boolean;
    phone_number_verified?: boolean;
    phone_number?: string;
    email?: string;
}
export declare class UserSession {
    sub: string;
    'cognito:groups': string[];
    email_verified: boolean;
    'cognito:preferred_role': string;
    iss: string;
    phone_number_verified: boolean;
    'cognito:username': string;
    'cognito:roles': string[];
    aud: string;
    event_id: string;
    token_use: string;
    auth_time: number;
    phone_number: string;
    exp: number;
    iat: number;
    email: string;
}
