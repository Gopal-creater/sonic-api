import { Injectable } from '@nestjs/common';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';
import * as https from 'https';
import * as fs from 'fs';

@Injectable()
export class StreamService {
  create(createStreamDto: CreateStreamDto) {
    return 'This action adds a new stream';
  }

  readStream() {
    let writeStream = fs.createWriteStream('stream.mpeg');
    var streamUrl = "https://wg.cdn.tibus.net/fm104MP3128?aw_0_1st.platform=wireless-web&amp;aw_0_1st.playerid=wireless-web&amp;aw_0_req.gdpr=true";
  
    https.get(streamUrl, (response) => {
      response.pipe(writeStream)
    })
    writeStream.on('close', function () {
      console.log('All done!');
    })
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
