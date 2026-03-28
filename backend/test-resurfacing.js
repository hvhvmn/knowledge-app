import dotenv from 'dotenv';
dotenv.config();

import db from './src/config/db.js';
import { MemoryResurfacingService } from './src/services/memoryResurfacingService.js';

// Test the memory resurfacing functionality
async function testResurfacing() {
    try {
        console.log('🧪 Testing Memory Resurfacing...');

        // Connect to database
        await db();
        console.log('✅ Database connected');

        // Test finding old items for a user (you'll need to replace with actual user ID)
        const testUserId = '67bf97662f6c23cf7a4c1225'; // Replace with actual user ID

        console.log('🔍 Finding old items...');
        const oldItems = await MemoryResurfacingService.findOldItems(testUserId, 0); // Items older than 0 days (all items)
        console.log(`📊 Found ${oldItems.length} old items`);

        if (oldItems.length > 0) {
            console.log('📝 Sample old item:', {
                title: oldItems[0].title,
                createdAt: oldItems[0].createdAt,
                daysOld: Math.floor((Date.now() - oldItems[0].createdAt) / (1000 * 60 * 60 * 24))
            });

            // Test storing resurfaced items
            console.log('💾 Storing resurfaced items...');
            await MemoryResurfacingService.storeResurfacedItems(testUserId, oldItems.slice(0, 3));

            // Test retrieving resurfaced items
            console.log('📤 Retrieving resurfaced items...');
            const resurfaced = await MemoryResurfacingService.getResurfacedItems(testUserId, 5);
            console.log(`✅ Retrieved ${resurfaced.length} resurfaced items`);
        }

        console.log('🎉 Memory resurfacing test completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testResurfacing();