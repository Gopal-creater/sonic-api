import { CreateSonicKeyFromJobDto } from '../dtos/create-sonickey.dto';
import { UpdateSonicKeyDto } from '../dtos/update-sonickey.dto';
import { DecodeDto } from '../dtos/decode.dto';
import { EncodeDto } from '../dtos/encode.dto';
import { SonicKeyDto } from '../dtos/sonicKey.dto';
import { IUploadedFile } from '../../../shared/interfaces/UploadedFile.interface';
import { KeygenService } from '../../../shared/modules/keygen/keygen.service';
import { JsonParsePipe } from '../../../shared/pipes/jsonparse.pipe';
import { isObjectId } from '../../../shared/utils/mongoose.utils';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
  UseGuards,
  Patch,
  Res,
  NotFoundException,
  Query,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SonickeyService } from '../services/sonickey.service';
import { SonicKey } from '../schemas/sonickey.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import * as makeDir from 'make-dir';
import { diskStorage } from 'multer';
import { appConfig } from '../../../config';
import { LicenseValidationGuard } from '../../auth/guards/license-validation.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiAcceptedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import * as uniqid from 'uniqid';
import { JwtAuthGuard } from '../../auth/guards';
import { User } from '../../auth/decorators';
import { FileHandlerService } from '../../../shared/services/file-handler.service';
import { DownloadDto } from '../dtos/download.dto';
import * as appRootPath from 'app-root-path';
import { ParsedQueryDto } from '../../../shared/dtos/parsedquery.dto';
import { ParseQueryValue } from '../../../shared/pipes/parseQueryValue.pipe';
import { Response } from 'express';
import { AnyApiQueryTemplate } from '../../../shared/decorators/anyapiquerytemplate.decorator';

/**
 * Prabin:
 * Our DynamoDb table has a sonickey as a hash key. So we can perform all CURD using sonickey.
 * To get all owner's sonickeys we have to create a global secondary index table.
 */

@ApiTags('SonicKeys Controller')
@Controller('sonic-keys')
export class SonickeyController {
  constructor(
    private readonly sonicKeyService: SonickeyService,
    private readonly keygenService: KeygenService,
    private readonly fileHandlerService: FileHandlerService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All Sonic Keys' })
  @AnyApiQueryTemplate()
  async getAll(@Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto) {
    console.log('queryDto', parsedQueryDto);

    return this.sonicKeyService.getAll(parsedQueryDto);
  }

  @Get('/generate-unique-sonic-key')
  @ApiOperation({ summary: 'Generate unique sonic key' })
  async generateUniqueSonicKey() {
    return await this.sonicKeyService.generateUniqueSonicKey();
  }

  @UseGuards(JwtAuthGuard, LicenseValidationGuard)
  @Post('/create-from-job')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save to database after local encode from job.' })
  async createForJob(
    @Body() createSonicKeyDto: CreateSonicKeyFromJobDto,
    @User('sub') owner: string,
    @Req() req: any,
  ) {
    createSonicKeyDto.owner = owner;
    return this.sonicKeyService.createFromJob(createSonicKeyDto);
  }

  @Get('/owners/:ownerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All Sonic Keys of particular user' })
  async getOwnersKeys(
    @Param('ownerId') ownerId: string,
    @Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto,
  ) {
    parsedQueryDto.filter['owner'] = ownerId;
    return this.sonicKeyService.getAll(parsedQueryDto);
  }

