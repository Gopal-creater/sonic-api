import * as appRootPath from 'app-root-path';

export const appConfig = {
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
    fingerPrintUrl: 'http://localhost:3000/api/fp/fingerprint',
  },
  DEBUG: false,
  AUTH_CONFIG: {
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    clientId: process.env.COGNITO_CLIENT_ID,
    region: process.env.COGNITO_REGION,
    authority: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
  },
};

export default () => appConfig;
