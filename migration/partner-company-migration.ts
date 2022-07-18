import { MongoClient } from 'mongodb';
import * as path from 'path';
import * as xlsx from 'xlsx';
import { SystemRoles } from '../src/constants/Enums';
// Step 1
console.log('process.env.MONGODB_URI', process.env.MONGODB_URI);
const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);
const DATABASE_NAME = process.env.DATABASE_NAME;
async function run() {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const usercollection = db.collection('User');
    const companycollection = db.collection('Company');
    const partnercollection = db.collection('Partner');
    const companiesFromExcel = extractDataFromExcel();
    const cursor =  companycollection.find();
    for await (const company of cursor) {
      const matchedCompanyFromExcel = companiesFromExcel.find(
        com => com['CompanyId In DB'] == company._id.toString(),
      );
      console.log('matchedCompanyFromExcel', matchedCompanyFromExcel);
      console.log('company from db', company);
      if (matchedCompanyFromExcel) {
        if (matchedCompanyFromExcel['Need To Make Partner'] == 'YES') {
          //Insert New Partner
          const insertedPartner = await partnercollection
            .insertOne({
              ...company,
              partnerType: 'Distributor',
            })
            .catch(err => null);
          if (insertedPartner) {
            //Update Owner Role
            await usercollection.findOneAndUpdate(
              { _id: company.owner },
              {
                $unset: { adminCompany: '', company: '', companies: '' },
                $set: {
                  userRole: SystemRoles.PARTNER_ADMIN,
                  partner: insertedPartner.insertedId,
                  adminPartner: insertedPartner.insertedId,
                },
              },
            );
            //Delete Company
            await companycollection.deleteOne({ _id: company._id });

            //Update All Users Of Old Company as a Partner User
            await usercollection.updateMany(
              {
                companies: { $in: [company._id] },
                adminCompany: { $exists: false },
              },
              {
                $unset: { adminCompany: '', company: '', companies: '' },
                $set: {
                  userRole: SystemRoles.PARTNER_USER,
                  partner: insertedPartner.insertedId,
                },
              },
            );
          }
        }
      }
    }

    //Once all Migration To Partner Finished Lets check and do Relation with partner
    for await (const companyFromExcel of companiesFromExcel) {
      if (companyFromExcel['Need To Relate To Partner'] == 'YES') {
        const tobePartner = companiesFromExcel.find(
          com => com['Company Name'] == companyFromExcel['Related to Partner'],
        );
        console.log('tobePartner', tobePartner);
        console.log('companyFromExcel', companyFromExcel);

        if (tobePartner) {
          await companycollection.updateOne(
            { _id: companyFromExcel['CompanyId In DB'] },
            {
              $set: {
                partner: tobePartner['CompanyId In DB'],
              },
            },
          );
        }
      }
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

run()
  .catch(err => {
    console.log('error', err);
    process.exit(0);
  })
  .finally(async () => {
    // Ensures that the client will close when you finish/error
    await client.close();
  });
