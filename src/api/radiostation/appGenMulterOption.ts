import { BadRequestException } from "@nestjs/common";
import { diskStorage } from 'multer';
import * as makeDir from 'make-dir';
import { appConfig } from "src/config";

export const appGenMulterOptions = {
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
      if (file?.originalname?.match?.(/\.(xlsx|xlsb|xls|xlsm)$/)) {
        // Allow storage of file
        cb(null, true);
      } else {
        // Reject file
        cb(
          new BadRequestException(
            'Unsupported file type, only support excel for now',
          ),
          false,
        );
      }
    },
    storage: diskStorage({
      destination: async (req, file, cb) => {
        const filePath = await makeDir(`${appConfig.MULTER_IMPORT_DEST}`);
        cb(null, filePath);
      },
      filename: (req, file, cb) => {
        let orgName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, `${Date.now()}_${orgName}`);
      },
    }),
  }