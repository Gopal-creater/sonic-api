const arr= [1,2,3,4]
async function func(){
    const arr1 = arr[10]["name"]
    return arr1
}

async function func2(){
  await func().catch(err=>{
    // console.log("err above",err)
    return
  })
  return 'Ok'
}


func2()
.then(data=>console.log(data))
.catch(err=>console.log("error caller",err))