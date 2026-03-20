const db = require('./config/db');

async function checkConnection() {
    try {
        const [rows] = await db.execute('SELECT experiment_id, COUNT(*) as count FROM quizzes GROUP BY experiment_id');
        console.table(rows);
        process.exit();
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
}

checkConnection();
