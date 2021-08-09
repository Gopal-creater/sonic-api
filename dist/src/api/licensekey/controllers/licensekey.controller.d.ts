/// <reference types="mongoose" />
import { LicensekeyService } from '../services/licensekey.service';
import { CreateLicensekeyDto } from '../dto/create-licensekey.dto';
import { UpdateLicensekeyDto } from '../dto/update-licensekey.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
export declare class LicensekeyController {
    private readonly licensekeyService;
    constructor(licensekeyService: LicensekeyService);
    migrate(): Promise<any>;
    create(createLicensekeyDto: CreateLicensekeyDto, createdBy: string): Promise<import("../schemas/licensekey.schema").LicenseKey>;
    findAll(queryDto?: ParsedQueryDto): Promise<import("../dto/mongoosepaginate-licensekey.dto").MongoosePaginateLicensekeyDto>;
    getCount(queryDto: ParsedQueryDto): Promise<number>;
    findOne(id: string): Promise<import("../schemas/licensekey.schema").LicenseKey>;
    update(id: string, updateLicensekeyDto: UpdateLicensekeyDto, updatedBy: string): Promise<import("../schemas/licensekey.schema").LicenseKey>;
    remove(id: string): import("mongoose").Query<import("../schemas/licensekey.schema").LicenseKey, import("../schemas/licensekey.schema").LicenseKey, {}>;
}
