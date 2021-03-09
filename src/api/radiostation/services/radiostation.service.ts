import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRadiostationDto } from '../dto/create-radiostation.dto';
import { UpdateRadiostationDto } from '../dto/update-radiostation.dto';
import { RadioStationRepository } from '../../../repositories/radiostation.repository';
import { RadioStation } from '../../../schemas/radiostation.schema';
import { QueryOptions, ScanOptions } from '@aws/dynamodb-data-mapper';

@Injectable()
export class RadiostationService {
  constructor(public readonly radioStationRepository: RadioStationRepository) {}
  create(createRadiostationDto: CreateRadiostationDto) {
    const dataToSave = Object.assign(new RadioStation(), createRadiostationDto);
    return this.radioStationRepository.put(dataToSave);
  }

  async stopListeningStream(id: string) {
    const radioStation = await this.findOne(id);
    if (!radioStation.isStreamStarted) {
      throw new BadRequestException('Not started to stop.');
    }
    //Do Stop Listening Stuff
    radioStation.stopAt = new Date();
    radioStation.isStreamStarted = false;
    return this.radioStationRepository.update(radioStation);
  }

  async startListeningStream(id: string) {
    const radioStation = await this.findOne(id);
    if (radioStation.isStreamStarted) {
      throw new BadRequestException('Already started');
    }
    //Do Start Listening Stuff
    radioStation.startedAt = new Date();
    radioStation.isStreamStarted = true;
    return this.radioStationRepository.update(radioStation);
  }

  async findAll(scanOption?:ScanOptions) {
    const items: RadioStation[] = [];
    const iterator = this.radioStationRepository.scan(RadioStation,{...scanOption})
    for await (const item of iterator) {
      // individual items will be yielded as the scan is performed
      items.push(item);
    }
    return items;
  }

  async findAllWithPagination(scanOption?:ScanOptions) {
    var items: RadioStation[] = [];
    const paginator = this.radioStationRepository.scan(RadioStation,{...scanOption}).pages()
    for await (const item of paginator) {
      console.log(
        paginator.count,
        paginator.scannedCount,
        paginator.lastEvaluatedKey
    );
      // individual items will be yielded as the scan is performed
      items=item
    }
    console.log("paginator",paginator);
    
    return items;
  }

  async findOne(id: string) {
    const items: RadioStation[] = [];
    for await (const item of this.radioStationRepository.query(RadioStation, {
      id: id,
    })) {
      items.push(item);
    }

    return items[0];
  }

  async update(id: string, updateRadiostationDto: UpdateRadiostationDto) {
    const radioStation = await this.findOne(id);
    return this.radioStationRepository.update(
      Object.assign(radioStation, updateRadiostationDto),
    );
  }

  async findByOwner(owner: string,queryOptions?:QueryOptions) {
    var items: RadioStation[] = [];
    const iterator = this.radioStationRepository.query(
      RadioStation,
      { owner: owner },
      { indexName: 'ownerIndex',...queryOptions },
    )
    for await (const item of iterator) {
      items.push(item);
    }
    return items;
  }

  async remove(id: string) {
    const radioStation = await this.findOne(id);
    return this.radioStationRepository.delete(radioStation);
  }

  bulkRemove(ids: [string]) {
    const promises = ids.map(id => this.remove(id));
    return Promise.all(promises);
  }

  bulkStartListeningStream(ids: [string]) {
    const promises = ids.map(id => this.startListeningStream(id));
    return Promise.all(promises);
  }

  bulkStopListeningStream(ids: [string]) {
    const promises = ids.map(id => this.stopListeningStream(id));
    return Promise.all(promises);
  }
}
