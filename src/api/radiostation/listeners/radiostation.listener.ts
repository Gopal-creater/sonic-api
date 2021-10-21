import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { START_LISTENING_STREAM, STOP_LISTENING_STREAM } from './constants';
import { RadioStation } from '../schemas/radiostation.schema';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { appConfig } from '../../../config/app.config';
import * as fs from 'fs';
import { SonickeyService } from '../../sonickey/services/sonickey.service';
import * as children from 'child_process';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import * as appRootPath from 'app-root-path';
import * as makeDir from 'make-dir';
import * as uniqid from 'uniqid';
import { RadiostationService } from '../services/radiostation.service';
import { DetectionService } from '../../detection/detection.service';
import { ChannelEnums } from 'src/constants/Enums';
import { RadioMonitorService } from '../../radiomonitor/radiomonitor.service';

@Injectable()
export class RadioStationListener {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private sonickeyService: SonickeyService,
    private radiostationService: RadiostationService,
    private radioMonitorService: RadioMonitorService,
    private detectionService: DetectionService,
  ) {}

  private readonly radioStationListenerLogger = new Logger(
    RadioStationListener.name,
  );
  private readonly streamingIntervalLogger = new Logger('StreamingInterval');

  @OnEvent(START_LISTENING_STREAM)
  handleStartListeningEvent(radioStation: RadioStation) {
    this.radioStationListenerLogger.log(
      `Start Listening Event on radioStation id ${radioStation._id}`,
    );
    // const callback = async (radioStationData: RadioStation) => {
    //   this.streamingIntervalLogger.log(
    //     `${appConfig.TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS}sec Interval STARTED For radio station: ${radioStationData.name} with id ${radioStationData._id} having streamingURL :${radioStationData.streamingUrl} `,
    //   );
    //   //Create folder if not present for streaming
    //   await makeDir(
    //     `${appRootPath.toString()}/storage/streaming/${radioStation._id}`,
    //   );
    //   const outputPath = `${appRootPath.toString()}/storage/streaming/${
    //     radioStation._id
    //   }/${uniqid()}.wav`;
    //   this.startListeningLikeAStreamAndUpdateTable(
    //     radioStationData,
    //     outputPath,
    //   );
    // };

    // const interval = setInterval(
    //   () => callback(radioStation),
    //   appConfig.TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS * 1000,
    // );
    // const intervalName = radioStation._id;
    // this.schedulerRegistry.addInterval(intervalName, interval);
  }

  @OnEvent(STOP_LISTENING_STREAM)
  handleStopListeningEvent(radioStation: RadioStation) {
    this.radioStationListenerLogger.log(
      `Stop Listening Event on radioStation id ${radioStation._id}`,
    );
    // const intervalName = radioStation._id;
    // const isPresentInterval = this.schedulerRegistry.doesExists(
    //   'interval',
    //   intervalName,
    // );

    // if (isPresentInterval) {
    //   this.schedulerRegistry.deleteInterval(intervalName);
    // }
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
        { shell: true },
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
              isError: true,
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
            `found ${sonicKeys.length} sonicKeys for radioStationName-${radioStation.name} id-${radioStation._id}`,
          );
          this.streamingIntervalLogger.log(
            `${appConfig.TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS}sec Interval STOPPED For radio station: ${radioStation.name} with id ${radioStation._id} having streamingURL :${radioStation.streamingUrl} `,
          );
          var savedKeys: string[] = [];
          for await (const sonicKey of sonicKeys) {
            const isKeyPresent = await this.sonickeyService.findBySonicKey(
              sonicKey,
            );
            if (isKeyPresent) {
              const isSubscribedForMonitor = await this.radioMonitorService.radioMonitorModel.findOne(
                { owner: isKeyPresent.owner, radio: radioStation._id },
              );
              if (!isSubscribedForMonitor) continue;
              // SendEmailTO thisUser
              // Save It to detection Table
              const newDetection = await this.detectionService.detectionModel.create(
                {
                  radioStation: radioStation._id,
                  sonicKey: sonicKey,
                  // owner: radioStation.owner,
                  sonicKeyOwnerId: isKeyPresent.owner,
                  sonicKeyOwnerName: isKeyPresent.contentOwner,
                  channel: ChannelEnums.STREAMREADER,
                  detectedAt: new Date(),
                },
              );
              await newDetection
                .save()
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
          isError: true,
        },
        { new: true },
      );
    }
  }
}
