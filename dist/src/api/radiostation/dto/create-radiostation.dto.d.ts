export declare class Credential {
    username: string;
    password: string;
}
export declare class CreateRadiostationDto {
    name: string;
    streamingUrl: string;
    website?: string;
    logo?: string;
    credential?: Credential;
    owner: string;
    logs: {
        [key: string]: any;
    };
}
