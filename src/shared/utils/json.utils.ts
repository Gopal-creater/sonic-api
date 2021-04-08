export function parse(data:string,defaultValue?:any){
    if(!data){
        return defaultValue
    }
    return JSON.parse(data)
}