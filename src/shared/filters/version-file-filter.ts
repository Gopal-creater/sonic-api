export const versionFileFilter = (req:any, file:any, callback:any) =>{
            if(file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)){
                return callback(new Error('Image Files not allowed'), false)
            }
            callback(null, true)
}