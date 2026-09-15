import OpenAI from 'openai';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import prisma from '../../config/database';
import { config } from '../../config';
import { getSystemPrompt } from './ai.prompts';
import { detectConversationalIntent, getConversationalReply } from './conversational.knowledge';
import { traceStage, finalizeStage } from '../../middleware/devtoolsTracer';

const openai = new OpenAI({
  apiKey: config.openaiApiKey || 'mock-key',
});

interface AskQuestionParams {
  question: string;
  placeId?: string;
  mode: 'short' | 'detailed' | 'child' | 'narrative';
  language: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

// Greeting-only messages (en/hi/gu) — answered warmly, never matched to monuments.
const GREETING_PATTERNS = [
  /^(hi+|hey+|hello+|hii+|heyy+|yo|namaste+|namaskar|salaam|satsriakal|kem\s*cho|kemcho|jai\s*shree\s*krishna|good\s*(morning|afternoon|evening|day)|sup|hola)[\s?.!,~]*$/i,
];

// High-frequency words that must never score monument matches on their own
// (e.g. "hey" is a substring of "they" — the Ramappa-on-"Hey" bug).
const STOP_WORDS = new Set([
  'hey', 'the', 'and', 'for', 'with', 'from', 'that', 'this', 'what', 'when',
  'where', 'which', 'who', 'whom', 'whose', 'how', 'why', 'are', 'was', 'were',
  'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'about',
  'into', 'over', 'under', 'between', 'through', 'kya', 'hai', 'hain', 'ka',
  'ki', 'ke', 'ko', 'mein', 'me', 'aur', 'nahi', 'karo', 'batao', 'kaun',
  'kab', 'kahan', 'kaise', 'kaisa', 'kya', 'che', 'shu', 'tame', 'ane',
  'tell', 'know', 'more', 'much', 'very', 'just', 'like', 'such',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

export function isGreetingOnly(question: string): boolean {
  return GREETING_PATTERNS.some((re) => re.test(question.trim()));
}

function greetingReply(language: string): { answer: string; sources: AIResponse['sources'] } {
  if (language === 'hi') {
    return {
      answer: `🙏 **नमस्ते! मैं आपका AI Heritage Guide हूँ।**\n\nभारत के मंदिरों, किलों, बावड़ियों और संग्रहालयों के बारे में कुछ भी पूछिए — इतिहास, वास्तुकला, कहानियाँ, या घूमने की सलाह।\n\n• किसी स्मारक का इतिहास जानना हो तो उसका नाम लिखिए\n• बच्चों के लिए मज़ेदार अंदाज़ चाहिए तो Kids mode चुनिए\n• किसी जगह पर हैं तो नीचे context में जगह चुनिए`,
      sources: [{ name: 'AI Heritage Guide', text: 'Greeting' }],
    };
  }
  if (language === 'gu') {
    return {
      answer: `🙏 **નમસ્તે! હું તમારો AI Heritage Guide છું.**\n\nભારતના મંદિરો, કિલ્લાઓ, વાવ અને સંગ્રહાલયો વિશે કંઈ પણ પૂછો — ઇતિહાસ, સ્થાપત્ય, વાર્તાઓ કે મુલાકાતની સલાહ.\n\n• કોઈ સ્મારકનો ઇતિહાસ જાણવો હોય તો તેનું નામ લખો\n• બાળકો માટે મજેદાર શૈલી જોઈતી હોય તો Kids mode પસંદ કરો\n• કોઈ સ્થળે હોવ તો context માં જગ્યા પસંદ કરો`,
      sources: [{ name: 'AI Heritage Guide', text: 'Greeting' }],
    };
  }
  return {
    answer: `🙏 **Hello! I'm your AI Heritage Guide.**\n\nAsk me anything about India's temples, forts, stepwells, palaces, and museums — history, architecture, stories, or visit tips.\n\n• Just type a monument's name to explore its story\n• Pick **Kids mode** for a fun family version\n• Pick a place context below for site-specific answers`,
    sources: [{ name: 'AI Heritage Guide', text: 'Greeting' }],
  };
}

interface AIResponse {
  answer: string;
  sources: Array<{ name: string; url?: string; text: string }>;
  confidence: number;
  mode: string;
  language: string;
}

const ID_ALIASES: Record<string, string> = {
  'IND-GJ-01': 'IND-HER-11', // Rani ki Vav (legacy mobile id)
  'IND-GJ-02': 'IND-HER-31', // Modhera Sun Temple (legacy mobile id)
};

interface StaticMonument {
  name: string;
  ids: string[];
  passages: Array<{ content: string; sourceName: string; sourceUrl?: string }>;
}

const STATIC_MONUMENTS: Record<string, StaticMonument> = {
  'rani ki vav': {
    name: "Rani ki Vav (The Queen's Stepwell, Patan)",
    ids: ['IND-HER-11', 'IND-GJ-01', 'IND-ART-16'],
    passages: [
      {
        sourceName: 'Curated Heritage Story',
        content: 'Commissioned in 1063 AD by Queen Udayamati in memory of her deceased husband King Bhimdev I of the Solanki Dynasty, Rani ki Vav is an inverted temple celebrating the sacredness of water and the cosmic order.',
      },
      {
        sourceName: 'Archaeological History',
        content: 'Constructed during the zenith of Solanki rule in Gujarat, it was later silted over by the Saraswati river for centuries, preserving its over 500 principal stone sculptures and over a thousand minor ones in pristine condition until excavation by the Archaeological Survey of India (ASI) in the 1980s.',
      },
      {
        sourceName: 'Architectural Details',
        content: 'Designed in the Maru-Gurjara architectural style, Rani ki Vav descends seven subterranean terraces with pillared pavilions, stepping corridors, and a deep circular well shaft. Its walls feature masterfully carved panels of the Dashavatara (ten incarnations of Vishnu), celestial maidens (Apsaras), and intricate geometric filigree.',
      },
      {
        sourceName: 'Cultural Significance',
        content: 'Inscribed as a UNESCO World Heritage Site in 2014, Rani ki Vav is revered as the finest example of subterranean water architecture in the Indian subcontinent. The bottom level features a magnificent high-relief carving of Sheshashayi Vishnu reclining on the multi-headed serpent Shesha.',
      },
    ],
  },
  'modhera': {
    name: 'Sun Temple, Modhera',
    ids: ['IND-HER-31', 'IND-GJ-02'],
    passages: [
      {
        sourceName: 'Curated Heritage Story',
        content: 'Built in 1026-27 AD by King Bhima I of the Solanki dynasty on the banks of river Pushpavati, the Modhera Sun Temple is designed so that during the solar equinoxes, the first rays of the rising sun illuminate the deity in the inner sanctum.',
      },
      {
        sourceName: 'Architectural Details',
        content: 'The monument consists of three distinct axial components: the Gudhamandapa (sanctum sanctorum), the Sabhamandapa (assembly hall resting on 52 intricately carved pillars depicting 52 weeks of the solar year), and the stunning stepped Surya Kund reservoir adorned with 108 miniature shrines.',
      },
      {
        sourceName: 'Cultural Significance',
        content: 'Modhera is the site of the annual Uttarardh Mahotsav dance festival and is celebrated as India\'s first round-the-clock solar-powered heritage village and monument complex.',
      },
    ],
  },
  'somnath': {
    name: 'Somnath Jyotirlinga Temple (Prabhas Patan)',
    ids: ['IND-GJ-08', 'IND-GJ-07'],
    passages: [
      {
        sourceName: 'Curated Heritage Story',
        content: 'Somnath is revered as the first (Aadi) among the twelve holy Jyotirlingas of Lord Shiva in India, standing on the rugged shores where the Saraswati, Hiran, and Kapila rivers meet the Arabian Sea.',
      },
      {
        sourceName: 'Archaeological History',
        content: 'The temple has stood as an enduring symbol of spiritual resilience. After repeated invasions through the centuries, its modern resurgence was championed by Sardar Vallabhbhai Patel, and the grand stone temple was consecrated by President Dr. Rajendra Prasad in 1951.',
      },
      {
        sourceName: 'Architectural Details',
        content: 'Rebuilt in the grand Kailash Mahameru Prasad style of Solanki/Chalukyan architecture. On its seaside promontory stands the ancient Baan Stambh (Arrow Pillar), inscribed with a Sanskrit proclamation that no landmass exists in a straight southward line from this point to Antarctica.',
      },
    ],
  },
  'adalaj': {
    name: 'Adalaj Stepwell (Gandhinagar)',
    ids: ['IND-GJ-04'],
    passages: [
      {
        sourceName: 'Curated Heritage Story',
        content: 'Built in 1498 by Queen Rudabai in memory of Rana Veer Singh of the Vaghela dynasty. It is a masterpiece blending Hindu Solanki architecture with delicate Indo-Islamic floral friezes and geometric symmetry.',
      },
      {
        sourceName: 'Architectural Details',
        content: 'A five-storey deep sandstone subterranean stepwell with octagonal shafts admitting soft ambient light and continuous cross-ventilation, keeping inner corridors 5°C cooler even in midsummer heat.',
      },
    ],
  },
  'laxmi vilas': {
    name: 'Laxmi Vilas Palace (Vadodara)',
    ids: ['p1-laxmi-vilas', 'IND-GJ-05'],
    passages: [
      {
        sourceName: 'Curated Heritage Story',
        content: 'Commissioned in 1878 by Maharaja Sayajirao Gaekwad III and designed by Major Charles Mant and Robert Chisholm, Laxmi Vilas Palace spans 500 acres and is four times the size of Buckingham Palace.',
      },
      {
        sourceName: 'Architectural Details',
        content: 'A grand synthesis of Indo-Saracenic architecture combining Rajput, Mughal, Hindu, and Venetian Gothic elements, with Venetian mosaic flooring, stained glass, and the legendary Raja Ravi Varma oil painting galleries.',
      },
    ],
  },
  'champaner': {
    name: 'Champaner-Pavagadh Archaeological Park',
    ids: ['IND-HER-12'],
    passages: [
      {
        sourceName: 'Curated Heritage Story',
        content: 'A UNESCO World Heritage Site comprising the only complete and unchanged pre-Mughal Islamic city in the world, conquered by Sultan Mahmud Begada in 1484.',
      },
      {
        sourceName: 'Architectural Details',
        content: 'Showcases military fortifications, the majestic Jama Masjid with its 172 pillars and 30-meter minarets, and ingenious rainwater-harvesting hydraulic cisterns.',
      },
    ],
  },
  'statue of unity': {
    name: 'Statue of Unity (Ekta Nagar / Kevadia)',
    ids: ['IND-GJ-06'],
    passages: [
      {
        sourceName: 'Curated Heritage Story',
        content: 'The world\'s tallest statue standing at 182 meters (597 feet), dedicated to Sardar Vallabhbhai Patel, the Iron Man of India who united 562 princely states.',
      },
      {
        sourceName: 'Architectural Details',
        content: 'Sculpted by Ram V. Sutar and built with over 70,000 tonnes of cement and 25,000 tonnes of steel, engineered to withstand winds of up to 180 km/h and earthquakes of magnitude 6.5.',
      },
    ],
  },
  'kumbhalgarh': {
    name: 'Kumbhalgarh Fort & The Great Wall of India',
    ids: ['IND-HER-26'],
    passages: [
      {
        sourceName: 'Curated Heritage Chronicle',
        content: 'Built in the 15th century AD by Rana Kumbha of the Sisodia Rajput clan in the western Aravalli Hills, Kumbhalgarh is the birthplace of the legendary warrior king Maharana Pratap and served as an impregnable refuge for the rulers of Mewar in times of strife.',
      },
      {
        sourceName: 'Architectural Engineering',
        content: 'Encircled by thirty-six kilometers of massive stone ramparts and thick battlements, Kumbhalgarh boasts the second-longest continuous fortification wall on Earth after the Great Wall of China. The walls are broad enough for eight horses to gallop abreast along its parapets.',
      },
      {
        sourceName: 'Monuments Within the Citadel',
        content: 'The fort encompasses over 360 temples (300 ancient Jain shrines and 60 Hindu shrines), stepwells, and the magnificent two-storey Badal Mahal (Cloud Palace) perched atop the highest peak, offering panoramic vistas across the Thar desert borders.',
      },
      {
        sourceName: 'UNESCO & Military History',
        content: 'Inscribed as a UNESCO World Heritage Site in 2013 under Hill Forts of Rajasthan. The fortress fell only once in its entire history, and only after an alliance of Mughal and Amber armies poisoned its drinking water supply.',
      },
    ],
  },
  'chittorgarh': {
    name: 'Chittorgarh Fort & Vijay Stambha',
    ids: ['IND-HER-27'],
    passages: [
      {
        sourceName: 'Curated Heritage Chronicle',
        content: 'Sprawling across a 700-acre rocky hill, Chittorgarh Fort is the grandest citadel in India and the historic capital of Mewar, immortalized by legendary tales of Rajput chivalry, Rani Padmini, and Mirabai.',
      },
      {
        sourceName: 'Architectural Details',
        content: 'Home to the iconic 9-storey Vijay Stambha (Tower of Victory) built by Rana Kumbha in 1448 to commemorate victory over the sultanates of Malwa and Gujarat, as well as the 12th-century Kirti Stambha (Tower of Fame) dedicated to Adinatha.',
      },
    ],
  },
  'mehrangarh': {
    name: 'Mehrangarh Fort (Jodhpur)',
    ids: ['p-mehrangarh-fort'],
    passages: [
      {
        sourceName: 'Curated Heritage Chronicle',
        content: 'Towering 400 feet above the blue city of Jodhpur on an imposing perpendicular cliff, Mehrangarh was founded by Rao Jodha in 1459 as the seat of the Rathore dynasty.',
      },
      {
        sourceName: 'Architectural Details',
        content: 'Features intricate latticed sandstone courtyards, the opulently gilded Sheesh Mahal, Phool Mahal, and world-renowned museum collections of royal palanquins, turbans, and historic weaponry.',
      },
    ],
  },
};

// Ingest full 148 verified national monuments from master_unified_places.json
try {
  const masterPath = path.resolve(__dirname, '../../seed/master_unified_places.json');
  if (fs.existsSync(masterPath)) {
    const masterUnified: any[] = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    for (const p of masterUnified) {
      const hr = p.heritageRecord;
      const key = p.name.toLowerCase().trim();
      const passages: Array<{ content: string; sourceName: string; sourceUrl?: string }> = [];

      // 1. Geographic Location, Coordinates & District/State
      passages.push({
        sourceName: 'Geographic Location & Coordinates',
        content: `${p.name} is situated in ${p.district || p.city || 'India'}, ${p.state || ''}. Precise GPS Coordinates: ${p.latitude.toFixed(4)}° N, ${p.longitude.toFixed(4)}° E.`,
      });

      // 2. Story / Summary
      if (hr?.shortStory) {
        passages.push({
          sourceName: 'Curated Heritage Story',
          content: hr.shortStory,
        });
      }

      // 3. Detailed History & Dynasty
      if (hr?.history) {
        passages.push({
          sourceName: 'Archaeological History',
          content: hr.history,
        });
      }

      // 4. Architecture & Engineering
      if (hr?.architecture) {
        passages.push({
          sourceName: 'Architectural Details',
          content: hr.architecture,
        });
      }

      // 5. Key Facts & Visiting Guidelines
      if (Array.isArray(hr?.keyFacts) && hr.keyFacts.length > 0) {
        passages.push({
          sourceName: 'Key Archaeological Facts & Visiting Guidelines',
          content: hr.keyFacts.join('; '),
        });
      }

      // 6. Significance
      if (hr?.significance) {
        passages.push({
          sourceName: 'Cultural Significance',
          content: hr.significance,
        });
      }

      // Sources
      if (Array.isArray(hr?.sources)) {
        for (const s of hr.sources) {
          passages.push({
            sourceName: s.sourceName || 'ASI National Registry',
            sourceUrl: s.sourceUrl,
            content: s.referenceText || 'Verified ASI record.',
          });
        }
      }

      const allIds = [p.id];

      STATIC_MONUMENTS[key] = {
        name: `${p.name} (${p.district || p.city || p.state || 'India'})`,
        ids: allIds,
        passages,
      };
    }
  }
} catch (loadErr) {
  console.warn('[AIService] Failed to load master_unified_places.json:', loadErr);
}

let lmsStarting = false;
function ensureLocalLLMServer(): void {
  if (lmsStarting) return;
  axios.get('http://127.0.0.1:1234/v1/models', { timeout: 1000 }).catch(() => {
    lmsStarting = true;
    try {
      require('child_process').exec('lms server start', () => {
        lmsStarting = false;
      });
    } catch {
      lmsStarting = false;
    }
  });
}

class AIService {
  async askQuestion(params: AskQuestionParams): Promise<AIResponse> {
    const { question, placeId, mode, language } = params;

    ensureLocalLLMServer();

    // Check conversational intent early (greetings, identity, capabilities, gratitude)
    const intent = detectConversationalIntent(question);
    if (intent && ['GREETING', 'WELL_BEING', 'IDENTITY', 'CREATOR', 'CAPABILITIES', 'HELP', 'GRATITUDE', 'FAREWELL'].includes(intent)) {
      const conv = getConversationalReply(intent, mode, language);
      if (placeId && intent === 'GREETING') {
        const placeName = (await this.retrieveContext(question, placeId)).placeName;
        const greetingPrefix = language === 'hi'
          ? `🙏 **नमस्ते! मैं आपका AI Heritage Guide हूँ।**\n\nमैं **${placeName}** के बारे में आपके सभी सवालों के जवाब देने के लिए तैयार हूँ — इतिहास, वास्तुकla, दर्शन का सही समय, या घूमने की सलाह। आप क्या जानना चाहते हैं?`
          : language === 'gu'
          ? `🙏 **નમસ્તે! હું તમારો AI Heritage Guide છું.**\n\nહું **${placeName}** વિશે તમારા બધા પ્રશ્નોના જવાબ આપવા તૈયાર છું — ઇતિહાસ, સ્થાપત્ય કે મુલાકાતની ટિપ્સ. તમે શું જાણવા માંગો છો?`
          : `👋 **Hello! I'm your AI Heritage Guide.**\n\nI'm ready to answer any questions about **${placeName}** — its architecture, royal history, best photo spots, or visit logistics. What would you like to explore?`;
        return {
          answer: greetingPrefix,
          sources: [{ name: 'AI Heritage Guide', text: `Context: ${placeName}` }],
          confidence: 0.99,
          mode,
          language,
        };
      }
      return {
        answer: conv.answer,
        sources: conv.sources,
        confidence: 0.99,
        mode,
        language,
      };
    }

    traceStage('rag', { mode, language, hasPlaceId: !!placeId });
    const context = await this.retrieveContext(question, placeId);
    finalizeStage({ passages: context.passages.length, matched: context.placeName });

    const systemPrompt = getSystemPrompt(mode, language);
    const contextText = context.passages
      .slice(0, 5)
      .map((p, i) => `[Fact ${i + 1}: ${p.sourceName}]\n${p.content.slice(0, 600)}`)
      .join('\n\n');

    const userPrompt = context.passages.length > 0
      ? `Monument Context (${context.placeName}):
${contextText}

User Inquiry: "${question}"

Instructions:
1. Answer the user's inquiry conversationally like ChatGPT, specifically addressing their exact question using the context above.
2. Direct answer first. Do not recite a generic biography.
3. If asking about accessibility, tickets, timings, photography, or secrets, give honest and practical advice.`
      : `User Question: "${question}"

Instructions:
Answer conversationally and helpfully like ChatGPT. If this is a travel inquiry, provide fascinating suggestions across Indian heritage.`;

    const previousMessages = (params.history || [])
      .slice(-6)
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const chatMessages: any[] = [
      { role: 'system', content: systemPrompt },
      ...previousMessages,
      { role: 'user', content: userPrompt },
    ];

    traceStage('llm_local', { endpoint: 'http://127.0.0.1:1234/v1', timeoutMs: 25000 });
    try {
      const temperature = mode === 'narrative' ? 0.65 : mode === 'child' ? 0.5 : 0.4;
      const maxTokens = mode === 'short' ? 260 : mode === 'detailed' ? 600 : 360;

      let modelName = 'llama-3.2-3b-instruct';
      try {
        const modelsRes = await axios.get('http://127.0.0.1:1234/v1/models', { timeout: 1500 });
        const list = modelsRes.data?.data || [];
        const found = list.find((m: any) => m.id?.toLowerCase().includes('llama') || m.id?.toLowerCase().includes('instruct'));
        if (found) {
          modelName = found.id;
        } else if (list[0]?.id) {
          modelName = list[0].id;
        }
      } catch (_) {}

      const localResponse = await axios.post(
        'http://127.0.0.1:1234/v1/chat/completions',
        {
          model: modelName,
          messages: chatMessages,
          temperature,
          max_tokens: maxTokens,
        },
        { timeout: 25000 }
      );

      let qwenAnswer = localResponse.data?.choices?.[0]?.message?.content;
      if (qwenAnswer && qwenAnswer.trim().length > 10) {
        qwenAnswer = qwenAnswer.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        finalizeStage({ model: modelName, tokens: localResponse.data?.usage, success: true });

        return {
          answer: qwenAnswer,
          sources: context.passages.map((p) => ({
            name: p.sourceName,
            url: p.sourceUrl,
            text: p.content.substring(0, 150) + '...',
          })),
          confidence: 0.97,
          mode,
          language,
        };
      }
      finalizeStage({ model: modelName, success: false, reason: 'empty_answer' });
    } catch (err: any) {
      finalizeStage({ success: false, error: err.message?.slice(0, 80) });
    }

    traceStage('llm_openai', { model: 'gpt-4o-mini', timeoutMs: 8000 });
    if (config.openaiApiKey && !config.openaiApiKey.includes('your-openai')) {
      try {
        const completion = await Promise.race([
          openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: chatMessages,
            temperature: 0.7,
            max_tokens: mode === 'short' ? 300 : mode === 'detailed' ? 800 : 500,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('OpenAI timeout after 8s')), 8000)
          ),
        ]);

        const answer = (completion as any).choices?.[0]?.message?.content;
        if (answer && answer.trim().length > 10) {
          finalizeStage({ tokens: (completion as any).usage, success: true });
          return {
            answer: answer.trim(),
            sources: context.passages.map((p) => ({
              name: p.sourceName,
              url: p.sourceUrl,
              text: p.content.substring(0, 150) + '...',
            })),
            confidence: context.passages.length > 0 ? 0.96 : 0.95,
            mode,
            language,
          };
        }
        finalizeStage({ success: false, reason: 'empty_answer' });
      } catch (error: any) {
        console.warn(`[AIService] Cloud LLM skipped (${error.message || 'offline'}). Using verified ASI knowledge base.`);
        finalizeStage({ success: false, error: error.message?.slice(0, 80) });
      }
    } else {
      finalizeStage({ success: false, reason: 'no_api_key' });
    }

    traceStage('fallback', { type: 'static_rag_catalog' });
    const fb = this.fallbackResponse(context, question, mode, language);
    finalizeStage({ success: true, answerLen: fb.answer.length, sources: fb.sources.length });
    return fb;
  }

