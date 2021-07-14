import { LicensekeyService } from './licensekey.service';
import { CreateLicensekeyDto } from './dto/create-licensekey.dto';
import { UpdateLicensekeyDto } from './dto/update-licensekey.dto';
export declare class LicensekeyController {
    private readonly licensekeyService;
    constructor(licensekeyService: LicensekeyService);
    create(createLicensekeyDto: CreateLicensekeyDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateLicensekeyDto: UpdateLicensekeyDto): string;
    remove(id: string): string;
}
