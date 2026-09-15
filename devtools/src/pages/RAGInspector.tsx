import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PRESETS = [
  'Rani ki Vav Patan history architecture',
  'Modhera Sun Temple equinox alignment',
  'Laxmi Vilas Palace Vadodara Gaekwad dynasty',
  'Somnath Temple rebuilding Sardar Patel',
  'Kumbhalgarh Fort Great Wall of India',
  'Champaner Pavag UNESCO',
];

export default function RAGInspector() {
  const [question, setQuestion] = useState(PRESETS[0]);
  const [placeId, setPlaceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const run = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ question });
      if (placeId) params.set('placeId', placeId);
      const r = await fetch(`/devtools/rag/inspect?${params.toString()}`);
      const d = await r.json();
      if (d.success) setResult(d.data);
    } finally {
      setLoading(false);
    }
  };

  const chartData = (result?.topCatalogHits || []).slice(0, 15).map((h: any) => ({
    name: h.name.length > 30 ? h.name.slice(0, 30) + '…' : h.name,
    full: h.name,
    score: h.score,
  }));

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-50">🔍 RAG Context Inspector</h1>
        <p className="text-sm text-slate-400 mt-1">
          Debug the retrieval pipeline — token matching, passage selection, and catalog scoring
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h2 className="font-semibold text-slate-100">Query</h2>
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-500">Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm p-3 focus:border-brand-500 focus:outline-none resize-y"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button key={p} onClick={() => setQuestion(p)}
                className={`text-xs px-2 py-1 rounded-md border ${
                  question === p ? 'border-brand-500 bg-brand-500/10 text-brand-200' : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600'
                }`}>
                {p.slice(0, 24)}…
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-500">Place ID (optional)</label>
            <input
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              placeholder="IND-HER-11, p1-laxmi-vilas, …"
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm p-2 font-mono"
            />
          </div>
          <button
            onClick={run}
            disabled={loading || !question}
            className="w-full px-4 py-2 rounded-lg text-sm bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-slate-900 font-semibold shadow-lg shadow-brand-500/20"
          >{loading ? '⏳ Running retrieval…' : '🔍 Inspect Retrieval'}</button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!result && !loading && (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-12 text-center">
              <div className="text-5xl mb-4">🔎</div>
              <h3 className="text-lg font-semibold text-slate-200">Run an inspection</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                This simulates the exact retrieval the AI service performs before sending to the LLM.
              </p>
            </div>
          )}

          {loading && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center">
              <div className="text-4xl mb-4 animate-pulse">🔎</div>
              <p className="text-slate-300">Scoring monument catalog against query tokens…</p>
            </div>
          )}

          {result && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ['Matched Place', result.placeName || '—', ''],
                  ['Passages Retrieved', result.passageCount || 0, 'text-emerald-300'],
                  ['Top Catalog Hits', (result.topCatalogHits || []).filter((h: any) => h.score > 0).length, 'text-violet-300'],
                  ['Query Length', result.question?.length || 0, 'text-sky-300'],
                ].map(([label, val, tone]) => (
                  <div key={label as string} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
                    <div className={`text-xl font-bold truncate ${tone || 'text-slate-50'}`} title={val as any}>{val as any}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h3 className="font-semibold text-slate-100 mb-3">📚 Retrieved Passages ({result.passages?.length || 0})</h3>
                <div className="space-y-3">
                  {(result.passages || []).map((p: any, i: number) => (
                    <div key={i} className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-brand-500/20 text-brand-200 grid place-items-center text-xs font-bold">{p.index}</span>
                          <span className="font-medium text-slate-100 text-sm">{p.sourceName}</span>
                        </span>
                        <span className="text-xs font-mono text-slate-500">{p.length} chars</span>
                      </div>
                      <div className="text-sm text-slate-300 leading-relaxed">
                        {p.preview}
                      </div>
                    </div>
                  ))}
                  {(!result.passages || result.passages.length === 0) && (
                    <div className="text-sm text-rose-300 p-4 rounded bg-rose-500/10 border border-rose-500/20">
                      ⚠️ No passages retrieved — this will cause the fallback response.
                    </div>
                  )}
                </div>
              </div>

              {chartData.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                  <h3 className="font-semibold text-slate-100 mb-3">🏆 Catalog Match Scores (Top 15)</h3>
                  <div className="h-72">
                    <ResponsiveContainer>
                      <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" stroke="#64748b" fontSize={11} />
                        <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={180} />
                        <Tooltip
                          contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                          cursor={{ fill: 'rgba(222, 147, 34, 0.08)' }}
                          labelFormatter={(l) => chartData.find((d: any) => d.name === l)?.full || l}
                        />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                          {chartData.map((_: any, i: number) => (
                            <Cell key={i} fill={i === 0 ? '#de9322' : i === 1 ? '#e8b04b' : i === 2 ? '#f2cf89' : '#334155'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Score ≥ 45 → matched by name token (minimum threshold). Score ≥ 200 → exact monument name in query.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
