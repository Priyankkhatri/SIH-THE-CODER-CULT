import { useEffect, useRef, useState, useCallback } from 'react';
import type { DevWsMessage } from '../types';

const WS_PATH = '/ws/devtools';

export function useDevWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<DevWsMessage[]>([]);
  const reconnectRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost'
      ? `${window.location.hostname}:${window.location.port || '5173'}`
      : window.location.host;
    const url = `${proto}//${host}${WS_PATH}`;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        if (reconnectRef.current) {
          clearTimeout(reconnectRef.current);
          reconnectRef.current = null;
        }
      };

      ws.onmessage = (ev) => {
        try {
          const parsed = JSON.parse(ev.data) as DevWsMessage;
          setMessages((prev) => [...prev.slice(-499), parsed]);
        } catch (_) {}
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectRef.current = window.setTimeout(connect, 2500);
      };

      ws.onerror = () => {
        try { ws.close(); } catch (_) {}
      };
    } catch (_) {
      reconnectRef.current = window.setTimeout(connect, 2500);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      try { wsRef.current?.close(); } catch (_) {}
    };
  }, [connect]);

  const send = useCallback((msg: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try { wsRef.current.send(JSON.stringify(msg)); } catch (_) {}
    }
  }, []);

  const ping = useCallback(() => send({ type: 'ping' }), [send]);
  const refreshServices = useCallback(() => send({ type: 'refresh_services' }), [send]);

  return { connected, messages, send, ping, refreshServices };
}
