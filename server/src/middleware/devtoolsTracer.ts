import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';
import { broadcastApiCall, broadcastApiStage } from '../modules/devtools/wsBroadcast';
import type { ApiCallTrace, ApiCallStage } from '../modules/devtools/types';

const activeTraces = new Map<string, ApiCallTrace>();
export const traceStorage = new AsyncLocalStorage<ApiCallTrace>();

export function getActiveTrace(req?: Request): ApiCallTrace | undefined {
  if (req) return (req as any)._devTrace;
  return traceStorage.getStore();
}

export function traceStage(stageName: ApiCallStage, data?: Record<string, any>): void;
export function traceStage(reqOrName: Request | ApiCallStage, stageNameOrData?: ApiCallStage | Record<string, any>, maybeData?: Record<string, any>) {
  let trace: ApiCallTrace | undefined;
  let stageName: ApiCallStage;
  let data: Record<string, any> | undefined;

  if (typeof reqOrName === 'string') {
    trace = traceStorage.getStore();
    stageName = reqOrName as ApiCallStage;
    data = stageNameOrData as Record<string, any> | undefined;
  } else {
    trace = (reqOrName as Request as any)._devTrace;
    stageName = stageNameOrData as ApiCallStage;
    data = maybeData;
  }

  if (!trace) return;

  const lastStage = trace.stages[trace.stages.length - 1];
  if (lastStage && !lastStage.endedAt) {
    lastStage.endedAt = new Date().toISOString();
    lastStage.durationMs = Math.round(
      (new Date(lastStage.endedAt).getTime() - new Date(lastStage.startedAt).getTime()) * 100
    ) / 100;
  }

  const newStage = {
    name: stageName,
    startedAt: new Date().toISOString(),
    data,
  };
  trace.stages.push(newStage);
  broadcastApiStage(trace.id, newStage);
}

export function finalizeStage(data?: Record<string, any>): void;
export function finalizeStage(reqOrData?: Request | Record<string, any>, maybeData?: Record<string, any>) {
  let trace: ApiCallTrace | undefined;
  let data: Record<string, any> | undefined;

  if (!reqOrData || typeof (reqOrData as any).method !== 'string') {
    trace = traceStorage.getStore();
    data = reqOrData as Record<string, any> | undefined;
  } else {
    trace = (reqOrData as Request as any)._devTrace;
    data = maybeData;
  }

  if (!trace) return;

  const lastStage = trace.stages[trace.stages.length - 1];
  if (lastStage) {
    lastStage.endedAt = new Date().toISOString();
    lastStage.durationMs = Math.round(
      (new Date(lastStage.endedAt).getTime() - new Date(lastStage.startedAt).getTime()) * 100
    ) / 100;
    if (data) lastStage.data = { ...lastStage.data, ...data };
    broadcastApiStage(trace.id, lastStage);
  }
}

export function devtoolsTracer(req: Request, res: Response, next: NextFunction): void {
  const callId = uuidv4();
  const url = req.originalUrl || req.url;

  const skipPaths = ['/ws', '/health', '/languages'];
  if (skipPaths.some((p) => url.startsWith(p))) return next();

  const trace: ApiCallTrace = {
    id: callId,
    method: req.method,
    path: url,
    startedAt: new Date().toISOString(),
    stages: [
      {
        name: 'request',
        startedAt: new Date().toISOString(),
        data: {
          ip: req.ip,
          userAgent: req.get('user-agent')?.slice(0, 100),
          contentType: req.get('content-type'),
        },
      },
    ],
    request: {
      mode: req.body?.mode,
      language: req.body?.language,
      placeId: req.body?.placeId || null,
      question: req.body?.question?.slice(0, 120),
      latitude: req.body?.latitude ?? null,
      longitude: req.body?.longitude ?? null,
    },
  };

  (req as any)._devTrace = trace;
  activeTraces.set(callId, trace);

  const originalJson = res.json.bind(res);
  traceStorage.run(trace, () => {
    (res as any).json = (body: any) => {
      trace.endedAt = new Date().toISOString();
      trace.durationMs = Math.round(
        (new Date(trace.endedAt).getTime() - new Date(trace.startedAt).getTime()) * 100
      ) / 100;
      trace.statusCode = res.statusCode;

      const lastStage = trace.stages[trace.stages.length - 1];
      if (lastStage && !lastStage.endedAt) {
        lastStage.endedAt = new Date().toISOString();
        lastStage.durationMs = Math.round(
          (new Date(lastStage.endedAt).getTime() - new Date(lastStage.startedAt).getTime()) * 100
        ) / 100;
      }

      trace.stages.push({
        name: 'response',
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        durationMs: 0,
        data: { statusCode: res.statusCode, ok: body?.success, sizeBytes: JSON.stringify(body).length },
      });

      if (body?.data) {
        const d = body.data;
        trace.response = {
          answerPreview: typeof d.answer === 'string' ? d.answer.slice(0, 120) : undefined,
          answerProvider: d.confidence ? (d.confidence >= 0.97 ? 'local_lm' : d.confidence >= 0.95 ? 'openai' : 'static_rag') : undefined,
          ragSources: Array.isArray(d.sources) ? d.sources.length : undefined,
          visionMatch: d.placeName || d.artifact?.name || null,
          error: body.error || undefined,
        };

        if (trace.request && d.artifact?.confidence !== undefined) {
          trace.request.top1Prediction = d.artifact?.name;
          trace.request.top1Confidence = d.artifact?.confidence;
        }
      } else if (body?.error) {
        trace.response = { error: body.error };
      }

      broadcastApiCall(trace);
      activeTraces.delete(callId);

      return originalJson(body);
    };

    next();
  });
}
