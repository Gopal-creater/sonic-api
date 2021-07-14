import { CreateLicensekeyDto } from './dto/create-licensekey.dto';
import { UpdateLicensekeyDto } from './dto/update-licensekey.dto';
export declare class LicensekeyService {
    create(createLicensekeyDto: CreateLicensekeyDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateLicensekeyDto: UpdateLicensekeyDto): string;
    remove(id: number): string;
}
