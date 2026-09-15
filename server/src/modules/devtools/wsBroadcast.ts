import { WebSocketServer, WebSocket } from 'ws';
import type { Server as HttpServer } from 'http';
import { DevWsMessage, ApiCallTrace, ApiCallStage, ServiceHealth, TrainingUpdate } from './types';
import { checkAllServicesHealth } from './healthService';

const CLIENTS = new Set<WebSocket>();
let wss: WebSocketServer | null = null;

function isOpen(ws: WebSocket): boolean {
  return ws.readyState === WebSocket.OPEN;
}

export function attachDevWebSocket(server: HttpServer, path = '/ws/devtools') {
  wss = new WebSocketServer({ server, path });
  wss.on('connection', (ws) => {
    CLIENTS.add(ws);

    if (isOpen(ws)) {
      try { ws.send(JSON.stringify({ type: 'pong' } as DevWsMessage)); } catch {}
    }

    // Initial services snapshot — always send regardless of state timing (try twice to be safe)
    const sendSnapshot = async (retries = 1) => {
      const snapshot = await checkAllServicesHealth();
      if (isOpen(ws)) {
        try { ws.send(JSON.stringify({ type: 'services_snapshot', payload: snapshot } as DevWsMessage)); } catch {}
      } else if (retries > 0) {
        setTimeout(() => sendSnapshot(retries - 1), 100);
      }
    };
    sendSnapshot(2);

    ws.on('message', (raw) => {
      try {
        const parsed = JSON.parse(raw.toString());
        if (parsed?.type === 'ping') {
          if (isOpen(ws)) try { ws.send(JSON.stringify({ type: 'pong' })); } catch {}
        }
        if (parsed?.type === 'refresh_services') {
          checkAllServicesHealth().then((snapshot) => {
            if (isOpen(ws)) {
              try { ws.send(JSON.stringify({ type: 'services_snapshot', payload: snapshot } as DevWsMessage)); } catch {}
            }
          });
        }
      } catch {}
    });
    ws.on('close', () => CLIENTS.delete(ws));
    ws.on('error', () => { try { ws.close(); } catch {}; CLIENTS.delete(ws); });
  });
  console.log(`🔧 Dev WebSocket attached at ${path}`);

  // Periodic service heartbeat (every 15s, faster refresh + retry)
  setInterval(async () => {
    try {
      const snapshot = await checkAllServicesHealth();
      broadcast({ type: 'services_snapshot', payload: snapshot });
    } catch {}
  }, 15_000).unref();
}

export function broadcast(msg: DevWsMessage) {
  const data = JSON.stringify(msg);
  for (const client of CLIENTS) {
    if (isOpen(client)) {
      try { client.send(data); } catch {}
    }
  }
}

export function broadcastApiCall(trace: ApiCallTrace) {
  broadcast({ type: 'api_call', payload: trace });
}

export function broadcastApiStage(callId: string, stage: ApiCallTrace['stages'][number]) {
  broadcast({ type: 'api_stage', payload: { callId, stage } });
}

export function broadcastServices(services: ServiceHealth[]) {
  broadcast({ type: 'services_snapshot', payload: services });
}

export function broadcastTraining(update: TrainingUpdate) {
  broadcast({ type: 'training_update', payload: update });
}
