import { UpdateSonicKeyDto } from './dtos/update-sonickey.dto';
import { SonicKeyDto } from './dtos/sonicKey.dto';
import { IUploadedFile } from './../../shared/interfaces/UploadedFile.interface';
import { FileHandlerService } from './../../shared/services/file-handler.service';
import { FileOperationService } from './../../shared/services/file-operation.service';
import { SonicKeyRepository } from './../../repositories/sonickey.repository';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SonicKey } from '../../schemas/sonickey.schema';
import * as mm from 'music-metadata';
import * as upath from 'upath';
import { nanoid } from 'nanoid';
import { appConfig } from '../../config';

@Injectable()
export class SonickeyService {
  constructor(
    public readonly sonicKeyRepository: SonicKeyRepository,
    private readonly fileOperationService: FileOperationService,
    private readonly fileHandlerService: FileHandlerService,
  ) {}

  async getAll() {
    const items = [];
    for await (const item of this.sonicKeyRepository.scan(SonicKey)) {
      // individual items will be yielded as the scan is performed
      items.push(item);
    }
    return items;
  }

  async getAllWithFilter(queryParams: Object) {
    const items = [];
    for await (const item of this.sonicKeyRepository.query(
      SonicKey,
      queryParams,
    )) {
      // individual items will be yielded as the scan is performed
      items.push(item);
    }
    return items;
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
    const random11CharKey = nanoid(11);
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
    console.log('file to decode', file);

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
    console.log('file', file);

    file.path = upath.toUnix(file.path); //Convert windows path to unix path
    const inFilePath = file.path;
    const logFilePath = inFilePath + '.log';
    const argList = ' ' + inFilePath + ' ' + logFilePath;

    const sonicDecodeCmd = `${appConfig.DECODER_EXE_PATH}` + argList;
    console.log('sonicDecodeCmd: ', sonicDecodeCmd);

    //Prabin:Dont wait file to decode. just return Promise itself
    return this.fileOperationService
      .decodeFileForMultipleKeys(sonicDecodeCmd, logFilePath)
      .finally(() => {
        this.fileHandlerService.deleteFileAtPath(inFilePath);
      })
  }


  async search(){
    var items: SonicKey[] = [];
    for await (const item of this.sonicKeyRepository.query(
      SonicKey,
      { "sonicKey.sonicContent.volatileMetadata.contentOwner": "Arba" },
    )) {
      items.push(item);
    }
    return items[0];
  }


  async exractMusicMetaFromFile(filePath: string) {
    return mm.parseFile(filePath);
  }

  async autoPopulateSonicContentWithMusicMetaForFile(
    file: IUploadedFile,
    sonicKeyDto?: SonicKeyDto,
  ) {
    const musicData = await this.exractMusicMetaFromFile(file.path);
    sonicKeyDto.contentSize=file.size;
    sonicKeyDto.contentFileName=file.filename;
    sonicKeyDto.contentType=file.mimetype;
    sonicKeyDto.contentFileType=file.mimetype;
    sonicKeyDto.contentDuration=musicData.format.duration;
    sonicKeyDto.contentEncoding=`${musicData.format.codec}, ${musicData.format.sampleRate} Hz, ${musicData.format.codecProfile}, ${musicData.format.bitrate} ch`;
    sonicKeyDto.contentSamplingFrequency=`${musicData.format.sampleRate} Hz`;
    sonicKeyDto.contentName= sonicKeyDto.contentName ||  musicData.common.title||"";
    sonicKeyDto.contentOwner= sonicKeyDto.contentOwner || musicData.common.artist||"";
    sonicKeyDto.contentDescription=musicData.common.description?musicData.common.description[0]:"";
    return sonicKeyDto
  }

  async findBySonicKey(sonicKey: string) {
    var items: SonicKey[] = [];
    for await (const item of this.sonicKeyRepository.query(
      SonicKey,
      { sonicKey: sonicKey },
    )) {
      items.push(item);
    }
    return items[0];
  }

  async findByOwner(owner: string) {
    var items: SonicKey[] = [];
    for await (const item of this.sonicKeyRepository.query(
      SonicKey,
      { owner: owner },
      { indexName: 'ownerIndex' },
    )) {
      items.push(item);
    }
    return items;
  }


  async findBySonicKeyOrFail(sonicKey: string) {
    return this.findBySonicKey(sonicKey).then(data => {
      if (!data) throw new NotFoundException('key not found');
      return data;
    });
  }
}
