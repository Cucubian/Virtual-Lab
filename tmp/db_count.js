const db = require('../config/db');

async function checkCounts() {
  try {
    const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [historyCount] = await db.execute('SELECT COUNT(*) as count FROM quiz_history');
    console.log('--- DB SUMMARY ---');
    console.log('Total Users:', userCount[0].count);
    console.log('Total History:', historyCount[0].count);
    console.log('------------------');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCounts();
