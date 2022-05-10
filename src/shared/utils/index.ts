export * as JSONUtils from './json.utils'
import axios from 'axios';
import { UserDB } from '../../api/user/schemas/user.db.schema';
import { SystemRoles } from 'src/constants/Enums';

/* Check if string is valid UUID */
export function isValidUUID(str:string) {
    // Regular expression to check if string is a valid UUID
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  
    return regexExp.test(str);
  }

  /**
 * @description ### Returns Go / Lua like responses(data, err) 
 * when used with await
 *
 * - Example response [ data, undefined ]
 * - Example response [ undefined, Error ]
 *
 *
 * When used with Promise.all([req1, req2, req3])
 * - Example response [ [data1, data2, data3], undefined ]
 * - Example response [ undefined, Error ]
 *
 *
 * When used with Promise.race([req1, req2, req3])
 * - Example response [ data, undefined ]
 * - Example response [ undefined, Error ]
 *
 * @param {Promise} promise
 * @returns {Promise} [ data, undefined ]
 * @returns {Promise} [ undefined, Error ]
 */
export function promiseHandler(promise:any):Promise<[any,any]>{
    return promise
      .then((data: any) => Promise.resolve([data, undefined]))
      .catch((error: any) => Promise.resolve([undefined, error]));
  }

  export function extractFileName(url:string){
    url = url.includes('?')?url.split('?')[0]:url
    if(isValidHttpUrl(url)){
      const newUrl = new URL(url)
      const {pathname}=newUrl
      const filename = pathname.substring(pathname.lastIndexOf('/')+1);
      return filename
    }else{
      const filename = url.substring(url.lastIndexOf('/')+1);
      return filename
    }
   
    }

    export function isValidHttpUrl(string:string) {
      try {
        let url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
      } catch (error) {
        return false
      }
      
    }

  export function enumToArrayOfObject<E>(e:any){
    const arrayObjects:{key:any,value:any}[] = []  
      
    for (const [propertyKey, propertyValue] of Object.entries(e)) {  
          if (!Number.isNaN(Number(propertyKey))) {  
            continue;  
        }  
        arrayObjects.push({key: propertyKey,value: propertyValue });  
    }
    return arrayObjects  
  }

  /**
   * This function will identify the user types such as whether a user is a regular user or company user or partner user and return the upload destinationFolder and resourceOwnerObj
   * @param user 
   * @param keyNameForOwner 
   * @param keyNameForPartner 
   * @param keyNameForCompany 
   * @returns 
   */
export function identifyDestinationFolderAndResourceOwnerFromUser(user:UserDB,keyNameForOwner:string="owner",keyNameForPartner:string="partner",keyNameForCompany:string="company"){
  var destinationFolder:string;
  var resourceOwnerObj:{owner?:string,partner?:string,company?:string}
  switch (user.userRole) {
    case SystemRoles.COMPANY:
    case SystemRoles.COMPANY_ADMIN:
      if(user.company){
        destinationFolder =`companies/${user.company?._id}`
        resourceOwnerObj[keyNameForCompany]=user.company?._id
      }
      break;

    case SystemRoles.PARTNER:
    case SystemRoles.PARTNER_ADMIN:
      if(user.partner){
        destinationFolder =`partners/${user.partner?._id}`
        resourceOwnerObj[keyNameForPartner]=user.partner?._id
      }
      break;
  
    default:
      destinationFolder =`${user?.sub}`
      resourceOwnerObj[keyNameForOwner]=user?.sub
      break;
  }
  return {
    destinationFolder:destinationFolder,
    resourceOwnerObj:resourceOwnerObj
  }
}