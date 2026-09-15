import { useEffect, useState } from 'react';
import { useDevWebSocket } from '../hooks/useDevWebSocket';
import type { ApiCallTrace, ServiceHealth } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const { messages, connected } = useDevWebSocket();
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [recentCalls, setRecentCalls] = useState<ApiCallTrace[]>([]);
  const [kpis, setKpis] = useState({ total: 0, ai: 0, vision: 0, avg: 0, ok: 0, err: 0 });
  const nav = useNavigate();

  useEffect(() => {
    fetch('/devtools/services')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) setServices(d.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let snap: any = undefined;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === 'services_snapshot') { snap = messages[i]; break; }
    }
    if (snap?.type === 'services_snapshot') setServices(snap.payload);

    const calls: ApiCallTrace[] = [];
    for (let i = messages.length - 1; i >= 0 && calls.length < 30; i--) {
      const m = messages[i];
      if (m.type === 'api_call') calls.push(m.payload);
    }
    setRecentCalls(calls);

    const ai = calls.filter((c) => c.path.includes('/ai/')).length;
    const vis = calls.filter((c) => c.path.includes('/vision/')).length;
    const avg = calls.length > 0
      ? Math.round(calls.reduce((s, c) => s + (c.durationMs || 0), 0) / calls.length)
      : 0;
    const ok = calls.filter((c) => (c.statusCode || 0) < 400).length;
    setKpis({ total: calls.length, ai, vision: vis, avg, ok, err: calls.length - ok });
  }, [messages]);

  const card = (label: string, value: any, sub?: string, tone = 'brand') => (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 text-3xl font-bold tracking-tight ${
        tone === 'green' ? 'text-emerald-300' :
        tone === 'rose' ? 'text-rose-300' :
        tone === 'amber' ? 'text-amber-300' :
        'text-slate-50'
      }`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-50">Overview</h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time system health, AI pipeline metrics, and recent API activity
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {card('WS', connected ? '✅' : '❌', connected ? 'Connected' : 'Reconnecting', connected ? 'green' : 'rose')}
        {card('API Calls (30)', kpis.total, 'AI + Vision + misc')}
        {card('AI Requests', kpis.ai, '/ai/* routes', 'green')}
        {card('Vision Requests', kpis.vision, '/vision/* routes', 'amber')}
        {card('Avg Latency', `${kpis.avg}ms`, 'Across completed calls')}
        {card('OK / Err', `${kpis.ok} / ${kpis.err}`, kpis.total ? `${Math.round(kpis.ok / kpis.total * 100)}% success` : '')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-50">Service Health</h2>
            <span className="text-xs text-slate-500">{services.length} services</span>
          </div>
          <div className="space-y-2">
            {services.length === 0 && (
              <div className="text-sm text-slate-500">No snapshot yet. Start the backend server.</div>
            )}
            {services.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800"
              >
                <span className={`w-3 h-3 rounded-full ${
                  s.status === 'healthy' ? 'bg-emerald-400' :
                  s.status === 'degraded' ? 'bg-amber-400' : 'bg-rose-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-200">
                      {s.name === 'googlePlaces' ? 'Google Places' :
                       s.name === 'lmStudio' ? 'LM Studio' :
                       s.name === 'onnxVision' ? 'ONNX Vision' :
                       s.name === 'mobileNetV3' ? 'MobileNetV3' :
                       s.name === 'masterData' ? 'Master Data' :
                       s.name.charAt(0).toUpperCase() + s.name.slice(1)}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      s.status === 'healthy' ? 'bg-emerald-400/10 text-emerald-300' :
                      s.status === 'degraded' ? 'bg-amber-400/10 text-amber-300' :
                      'bg-rose-500/10 text-rose-300'
                    }`}>{s.status}</span>
                  </div>
                  <div className="text-xs text-slate-400 truncate">{s.message}</div>
                </div>
                {s.latencyMs !== undefined && (
                  <div className="text-xs font-mono text-slate-400">{s.latencyMs}ms</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-50">Quick Jump</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['🧠', 'LLM Playground', 'Test 3 tiers side-by-side', '/llm'],
              ['📡', 'Live Monitor', 'Watch API calls stream', '/monitor'],
              ['🔍', 'RAG Inspector', 'Debug retrieval scoring', '/rag'],
              ['📸', 'Vision Debugger', 'Catalog + thresholds', '/vision'],
              ['📊', 'Datasets', '4-tier data overview', '/datasets'],
            ].map(([icon, title, sub, to]) => (
              <button
                key={to}
                onClick={() => nav(to)}
                className="text-left p-4 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-900 transition group"
              >
                <div className="text-2xl">{icon}</div>
                <div className="mt-2 font-medium text-slate-100 group-hover:text-brand-200">{title}</div>
                <div className="text-xs text-slate-500">{sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-50">Recent API Calls</h2>
          <button
            onClick={() => nav('/monitor')}
            className="text-xs text-brand-300 hover:text-brand-200"
          >Open full monitor →</button>
        </div>
        {recentCalls.length === 0 ? (
          <div className="text-sm text-slate-500 py-12 text-center">
            No API calls yet. Start making requests from the mobile app or LLM Playground.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
                  <th className="py-2 pr-4">Method</th>
                  <th className="py-2 pr-4">Path</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Latency</th>
                  <th className="py-2 pr-4">Mode / Pred</th>
                  <th className="py-2">Answer Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {recentCalls.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-950/40">
                    <td className="py-2 pr-4">
                      <span className={`px-1.5 py-0.5 text-xs font-mono rounded ${
                        c.method === 'POST' ? 'bg-brand-500/10 text-brand-300' : 'bg-sky-500/10 text-sky-300'
                      }`}>{c.method}</span>
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-slate-300 max-w-[260px] truncate">{c.path}</td>
                    <td className="py-2 pr-4">
                      <span className={`font-mono text-xs ${
                        (c.statusCode || 0) >= 500 ? 'text-rose-400' :
                        (c.statusCode || 0) >= 400 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>{c.statusCode || '—'}</span>
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-slate-400">
                      {c.durationMs ? `${Math.round(c.durationMs)}ms` : '—'}
                    </td>
                    <td className="py-2 pr-4 text-xs text-slate-300">
                      {c.request?.mode || c.request?.top1Prediction ||
                        c.response?.answerProvider || '—'}
                    </td>
                    <td className="py-2 text-xs text-slate-400 max-w-[320px] truncate">
                      {c.response?.answerPreview || c.response?.visionMatch || c.response?.error || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
