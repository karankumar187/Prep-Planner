require('dotenv').config();
const mongoose = require('mongoose');

// Source (Local) DB URI
const LOCAL_URI = process.env.LOCAL_MONGODB_URI || 'mongodb://localhost:27017/placement-tracker';

// Target (Atlas) DB URI passed via CLI argument or env variable
const ATLAS_URI = process.argv[2] || process.env.MONGODB_URI;

if (!ATLAS_URI || ATLAS_URI.includes('localhost')) {
  console.error('\x3b[31mError: Please provide your MongoDB Atlas connection string as an argument or in .env!\x3b[0m');
  console.log('\nUsage:');
  console.log('  node scripts/migrateToAtlas.js "mongodb+srv://<username>:<password>@cluster.xxx.mongodb.net/placement-tracker"\n');
  process.exit(1);
}

const migrate = async () => {
  try {
    console.log('🔄 Step 1: Connecting to Local MongoDB...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Connected to Local MongoDB:', LOCAL_URI);

    console.log('\n🔄 Step 2: Connecting to MongoDB Atlas...');
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Connected to MongoDB Atlas!');

    // Collections to migrate
    const collections = ['users', 'schedules', 'scheduletasks', 'enrollments', 'taskprogresses'];

    console.log('\n📦 Step 3: Migrating collections...\n');

    for (const collName of collections) {
      const localColl = localConn.collection(collName);
      const docs = await localColl.find({}).toArray();

      if (docs.length === 0) {
        console.log(`  🔹 Collection '${collName}': 0 documents (skipped)`);
        continue;
      }

      const atlasColl = atlasConn.collection(collName);
      
      // Clear target collection first to avoid duplicate key errors on re-run
      await atlasColl.deleteMany({});
      
      // Insert all local docs into Atlas
      await atlasColl.insertMany(docs);
      console.log(`  ✅ Collection '${collName}': Successfully migrated ${docs.length} document(s)`);
    }

    console.log('\n🎉 Migration Complete! All your local data is now in MongoDB Atlas.');
    console.log('\nNext Step: Update MONGODB_URI in server/.env with your Atlas string.');

    await localConn.close();
    await atlasConn.close();
    process.exit(0);
  } catch (err) {
    console.error('\x3b[31m❌ Migration Error:\x3b[0m', err.message);
    process.exit(1);
  }
};

migrate();
