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

  // http://www.suppertime.co.uk/blogmywiki/2015/04/updated-list-of-bbc-network-radio-urls/
  // Please check the link below. We need to select the most popular 100+ radio stations and support monitoring the audio streams from them (well most of them).
  // https://www.cloudrad.io/internet-radio-directory

  // Here is the streaming details of BBC radio stations:
  // https://www.bbc.com/sounds/help/questions/about-bbc-sounds-and-our-policies/codecs-bitrates

  // Here is how to do the listening of radio stations that use HLS (HTTP Live Streaming protocol) and get data from it to give to our decoder using FFMPEG. Read this along with the streaming setup document I shared earlier, which uses another protocol called SDP:
  // https://www.codementor.io/@chuksdurugo/download-and-combine-media-segments-of-a-hls-stream-locally-using-ffmpeg-150zo6t775
  async readStream() {
    let writeStream = fs.createWriteStream('stream.mp3');
    // var streamUrl = "https://wg.cdn.tibus.net/fm104MP3128?aw_0_1st.platform=wireless-web&amp;aw_0_1st.playerid=wireless-web&amp;aw_0_req.gdpr=true";
    var streamUrl = 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p';
    var streamResponse = await axios({
      method: 'get',
      url: streamUrl,
      responseType: 'stream',
    });

    streamResponse.data.pipe(writeStream);
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
