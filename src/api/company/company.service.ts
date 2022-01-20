import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Company } from './schemas/company.schema';
import { UserService } from '../user/services/user.service';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';
import { UserDB } from '../user/schemas/user.db.schema';
import { UserCompanyService } from '../user/services/user-company.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    public readonly companyModel: Model<Company>,

    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,

    @Inject(forwardRef(() => UserCompanyService))
    private readonly userCompanyService: UserCompanyService,
  ) {}
  async create(createCompanyDto: CreateCompanyDto) {
    const { name, owner } = createCompanyDto;
    const newCompany = await this.companyModel.create(createCompanyDto);
    const createdCompany = await newCompany.save();
    //Once saved to db , also save it to cognito group as a company
    const cognitoGroupName = `COM_${name}`;
    await this.userService
      .cognitoCreateGroup(cognitoGroupName)
      .catch(err => console.warn('Warning: Error creating cognito group', err));
    const userfromDb = await this.userService.findById(owner);
    await this.userCompanyService.makeCompanyAdmin(userfromDb, createdCompany);
    return createdCompany;
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
    return this.companyModel.findByIdAndUpdate(id, updateCompanyDto, {
      new: true,
    });
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    return this.companyModel.find(filter || {}).count();
  }

  async getEstimateCount() {
    return this.companyModel.estimatedDocumentCount();
  }

  async removeById(id: string) {
    const company = await this.findById(id);
    const deletedCompany = await this.companyModel.findByIdAndRemove(id);
    await this.userService
      .cognitoDeleteGroup(company.name)
      .catch(err => console.warn('Warning: Error deleting cognito group', err));
    return deletedCompany;
  }
}
