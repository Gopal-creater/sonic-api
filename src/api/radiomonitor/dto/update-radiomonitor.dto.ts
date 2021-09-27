import { PartialType } from '@nestjs/mapped-types';
import { CreateRadioMonitorDto } from './create-radiomonitor.dto';

export class UpdateRadioMonitorDto extends PartialType(CreateRadioMonitorDto) {}