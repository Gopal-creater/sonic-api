const arr= [1,2,3,4]
async function func(){
    var a=[]
    for await (const iterator of arr) {
        a.push(iterator)
    }
    return a
}

func().then(data=>console.log(data))
