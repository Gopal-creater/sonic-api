import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';
import { SonickeyService } from '../services/sonickey.service';
import { S3ACL, ChannelEnums } from 'src/constants/Enums';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { QueuejobService } from '../../../queuejob/queuejob.service';
import { SonicKey } from '../schemas/sonickey.schema';
import { UserDB } from 'src/api/user/schemas/user.db.schema';
import { LicensekeyService } from 'src/api/licensekey/services/licensekey.service';
import { LicenseKey } from 'src/api/licensekey/schemas/licensekey.schema';
import { SonickeyUtils } from './utils/sonickey.utils';
import { identifyDestinationFolderAndResourceOwnerFromUser } from 'src/shared/utils';
import { nanoid } from 'nanoid';

export interface EncodeJobDataI {
  file: IUploadedFile;
  owner: string;
  company: string;
  licenseId: string;
  metaData: Partial<SonicKeyDto>;
}

export interface EncodeAgainJobDataI {
  trackId: string;
  user: UserDB;
  sonicKeyDto?: Partial<SonicKey>;
  metaData?: Record<string, any>;
}

@Processor('sonickey')
export class SonicKeyProcessor {
  constructor(
    private readonly sonicKeyService: SonickeyService,
    private readonly sonickeyUtils: SonickeyUtils,
    private readonly licensekeyService: LicensekeyService,
    public readonly queuejobService: QueuejobService,
  ) {}
  private readonly logger = new Logger(SonicKeyProcessor.name);

  @Process('bulk_encode')
  async handleBulkEncode(job: Job) {
    this.logger.debug(`Start encode for job id: ${job.id}`);
    this.logger.debug(job.data);
    await this.encodeFileFromJobData(job)
      .then(async data => {
        //update job upon successfull
        await this.queuejobService.queueJobModel.updateOne(
          { _id: job.id },
          {
            completed: true,
          },
          { new: true },
        );
        return Promise.resolve(data);
      })
      .catch(async err => {
        this.logger.debug(`Encode failed for job id: ${job.id}`);
        this.logger.error(err);
        //update job upon error
        await this.queuejobService.queueJobModel.updateOne(
          { _id: job.id },
          {
            error: true,
            errorData: err,
          },
          { new: true },
        );
        return Promise.reject(new Error(err.message || 'Encode failed'));
      });
    this.logger.debug(`Encode completed for job id: ${job.id}`);
  }

