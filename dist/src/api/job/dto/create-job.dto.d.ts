import { Job } from '../schemas/job.schema';
import { CreateJobFileDto } from './create-job-file.dto';
declare const CreateJobDto_base: import("@nestjs/common").Type<Pick<Job, "name" | "set" | "get" | "remove" | "validate" | "_id" | "populate" | "__v" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "execPopulate" | "getChanges" | "id" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "model" | "modelName" | "overwrite" | "populated" | "replaceOne" | "save" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "update" | "updateOne" | "validateSync" | "owner" | "encodingStrength" | "license">>;
export declare class CreateJobDto extends CreateJobDto_base {
    jobFiles?: CreateJobFileDto[];
}
export {};
