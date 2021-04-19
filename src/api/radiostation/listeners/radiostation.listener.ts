import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { START_LISTENING, STOP_LISTENING } from './constants';
import { RadioStation } from '../../../schemas/radiostation.schema';

@Injectable()
export class RadioStationListener {
  @OnEvent(START_LISTENING)
  handleStartListeningEvent(event: RadioStation) {
    console.log(event);
  }


  @OnEvent(STOP_LISTENING)
  handleStopListeningEvent(event: RadioStation) {
    console.log(event);
  }
}