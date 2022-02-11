import {Types} from "mongoose";

export const isObjectId = (id:any) =>{
    // return Types.ObjectId.isValid(id);
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")
    return checkForHexRegExp.test(id)
} 
export const toObjectId = (id:any) => {
    if (isObjectId(id)) {
        return new Types.ObjectId(id);
      } else {
        return id;
      }
    }