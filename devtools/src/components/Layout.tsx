import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useDevWebSocket } from '../hooks/useDevWebSocket';
import type { ServiceHealth } from '../types';
import { useEffect, useState } from 'react';

const NAV = [
  { to: '/', label: '🏠 Overview', desc: 'System dashboard' },
  { to: '/llm', label: '🧠 LLM Playground', desc: '3-tier A/B testing' },
  { to: '/monitor', label: '📡 Live Monitor', desc: 'API calls & stages' },
  { to: '/rag', label: '🔍 RAG Inspector', desc: 'Retrieval scoring' },
  { to: '/vision', label: '📸 Vision Debugger', desc: 'Model & catalog' },
  { to: '/datasets', label: '📊 Datasets', desc: '4-tier hierarchy' },
];

function statusDot(s?: string) {
  return s === 'healthy' ? 'bg-emerald-400' : s === 'degraded' ? 'bg-amber-400' : 'bg-rose-500';
}

export default function Layout() {
  const { connected, messages, refreshServices } = useDevWebSocket();
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const loc = useLocation();

  useEffect(() => {
    let snap: any = undefined;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === 'services_snapshot') { snap = messages[i]; break; }
    }
    if (snap?.type === 'services_snapshot') setServices(snap.payload);
  }, [messages]);

  const current = NAV.find((n) =>
    n.to === '/' ? loc.pathname === '/' : loc.pathname.startsWith(n.to)
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 grid place-items-center text-2xl shadow-lg shadow-brand-900/30">
              🏛️
            </div>
            <div>
              <div className="font-bold tracking-tight text-slate-50">Heritage Dev Console</div>
              <div className="text-xs text-slate-400">SIH 2026 · SIH26204</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-xs text-slate-400">
              WebSocket {connected ? 'connected' : 'reconnecting…'}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `group block rounded-lg px-3 py-2.5 transition border border-transparent ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-200 border-brand-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-50'
                }`
              }
            >
              <div className="text-sm font-medium">{n.label}</div>
              <div className="text-[11px] text-slate-500 group-hover:text-slate-400">{n.desc}</div>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 px-2 mb-2">
            Service Status
            <button
              onClick={refreshServices}
              className="float-right text-brand-300 hover:text-brand-200"
              title="Refresh"
            >↻</button>
          </div>
          {services.length === 0 && (
            <div className="text-xs text-slate-500 px-2">Waiting for snapshot…</div>
          )}
          {services.map((s) => (
            <div key={s.name} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-800/50">
              <span className={`w-2 h-2 rounded-full ${statusDot(s.status)}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-200 truncate">{s.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{s.message}</div>
              </div>
              {s.latencyMs !== undefined && (
                <div className="text-[10px] font-mono text-slate-400">{s.latencyMs}ms</div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 flex items-center gap-4 sticky top-0 z-10">
          <div>
            <div className="text-sm text-slate-400">Dev Console</div>
            <div className="font-semibold tracking-tight">{current?.label.split(' ').slice(1).join(' ') || 'Overview'}</div>
          </div>
          <div className="flex-1" />
          <div className="text-xs text-slate-500 font-mono">
            {new Date().toLocaleTimeString()}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
