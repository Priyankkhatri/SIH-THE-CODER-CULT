import { useEffect, useMemo, useState } from 'react';
import { useDevWebSocket } from '../hooks/useDevWebSocket';
import type { ApiCallTrace, ApiCallStage } from '../types';

const STAGE_ORDER: ApiCallStage[] = ['request', 'rag', 'llm_local', 'llm_openai', 'fallback', 'vision_infer', 'vision_vl', 'vision_catalog', 'vision_gps', 'response'];

const STAGE_COLORS: Record<ApiCallStage, string> = {
  request: 'bg-slate-500',
  rag: 'bg-violet-400',
  llm_local: 'bg-emerald-400',
  llm_openai: 'bg-sky-400',
  fallback: 'bg-amber-400',
  vision_infer: 'bg-fuchsia-400',
  vision_vl: 'bg-pink-400',
  vision_catalog: 'bg-indigo-400',
  vision_gps: 'bg-teal-400',
  response: 'bg-brand-400',
};

function stageBarWidth(s: ApiCallTrace['stages'][number], totalMs: number) {
  const dur = s.durationMs || 0;
  if (totalMs <= 0) return 0;
  return Math.max(1, (dur / totalMs) * 100);
}

export default function LiveMonitor() {
  const { connected, messages } = useDevWebSocket();
  const [calls, setCalls] = useState<Map<string, ApiCallTrace>>(new Map());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    if (paused) return;
    const next = new Map(calls);
    let changed = false;
    for (const m of messages) {
      if (m.type === 'api_call') {
        next.set(m.payload.id, m.payload);
        changed = true;
      } else if (m.type === 'api_stage') {
        const existing = next.get(m.payload.callId);
        if (existing) {
          const idx = existing.stages.findIndex((s) => s.name === m.payload.stage.name && s.startedAt === m.payload.stage.startedAt);
          if (idx >= 0) existing.stages[idx] = m.payload.stage;
          else existing.stages.push(m.payload.stage);
          changed = true;
        }
      }
    }
    if (changed) setCalls(next);
  }, [messages, paused]);

  const sortedCalls = useMemo(() => {
    let list = Array.from(calls.values()).sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    if (filter.trim()) {
      const f = filter.toLowerCase();
      list = list.filter((c) =>
        c.path.toLowerCase().includes(f) ||
        c.method.toLowerCase().includes(f) ||
        c.request?.question?.toLowerCase().includes(f) ||
        c.response?.answerPreview?.toLowerCase().includes(f) ||
        c.response?.visionMatch?.toLowerCase().includes(f)
      );
    }
    return list;
  }, [calls, filter]);

  const selected = selectedId ? calls.get(selectedId) : sortedCalls[0] || null;

  const stats = useMemo(() => {
    const arr = Array.from(calls.values());
    const ai = arr.filter((c) => c.path.includes('/ai/'));
    const vis = arr.filter((c) => c.path.includes('/vision/'));
    const completed = arr.filter((c) => c.endedAt);
    const avg = completed.length ? Math.round(completed.reduce((s, c) => s + (c.durationMs || 0), 0) / completed.length) : 0;
    const max = completed.length ? Math.max(...completed.map((c) => c.durationMs || 0)) : 0;
    const err = completed.filter((c) => (c.statusCode || 0) >= 400).length;
    return { total: arr.length, ai: ai.length, vision: vis.length, completed: completed.length, avg, max, err, ok: completed.length - err };
  }, [calls]);

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">📡 Live API Monitor</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time tracing of every API call with granular stage-level timings
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="🔎 Search path / question / match…"
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 w-64 focus:border-brand-500 focus:outline-none"
          />
          <button
            onClick={() => setCalls(new Map())}
            className="px-3 py-2 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >🗑️ Clear</button>
          <button
            onClick={() => setPaused((p) => !p)}
            className={`px-3 py-2 rounded-lg text-sm border font-medium ${
              paused ? 'bg-amber-500/10 text-amber-300 border-amber-500/40' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >{paused ? '▶️ Resumed' : '⏸️ Pause'}</button>
          <div className={`px-3 py-2 rounded-lg text-sm border ${
            connected ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/10 text-rose-300 border-rose-500/40'
          }`}>
            {connected ? '🟢 Live' : '🔴 Disconnected'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {[
          ['Total', stats.total],
          ['Completed', stats.completed],
          ['AI', stats.ai, 'text-emerald-300'],
          ['Vision', stats.vision, 'text-amber-300'],
          ['OK', stats.ok, 'text-emerald-300'],
          ['Errors', stats.err, 'text-rose-300'],
          ['Avg', `${stats.avg}ms`],
          ['Max', `${stats.max}ms`],
        ].map(([label, val, tone]) => (
          <div key={label as string} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
            <div className={`text-xl font-bold ${tone || 'text-slate-50'}`}>{val as any}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold text-slate-100">Call Stream ({sortedCalls.length})</h2>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
            {sortedCalls.length === 0 ? (
              <div className="p-16 text-center text-sm text-slate-500">
                Waiting for API calls… Start the mobile app or run the LLM Playground!
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-900 z-10">
                  <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    <th className="px-3 py-2">Time</th>
                    <th className="px-3 py-2">M</th>
                    <th className="px-3 py-2">Path</th>
                    <th className="px-3 py-2">St</th>
                    <th className="px-3 py-2">Lat</th>
                    <th className="px-3 py-2">Stage Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sortedCalls.map((c) => {
                    const isSel = selected?.id === c.id;
                    const totalMs = c.durationMs || 1;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={`cursor-pointer transition ${isSel ? 'bg-brand-500/10' : 'hover:bg-slate-800/40'}`}
                      >
                        <td className="px-3 py-2 text-xs text-slate-500 font-mono whitespace-nowrap">
                          {new Date(c.startedAt).toLocaleTimeString()}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            c.method === 'POST' ? 'bg-brand-500/15 text-brand-300' : 'bg-sky-500/15 text-sky-300'
                          }`}>{c.method}</span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-mono text-xs text-slate-200 truncate max-w-[220px]" title={c.path}>{c.path}</div>
                          {(c.request?.question || c.response?.visionMatch) && (
                            <div className="text-[10px] text-slate-500 truncate max-w-[220px]" title={c.request?.question || c.response?.visionMatch}>
                              {c.request?.question || c.response?.visionMatch}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`font-mono text-xs ${
                            (c.statusCode || 0) >= 500 ? 'text-rose-400' :
                            (c.statusCode || 0) >= 400 ? 'text-amber-400' :
                            c.statusCode ? 'text-emerald-400' : 'text-slate-500'
                          }`}>{c.statusCode || '…'}</span>
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-slate-400 whitespace-nowrap">
                          {c.durationMs ? `${Math.round(c.durationMs)}ms` : '…'}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex gap-0.5 h-3 rounded overflow-hidden bg-slate-800/50 min-w-[120px]">
                            {c.stages
                              .filter((s) => s.name !== 'request' && s.name !== 'response')
                              .map((s, i) => (
                                <div
                                  key={i}
                                  className={`${STAGE_COLORS[s.name]} ${
                                    !s.endedAt ? 'animate-pulse opacity-70' : ''
                                  }`}
                                  style={{ width: `${stageBarWidth(s, totalMs)}%` }}
                                  title={`${s.name}${s.durationMs ? ` — ${s.durationMs}ms` : ''}`}
                                />
                              ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-800">
            <h2 className="font-semibold text-slate-100">Call Details</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!selected ? (
              <div className="text-sm text-slate-500 text-center py-16">
                Select a call on the left to see full stage breakdown
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                      selected.method === 'POST' ? 'bg-brand-500/15 text-brand-300' : 'bg-sky-500/15 text-sky-300'
                    }`}>{selected.method}</span>
                    <div className="font-mono text-sm text-slate-200 break-all">{selected.path}</div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-950/60 rounded">
                      <div className="text-slate-500">Started</div>
                      <div className="text-slate-200 font-mono">{new Date(selected.startedAt).toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-slate-950/60 rounded">
                      <div className="text-slate-500">Duration</div>
                      <div className="text-slate-200 font-mono text-lg font-bold">
                        {selected.durationMs ? `${Math.round(selected.durationMs)}ms` : 'in progress…'}
                      </div>
                    </div>
                  </div>
                </div>

                {(selected.request || selected.response) && (
                  <div className="rounded-lg border border-slate-800 overflow-hidden">
                    <div className="px-3 py-2 bg-slate-950/60 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
                      Request / Response
                    </div>
                    <div className="p-3 space-y-3 text-sm">
                      {selected.request && (
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Request</div>
                          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap bg-slate-950 p-2 rounded max-h-40 overflow-y-auto">
                            {JSON.stringify(selected.request, null, 2)}
                          </pre>
                        </div>
                      )}
                      {selected.response && (
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Response</div>
                          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap bg-slate-950 p-2 rounded max-h-40 overflow-y-auto">
                            {JSON.stringify(selected.response, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="rounded-lg border border-slate-800 overflow-hidden">
                  <div className="px-3 py-2 bg-slate-950/60 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    Stage Waterfall ({selected.stages.length})
                  </div>
                  <div className="p-3 space-y-1.5">
                    {selected.stages.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${STAGE_COLORS[s.name] || 'bg-slate-500'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-slate-200">{s.name}</span>
                            {!s.endedAt && <span className="text-[10px] text-amber-400 animate-pulse">running…</span>}
                            {s.durationMs !== undefined && (
                              <span className="text-[10px] font-mono text-slate-500">{s.durationMs}ms</span>
                            )}
                          </div>
                          {s.data && Object.keys(s.data).length > 0 && (
                            <pre className="text-[10px] font-mono text-slate-500 whitespace-pre-wrap bg-slate-950/50 p-1.5 rounded mt-1 border border-slate-800/70 max-h-24 overflow-y-auto">
                              {JSON.stringify(s.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <details className="rounded-lg border border-slate-800 bg-slate-950/30">
                  <summary className="p-3 cursor-pointer text-xs uppercase tracking-wider text-slate-500 hover:text-slate-300 list-none">
                    🔎 Raw Trace JSON
                  </summary>
                  <pre className="px-3 pb-3 text-xs font-mono text-slate-400 whitespace-pre-wrap overflow-x-auto max-h-60">
                    {JSON.stringify(selected, null, 2)}
                  </pre>
                </details>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Stage Legend</div>
        <div className="flex flex-wrap gap-2">
          {STAGE_ORDER.map((s) => (
            <div key={s} className="flex items-center gap-1.5 text-xs text-slate-300 px-2 py-1 rounded bg-slate-950/60 border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${STAGE_COLORS[s]}`} />
              <code>{s}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
