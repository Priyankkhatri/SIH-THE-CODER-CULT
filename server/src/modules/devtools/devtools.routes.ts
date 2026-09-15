import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { config } from '../../config';
import { getSystemPrompt } from '../ai/ai.prompts';
import { checkAllServicesHealth } from './healthService';
import { broadcast } from './wsBroadcast';

const rootDir = path.resolve(__dirname, '..', '..', '..', '..');

const router = Router();

router.get('/services', async (_req, res) => {
  const snapshot = await checkAllServicesHealth();
  res.json({ success: true, data: snapshot });
});

router.get('/prompts', (_req, res) => {
  const modes: Array<'short' | 'detailed' | 'child' | 'narrative'> = ['short', 'detailed', 'child', 'narrative'];
  const langs: Array<'en' | 'hi' | 'gu'> = ['en', 'hi', 'gu'];
  const output: Record<string, Record<string, string>> = {};
  for (const m of modes) {
    output[m] = {};
    for (const l of langs) {
      output[m][l] = getSystemPrompt(m, l);
    }
  }
  res.json({ success: true, data: output });
});

interface PlaygroundBody {
  question: string;
  placeId?: string;
  mode: 'short' | 'detailed' | 'child' | 'narrative';
  language: 'en' | 'hi' | 'gu';
  forceTier?: 'local' | 'openai' | 'static';
  temperature?: number;
  maxTokens?: number;
}

