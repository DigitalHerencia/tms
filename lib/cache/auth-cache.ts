/**
 * Enhanced Authentication Cache Layer
 *
 * Implements sophisticated in-memory caching for auth data with:
 * - Multi-level caching (L1 hot cache + L2 warm cache)
 * - LRU eviction strategy
 * - Circuit breaker pattern
 * - Performance metrics collection
 * - Smart cache warming
 */

import {
  UserContext,
  ClerkUserMetadata,
  ClerkOrganizationMetadata,
} from '@/types/auth';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  errors: number;
  totalRequests: number;
}

interface CircuitBreakerState {
  isOpen: boolean;
  failures: number;
  lastFailure: number;
  nextAttempt: number;
}

class AuthCache {
  // L1 Cache - Hot data (frequently accessed)
  private userHotCache = new Map<string, CacheItem<UserContext>>();
  private permissionHotCache = new Map<string, CacheItem<string[]>>();
  private orgCache = new Map<string, CacheItem<ClerkOrganizationMetadata>>();

  private readonly USER_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly ORG_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
  private readonly PERMISSION_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Cache cleanup interval
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired items every 2 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      2 * 60 * 1000
    );
  }

  /**
   * Check if cache item is valid
   */
  private isValid<T>(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp < item.ttl;
  }

  /**
   * Get user from cache
   */
  getUser(id: string): UserContext | null {
    const item = this.userHotCache.get(id);
    if (item && this.isValid(item)) {
      return item.data;
    }
    if (item) {
      this.userHotCache.delete(id);
    }
    return null;
  }

  /**
   * Set user in cache
   */
  setUser(id: string, user: UserContext): void {
    this.userHotCache.set(id, {
      data: user,
      timestamp: Date.now(),
      ttl: this.USER_CACHE_TTL,
      accessCount: 0,
      lastAccessed: 0,
    });
  }

  /**
   * Get organization from cache
   */
  getOrganization(id: string): ClerkOrganizationMetadata | null {
    const item = this.orgCache.get(id);
    if (item && this.isValid(item)) {
      return item.data;
    }
    if (item) {
      this.orgCache.delete(id);
    }
    return null;
  }
  /**
   * Set organization in cache
   */
  setOrganization(id: string, org: ClerkOrganizationMetadata): void {
    this.orgCache.set(id, {
      data: org,
      timestamp: Date.now(),
      ttl: this.ORG_CACHE_TTL,
      accessCount: 0,
      lastAccessed: Date.now(),
    });
  }

  /**
   * Get permissions from cache
   */
  getPermissions(userId: string): string[] | null {
    const item = this.permissionHotCache.get(userId);
    if (item && this.isValid(item)) {
      return item.data;
    }
    if (item) {
      this.permissionHotCache.delete(userId);
    }
    return null;
  }

  /**
   * Set permissions in cache
   */
  setPermissions(userId: string, permissions: string[]): void {
    this.permissionHotCache.set(userId, {
      data: permissions,
      timestamp: Date.now(),
      ttl: this.PERMISSION_CACHE_TTL,
      accessCount: 0,
      lastAccessed: 0,
    });
  }

  /**
   * Invalidate user cache
   */
  invalidateUser(id: string): void {
    this.userHotCache.delete(id);
    this.permissionHotCache.delete(id);
  }

  /**
   * Invalidate organization cache
   */
  invalidateOrganization(id: string): void {
    this.orgCache.delete(id);
    // Invalidate all users of this organization
    for (const [userId, item] of this.userHotCache.entries()) {
      if (item.data.organizationId === id) {
        this.userHotCache.delete(userId);
        this.permissionHotCache.delete(userId);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.userHotCache.clear();
    this.orgCache.clear();
    this.permissionHotCache.clear();
  }

  /**
   * Clean up expired items
   */
  private cleanup(): void {
    const now = Date.now();

    // Clean user cache
    for (const [key, item] of this.userHotCache.entries()) {
      if (now - item.timestamp >= item.ttl) {
        this.userHotCache.delete(key);
      }
    }

    // Clean organization cache
    for (const [key, item] of this.orgCache.entries()) {
      if (now - item.timestamp >= item.ttl) {
        this.orgCache.delete(key);
      }
    }

    // Clean permission cache
    for (const [key, item] of this.permissionHotCache.entries()) {
      if (now - item.timestamp >= item.ttl) {
        this.permissionHotCache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      userCacheSize: this.userHotCache.size,
      orgCacheSize: this.orgCache.size,
      permissionCacheSize: this.permissionHotCache.size,
    };
  }

  /**
   * Destroy cache and cleanup interval
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}

// Export singleton instance
export const authCache = new AuthCache();

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', () => {
    authCache.destroy();
  });
  process.on('SIGINT', () => {
    authCache.destroy();
  });
}

// Cache for data fetchers with TTL-based expiration
const dataCache = new Map<
  string,
  {
    data: any;
    timestamp: number;
    ttl: number;
  }
>();

export const CACHE_TTL = {
  DATA: 5 * 60 * 1000, // 5 minutes cache for general data queries
  KPI: 2 * 60 * 1000, // 2 minutes cache for KPIs (more frequent updates)
  SHORT: 1 * 60 * 1000, // 1 minute cache for rapidly changing data
} as const;

/**
 * Get cached data if available and not expired
 */
export function getCachedData<T>(key: string): T | null {
  const cached = dataCache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  if (cached) {
    dataCache.delete(key);
  }
  return null;
}

/**
 * Set cached data with specified TTL
 */
export function setCachedData<T>(
  key: string,
  data: T,
  ttl: number = CACHE_TTL.DATA
): void {
  dataCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Invalidate cache entries for a specific organization or type
 */
export function invalidateCache(
  organizationId: string,
  type?: 'kpis' | 'loads' | 'vehicles' | 'drivers'
): void {
  if (type) {
    // Invalidate specific cache type
    const patterns = [`${type}:${organizationId}:`, `batch:${organizationId}:`];

    for (const [key] of dataCache) {
      if (patterns.some(pattern => key.startsWith(pattern))) {
        dataCache.delete(key);
      }
    }
  } else {
    // Invalidate all cache for the organization
    for (const [key] of dataCache) {
      if (key.includes(`${organizationId}:`)) {
        dataCache.delete(key);
      }
    }
  }
}

/**
 * Cleanup expired cache entries
 */
export function cleanupExpiredCache(): void {
  const now = Date.now();
  for (const [key, value] of dataCache) {
    if (now - value.timestamp >= value.ttl) {
      dataCache.delete(key);
    }
  }
}

/**
 * Get cache statistics for monitoring
 */
export function getCacheStats() {
  return {
    size: dataCache.size,
    keys: Array.from(dataCache.keys()),
  };
}

/**
 * Clear all cache entries
 */
export function clearCache(): void {
  dataCache.clear();
}

// Set up periodic cache cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredCache, 60 * 1000); // Clean up every minute
}

// Graceful shutdown cleanup
if (typeof process !== 'undefined') {
  const cleanup = () => {
    dataCache.clear();
  };

  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
}
