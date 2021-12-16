import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Detection } from './schemas/detection.schema';
import { Aggregate, Model } from 'mongoose';
import { ParsedQueryDto } from '../../shared/dtos/parsedquery.dto';
import { MongoosePaginateDeectionDto } from './dto/mongoosepaginate-radiostationsonickey.dto';
import { ChannelEnums } from 'src/constants/Enums';
import { toObjectId } from 'src/shared/utils/mongoose.utils';
import { groupByTime } from 'src/shared/types';
import { UserService } from '../user/user.service';
import {
  TopRadioStation,
  TopRadioStationWithTopSonicKey,
  GraphData,
  TopSonicKey,
  PlaysCountResponseDto,
  TopRadioStationWithPlaysDetails,
} from './dto/general.dto';

@Injectable()
export class DetectionService {
  constructor(
    @InjectModel(Detection.name)
    public readonly detectionModel: Model<Detection>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getPlaysDashboardData(filter: Record<any, any>) {
    const playsCount = await this.getTotalPlaysCount({ filter: filter });
    const radioStationsCount = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $group: {
          _id: '$radioStation',
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: null },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: '' },
        },
      },
    ]);
    const countriesCount = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $group: {
          _id: '$radioStation.country',
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: null },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: '' },
        },
      },
    ]);

    return {
      playsCount: playsCount?.playsCount||0,
      radioStationsCount: radioStationsCount.length,
      countriesCount: countriesCount.length,
    };
  }

  async getPlaysDashboardGraphData(filter: Record<any, any>) {
    const playsCountryWise = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $group: {
          _id: '$radioStation.country',
          total: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: null },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: '' },
        },
      },
    ]);

    const playsStationWise = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $group: {
          _id: '$radioStation.name',
          total: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: null },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: '' },
        },
      },
    ]);

    const playsSongWise = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $group: {
          _id: '$sonicKey.contentName',
          total: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: null },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: '' },
        },
      },
    ]);

    const playsArtistWise = await this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $group: {
          _id: '$sonicKey.contentOwner',
          total: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: null },
        },
      },
      {
        $match: {
          _id: { $exists: true, $ne: '' },
        },
      },
    ]);

    return {
      playsCountryWise,
      playsSongWise,
      playsStationWise,
      playsArtistWise,
    };
  }

  async listPlays(queryDto: ParsedQueryDto, recentPlays: boolean = false) {
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
          detectedAt: -1,
          ...sort,
        },
      },
      {
        $lookup: {
          //populate sonickey from its relational table
          from: 'SonicKey',
          localField: 'sonicKey',
          foreignField: '_id',
          as: 'sonicKey',
        },
      },
      { $addFields: { sonicKey: { $first: '$sonicKey' } } },
      {
        $lookup: {
          //populate radioStation from its relational table
          from: 'RadioStation',
          localField: 'radioStation',
          foreignField: '_id',
          as: 'radioStation',
        },
      },
      { $addFields: { radioStation: { $first: '$radioStation' } } },
      {
        $match: {
          ...relationalFilter,
        },
      },
    ];
    if (recentPlays) {
      aggregateArray.push({
        $limit: limit,
      });
      return this.detectionModel.aggregate(aggregateArray);
    }
    const aggregate = this.detectionModel.aggregate(aggregateArray);
    return this.detectionModel['aggregatePaginate'](aggregate, paginateOptions);
  }

  async findAll(
    queryDto: ParsedQueryDto,
    aggregateQuery?: boolean,
  ): Promise<MongoosePaginateDeectionDto> {
    const {
      limit,
      skip,
      sort,
      page,
      filter,
      select,
      populate,
      aggregateSearch,
      includeGroupData,
    } = queryDto;
    var paginateOptions = {};
    paginateOptions['sort'] = sort;
    paginateOptions['select'] = select;
    paginateOptions['populate'] = populate;
    paginateOptions['offset'] = skip;
    paginateOptions['page'] = page;
    paginateOptions['limit'] = limit;

    // if (includeGroupData && filter.owner) {
    //   //If includeGroupData, try to fetch all data belongs to the user's groups and use the OR condition to fetch data
    //   const usergroups = await this.userService.adminListGroupsForUser(
    //     filter.owner,
    //   );
    //   if (usergroups.groupNames.length > 0) {
    //     filter['$or'] = [
    //       { groups: { $all: usergroups.groupNames } },
    //       { owner: filter.owner },
    //     ];
    //     delete filter.owner;
    //   }
    // }

    const aggregate = this.detectionModel.aggregate([
      {
        $match: {
          ...filter,
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
    ]);

    if (aggregateQuery) {
      return this.detectionModel['aggregatePaginate'](
        aggregate,
        paginateOptions,
      );
    } else {
      return this.detectionModel['paginate'](filter, paginateOptions);
    }
  }

  async getTotalHitsCount(queryDto: ParsedQueryDto) {
    const { filter, includeGroupData } = queryDto;
    // if (includeGroupData && filter.owner) {
    //   //If includeGroupData, try to fetch all data belongs to the user's groups and use the OR condition to fetch data
    //   const usergroups = await this.userService.adminListGroupsForUser(
    //     filter.owner,
    //   );
    //   if (usergroups.groupNames.length > 0) {
    //     filter['$or'] = [
    //       { groups: { $all: usergroups.groupNames } },
    //       { owner: filter.owner },
    //     ];
    //     delete filter.owner;
    //   }
    // }
    return this.detectionModel
      .find(filter || {})
      .countDocuments()
      .exec();
  }

  /**
   *db.collection.aggregate([
  {
    $sort: {
      detectedAt: 1
    }
  },
  {
    $group: {
      "_id": null,
      "sonicKeys": {
        $push: "$sonicKey"
      },
      "initialResults": {
        $push: "$$ROOT"
      }
    }
  },
  //Since Reduce function starts with its initial Value, we have to add some dummy data at the end of array
  {
    $project: {
      initialResults: {
        $concatArrays: [
          "$initialResults",
          [
            {
              "sonicKey": "Unknown"
            }
          ]
        ]
      },
      uniqueSonicKeys: {
        $setUnion: {
          $reduce: {
            input: "$sonicKeys",
            initialValue: [],
            in: {
              $concatArrays: [
                "$$value",
                [
                  "$$this"
                ]
              ]
            },
            
          },
          
        }
      }
    }
  },
  {
    $project: {
      uniqueSonicKeys: 1,
      sonicKeysWithCount: {
        $reduce: {
          input: "$initialResults",
          initialValue: {
            item: null,
            count: 1,
            dates: [
              {
                $first: "$initialResults.detectedAt"
              }
            ],
            results: []
          },
          in: {
            $cond: [
              {
                $eq: [
                  {
                    $strcasecmp: [
                      "$$value.item",
                      "$$this.sonicKey"
                    ]
                  },
                  0
                ]
              },
              {
                results: "$$value.results",
                item: "$$this.sonicKey",
                count: {
                  $add: [
                    "$$value.count",
                    1
                  ]
                },
                dates: {
                  $concatArrays: [
                    "$$value.dates",
                    [
                      "$$this.detectedAt"
                    ]
                  ]
                }
              },
              {
                results: {
                  $concatArrays: [
                    "$$value.results",
                    [
                      {
                        item: "$$value.item",
                        count: "$$value.count",
                        dates: "$$value.dates"
                      }
                    ]
                  ]
                },
                item: "$$this.sonicKey",
                count: 1,
                dates: [
                  "$$this.detectedAt"
                ]
              }
            ]
          }
        }
      }
    }
  },
  //Since Reduce function add dummy data in the begning of array which we dont need, lets remove it
  {
    $project: {
      uniqueSonicKeys: 1,
      sonicKeysWithCount: {
        $slice: [
          "$sonicKeysWithCount.results",
          1,
          {
            $size: "$sonicKeysWithCount.results"
          }
        ]
      },
      
    }
  },
  {
    $addFields: {
      playsCount: {
        $size: "$sonicKeysWithCount"
      },
      uniquePlaysCount: {
        $size: "$uniqueSonicKeys"
      },
      sonicKeysWithCount: {
        $map: {
          input: "$sonicKeysWithCount",
          as: "data",
          in: {
            item: "$$data.item",
            count: "$$data.count",
            dates: "$$data.dates",
            duration: {
              $dateDiff: {
                startDate: {
                  $first: "$$data.dates"
                },
                endDate: {
                  $last: "$$data.dates"
                },
                unit: "second"
              }
            }
          }
        }
      }
    }
  }
])
   * @param queryDto 
   * @returns 
   */
  async getTotalPlaysCount(
    queryDto: ParsedQueryDto,
  ): Promise<PlaysCountResponseDto> {
    const { filter } = queryDto;
    const playsCountDetails = await this.detectionModel.aggregate([
      {
        $match: filter,
      },
      {
        $sort: {
          detectedAt: -1, //Desending Order
        },
      },
      {
        $group: {
          _id: null,
          sonicKeys: {
            $push: '$sonicKey',
          },
          initialResults: {
            $push: '$$ROOT',
          },
        },
      },
      //Since Reduce function starts with its initial Value, we have to add some dummy data at the end of array
      {
        $project: {
          initialResults: {
            $concatArrays: [
              '$initialResults',
              [
                {
                  sonicKey: 'Unknown',
                },
              ],
            ],
          },
          uniqueSonicKeys: {
            $setUnion: {
              $reduce: {
                input: '$sonicKeys',
                initialValue: [],
                in: {
                  $concatArrays: ['$$value', ['$$this']],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          uniqueSonicKeys: 1,
          sonicKeysWithCount: {
            $reduce: {
              input: '$initialResults',
              initialValue: {
                item: null,
                count: 1,
                dates: [
                  {
                    $first: '$initialResults.detectedAt',
                  },
                ],
                results: [],
              },
              in: {
                $cond: [
                  {
                    $eq: [
                      {
                        $strcasecmp: ['$$value.item', '$$this.sonicKey'],
                      },
                      0,
                    ],
                  },
                  {
                    results: '$$value.results',
                    item: '$$this.sonicKey',
                    count: {
                      $add: ['$$value.count', 1],
                    },
                    dates: {
                      $concatArrays: ['$$value.dates', ['$$this.detectedAt']],
                    },
                  },
                  {
                    results: {
                      $concatArrays: [
                        '$$value.results',
                        [
                          {
                            item: '$$value.item',
                            count: '$$value.count',
                            dates: '$$value.dates',
                          },
                        ],
                      ],
                    },
                    item: '$$this.sonicKey',
                    count: 1,
                    dates: ['$$this.detectedAt'],
                  },
                ],
              },
            },
          },
        },
      },
      //Since Reduce function add dummy data in the begning of array which we dont need, lets remove it
      {
        $project: {
          uniqueSonicKeys: 1,
          sonicKeysWithCount: {
            $slice: [
              '$sonicKeysWithCount.results',
              1,
              {
                $size: '$sonicKeysWithCount.results',
              },
            ],
          },
        },
      },
      {
        $addFields: {
          playsCount: {
            $ifNull: [
              {
                $size: '$sonicKeysWithCount',
              },
              0,
            ],
          },
          uniquePlaysCount: {
            $ifNull: [
              {
                $size: '$uniqueSonicKeys',
              },
              0,
            ],
          }
        },
      },
      {
        $project: {
          playsCount: 1,
          uniquePlaysCount: 1,
        },
      },
    ]);
    return playsCountDetails[0];
  }

  async findTopRadioStationsWithPlaysCountForOwner(
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
      const playsCount = await this.getTotalPlaysCount({
        filter: {
          ...filter,
          owner: ownerId,
          radioStation: station._id,
        },
      });
      station['playsCount'] = playsCount;
      topStationsWithTopKeys.push(station);
    }
    return topStationsWithTopKeys as TopRadioStationWithPlaysDetails[];
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
    filter['channel'] = ChannelEnums.STREAMREADER;
    const topRadioStations: TopRadioStation[] = await this.detectionModel.aggregate(
      [
        {
          $match: filter,
        },
        { $group: { _id: '$radioStation', totalKeysDetected: { $sum: 1 } } }, //group by radioStation to get duplicates counts
        { $sort: { totalKeysDetected: -1 } }, //sort in decending order
        { $limit: topLimit }, //get the top number of results only
        {
          $lookup: {
            //populate radioStation from its relational table
            from: 'RadioStation',
            localField: '_id',
            foreignField: '_id',
            as: 'radioStation',
          },
        },
        //lookup will return array so always tale first index elememt
        {
          $project: {
            radioStation: { $first: '$radioStation' },
            totalKeysDetected: 1,
            otherField: 1,
          },
        },
      ],
    );
    return topRadioStations;
  }

  async findTopSonicKeysForRadioStation(
    radioStationId: string,
    topLimit: number,
    filter: object = {},
  ) {
    const stationId = toObjectId(radioStationId);
    const topSonicKeys: TopSonicKey[] = await this.detectionModel.aggregate([
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
    } else {
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
