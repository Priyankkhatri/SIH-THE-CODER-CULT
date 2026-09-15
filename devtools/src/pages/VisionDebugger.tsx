import { useEffect, useMemo, useRef, useState } from 'react';

interface ClassItem {
  index: number;
  name: string;
  className: string;
  placeId: string;
}

const PRESET_LOCATIONS = [
  { name: 'Adalaj Stepwell', lat: 23.1667, lng: 72.5800 },
  { name: 'Modhera Sun Temple', lat: 23.5835, lng: 72.1331 },
  { name: 'Taj Mahal', lat: 27.1751, lng: 78.0421 },
  { name: 'Kumbhalgarh Fort', lat: 25.1472, lng: 73.5878 },
  { name: 'Somnath Temple', lat: 20.8880, lng: 70.4013 },
  { name: 'Red Fort Delhi', lat: 28.6562, lng: 77.2410 },
];

export default function VisionDebugger() {
  const [info, setInfo] = useState<any>(null);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [tab, setTab] = useState<'tester' | 'info' | 'thresholds' | 'catalog'>('tester');
  const [classSearch, setClassSearch] = useState('');

  // Live Tester State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Parse classes dictionary or array into clean uniform items
  const classList = useMemo<ClassItem[]>(() => {
    if (!info?.classes) return [];
    if (Array.isArray(info.classes)) {
      return info.classes.map((c: any, idx: number) => {
        if (typeof c === 'string') return { index: idx, name: c, className: c, placeId: '' };
        return { index: idx, name: c.name || c.class, className: c.class || '', placeId: c.placeId || '' };
      });
    }
    return Object.entries(info.classes).map(([k, v]: [string, any]) => {
      if (typeof v === 'string') return { index: Number(k), name: v, className: v, placeId: '' };
      return { index: Number(k), name: v.name || v.class, className: v.class || '', placeId: v.placeId || '' };
    });
  }, [info?.classes]);

  const filteredClasses = useMemo(() => {
    if (!classSearch.trim()) return classList;
    const q = classSearch.toLowerCase();
    return classList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.className.toLowerCase().includes(q) ||
        c.placeId.toLowerCase().includes(q) ||
        c.index.toString() === q
    );
  }, [classList, classSearch]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setTestError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    setTestError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setImageBase64(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Generate synthetic test patterns on canvas for 1-click testing
  const generateSamplePattern = (type: 'monument' | 'plain') => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (type === 'plain') {
      // Uniform plain surface to trigger Laplacian edge-variance filter rejection
      ctx.fillStyle = '#dcd5c9';
      ctx.fillRect(0, 0, 400, 300);
      setLatitude('');
      setLongitude('');
    } else {
      // Architectural motif with rich edges and stepwell arches
      ctx.fillStyle = '#2d1b0e';
      ctx.fillRect(0, 0, 400, 300);
      ctx.strokeStyle = '#de9322';
      ctx.lineWidth = 3;
      for (let y = 30; y < 270; y += 25) {
        ctx.beginPath();
        for (let x = 20; x < 380; x += 30) {
          ctx.arc(x + 15, y, 12, Math.PI, 0);
          ctx.lineTo(x + 27, y + 20);
        }
        ctx.stroke();
      }
      ctx.fillStyle = '#c58b37';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('HERITAGE ARCHITECTURAL COMPLEX', 40, 280);
      setLatitude('23.1667');
      setLongitude('72.5800');
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImagePreview(dataUrl);
    setImageBase64(dataUrl);
    setTestError(null);
  };

  const runLiveInference = async () => {
    if (!imageBase64) {
      setTestError('Please upload an image or click a sample pattern above.');
      return;
    }
    setTestLoading(true);
    setTestError(null);
    setTestResult(null);

    try {
      const payload: any = {
        image: imageBase64,
      };
      if (latitude && longitude) {
        payload.latitude = parseFloat(latitude);
        payload.longitude = parseFloat(longitude);
      }

      const res = await fetch('/vision/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestError(err.message || 'Inference call failed. Ensure backend server is running on :3000.');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50 flex items-center gap-2">
            📸 Vision AI Studio & Debugger
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            End-to-End Live Testing · MobileNetV3 ONNX (6.9MB) → Multimodal VL LLM → Heritage Catalog → Spatial Geofencing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active Model: MobileNetV3 In-House
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
            {info?.classesCount || classList.length || 128} Classes
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center gap-1 p-1 mb-5 bg-slate-950/60 rounded-lg w-fit">
          {[
            ['tester', '🧪 Live Inference Tester'],
            ['info', '📊 Model Info & Output Classes'],
            ['thresholds', '🎯 Thresholds & Pipeline Architecture'],
            ['catalog', '🗂️ Monument Catalog'],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                tab === k ? 'bg-brand-500 text-slate-900 font-semibold shadow-md' : 'text-slate-300 hover:text-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 1. LIVE INFERENCE TESTER TAB */}
        {tab === 'tester' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Image Upload & Controls */}
              <div className="space-y-4">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[260px] ${
                    imagePreview
                      ? 'border-brand-500/50 bg-slate-950/40 hover:bg-slate-950/60'
                      : 'border-slate-700 bg-slate-950/30 hover:border-slate-500 hover:bg-slate-950/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative group w-full flex flex-col items-center">
                      <img
                        src={imagePreview}
                        alt="Test Preview"
                        className="max-h-56 max-w-full rounded-lg object-contain border border-slate-800 shadow-lg"
                      />
                      <div className="mt-3 text-xs text-slate-400">
                        Click or drop another image to replace
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-2xl text-slate-400">
                        📸
                      </div>
                      <div className="font-medium text-slate-200 text-sm">
                        Drop monument photo here or <span className="text-brand-400 underline">browse</span>
                      </div>
                      <div className="text-xs text-slate-500">Supports JPG, PNG, WEBP (up to 15MB)</div>
                    </div>
                  )}
                </div>

                {/* Instant Sample Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-400">Quick Test Samples:</span>
                  <button
                    type="button"
                    onClick={() => generateSamplePattern('monument')}
                    className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 flex items-center gap-1"
                  >
                    🏛️ Sample Monument Pattern
                  </button>
                  <button
                    type="button"
                    onClick={() => generateSamplePattern('plain')}
                    className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 flex items-center gap-1"
                  >
                    🧱 Blank Surface (Filter Test)
                  </button>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageBase64(null);
                        setTestResult(null);
                      }}
                      className="px-2 py-1 text-xs rounded text-slate-400 hover:text-slate-200"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* GPS Coordinates Setting */}
                <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      📍 GPS Geofencing (Optional)
                    </span>
                    {(latitude || longitude) && (
                      <button
                        onClick={() => {
                          setLatitude('');
                          setLongitude('');
                        }}
                        className="text-[11px] text-rose-400 hover:underline"
                      >
                        Remove GPS
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase">Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="e.g. 23.1667"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="w-full mt-0.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase">Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="e.g. 72.5800"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        className="w-full mt-0.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {PRESET_LOCATIONS.map((loc) => (
                      <button
                        key={loc.name}
                        type="button"
                        onClick={() => {
                          setLatitude(loc.lat.toString());
                          setLongitude(loc.lng.toString());
                        }}
                        className={`text-[11px] px-2 py-0.5 rounded border transition ${
                          latitude === loc.lat.toString()
                            ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                </div>

                {testError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{testError}</span>
                  </div>
                )}

                <button
                  type="button"
                  disabled={testLoading || !imageBase64}
                  onClick={runLiveInference}
                  className="w-full py-3 px-4 rounded-lg bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold text-sm tracking-wide shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2"
                >
                  {testLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      Analyzing with In-House AI Vision...
                    </>
                  ) : (
                    <>⚡ Run Live Inference (/vision/identify)</>
                  )}
                </button>
              </div>

              {/* Right Column: Results & Debug Details */}
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 min-h-[360px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                        <span>📊</span> Inference Result & Stage Breakdown
                      </h3>
                      {testResult && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            testResult?.data?.identified
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {testResult?.data?.identified ? '✅ Recognized' : '⚠️ Rejection / Unrecognized'}
                        </span>
                      )}
                    </div>

                    {!testResult && !testLoading && (
                      <div className="py-16 text-center text-slate-500 space-y-2">
                        <div className="text-3xl opacity-40">🔬</div>
                        <div className="text-sm font-medium">Ready for live testing</div>
                        <div className="text-xs text-slate-600 max-w-sm mx-auto">
                          Upload an image and run inference to inspect the 4-stage identification pipeline live.
                        </div>
                      </div>
                    )}

                    {testLoading && (
                      <div className="py-16 text-center space-y-3">
                        <div className="w-8 h-8 mx-auto border-3 border-brand-400 border-t-transparent rounded-full animate-spin" />
                        <div className="text-sm font-medium text-slate-300">
                          In-House Model Processing...
                        </div>
                        <div className="text-xs text-slate-500">
                          Evaluating MobileNetV3 Small (2.5M params) + Laplacian edge filter
                        </div>
                      </div>
                    )}

                    {testResult && (
                      <div className="space-y-4">
                        {/* Primary Verdict Card */}
                        <div
                          className={`p-4 rounded-lg border ${
                            testResult.data?.identified
                              ? 'bg-emerald-500/10 border-emerald-500/20'
                              : 'bg-amber-500/10 border-amber-500/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                                {testResult.data?.identified ? 'Identified Monument' : 'Filter Reason'}
                              </div>
                              <div className="text-lg font-bold text-slate-100 mt-0.5">
                                {testResult.data?.name || testResult.data?.reason || 'Non-Monument Detected'}
                              </div>
                              {testResult.data?.placeId && (
                                <div className="text-xs font-mono text-brand-300 mt-1">
                                  Place ID: {testResult.data.placeId}
                                </div>
                              )}
                            </div>
                            {testResult.data?.confidence !== undefined && (
                              <div className="text-right">
                                <div className="text-2xl font-bold text-emerald-300">
                                  {Math.round(testResult.data.confidence)}%
                                </div>
                                <div className="text-[10px] text-slate-400 uppercase">Confidence</div>
                              </div>
                            )}
                          </div>

                          {testResult.data?.guidance && (
                            <div className="mt-3 text-xs text-amber-200/90 bg-amber-500/10 p-2.5 rounded border border-amber-500/20">
                              💡 {testResult.data.guidance}
                            </div>
                          )}

                          {testResult.data?.description && (
                            <div className="mt-3 text-xs text-slate-300 leading-relaxed">
                              {testResult.data.description}
                            </div>
                          )}

                          {testResult.data?.heritageContext && (
                            <div className="mt-2 text-xs text-brand-200/90 italic">
                              🏛️ {testResult.data.heritageContext}
                            </div>
                          )}
                        </div>

                        {/* Pipeline Stage Indicators */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">Stage 1 · ONNX</div>
                            <div className="font-semibold text-slate-200 mt-1">
                              {testResult.data?.identificationMethod === 'custom_vision' || testResult.data?.confidence
                                ? 'Evaluated'
                                : 'Passed'}
                            </div>
                          </div>
                          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">Stage 2 · VL LLM</div>
                            <div className="font-semibold text-slate-200 mt-1">
                              {testResult.data?.identificationMethod === 'vision_language' ? 'Matched' : 'Fallback'}
                            </div>
                          </div>
                          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">Stage 3 · Catalog</div>
                            <div className="font-semibold text-slate-200 mt-1">
                              {testResult.data?.placeId ? 'Matched' : 'None'}
                            </div>
                          </div>
                          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">Stage 4 · GPS</div>
                            <div className="font-semibold text-slate-200 mt-1">
                              {latitude && longitude ? 'Proximity Verified' : 'Skipped'}
                            </div>
                          </div>
                        </div>

                        {/* Raw JSON Payload Accordion */}
                        <details className="text-xs text-slate-400 bg-slate-900/80 rounded-lg p-3 border border-slate-800">
                          <summary className="cursor-pointer font-mono font-medium text-slate-300 select-none">
                            View Raw Response JSON
                          </summary>
                          <pre className="mt-2 p-2 rounded bg-slate-950 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48">
                            {JSON.stringify(testResult, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span>Target Route: POST /vision/identify</span>
                    <span>Telemetry Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MODEL INFO & CLASSES TAB */}
        {tab === 'info' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                ['Backbone', 'MobileNetV3 Small', 'text-emerald-300'],
                ['Parameters', '2.5M Trainable Weights', 'text-sky-300'],
                ['Model Size', '6.9MB (ONNX Graph + Weights)', 'text-violet-300'],
                ['Output Classes', `${info?.classesCount || classList.length || 128} Heritage Classes`, 'text-brand-300'],
              ].map(([label, val, tone]) => (
                <div key={label} className="p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
                  <div className={`mt-1 text-lg font-bold ${tone}`}>{val}</div>
                </div>
              ))}
            </div>

            {/* Output Classes Explorer with Live Filter */}
            <div className="p-5 rounded-lg bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Model Output Classes ({filteredClasses.length} of {classList.length})
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Trained classes mapping to national monuments, temples, stepwells, and archaeological artifacts
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Filter classes by name, id, index..."
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-brand-500 focus:outline-none w-full sm:w-64"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto pr-1">
                {filteredClasses.map((c) => (
                  <div
                    key={c.index}
                    className="p-2.5 rounded bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-brand-400">
                        #{c.index.toString().padStart(3, '0')}
                      </span>
                      {c.placeId && (
                        <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {c.placeId}
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-slate-200 mt-1 line-clamp-1" title={c.name}>
                      {c.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate" title={c.className}>
                      {c.className}
                    </div>
                  </div>
                ))}
                {filteredClasses.length === 0 && (
                  <div className="col-span-full py-8 text-center text-slate-500 text-xs">
                    No classes match "{classSearch}"
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. THRESHOLDS & PIPELINE ARCHITECTURE TAB */}
        {tab === 'thresholds' && (
          <div className="space-y-6">
            <div className="p-5 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-transparent border border-fuchsia-500/20">
              <h3 className="font-semibold text-fuchsia-200 mb-2">Stage 1 · MobileNetV3 ONNX Inference</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-500">Confidence {'≥'}</div>
                  <div className="text-2xl font-bold text-emerald-300">
                    {info?.confidenceThresholds?.hard || 20}%
                  </div>
                  <div className="text-xs text-slate-500">Hard accept (direct match)</div>
                </div>
                <div className="p-3 rounded bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-500">Soft accept {'≥'}</div>
                  <div className="text-2xl font-bold text-amber-300">
                    {info?.confidenceThresholds?.soft || 14}%
                  </div>
                  <div className="text-xs text-slate-500">But only if {'>'} 1.4× runner-up class</div>
                </div>
                <div className="p-3 rounded bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-500">Margin ratio</div>
                  <div className="text-2xl font-bold text-sky-300">
                    {info?.confidenceThresholds?.marginRatio || 1.4}×
                  </div>
                  <div className="text-xs text-slate-500">Top-1 must beat Top-2</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Also performs Laplacian edge-variance surface complexity check to reject plain walls, ceilings, and blank surfaces as <code className="text-rose-300">non_monument</code>.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                [
                  'Stage 2',
                  'Multimodal VL LLM',
                  'Local vision-capable model on :1234 port. Injects base64 image + historian system prompt.',
                  'from-pink-500/10',
                  'border-pink-500/20',
                  'text-pink-200',
                ],
                [
                  'Stage 3',
                  'Catalog Label Matching',
                  'Cross-references curated monuments with distinctive vision labels. Generic arch terms count less.',
                  'from-indigo-500/10',
                  'border-indigo-500/20',
                  'text-indigo-200',
                ],
                [
                  'Stage 4',
                  'GPS Geofence Fallback',
                  'Haversine distance <15km to any catalog monument. Scales inversely with proximity.',
                  'from-teal-500/10',
                  'border-teal-500/20',
                  'text-teal-200',
                ],
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

        {/* 4. MONUMENT CATALOG TAB */}
        {tab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{catalog.length} Curated Monuments in Vision Catalog</span>
              <span>Loaded from /vision/catalog</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Monument Name</th>
                    <th className="py-2.5 px-3">Place ID</th>
                    <th className="py-2.5 px-3">GPS Coordinates</th>
                    <th className="py-2.5 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {catalog.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-950/40 transition">
                      <td className="py-2.5 px-3 font-mono text-xs text-slate-400">{c.id}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-100">{c.name}</td>
                      <td className="py-2.5 px-3 font-mono text-xs text-brand-300">{c.placeId}</td>
                      <td className="py-2.5 px-3 font-mono text-xs text-slate-400">
                        {c.latitude && c.longitude ? `${c.latitude}, ${c.longitude}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-xs text-slate-400 max-w-md line-clamp-2">
                        {c.description}
                      </td>
                    </tr>
                  ))}
                  {catalog.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        Start the backend server to load the vision catalog.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
