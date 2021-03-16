import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import  * as appRootPath from 'app-root-path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


global['fetch'] = require('node-fetch');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
    bodyParser:true
  });
  const configService = app.get(ConfigService);
  app.enableCors({
    origin:'https://portal.sonicdata.com',
    optionsSuccessStatus: 200
  })
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useStaticAssets(appRootPath.path.toString()+'/storage',{prefix:'/storage'})
  app.useGlobalPipes(new ValidationPipe({transform:true}))
  const PORT = configService.get('PORT',8000)

   //Swagger Integration
  const options = new DocumentBuilder()
    .setTitle('Sonic API Development')
    .setDescription('The Sonic API description')
    .setVersion('1.0')
    .addTag('Sonic End Points')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger-api', app, document);

  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch(err=>console.log(err));