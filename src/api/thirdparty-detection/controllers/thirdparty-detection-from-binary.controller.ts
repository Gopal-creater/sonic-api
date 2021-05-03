import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { ThirdpartyDetectionService } from '../thirdparty-detection.service';
import { CreateThirdpartyDetectionDto } from '../dto/create-thirdparty-detection.dto';
import { UpdateThirdpartyDetectionDto } from '../dto/update-thirdparty-detection.dto';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../../auth/guards/apikey-auth.guard';

@ApiTags('ThirdParty-Binary Controller (protected by x-api-key)')
@ApiSecurity('x-api-key')
@Controller('thirdparty-detection-from-binary')
export class ThirdpartyDetectionFromBinaryController {
  constructor(private readonly thirdpartyDetectionService: ThirdpartyDetectionService) {}
  
  @ApiOperation({ summary: 'Create Detection' })
  @UseGuards(ApiKeyAuthGuard)
  @Post()
  create(@Body() createThirdpartyDetectionDto: CreateThirdpartyDetectionDto) {
    return this.thirdpartyDetectionService.create(createThirdpartyDetectionDto);
  }

  @ApiOperation({ summary: 'Get All Detection' })
  @UseGuards(ApiKeyAuthGuard)
  @Get()
  findAll(@Query(new ParseQueryValue()) queryDto: QueryDto) {
    return this.thirdpartyDetectionService.findAll(queryDto);
  }

  @ApiOperation({ summary: 'Get One Detection' })
  @UseGuards(ApiKeyAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const detection = await this.thirdpartyDetectionService.findById(id);
    if(!detection){
      throw new NotFoundException()
    }
    return detection
  }

  @ApiOperation({ summary: 'Update One Detection' })
  @UseGuards(ApiKeyAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateThirdpartyDetectionDto: UpdateThirdpartyDetectionDto) {
    const detection =await this.thirdpartyDetectionService.update(id, updateThirdpartyDetectionDto);
    if(!detection){
      throw new NotFoundException()
    }
    return detection

  }

  @ApiOperation({ summary: 'Remove One Detection' })
  @UseGuards(ApiKeyAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const detection = await this.thirdpartyDetectionService.remove(id);
    if(!detection){
      throw new NotFoundException()
    }
    return detection
  }
}
