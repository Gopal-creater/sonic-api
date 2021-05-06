export function parse(data:string,defaultValue?:any){
    if(!data){
        return defaultValue
    }
    return JSON.parse(data)
}

export function isNumber(n:any) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 