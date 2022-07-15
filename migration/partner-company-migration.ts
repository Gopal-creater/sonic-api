import { MongoClient } from 'mongodb';
// Map global promise - get rid of warning
// mongoose.Promise = global.Promise;
// Connect to db
console.log("process.env.MONGODB_URI",process.env.MONGODB_URI)
const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);
const DATABASE_NAME = process.env.DATABASE_NAME;
const COLLECTION_NAME = 'User';
async function run() {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const coll = db.collection(COLLECTION_NAME);
    const cursor = coll.find().limit(2);
    await cursor.forEach(doc => console.log(doc));
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(err => {
  console.log('error', err);
  process.exit(0);
});
