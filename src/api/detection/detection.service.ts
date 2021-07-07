import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Detection } from './schemas/detection.schema';
import { Model } from 'mongoose';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { MongoosePaginateDeectionDto } from './dto/mongoosepaginate-radiostationsonickey.dto';
import { ChannelEnums } from 'src/constants/Channels.enum';
import { toObjectId } from 'src/shared/utils/mongoose.utils';
import { groupByTime } from 'src/shared/types';
import { TopRadioStation,TopRadioStationWithTopSonicKey,GraphData,TopSonicKey } from './dto/general.dto';

@Injectable()
export class DetectionService {
  constructor(
    @InjectModel(Detection.name)
    public readonly detectionModel: Model<Detection>,
  ) {}

  async findAll(
    queryDto: ParsedQueryDto,
  ): Promise<MongoosePaginateDeectionDto> {
    const { limit, skip, sort, page, filter, select, populate } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;

    return await this.detectionModel['paginate'](filter, paginateOptions);
  }

  // perfect example==> https://stackoverflow.com/questions/22932364/mongodb-group-values-by-multiple-fields
  async findTopRadioStationsWithSonicKeysForOwner(
    ownerId: string,
    topLimit: number,
    filter: object = {},
  ) {
    const topStations = await this.findTopRadioStations(
      { ...filter, owner: ownerId },
      topLimit,
    );
    var topStationsWithTopKeys = [];
    for await (const station of topStations) {
      const sonicKeys = await this.findTopSonicKeysForRadioStation(
        station._id,
        topLimit,
        filter,
      );
      station['sonicKeys'] = sonicKeys;
      topStationsWithTopKeys.push(station);
    }
    return topStationsWithTopKeys as TopRadioStationWithTopSonicKey[];
  }

  async findTopRadioStations(filter: object, topLimit: number) {
    filter['channel'] = ChannelEnums.RADIOSTATION;
    const topRadioStations: TopRadioStation[] = await this.detectionModel.aggregate([
      {
        $match: filter,
      },
      { $group: { _id: '$radioStation', totalKeysDetected: { $sum: 1 } } }, //group by radioStation to get duplicates counts
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: '_id',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      {
        $project: {
          radioStation: { $first: '$radioStation' },
          totalKeysDetected: 1,
          otherField: 1,
        }, //lookup will return array so always tale first index elememt
      },
      { $sort: { totalKeysDetected: -1 } }, //sort in decending order
      { $limit: topLimit }, //get the top number of results only
    ]);
    return topRadioStations;
  }

  async findTopSonicKeysForRadioStation(
    radioStationId: string,
    topLimit: number,
    filter: object = {},
  ) {
    const stationId = toObjectId(radioStationId);
    const topSonicKeys:TopSonicKey[] = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
          radioStation: stationId,
        },
      },
      { $group: { _id: '$sonicKey', totalHits: { $sum: 1 } } }, //group by radioStation to get duplicates counts
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'SonicKey',
          localField: '_id',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      {
        $project: {
          sonicKey: { $first: '$sonicKey' },
          totalHits: 1,
          otherField: 1,
        }, //lookup will return array so always tale first index elememt
      },
      { $sort: { totalHits: -1 } }, //sort in decending order
      { $limit: topLimit }, //get the top number of results only
    ]);
    return topSonicKeys;
  }

  async findGraphOfSonicKeysForRadioStationInSpecificTime(
    radioStationId: string,
    groupByTime: groupByTime,
    filter: object = {},
  ) {
    const stationId = toObjectId(radioStationId);
    var group_id = {};
    if (groupByTime == 'year') {
      group_id['year'] = { $year: '$detectedAt' };
    } else if (groupByTime == 'month') {
      group_id['month'] = { $month: '$detectedAt' };
    } else if (groupByTime == 'dayOfMonth') {
      group_id['dayOfMonth'] = { $dayOfMonth: '$detectedAt' };
    }
    const graphData: {
      _id: any;
      year: number;
      month: number;
      day: number;
      hits: number;
    }[] = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
          radioStation: stationId,
        },
      },
      {
        $group: {
          _id: group_id,
          detectedAt: { $first: '$detectedAt' },
          hits: { $sum: 1 },
        },
      }, //group by radioStation to get duplicates counts
      {
        $project: {
          _id: 1,
          // year: "$_id.year",
          // month:"$_id.month",
          // dayOfMonth: "$_id.dayOfMonth",
          // monthName: {
          //   $arrayElemAt: [
          //     ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
          //     "$_id.month"
          //   ]
          // },
          year: { $year: '$detectedAt' },
          month: { $month: '$detectedAt' },
          day: { $dayOfMonth: '$detectedAt' },
          hits: 1,
        },
      },
    ]);
    return graphData;
  }
}
