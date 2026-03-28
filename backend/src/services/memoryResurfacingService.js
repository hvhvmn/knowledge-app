import mongoose from "mongoose";
import itemsModel from "../models/items.model.js";
import resurfacedItemsModel from "../models/resurfacedItems.model.js";
import { getRedis } from "../config/redis.js";

// Memory Resurfacing Service
export class MemoryResurfacingService {

    // Find items older than specified days
    static async findOldItems(userId, daysOld = 7, limit = 5) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        return await itemsModel.find({
            userId,
            createdAt: { $lt: cutoffDate },
            processing: false, // Only fully processed items
            processingError: null
        }).sort({ createdAt: -1 });
    }

    // Get random items from old items
    static async getRandomResurfacedItems(userId, count = 5) {
        const oldItems = await this.findOldItems(userId, 7, 50); // Get more items to randomize from

        if (oldItems.length === 0) return [];

        // Shuffle and pick random items
        const shuffled = oldItems.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, oldItems.length));
    }

    // Store resurfaced items for a user
    static async storeResurfacedItems(userId, items) {
        const resurfacedEntries = items.map(item => ({
            userId,
            itemId: item._id,
            daysOld: Math.floor((Date.now() - item.createdAt) / (1000 * 60 * 60 * 24)),
            reason: "random"
        }));

        // Use upsert to avoid duplicates
        for (const entry of resurfacedEntries) {
            await resurfacedItemsModel.findOneAndUpdate(
                { userId: entry.userId, itemId: entry.itemId },
                entry,
                { upsert: true, new: true }
            );
        }

        console.log(`🧠 Stored ${resurfacedEntries.length} resurfaced items for user ${userId}`);
    }

    // Get current resurfaced items for a user
    static async getResurfacedItems(userId, limit = 5) {
        const resurfaced = await resurfacedItemsModel
            .find({ userId })
            .populate('itemId')
            .sort({ resurfacedAt: -1 })
            .limit(limit);

        return resurfaced
            .filter(entry => entry.itemId) // Filter out items that may have been deleted
            .map(entry => ({
                ...entry.itemId.toObject(),
                resurfacedAt: entry.resurfacedAt,
                daysOld: entry.daysOld,
                reason: entry.reason
            }));
    }

    // Clean up old resurfaced items (keep only last 30 days)
    static async cleanupOldResurfacedItems() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);

        const result = await resurfacedItemsModel.deleteMany({
            resurfacedAt: { $lt: cutoffDate }
        });

        console.log(`🧹 Cleaned up ${result.deletedCount} old resurfaced items`);
    }

    // Daily resurfacing job
    static async performDailyResurfacing() {
        console.log("🧠 Starting daily memory resurfacing...");

        try {
            // Get all users (you might want to optimize this for large user bases)
            const User = mongoose.model('user');
            const users = await User.find({});

            for (const user of users) {
                try {
                    const randomItems = await this.getRandomResurfacedItems(user._id, 5);
                    if (randomItems.length > 0) {
                        await this.storeResurfacedItems(user._id, randomItems);
                    }
                } catch (error) {
                    console.error(`❌ Error resurfacing for user ${user._id}:`, error.message);
                }
            }

            // Cleanup old entries
            await this.cleanupOldResurfacedItems();

            console.log("✅ Daily memory resurfacing completed");
        } catch (error) {
            console.error("❌ Error in daily resurfacing:", error.message);
        }
    }
}