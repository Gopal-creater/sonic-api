"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const appRootPath = require("app-root-path");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const basicAuth = require("express-basic-auth");
const class_validator_1 = require("class-validator");
global['fetch'] = require('node-fetch');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: true,
    });
    class_validator_1.useContainer(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    app.use(['/swagger-api/*', '/swagger-api-json'], basicAuth({
        challenge: true,
        users: {
            swaggeruser: 'swaggeruser@2021',
        },
    }));
    app.enableVersioning();
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: [
            'https://portal.sonicdata.com',
            'https://admin.sonicdata.com',
            'http://admin.sonicdata.com',
            'https://sonicportal.arba-dev.uk',
            'https://sonicadminportal.arba-dev.uk',
            'http://localhost:3000',
            'https://localhost:3000',
            'http://localhost:8001',
            'https://localhost:8001',
            'http://localhost:8002',
            'https://localhost:8002',
        ],
    });
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useStaticAssets(appRootPath.path.toString() + '/storage/uploads/guest', { prefix: '/storage/uploads/guest' });
    app.useStaticAssets(appRootPath.path.toString() + '/storage/uploads/public', { prefix: '/storage/uploads/public' });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    const PORT = configService.get('PORT') || 8000;
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Sonic API Development')
        .setDescription('The Sonic API description')
        .setVersion('1.0')
        .addTag('Sonic End Points')
        .addBearerAuth()
        .addApiKey({
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key'
    }, 'x-api-key')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('/swagger-api', app, document);
    await app.listen(PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch(err => console.log(err));
//# sourceMappingURL=main.js.map