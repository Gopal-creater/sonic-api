import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { FileOperationService } from '../../../shared/services/file-operation.service';
import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { SonicKey } from '../schemas/sonickey.schema';
import * as mm from 'music-metadata';
import * as upath from 'upath';
import { nanoid } from 'nanoid';
import { appConfig } from '../../../config';
import { CreateSonicKeyFromJobDto } from '../dtos/create-sonickey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoosePaginateSonicKeyDto } from '../dtos/mongoosepaginate-sonickey.dto';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { ChannelEnums, S3ACL } from '../../../constants/Enums';
import { S3FileUploadService } from '../../s3fileupload/s3fileupload.service';
import { DetectionService } from '../../detection/detection.service';
import { Detection } from 'src/api/detection/schemas/detection.schema';
import { UserService } from '../../user/services/user.service';

// PaginationQueryDtohttps://dev.to/tony133/simple-example-api-rest-with-nestjs-7-x-and-mongoose-37eo
@Injectable()
export class SonickeyService {
  constructor(
    @InjectModel(SonicKey.name) public sonicKeyModel: Model<SonicKey>,
    private readonly fileOperationService: FileOperationService,
    private readonly fileHandlerService: FileHandlerService,
    private readonly s3FileUploadService: S3FileUploadService,
    private readonly detectionService: DetectionService,
    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,
  ) {}

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
    const userGroups = await this.userService.adminListGroupsForUser(createSonicKeyDto.owner);
    const newSonicKey = new this.sonicKeyModel({
      ...createSonicKeyDto,
      license: createSonicKeyDto.licenseId || createSonicKeyDto.license,
      channel: channel,
      groups:userGroups.groupNames,
      _id: createSonicKeyDto.sonicKey,
    });
    return newSonicKey.save();
  }


  async createFromBinaryForUser(ownerId: string, sonickey: Record<any,any>) {
    const newSonicKey = new this.sonicKeyModel({
      ...sonickey,
      owner: ownerId
    });
    return newSonicKey.save();
  }

  async saveSonicKeyForUser(ownerId: string, sonickey: Record<any,any>) {
    const newSonicKey = new this.sonicKeyModel({
      ...sonickey,
      owner: ownerId
    });
    return newSonicKey.save();
  }

  async getAll(queryDto: ParsedQueryDto):Promise<MongoosePaginateSonicKeyDto> {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      relationalFilter
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;
    const aggregate=this.sonicKeyModel.aggregate([
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
    ])
    return await this.sonicKeyModel['aggregatePaginate'](aggregate, paginateOptions);
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    return this.sonicKeyModel
      .find(filter || {})
      .count()
  }

  async getEstimateCount() {
    return this.sonicKeyModel.estimatedDocumentCount()
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
  ) {
    // The sonic key generation - done randomely.
    const random11CharKey = this.generateUniqueSonicKey();
    // TODO: Must verify for uniqueness of generated key

    file.path = upath.toUnix(file.path); //Convert windows path to unix path
    file.destination = upath.toUnix(file.destination);
    const inFilePath = file.path;
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
        return this.s3FileUploadService.uploadFromPath(
          outFilePath,
          `${user}/encodedFiles`,
          s3Acl,
        );
      })
      .then(s3UploadResult => {
        return {
          downloadFileUrl: s3UploadResult.Location,
          s3UploadResult: s3UploadResult,
          sonicKey: random11CharKey,
        };
      })
      .finally(() => {
        // this.fileHandlerService.deleteFileAtPath(inFilePath); //delete in callig side
        this.fileHandlerService.deleteFileAtPath(outFilePath); //Delete outFilePath too since we are storing to S3
      });
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
    sonicKeyDto?: SonicKeyDto,
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

  async findBySonicKeyOrFail(sonicKey: string) {
    return this.findBySonicKey(sonicKey).then(data => {
      if (!data) throw new NotFoundException('Not found');
      return data;
    });
  }
}
