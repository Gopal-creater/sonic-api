import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  NotFoundException,
  Version,
  BadRequestException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { Response } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { RolesAllowed } from 'src/api/auth/decorators';
import { JwtAuthGuard, RoleBasedGuard } from 'src/api/auth/guards';
import { Roles, SystemRoles } from 'src/constants/Enums';
import { AnyApiQueryTemplate } from '../../shared/decorators/anyapiquerytemplate.decorator';
import { ParseQueryValue } from 'src/shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';
import { CreateCompanySecurityGuard } from './guards/create-company.guard';
import { ChangeCompanyAdminSecurityGuard } from './guards/change-company-admin-security.guard';
import { GetCompanySecurityGuard } from './guards/get-company-security.guard';
import { UpdateCompanySecurityGuard } from './guards/update-company-security.guard';
import { DeleteCompanySecurityGuard } from './guards/delete-company-security.guard';
import { User } from '../auth/decorators/user.decorator';
import { UserDB } from '../user/schemas/user.db.schema';
import { extractFileName } from 'src/shared/utils';
import { FileHandlerService } from '../../shared/services/file-handler.service';

@ApiTags('Company Controller (D & M May 2022)')
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly fileHandlerService: FileHandlerService,
  ) {}

  @RolesAllowed(Roles.ADMIN, Roles.PARTNER_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard, CreateCompanySecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create company' })
  @Post()
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() loggedInUser: UserDB,
  ) {
    const { owner } = createCompanyDto;

    if (owner) {
      const userFromDb = await this.companyService.userService.getUserProfile(
        owner,
      );
      if (!userFromDb) throw new NotFoundException('Unknown user');

      const isalreadyOwnCompany = await this.companyService.findOne({
        owner: owner,
      });
      if (userFromDb.adminCompany || isalreadyOwnCompany)
        throw new NotFoundException(
          'Given user already own the company, please choose different user',
        );
    }

    return this.companyService.create({
      ...createCompanyDto,
      createdBy: loggedInUser?._id,
    });
  }

  @ApiOperation({
    summary: 'Get companies',
  })
  @RolesAllowed(Roles.ADMIN, Roles.PARTNER_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @Get()
  findAll(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.companyService.findAll(queryDto);
  }

  @ApiOperation({
    summary: 'Get encodes by companies',
  })
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @Get('/reports/get-encodes-by-companies')
  getEncodesByCompaniesReport(
    @Query(new ParseQueryValue()) queryDto: ParsedQueryDto,
  ) {
    return this.companyService.getEncodesByCompaniesReport(queryDto);
  }

  /**
   * @param targetUser
   * @param queryDto
   * @returns
   */
  @Get('/export/encodes-by-companies/:format')
  @ApiParam({ name: 'format', enum: ['xlsx', 'csv'] })
  @ApiOperation({ summary: 'Export Encodes By Company' })
  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  async exportEncodesByCompaniesReport(
    @Res() res: Response,
    @Param('format') format: string,
    @Query(new ParseQueryValue()) queryDto?: ParsedQueryDto,
  ) {
    if (!['xlsx', 'csv'].includes(format))
      throw new BadRequestException('Unsupported format');
    queryDto.limit = queryDto?.limit <= 2000 ? queryDto?.limit : 2000;
    const filePath = await this.companyService.exportEncodeByCompaniesReport(
      queryDto,
      format,
    );
    const fileName = extractFileName(filePath);
    res.download(
      filePath,
      `exported_encodes_by_companies_${format}.${fileName.split('.')[1]}`,
      err => {
        if (err) {
          this.fileHandlerService.deleteFileAtPath(filePath);
          res.send(err);
        }
        this.fileHandlerService.deleteFileAtPath(filePath);
      },
    );
  }

  @RolesAllowed(Roles.ADMIN, Roles.PARTNER_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard, ChangeCompanyAdminSecurityGuard)
  @Put(':id/change-company-admin-user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change admin user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: { type: 'string' },
      },
    },
  })
  async changeAdminUser(
    @Param('id') company: string,
    @Body('user') user: string,
    @User() loggedInUser: UserDB,
  ) {
    const companyFromDb = await this.companyService.findOne({
      _id: company,
    });
    if (!companyFromDb) throw new NotFoundException('Unknown company');

    await this.companyService.makeCompanyAdminUser(company, user);
    return this.companyService.update(company, {
      updatedBy: loggedInUser?._id,
    });
  }

  @Put(':id')
  @RolesAllowed(Roles.ADMIN, Roles.COMPANY_ADMIN, Roles.PARTNER_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard, UpdateCompanySecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update company' })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() loggedInUser: UserDB,
  ) {
    const { owner } = updateCompanyDto;
    if (owner) {
      const userFromDb = await this.companyService.userService.getUserProfile(
        owner,
      );
      if (!userFromDb) throw new NotFoundException('Unknown user');

      const isalreadyOwnCompany = await this.companyService.findOne({
        owner: owner,
      });
      if (userFromDb.adminCompany || isalreadyOwnCompany)
        throw new NotFoundException(
          'Given user already own the company, please choose different user',
        );
    }
    return this.companyService.update(id, {
      ...updateCompanyDto,
      updatedBy: loggedInUser?._id,
    });
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @AnyApiQueryTemplate()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get count of all companies also accept filter as query params',
  })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.companyService.getCount(queryDto);
  }

  @Get('/estimate-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all count of all companies',
  })
  async getEstimateCount() {
    return this.companyService.getEstimateCount();
  }

  @Delete(':id')
  @RolesAllowed(Roles.ADMIN, Roles.PARTNER_ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard, DeleteCompanySecurityGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove company' })
  async remove(@Param('id') id: string) {
    const delectedCompany = await this.companyService.removeById(id);
    if (!delectedCompany) {
      return new NotFoundException();
    }
    return delectedCompany;
  }

  @RolesAllowed()
  @UseGuards(JwtAuthGuard, RoleBasedGuard, GetCompanySecurityGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findById(@Param('id') id: string) {
    const company = await this.companyService.findById(id);
    if (!company) {
      return new NotFoundException();
    }
    return company;
  }
}
