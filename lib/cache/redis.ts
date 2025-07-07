import { Redis } from '@upstash/redis';

/**
 * Shared Redis instance using Upstash.
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 * environment variables.
 */
export const redis = Redis.fromEnv();
