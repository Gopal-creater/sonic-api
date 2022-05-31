import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { FileOperationService } from '../../../shared/services/file-operation.service';
import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SonicKey } from '../schemas/sonickey.schema';
import * as mm from 'music-metadata';
import * as upath from 'upath';
import { nanoid } from 'nanoid';
import { appConfig } from '../../../config';
import config1 from '../../../config/app.config';
import { CreateSonicKeyFromJobDto } from '../dtos/create-sonickey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, UpdateQuery, AnyObject, AnyKeys } from 'mongoose';
import axios from 'axios';
import * as makeDir from 'make-dir';
import { MongoosePaginateSonicKeyDto } from '../dtos/mongoosepaginate-sonickey.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import {
  ChannelEnums,
  FingerPrintStatus,
  S3ACL,
} from '../../../constants/Enums';
import { S3FileUploadService } from '../../s3fileupload/s3fileupload.service';
import { DetectionService } from '../../detection/detection.service';
import { Detection } from 'src/api/detection/schemas/detection.schema';
import { UserService } from '../../user/services/user.service';
import { LicensekeyService } from '../../licensekey/services/licensekey.service';
import { S3FileUploadI } from '../../s3fileupload/interfaces/index';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EncodeJobDataI } from '../processors/sonickey.processor';
import * as path from 'path';
import { EncodeFromQueueDto } from '../dtos/encode.dto';
import { ConfigService } from '@nestjs/config';
import { QueuejobService } from '../../../queuejob/queuejob.service';
import { TrackService } from '../../track/track.service';
import { Track } from 'src/api/track/schemas/track.schema';

// PaginationQueryDtohttps://dev.to/tony133/simple-example-api-rest-with-nestjs-7-x-and-mongoose-37eo
@Injectable()
export class SonickeyService {
  constructor(
    @InjectModel(SonicKey.name) public sonicKeyModel: Model<SonicKey>,
    private readonly fileOperationService: FileOperationService,
    public readonly licensekeyService: LicensekeyService,
    @InjectQueue('sonickey') public readonly sonicKeyQueue: Queue,
    private readonly fileHandlerService: FileHandlerService,
    private readonly s3FileUploadService: S3FileUploadService,
    private configService: ConfigService,
    private readonly detectionService: DetectionService,
    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,
    public readonly queuejobService: QueuejobService,
    public readonly trackService: TrackService,
  ) {
    console.log(
      `FingerPrint BASE URL: ${this.configService.get(
        'FINGERPRINT_SERVER.baseUrl',
      )}`,
    );
  }

  generateUniqueSonicKey() {
    // TODO: Must verify for uniqueness of generated key
    return nanoid(11);
  }

  async testUploadFromPath() {
    const filePath = `${appConfig.MULTER_DEST}/guest/4fqq9xz8ckosgjzea-SonicTest_Detect.wav`;
    const result = await this.s3FileUploadService.uploadFromPath(
      filePath,
      'userId1234345/encodedFiles',
      S3ACL.PRIVATE,
    );
    return {
      msg: 'uploaded',
      result: result,
    };
  }

