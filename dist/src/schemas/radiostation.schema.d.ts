declare class Credential {
    username: string;
    password: string;
}
export declare class RadioStation {
    constructor(data?: Partial<RadioStation>);
    id?: string;
    name: string;
    streamingUrl: string;
    website: string;
    logo: string;
    credential: Credential;
    owner: string;
    createdAt: Date;
    startedAt: Date;
    stopAt: Date;
    isStreamStarted: boolean;
    notes: {
        [key: string]: any;
    };
}
export {};
