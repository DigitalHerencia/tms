/**
 * Rate Limiting Utility for FleetFusion
 *
 * Provides in-memory rate limiting functionality using a sliding window approach.
 * Also supports distributed rate limiting with Upstash Redis.
 *
 * @format
 */

import { redis } from "@/lib/cache/redis"
import { Ratelimit } from "@upstash/ratelimit"

interface RateLimitConfig {
    interval: string // e.g., '1h', '1m', '1s'
    limit: number // Maximum requests allowed in the interval
}

interface RateLimitResult {
    success: boolean
    limit: number
    remaining: number
    reset: number // Unix timestamp when the window resets
}

// In-memory storage for rate limit data
// Note: In production, use Redis or a database for distributed systems
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Parse interval string to milliseconds
 */
function parseInterval(interval: string): number {
    const match = interval.match(/^(\d+)([smhd])$/)

    if (!match || match.length < 3) {
        throw new Error(
            `Invalid interval format: ${interval}. Use format like '1h', '30m', '60s'`
        )
    }

    const [, value, unit] = match
    if (!value || !unit) {
        throw new Error(
            `Invalid interval format: ${interval}. Use format like '1h', '30m', '60s'`
        )
    }
    const num = parseInt(value, 10)

    switch (unit) {
        case "s":
            return num * 1000
        case "m":
            return num * 60 * 1000
        case "h":
            return num * 60 * 60 * 1000
        case "d":
            return num * 24 * 60 * 60 * 1000
        default:
            throw new Error(`Unsupported time unit: ${unit}`)
    }
}

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries(): void {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime <= now) {
            rateLimitStore.delete(key)
        }
    }
}

/**
 * Create a rate limiter function
 */
export function ratelimit(config: RateLimitConfig) {
    const intervalMs = parseInterval(config.interval)

    return async function (identifier: string): Promise<RateLimitResult> {
        // Clean up expired entries periodically
        if (Math.random() < 0.1) {
            // 10% chance to clean up on each call
            cleanupExpiredEntries()
        }

        const now = Date.now()
        const key = `${identifier}:${config.interval}`
        const existing = rateLimitStore.get(key)

        // If no existing entry or the window has reset, create a new entry
        if (!existing || existing.resetTime <= now) {
            const resetTime = now + intervalMs
            rateLimitStore.set(key, { count: 1, resetTime })

            return {
                success: true,
                limit: config.limit,
                remaining: config.limit - 1,
                reset: resetTime,
            }
        }

        // Check if limit is exceeded
        if (existing.count >= config.limit) {
            return {
                success: false,
                limit: config.limit,
                remaining: 0,
                reset: existing.resetTime,
            }
        }

        // Increment the count
        existing.count += 1
        rateLimitStore.set(key, existing)

        return {
            success: true,
            limit: config.limit,
            remaining: config.limit - existing.count,
            reset: existing.resetTime,
        }
    }
}

/**
 * Get the current status of a rate limit without incrementing
 */
export function getRateLimitStatus(
    identifier: string,
    interval: string
): RateLimitResult | null {
    const key = `${identifier}:${interval}`
    const existing = rateLimitStore.get(key)

    if (!existing) {
        return null
    }

    const now = Date.now()
    if (existing.resetTime <= now) {
        rateLimitStore.delete(key)
        return null
    }

    // Determine limit based on common intervals (this is a simplified approach)
    const limit = interval === "1h" ? 5 : interval === "1m" ? 60 : 100

    return {
        success: existing.count < limit,
        limit,
        remaining: Math.max(0, limit - existing.count),
        reset: existing.resetTime,
    }
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or administrative purposes
 */
export function resetRateLimit(identifier: string, interval?: string): void {
    if (interval) {
        const key = `${identifier}:${interval}`
        rateLimitStore.delete(key)
    } else {
        // Reset all rate limits for this identifier
        for (const key of rateLimitStore.keys()) {
            if (key.startsWith(`${identifier}:`)) {
                rateLimitStore.delete(key)
            }
        }
    }
}

/**
 * Get stats about the rate limit store
 * Useful for monitoring and debugging
 */
export function getRateLimitStats(): {
    totalEntries: number
    activeEntries: number
    expiredEntries: number
} {
    const now = Date.now()
    let activeEntries = 0
    let expiredEntries = 0

    for (const entry of rateLimitStore.values()) {
        if (entry.resetTime > now) {
            activeEntries++
        } else {
            expiredEntries++
        }
    }

    return {
        totalEntries: rateLimitStore.size,
        activeEntries,
        expiredEntries,
    }
}

/**
 * Middleware helper for Next.js API routes
 * Returns a function that can be used in API routes to apply rate limiting
 */
export function withRateLimit(config: RateLimitConfig) {
    const limiter = ratelimit(config)

    return async function (
        identifier: string,
        handler: () => Promise<Response> | Response
    ): Promise<Response> {
        const result = await limiter(identifier)

        if (!result.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Rate limit exceeded",
                    code: "RATE_LIMIT_EXCEEDED",
                    resetTime: result.reset,
                    remaining: result.remaining,
                }),
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "X-RateLimit-Limit": result.limit.toString(),
                        "X-RateLimit-Remaining": result.remaining.toString(),
                        "X-RateLimit-Reset": result.reset.toString(),
                    },
                }
            )
        }

        const response = await handler()

        // Add rate limit headers to successful responses
        if (response instanceof Response) {
            response.headers.set("X-RateLimit-Limit", result.limit.toString())
            response.headers.set(
                "X-RateLimit-Remaining",
                result.remaining.toString()
            )
            response.headers.set("X-RateLimit-Reset", result.reset.toString())
        }

        return response
    }
}

/**
 * Distributed rate limiter backed by Upstash Redis
 */
const globalLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "1 m"),
})

export async function enforceRateLimit(
    identifier: string
): Promise<RateLimitResult> {
    const { success, limit, remaining, reset } = await globalLimiter.limit(
        identifier
    )
    return { success, limit, remaining, reset: reset * 1000 }
}
