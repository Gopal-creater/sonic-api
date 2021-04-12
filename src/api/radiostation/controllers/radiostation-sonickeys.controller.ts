import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RadiostationService } from '../services/radiostation.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RadiostationSonicKeysService } from '../services/radiostation-sonickeys.service';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { ConvertIntObj } from '../../../shared/pipes/convertIntObj.pipe';

@ApiTags('RadioStation-SonicKeys Controller')
@Controller('radiostations-sonickeys')
export class RadiostationSonicKeysController {
  constructor(
    private readonly radiostationService: RadiostationService,
    private readonly radiostationSonicKeysService: RadiostationSonicKeysService,
  ) {}

  @Get('/')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All radiostations-sonickeys' })
  findAll(@Query(new ConvertIntObj(['limit','offset'])) queryDto: QueryDto) {
    return this.radiostationSonicKeysService.findAll(queryDto);
  }
}
