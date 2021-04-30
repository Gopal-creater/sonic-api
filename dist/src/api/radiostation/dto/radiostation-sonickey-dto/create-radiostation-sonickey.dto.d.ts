import { RadioStationSonicKey } from '../../schemas/radiostation-sonickey.schema';
declare const CreateRadiostationSonicKeyDto_base: import("@nestjs/common").Type<Pick<RadioStationSonicKey, "owner" | "metaData" | "_id" | "__v" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "execPopulate" | "get" | "getChanges" | "id" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "model" | "modelName" | "overwrite" | "populate" | "populated" | "remove" | "replaceOne" | "save" | "schema" | "set" | "toJSON" | "toObject" | "unmarkModified" | "update" | "updateOne" | "validate" | "validateSync">>;
export declare class CreateRadiostationSonicKeyDto extends CreateRadiostationSonicKeyDto_base {
    sonicKey: string;
    radioStation: string;
}
export {};