  async encodeBulkWithQueue(
    owner: string,
    company: string,
    license: string,
    encodeFromQueueDto: EncodeFromQueueDto,
  ) {
    var { fileSpecs } = encodeFromQueueDto;
    const addedJobsDetails = [];
    const jobsToInsertIntoDb = [];
    const failedData = [];
    for await (var fileSpec of fileSpecs) {
      const jobId = `${owner}_${fileSpec.filePath}`;
      const isAlreadyDone = await this.findByQueueJobId(jobId);
      if (isAlreadyDone) {
        fileSpec['message'] = 'File already encoded, duplicate file';
        failedData.push(fileSpec);
        continue;
      }
      //Here the files of specific company will be present inside their companyId as a folder name
      const absoluteFilePath = path.join(
        appConfig.ROOT_RSYNC_UPLOADS,
        company,
        fileSpec.filePath,
      );
      const [
        fileDetailsFromFilePath,
        error,
      ] = await this.fileHandlerService.getFileDetailsFromFile(
        absoluteFilePath,
      );
      if (error) {
        fileSpec['message'] = 'Can not resolve file, possibly file not found';
        fileSpec['error'] = error;
        failedData.push(fileSpec);
      } else {
        const jobData: EncodeJobDataI = {
          file: fileDetailsFromFilePath,
          metaData: fileSpec.metaData,
          owner: owner,
          company: company,
          licenseId: license,
        };
        const jobInfo = {
          name: 'bulk_encode',
          data: jobData,
          opts: { delay: 10000, jobId: jobId }, //10 sec
        };
        const jobToDb = {
          _id: jobId,
          name: 'bulk_encode',
          jobData: jobData,
          company: company,
        };
        jobsToInsertIntoDb.push(jobToDb);
        addedJobsDetails.push(jobInfo);
      }
    }
    await this.queuejobService.queueJobModel
      .insertMany(jobsToInsertIntoDb)
      .catch(err => {
        throw new UnprocessableEntityException(
          "Can't save queue job details to db",
        );
      });
    const addedJobsQueueResponse = await this.sonicKeyQueue.addBulk(
      addedJobsDetails,
    );
    return {
      addedJobsQueueResponse: addedJobsQueueResponse,
      failedData: failedData,
    };
  }

  async getJobStatus(jobId: string) {
    return this.sonicKeyQueue.getJob(jobId);
  }

  async testDownloadFile() {
    // const key = `userId1234345/encodedFiles/aa1y7g154cktiatome-4fqq9xz8ckosgjzea-SonicTest_Detect.wav` //public
    const key =
      'userId1234345/encodedFiles/4fqq9xz8ckosgjzea-SonicTest_Detect.wav'; //private
    //  const fileResult = await this.s3FileUploadService.getFile(key)
    //  console.log("fileResult",fileResult);
    //  return fileResult.Body.toString("utf-8")
    return this.s3FileUploadService.getSignedUrl(key);
  }

  async createFromJob(createSonicKeyDto: CreateSonicKeyFromJobDto) {
    const channel = ChannelEnums.PCAPP;
    const userGroups = await this.userService.adminListGroupsForUser(
      createSonicKeyDto.owner,
    );
    const newSonicKey = new this.sonicKeyModel({
      ...createSonicKeyDto,
      license: createSonicKeyDto.licenseId || createSonicKeyDto.license,
      channel: channel,
      groups: userGroups.groupNames,
      _id: createSonicKeyDto.sonicKey,
    });
    return newSonicKey.save();
  }

  async createFromBinaryForUser(ownerId: string, sonickey: Record<any, any>) {
    const newSonicKey = new this.sonicKeyModel({
      ...sonickey,
      owner: ownerId,
    });
    return newSonicKey.save();
  }

  async saveSonicKeyForUser(ownerId: string, sonickey: Record<any, any>) {
    const newSonicKey = new this.sonicKeyModel({
      ...sonickey,
      owner: ownerId,
    });
    return newSonicKey.save();
  }

