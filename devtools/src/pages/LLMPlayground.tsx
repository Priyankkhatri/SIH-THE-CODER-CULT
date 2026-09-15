import { useMemo, useState } from 'react';

type Mode = 'short' | 'detailed' | 'child' | 'narrative';
type Lang = 'en' | 'hi' | 'gu';
type Tier = 'local' | 'openai' | 'static';

interface TierResult {
  ok: boolean;
  latencyMs?: number;
  model?: string;
  answer?: string;
  tokens?: any;
  error?: string;
}

const PRESETS = [
  'Tell me about Rani ki Vav in Patan',
  'Why is Modhera Sun Temple astronomically significant?',
  'Explain the architecture of Laxmi Vilas Palace, Vadodara',
  'History of Somnath Temple and its rebuilding',
  'Who built Champaner and what makes it unique?',
  'Story of the Statue of Unity in 1 minute',
];

export default function LLMPlayground() {
  const [question, setQuestion] = useState(PRESETS[0]);
  const [mode, setMode] = useState<Mode>('short');
  const [language, setLanguage] = useState<Lang>('en');
  const [placeId, setPlaceId] = useState('');
  const [temperature, setTemperature] = useState(0.5);
  const [maxTokens, setMaxTokens] = useState(400);
  const [forceTiers, setForceTiers] = useState<Tier[]>(['local', 'openai', 'static']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ tiers: Record<Tier, TierResult>; systemPrompt: string; userPrompt: string } | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [showPrompt, setShowPrompt] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await fetch('/devtools/ai/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, mode, language, placeId: placeId || undefined, forceTier: forceTiers.length === 1 ? forceTiers[0] : undefined, temperature, maxTokens }),
      });
      const data = await r.json();
      if (data.success) setResult(data.data);
    } finally {
      setLoading(false);
    }
  };

  const previewPrompt = async () => {
    const r = await fetch(`/devtools/ai/prompt-preview?mode=${mode}&language=${language}`);
    const d = await r.json();
    if (d.success) {
      setSystemPrompt(d.data.systemPrompt);
      setShowPrompt(true);
    }
  };

  const toggleTier = (t: Tier) => {
    setForceTiers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const statusBadge = (ok: boolean, error?: string) =>
    ok ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium">
        ✅ Success
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 text-xs font-medium" title={error}>
        ❌ {error?.slice(0, 40) || 'Failed'}
      </span>
    );

  const tierCards = useMemo(() => {
    if (!result) return [];
    return (['local', 'openai', 'static'] as Tier[]).filter((t) => result.tiers[t]).map((t) => ({ t, r: result.tiers[t] as TierResult }));
  }, [result]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">🧠 LLM Playground</h1>
          <p className="text-sm text-slate-400 mt-1">
            Test the 3-tier fallback chain (Local Llama → GPT-4o-mini → Static RAG) side-by-side
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={previewPrompt} className="px-3 py-2 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            📄 View System Prompt
          </button>
          <button
            onClick={run}
            disabled={loading || !question || forceTiers.length === 0}
            className="px-4 py-2 rounded-lg text-sm bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold shadow-lg shadow-brand-500/20"
          >
            {loading ? '⏳ Running…' : '🚀 Run Benchmark'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h2 className="font-semibold text-slate-100">Input</h2>
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-500">Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm p-3 focus:border-brand-500 focus:outline-none resize-y"
                placeholder="Ask about a monument…"
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Quick Presets</div>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setQuestion(p)}
                    className={`text-xs px-2 py-1 rounded-md border ${
                      question === p ? 'border-brand-500 bg-brand-500/10 text-brand-200' : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600'
                    }`}
                  >{p.split(' ').slice(0, 5).join(' ')}…</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-500">Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}
                  className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm p-2">
                  <option value="short">⚡ Short</option>
                  <option value="detailed">📖 Detailed</option>
                  <option value="child">🧒 Child</option>
                  <option value="narrative">📜 Narrative</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-500">Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value as Lang)}
                  className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm p-2">
                  <option value="en">🇬🇧 English</option>
                  <option value="hi">🇮🇳 हिन्दी</option>
                  <option value="gu">🇮🇳 ગુજરાતી</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-500">
                Place ID (optional)
              </label>
              <input
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                placeholder="e.g. IND-HER-11 or p1-laxmi-vilas"
                className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm p-2 font-mono"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-500">
                Temperature: {temperature.toFixed(2)}
              </label>
              <input type="range" min={0} max={1} step={0.05} value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-brand-500" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-500">
                Max tokens: {maxTokens}
              </label>
              <input type="range" min={100} max={1200} step={50} value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full accent-brand-500" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="font-semibold text-slate-100 mb-3">Tiers to Run</h3>
            <div className="space-y-2">
              {[
                ['local', 'T1 · Local Llama 3.2 (LM Studio :1234)', '25s timeout'],
                ['openai', 'T2 · OpenAI GPT-4o-mini', '8s timeout'],
                ['static', 'T3 · Static RAG Catalog (offline fallback)', '~20ms'],
              ].map(([t, label, sub]) => (
                <label key={t} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  forceTiers.includes(t as Tier)
                    ? 'border-brand-500/50 bg-brand-500/5'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                }`}>
                  <input
                    type="checkbox"
                    checked={forceTiers.includes(t as Tier)}
                    onChange={() => toggleTier(t as Tier)}
                    className="mt-1 accent-brand-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-100">{label}</div>
                    <div className="text-xs text-slate-500">{sub}</div>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              If exactly 1 tier is selected, it runs in isolation (force-tier mode). Otherwise the full chain.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {showPrompt && systemPrompt && (
            <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-brand-200">📄 System Prompt ({mode} · {language})</h3>
                <button onClick={() => setShowPrompt(false)} className="text-xs text-slate-400 hover:text-slate-200">Close</button>
              </div>
              <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono bg-slate-950/50 p-3 rounded-lg max-h-80 overflow-y-auto border border-slate-800">{systemPrompt}</pre>
            </div>
          )}

          {!result && !loading && (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-12 text-center">
              <div className="text-5xl mb-4">🧠⚡</div>
              <h3 className="text-lg font-semibold text-slate-200">Ready to test</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Configure the prompt, mode, and tiers on the left, then click <strong>Run Benchmark</strong> to see the 3-tier LLM chain run side-by-side.
              </p>
            </div>
          )}

          {loading && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center">
              <div className="text-4xl mb-4 animate-pulse">⚙️</div>
              <p className="text-slate-300">Running benchmarks across {forceTiers.length} tier(s)…</p>
              <p className="text-xs text-slate-500 mt-1">This can take up to 30 seconds for the Local Llama tier.</p>
            </div>
          )}

          {tierCards.length > 0 && (
            <div className="space-y-4">
              {result?.systemPrompt && (
                <details className="rounded-xl border border-slate-800 bg-slate-900/60">
                  <summary className="p-3 cursor-pointer text-sm text-slate-300 hover:text-slate-100 list-none">
                    🔎 Inspect rendered prompt
                  </summary>
                  <pre className="px-4 pb-4 text-xs font-mono text-slate-400 whitespace-pre-wrap">{result.systemPrompt}</pre>
                </details>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {tierCards.map(({ t, r }) => (
                  <div key={t} className={`rounded-xl border p-5 flex flex-col ${
                    r.ok ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-500">Tier</div>
                        <div className="text-lg font-bold text-slate-50">
                          {t === 'local' ? '🖥️ Local Llama' : t === 'openai' ? '☁️ GPT-4o-mini' : '📚 Static RAG'}
                        </div>
                      </div>
                      {statusBadge(r.ok, r.error)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="p-2 bg-slate-950/60 rounded">
                        <div className="text-slate-500">Latency</div>
                        <div className="font-mono font-bold text-slate-200">{r.latencyMs ?? '—'}ms</div>
                      </div>
                      <div className="p-2 bg-slate-950/60 rounded">
                        <div className="text-slate-500">Model</div>
                        <div className="font-mono text-slate-200 truncate" title={r.model}>{r.model || '—'}</div>
                      </div>
                    </div>
                    <div className="flex-1 p-3 bg-slate-950/60 rounded-lg overflow-y-auto max-h-96 border border-slate-800">
                      {r.answer ? (
                        <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{r.answer}</div>
                      ) : (
                        <div className="text-sm text-rose-400">{r.error || 'No response'}</div>
                      )}
                    </div>
                    {r.tokens && (
                      <div className="mt-3 text-[10px] font-mono text-slate-500">
                        🔢 Tokens: prompt={r.tokens.prompt_tokens || '?'} · completion={r.tokens.completion_tokens || '?'} · total={r.tokens.total_tokens || '?'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
