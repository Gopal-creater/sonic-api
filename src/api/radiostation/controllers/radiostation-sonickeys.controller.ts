import { Controller, Get, Query, UseGuards, Param, Post } from '@nestjs/common';
import { RadiostationService } from '../services/radiostation.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RadiostationSonicKeysService } from '../services/radiostation-sonickeys.service';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';
import { CreateRadiostationSonicKeyDto } from '../dto/radiostation-sonickey-dto/create-radiostation-sonickey.dto';

@ApiTags('RadioStation-SonicKeys Controller')
@Controller('radiostations-sonickeys')
export class RadiostationSonicKeysController {
  constructor(
    private readonly radiostationService: RadiostationService,
    private readonly radiostationSonicKeysService: RadiostationSonicKeysService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All radiostations-sonickeys' })
  findAll(@Query(new ParseQueryValue()) queryDto: ParsedQueryDto) {
    console.log("queryDto",queryDto);
    
    return this.radiostationSonicKeysService.findAll(queryDto);
  }

  // @Post('/')
  // // @UseGuards(JwtAuthGuard)
  // // @ApiBearerAuth()
  // // @AnyApiQueryTemplate()
  // @ApiOperation({ summary: 'Get All radiostations-sonickeys' })
  // post() {
  //   const createRadiostationSonicKeyDto = new CreateRadiostationSonicKeyDto();
  //             createRadiostationSonicKeyDto.radioStation ='609cc3cd7f28de584aa3b772';
  //             createRadiostationSonicKeyDto.sonicKey = 'QSXA3Yba7-9';
  //             createRadiostationSonicKeyDto.owner = '5728f50d-146b-47d2-aa7b-a50bc37d641d';
  //   return this.radiostationSonicKeysService.create(createRadiostationSonicKeyDto);
  // }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get count of all radiostation-sonickeys' })
  async getCount(@Query() query) {
    return this.radiostationSonicKeysService.radioStationSonickeyModel.estimatedDocumentCount({...query})
  }

  @Get('/radio-stations/:radioStationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All Sonic Keys of particular user' })
  async getOwnersKeys(@Param('radioStationId') radioStationId: string,@Query(new ParseQueryValue()) queryDto: ParsedQueryDto,) {
    queryDto.filter["radioStation"]=radioStationId
    return this.radiostationSonicKeysService.findAll(queryDto);
  }
}
