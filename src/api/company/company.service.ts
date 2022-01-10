import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schemas/company.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    public readonly companyModel: Model<Company>,
  ) {}
  async create(createCompanyDto: CreateCompanyDto) {
    const newCompany = await this.companyModel.create(createCompanyDto);
    return newCompany.save();
  }

  findAll() {
    return this.companyModel.find();
  }

  findOne(id: string) {
    return this.companyModel.findById(id);
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companyModel.findByIdAndUpdate(id, updateCompanyDto);
  }

  remove(id: number) {
    return this.companyModel.findByIdAndRemove(id);
  }
}
