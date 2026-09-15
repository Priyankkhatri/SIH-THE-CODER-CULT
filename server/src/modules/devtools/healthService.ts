import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { ServiceHealth, ServiceName } from './types';
import { config } from '../../config';

const rootDir = path.resolve(__dirname, '..', '..', '..', '..');
const weightsDir = path.join(rootDir, 'ml', 'weights');

async function ping(url: string, timeoutMs = 3000): Promise<{ ok: boolean; latency?: number }> {
  const start = performance.now();
  try {
    await axios.get(url, { timeout: timeoutMs, validateStatus: () => true });
    return { ok: true, latency: Math.round(performance.now() - start) };
  } catch {
    return { ok: false };
  }
}

export async function checkAllServicesHealth(): Promise<ServiceHealth[]> {
  const checks: Promise<ServiceHealth>[] = [
    (async (): Promise<ServiceHealth> => ({
      name: 'server',
      status: 'healthy',
      message: 'Express 5.x running',
      checkedAt: new Date().toISOString(),
      details: { version: '1.0.0', pid: process.pid, uptimeS: Math.round(process.uptime()) },
    }))(),

    (async (): Promise<ServiceHealth> => {
      const r = await ping('http://127.0.0.1:1234/v1/models', 2500);
      if (!r.ok) return { name: 'lmStudio', status: 'offline', message: 'Not running on :1234', checkedAt: new Date().toISOString() };
      let modelInfo: any = null;
      try {
        const resp = await axios.get('http://127.0.0.1:1234/v1/models', { timeout: 3000 });
        modelInfo = resp.data?.data?.[0] ?? null;
      } catch {}
      return {
        name: 'lmStudio',
        status: 'healthy',
        latencyMs: r.latency,
        message: modelInfo?.id ? `Loaded: ${modelInfo.id}` : 'Online',
        checkedAt: new Date().toISOString(),
        details: modelInfo ?? undefined,
      };
    })(),

    (async (): Promise<ServiceHealth> => {
      const key = config.openaiApiKey?.trim();
      if (!key) return { name: 'openai', status: 'offline', message: 'OPENAI_API_KEY not set', checkedAt: new Date().toISOString() };
      try {
        const start = performance.now();
        await axios.post(
          'https://api.openai.com/v1/chat/completions',
          { model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'hi' }], max_tokens: 1 },
          { headers: { Authorization: `Bearer ${key}` }, timeout: 6000, validateStatus: () => true }
        );
        return { name: 'openai', status: 'healthy', latencyMs: Math.round(performance.now() - start), message: 'gpt-4o-mini reachable', checkedAt: new Date().toISOString() };
      } catch {
        return { name: 'openai', status: 'degraded', message: 'API ping failed', checkedAt: new Date().toISOString() };
      }
    })(),

    (async (): Promise<ServiceHealth> => {
      const onnxPath = path.join(weightsDir, 'heritage_vision_model.onnx');
      const pthPath = path.join(weightsDir, 'heritage_vision_model.pth');
      const classesPath = path.join(weightsDir, 'classes.json');
      const onnxExists = fs.existsSync(onnxPath);
      const pthExists = fs.existsSync(pthPath);
      const classesExists = fs.existsSync(classesPath);
      const onnxSize = onnxExists ? Math.round(fs.statSync(onnxPath).size / 1024 / 1024 * 10) / 10 : 0;
      const classCount = classesExists ? (() => { try { return JSON.parse(fs.readFileSync(classesPath, 'utf8')).length; } catch { return 0; } })() : 0;
      const ok = onnxExists && classesExists;
      return {
        name: 'onnxVision',
        status: ok ? 'healthy' : 'offline',
        message: ok ? `${onnxSize}MB ONNX + ${classCount} classes` : 'Missing weights/classes.json',
        checkedAt: new Date().toISOString(),
        details: { onnxSize, classCount, onnxExists, pthExists, classesExists, onnxPath, classesPath },
      };
    })(),

    (async (): Promise<ServiceHealth> => {
      const pth = path.join(weightsDir, 'heritage_vision_model.pth');
      const adapter = path.join(weightsDir, 'heritage_knowledge_adapter.pth');
      const pthExists = fs.existsSync(pth);
      const adapterExists = fs.existsSync(adapter);
      const pthSize = pthExists ? Math.round(fs.statSync(pth).size / 1024 / 1024 * 10) / 10 : 0;
      return {
        name: 'mobileNetV3',
        status: pthExists ? 'healthy' : 'offline',
        message: pthExists ? `pth ${pthSize}MB, adapter=${adapterExists ? 'yes' : 'no'}` : 'Missing pth weights',
        checkedAt: new Date().toISOString(),
        details: { pthSize, pthExists, adapterExists, backbone: 'MobileNetV3 Small', params: '2.5M' },
      };
    })(),

    (async (): Promise<ServiceHealth> => {
      try {
        const dbMod = await import('../../config/database');
        const prisma = (dbMod as any).default || (dbMod as any).prisma;
        if (prisma && typeof prisma.$queryRaw === 'function') {
          const start = performance.now();
          try {
            await prisma.$queryRawUnsafe('SELECT 1');
            return { name: 'database', status: 'healthy', latencyMs: Math.round(performance.now() - start), message: 'Prisma/PostgreSQL connected', checkedAt: new Date().toISOString(), details: { kind: 'prisma-postgres' } };
          } catch (e) {
            return { name: 'database', status: 'degraded', message: 'Prisma present, falling back to in-memory seed', checkedAt: new Date().toISOString(), details: { kind: 'in-memory-fallback', reason: (e as Error).message } };
          }
        }
      } catch {}
      // Try seed check
      try {
        const seedPath = path.resolve(__dirname, '..', '..', 'seed', 'master_unified_places.json');
        if (fs.existsSync(seedPath)) {
          const size = Math.round(fs.statSync(seedPath).size / 1024);
          return { name: 'database', status: 'degraded', message: `In-memory seed mode (${size}KB)`, checkedAt: new Date().toISOString(), details: { kind: 'in-memory-seed' } };
        }
      } catch {}
      return { name: 'database', status: 'offline', message: 'No DB or seed found', checkedAt: new Date().toISOString() };
    })(),

    (async (): Promise<ServiceHealth> => {
      const seedPath = path.resolve(__dirname, '..', '..', 'seed', 'master_unified_places.json');
      if (!fs.existsSync(seedPath)) return { name: 'masterData', status: 'offline', message: 'master_unified_places.json missing', checkedAt: new Date().toISOString() };
      try {
        const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        const len = Array.isArray(data) ? data.length : (data.places?.length ?? 0);
        return { name: 'masterData', status: 'healthy', message: `${len} unified places loaded`, checkedAt: new Date().toISOString(), details: { count: len, seedKb: Math.round(fs.statSync(seedPath).size / 1024) } };
      } catch (e) {
        return { name: 'masterData', status: 'degraded', message: 'Seed parse error', checkedAt: new Date().toISOString(), details: { error: (e as Error).message } };
      }
    })(),
  ];

  return Promise.all(checks);
}

export type { ServiceName };
