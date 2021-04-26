import { Injectable,Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { START_LISTENING, STOP_LISTENING } from './constants';
import { RadioStation } from '../../../schemas/radiostation.schema';
import {
  Cron,
  CronExpression,
  SchedulerRegistry,
  Timeout,
} from '@nestjs/schedule';

@Injectable()
export class RadioStationListener {

  constructor(private schedulerRegistry: SchedulerRegistry) {}
  private readonly logger = new Logger(RadioStationListener.name);

  @OnEvent(START_LISTENING)
  handleStartListeningEvent(event: RadioStation) {
    console.log(event);
    // event.str

  }


  @OnEvent(STOP_LISTENING)
  handleStopListeningEvent(event: RadioStation) {
    console.log(event);
  }
}