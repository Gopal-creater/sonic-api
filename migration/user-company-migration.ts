import { MongoClient } from 'mongodb';
import { SystemRoles } from '../src/constants/Enums';
// Step 2
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
    const cursor =  usercollection.find();
    for await (const user of cursor) {
      if(!user.adminCompany && (user.companies && user?.companies?.length>0)){
        // break;
        const isCompanyMigratedToPartner  = await partnercollection.findOne({_id:user.companies[0]})
        if(isCompanyMigratedToPartner){
          await usercollection.updateOne({_id:user._id},
            {
              $unset: { adminCompany: '', company: '', companies: '' },
              $set: {
                userRole: SystemRoles.PARTNER_USER,
                partner: isCompanyMigratedToPartner._id,
              },
            }
          )
        }else{
          await usercollection.updateOne({_id:user._id},
            {
              $unset: { companies: '' },
              $set: {
                userRole: SystemRoles.COMPANY_USER,
                company: user.companies[0],
              },
            }
          )
        }
      }else if(!user.adminCompany && !user.partnerCompany && !user.companies && !user.company && !user.partner && !(user.userRole==SystemRoles.ADMIN) && !user.isSonicAdmin){
        await usercollection.updateOne({_id:user._id},
          {
            $set: {
              userRole: SystemRoles.PORTAL_USER
            },
          }
        )
      }
    }
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
