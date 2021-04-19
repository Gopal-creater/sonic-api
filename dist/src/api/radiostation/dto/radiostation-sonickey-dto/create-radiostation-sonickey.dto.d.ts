import { RadioStationSonicKey } from '../../../../schemas/radiostation-sonickey.schema';
declare const CreateRadiostationSonicKeyDto_base: import("@nestjs/common").Type<Pick<RadioStationSonicKey, "remove" | "set" | "get" | "validate" | "_id" | "metaData" | "populate" | "__v" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "execPopulate" | "getChanges" | "id" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "model" | "modelName" | "overwrite" | "populated" | "replaceOne" | "save" | "schema" | "toJSON" | "toObject" | "unmarkModified" | "update" | "updateOne" | "validateSync" | "owner">>;
export declare class CreateRadiostationSonicKeyDto extends CreateRadiostationSonicKeyDto_base {
    sonicKey: string;
    radioStation: string;
}
export {};
