import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TIER_COLORS: Record<string, string> = {
  T1_National: '#475569',
  T2_ASI: '#6366f1',
  T3_State: '#06b6d4',
  T4_Curated: '#de9322',
  T5_Unified_Seed: '#10b981',
};

export default function Datasets() {
  const [summary, setSummary] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/devtools/datasets/summary')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSummary(d.data);
          setLoaded(true);
        }
      })
      .catch(() => setLoaded(true));
  }, []);

  const entries = summary ? Object.entries(summary) : [];
  const chartData = entries.map(([name, meta]: [string, any]) => ({
    name: name.replace(/.csv|.json/g, '').slice(0, 28),
    full: name,
    rows: meta.rows || 0,
    sizeKb: meta.sizeKb || 0,
    tier: meta.tier,
  }));

  const totalRows = chartData.reduce((s, r) => s + r.rows, 0);

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-50">📊 Dataset Hierarchy</h1>
        <p className="text-sm text-slate-400 mt-1">
          5-tier pipeline from national census (19.64 Lakh) → curated master matrix → unified seed for runtime
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          ['T1 · National Census', '19.64 Lakh', 'Govt of India heritage census', TIER_COLORS.T1_National],
          ['T2 · ASI Registry', '3,696 entries', 'Archaeological Survey of India', TIER_COLORS.T2_ASI],
          ['T3 · State Atlas', 'Gujarat exhaustive', 'State-level heritage atlas', TIER_COLORS.T3_State],
          ['T4 · Master Matrix', '146 sites · 541 photos', 'Curated SIH 2026 dataset', TIER_COLORS.T4_Curated],
          ['T5 · Unified Seed', 'Runtime places.json', 'Loaded into memory + Prisma', TIER_COLORS.T5_Unified_Seed],
        ].map(([label, val, sub, color]) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ background: color }} />
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
            <div className="mt-1 text-xl font-bold text-slate-50">{val}</div>
            <div className="text-xs text-slate-500 mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="font-semibold text-slate-100 mb-3">📈 Rows by Tier</h2>
          {loaded && chartData.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Backend not reachable or endpoint missing. Start the server on :3000.
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer>
                <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={160} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: 'rgba(222, 147, 34, 0.06)' }}
                    formatter={(v: any, n: string) => [n === 'rows' ? `${v.toLocaleString()} rows` : `${v} KB`, n]}
                    labelFormatter={(l) => chartData.find((d) => d.name === l)?.full || l}
                  />
                  <Bar dataKey="rows" radius={[0, 4, 4, 0]}>
                    {chartData.map((d, i) => (
                      <Cell key={i} fill={TIER_COLORS[d.tier] || '#475569'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-100">🗂️ Inventory</h2>
            <span className="text-xs text-slate-500">Total: {totalRows.toLocaleString()} rows</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                  <th className="py-2 px-3">File</th>
                  <th className="py-2 px-3">Tier</th>
                  <th className="py-2 px-3 text-right">Rows</th>
                  <th className="py-2 px-3 text-right">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {entries.length === 0 && loaded && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-slate-500">
                      No data returned from <code className="text-brand-300">/devtools/datasets/summary</code>
                    </td>
                  </tr>
                )}
                {entries.map(([name, meta]: [string, any]) => (
                  <tr key={name} className="hover:bg-slate-950/40">
                    <td className="py-2 px-3 font-mono text-xs text-slate-200">{name}</td>
                    <td className="py-2 px-3">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{
                          background: (TIER_COLORS[meta.tier] || '#475569') + '22',
                          color: TIER_COLORS[meta.tier] || '#94a3b8',
                          border: `1px solid ${(TIER_COLORS[meta.tier] || '#475569')}44`,
                        }}
                      >
                        {meta.tier || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-100">
                      {(meta.rows || 0).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-400">
                      {(meta.sizeKb || 0).toLocaleString()} KB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="font-semibold text-slate-100 mb-4">🔁 Data Pipeline Flow</h2>
        <div className="flex flex-col md:flex-row items-stretch gap-2">
          {[
            ['Census (CSV)', '19.64L raw entries', 'T1'],
            ['ASI Registry', '3,696 verified sites', 'T2'],
            ['Gujarat Atlas', 'Exhaustive state list', 'T3'],
            ['Master Matrix', '146 × 541 photos', 'T4'],
            ['Unified Seed', 'Runtime + Prisma', 'T5'],
          ].map(([label, sub, tier], i, arr) => (
            <div key={label} className="flex-1 flex items-stretch gap-2">
              <div className="flex-1 p-4 rounded-lg bg-slate-950/60 border border-slate-800 relative">
                <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-500">{tier}</div>
                <div className="font-medium text-slate-100">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
              </div>
              {i < arr.length - 1 && (
                <div className="hidden md:flex items-center text-brand-400 text-xl px-1">→</div>
              )}
              {i < arr.length - 1 && (
                <div className="md:hidden flex justify-center text-brand-400">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
