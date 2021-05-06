import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { FileOperationService } from '../../../shared/services/file-operation.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SonicKey } from '../schemas/sonickey.schema';
import * as mm from 'music-metadata';
import * as upath from 'upath';
import { nanoid } from 'nanoid';
import { appConfig } from '../../../config';
import { CreateSonicKeyFromJobDto } from '../dtos/create-sonickey.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryDto } from '../../../shared/dtos/query.dto';
import { Job } from '../../job/schemas/job.schema';
import { MongoosePaginateDto } from '../dtos/mongoosepaginate.dto';

// PaginationQueryDtohttps://dev.to/tony133/simple-example-api-rest-with-nestjs-7-x-and-mongoose-37eo
@Injectable()
export class SonickeyService {
  constructor(
    @InjectModel(SonicKey.name) public sonicKeyModel: Model<SonicKey>,
    private readonly fileOperationService: FileOperationService,
    private readonly fileHandlerService: FileHandlerService,
  ) {}

  generateUniqueSonicKey() {
    // TODO: Must verify for uniqueness of generated key
    return nanoid(11);
  }

  async createFromJob(createSonicKeyDto: CreateSonicKeyFromJobDto) {
    const newSonicKey = new this.sonicKeyModel(createSonicKeyDto);
    return newSonicKey.save();
  }

  async getAll(queryDto: QueryDto = {}):Promise<MongoosePaginateDto>{
    const { _limit, _offset, _sort,_page, ...query } = queryDto;
    var paginateOptions={}
    var sort = {};
    if (_sort) {
      var sortItems = _sort?.split(',') || [];
      for (let index = 0; index < sortItems.length; index++) {
        const sortItem = sortItems[index];
        var sortKeyValue = sortItem?.split(':');
        sort[sortKeyValue[0]] =
          sortKeyValue[1]?.toLowerCase() == 'desc' ? -1 : 1;
      }
    }

    paginateOptions["sort"]=sort
    paginateOptions["offset"]=_offset
    paginateOptions["page"]=_page
    paginateOptions["limit"]=_limit


    return await this.sonicKeyModel["paginate"](query,paginateOptions)
    // return this.sonicKeyModel
    //   .find(query || {})
    //   .skip(_offset)
    //   .limit(_limit)
    //   .sort(sort)
    //   .exec();
  }

  /**
   * Encode the uploaded file. Not all params passed from ther front end are used for the actual encoding.
   * Most of them are simply saved as content details. See 'argList' below to see the actual arguments
   * passed to the encoding executable binary (encoder binary name is: watermark). Encoded files are saved
   * with the same name, in a folder named "encodedFiles" in the user's home directory. The parameter ownerId
   * which is the Cognito User ID of the logged in user is used as his home directory name.
   * @param file
   * @param encodingStrength
   */
  async encode(file: IUploadedFile, encodingStrength: number = 10) {
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
        // this.fileHandlerService.deleteFileAtPath(inFilePath);
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
    // return this.fileOperationService
    //   .decodeFileForMultipleKeys(sonicDecodeCmd, logFilePath)
    //   .finally(() => {
    //     this.fileHandlerService.deleteFileAtPath(inFilePath);
    //   });

    // Only for testing
    var validkeys = ['VctJ2KQyBj1','nC7c3ZyOJGe','xIbt68PcTGF'];
    var invalidkeys = ['jdjhjdhsjdhsj','sdskdjksdjk','jdskdksdj']
    var dummykeys = [...validkeys,...invalidkeys]
    return Promise.resolve({
      sonicKeys: [dummykeys[Math.floor(Math.random() * dummykeys.length)]],
    }).finally(() => {
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
    sonicKeyDto.contentFileName = sonicKeyDto.contentFileName || file?.filename;
    sonicKeyDto.contentType = sonicKeyDto.contentType || file?.mimetype;
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
