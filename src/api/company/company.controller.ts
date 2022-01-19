import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RolesAllowed } from 'src/api/auth/decorators';
import { JwtAuthGuard, RoleBasedGuard } from 'src/api/auth/guards';
import { Roles } from 'src/constants/Enums';
import { AnyApiQueryTemplate } from '../../shared/decorators/anyapiquerytemplate.decorator';
import { ParseQueryValue } from 'src/shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from 'src/shared/dtos/parsedquery.dto';

@ApiTags('Company Controller')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create company' })
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.companyService.findById(id);
  }

  @Put(':id')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update company' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
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
    summary: 'Get all count of all sonickeys',
  })
  async getEstimateCount() {
    return this.companyService.getEstimateCount();
  }

  @Delete(':id')
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove company' })
  remove(@Param('id') id: string) {
    return this.companyService.removeById(id);
  }
}
