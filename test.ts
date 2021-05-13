const arr= [1,2,3,4]
async function func(){
    var a=[]
    for await (const iterator of arr) {
        a.push(iterator)
    }
    return a
}

func().then(data=>console.log(data))

// http://27.7.118.167:5000/sonic
// http://sonicradio.arba-dev.uk:8003/sonic.ogg
// http://streaming.live365.com/a73754
const children = require('child_process');
var ffm = children.spawn(
      "ffmpeg",
      "-i http://27.7.118.167:5000/sonic -y -f 16_le -ar 44100 -ac 2 -f wav -t 00:00:10 storage/streaming/OUTPUT.WAV".split(
        " "
      ),
      {shell:true}
    );
    

    ffm.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      
      ffm.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      ffm.on('error', (err) => {
        console.error('Failed to start subprocess.',err);
      });
      
      ffm.on('close', (code) => {
        if(code!==0){
          console.log(`Error with code ${code}`);
        }
        console.log(`child process exited with code ${code}`);
      });