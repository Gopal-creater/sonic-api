export declare class Job {
    constructor(data?: Partial<Job>);
    id: string;
    name: string;
    owner: string;
    licenseId: string;
    reservedLicenceCount: number;
    usedLicenceCount: number;
    isComplete?: boolean;
    createdAt: Date;
    completedAt: Date;
    jobDetails: {
        [key: string]: any;
    }[];
}
