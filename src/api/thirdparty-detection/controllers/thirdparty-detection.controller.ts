import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { ThirdpartyDetectionService } from '../thirdparty-detection.service';
import { UpdateThirdpartyDetectionDto } from '../dto/update-thirdparty-detection.dto';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';

@ApiTags('ThirdParty Controller')
@Controller('thirdparty-detection')
export class ThirdpartyDetectionController {
  constructor(private readonly thirdpartyDetectionService: ThirdpartyDetectionService) {}
  

  @ApiOperation({ summary: 'Get All Detection' })
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    return this.thirdpartyDetectionService.findAll(queryDto);
  }

  @Get('/customers/:targetUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All Detection of particular user' })
  async getOwnersKeys(@Param('targetUser') ownerId: string,@Query(new ParseQueryValue()) queryDto: ParsedQueryDto,) {
    queryDto.filter["customer"]=ownerId
    return this.thirdpartyDetectionService.findAll(queryDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get count of all thirdparty detections also accept filter as query params' })
  async getCount(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto,) {
    const filter = queryDto.filter || {}
    return this.thirdpartyDetectionService.thirdpartyDetectionModel.where(filter).countDocuments();
}

  @ApiOperation({ summary: 'Get One Detection' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const detection = await this.thirdpartyDetectionService.findById(id);
    if(!detection){
      throw new NotFoundException()
    }
    return detection
  }

  @ApiOperation({ summary: 'Update One Detection' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateThirdpartyDetectionDto: UpdateThirdpartyDetectionDto) {
    const detection =await this.thirdpartyDetectionService.update(id, updateThirdpartyDetectionDto);
    if(!detection){
      throw new NotFoundException()
    }
    return detection

  }

  @ApiOperation({ summary: 'Remove One Detection' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const detection = await this.thirdpartyDetectionService.remove(id);
    if(!detection){
      throw new NotFoundException()
    }
    return detection
  }
}
