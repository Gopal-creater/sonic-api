"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const appRootPath = require("app-root-path");
exports.appConfig = {
    PORT: parseInt(process.env.PORT),
    MULTER_DEST: `${appRootPath.toString()}/storage/uploads`,
    MULTER_EXPORT_DEST: `${appRootPath.toString()}/storage/exports`,
    MULTER_IMPORT_DEST: `${appRootPath.toString()}/storage/uploads/imports`,
    CONTAINER_DEST: `${appRootPath.toString()}/storage/containers`,
    ENCODER_EXE_PATH: `${appRootPath.toString()}/bin/encode.sh`,
    DECODER_EXE_PATH: `${appRootPath.toString()}/bin/decode.sh`,
    TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS: 30,
    ENABLE_STREAMING_LISTENER: true,
    FINGERPRINT_SERVER: {
        baseUrl: '',
    },
    DEBUG: false,
    AUTH_CONFIG: {
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        clientId: process.env.COGNITO_CLIENT_ID,
        region: process.env.COGNITO_REGION,
        authority: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
    },
};
exports.default = () => exports.appConfig;
//# sourceMappingURL=app.config.js.map