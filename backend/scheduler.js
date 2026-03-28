import cron from 'node-cron';
import { MemoryResurfacingService } from './src/services/memoryResurfacingService.js';
import db from './src/config/db.js';
import { getRedis } from './src/config/redis.js';

// Initialize database and Redis connections
await db();
const redis = getRedis();

// Schedule daily memory resurfacing at 9 AM
cron.schedule('0 9 * * *', async () => {
    console.log('🕘 Running scheduled memory resurfacing job...');
    try {
        await MemoryResurfacingService.performDailyResurfacing();
    } catch (error) {
        console.error('❌ Scheduled resurfacing failed:', error);
    }
}, {
    timezone: "UTC" // You can change this to your preferred timezone
});

// Also run immediately on startup for testing
console.log('🚀 Starting memory resurfacing scheduler...');
console.log('📅 Daily resurfacing scheduled for 9:00 AM UTC');

export default cron;