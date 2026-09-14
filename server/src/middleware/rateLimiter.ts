import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  timestamps: number[];
}

class SlidingWindowRateLimiter {
  private clients = new Map<string, RateLimitRecord>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs = 60_000, maxRequests = 300) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Periodic sweep every 2 minutes
    setInterval(() => this.cleanup(), 120_000).unref();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.clients.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < this.windowMs);
      if (record.timestamps.length === 0) {
        this.clients.delete(key);
      }
    }
  }

  middleware(customMax?: number) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const limit = customMax ?? this.maxRequests;
      // Extract client IP (handle proxies if any)
      const clientIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        req.socket.remoteAddress ||
        'unknown_client';

      const now = Date.now();
      let record = this.clients.get(clientIp);

      if (!record) {
        record = { timestamps: [] };
        this.clients.set(clientIp, record);
      }

      // Filter timestamps outside current sliding window
      record.timestamps = record.timestamps.filter((ts) => now - ts < this.windowMs);

      const remaining = Math.max(0, limit - record.timestamps.length);
      const resetTime = Math.ceil(
        (record.timestamps.length > 0 ? record.timestamps[0] + this.windowMs : now + this.windowMs) / 1000
      );

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', resetTime);

      if (record.timestamps.length >= limit) {
        res.status(429).json({
          success: false,
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Maximum ${limit} requests per minute.`,
          retryAfterSeconds: Math.max(1, Math.ceil((resetTime * 1000 - now) / 1000)),
        });
        return;
      }

      record.timestamps.push(now);
      next();
    };
  }
}

export const generalRateLimiter = new SlidingWindowRateLimiter(60_000, 300);
export const aiRateLimiter = new SlidingWindowRateLimiter(60_000, 60);
