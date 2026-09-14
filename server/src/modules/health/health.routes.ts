import { Router, Request, Response } from 'express';
import os from 'os';
import path from 'path';
import fs from 'fs';
import prisma from '../../config/database';
import { cacheManager } from '../../utils/cacheManager';
import { getTelemetryMetrics } from '../../middleware/logger';
import { loadMasterUnifiedPlaces } from '../../utils/masterDataLoader';

const router = Router();

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d > 0 ? `${d}d ` : ''}${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
}

// 1. Basic health check
router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: '2.0.0-production',
    service: 'Yatra Heritage Companion API',
  });
});

// 2. Detailed system diagnostics & telemetry
router.get('/detailed', async (_req: Request, res: Response) => {
  const startPing = process.hrtime.bigint();
  let dbStatus = 'disconnected';
  let dbLatencyMs = -1;

  try {
    // Quick probe with 1.5s timeout
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
    ]);
    const endPing = process.hrtime.bigint();
    dbLatencyMs = Math.round(Number(endPing - startPing) / 10_000) / 100;
    dbStatus = 'connected';
  } catch (_err) {
    dbStatus = 'disconnected (In-Memory Master Catalog Active)';
    dbLatencyMs = 0;
  }

  const memUsage = process.memoryUsage();
  const toMb = (bytes: number) => Math.round((bytes / 1024 / 1024) * 100) / 100;

  // Check ML model files
  const rootDir = path.resolve(__dirname, '../../../../');
  const onnxPath = path.join(rootDir, 'ml', 'models', 'indian_monuments_efficientnet.onnx');
  const labelsPath = path.join(rootDir, 'ml', 'models', 'classes.json');
  const mlReady = fs.existsSync(onnxPath);
  let mlClassesCount = 0;
  if (fs.existsSync(labelsPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(labelsPath, 'utf8'));
      mlClassesCount = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
    } catch (_) {}
  }

  // Check Master Catalog
  const masterPlaces = loadMasterUnifiedPlaces();
  const masterPlacesCount = masterPlaces.length;

  const cacheStats = cacheManager.getStats();
  const telemetry = getTelemetryMetrics();

  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: '2.0.0-production',
    system: {
      hostname: os.hostname(),
      platform: `${os.platform()} (${os.arch()})`,
      nodeVersion: process.version,
      pid: process.pid,
      uptime: formatUptime(process.uptime()),
      uptimeSeconds: Math.floor(process.uptime()),
    },
    resources: {
      cpuCount: os.cpus().length,
      freeMemoryMb: Math.round(os.freemem() / 1024 / 1024),
      totalMemoryMb: Math.round(os.totalmem() / 1024 / 1024),
      processMemory: {
        rssMb: toMb(memUsage.rss),
        heapTotalMb: toMb(memUsage.heapTotal),
        heapUsedMb: toMb(memUsage.heapUsed),
        externalMb: toMb(memUsage.external),
      },
    },
    database: {
      status: dbStatus,
      pingLatencyMs: dbLatencyMs,
      provider: 'SQLite (Prisma ORM)',
    },
    cache: {
      engine: 'In-Memory LRU + TTL',
      ...cacheStats,
    },
    mlSubsystem: {
      onnxModelReady: mlReady,
      classesTrained: mlClassesCount,
      onnxPath: mlReady ? 'ml/models/indian_monuments_efficientnet.onnx' : 'not_found',
      activeInference: 'Python ONNX Runtime Subprocess',
    },
    catalog: {
      masterMonumentsLoaded: masterPlacesCount,
      coverage: '148 National Monuments across 28 Indian States & UTs',
    },
    telemetry,
  });
});

export default router;
