import { CreateSonicKeyFromJobDto } from '../../sonickey/dtos/create-sonickey.dto';
export declare class UpdateJobFileDto {
    fileDetail: {
        [key: string]: any;
    };
}
export declare class AddKeyAndUpdateJobFileDto {
    fileDetail: {
        [key: string]: any;
    };
    sonicKeyDetail: CreateSonicKeyFromJobDto;
}
