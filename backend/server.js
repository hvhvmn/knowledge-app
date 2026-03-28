import dotenv from "dotenv";
dotenv.config();

console.log(
'📋 Environment loaded. REDIS_URI:',
process.env.REDIS_URI
? process.env.REDIS_URI.replace(/:[^@]*@/, ':****@')
: 'NOT SET'
);

import server from "./src/app.js";
import db from "./src/config/db.js";
import { getRedis } from "./src/config/redis.js";
import './scheduler.js'; // Start the memory resurfacing scheduler

// Database connect
db()

// Redis connect
getRedis()

// Global error handlers to prevent app crashes
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process, just log the error
});

server.listen(3000, ()=> {
console.log('✅ Running in port 3000');
console.log('🔴 Redis connected for queue management');
console.log('🧠 Memory resurfacing scheduler started');
});