router.post('/ai/playground', async (req: Request, res: Response) => {
  try {
    const body = req.body as PlaygroundBody;
    const { question, placeId, mode, language, forceTier, temperature, maxTokens } = body;

    if (!question) {
      return res.status(400).json({ success: false, error: 'question required' });
    }

    const systemPrompt = getSystemPrompt(mode || 'short', language || 'en');
    const userPrompt = placeId
      ? `Context place ID: ${placeId}\n\nQuestion: ${question}`
      : `Question: ${question}`;

    const results: Record<string, any> = {};
    const tiers: Array<'local' | 'openai' | 'static'> = forceTier
      ? [forceTier]
      : ['local', 'openai', 'static'];

    for (const tier of tiers) {
      const t0 = performance.now();
      try {
        if (tier === 'local') {
          let modelName = 'local-model';
          try {
            const mr = await axios.get('http://127.0.0.1:1234/v1/models', { timeout: 1500 });
            const list = mr.data?.data || [];
            const found = list.find((m: any) =>
              m.id?.toLowerCase().includes('llama') || m.id?.toLowerCase().includes('instruct')
            );
            modelName = (found || list[0])?.id || 'local-model';
          } catch (_) {}

          const r = await axios.post(
            'http://127.0.0.1:1234/v1/chat/completions',
            {
              model: modelName,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
              temperature: temperature ?? 0.5,
              max_tokens: maxTokens ?? 350,
            },
            { timeout: 25000 }
          );
          let content = r.data?.choices?.[0]?.message?.content || '';
          content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
          results.local = {
            ok: true,
            latencyMs: Math.round(performance.now() - t0),
            model: modelName,
            answer: content,
            tokens: r.data?.usage,
          };
        } else if (tier === 'openai') {
          if (!config.openaiApiKey || config.openaiApiKey.includes('your-openai')) {
            results.openai = { ok: false, latencyMs: Math.round(performance.now() - t0), error: 'No API key' };
            continue;
          }
          const openai = new OpenAI({ apiKey: config.openaiApiKey });
          const completion = await Promise.race([
            openai.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
              temperature: temperature ?? 0.7,
              max_tokens: maxTokens ?? 500,
            }),
            new Promise<never>((_, rej) =>
              setTimeout(() => rej(new Error('OpenAI timeout')), 12000)
            ),
          ] as any);
          const content = (completion as any).choices?.[0]?.message?.content || '';
          results.openai = {
            ok: true,
            latencyMs: Math.round(performance.now() - t0),
            model: 'gpt-4o-mini',
            answer: content.trim(),
            tokens: (completion as any).usage,
          };
        } else {
          const aiModule = await import('../ai/ai.service');
          const fallback = (aiModule.aiService as any).fallbackResponse || null;
          let staticAnswer = '';
          if (fallback) {
            const ctx = await (aiModule.aiService as any).retrieveContext(question, placeId);
            const out = fallback(ctx, question, mode || 'short', language || 'en');
            staticAnswer = out.answer;
          }
          results.static = {
            ok: true,
            latencyMs: Math.round(performance.now() - t0),
            model: 'static_rag',
            answer: staticAnswer,
          };
        }
      } catch (err: any) {
        results[tier] = {
          ok: false,
          latencyMs: Math.round(performance.now() - t0),
          error: err?.message || 'Failed',
        };
      }
    }

    res.json({ success: true, data: { tiers: results, systemPrompt, userPrompt } });
    broadcast({ type: 'benchmark_update', payload: { completed: tiers.length, total: tiers.length, passRate: tiers.filter(t => results[t]?.ok).length / tiers.length } });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get('/ai/prompt-preview', (req, res) => {
  const mode = (req.query.mode as any) || 'short';
  const language = (req.query.language as any) || 'en';
  const systemPrompt = getSystemPrompt(mode, language);
  res.json({ success: true, data: { mode, language, systemPrompt } });
});

router.get('/vision/catalog', (_req, res) => {
  try {
    const classesPath = path.join(rootDir, 'ml', 'weights', 'classes.json');
    const classes = fs.existsSync(classesPath)
      ? JSON.parse(fs.readFileSync(classesPath, 'utf8'))
      : {};
    const classesCount = Array.isArray(classes) ? classes.length : Object.keys(classes).length;
    res.json({
      success: true,
      data: {
        catalogSize: 18,
        classesCount,
        classes,
        confidenceThresholds: {
          hard: 20,
          soft: 14,
          marginRatio: 1.4,
        },
      },
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get('/datasets/summary', (_req, res) => {
  try {
    const datasetsDir = path.join(rootDir, 'datasets', 'dataset');
    const files = [
      'national_heritage_lakhs_census.csv',
      'asi_national_heritage_registry_3696.csv',
      'gujarat_heritage_atlas_exhaustive.csv',
      'indian_heritage_dataset.csv',
      'dataset_master_matrix.csv',
      'monuments_50_master_matrix.csv',
    ];
    const summary: Record<string, any> = {};
    for (const f of files) {
      const fp = path.join(datasetsDir, f);
      if (fs.existsSync(fp)) {
        const stat = fs.statSync(fp);
        let count = 0;
        try {
          const txt = fs.readFileSync(fp, 'utf8');
          count = Math.max(0, txt.split('\n').length - 1);
        } catch (_) {}
        summary[f] = {
          sizeKb: Math.round(stat.size / 1024),
          rows: count,
          tier: f.includes('census') ? 'T1_National' :
                f.includes('3696') ? 'T2_ASI' :
                f.includes('gujarat') ? 'T3_State' :
                f.includes('master') || f.includes('monuments_50') ? 'T4_Curated' : 'Unknown',
        };
      }
    }
    const seedPath = path.resolve(__dirname, '..', '..', 'seed', 'master_unified_places.json');
    if (fs.existsSync(seedPath)) {
      const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      summary.master_unified_places = {
        sizeKb: Math.round(fs.statSync(seedPath).size / 1024),
        rows: Array.isArray(data) ? data.length : (data.places?.length ?? 0),
        tier: 'T5_Unified_Seed',
      };
    }
    res.json({ success: true, data: summary });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get('/rag/inspect', async (req, res) => {
  try {
    const question = (req.query.question as string) || 'Rani ki Vav history';
    const placeId = (req.query.placeId as string) || undefined;
    const aiModule = await import('../ai/ai.service');
    const svc = aiModule.aiService as any;
    const ctx = await svc.retrieveContext(question, placeId);

    const scored: Array<{ name: string; score: number }> = [];
    try {
      const tokenize = (txt: string) =>
        txt.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
      const qTokens = new Set(tokenize(question));
      const catalog = (aiModule as any).STATIC_MONUMENTS || {};
      for (const [key, m] of Object.entries(catalog)) {
        let s = 0;
        const name = (m as any).name?.toLowerCase() || key;
        const kTokens = tokenize(key);
        if (question.toLowerCase().includes(key.toLowerCase()) && key.length > 4) s += 200;
        for (const kw of kTokens) if (qTokens.has(kw)) s += 45;
        for (const w of qTokens) if (name.includes(w)) s += 10;
        scored.push({ name: (m as any).name, score: s });
      }
      scored.sort((a, b) => b.score - a.score);
    } catch (_) {}

    res.json({
      success: true,
      data: {
        question,
        placeId,
        placeName: ctx.placeName,
        passageCount: ctx.passages.length,
        passages: ctx.passages.map((p: any, i: number) => ({
          index: i + 1,
          sourceName: p.sourceName,
          preview: p.content.slice(0, 140) + '...',
          length: p.content.length,
        })),
        topCatalogHits: scored.slice(0, 10),
      },
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