  @Process('encode_again')
  async handleEncodeAgainForNextDownload(job: Job) {
    this.logger.debug(`Start encode again job for job id: ${job.id}`);
    this.logger.debug(job.data);
    try {
      const {
        user,
        trackId,
        sonicKeyDto,
        metaData,
      } = job.data as EncodeAgainJobDataI;
      const license = await this.sonickeyUtils.checkAndGetValidLicenseForEncode(
        user,
      );
      console.log('license', license);

      const {
        fileUploadFromTrackResult: file,
        currentTrack: track,
      } = await this.sonickeyUtils.downloadFileFromTrack(trackId);
      console.log('fileUploadFromTrackResult', file);
      const oldLatestSonicKey = await this.sonicKeyService.findOneAggregate({
        filter: { track: trackId },
        sort: { createdAt: -1 },
      });
      console.log('oldLatestSonicKey', oldLatestSonicKey);
      const {
        destinationFolder,
        resourceOwnerObj,
      } = identifyDestinationFolderAndResourceOwnerFromUser(user);
      //Create Job in db
      await this.queuejobService
        .create({
          _id: job.id,
          name: job.name,
          jobData: job.data,
          ...resourceOwnerObj,
        })
        .catch(err => {
          throw new Error("Can't save queue job details to db");
        });
      var sonickeyDoc: Partial<SonicKey>;
      if (oldLatestSonicKey) {
        sonickeyDoc = Object.assign(oldLatestSonicKey, sonicKeyDto, {
          createdBy: user?.sub,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        sonicKeyDto.contentFileType =
          sonicKeyDto.contentFileType || track.mimeType;
        sonicKeyDto.contentOwner = sonicKeyDto.contentOwner || track.artist;
        sonicKeyDto.contentName = sonicKeyDto.contentName || track.title;
        sonicKeyDto.contentDuration =
          sonicKeyDto.contentDuration || track.duration;
        sonicKeyDto.contentSize = sonicKeyDto.contentSize || track.fileSize;
        sonicKeyDto.contentType = sonicKeyDto.contentType || track.fileType;
        sonicKeyDto.contentEncoding =
          sonicKeyDto.contentEncoding || track.encoding;
        sonicKeyDto.contentSamplingFrequency =
          sonicKeyDto.contentSamplingFrequency || track.samplingFrequency;
        sonicKeyDto.originalFileName =
          track.originalFileName || sonicKeyDto.originalFileName;
        sonickeyDoc = Object.assign(sonicKeyDto, resourceOwnerObj, {
          createdBy: user?.sub,
        });
      }
      console.log('sonickeyDoc', sonickeyDoc);
      const encodingStrength = sonickeyDoc.encodingStrength || 15;
      await this.sonicKeyService.encodeSonicKeyFromTrack({
        trackId: track?.id,
        file,
        licenseId: license._id,
        sonickeyDoc,
        encodingStrength,
        s3destinationFolder: destinationFolder,
      });
      console.log('encode done, goining to update jobTable');
      await this.queuejobService.queueJobModel.updateOne(
        { _id: job.id },
        {
          completed: true,
        },
        { new: true },
      );
      this.logger.debug(
        `Encode Again For next download job completed for job id: ${job.id}`,
      );
    } catch (error) {
      console.log('Error occured while encoding again from Queue', error);
      await this.queuejobService.queueJobModel
        .updateOne(
          { _id: job.id },
          {
            error: true,
            errorData: error,
          },
          { new: true },
        )
        .catch(e => console.log('error', e));
    }
  }

  async encodeFileFromJobData(encodeJobData: Job) {
    const { id, data } = encodeJobData;
    const { file, owner, company, licenseId, metaData }: EncodeJobDataI = data;
    return new Promise(async (resolve, reject) => {
      try {
        const {
          s3UploadResult,
          sonicKey,
          s3OriginalFileUploadResult,
          fingerPrintMetaData,
          fingerPrintErrorData,
          fingerPrintStatus,
        } = await this.sonicKeyService.encodeAndUploadToS3(
          file,
          owner,
          metaData?.encodingStrength,
          S3ACL.PRIVATE,
          true,
        );
        this.logger.debug('Encode & upload to s3 finished for job', id);
        await this.sonicKeyService.licensekeyService.incrementUses(
          data.licenseId,
          'encode',
          1,
        );
        this.logger.debug(
          'Increment Usages upon successfull encode for job',
          id,
        );
        this.logger.debug('Going to save key in db for job', id);
        const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(
          file,
          metaData,
        );
        const channel = ChannelEnums.THIRDPARTY_BULK;
        const newSonicKey = {
          ...sonicKeyDtoWithAudioData,
          contentFilePath: s3UploadResult.Location,
          originalFileName: file?.originalname,
          owner: owner,
          company: company,
          sonicKey: sonicKey,
          channel: channel,
          downloadable: true,
          s3FileMeta: s3UploadResult,
          s3OriginalFileMeta: s3OriginalFileUploadResult,
          fingerPrintMetaData: fingerPrintMetaData,
          fingerPrintErrorData: fingerPrintErrorData,
          fingerPrintStatus: fingerPrintStatus,
          queueJobId: id,
          _id: sonicKey,
          license: licenseId,
        };
        const savedSonicKey = await this.sonicKeyService.saveSonicKeyForUser(
          owner,
          newSonicKey,
        );
        resolve(savedSonicKey);
      } catch (error) {
        reject(error);
      }
    }).finally(() => {
      // this.logger.debug('Deleting file after encode for job', id);
      // this.fileHandlerService.deleteFileAtPath(file.path);
    });
  }
}
