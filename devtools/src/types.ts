export type ServiceName =
  | 'server'
  | 'lmStudio'
  | 'openai'
  | 'onnxVision'
  | 'database'
  | 'mobileNetV3'
  | 'masterData';

export type ServiceStatus = 'healthy' | 'degraded' | 'offline' | 'unknown';

export interface ServiceHealth {
  name: ServiceName;
  status: ServiceStatus;
  latencyMs?: number;
  message?: string;
  checkedAt: string;
  details?: Record<string, any>;
}

export type ApiCallStage =
  | 'request'
  | 'llm_local'
  | 'llm_openai'
  | 'rag'
  | 'fallback'
  | 'vision_infer'
  | 'vision_vl'
  | 'vision_catalog'
  | 'vision_gps'
  | 'response';

export interface ApiCallTrace {
  id: string;
  method: string;
  path: string;
  startedAt: string;
  endedAt?: string;
  durationMs?: number;
  statusCode?: number;
  stages: Array<{
    name: ApiCallStage;
    startedAt: string;
    endedAt?: string;
    durationMs?: number;
    data?: Record<string, any>;
  }>;
  request?: {
    placeId?: string | null;
    mode?: string;
    language?: string;
    question?: string;
    latitude?: number | null;
    longitude?: number | null;
    top1Prediction?: string;
    top1Confidence?: number;
  };
  response?: {
    answerPreview?: string;
    answerProvider?: 'local_lm' | 'openai' | 'static_rag' | 'fallback';
    ragSources?: number;
    visionMatch?: string | null;
    error?: string;
  };
}

export type DevWsMessage =
  | { type: 'pong' }
  | { type: 'api_call'; payload: ApiCallTrace }
  | { type: 'api_stage'; payload: { callId: string; stage: ApiCallTrace['stages'][number] } }
  | { type: 'services_snapshot'; payload: ServiceHealth[] }
  | { type: 'training_update'; payload: any }
  | { type: 'prompt_changed'; payload: { mode: string; language: string } }
  | { type: 'benchmark_update'; payload: { completed: number; total: number; passRate: number; currentTest?: string } };
