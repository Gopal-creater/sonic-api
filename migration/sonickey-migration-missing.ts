import { MongoClient } from 'mongodb';
import { SystemRoles } from '../src/constants/Enums';
import { customAlphabet } from 'nanoid';
// Step 3
console.log('process.env.MONGODB_URI', process.env.MONGODB_URI);
const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);
const DATABASE_NAME = process.env.DATABASE_NAME;
async function run() {
  await client.connect();
  const db = client.db(DATABASE_NAME);
  const oldDb = client.db('SonicDB');
  const usercollection = db.collection('User');
  const sonicKeycollection = db.collection('SonicKey');
  const sonicKeycollectionOld = oldDb.collection('SonicKey');
  const trackcollection = db.collection('Track');
  const cursorToOldSonicKeys = sonicKeycollectionOld.find({
    createdAt: { $gt: new Date('2021/12/25') },
  });
  var count = 0;

  for await (const sonicKeyOld of cursorToOldSonicKeys) {
    console.log("sonicKeyOld",sonicKeyOld._id);
    const sonicKeyPresentInMigDb = await sonicKeycollection.findOne({
      _id: sonicKeyOld._id,
    });
    if (sonicKeyPresentInMigDb) {
      console.log("Already Present, Keeping...",sonicKeyPresentInMigDb?._id);
      continue;
    }
    await sonicKeycollection.insertOne(sonicKeyOld);
    const ownerDetail = await usercollection.findOne({
      _id: sonicKeyOld.owner,
    });
    console.log('ownerDetail Id', ownerDetail?._id);
    if (!ownerDetail) {
      continue;
    }
    const {
      resourceOwnerObj,
    } = identifyDestinationFolderAndResourceOwnerFromUser(ownerDetail);
    console.log('resourceOwnerObj', resourceOwnerObj);
    //Save Track Details From SonicKey & also put trackId to sonicKey

    var trackId = generateTrackId();
    const newTrack = {
      ...resourceOwnerObj,
      apiKey: sonicKeyOld?.apiKey,
      channel: sonicKeyOld?.channel || 'PORTAL',
      license: sonicKeyOld?.license,
      artist: sonicKeyOld.contentOwner,
      title: sonicKeyOld.contentName,
      fileType: sonicKeyOld.contentType,
      mimeType: sonicKeyOld.contentFileType,
      trackMetaData: sonicKeyOld,
      createdBy: sonicKeyOld.createdBy,

      duration: sonicKeyOld.contentDuration,
      fileSize: sonicKeyOld.contentSize,
      localFilePath: sonicKeyOld.contentFilePath,
      encoding: sonicKeyOld.contentEncoding,
      samplingFrequency: sonicKeyOld.contentSamplingFrequency,
      originalFileName: sonicKeyOld.originalFileName,
    };
    newTrack['_id'] = trackId;
    if (sonicKeyOld.s3OriginalFileMeta) {
      newTrack['s3OriginalFileMeta'] =
      sonicKeyOld.s3OriginalFileMeta;
    }
    const isAlreadyTrackPresent = await trackcollection.findOne({
      'trackMetaData._id': sonicKeyOld?._id,
    });
    if (isAlreadyTrackPresent) {
      console.log('Already present, Skipping...');
      console.log('For SonicKey', sonicKeyOld?._id);
      continue;
    }
    const insertedTrack = await trackcollection.insertOne(newTrack);
    await sonicKeycollection.updateOne(
      { _id: sonicKeyOld._id },
      {
        $set: {
          ...resourceOwnerObj,
          track: insertedTrack?.insertedId,
        },
      },
    );
    count += 1;
    console.log('Iterate # ', count);
    console.log('For SonicKey', sonicKeyOld?._id);
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
  switch (user?.userRole) {
    case SystemRoles.COMPANY_USER:
    case SystemRoles.COMPANY_ADMIN:
      if (user.company) {
        destinationFolder = `companies/${user.company}`;
        resourceOwnerObj[keyNameForCompany] = user.company;
      }
      break;

    case SystemRoles.PARTNER_USER:
    case SystemRoles.PARTNER_ADMIN:
      if (user.partner) {
        destinationFolder = `partners/${user.partner}`;
        resourceOwnerObj[keyNameForPartner] = user.partner;
      }
      break;

    default:
      destinationFolder = `${user?._id}`;
      resourceOwnerObj[keyNameForOwner] = user?._id;
      break;
  }
  return {
    destinationFolder: destinationFolder,
    resourceOwnerObj: resourceOwnerObj,
  };
}
