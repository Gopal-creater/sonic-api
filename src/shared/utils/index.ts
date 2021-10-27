export * as JSONUtils from './json.utils'
import axios from 'axios';

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
    var filename = url.substring(url.lastIndexOf('/')+1);
    return filename
    }

    export function isValidHttpUrl(string:string) {
      let url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    }

  export function getInstanceMetaData() {
    return axios
      .get('http://169.254.169.254/latest/meta-data/')
      .then(res =>{
        return res.data
      });
  }

  export function getInstanceDetailsForMetaData(metadata:string) {
    return axios
      .get(`http://169.254.169.254/latest/meta-data/${metadata}`)
      .then(res =>{
        return res.data
      });
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