  async getAll(queryDto: ParsedQueryDto): Promise<MongoosePaginateSonicKeyDto> {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      relationalFilter,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    const aggregate = this.sonicKeyModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $sort: {
          createdAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'Company',
          localField: 'company',
          foreignField: '_id',
          as: 'company',
        },
      },
      { $addFields: { company: { $first: '$company' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'Partner',
          localField: 'partner',
          foreignField: '_id',
          as: 'partner',
        },
      },
      { $addFields: { partner: { $first: '$partner' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $addFields: { owner: { $first: '$owner' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
    ]);
    return this.sonicKeyModel['aggregatePaginate'](aggregate, paginateOptions);
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    return this.sonicKeyModel.find(filter || {}).count();
  }

  async getEstimateCount() {
    return this.sonicKeyModel.estimatedDocumentCount();
  }

  /**
   * Encode the uploaded file. Not all params passed from ther front end are used for the actual encoding.
   * Most of them are simply saved as content details. See 'argList' below to see the actual arguments
   * passed to the encoding executable binary (encoder binary name is: watermark). Encoded files are saved
   * with the same name, in a folder named "encodedFiles" in the user's home directory. The parameter ownerId
   * which is the Cognito User ID of the logged in user is used as his home directory name.
   * https://dev.to/vjnvisakh/uploading-to-s3-using-nestjs-4037
   * @param file
   * @param encodingStrength
   */
  async encode(file: IUploadedFile, encodingStrength: number = 15) {
    // The sonic key generation - done randomely.
    const random11CharKey = this.generateUniqueSonicKey();
    // TODO: Must verify for uniqueness of generated key

    file.path = upath.toUnix(file.path); //Convert windows path to unix path
    file.destination = upath.toUnix(file.destination);
    const inFilePath = file.path;
    await makeDir(`${file.destination}/encodedFiles`);
    const outFilePath =
      file.destination + '/' + 'encodedFiles' + '/' + file.filename;
    const argList =
      ' -h ' +
      encodingStrength +
      ' ' +
      inFilePath +
      ' ' +
      outFilePath +
      ' ' +
      random11CharKey;
    const sonicEncodeCmd = `${appConfig.ENCODER_EXE_PATH}` + argList;

    // TODO: this whole stuff needs to be promise/callback based.
    //Prabin: Handling File Operation in Async(promise/callback) mode
    // return Promise.resolve({
    //   downloadFileUrl: inFilePath,
    //   outFilePath:inFilePath,
    //   sonicKey:random11CharKey
    // })
    return this.fileOperationService
      .encodeFile(sonicEncodeCmd, outFilePath)
      .then(async () => {
        return {
          downloadFileUrl: `storage/${outFilePath.split('storage/').pop()}`,
          outFilePath: outFilePath,
          sonicKey: random11CharKey,
        };
      })
      .finally(() => {
        this.fileHandlerService.deleteFileAtPath(inFilePath); //delete in callig side
      });
  }

  async encodeAndUploadToS3(
    file: IUploadedFile,
    user: string,
    encodingStrength: number = 15,
    s3Acl?: S3ACL,
    fingerPrint: boolean = true,
  ) {
    // The sonic key generation - done randomely.
    const random11CharKey = this.generateUniqueSonicKey();
    // TODO: Must verify for uniqueness of generated key

    file.path = upath.toUnix(file.path); //Convert windows path to unix path
    file.destination = upath.toUnix(file.destination);
    const inFilePath = file.path;
    await makeDir(`${file.destination}/encodedFiles`);
    const outFilePath =
      file.destination + '/' + 'encodedFiles' + '/' + file.filename;
    const argList =
      ' -h ' +
      encodingStrength +
      ' ' +
      inFilePath +
      ' ' +
      outFilePath +
      ' ' +
      random11CharKey;
    const sonicEncodeCmd = `${appConfig.ENCODER_EXE_PATH}` + argList;

    return this.fileOperationService
      .encodeFile(sonicEncodeCmd, outFilePath)
      .then(() => {
        const encodedFileUploadToS3 = this.s3FileUploadService
          .uploadFromPath(outFilePath, `${user}/encodedFiles`, s3Acl)
          .then(data => Promise.resolve(data))
          .catch(error => Promise.resolve(error));
        const originalFileUploadToS3 = this.s3FileUploadService
          .uploadFromPath(inFilePath, `${user}/originalFiles`, s3Acl)
          .then(data => Promise.resolve(data))
          .catch(error => Promise.resolve(error));
        return Promise.all([encodedFileUploadToS3, originalFileUploadToS3]);
      })
      .then(
        async ([s3EncodedUploadResult, s3OriginalUploadResult]: [
          S3FileUploadI,
          S3FileUploadI,
        ]) => {
          var resultObj = {
            downloadFileUrl: s3EncodedUploadResult.Location,
            s3UploadResult: s3EncodedUploadResult,
            s3OriginalFileUploadResult: s3OriginalUploadResult,
            sonicKey: random11CharKey,
            fingerPrintMetaData: null,
            fingerPrintErrorData: null,
            fingerPrintStatus: FingerPrintStatus.PENDING,
          };
          //We will be communication with FP server all event based we wont wait for FP to finished,
          //All manage by eventStatus
          const fingerPrintMetaData = await this.fingerPrintRequestToFPServer(
            resultObj.s3OriginalFileUploadResult,
            random11CharKey,
            file.originalname,
            file.size,
          )
            .then(data => {
              //Indicate that processing has been started in FP Server
              resultObj.fingerPrintStatus = FingerPrintStatus.PROCESSING;
              // return data;
              return Promise.resolve(null);
            })
            .catch(err => {
              console.log('err', err);
              resultObj.fingerPrintStatus = FingerPrintStatus.FAILED;
              resultObj.fingerPrintErrorData = {
                message: err?.message,
                data: err?.response?.data,
              };
              return Promise.resolve(null);
            });
          resultObj.fingerPrintMetaData = fingerPrintMetaData;
          return resultObj;
        },
      )
      .finally(() => {
        // this.fileHandlerService.deleteFileAtPath(inFilePath); //delete in callig side
        this.fileHandlerService.deleteFileAtPath(outFilePath); //Delete outFilePath too since we are storing to S3
      });
  }
  async encodeAndUpload(
    file: IUploadedFile,
    s3destinationFolder: string,
    doc: AnyObject | AnyKeys<SonicKey>,
    encodingStrength: number = 15,
    s3Acl?: S3ACL,
    fingerPrint: boolean = true,
  ) {
    // The sonic key generation - done randomely.
    const random11CharKey = this.generateUniqueSonicKey();
    // TODO: Must verify for uniqueness of generated key

    file.path = upath.toUnix(file.path); //Convert windows path to unix path
    file.destination = upath.toUnix(file.destination);
    const inFilePath = file.path;
    await makeDir(`${file.destination}/encodedFiles`);
    const outFilePath =
      file.destination + '/' + 'encodedFiles' + '/' + file.filename;
    const argList =
      ' -h ' +
      encodingStrength +
      ' ' +
      inFilePath +
      ' ' +
      outFilePath +
      ' ' +
      random11CharKey;
    const sonicEncodeCmd = `${appConfig.ENCODER_EXE_PATH}` + argList;

    return this.fileOperationService
      .encodeFile(sonicEncodeCmd, outFilePath)
      .then(() => {
        const encodedFileUploadToS3 = this.s3FileUploadService
          .uploadFromPath(
            outFilePath,
            `${s3destinationFolder}/encodedFiles`,
            s3Acl,
          )
          .then(data => Promise.resolve(data))
          .catch(error => Promise.resolve(error));
        return Promise.all([encodedFileUploadToS3]);
      })
      .then(async ([s3EncodedUploadResult]: [S3FileUploadI]) => {
        const sonicKeyDtoWithAudioData = await this.autoPopulateSonicContentWithMusicMetaForFile(
          file,
          doc,
        );
        const newSonicKey = {
          ...sonicKeyDtoWithAudioData,
          contentFilePath: s3EncodedUploadResult.Location,
          originalFileName: file?.originalname,
          sonicKey: random11CharKey,
          downloadable: true,
          s3FileMeta: s3EncodedUploadResult,
          fingerPrintStatus: FingerPrintStatus.PENDING,
          _id: random11CharKey,
        };
        return;
      })
      .finally(() => {
        this.fileHandlerService.deleteFileAtPath(inFilePath);
        this.fileHandlerService.deleteFileAtPath(outFilePath); //Delete outFilePath too since we are storing to S3
      });
  }

  async encodeSonicKeyFromFile(config: {
    file: IUploadedFile;
    licenseId: string;
    s3destinationFolder: string;
    sonickeyDoc: AnyObject | AnyKeys<SonicKey>;
    encodingStrength?: number;
    s3Acl?: S3ACL;
    fingerPrint?: boolean;
  }) {
    const {
      file,
      licenseId,
      s3destinationFolder,
      sonickeyDoc,
      encodingStrength = 15,
      s3Acl,
      fingerPrint=true,
    } = config;
    const {owner,partner,company} = sonickeyDoc
    const trackDoc:Partial<Track> = {
      channel:sonickeyDoc.channel,
      artist:sonickeyDoc.contentOwner,
      title:sonickeyDoc.contentName,
      fileType: sonickeyDoc.contentFileType,
      trackMetaData:sonickeyDoc,
      owner,
      partner,
      company,
      createdBy: sonickeyDoc.createdBy,
    }
    console.log('Saving Track');
    const track = await this.trackService.uploadAndCreate(file,trackDoc,s3destinationFolder)
    console.log('Track Saved');
    console.log('Encoding....');
    const {outFilePath,sonicKey} = await this.encode(file,encodingStrength)
    console.log('Encoding Done');
    console.log('Uploading encoded file to s3');
    const s3EncodedUploadResult = await this.s3FileUploadService.uploadFromPath(outFilePath,`${s3destinationFolder}/encodedFiles`,s3Acl)
    .finally(()=>{
      this.fileHandlerService.deleteFileAtPath(outFilePath); //Delete outFilePath too since we are storing to S3
    })
    console.log('Uploading encoded file to s3 Done');
    const newSonicKey:Partial<SonicKey> = {
      ...sonickeyDoc,
      contentFilePath: s3EncodedUploadResult.Location,
      originalFileName: file?.originalname,
      sonicKey: sonicKey,
      downloadable: true,
      license:licenseId,
      channel:sonickeyDoc.channel||ChannelEnums.PORTAL,
      track:track?._id,
      s3FileMeta: s3EncodedUploadResult,
      fingerPrintStatus: FingerPrintStatus.PENDING,
      _id: sonicKey,
    };

    if(fingerPrint){
      await this.fingerPrintRequestToFPServer(
        track.s3OriginalFileMeta,
        sonicKey,
        file.originalname,
        file.size,
      ).then(data => {
        //Indicate that processing has been started in FP Server
        newSonicKey.fingerPrintStatus = FingerPrintStatus.PROCESSING;
      })
      .catch(err => {
        newSonicKey.fingerPrintStatus = FingerPrintStatus.FAILED;
        newSonicKey.fingerPrintErrorData = {
          message: err?.message,
          data: err?.response?.data,
        };
      });
    }

    console.log('Going to save key in db.');
    const savedSonnicKey = await this.create(newSonicKey)
    console.log('Sonickey saved.');
    console.log('Increment License Usages upon successfull encode & save');
    await this.licensekeyService.incrementUses(licenseId, 'encode', 1);
    console.log('Increment License Usages upon successfull encode & save Done');
    return this.findById(savedSonnicKey._id)
  }
  async encodeSonicKeyFromTrack(config: {
    trackId:string,
    file: IUploadedFile;
    licenseId: string;
    s3destinationFolder: string;
    sonickeyDoc: AnyObject | AnyKeys<SonicKey>;
    encodingStrength?: number;
    s3Acl?: S3ACL;
    fingerPrint?: boolean;
  }) {
    const {
      trackId,
      file,
      licenseId,
      s3destinationFolder,
      sonickeyDoc,
      encodingStrength = 15,
      s3Acl,
      fingerPrint=true,
    } = config;
    console.log('Fetching Track');
    const track = await this.trackService.findById(trackId)
    console.log('Track Fetched');
    console.log('Encoding....');
    const {outFilePath,sonicKey} = await this.encode(file,encodingStrength)
    console.log('Encoding Done');
    console.log('Uploading encoded file to s3');
    const s3EncodedUploadResult = await this.s3FileUploadService.uploadFromPath(outFilePath,`${s3destinationFolder}/encodedFiles`,s3Acl)
    .finally(()=>{
      this.fileHandlerService.deleteFileAtPath(outFilePath); //Delete outFilePath too since we are storing to S3
    })
    console.log('Uploading encoded file to s3 Done');
    const newSonicKey:Partial<SonicKey> = {
      ...sonickeyDoc,
      contentFilePath: s3EncodedUploadResult.Location,
      originalFileName: file?.originalname,
      sonicKey: sonicKey,
      downloadable: true,
      license:licenseId,
      channel:sonickeyDoc.channel||ChannelEnums.PORTAL,
      track:track?._id,
      s3FileMeta: s3EncodedUploadResult,
      fingerPrintStatus: FingerPrintStatus.PENDING,
      _id: sonicKey,
    };

    if(fingerPrint){
      await this.fingerPrintRequestToFPServer(
        track.s3OriginalFileMeta,
        sonicKey,
        file.originalname,
        file.size,
      ).then(data => {
        //Indicate that processing has been started in FP Server
        newSonicKey.fingerPrintStatus = FingerPrintStatus.PROCESSING;
      })
      .catch(err => {
        newSonicKey.fingerPrintStatus = FingerPrintStatus.FAILED;
        newSonicKey.fingerPrintErrorData = {
          message: err?.message,
          data: err?.response?.data,
        };
      });
    }

    console.log('Going to save key in db.');
    const savedSonnicKey = await this.create(newSonicKey)
    console.log('Sonickey saved.');
    console.log('Increment License Usages upon successfull encode & save');
    await this.licensekeyService.incrementUses(licenseId, 'encode', 1);
    console.log('Increment License Usages upon successfull encode & save Done');
    return this.findById(savedSonnicKey._id)
  }

  /**
   * Decodes the uploaded file and finds out the Sonic Key used. The detected Key will be printed to stdout/stderr
   * by the decoder binary (note that decoder binary name is "detect").
   *
   * @param file
   * @param ownerId
   */
  /**
   * Decodes the uploaded file and finds out the Sonic Key used. The detected Key will be printed to stdout/stderr
   * by the decoder binary (note that decoder binary name is "detect").
   * once decoded key is retrived query the table with decoded key and retrive the info about that key along with metadata.
   * @param file
   * @param ownerId
   */
  async decode(file: IUploadedFile) {
    file.path = upath.toUnix(file.path); //Convert windows path to unix path
    const inFilePath = file.path;
    const logFilePath = inFilePath + '.log';
    const argList = ' ' + inFilePath + ' ' + logFilePath;

    const sonicDecodeCmd = `${appConfig.DECODER_EXE_PATH}` + argList;

    //Prabin:Dont wait file to decode. just return Promise itself
    return (
      this.fileOperationService
        .decodeFile(sonicDecodeCmd, logFilePath)
        // return Promise.resolve({
        //   sonicKey:"AA0A6C427826BEB5E37C0EDF4B46AE1B"
        // })
        .finally(() => {
          this.fileHandlerService.deleteFileAtPath(inFilePath);
        })
    );
  }

  async fingerPrintRequestToFPServer(
    originalFileS3Meta: S3FileUploadI,
    sonicKey: string,
    originalFileName: string,
    fileSize: number,
  ) {
    const fingerPrintUrl = this.configService.get<string>(
      'FINGERPRINT_SERVER.fingerPrintUrl',
    );
    const signedS3UrlToOriginalFile = await this.s3FileUploadService.getSignedUrl(
      originalFileS3Meta.Key,
      60 * 10,
    ); //10Min expiry
    return axios
      .post(fingerPrintUrl, {
        s3FileUrl: signedS3UrlToOriginalFile,
        sonicKey: sonicKey,
        originalFileName: originalFileName,
        fileSize: fileSize,
      })
      .then(res => {
        return res.data;
      });
  }

  async findAndGetValidSonicKeyFromRandomDecodedKeys(
    keys: string[],
    saveDetection: boolean,
    detectionToSave: Detection,
  ) {
    var sonicKeys: SonicKey[] = [];
    for await (const key of keys) {
      const sonickey = await this.findBySonicKey(key);
      if (!sonickey) {
        continue;
      }
      if (saveDetection) {
        const newDetection = await this.detectionService.detectionModel.create(
          detectionToSave,
        );
        await newDetection.save();
      }
      sonicKeys.push(sonickey);
    }
    return sonicKeys;
  }

  /**
   * Decodes the uploaded file and finds out all the Sonic Keys used. All the detected Keys will be printed to stdout/stderr
   * by the decoder binary (note that decoder binary name is "detect") and return the array metadata of all the Sonic Keys.
   *
   * @param file
   * @param ownerId
   */
  async decodeAllKeys(file: IUploadedFile) {
    file.path = upath.toUnix(file.path); //Convert windows path to unix path
    const inFilePath = file.path;
    const logFilePath = inFilePath + '.log';
    const argList = ' ' + inFilePath + ' ' + logFilePath;

    const sonicDecodeCmd = `${appConfig.DECODER_EXE_PATH}` + argList;
    //Prabin:Dont wait file to decode. just return Promise itself
    return this.fileOperationService
      .decodeFileForMultipleKeys(sonicDecodeCmd, logFilePath)
      .finally(() => {
        this.fileHandlerService.deleteFileAtPath(inFilePath);
      });
  }

  async exractMusicMetaFromFile(filePath: string) {
    return mm.parseFile(filePath);
  }

  async autoPopulateSonicContentWithMusicMetaForFile(
    file: IUploadedFile,
    sonicKeyDto?: Partial<SonicKeyDto>,
  ) {
    const musicData = await this.exractMusicMetaFromFile(file.path);
    sonicKeyDto.contentSize = sonicKeyDto.contentSize || file?.size;
    sonicKeyDto.contentFileName =
      sonicKeyDto.contentFileName || file?.originalname;
    // sonicKeyDto.contentType = sonicKeyDto.contentType || file?.mimetype;
    sonicKeyDto.contentFileType = sonicKeyDto.contentFileType || file?.mimetype;
    sonicKeyDto.contentDuration =
      sonicKeyDto.contentDuration || musicData?.format?.duration;
    sonicKeyDto.contentEncoding =
      sonicKeyDto.contentEncoding ||
      `${musicData?.format?.codec}, ${
        musicData?.format?.sampleRate
      } Hz, ${musicData?.format?.codecProfile || 'codecProfile'}, ${
        musicData?.format?.bitrate
      } ch`;
    sonicKeyDto.contentSamplingFrequency =
      sonicKeyDto.contentSamplingFrequency ||
      `${musicData?.format?.sampleRate} Hz`;
    sonicKeyDto.contentName =
      sonicKeyDto.contentName || musicData?.common?.title || '';
    sonicKeyDto.contentOwner =
      sonicKeyDto.contentOwner || musicData?.common?.artist || '';
    // sonicKeyDto.contentDescription =sonicKeyDto.contentDescription|| musicData?.common?.description
    //   ? musicData?.common?.description?.[0]
    //   : '';
    return sonicKeyDto;
  }

  async findBySonicKey(sonicKey: string): Promise<SonicKey> {
    return this.sonicKeyModel.findOne({ sonicKey: sonicKey }).lean();
  }

  async findByQueueJobId(queueJobId: string | number): Promise<SonicKey> {
    return this.sonicKeyModel.findOne({ queueJobId: queueJobId }).lean();
  }

  findById(id: string) {
    return this.sonicKeyModel.findById(id);
  }

  async create(doc: AnyObject | AnyKeys<SonicKey>) {
    const newSonicKey = await this.sonicKeyModel.create(doc)
    return newSonicKey.save();
  }

  update(id: string, updateSonicKeyDto: UpdateQuery<SonicKey>) {
    return this.sonicKeyModel.findByIdAndUpdate(id, updateSonicKeyDto, {
      new: true,
    });
  }

  findOne(filter: FilterQuery<SonicKey>) {
    return this.sonicKeyModel.findOne(filter).lean();
  }

  async removeById(id: string) {
    return this.sonicKeyModel.findByIdAndRemove(id);
  }

  async findBySonicKeyOrFail(sonicKey: string) {
    return this.findBySonicKey(sonicKey).then(data => {
      if (!data) throw new NotFoundException('Not found');
      return data;
    });
  }
}
