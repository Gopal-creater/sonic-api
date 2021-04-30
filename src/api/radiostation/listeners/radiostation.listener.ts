import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { START_LISTENING_STREAM, STOP_LISTENING_STREAM } from './constants';
import { RadioStation } from '../schemas/radiostation.schema';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { RadiostationSonicKeysService } from '../services/radiostation-sonickeys.service';
import { appConfig } from '../../../config/app.config';
import * as fs from 'fs';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import * as children from 'child_process';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { CreateRadiostationSonicKeyDto } from '../dto/radiostation-sonickey-dto/create-radiostation-sonickey.dto';
import * as appRootPath from 'app-root-path';
import * as uniqid from 'uniqid';
import { RadiostationService } from '../services/radiostation.service';

@Injectable()
export class RadioStationListener implements OnApplicationBootstrap {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private sonickeyService: SonickeyService,
    private radiostationService: RadiostationService,
    private radiostationSonicKeysService: RadiostationSonicKeysService,
  ) {}
  async onApplicationBootstrap() {
    this.streamingIntervalLogger.debug(
      'Called once after 0 seconds very firsttime, do restoring of listening of stream',
    );
    return 
    const radioStations = await this.radiostationService.radioStationModel.find(
      { isStreamStarted: true },
    );
    this.streamingIntervalLogger.debug(
      `${radioStations.length} number of streaming need to be restart deuto server reboot`
    );
    const callback = (radioStationData: RadioStation) => {
      const outputPath = `${appRootPath.toString()}/storage/stream/${uniqid()}.wav`;
      this.startListeningLikeAStreamAndUpdateTable(
        radioStationData,
        outputPath,
      );
    };

    radioStations.forEach(radioStation => {
      const interval = setInterval(
        () => callback(radioStation),
        appConfig.TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS * 1000,
      );
      const intervalName = radioStation._id;
      this.schedulerRegistry.addInterval(intervalName, interval);
    });
  }
  private readonly radioStationListenerLogger = new Logger(
    RadioStationListener.name,
  );
  private readonly streamingIntervalLogger = new Logger('StreamingInterval');

  @OnEvent(START_LISTENING_STREAM)
  handleStartListeningEvent(radioStation: RadioStation) {
    this.radioStationListenerLogger.log(
      `Start Listening Event on radioStation id ${radioStation._id}`,
    );
    const callback = (radioStationData: RadioStation) => {
      this.streamingIntervalLogger.log(
        'radioStation streamingUrl inside interval',
        radioStationData.streamingUrl,
      );

      const outputPath = `${appRootPath.toString()}/storage/stream/${uniqid()}.wav`;
      this.startListeningLikeAStreamAndUpdateTable(
        radioStationData,
        outputPath,
      );
    };

    const interval = setInterval(
      () => callback(radioStation),
      appConfig.TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS * 1000,
    );
    const intervalName = radioStation._id;
    this.schedulerRegistry.addInterval(intervalName, interval);
  }

  @OnEvent(STOP_LISTENING_STREAM)
  handleStopListeningEvent(radioStation: RadioStation) {
    this.radioStationListenerLogger.log(
      `Stop Listening Event on radioStation id ${radioStation._id}`,
    );
    const intervalName = radioStation._id;
    const isPresentInterval = this.schedulerRegistry.doesExists(
      'interval',
      intervalName,
    );

    if (isPresentInterval) {
      this.schedulerRegistry.deleteInterval(intervalName);
    }
  }

  async startListeningLikeAStreamAndUpdateTable(
    radioStation: RadioStation,
    outputPath: string,
  ) {
    const intervalName = radioStation._id;
    try {
      var ffm = children.spawn(
        'ffmpeg',
        `-i ${radioStation.streamingUrl} -y -f 16_le -ar 41000 -ac 2 -f wav -t 00:00:${appConfig.TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS} ${outputPath}`.split(
          ' ',
        ),
      );

      ffm.stdout.on('data', data => {
        // this.streamingIntervalLogger.log(`stdout: ${data}`);
      });

      ffm.stderr.on('data', data => {
        // this.streamingIntervalLogger.error(`stderr: ${data}`);
      });

      ffm.on('error', err => {
        // this.streamingIntervalLogger.error(`Failed to start subprocess.${err}`);
      });

      ffm.on('close', async code => {
        if (code !== 0) {
          this.streamingIntervalLogger.log(
            `Error listening for stream with code ${code}-stopping listening and interval`,
          );
          var error = new Map();
          error.set(
            'message',
            'Error while listening, please double check the streaming Url',
          );
          this.schedulerRegistry.deleteInterval(intervalName);
          await this.radiostationService.radioStationModel.findOneAndUpdate(
            { _id: radioStation._id },
            {
              stopAt: new Date(),
              isStreamStarted: false,
              error: error,
            },
            { new: true },
          );
        } else {
          var stats = fs.statSync(outputPath);
          var file: IUploadedFile = {
            path: outputPath,
            size: stats.size,
          };
          const { sonicKeys } = await this.sonickeyService.decodeAllKeys(file);
          this.streamingIntervalLogger.log(
            `found # of sonicKeys ${sonicKeys.length} for radioStationId-${radioStation.name} id-${radioStation._id}`,
          );
          var savedKeys: string[] = [];
          for await (const sonicKey of sonicKeys) {
            const isKeyPresent = await this.sonickeyService.findBySonicKey(
              sonicKey,
            );
            if (isKeyPresent) {
              const createRadiostationSonicKeyDto = new CreateRadiostationSonicKeyDto();
              createRadiostationSonicKeyDto.radioStation = radioStation._id;
              createRadiostationSonicKeyDto.sonicKey = sonicKey;
              createRadiostationSonicKeyDto.owner = isKeyPresent.owner;
              await this.radiostationSonicKeysService
                .create(createRadiostationSonicKeyDto)
                .then(() => {
                  savedKeys.push(sonicKey);
                })
                .catch(err => {});
            }
          }
          if (savedKeys.length > 0) {
            this.streamingIntervalLogger.log(
              `Saved # of sonicKeys ${savedKeys.length} for radioStationId-${radioStation.name} id-${radioStation._id} outof ${sonicKeys.length}`,
            );
          }
        }
      });
    } catch (error) {
      this.streamingIntervalLogger.log(
        `error listening for stream ${error} -stopping listening and interval`,
      );
      this.schedulerRegistry.deleteInterval(intervalName);
      this.radiostationService.radioStationModel.findOneAndUpdate(
        { _id: radioStation._id },
        {
          stopAt: new Date(),
          isStreamStarted: false,
          error: error,
        },
        { new: true },
      );
    }
  }
}
