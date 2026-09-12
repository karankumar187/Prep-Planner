const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function restore() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not found');
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const enrollmentsColl = db.collection('enrollments');
  const taskProgressColl = db.collection('taskprogresses');
  const scheduleTasksColl = db.collection('scheduletasks');

  const karanUserId = new mongoose.Types.ObjectId('6a85a266c43ecc297650311e');
  const karanEnrollmentId = new mongoose.Types.ObjectId('6aa45b7c82d03cff80899ac8');

  const shashiUserId = new mongoose.Types.ObjectId('6a85c83d59a71c8f49b4d142');
  const shashiEnrollmentId = new mongoose.Types.ObjectId('6aa462b50ab38d6cc0df5789');

  const scheduleId = new mongoose.Types.ObjectId('6aa45b7c82d03cff80899ac6');

  // 1. Update Karan enrollment startDate to 2026-09-12T00:00:00.000Z
  const updatedKaran = await enrollmentsColl.updateOne(
    { _id: karanEnrollmentId },
    {
      $set: {
        startDate: new Date('2026-09-12T00:00:00.000Z'),
        targetDate: new Date('2026-09-22T00:00:00.000Z'),
        updatedAt: new Date()
      }
    }
  );
  console.log('Updated Karan enrollment startDate to Sep 12:', updatedKaran.modifiedCount);

  // 2. Fetch Day 1 tasks in schedule 6aa45b7c82d03cff80899ac6
  const day1Tasks = await scheduleTasksColl.find({
    scheduleId: scheduleId,
    dayNumber: 1
  }).toArray();

  console.log('Found Day 1 tasks:', day1Tasks.length);
  const taskByTitle = {};
  day1Tasks.forEach(t => {
    taskByTitle[t.title] = t._id;
  });

  const lc3Id = taskByTitle['LeetCode 3: Longest Substring Without Repeating Characters'];
  const lc15Id = taskByTitle['LeetCode 15: 3Sum'];
  const lc11Id = taskByTitle['LeetCode 11: Container With Most Water'];
  const lc175Id = taskByTitle['LeetCode 175: Combine Two Tables'];
  const lc181Id = taskByTitle['LeetCode 181: Employees Earning More Than Their Managers'];
  const msOfficeId = taskByTitle['MS Office & Excel Formulas Mastery for Accenture Assessment'];

  console.log('Day 1 task IDs:', {
    lc3Id,
    lc15Id,
    lc11Id,
    lc175Id,
    lc181Id,
    msOfficeId
  });

  // 3. Upsert Karan Kumar Day 1 completed tasks
  const karanCompletedTasks = [
    {
      scheduleTaskId: lc3Id,
      actualMinutes: 30,
      studyCompleted: false,
      studyMinutes: null
    },
    {
      scheduleTaskId: lc15Id,
      actualMinutes: 25,
      studyCompleted: false,
      studyMinutes: null
    },
    {
      scheduleTaskId: lc11Id,
      actualMinutes: 25,
      studyCompleted: false,
      studyMinutes: null
    },
    {
      scheduleTaskId: lc175Id,
      actualMinutes: 20,
      studyCompleted: false,
      studyMinutes: null
    },
    {
      scheduleTaskId: msOfficeId,
      actualMinutes: 25,
      studyCompleted: true,
      studyMinutes: 25
    }
  ];

  for (const item of karanCompletedTasks) {
    if (!item.scheduleTaskId) {
      console.warn('Skipping item without valid scheduleTaskId:', item);
      continue;
    }
    const res = await taskProgressColl.updateOne(
      {
        userId: karanUserId,
        enrollmentId: karanEnrollmentId,
        scheduleTaskId: item.scheduleTaskId
      },
      {
        $set: {
          userId: karanUserId,
          enrollmentId: karanEnrollmentId,
          scheduleTaskId: item.scheduleTaskId,
          completed: true,
          completedAt: new Date('2026-09-12T17:30:00.000Z'),
          actualMinutes: item.actualMinutes,
          studyCompleted: item.studyCompleted,
          studyMinutes: item.studyMinutes,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date('2026-09-12T17:00:00.000Z'),
          mcqScore: { score: 0, total: 0, percentage: 0 },
          mcqAnswers: []
        }
      },
      { upsert: true }
    );
    console.log(`Upserted Karan task ${item.scheduleTaskId}: matched=${res.matchedCount}, upserted=${res.upsertedCount}`);
  }

  // 4. Re-link Shashi Prabha completed records
  const shashiUpdates = [
    {
      oldScheduleTaskId: new mongoose.Types.ObjectId('6aa462774a2658f234f69597'),
      newScheduleTaskId: lc3Id
    },
    {
      oldScheduleTaskId: new mongoose.Types.ObjectId('6aa462774a2658f234f69598'),
      newScheduleTaskId: lc15Id
    },
    {
      oldScheduleTaskId: new mongoose.Types.ObjectId('6aa462774a2658f234f69599'),
      newScheduleTaskId: lc11Id
    },
    {
      oldScheduleTaskId: new mongoose.Types.ObjectId('6aa462774a2658f234f6959b'),
      newScheduleTaskId: lc175Id
    },
    {
      oldScheduleTaskId: new mongoose.Types.ObjectId('6aa462774a2658f234f6959c'),
      newScheduleTaskId: lc181Id
    }
  ];

  for (const su of shashiUpdates) {
    const res = await taskProgressColl.updateMany(
      {
        enrollmentId: shashiEnrollmentId,
        scheduleTaskId: su.oldScheduleTaskId
      },
      {
        $set: {
          scheduleTaskId: su.newScheduleTaskId,
          updatedAt: new Date()
        }
      }
    );
    console.log(`Re-linked Shashi task ${su.oldScheduleTaskId} -> ${su.newScheduleTaskId}: modified=${res.modifiedCount}`);
  }

  console.log('Restoration completed successfully.');
  await mongoose.disconnect();
}

restore().catch(err => {
  console.error('Restoration failed:', err);
  process.exit(1);
});
