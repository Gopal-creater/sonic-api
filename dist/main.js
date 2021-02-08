"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const appRootPath = require("app-root-path");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
global['fetch'] = require('node-fetch');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: true
    });
    app.enableCors();
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useStaticAssets(appRootPath.path.toString() + '/storage', { prefix: '/storage' });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Sonic API Development')
        .setDescription('The Sonic API description')
        .setVersion('1.0')
        .addTag('Sonic End Points')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(8000);
}
bootstrap();
//# sourceMappingURL=main.js.map