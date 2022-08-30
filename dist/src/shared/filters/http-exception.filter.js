"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const file_handler_service_1 = require("./../services/file-handler.service");
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(error, host) {
        console.log("error", error);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = error instanceof common_1.HttpException
            ? error.getStatus()
            : (error['status'] || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        const message = error instanceof common_1.HttpException
            ? error.message
            : { error: error.name, message: error.message };
        const fileHandler = new file_handler_service_1.FileHandlerService();
        if (request.file) {
            fileHandler.deleteFileAtPath(request.file.path);
        }
        if (request.files) {
            for (let index = 0; index < request.files.length; index++) {
                const file = request.files[index];
                fileHandler.deleteFileAtPath(file);
            }
        }
        const errorObj = error instanceof common_1.HttpException
            ? Object.assign({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
            }, error['response'])
            : Object.assign({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
            }, message);
        response.status(status).json(errorObj);
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=http-exception.filter.js.map