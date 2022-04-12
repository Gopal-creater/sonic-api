import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';
import { SonickeyService } from '../services/sonickey.service';
import { S3ACL, ChannelEnums } from 'src/constants/Enums';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { QueuejobService } from '../../../queuejob/queuejob.service';

export interface EncodeJobDataI {
  file: IUploadedFile;
  owner: string;
  company: string;
  licenseId: string;
  metaData: Partial<SonicKeyDto>;
}

@Processor('sonickey')
export class SonicKeyProcessor {
  constructor(
    private readonly sonicKeyService: SonickeyService,
    private readonly fileHandlerService: FileHandlerService,
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
        const channel = ChannelEnums.PORTAL;
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
