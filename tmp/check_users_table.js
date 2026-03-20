const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function checkUsersTable() {
    try {
        const [rows] = await db.execute('DESCRIBE users');
        fs.writeFileSync(path.join(__dirname, 'users_schema.json'), JSON.stringify(rows, null, 2));
        process.exit();
    } catch (err) {
        console.error('Failed to describe table:', err);
        process.exit(1);
    }
}

checkUsersTable();