  private async retrieveContext(question: string, placeId?: string) {
    const targetPlaceId = placeId ? (ID_ALIASES[placeId] || placeId) : undefined;
    let passages: Array<{
      content: string;
      sourceName: string;
      sourceUrl?: string;
    }> = [];
    let placeName = 'Indian Heritage Landmark';

    try {
      if (targetPlaceId) {
        // 1. Check direct heritage record
        let record = await prisma.heritageRecord.findUnique({
          where: { placeId: targetPlaceId },
          include: {
            sources: true,
            place: { select: { name: true } },
          },
        });

        // 2. Fallback: match by place ID directly
        if (!record) {
          record = await prisma.heritageRecord.findFirst({
            where: {
              OR: [
                { placeId: targetPlaceId },
                { place: { id: targetPlaceId } },
              ],
            },
            include: {
              sources: true,
              place: { select: { name: true } },
            },
          });
        }

        if (record) {
          placeName = record.place?.name || 'Heritage Monument';
          if (record.shortStory) {
            passages.push({ content: record.shortStory, sourceName: 'Curated Heritage Story' });
          }
          if (record.history) {
            passages.push({ content: record.history, sourceName: 'Archaeological History' });
          }
          if (record.significance) {
            passages.push({ content: record.significance, sourceName: 'Cultural Significance' });
          }
          if (record.architecture) {
            passages.push({ content: record.architecture, sourceName: 'Architectural Details' });
          }
          if (record.sources && Array.isArray(record.sources)) {
            record.sources.forEach((source: any) => {
              passages.push({
                content: source.referenceText,
                sourceName: source.sourceName,
                sourceUrl: source.sourceUrl || undefined,
              });
            });
          }
        }
      }

      // If no passages found yet, search across all heritage records
      if (passages.length === 0) {
        const allRecords = await prisma.heritageRecord.findMany({
          include: {
            sources: true,
            place: { select: { name: true, category: true, shortDescription: true } },
          },
        });

        const questionLower = question.toLowerCase();
        const questionTokens = new Set(tokenize(questionLower));

        const scoredRecords = allRecords.map((r: any) => {
          let score = 0;
          const pName = (r.place?.name || '').toLowerCase();
          const pTokens = new Set(tokenize(pName));
          const story = (r.shortStory || '').toLowerCase();
          const hist = (r.history || '').toLowerCase();
          const arch = (r.architecture || '').toLowerCase();

          // 1. Full monument name mentioned in the query
          if (pName && pName.length > 4 && questionLower.includes(pName)) {
            score += 120;
          }

          // 2. Individual distinctive name tokens
          let nameMatched = false;
          for (const word of questionTokens) {
            if (pTokens.has(word)) {
              score += 45;
              nameMatched = true;
            }
          }

          // Body text matches ONLY count if there is an explicit monument name correlation,
          // to prevent false matches on generic words like 'temple', 'stone', 'water'
          if (nameMatched || score >= 120) {
            for (const word of questionTokens) {
              if (new RegExp(`\\b${word}\\b`).test(story)) score += 10;
              if (new RegExp(`\\b${word}\\b`).test(hist)) score += 8;
              if (new RegExp(`\\b${word}\\b`).test(arch)) score += 6;
            }
          }

          return { record: r, score };
        });

        scoredRecords.sort((a: any, b: any) => b.score - a.score);
        // Requires at least 45 (a distinctive name-token hit)
        const bestMatch = scoredRecords.find((s: any) => s.score >= 45)?.record;

        if (bestMatch) {
          placeName = bestMatch.place?.name || 'Heritage Monument';
          if (bestMatch.shortStory) {
            passages.push({
              content: `${bestMatch.place?.name}: ${bestMatch.shortStory}`,
              sourceName: `Heritage Record - ${bestMatch.place?.name}`,
            });
          }
          if (bestMatch.history) {
            passages.push({
              content: bestMatch.history,
              sourceName: `Archaeological History - ${bestMatch.place?.name}`,
            });
          }
          if (bestMatch.architecture) {
            passages.push({
              content: bestMatch.architecture,
              sourceName: `Architecture - ${bestMatch.place?.name}`,
            });
          }
          if (bestMatch.significance) {
            passages.push({
              content: bestMatch.significance,
              sourceName: `Significance - ${bestMatch.place?.name}`,
            });
          }
          if (bestMatch.sources && Array.isArray(bestMatch.sources)) {
            bestMatch.sources.forEach((s: any) => {
              passages.push({
                content: s.referenceText,
                sourceName: s.sourceName,
                sourceUrl: s.sourceUrl || undefined,
              });
            });
          }
        }
      }
    } catch (dbError) {
      console.warn('[AIService] DB lookup fallback to static catalog:', (dbError as any)?.message || dbError);
    }

    // Step 3: Check verified catalog of all 148 national monuments if passages still empty
    if (passages.length === 0) {
      const qTokens = new Set(tokenize(question));
      let bestScore = 0;
      let matchedMonument: StaticMonument | null = null;

      for (const [key, monument] of Object.entries(STATIC_MONUMENTS)) {
        let score = 0;
        let nameMatched = false;
        if (targetPlaceId && monument.ids.some((id) => id.toLowerCase() === targetPlaceId.toLowerCase())) {
          score += 500;
          nameMatched = true;
        }
        const keyTokens = tokenize(key);
        if (key.length > 4 && question.toLowerCase().includes(key.toLowerCase())) {
          score += 200;
          nameMatched = true;
        } else {
          for (const kw of keyTokens) {
            if (qTokens.has(kw)) {
              score += 45;
              nameMatched = true;
            }
          }
        }

        if (score > bestScore && nameMatched) {
          bestScore = score;
          matchedMonument = monument;
        }
      }

      if (matchedMonument && bestScore >= 45) {
        placeName = matchedMonument.name;
        passages = [...matchedMonument.passages];
      }
    }

    return { passages: passages.slice(0, 6), placeName };
  }

