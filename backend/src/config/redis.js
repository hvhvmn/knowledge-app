import Redis from 'ioredis';

// Redis connection configuration - shared connection
const getRedisConnection = () => {
  let redisUri = process.env.REDIS_URI || 'redis://localhost:6379';
  
  if (redisUri.includes('redis-cli')) {
    redisUri = redisUri.replace(/redis-cli\s+-u\s+/, '');
  }

  console.log('🔴 Connecting to Redis:', redisUri.replace(/:[^@]*@/, ':****@'));

  return new Redis(redisUri, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,  // Disable ready check for blocking commands
    enableOfflineQueue: true,
    lazyConnect: false,
    connectTimeout: 15000,
    // Do NOT set socketTimeout - let ioredis handle blocking operations naturally
    keepAlive: 30000,
    retryStrategy: (times) => {
      if (times > 8) {
        console.error(`❌ Redis reconnect limit reached (${times} attempts)`);
        return null;
      }
      const delay = Math.min(times * 500, 5000);
      if (times <= 3) console.log(`🔄 Retrying Redis connection... (attempt ${times})`);
      return delay;
    }
  });
};

let redisConnection = null;
let lastErrorTime = 0;
const ERROR_LOG_INTERVAL = 5000; // Only log errors every 5 seconds

export const getRedis = () => {
  if (!redisConnection) {
    redisConnection = getRedisConnection();
    
    redisConnection.on('connect', () => {
      console.log('✅ Connected to Redis');
    });

    redisConnection.on('error', (err) => {
      const now = Date.now();
      // Rate limit error logging to avoid spam
      if (now - lastErrorTime > ERROR_LOG_INTERVAL) {
        console.error('❌ Redis connection error:', err.message);
        lastErrorTime = now;
      }
    });
  }
  return redisConnection;
};

// Job queue operations
export const addJobToQueue = async (itemId, title, url, notes, userProvidedTags) => {
  const redis = getRedis();
  const jobId = `item-${itemId}`;
  const job = {
    jobId,
    itemId,
    title,
    url,
    notes,
    userProvidedTags,
    createdAt: new Date().toISOString(),
  };

  // Add to queue
  await redis.lpush('ai-processing:queue', JSON.stringify(job));
  
  // Store job metadata
  await redis.hset(`job:${jobId}`, 'status', 'pending');
  await redis.expire(`job:${jobId}`, 86400); // 24 hour TTL

  console.log(`✅ Job ${jobId} added to queue`);
  return jobId;
};

// Get job from queue (blocking - waits indefinitely for next job)
export const getJobFromQueue = async () => {
  const redis = getRedis();
  try {
    const result = await redis.brpop('ai-processing:queue', 0);
    if (result) {
      console.log('✅ Job retrieved from queue');
      return JSON.parse(result[1]);
    }
    return null;
  } catch (error) {
    // Don't log every timeout - just re-throw for worker to handle
    if (error.message && error.message.includes('timed out')) {
      throw error;
    }
    console.error('❌ Error retrieving job from queue:', error.message);
    throw error;
  }
};

// Update job status
export const updateJobStatus = async (jobId, status, progress = 0) => {
  const redis = getRedis();
  await redis.hset(`job:${jobId}`, 'status', status, 'progress', progress);
};

// Get job status
export const getJobStatus = async (jobId) => {
  const redis = getRedis();
  const status = await redis.hgetall(`job:${jobId}`);
  return status || {};
};

export default { getRedis, addJobToQueue, getJobFromQueue, updateJobStatus, getJobStatus };
