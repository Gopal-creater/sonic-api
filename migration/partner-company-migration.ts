import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';
import * as appRootPath from 'app-root-path';
// Map global promise - get rid of warning
// mongoose.Promise = global.Promise;
// Connect to db
console.log('process.env.MONGODB_URI', process.env.MONGODB_URI);
const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);
const DATABASE_NAME = process.env.DATABASE_NAME;
async function run() {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const usercollection = db.collection('User');
    const companycollection = db.collection('Company');
    const partnercollection = db.collection('Partner');
    const companiesFromExcel = extractDataFromExcel()
    console.log("companiesFromExcel",companiesFromExcel);
    
    const cursor = companycollection.find();
    await cursor.forEach(company => {
      const matchedCompanyFromExcel=companiesFromExcel.find(com=>com["CompanyId In DB"]==company._id.toString())
      console.log("matchedCompanyFromExcel",matchedCompanyFromExcel)
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

function extractDataFromExcel() {
  const pathToExcel = path.join(
    __dirname,
    'Copy of Partner-Company Spreadsheet V1.xlsx',
  );
  const dataFromExcel = xlsx.readFile(pathToExcel);
  const sheetToJson: any[] = xlsx.utils.sheet_to_json(
    dataFromExcel.Sheets['Users'],
  );
  return sheetToJson;
}

run().catch(err => {
  console.log('error', err);
  process.exit(0);
});
