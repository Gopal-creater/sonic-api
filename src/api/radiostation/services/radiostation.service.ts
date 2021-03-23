import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
    const radioStation = await this.findById(id);
    if(!radioStation){
      return Promise.reject({notFound:true,status:404,message:"Item not found"})
    }
    if (!radioStation.isStreamStarted) {
      return radioStation
    }
    //Do Stop Listening Stuff
    radioStation.stopAt = new Date();
    radioStation.isStreamStarted = false;
    return this.radioStationRepository.update(radioStation);
  }

  async startListeningStream(id: string) {
    const radioStation = await this.findById(id);
    if(!radioStation){
      return Promise.reject({notFound:true,status:404,message:"Item not found"})
    }
    if (radioStation.isStreamStarted) {
      return radioStation
    }
    //https://nodejs.org/api/worker_threads.html
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

  async findById(id: string) {
    const items: RadioStation[] = [];
    for await (const item of this.radioStationRepository.query(RadioStation, {
      id: id,
    })) {
      items.push(item);
    }

    return items[0];
  }

  async findByIdOrFail(id: string) {
    const radioStation = await this.findById(id); 
    if(!radioStation){
      throw new NotFoundException()
    }
    return radioStation
  }

  async update(id: string, updateRadiostationDto: UpdateRadiostationDto) {
    const radioStation = await this.findByIdOrFail(id);
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

  async removeById(id: string) {
    const radioStation = await this.findById(id);
    if(!radioStation){
      return Promise.reject({notFound:true,status:404,message:"Item not found"})
    }
    return this.radioStationRepository.delete(radioStation);
  }

  async bulkRemove(ids: [string]) {
    const promises = ids.map(id => this.removeById(id).catch(err=>({promiseError:err,data:id})));
    return Promise.all(promises).then(values=>{
      const failedData=values.filter(item=>item["promiseError"]) as {promiseError:any,data:string}[]
      const passedData=values.filter(item=>!item["promiseError"]) as RadioStation[]
      return{
        passedData:passedData,
        failedData:failedData
      }
    })
  }

  async bulkStartListeningStream(ids: [string]) {
    const promises = ids.map(id => this.startListeningStream(id).catch(err=>({promiseError:err,data:id})));
    return Promise.all(promises).then(values=>{
      const failedData=values.filter(item=>item["promiseError"]) as {promiseError:any,data:string}[]
      const passedData=values.filter(item=>!item["promiseError"]) as RadioStation[]
      return{
        passedData:passedData,
        failedData:failedData
      }
    })
  }

  async bulkStopListeningStream(ids: [string]) {
    const promises = ids.map(id => this.stopListeningStream(id).catch(err=>({promiseError:err,data:id})));
    return Promise.all(promises).then(values=>{
      const failedData=values.filter(item=>item["promiseError"]) as {promiseError:any,data:string}[]
      const passedData=values.filter(item=>!item["promiseError"]) as RadioStation[]
      return{
        passedData:passedData,
        failedData:failedData
      }
    })
  }
}
