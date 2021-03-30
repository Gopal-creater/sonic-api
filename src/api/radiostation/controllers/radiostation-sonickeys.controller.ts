import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RadiostationService } from '../services/radiostation.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RadiostationSonicKeysService } from '../services/radiostation-sonickeys.service';

@ApiTags('Radio Station Contrller')
@Controller('radiostations')
export class RadiostationSonicKeysController {
  constructor(private readonly radiostationService: RadiostationService,private readonly radiostationSonicKeysService: RadiostationSonicKeysService) {}
  
  @Get('/:radiostationId/sonic-keys')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All SonicKeys for this Radio Station' })
  findAllSonicKeys(@Param('radiostationId') radiostationId:string) {
    return this.radiostationSonicKeysService.findAllSonicKeysForRadioStation(radiostationId);
  }


  @Get('/new/create-r_s-aux-table')
  @ApiOperation({ summary: 'Create RadioStation-SonicKey Aux table in Dynamo DB' })
  async createTable() {
    return await this.radiostationSonicKeysService.radioStationSonicKeysRepository
      .ensureTableExistsAndCreate()
      .then(() => 'Created New Table');
  }
}
