import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Company } from './schemas/company.schema';
import { UserService } from '../user/services/user.service';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    public readonly companyModel: Model<Company>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  async create(createCompanyDto: CreateCompanyDto) {
    const{name}=createCompanyDto
    const newCompany = await this.companyModel.create(createCompanyDto);
    //Once saved to db , also save it to cognito
    const cognitoGroupName=`COM_${name}`
    await this.userService.cognitoCreateGroup(cognitoGroupName).catch(err=>console.warn("Warning: Error creating cognito group",err))
    return newCompany.save();
  }

  findAll() {
    return this.companyModel.find();
  }

  findOne(filter: FilterQuery<Company>) {
    return this.companyModel.findOne(filter);
  }

  findById(id: string) {
    return this.companyModel.findById(id);
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companyModel.findByIdAndUpdate(id, updateCompanyDto);
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    return this.companyModel
      .find(filter || {})
      .count()
  }

  async getEstimateCount() {
    return this.companyModel.estimatedDocumentCount()
  }

  async removeById(id: string) {
    const company = await this.findById(id)
    const deletedCompany = await this.companyModel.findByIdAndRemove(id)
    await this.userService.cognitoDeleteGroup(company.name).catch(err=>console.warn("Warning: Error deleting cognito group",err))
    return deletedCompany
  }
}
