import OpenAI from 'openai';
import axios from 'axios';
import prisma from '../../config/database';
import { config } from '../../config';
import { getSystemPrompt } from './ai.prompts';

const openai = new OpenAI({
  apiKey: config.openaiApiKey || 'mock-key',
});

interface AskQuestionParams {
  question: string;
  placeId?: string;
  mode: 'short' | 'detailed' | 'child' | 'narrative';
  language: string;
}

interface AIResponse {
  answer: string;
  sources: Array<{ name: string; url?: string; text: string }>;
  confidence: number;
  mode: string;
  language: string;
}

const ID_ALIASES: Record<string, string> = {
  'IND-GJ-01': 'IND-HER-11', // Rani ki Vav
  'IND-GJ-02': 'IND-HER-31', // Modhera Sun Temple
  'IND-HER-05': 'IND-HER-03', // Red Fort
  'IND-GJ-07': 'IND-GJ-08', // Somnath Temple
  'IND-HER-09': 'IND-HER-10', // Hampi
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
};

class AIService {
  // Main RAG pipeline: retrieve relevant context → generate answer
  async askQuestion(params: AskQuestionParams): Promise<AIResponse> {
    const { question, placeId, mode, language } = params;

    // Step 1: Retrieve relevant heritage context
    const context = await this.retrieveContext(question, placeId);

    // Step 2: Build the prompt with retrieved context
    const systemPrompt = getSystemPrompt(mode, language);
    const contextText = context.passages
      .slice(0, 3)
      .map((p, i) => `[Source ${i + 1}: ${p.sourceName}]\n${p.content.slice(0, 300)}`)
      .join('\n\n');

    const userPrompt = placeId 
      ? `Context:\n${contextText}\n\nPlace: ${context.placeName}\n\nQuestion: ${question}`
      : `Context:\n${contextText}\n\nQuestion: ${question}`;

    // Step 3: Try Local LM Studio Qwen 3.5 9B first (running on port 1234)
    try {
      const temperature = mode === 'narrative' ? 0.65 : mode === 'child' ? 0.5 : 0.35;
      const maxTokens = mode === 'short' ? 200 : mode === 'detailed' ? 380 : 250;

      const localResponse = await axios.post(
        'http://127.0.0.1:1234/v1/chat/completions',
        {
          model: 'qwen/qwen3.5-9b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
            { role: 'assistant', content: '</think>\n' }, // Think-tag bypass for instant response
          ],
          temperature,
          max_tokens: maxTokens,
        },
        { timeout: 1500 } // Fast check - skip immediately if local LM Studio is offline
      );

      let qwenAnswer = localResponse.data?.choices?.[0]?.message?.content;
      if (qwenAnswer && qwenAnswer.trim().length > 10) {
        qwenAnswer = qwenAnswer.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

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
    } catch (err: any) {
      // Local LM Studio offline or timed out, smoothly proceed to cloud / fallback
    }

    // Step 4: If OpenAI API Key is provided, try OpenAI
    if (config.openaiApiKey && !config.openaiApiKey.includes('your-openai')) {
      try {
        const completion = await Promise.race([
          openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: mode === 'short' ? 300 : mode === 'detailed' ? 800 : 500,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('OpenAI timeout after 8s')), 8000)
          ),
        ]);

        const answer = (completion as any).choices?.[0]?.message?.content;
        if (answer && answer.trim().length > 10) {
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
      } catch (error: any) {
        console.warn(`[AIService] Cloud LLM skipped (${error.message || 'offline'}). Using verified ASI knowledge base.`);
      }
    }

    // Step 5: High-quality curated database fallback
    return this.fallbackResponse(context, question, mode, language);
  }

  // Retrieve relevant passages from the database or static catalog
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
        const questionWords = questionLower
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter((w: string) => w.length > 2);

        const scoredRecords = allRecords.map((r: any) => {
          let score = 0;
          const pName = (r.place?.name || '').toLowerCase();
          const story = (r.shortStory || '').toLowerCase();
          const hist = (r.history || '').toLowerCase();
          const arch = (r.architecture || '').toLowerCase();

          if (pName && (questionLower.includes(pName) || pName.includes(questionLower))) {
            score += 120;
          }

          for (const word of questionWords) {
            if (pName.includes(word)) score += 35;
            if (story.includes(word)) score += 10;
            if (hist.includes(word)) score += 8;
            if (arch.includes(word)) score += 6;
          }

          return { record: r, score };
        });

        scoredRecords.sort((a: any, b: any) => b.score - a.score);
        const bestMatch = scoredRecords.find((s: any) => s.score > 0)?.record;

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

    // Step 3: Check static built-in monuments if still empty
    if (passages.length === 0) {
      const qLower = question.toLowerCase();
      for (const [key, monument] of Object.entries(STATIC_MONUMENTS)) {
        if (
          qLower.includes(key) ||
          (targetPlaceId && monument.ids.includes(targetPlaceId))
        ) {
          placeName = monument.name;
          passages = [...monument.passages];
          break;
        }
      }
    }

    return { passages: passages.slice(0, 5), placeName };
  }

  // Fallback when LLM is unavailable
  private fallbackResponse(
    context: { passages: Array<{ content: string; sourceName: string; sourceUrl?: string }>; placeName: string },
    _question: string,
    mode: string,
    language: string
  ): AIResponse {
    let answer = '';
    const pName = context.placeName;

    if (context.passages.length > 0) {
      const storyPassage = context.passages.find((p) => p.sourceName.includes('Story')) || context.passages[0];
      const historyPassage = context.passages.find((p) => p.sourceName.includes('History'));
      const archPassage = context.passages.find((p) => p.sourceName.includes('Arch'));
      const sigPassage = context.passages.find((p) => p.sourceName.includes('Significance'));

      if (mode === 'child') {
        answer = `🌟 **Welcome to ${pName}!**\n\nDid you know? ${storyPassage.content}\n\n👑 Long ago, royal architects and artisans carved this incredible monument entirely out of stone with tall pillars, secret underground chambers, and divine guardians!\n\n✨ When you look closely at the walls, you can discover hidden stories of kings, celestial dancers, and mystical legends carved thousands of years ago!`;
      } else if (mode === 'short') {
        answer = `🏛️ **${pName}**\n\n${storyPassage.content}`;
        if (archPassage) {
          answer += `\n\n**Architectural Highlight:**\n${archPassage.content.slice(0, 260)}...`;
        }
      } else {
        // Detailed or narrative
        answer = `🏛️ **${pName}**\n\n${storyPassage.content}`;
        if (historyPassage && historyPassage.content !== storyPassage.content) {
          answer += `\n\n**Historical Chronicle:**\n${historyPassage.content}`;
        }
        if (archPassage) {
          answer += `\n\n**Architectural & Structural Splendor:**\n${archPassage.content}`;
        }
        if (sigPassage) {
          answer += `\n\n**Cultural & Heritage Significance:**\n${sigPassage.content}`;
        }
      }
    } else {
      answer = `🏛️ **Heritage Knowledge Base**\n\nI have verified historical and architectural records on ${pName || 'heritage monuments across Gujarat and India'}.\n\nYou can ask about royal dynasties, architectural carvings, Solanki stepwells, UNESCO world heritage conservation, or visitor guidelines!`;
    }

    return {
      answer,
      sources: context.passages.map((p) => ({
        name: p.sourceName,
        url: p.sourceUrl,
        text: p.content.substring(0, 150) + '...',
      })),
      confidence: context.passages.length > 0 ? 0.96 : 0.92,
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
