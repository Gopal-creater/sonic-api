import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  AddUserToCompanyDto,
  MakeAdminCompanyDto,
  RemoveUserFromCompanyDto
} from '../dtos/index';
import { UserService } from '../services/user.service';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Delete,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { Roles } from 'src/constants/Enums';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { CompanyService } from '../../company/company.service';
import { UserCompanyService } from '../services/user-company.service';

@ApiTags('User Controller')
@Controller('users')
export class UserCompanyController {
  constructor(
    private readonly userServices: UserService,
    private readonly companyService: CompanyService,
    private readonly userCompanyService: UserCompanyService,
  ) {}

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'add user to company' })
  @Post('/companies/add-user-to-company')
  async addUserToCompany(@Body() addUserToCompanyDto: AddUserToCompanyDto) {
    const { user, company } = addUserToCompanyDto;
    const validUser = await this.userServices.findById(user)
    if(!validUser){
      throw new NotFoundException("Invalid user")
    }
    const validCompany = await this.companyService.findById(company)
    if(!validCompany){
      throw new NotFoundException("Invalid company")
    }
    return this.userCompanyService.addUserToCompany(validUser, validCompany);
  }

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard,RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'remove user from company' })
  @Delete('/companies/remove-user-from-company')
  async removeUserFromCompany(
    @Body() removeUserFromCompanyDto: RemoveUserFromCompanyDto,
  ) {
    const { user, company } = removeUserFromCompanyDto;
    const validUser = await this.userServices.findById(user)
    if(!validUser){
      throw new NotFoundException("Invalid user")
    }
    const validCompany = await this.companyService.findById(company)
    if(!validCompany){
      throw new NotFoundException("Invalid company")
    }
    return this.userCompanyService.removeUserFromCompany(validUser,validCompany);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get company of particular user' })
  @Get('/companies/list-companies/:user')
  async listAllGroupsForUser(@Param('user') user: string) {
    const validUser = await this.userServices.findById(user)
    return this.userCompanyService.listAllCompaniesForUser(validUser);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'make admin company' })
  @Post('/companies/make-admin-company')
  async makeAdminCompany(@Body() makeAdminCompanyDto: MakeAdminCompanyDto) {
    const { user, company } = makeAdminCompanyDto;
    const validUser = await this.userServices.findById(user)
    if(!validUser){
      throw new NotFoundException("Invalid user")
    }
    const validCompany = await this.companyService.findById(company)
    if(!validCompany){
      throw new NotFoundException("Invalid company")
    }
    return this.companyService.makeCompanyAdminUser(company,user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'make admin company' })
  @Get('/companies/get-admin-company/:user')
  async getAdminCompany(@Param('user') user: string) {
    const validUser = await this.userServices.findById(user)
    if(!validUser){
      throw new NotFoundException("Invalid user")
    }
    return this.userCompanyService.getCompanyAdmin(validUser);
  }
}
