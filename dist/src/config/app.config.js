"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const appRootPath = require("app-root-path");
const config_1 = require("@nestjs/config");
const registeredConfig = config_1.registerAs('', () => ({
    PORT: parseInt(process.env.PORT),
    MULTER_DEST: `${appRootPath.toString()}/storage/uploads`,
    MULTER_EXPORT_DEST: `${appRootPath.toString()}/storage/exports`,
    MULTER_IMPORT_DEST: `${appRootPath.toString()}/storage/uploads/imports`,
    ROOT_RSYNC_UPLOADS: `${appRootPath.toString()}/storage/rsync_uploads/1234567890`,
    CONTAINER_DEST: `${appRootPath.toString()}/storage/containers`,
    ENCODER_EXE_PATH: `${appRootPath.toString()}/bin/encode.sh`,
    DECODER_EXE_PATH: `${appRootPath.toString()}/bin/decode.sh`,
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
}));
exports.default = registeredConfig;
exports.appConfig = registeredConfig();
//# sourceMappingURL=app.config.js.map