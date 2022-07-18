import { MongoClient } from 'mongodb';
import { SystemRoles } from '../src/constants/Enums';
import { customAlphabet, nanoid } from 'nanoid';
// Step 3
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
  const sonicKeycollection = db.collection('SonicKey');
  const trackcollection = db.collection('Track');
  const cursor = sonicKeycollection.find();
  var count = 0;
  for await (const sonicKey of cursor) {
    const ownerDetail = await usercollection.findOne({ _id: sonicKey.owner });
    const {
      resourceOwnerObj,
    } = identifyDestinationFolderAndResourceOwnerFromUser(ownerDetail);
    console.log('resourceOwnerObj', resourceOwnerObj);
    //Save Track Details From SonicKey & also put trackId to sonicKey

    var trackId = generateTrackId();
    const newTrack = {
      ...resourceOwnerObj,
      apiKey: sonicKey?.apiKey,
      channel: sonicKey?.channel || 'PORTAL',
      license: sonicKey?.license,
      artist: sonicKey.contentOwner,
      title: sonicKey.contentName,
      fileType: sonicKey.contentType,
      mimeType: sonicKey.contentFileType,
      trackMetaData: sonicKey,
      createdBy: sonicKey.createdBy,

      duration: sonicKey.contentDuration,
      fileSize: sonicKey.contentSize,
      localFilePath: sonicKey.contentFilePath,
      encoding: sonicKey.contentEncoding,
      samplingFrequency: sonicKey.contentSamplingFrequency,
      originalFileName: sonicKey.originalFileName,
    };
    newTrack['_id'] = trackId;
    if (sonicKey.s3OriginalFileMeta) {
      newTrack['s3OriginalFileMeta'] = sonicKey.s3OriginalFileMeta;
    }
    const isAlreadyTrackPresent = await trackcollection.findOne({"trackMetaData._id":sonicKey?._id})
    if(isAlreadyTrackPresent){
      console.log("Already present, Skipping...");
      console.log('For SonicKey', sonicKey?._id);
      continue;
    }
    const insertedTrack =  await trackcollection.insertOne(newTrack);
    await sonicKeycollection.updateOne(
      { _id: sonicKey._id },
      {
        $set: {
          ...resourceOwnerObj,
          track:insertedTrack?.insertedId
        },
      },
    );
    count += 1;
    console.log('Iterate # ', count);
    console.log('For SonicKey', sonicKey?._id);
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

function generateTrackId() {
  return `T${customAlphabet('1234567890', 10)(8)}`;
}

function identifyDestinationFolderAndResourceOwnerFromUser(
  user: any,
  keyNameForOwner: string = 'owner',
  keyNameForPartner: string = 'partner',
  keyNameForCompany: string = 'company',
) {
  var destinationFolder: string;
  var resourceOwnerObj: {
    owner?: string;
    partner?: string;
    company?: string;
  } = {};
  switch (user.userRole) {
    case SystemRoles.COMPANY_USER:
    case SystemRoles.COMPANY_ADMIN:
      if (user.company) {
        destinationFolder = `companies/${user.company?._id}`;
        resourceOwnerObj[keyNameForCompany] = user.company?._id;
      }
      break;

    case SystemRoles.PARTNER_USER:
    case SystemRoles.PARTNER_ADMIN:
      if (user.partner) {
        destinationFolder = `partners/${user.partner?._id}`;
        resourceOwnerObj[keyNameForPartner] = user.partner?._id;
      }
      break;

    default:
      destinationFolder = `${user?.sub}`;
      resourceOwnerObj[keyNameForOwner] = user?.sub;
      break;
  }
  return {
    destinationFolder: destinationFolder,
    resourceOwnerObj: resourceOwnerObj,
  };
}
