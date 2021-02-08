import { CreateLicenceI, UpdateLicenceI } from './interfaces';
import { ConfigService } from '@nestjs/config';
export declare class KeygenService {
    private readonly configService;
    private apiBaseUrl;
    private licenceEndPoint;
    private credentials;
    private adminToken;
    constructor(configService: ConfigService);
    generateToken(): Promise<any>;
    createLicense(license: CreateLicenceI): Promise<any>;
    getAllLicenses(query?: string): Promise<any>;
    getLicenseById(id: string): Promise<any>;
    validateLicence(id: string): Promise<any>;
    updateLicense(id: string, license: UpdateLicenceI): Promise<any>;
    incrementUsage(id: string, increment?: number): Promise<any>;
    decrementUsage(id: string, decrementBy?: number): Promise<any>;
    resetUsage(id: string): Promise<any>;
    deleteLicense(id: string): Promise<any>;
}
