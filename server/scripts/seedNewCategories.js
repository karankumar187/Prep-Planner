const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const cloudTrackModules = require('./accenture_content/cloud_track');
const networkSecurityModules = require('./accenture_content/network_security');
const technicalModules = require('./accenture_content/technical');

async function seedNewCategories() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not defined in server/.env');
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas');

  const db = mongoose.connection.db;
  const scheduleTasksColl = db.collection('scheduletasks');
  const schedulesColl = db.collection('schedules');
  const taskProgressColl = db.collection('taskprogresses');

  const scheduleId = new mongoose.Types.ObjectId('6aa45b7c82d03cff80899ac6');

  // Verify schedule exists
  const schedule = await schedulesColl.findOne({ _id: scheduleId });
  if (!schedule) {
    throw new Error(`Schedule ${scheduleId} not found`);
  }
  console.log(`Found Schedule: "${schedule.title}"`);

  // Update schedule description to reflect Network Security & Cloud
  await schedulesColl.updateOne(
    { _id: scheduleId },
    {
      $set: {
        description: 'Comprehensive 10-day preparation roadmap for Accenture Advanced Application Engineering High-Value (AEH) on-campus drive. Includes daily 4 LeetCode DSA problems, 2 LeetCode SQL queries, core technical topics (MS Office, OOPs, DBMS, CN, OS, Pseudocode), Cloud Computing, Network Security, and dual Java & C++ programming tracks.',
        updatedAt: new Date()
      }
    }
  );

  const newModules = [...cloudTrackModules, ...networkSecurityModules];
  console.log(`Processing ${newModules.length} new Cloud & Network Security modules...`);

  let insertedCount = 0;
  let updatedCount = 0;

  for (const mod of newModules) {
    const existing = await scheduleTasksColl.findOne({
      scheduleId,
      dayNumber: mod.dayNumber,
      category: mod.category
    });

    if (existing) {
      await scheduleTasksColl.updateOne(
        { _id: existing._id },
        {
          $set: {
            title: mod.title,
            category: mod.category,
            taskType: mod.taskType || 'reading',
            priority: mod.priority || 'High',
            estimatedMinutes: mod.estimatedMinutes || 70,
            readingContent: mod.readingContent,
            mcqs: mod.mcqs,
            updatedAt: new Date()
          }
        }
      );
      console.log(`Updated existing Day ${mod.dayNumber} [${mod.category}]: ${mod.title}`);
      updatedCount++;
    } else {
      const newDoc = {
        _id: new mongoose.Types.ObjectId(),
        scheduleId,
        title: mod.title,
        category: mod.category,
        taskType: mod.taskType || 'reading',
        link: '',
        readingContent: mod.readingContent,
        dayNumber: mod.dayNumber,
        priority: mod.priority || 'High',
        estimatedMinutes: mod.estimatedMinutes || 70,
        mcqs: mod.mcqs,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await scheduleTasksColl.insertOne(newDoc);
      console.log(`Inserted new Day ${mod.dayNumber} [${mod.category}]: ${mod.title} (_id: ${newDoc._id})`);
      insertedCount++;
    }
  }

  // Update Day 10 technical module to pure MS Office Advanced
  const day10Tech = technicalModules.find(m => m.dayNumber === 10);
  if (day10Tech) {
    const existingDay10 = await scheduleTasksColl.findOne({
      scheduleId,
      dayNumber: 10,
      category: 'Technical'
    });

    if (existingDay10) {
      await scheduleTasksColl.updateOne(
        { _id: existingDay10._id },
        {
          $set: {
            title: day10Tech.title,
            readingContent: day10Tech.readingContent,
            mcqs: day10Tech.mcqs,
            updatedAt: new Date()
          }
        }
      );
      console.log(`Updated Day 10 Technical task to: ${day10Tech.title}`);
    }
  }

  // VERIFICATION: Check Karan Kumar's Day 1 progress records are preserved
  const karanUserId = new mongoose.Types.ObjectId('6a85a266c43ecc297650311e');
  const karanProgress = await taskProgressColl.find({
    userId: karanUserId,
    completed: true
  }).toArray();
  console.log(`Verification: Karan Kumar completed task count = ${karanProgress.length} (expected 5)`);

  const totalTasks = await scheduleTasksColl.countDocuments({ scheduleId });
  console.log(`Total tasks in schedule ${scheduleId} is now: ${totalTasks}`);

  console.log('Seeding completed successfully!');
  await mongoose.disconnect();
}

seedNewCategories().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
