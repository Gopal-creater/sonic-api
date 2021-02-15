import { Injectable } from '@nestjs/common';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class StreamService {
  create(createStreamDto: CreateStreamDto) {
    return 'This action adds a new stream';
  }

  async readStream() {
    let writeStream = fs.createWriteStream('stream.mp3');
    // var streamUrl = "https://wg.cdn.tibus.net/fm104MP3128?aw_0_1st.platform=wireless-web&amp;aw_0_1st.playerid=wireless-web&amp;aw_0_req.gdpr=true";
    var streamUrl = 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p'
    var streamResponse = await axios({
      method: 'get',
      url: streamUrl,
      responseType: 'stream'
    })
    
    streamResponse.data.pipe(writeStream)
    // streamResponse.data.on('data',(chunk)=>writeStream.write(chunk))
  }

  findAll() {
    return `This action returns all stream`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stream`;
  }

  update(id: number, updateStreamDto: UpdateStreamDto) {
    return `This action updates a #${id} stream`;
  }

  remove(id: number) {
    return `This action removes a #${id} stream`;
  }
}
