import { MongoClient } from 'mongodb';
import * as path from 'path';
import * as xlsx from 'xlsx';
// Step 1
console.log('process.env.MONGODB_URI', process.env.MONGODB_URI);
const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);
const DATABASE_NAME = process.env.DATABASE_NAME;
async function run() {
  await client.connect();
  const db = client.db(DATABASE_NAME);
  const radioStationCollection = db.collection('RadioStation');
  const radioStationsFromExcel = extractDataFromExcel();

  console.log("Total Stations",radioStationsFromExcel?.length);
  
  var count=0
  for await (const radioStationFromExcel of radioStationsFromExcel) {
      console.log("radioStationFromExcel['Station ID']",radioStationFromExcel['Station ID']);
      console.log("radioStationFromExcel['Station Name']",radioStationFromExcel['Station Name']);
      
    await radioStationCollection.findOneAndUpdate(
      { name: radioStationFromExcel['Station Name'] },
      {
        $set: {
          shortListed: true,
        },
      },
    )
    .then(res=>{
        count+=1
    })
    .catch(err=>{
        console.log("radioStationFromExcel['Station ID']",radioStationFromExcel['Station ID']);
        console.log("Error Updating",err); 
    })
    .finally(()=>{
        console.log("Completd",count);
        
    })
  }
}

function extractDataFromExcel() {
  const pathToExcel = path.join(__dirname, 'RadioStation_newsetup_list.xlsx');
  const dataFromExcel = xlsx.readFile(pathToExcel);
  const sheetToJson: any[] = xlsx.utils.sheet_to_json(
    dataFromExcel.Sheets['Sheet1'],
  );
  return sheetToJson;
}

run()
  .catch(err => {
    console.log('error', err);
    process.exit(0);
  })
  .finally(async () => {
    // Ensures that the client will close when you finish/error
    await client.close();
  });
