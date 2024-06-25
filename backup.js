// backup.js

const fs = require('fs-extra');
const path = require('path');

// Define the source and destination paths
const dbPath = path.join(__dirname, 'database', 'stationery_stock.db');
const backupDir = path.join(__dirname, 'backups');

// Ensure the backup directory exists
fs.ensureDirSync(backupDir);

// Get the current date
const date = new Date();
const dateString = date.toISOString().split('T')[0];
const backupPath = path.join(backupDir, `stationery_stock_${dateString}.db`);

// Function to perform the backup
async function backupDatabase() {
    try {
        // Check if today's backup already exists
        if (!fs.existsSync(backupPath)) {
            await fs.copy(dbPath, backupPath);
            console.log('Database backup completed successfully.');
        } else {
            console.log('Today\'s backup already exists.');
        }
    } catch (err) {
        console.error('Error during database backup:', err);
    }
}

backupDatabase();
