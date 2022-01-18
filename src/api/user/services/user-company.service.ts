import { Injectable, forwardRef,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDB, UserSchemaName } from '../schemas/user.db.schema';
import { Company } from 'src/api/company/schemas/company.schema';
import { CompanyService } from '../../company/company.service';
import { UserService } from './user.service';

@Injectable()
export class UserCompanyService {
  constructor(
    @Inject(forwardRef(()=>UserService))
    public readonly userService: UserService,

    public readonly companyService: CompanyService,
    @InjectModel(UserSchemaName)
    public readonly userModel: Model<UserDB>,
  ) {}

  async addUserToCompany(
    user: UserDB,
    company: Company
  ) {
     // Also add it in the cognito
     await this.userService.adminAddUserToGroup(user.username,`COM_${company.name}`)
     .catch(err=>console.warn("Warning: Error adding user to cognito group",err))
     const alreadyInCompany = await this.userModel.findOne({
       _id: user.id,
       companies: {$in:[company._id]},
     });
     if (alreadyInCompany) {
       return alreadyInCompany;
     }
    return this.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        $push:{
          companies:company
        }
      },
      {
        new: true,
      },
    );
  }

  async addUserToCompanies(user: UserDB, companies: Company[]) {
    var updatedUser = user;
    for await (const company of companies) {
      updatedUser = await this.addUserToCompany(user, company);
    }
    return updatedUser;
  }

  async removeUserFromCompany(user: UserDB,company:Company) {
   //Also remove user from cognito group
   await this.userService.adminRemoveUserFromGroup(user.username,`COM_${company.name}`)
   .catch(err=>console.warn("Warning: Error removing user from cognito group",err))
    return this.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        $pull: {
          companies:company
        },
      },
      {
        new: true,
      },
    );
  }

  async removeUserFromGCompanies(user: UserDB, companies: Company[]) {
    var updatedUser = user;
    for await (const company of companies) {
      updatedUser = await this.removeUserFromCompany(user, company);
    }
    return updatedUser;
  }

  async makeAdminCompany(user: UserDB,company:Company) {
    return this.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        adminCompany: company.id,
      },
      {
        new: true,
      },
    );
  }

  async listAllCompaniesForUser(user: UserDB):Promise<Company[]>{
    const userWithCompanies = await this.userModel.findById(user.id)
    return userWithCompanies.companies
  }

  async getAdminCompany(user: UserDB):Promise<Company>{
    const userWithAdminCompany = await this.userModel.findById(user.id)
    return userWithAdminCompany.adminCompany
  }
}
