import { LicensekeyService } from '../services/licensekey.service';
import { AddOwnerDto } from '../dto/owner/owner.dto';
export declare class LicensekeyOwnerController {
    private readonly licensekeyService;
    constructor(licensekeyService: LicensekeyService);
    create(addOwnerDto: AddOwnerDto, licenseId: string, updatedBy: string): Promise<import("../schemas/licensekey.schema").LicenseKey>;
    remove(licenseId: string, usernameOrSub: string): Promise<import("../schemas/licensekey.schema").LicenseKey>;
}
