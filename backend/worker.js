import dotenv from "dotenv";
import db from "./src/config/db.js";
import { startWorker } from "./src/workers/redisQueueWorker.js";
import { getRedis } from "./src/config/redis.js";

dotenv.config();

const setupProcessHandlers = () => {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('💣 Uncaught Exception:', err);
    process.exit(1);
  });

  process.on('SIGINT', async () => {
    console.log('🧾 SIGINT received, shutting down worker');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('🧾 SIGTERM received, shutting down worker');
    process.exit(0);
  });
};

const startApp = async () => {
  console.log('🤖 Starting AI Worker process...');

  setupProcessHandlers();

  try {
    await db();
    console.log('✅ DB connection established');
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    // For worker we still try to continue with Redis; if DB is unavailable, jobs will fail later
  }

  try {
    const redis = getRedis();
    redis.on('ready', () => console.log('✅ Redis ready'));
    redis.on('reconnecting', (delay) => console.log(`🔄 Redis reconnecting (delay ${delay}ms)`));
    redis.on('end', () => console.warn('⚠️ Redis connection ended'));    
  } catch (err) {
    console.error('❌ Redis initialization failed:', err);
  }

  try {
    await startWorker();
    console.log('✅ Redis queue worker started');
  } catch (err) {
    console.error('❌ Worker failed to start:', err);
    setTimeout(startApp, 3000); // Retry start on failure
  }
};

startApp();