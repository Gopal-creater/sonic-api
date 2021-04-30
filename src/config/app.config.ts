import * as appRootPath from 'app-root-path';

export const appConfig = {
  PORT: parseInt(process.env.PORT),
  MULTER_DEST: `${appRootPath.toString()}/storage/uploads`,

  CONTAINER_DEST: `${appRootPath.toString()}/storage/containers`,

  ENCODER_EXE_PATH: `${appRootPath.toString()}/bin/encode.sh`,
  DECODER_EXE_PATH: `${appRootPath.toString()}/bin/decode.sh`,

  TIME_TO_LISTEN_FOR_STREAM_IN_SECONDS: 30,
};
