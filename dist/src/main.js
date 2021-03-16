"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
global['fetch'] = require('node-fetch');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: true
    });
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: 'https://portal.sonicdata.com',
        optionsSuccessStatus: 200
    });
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    const PORT = configService.get('PORT', 8000);
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Sonic API Development')
        .setDescription('The Sonic API description')
        .setVersion('1.0')
        .addTag('Sonic End Points')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('/swagger-api', app, document);
    await app.listen(PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch(err => console.log(err));
//# sourceMappingURL=main.js.map