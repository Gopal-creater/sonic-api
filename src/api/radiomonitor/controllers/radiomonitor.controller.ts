import {
  Controller
} from '@nestjs/common';
import { RadioMonitorService } from '../radiomonitor.service';
import { RadiostationService } from '../../radiostation/services/radiostation.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Radio Monitoring Controller')
@Controller('radiomonitors')
export class RadioMonitorController {
  constructor(private readonly radiomonitorService: RadioMonitorService,
    private readonly radiostationService: RadiostationService
    ) {}
}
