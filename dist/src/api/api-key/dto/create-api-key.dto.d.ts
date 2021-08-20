import { ApiKey } from '../schemas/api-key.schema';
declare const CreateApiKeyDto_base: import("@nestjs/common").Type<Pick<ApiKey, "metaData" | "_id" | "__v" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "execPopulate" | "get" | "getChanges" | "id" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "model" | "modelName" | "overwrite" | "populate" | "populated" | "remove" | "replaceOne" | "save" | "schema" | "set" | "toJSON" | "toObject" | "unmarkModified" | "update" | "updateOne" | "validate" | "validateSync">>;
export declare class CreateApiKeyDto extends CreateApiKeyDto_base {
}
declare const AdminCreateApiKeyDto_base: import("@nestjs/common").Type<Pick<ApiKey, never>>;
export declare class AdminCreateApiKeyDto extends AdminCreateApiKeyDto_base {
}
export {};
