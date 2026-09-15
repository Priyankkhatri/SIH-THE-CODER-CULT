import { useEffect, useState } from 'react';

export default function VisionDebugger() {
  const [info, setInfo] = useState<any>(null);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [tab, setTab] = useState<'info' | 'catalog' | 'thresholds'>('info');

  useEffect(() => {
    (async () => {
      try {
        const [a, b] = await Promise.all([
          fetch('/devtools/vision/catalog').then((r) => r.json()),
          fetch('/vision/catalog').then((r) => r.json()),
        ]);
        if (a.success) setInfo(a.data);
        if (b.success) setCatalog(b.data || []);
      } catch (_) {}
    })();
  }, []);

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-50">📸 Vision Debugger</h1>
        <p className="text-sm text-slate-400 mt-1">
          4-stage identification pipeline · MobileNetV3 ONNX → VL LLM → Catalog → GPS
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center gap-1 p-1 mb-4 bg-slate-950/60 rounded-lg w-fit">
          {[
            ['info', '📊 Model Info'],
            ['thresholds', '🎯 Thresholds & Pipeline'],
            ['catalog', '🗂️ Monument Catalog'],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k as any)}
              className={`px-4 py-2 rounded-md text-sm transition ${
                tab === k ? 'bg-brand-500 text-slate-900 font-semibold' : 'text-slate-300 hover:text-slate-100'
              }`}
            >{label}</button>
          ))}
        </div>

        {tab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ['Backbone', 'MobileNetV3 Small', 'text-emerald-300'],
              ['Params', '2.5M trainable', 'text-sky-300'],
              ['ONNX Classes', info?.classesCount || '—', 'text-violet-300'],
              ['Catalog Entries', `${info?.catalogSize || '—'} monuments`, 'text-brand-300'],
            ].map(([label, val, tone]) => (
              <div key={label} className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
                <div className={`mt-1 text-xl font-bold ${tone}`}>{val}</div>
              </div>
            ))}
            {info?.classes && info.classes.length > 0 && (
              <div className="md:col-span-2 lg:col-span-4 p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                  {info.classes.length} Model Output Classes (classes.json)
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto">
                  {(info.classes || []).map((c: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-1 rounded bg-slate-800/70 text-slate-300 border border-slate-700 font-mono">
                      {i.toString().padStart(3, '0')}. {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'thresholds' && (
          <div className="space-y-6">
            <div className="p-5 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-transparent border border-fuchsia-500/20">
              <h3 className="font-semibold text-fuchsia-200 mb-2">Stage 1 · MobileNetV3 ONNX Inference</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-500">Confidence {'≥'}</div>
                  <div className="text-2xl font-bold text-emerald-300">{info?.confidenceThresholds?.hard || 20}%</div>
                  <div className="text-xs text-slate-500">Hard accept (direct match)</div>
                </div>
                <div className="p-3 rounded bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-500">Soft accept {'≥'}</div>
                  <div className="text-2xl font-bold text-amber-300">{info?.confidenceThresholds?.soft || 14}%</div>
                  <div className="text-xs text-slate-500">But only if {'>'} 1.4× runner-up class</div>
                </div>
                <div className="p-3 rounded bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-500">Margin ratio</div>
                  <div className="text-2xl font-bold text-sky-300">{info?.confidenceThresholds?.marginRatio || 1.4}×</div>
                  <div className="text-xs text-slate-500">Top-1 must beat Top-2</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Also performs Laplacian edge-variance surface complexity check to reject plain walls, ceilings, and blank surfaces as <code className="text-rose-300">non_monument</code>.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                ['Stage 2', 'Multimodal VL LLM', 'Local vision-capable model on :1234 port. Injects base64 image + historian system prompt.', 'from-pink-500/10', 'border-pink-500/20', 'text-pink-200'],
                ['Stage 3', 'Catalog Label Matching', 'Cross-references 18 curated monuments with distinctive vision labels. Generic arch terms count less.', 'from-indigo-500/10', 'border-indigo-500/20', 'text-indigo-200'],
                ['Stage 4', 'GPS Geofence Fallback', 'Haversine distance <15km to any catalog monument. Scales inversely with proximity.', 'from-teal-500/10', 'border-teal-500/20', 'text-teal-200'],
              ].map(([stg, title, desc, bg, bd, tc], i) => (
                <div key={i} className={`p-4 rounded-lg bg-gradient-to-br ${bg} border ${bd}`}>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${tc}`}>{stg}</div>
                  <div className="mt-1 font-semibold text-slate-100">{title}</div>
                  <div className="mt-1 text-xs text-slate-400 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'catalog' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Monument Name</th>
                  <th className="py-2 px-3">Place ID</th>
                  <th className="py-2 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {catalog.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-950/40">
                    <td className="py-2 px-3 font-mono text-xs text-slate-400">{c.id}</td>
                    <td className="py-2 px-3 font-medium text-slate-100">{c.name}</td>
                    <td className="py-2 px-3 font-mono text-xs text-brand-300">{c.placeId}</td>
                    <td className="py-2 px-3 text-xs text-slate-400 max-w-md">{c.description}</td>
                  </tr>
                ))}
                {catalog.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      Start the backend server to load the vision catalog.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
