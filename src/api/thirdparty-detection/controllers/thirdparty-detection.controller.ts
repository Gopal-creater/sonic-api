import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { ThirdpartyDetectionService } from '../thirdparty-detection.service';
import { CreateThirdpartyDetectionDto } from '../dto/create-thirdparty-detection.dto';
import { UpdateThirdpartyDetectionDto } from '../dto/update-thirdparty-detection.dto';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ThirdParty Controller')
@Controller('thirdparty-detection')
export class ThirdpartyDetectionController {
  constructor(private readonly thirdpartyDetectionService: ThirdpartyDetectionService) {}
  

  @ApiOperation({ summary: 'Get All Detection' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query(new ParseQueryValue()) queryDto: QueryDto) {
    return this.thirdpartyDetectionService.findAll(queryDto);
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
