import { Request, Response, NextFunction } from 'express';

export interface TelemetryMetrics {
  totalRequests: number;
  activeRequests: number;
  statusCodes: Record<string, number>;
  avgResponseTimeMs: number;
  slowestRequest: { path: string; durationMs: number; timestamp: string } | null;
}

const metrics: TelemetryMetrics = {
  totalRequests: 0,
  activeRequests: 0,
  statusCodes: {},
  avgResponseTimeMs: 0,
  slowestRequest: null,
};

let totalDurationMs = 0;

export function getTelemetryMetrics(): TelemetryMetrics {
  return {
    ...metrics,
    statusCodes: { ...metrics.statusCodes },
    avgResponseTimeMs:
      metrics.totalRequests > 0
        ? Math.round((totalDurationMs / metrics.totalRequests) * 100) / 100
        : 0,
  };
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startHr = process.hrtime.bigint();
  metrics.totalRequests++;
  metrics.activeRequests++;

  // Intercept end before headers are finalized to safely set X-Response-Time
  const originalEnd = res.end.bind(res);
  (res as any).end = function (chunk?: any, encoding?: any, callback?: any) {
    if (!res.headersSent) {
      const endHr = process.hrtime.bigint();
      const durationNs = endHr - startHr;
      const durationMs = Number(durationNs) / 1_000_000;
      const roundedMs = Math.round(durationMs * 100) / 100;
      try {
        res.setHeader('X-Response-Time', `${roundedMs}ms`);
      } catch (_) {}
    }
    return originalEnd(chunk, encoding, callback);
  };

  res.on('finish', () => {
    metrics.activeRequests--;
    const endHr = process.hrtime.bigint();
    const durationNs = endHr - startHr;
    const durationMs = Number(durationNs) / 1_000_000;
    const roundedMs = Math.round(durationMs * 100) / 100;

    totalDurationMs += roundedMs;

    const statusGroup = `${Math.floor(res.statusCode / 100)}xx`;
    metrics.statusCodes[statusGroup] = (metrics.statusCodes[statusGroup] || 0) + 1;
    metrics.statusCodes[res.statusCode.toString()] =
      (metrics.statusCodes[res.statusCode.toString()] || 0) + 1;

    if (!metrics.slowestRequest || roundedMs > metrics.slowestRequest.durationMs) {
      metrics.slowestRequest = {
        path: `${req.method} ${req.originalUrl || req.url}`,
        durationMs: roundedMs,
        timestamp: new Date().toISOString(),
      };
    }

    const cacheHeader = res.getHeader('X-Cache') || '-';
    const logPrefix = `[${new Date().toISOString().substring(11, 19)}]`;
    const statusColor = res.statusCode >= 500 ? '🔥' : res.statusCode >= 400 ? '⚠️' : '⚡';
    
    // Log formatted summary for visibility
    console.log(
      `${logPrefix} ${statusColor} ${req.method} ${req.originalUrl || req.url} ` +
      `${res.statusCode} in ${roundedMs}ms (Cache: ${cacheHeader})`
    );
  });

  next();
}
