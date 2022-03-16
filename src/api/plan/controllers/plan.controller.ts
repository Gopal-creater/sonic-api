import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PlanService } from '../plan.service';
import { CreatePlanDto } from '../dto/create-plan.dto';
import { UpdatePlanDto } from '../dto/update-plan.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { RolesAllowed } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleBasedGuard } from '../../auth/guards/role-based.guard';
import { Roles } from 'src/constants/Enums';

@ApiTags('Plans Controller')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}
  
  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Plan' })
  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }


  @ApiOperation({ summary: 'Get Plans' })
  @Get()
  findAll(@Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto) {
    return this.planService.findAll(parsedQueryDto);
  }

  @ApiOperation({ summary: 'Get Single Plan' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planService.findById(id);
  }

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Plan' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(id, updatePlanDto);
  }

  @RolesAllowed(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleBasedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Plan' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.removeById(id);
  }
}
