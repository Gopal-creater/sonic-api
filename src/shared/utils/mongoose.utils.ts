import {Types,ObjectId} from "mongoose";

export const isObjectId = (id:any) => Types.ObjectId.isValid(id);
export const toObjectId = (id:any) => Types.ObjectId(id);