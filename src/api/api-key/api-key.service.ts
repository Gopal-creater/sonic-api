import { Injectable, UnprocessableEntityException,Inject, forwardRef } from '@nestjs/common';
import { AdminCreateApiKeyDto } from './dto/create-api-key.dto';
import { AdminUpdateApiKeyDto } from './dto/update-api-key.dto';
import { ApiKey } from './schemas/api-key.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AnyObject, FilterQuery, Model, AnyKeys, UpdateQuery } from 'mongoose';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { MongoosePaginateApiKeyDto } from './dto/mongoosepaginate-apikey.dto';
import { UserService } from '../user/services/user.service';
import { CompanyService } from '../company/company.service';
import { ApiKeyType } from 'src/constants/Enums';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectModel(ApiKey.name)
    public readonly apiKeyModel: Model<ApiKey>,

    @Inject(forwardRef(()=>UserService))
    public readonly userService: UserService,
    public readonly companyService: CompanyService
  ) {}

  async create(doc: AnyObject | AnyKeys<ApiKey>) {
    const newApiKey = await this.apiKeyModel.create({
      ...doc
    });
    return newApiKey.save();
  }

  async findOrCreateApiKeyForCompanyUser(user:string,createdBy?:string){
    var now = new Date();
    var startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    var apiKey = await this.apiKeyModel.findOne({
      customer:user,
      type:ApiKeyType.INDIVIDUAL,
      disabled: false,
      revoked:false,
      suspended: false,
      validity: { $gte: startOfToday },
    });
    if(!apiKey){
      apiKey = await this.createDefaultApiKeyForCompanyUser(user,createdBy)
    }
    return apiKey
  }

  async findOrCreateApiKeyForCompany(user:string,company:string,createdBy?:string){
    var now = new Date();
    var startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    var apiKey = await this.apiKeyModel.findOne({
      company:company,
      type:ApiKeyType.COMPANY,
      disabled: false,
      revoked:false,
      suspended: false,
      validity: { $gte: startOfToday },
    });
    if(!apiKey){
      apiKey = await this.createDefaultApiKeyForCompany(user,company,createdBy)
    }
    return apiKey
  }

  async createDefaultApiKeyForCompanyUser(user:string,createdBy?:string){
    const newLicenseKey =  await this.apiKeyModel.create({
      customer: user,
      type: ApiKeyType.INDIVIDUAL,
      validity: new Date(new Date().setMonth(new Date().getMonth() + 7)),
      createdBy: createdBy||'system_generate'
    });
    return newLicenseKey.save()
  }

  async createDefaultApiKeyForCompany(user:string,company:string,createdBy?:string){
    const newLicenseKey =  await this.apiKeyModel.create({
      customer: user,
      company:company,
      type: ApiKeyType.COMPANY,
      validity: new Date(new Date().setMonth(new Date().getMonth() + 7)),
      createdBy: createdBy||'system_generate'
    });
    return newLicenseKey.save()
  }

  async makeEnableDisable(id:string,disabled:boolean){
    const oldApiKey = await this.apiKeyModel.findById(id)
    if(!oldApiKey){
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Item not found',
      });
    }
    if(oldApiKey.suspended){
      throw new UnprocessableEntityException("Your key is suspended, please contact your admin.")
    }
    return this.apiKeyModel.findOneAndUpdate({_id:id},{
      disabled:disabled
    },{new:true})
  }

  async findAll(queryDto: ParsedQueryDto):Promise<MongoosePaginateApiKeyDto> {
    const { limit,skip,sort,page,filter,select, populate} = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;


    return await this.apiKeyModel["paginate"](filter,paginateOptions)
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    return this.apiKeyModel
      .find(filter || {})
      .count()
  }

  findOne(filter: FilterQuery<ApiKey>) {
    return this.apiKeyModel.findOne(filter);
  }

  findById(id: string) {
    return this.apiKeyModel.findById(id);
  }

  update(
    id: string,
    updateApiKeyDto: UpdateQuery<ApiKey>
  ) {
    return this.apiKeyModel.findByIdAndUpdate(
      id,
      updateApiKeyDto,
      {
        new: true,
      },
    );
  }

  async getEstimateCount() {
    return this.apiKeyModel.estimatedDocumentCount()
  }

  async removeById(id: string) {
    const apiKey = await this.apiKeyModel.findById(id);
    if (!apiKey) {
      return Promise.reject({
        notFound: true,
        status: 404,
        message: 'Item not found',
      });
    }
    return this.apiKeyModel.findByIdAndRemove(id);
  }
}
