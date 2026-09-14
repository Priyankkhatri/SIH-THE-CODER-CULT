import { Request, Response, NextFunction } from 'express';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  lastAccessed: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  keysCount: number;
  evictions: number;
  hitRatio: string;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private maxEntries: number;
  private defaultTTL: number; // in milliseconds
  private hits = 0;
  private misses = 0;
  private evictions = 0;

  constructor(maxEntries = 1000, defaultTTLSeconds = 300) {
    this.maxEntries = maxEntries;
    this.defaultTTL = defaultTTLSeconds * 1000;

    // Periodic background sweep every 60 seconds to clean up expired keys
    setInterval(() => this.cleanupExpired(), 60000).unref();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    entry.lastAccessed = Date.now();
    this.hits++;
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds?: number): void {
    if (this.cache.size >= this.maxEntries) {
      this.evictLRU();
    }

    const ttl = (ttlSeconds !== undefined ? ttlSeconds : this.defaultTTL / 1000) * 1000;
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      lastAccessed: Date.now(),
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  deleteByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    const hitRatio = total > 0 ? `${((this.hits / total) * 100).toFixed(1)}%` : '0.0%';
    return {
      hits: this.hits,
      misses: this.misses,
      keysCount: this.cache.size,
      evictions: this.evictions,
      hitRatio,
    };
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.evictions++;
    }
  }
}

export const cacheManager = new CacheManager(2000, 300);

/**
 * Express Middleware to auto-cache JSON responses
 */
export function cacheMiddleware(ttlSeconds = 300, keyGenerator?: (req: Request) => string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only cache safe GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = keyGenerator
      ? keyGenerator(req)
      : `http:${req.originalUrl || req.url}`;

    const cached = cacheManager.get<any>(key);
    if (cached !== null) {
      res.setHeader('X-Cache', 'HIT');
      res.json(cached);
      return;
    }

    res.setHeader('X-Cache', 'MISS');

    // Intercept res.json to cache the output before sending
    const originalJson = res.json.bind(res);
    res.json = (body: any): Response => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheManager.set(key, body, ttlSeconds);
      }
      return originalJson(body);
    };

    next();
  };
}
