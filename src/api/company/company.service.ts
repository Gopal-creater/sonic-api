import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, AnyObject, AnyKeys } from 'mongoose';
import { Company } from './schemas/company.schema';
import { UserService } from '../user/services/user.service';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';
import { UserDB } from '../user/schemas/user.db.schema';
import { UserCompanyService } from '../user/services/user-company.service';
import { SystemRoles } from 'src/constants/Enums';

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
  async create(doc: AnyObject | AnyKeys<Company>) {
    const { owner } = doc;
    const newCompany = await this.companyModel.create(doc);
    const createdCompany = await newCompany.save();
     //Make this user as admin user for this company
     if (owner) {
      await this.userService.userModel.findByIdAndUpdate(
        owner,
        {
          userRole: SystemRoles.COMPANY_ADMIN,
          adminCompany: createdCompany._id,
          company: createdCompany._id,
        },
      );
    }
    return createdCompany;
  }

  async makeCompanyAdminUser(company:string,user:string) {
    const companyFromDb = await this.companyModel.findById(company);
    await this.companyModel.findByIdAndUpdate(
      company,
      {
        owner: user,
      },
      {
        new: true,
      },
    );
    await this.userService.userModel.findByIdAndUpdate(user, {
      userRole: SystemRoles.COMPANY_ADMIN,
      adminCompany: company,
      company: company,
    });
    if (companyFromDb.owner) {
      //Remove ownership of old user
      await this.userService.userModel.findByIdAndUpdate(companyFromDb.owner, {
        userRole: SystemRoles.COMPANY,
        adminCompany: null,
      });
    }
    return this.companyModel.findById(company);
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