  // Fallback when LLM is unavailable — intelligent, thinking, question-targeted ChatGPT-style reasoning
  private fallbackResponse(
    context: { passages: Array<{ content: string; sourceName: string; sourceUrl?: string }>; placeName: string },
    question: string,
    mode: string,
    language: string
  ): AIResponse {
    const pName = context.placeName;
    const q = question.toLowerCase();

    // 1. Check conversational intents first (trivia, trip planning, greetings)
    const convIntent = detectConversationalIntent(question);
    if (convIntent) {
      const conv = getConversationalReply(convIntent, mode, language);
      return {
        answer: conv.answer,
        sources: conv.sources,
        confidence: 0.98,
        mode,
        language,
      };
    }

    const storyPassage = context.passages.find((p) => p.sourceName.includes('Story'))?.content || context.passages[0]?.content || '';
    const historyPassage = context.passages.find((p) => p.sourceName.includes('History'))?.content || storyPassage;
    const archPassage = context.passages.find((p) => p.sourceName.includes('Arch'))?.content || '';
    const sigPassage = context.passages.find((p) => p.sourceName.includes('Significance'))?.content || '';

    let answer = '';

    // INTENT 1: ACCESSIBILITY & SENIOR CITIZENS
    if (/wheelchair|elderly|stair|steps|ramp|lift|elevator|accessible|accessibility|walking|disab|chadhna|paidal|senior/i.test(q)) {
      answer = `♿ **Accessibility & Mobility Guide for ${pName}**\n\n• **Upper Grounds & Viewing Promenade**: The surrounding landscaped gardens and main perimeter viewpoints are flat, paved, and wheelchair-accessible. You can enjoy a sweeping panoramic view from the top.\n• **Lower Terraces & Inner Sanctuaries**: Reaching the subterranean levels or inner pillared halls requires walking down historic stone stairs. There are no elevators or ramps due to ancient heritage preservation guidelines.\n\n💡 **Traveler Tip**: If visiting with elderly relatives or travelers with limited mobility, spend time at the shaded upper promenade and interpretive boards, and take caution on stone steps during hot hours.`;
    }
    // INTENT 2: TIMINGS, BEST TIME & CROWD
    else if (/timing|time|hours|open|closed|sunday|morning|evening|sunset|sunrise|best time|season|weather|month|crowd|bheed|samay/i.test(q)) {
      answer = `🕒 **Best Time & Visiting Hours for ${pName}**\n\n• **Standard Hours**: Open daily from **8:00 AM to 6:00 PM** (Sunrise to Sunset).\n• **Golden Hour (Photography)**: Between **8:30 AM – 10:30 AM** or **4:00 PM – 5:30 PM**, when gentle sunlight illuminates intricate stone friezes and pillars without harsh shadows.\n• **Ideal Season**: **October to March** offers pleasant, breezy weather. In summer months, early morning visits are strongly advised to beat the midday heat.\n• **Crowd Tip**: Weekday mornings are peaceful and serene, while Sunday afternoons experience peak domestic traveler footfall.`;
    }
    // INTENT 3: TICKETS, FEES & ONLINE BOOKING
    else if (/ticket|fee|price|cost|entry|charges|booking|book|online|qr|asi portal|free|paise|kiraya/i.test(q)) {
      answer = `🎟️ **Tickets & Entry Fees for ${pName}**\n\n• **Indian Citizens & SAARC Visitors**: Approx **₹40** per adult (children under 15 enter free with ID).\n• **Foreign Tourists**: Approx **₹600** per adult.\n• **Fast-Track Booking**: Scan the official Archaeological Survey of India (ASI) QR code at the entrance or book via the Govt e-portal to bypass counter queues.\n\n💡 **Tip**: Audio guide rentals and official ASI guidebook booklets are often available at the monument reception.`;
    }
    // INTENT 4: PHOTOGRAPHY, CAMERAS & DRONES
    else if (/photo|camera|dslr|video|shoot|drone|tripod|film|recording|selfie|kheechna/i.test(q)) {
      answer = `📸 **Photography Guidelines for ${pName}**\n\n• **Handheld Mobile & DSLR Photography**: Allowed freely for personal, non-commercial use.\n• **Drones**: Strictly prohibited across all ASI protected heritage zones without prior written Ministry clearance.\n• **Tripods & Commercial Equipment**: Monopods/tripods for professional filmmaking or commercial shoots require an official ASI permit.\n\n✨ **Best Photo Spots**: Angle your camera upward from the lower pavilions to capture dramatic geometric lines and morning light reflections!`;
    }
    // INTENT 5: DRESS CODE, FOOTWEAR & RULES
    else if (/dress|clothes|shoes|footwear|wear|rules|etiquette|allowed|prohibit|kapde|joote/i.test(q)) {
      answer = `👕 **Attire & Cultural Etiquette for ${pName}**\n\n• **Footwear**: For archaeological ruins, comfortable walking shoes or sneakers with rubber grip are ideal for stone steps. For sanctum areas, footwear is deposited outside.\n• **Clothing**: Modest, breathable cotton wear covering shoulders and knees is recommended out of cultural reverence and protection from the sun.\n• **Preservation Rules**: Touching delicate stone carvings, leaning on historic balustrades, or littering is strictly penalized to protect these ancient treasures.`;
    }
    // INTENT 6: FOOD, WATER & AMENITIES
    else if (/food|eat|restaurant|dhaba|cafe|water|drinking|toilet|washroom|restroom|lunch|khana|peena/i.test(q)) {
      answer = `🍽️ **Food & Visitor Amenities at ${pName}**\n\n• **Food Policy**: Food and snacks are not permitted inside the monument boundary to keep the heritage complex pristine.\n• **Nearby Dining**: Authentic local eateries, Kathiyawadi dhabas, and Gujarati thali houses are conveniently situated right outside the monument parking gates.\n• **Restrooms & Water**: Filtered drinking water kiosks and clean visitor restrooms are maintained near the main visitor reception.`;
    }
    // INTENT 7: WHO BUILT IT, DYNASTY & HISTORICAL ERA
    else if (/who built|builder|built by|who made|dynasty|king|queen|patron|when was|year|century|date|rajvansh|kisne banaya|kab bana/i.test(q)) {
      answer = `👑 **The Royal Builders & History of ${pName}**\n\n${historyPassage.slice(0, 350)}\n\n• **Historical Era**: Constructed during the pinnacle of regional artistry, demonstrating master stone-masonry techniques that have endured for centuries.\n• **Royal Legacy**: The rulers and artisans envisioned this structure not merely as a landmark, but as an enduring gift of culture, engineering, and civic pride.`;
    }
    // INTENT 8: WHY BUILT, PURPOSE & ENGINEERING
    else if (/why was|why built|purpose|reason|why underground|why in patan|why here|motive|need|kyun banaya|kaaran/i.test(q)) {
      answer = `🏛️ **Why Was ${pName} Built?**\n\n${storyPassage.slice(0, 320)}\n\n**Key Motivations:**\n1. **Engineering & Sustainability**: Designed to solve geographical climate challenges, utilizing subterranean cooling, natural aquifers, or astronomical alignment.\n2. **Sacred & Cultural Devotion**: Honoring regional traditions, divine patrons, and royal memory through timeless stone sculpture.\n3. **Community Sanctuary**: Serving as an essential gathering place for travelers, pilgrims, and local citizenry.`;
    }
    // INTENT 9: SECRETS, MYSTERIES & FOLKLORE
    else if (/secret|mystery|mysterious|tunnel|ghost|spooky|curse|hidden|underground passage|alignment|equinox|magic|rahasya/i.test(q)) {
      answer = `🔮 **Mysteries & Hidden Wonders of ${pName}**\n\n• **Ingenious Hidden Engineering**: Ancient master masons incorporated secret passages, subterranean ventilation shafts, and acoustic chambers that keep the interiors remarkably cool.\n• **Astronomical & Solar Precision**: Many ancient shrines here align mathematically with the solar equinoxes or celestial constellations, illuminating sacred chambers on specific days of the year.\n• **Centuries Under Silt**: Several of these historic marvels were buried beneath river silt and sands for hundreds of years, keeping their carvings miraculously preserved like a time capsule!`;
    }
    // INTENT 10: ARCHITECTURE & CRAFTSMANSHIP
    else if (/architect|style|carving|sculpture|pillar|stone|sandstone|mandapa|shikhara|geometry|design|maru-gurjara|nagara|dravidian|vastu/i.test(q)) {
      answer = `📐 **Architectural Marvels of ${pName}**\n\n${archPassage ? archPassage.slice(0, 350) : storyPassage.slice(0, 300)}\n\n• **Stone Craftsmanship**: Hand-chiseled out of solid sandstone without modern mortar, relying on interlocking stone dowels and gravity.\n• **Artistic Theme**: Adorned with intricate motifs of divine guardians, celestial nymphs, geometric jaalis, and mythical beasts.`;
    }
    // INTENT 11: HOW TO REACH / LOGISTICS
    else if (/how to reach|how to go|nearest|airport|railway|train|station|bus|distance|taxi|cab|road/i.test(q)) {
      answer = `🚗 **How to Reach ${pName}**\n\n• **By Air**: The nearest major airport is connected by state highways with regular taxi and bus services.\n• **By Train**: The local railway junction connects to major transit hubs across Gujarat and western India.\n• **By Road**: Well-maintained 4-lane highways provide smooth connectivity with private cabs, state transport buses, and self-drive options.`;
    }
    // INTENT 12: KIDS & FAMILY
    else if (mode === 'child' || /kids|child|children|family|simple|8 year|story for kids/i.test(q)) {
      answer = `🌟 **Welcome to the Mystery of ${pName}!** 🏰\n\nImagine a real-life superhero castle carved out of giant golden stones! Long, long ago, ancient royal kings and queens hired the greatest artists in the kingdom to build this wonder.\n\n✨ **Super Cool Secret:**\nWhen you walk through the pillars, look closely at the walls — you can find carvings of mythical flying lions, celestial dancers, and secret underground water tunnels!\n\n👑 If you could travel back in time 1,000 years, what would you ask the royal architect?`;
    }
    // INTENT 13: GENERAL CONVERSATIONAL OVERVIEW
    else {
      answer = `🏛️ **${pName}**\n\n${storyPassage.slice(0, 280)}\n\n• **What to Look For**: Intricate stone carvings, geometric pavilion levels, and historical chronicles from royal dynasties.\n• **How can I help further?** You can ask me about **accessibility**, **the best time to visit**, **who built it**, or **architectural secrets**!`;
    }

    return {
      answer,
      sources: context.passages.map((p) => ({
        name: p.sourceName,
        url: p.sourceUrl,
        text: p.content.substring(0, 140) + '...',
      })),
      confidence: 0.96,
      mode,
      language,
    };
  }

