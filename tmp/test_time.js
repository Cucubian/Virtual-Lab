const db = require('../config/db');

async function testTime() {
    try {
        const now = new Date();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        console.log('JS Now:', now.toLocaleString());
        console.log('JS ExpiresAt:', expiresAt.toLocaleString());

        // Update a test user or just select NOW() from DB
        const [rows] = await db.execute('SELECT NOW() as now_db');
        console.log('DB Now:', rows[0].now_db);
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testTime();
