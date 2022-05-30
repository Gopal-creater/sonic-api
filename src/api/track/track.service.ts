import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Track } from './schemas/track.schema';
import { Model, FilterQuery, AnyObject, AnyKeys, UpdateQuery } from 'mongoose';
import { UserService } from '../user/services/user.service';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import * as mm from 'music-metadata';
import { IUploadedFile } from '../../shared/interfaces/UploadedFile.interface';
import { S3FileUploadService } from '../s3fileupload/s3fileupload.service';
import { MongoosePaginateTrackDto } from './dto/mongoosepaginate-track.dto';
import { customAlphabet,nanoid} from 'nanoid'
import { UserDB } from '../user/schemas/user.db.schema';
import { SystemRoles, S3ACL, ChannelEnums } from 'src/constants/Enums';
import { UploadTrackDto } from './dto/create-track.dto';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name)
    public readonly trackModel: Model<Track>,
    public readonly s3FileUploadService: S3FileUploadService,

    @Inject(forwardRef(() => UserService))
    public readonly userService: UserService,
  ) {}
  async create(doc: AnyObject | AnyKeys<Track>) {
    const trackId = this.generateTrackId();
    return this.trackModel.create({...doc,_id:trackId}).then(createdTrack => {
      return createdTrack.save();
    });
  }

  async uploadAndCreate(file:IUploadedFile,doc: AnyObject | AnyKeys<Track>,s3destinationFolder?:string,acl?:S3ACL) {
    const {channel, artist, title } = doc;
    const s3FileUploadResponse = await this.s3FileUploadService.uploadFromPath(
      file.path,
      `${s3destinationFolder}/originalFiles`,
    );
    const extractFileMeta = await this.exractMusicMetaFromFile(
      file,
    );
    const trackId = this.generateTrackId();
    const createdTrack = await this.create({
      _id: trackId,
      ...doc,
      channel: channel || ChannelEnums.PORTAL,
      mimeType: extractFileMeta.mimeType,
      duration: extractFileMeta.duration,
      artist: artist,
      title: title,
      fileSize: extractFileMeta.size,
      localFilePath: file.path,
      s3OriginalFileMeta: s3FileUploadResponse,
      encoding: extractFileMeta.encoding,
      samplingFrequency: extractFileMeta.samplingFrequency,
      originalFileName: file.originalname,
      iExtractedMetaData: extractFileMeta
    });
    return createdTrack
  }

   generateTrackId(){
    return `T${customAlphabet('1234567890', 8)}`
  }

  findAll(queryDto: ParsedQueryDto):Promise<MongoosePaginateTrackDto> {
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
    var aggregateArray: any[] = [
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
    ];
    const aggregate = this.trackModel.aggregate(aggregateArray);
    return this.trackModel['aggregatePaginate'](aggregate, paginateOptions);
  }

  findOne(filter: FilterQuery<Track>) {
    return this.trackModel.findOne(filter);
  }

  findById(id: string) {
    return this.trackModel.findById(id);
  }

  update(
    id: string,
    updateTrackDto: UpdateQuery<Track>
  ) {
    return this.trackModel.findByIdAndUpdate(
      id,
      updateTrackDto,
      {
        new: true,
      },
    );
  }

  async getCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    return this.trackModel.find(filter || {}).count();
  }

  async getEstimateCount() {
    return this.trackModel.estimatedDocumentCount();
  }

  async removeById(id: string) {
    const deletedTrack = await this.trackModel.findByIdAndRemove(id);
    return deletedTrack;
  }

  async exractMusicMetaFromFile(file: IUploadedFile) {
    const musicData = await mm.parseFile(file.path);
    return {
      size: file.size,
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      duration: musicData?.format?.duration,
      encoding: `${musicData?.format?.codec}, ${
        musicData?.format?.sampleRate
      } Hz, ${musicData?.format?.codecProfile || 'codecProfile'}, ${
        musicData?.format?.bitrate
      } ch`,
      samplingFrequency: `${musicData?.format?.sampleRate} Hz`,
      medaData: musicData,
    };
  }
}
