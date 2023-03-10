import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, AnyObject, AnyKeys, UpdateQuery } from 'mongoose';
import { Company } from './schemas/company.schema';
import { UserService } from '../user/services/user.service';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';
import { UserDB } from '../user/schemas/user.db.schema';
import { UserCompanyService } from '../user/services/user-company.service';
import { SystemRoles } from 'src/constants/Enums';
import * as makeDir from 'make-dir';
import * as appRootPath from 'app-root-path';
import * as fs from 'fs';
import * as xlsx from 'xlsx';
import * as XLSXChart from 'xlsx-chart';
import { FileHandlerService } from '../../shared/services/file-handler.service';
import * as AdmZip from 'adm-zip';
import { appConfig } from 'src/config';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    public readonly companyModel: Model<Company>,

    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,

    @Inject(forwardRef(() => UserCompanyService))
    private readonly userCompanyService: UserCompanyService,

    private readonly fileHandlerService: FileHandlerService,
  ) {}
  async create(doc: AnyObject | AnyKeys<Company>) {
    const { owner } = doc;
    const newCompany = await this.companyModel.create(doc);
    const createdCompany = await newCompany.save();
    //Make this user as admin user for this company
    if (owner) {
      await this.userService.userModel.findByIdAndUpdate(owner, {
        userRole: SystemRoles.COMPANY_ADMIN,
        adminCompany: createdCompany._id,
        company: createdCompany._id,
      });
    }
    return this.findById(createdCompany._id);
  }

  async makeCompanyAdminUser(company: string, user: string) {
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
        userRole: SystemRoles.COMPANY_USER,
        adminCompany: null,
      });
    }
    return this.companyModel.findById(company);
  }

  async getEncodesByCompaniesReport(queryDto: ParsedQueryDto) {
    const {
      limit,
      skip,
      sort = { encodesCount: -1 },
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    const sonickeyFilter = {};
    if (filter?.createdAt) {
      sonickeyFilter['createdAt'] = filter?.createdAt;
    }
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: 'SonicKey',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$id', '$company'] },
                ...sonickeyFilter,
                ...relationalFilter
              },
            },
            { $count: 'total' },
          ],
          as: 'encodesCount',
        },
      },
      {
        $addFields: {
          encodesCount: { $sum: '$encodesCount.total' },
        },
      },
      // {
      //   $project: {
      //     _id: 0,
      //     company: { $first: '$company' },
      //     playsCount: '$plays',
      //     uniquePlaysCount: { $size: '$sonicKeys' },
      //     artistsCount: { $size: '$artists' },
      //   },
      // }
    ];
    const aggregate = this.companyModel.aggregate(aggregateArray);
    return this.companyModel['aggregatePaginate'](aggregate, paginateOptions);
  }

  async exportEncodeByCompaniesReport(queryDto: ParsedQueryDto, format: string) {
    const getEncodesByCompaniesReport = await this.getEncodesByCompaniesReport(queryDto);
    var jsonFormat = [];
    for await (const data of getEncodesByCompaniesReport?.docs || []) {
      var excelData = {
        Company: data?.name || '--',
        Encodes: data?.encodesCount || 0
      };
      jsonFormat.push(excelData);
    }
    if (jsonFormat.length <= 0) {
      jsonFormat.push({
        Company: '',
        Encodes: ''
      });
    }
    const destination = await makeDir(appConfig.MULTER_EXPORT_DEST);
    var tobeStorePath: string = '';
    const file = xlsx.utils.book_new();
    const jsonToWorkSheet = xlsx.utils.json_to_sheet(jsonFormat);
    xlsx.utils.book_append_sheet(file, jsonToWorkSheet, 'Encodes By Companies');
    if (format == 'xlsx') {
      tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Encodes_By_Companies`}.xlsx`;
      xlsx.writeFile(file, tobeStorePath);
    } else if (format == 'csv') {
      tobeStorePath = `${destination}/${`${Date.now()}_nameseperator_Encodes_By_Companies`}.csv`;
      xlsx.writeFile(file, tobeStorePath, {
        bookType: 'csv',
        sheet: 'Encodes By Companies',
      });
    }
    return tobeStorePath;
  }

  findAll(queryDto: ParsedQueryDto) {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    var aggregateArray: any[] = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          createdAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $lookup: {
          from: 'Partner',
          localField: 'partner',
          foreignField: '_id',
          as: 'partner',
        },
      },
      { $addFields: { partner: { $first: '$partner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
    ];
    const aggregate = this.companyModel.aggregate(aggregateArray);
    return this.companyModel['aggregatePaginate'](aggregate, paginateOptions);
  }

  findOne(filter: FilterQuery<Company>) {
    return this.companyModel.findOne(filter);
  }

  findById(id: string) {
    return this.companyModel.findById(id);
  }

  async update(id: string, updateCompanyDto: UpdateQuery<Company>) {
    const { owner } = updateCompanyDto;
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      id,
      updateCompanyDto,
      {
        new: true,
      },
    );
    if (owner) {
      await this.userService.userModel.findByIdAndUpdate(owner, {
        userRole: SystemRoles.COMPANY_ADMIN,
        adminCompany: updatedCompany._id,
        company: updatedCompany._id,
      });
    }
    return updatedCompany;
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