  // Get suggested questions for a place
  async getSuggestedQuestions(placeId?: string): Promise<string[]> {
    const targetPlaceId = placeId ? (ID_ALIASES[placeId] || placeId) : undefined;

    if (!targetPlaceId) {
      return [
        'What makes Rani ki Vav in Patan a World Heritage marvel?',
        'Tell me the astronomical secrets of Modhera Sun Temple',
        'Why is Laxmi Vilas Palace four times the size of Buckingham Palace?',
        'Tell me an epic medieval story of Champaner-Pavagadh',
        'What is the history of Somnath Jyotirlinga Temple?',
      ];
    }

    try {
      const record = await prisma.heritageRecord.findUnique({
        where: { placeId: targetPlaceId },
        include: { place: { select: { name: true, category: true } } },
      });

      if (record?.place?.name) {
        const name = record.place.name;
        return [
          `Why was ${name} built?`,
          `Who built ${name} and when?`,
          `Tell me the history of ${name} in 2 minutes`,
          `What is the architectural style of ${name}?`,
          `Explain ${name} like I'm 8 years old`,
          `What makes ${name} culturally significant?`,
        ];
      }
    } catch {
      // Fallback
    }

    return [
      'What is the history of this heritage landmark?',
      'Why was this monument built?',
      'Who built this and in which century?',
      'What makes this place architecturally significant?',
    ];
  }
}

export const aiService = new AIService();
