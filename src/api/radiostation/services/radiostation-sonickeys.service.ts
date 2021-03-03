import { Injectable, BadRequestException } from '@nestjs/common';
import { RadioStationRepository } from '../../../repositories/radiostation.repository';
import { RadioStationSonicKeyRepository } from '../../../repositories/radiostationSonickey.repository';
import { RadioStationSonicKey } from '../../../schemas/radiostationSonickey.schema';
import { CreateRadiostationSonicKeyDto } from '../dto/radiostation-sonickey-dto/create-radiostation-sonickey.dto';

@Injectable()
export class RadiostationSonicKeysService {
  constructor(public readonly radioStationRepository: RadioStationRepository,public readonly radioStationSonicKeysRepository: RadioStationSonicKeyRepository) {}
  create(createRadiostationSonicKeyDto: CreateRadiostationSonicKeyDto) {
    const dataToSave = Object.assign(new RadioStationSonicKey(), createRadiostationSonicKeyDto,{count:1});
    return this.radioStationSonicKeysRepository.put(dataToSave);
  }


  async findAllSonicKeysForRadioStation(radioStation:string) {
    const items: RadioStationSonicKey[] = [];
    for await (const item of this.radioStationSonicKeysRepository.query(RadioStationSonicKey,{radioStation:radioStation})) {
      items.push(item);
    }
    return items;
  }

  async findOne(radioStation: string,sonicKey:string) {
    return this.radioStationSonicKeysRepository.get(Object.assign(new RadioStationSonicKey,{radioStation:radioStation,sonicKey:sonicKey}))
  }

  async incrementCount(radioStation: string,sonicKey:string) {
    const radioStationSonicKey = await this.findOne(radioStation,sonicKey);
    if(radioStationSonicKey){
      return this.radioStationSonicKeysRepository.update(
        Object.assign(radioStationSonicKey, {count:radioStationSonicKey.count+1}),
      );
    }
 
  }

}
