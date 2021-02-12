import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { StreamService } from './stream.service';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';

@ApiTags('Stream Controller')
@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}
  

  @Get()
  readStream() {
    this.streamService.readStream();
    return "Read Stream is reading and writing to the file..."
  }
}