  @Get('/jobs/:jobId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @AnyApiQueryTemplate()
  @ApiOperation({ summary: 'Get All Sonic Keys of particular job' })
  async getKeysByJob(
    @Param('jobId') jobId: string,
    @Query(new ParseQueryValue()) parsedQueryDto: ParsedQueryDto,
  ) {
    parsedQueryDto.filter['job'] = jobId;
    return this.sonicKeyService.getAll(parsedQueryDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get count of all sonickeys' })
  async getCount(@Query() query) {
    return this.sonicKeyService.sonicKeyModel.estimatedDocumentCount({
      ...query,
    });
  }

  @Get('/:sonickey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Single SonicKey' })
  async getOne(@Param('sonickey') sonickey: string) {
    return this.sonicKeyService.findBySonicKeyOrFail(sonickey);
  }

  @UseInterceptors(
    FileInterceptor('mediaFile', {
      // Check the mimetypes to allow for upload
      // fileFilter: (req: any, file: any, cb: any) => {
      //   const mimetype = file.mimetype as string;
      //   if (mimetype.includes('audio')) {
      //     // Allow storage of file
      //     cb(null, true);
      //   } else {
      //     // Reject file
      //     cb(new BadRequestException('Unsupported file type'), false);
      //   }
      // },
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const currentUserId = req['user']['sub'];
          const imagePath = await makeDir(
            `${appConfig.MULTER_DEST}/${currentUserId}`,
          );
          await makeDir(
            `${appConfig.MULTER_DEST}/${currentUserId}/encodedFiles`,
          );
          cb(null, imagePath);
        },
        filename: (req, file, cb) => {
          let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
          const randomName = uniqid();
          cb(null, `${randomName}-${orgName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File To Encode',
    type: EncodeDto,
  })
  @UseGuards(JwtAuthGuard, LicenseValidationGuard)
  @Post('/encode')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encode File And save to database' })
  encode(
    @Body('data', JsonParsePipe) sonicKeyDto: SonicKeyDto,
    @UploadedFile() file: IUploadedFile,
    @User('sub') owner: string,
    @Req() req: any,
  ) {
    console.log('file', file);

    const licenseId = req?.validLicense?.id as string;
    var downloadFileUrl: string;
    var outFilePath: string;
    var sonicKey: string;
    return this.sonicKeyService
      .encode(file, sonicKeyDto.encodingStrength)
      .then(data => {
        downloadFileUrl = data.downloadFileUrl;
        outFilePath = data.outFilePath;
        sonicKey = data.sonicKey;
        console.log('Increment Usages upon successfull encode');
        return this.keygenService.incrementUsage(licenseId, 1);
      })
      .then(async keygenResult => {
        if (keygenResult['errors']) {
          throw new BadRequestException(
            'Unable to increment the license usage!',
          );
        }
        console.log('Going to save key in db.');
        const sonicKeyDtoWithAudioData = await this.sonicKeyService.autoPopulateSonicContentWithMusicMetaForFile(
          file,
          sonicKeyDto,
        );

        const newSonicKey = new this.sonicKeyService.sonicKeyModel({
          ...sonicKeyDtoWithAudioData,
          contentFilePath: downloadFileUrl,
          owner: owner,
          sonicKey: sonicKey,
          _id: sonicKey,
          license: licenseId,
        });
        return newSonicKey.save().finally(() => {
          this.fileHandlerService.deleteFileAtPath(file.path);
        });
      })
      .catch(err => {
        this.fileHandlerService.deleteFileAtPath(file.path);
        throw new InternalServerErrorException(err);
      });
  }

  @UseInterceptors(
    FileInterceptor('mediaFile', {
      // Check the mimetypes to allow for upload
      // fileFilter: (req: any, file: any, cb: any) => {
      //   const mimetype = file.mimetype as string;
      //   if (mimetype.includes('audio')) {
      //     // Allow storage of file
      //     cb(null, true);
      //   } else {
      //     // Reject file
      //     cb(new BadRequestException('Unsupported file type'), false);
      //   }
      // },
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const currentUserId = req['user']['sub'];
          const imagePath = await makeDir(
            `${appConfig.MULTER_DEST}/${currentUserId}`,
          );
          cb(null, imagePath);
        },
        filename: (req, file, cb) => {
          let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
          const randomName = uniqid();
          cb(null, `${randomName}-${orgName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File To Decode',
    type: DecodeDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/decode')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Decode File and retrive key information' })
  async decode(@UploadedFile() file: IUploadedFile) {
    return this.sonicKeyService
      .decodeAllKeys(file)
      .then(async ({ sonicKeys }) => {
        console.log('Detected keys from Decode', sonicKeys);
        //iterate all the sonicKeys from decode function in order to get metadata
        var sonicKeysMetadata = [];
        for await (const sonicKey of sonicKeys) {
          const metadata = await this.sonicKeyService.findBySonicKey(sonicKey);
          if (!metadata) {
            continue;
          }
          sonicKeysMetadata.push(metadata);
        }
        return sonicKeysMetadata;
      })
      .catch(err => {
        this.fileHandlerService.deleteFileAtPath(file.path);
        throw new BadRequestException(err);
      });
  }

  @Patch('/:sonickey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Sonic Keys meta data' })
  async updateMeta(
    @Param('sonickey') sonickey: string,
    @Body() updateSonicKeyDto: UpdateSonicKeyDto,
  ) {
    const updatedSonickey = await this.sonicKeyService.sonicKeyModel.findOneAndUpdate(
      { sonicKey: sonickey },
      updateSonicKeyDto,
      { new: true },
    );
    if (!updatedSonickey) {
      throw new NotFoundException();
    }
    return updatedSonickey;
  }

  @Delete('/:sonickey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Sonic Key data' })
  async delete(@Param('sonickey') sonickey: string) {
    const deletedSonickey = await this.sonicKeyService.sonicKeyModel.deleteOne({
      sonicKey: sonickey,
    });
    if (!deletedSonickey) {
      throw new NotFoundException();
    }
    return deletedSonickey;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/download-file')
  @ApiOperation({ summary: 'Secure Download of a file' })
  async downloadFile(
    @Body() downloadDto: DownloadDto,
    @User('sub') userId: string,
    @Res() response: Response,
  ) {
    /* Checks for authenticated user in order to download the file */
    if (!downloadDto?.fileURL?.includes(userId)) {
      throw new UnauthorizedException('You are not the owner of this file');
    }

    const filePath = `${appRootPath.toString()}/` + downloadDto.fileURL;
    console.log('file-path:', filePath);
    const isFileExist = await this.fileHandlerService.fileExistsAtPath(
      filePath,
    );
    if (!isFileExist) {
      throw new BadRequestException('Sorry, file not found');
    }
    return response.sendFile(filePath, err => {
      if (err) {
        console.log(err);
        return response.status(400).json({ message: 'Error sending file.' });
      }
    });
  }
}
