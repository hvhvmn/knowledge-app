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

// Database connect
db()

// Redis connect
getRedis()

server.listen(3000, ()=> {
console.log('✅ Running in port 3000');
console.log('🔴 Redis connected for queue management');
});