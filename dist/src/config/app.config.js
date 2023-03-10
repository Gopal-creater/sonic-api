"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const appRootPath = require("app-root-path");
const config_1 = require("@nestjs/config");
const path = require("path");
const registeredConfig = config_1.registerAs('', () => ({
    PORT: parseInt(process.env.PORT),
    MULTER_DEST: `${appRootPath.toString()}/storage/uploads`,
    MULTER_EXPORT_DEST: `${appRootPath.toString()}/storage/exports`,
    MULTER_IMPORT_DEST: `${appRootPath.toString()}/storage/uploads/imports`,
    ROOT_RSYNC_UPLOADS: `${appRootPath.toString()}/storage/rsync_uploads`,
    CONTAINER_DEST: `${appRootPath.toString()}/storage/containers`,
    ENCODER_EXE_PATH: path.join(`${process.env.BINARY_PATH}`, `${process.env.BINARY_WATERMARK}.sh`),
    DECODER_EXE_PATH: path.join(`${process.env.BINARY_PATH}`, `${process.env.BINARY_DETECT}.sh`),
    TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS: 30,
    ENABLE_STREAMING_LISTENER: true,
    ENABLE_FINGERPRINTING: process.env.ENABLE_FINGERPRINTING == 'true',
    FINGERPRINT_SERVER: {
        baseUrl: `${process.env.FINGERPRINTING_SERVER_BASE_URL}`,
        fingerPrintUrl: `${process.env.FINGERPRINTING_SERVER_BASE_URL}/api/fp/fingerprint`,
    },
    DEBUG: false,
    AUTH_CONFIG: {
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        clientId: process.env.COGNITO_CLIENT_ID,
        region: process.env.COGNITO_REGION,
        authority: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
    },
    mail: {
        default: 'smtp',
        smtp: {
            transport: {
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: process.env.MAIL_SECURE == 'true',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD,
                },
            },
            defaults: {
                from: `"No Reply" <${process.env.MAIL_FROM}>`,
            },
        },
    },
}));
exports.default = registeredConfig;
exports.appConfig = registeredConfig();
//# sourceMappingURL=app.config.js.map