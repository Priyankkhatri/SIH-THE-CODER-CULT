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

class AIService {
  // Main RAG pipeline: retrieve relevant context → generate answer
  async askQuestion(params: AskQuestionParams): Promise<AIResponse> {
    const { question, placeId, mode, language } = params;

    // Step 1: Retrieve relevant heritage context
    const context = await this.retrieveContext(question, placeId);

    // Step 2: Build the prompt with retrieved context (compact for fast local inference)
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
        { timeout: 35000 }
      );

      let qwenAnswer = localResponse.data?.choices?.[0]?.message?.content;
      if (qwenAnswer && qwenAnswer.trim().length > 10) {
        // Strip any residual think block if present
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
      console.log(`[AIService] Local Qwen 3.5 9B skipped (${err.message || 'offline'}). Checking cloud/fallback.`);
    }

    // Step 4: If OpenAI API Key is provided, try OpenAI
    if (config.openaiApiKey && !config.openaiApiKey.includes('your-openai')) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: mode === 'short' ? 300 : mode === 'detailed' ? 800 : 500,
        });

        const answer = completion.choices[0]?.message?.content || 'I could not generate a response.';

        return {
          answer,
          sources: context.passages.map((p) => ({
            name: p.sourceName,
            url: p.sourceUrl,
            text: p.content.substring(0, 150) + '...',
          })),
          confidence: context.passages.length > 0 ? 0.96 : 0.95,
          mode,
          language,
        };
      } catch (error) {
        console.warn('Cloud LLM generation failed, switching to curated database fallback.');
      }
    }

    // Step 5: High-quality curated database fallback
    return this.fallbackResponse(context, question, mode, language);
  }

  // Retrieve relevant passages from the database
  private async retrieveContext(question: string, placeId?: string) {
    let passages: Array<{
      content: string;
      sourceName: string;
      sourceUrl?: string;
    }> = [];
    let placeName = 'Indian Heritage Landmark';

    if (placeId) {
      // Get heritage record for specific place
      const record = await prisma.heritageRecord.findUnique({
        where: { placeId },
        include: {
          sources: true,
          place: { select: { name: true } },
        },
      });

      if (record) {
        placeName = record.place?.name || 'Heritage Monument';

        passages = [
          {
            content: record.shortStory,
            sourceName: 'Curated Heritage Story',
            sourceUrl: undefined,
          },
          {
            content: record.history,
            sourceName: 'Archaeological History',
            sourceUrl: undefined,
          },
          {
            content: record.significance,
            sourceName: 'Cultural Significance',
            sourceUrl: undefined,
          },
        ];

        if (record.architecture) {
          passages.push({
            content: record.architecture,
            sourceName: 'Architectural Details',
          });
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
    } else {
      // Intelligent general query: search across all heritage records in the database
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

      // Score each record based on relevance to the user's question
      const scoredRecords = allRecords.map((r: any) => {
        let score = 0;
        const pName = (r.place?.name || '').toLowerCase();
        const story = (r.shortStory || '').toLowerCase();
        const hist = (r.history || '').toLowerCase();
        const arch = (r.architecture || '').toLowerCase();

        // Exact place name match is weighted highest
        if (pName && questionLower.includes(pName)) {
          score += 100;
        }

        for (const word of questionWords) {
          if (pName.includes(word)) score += 30;
          if (story.includes(word)) score += 10;
          if (hist.includes(word)) score += 8;
          if (arch.includes(word)) score += 6;
        }

        return { record: r, score };
      });

      scoredRecords.sort((a: any, b: any) => b.score - a.score);

      // Top matching record
      const bestMatch = scoredRecords.find((s: any) => s.score > 0)?.record;

      if (bestMatch) {
        placeName = bestMatch.place?.name || 'Heritage Monument';
        passages.push({
          content: `${bestMatch.place?.name}: ${bestMatch.shortStory}`,
          sourceName: `Heritage Record - ${bestMatch.place?.name}`,
        });
        if (bestMatch.history) {
          passages.push({
            content: bestMatch.history,
            sourceName: `Archaeological History - ${bestMatch.place?.name}`,
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
      } else {
        // Broad fallback: take top 3 prominent records
        const sampleRecords = allRecords.slice(0, 3);
        sampleRecords.forEach((record: any) => {
          passages.push({
            content: `${record.place?.name || 'Monument'}: ${record.shortStory}`,
            sourceName: `Heritage Record - ${record.place?.name || 'History'}`,
          });
        });
        if (sampleRecords.length > 0 && sampleRecords[0].place) {
          placeName = sampleRecords[0].place.name;
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
    const combinedContent = context.passages
      .map((p) => p.content)
      .join('\n\n');

    return {
      answer: combinedContent || 'I don\'t have enough information to answer this question. Please try asking about a specific heritage site or artifact.',
      sources: context.passages.map((p) => ({
        name: p.sourceName,
        url: p.sourceUrl,
        text: p.content.substring(0, 150) + '...',
      })),
      confidence: 0.95,
      mode,
      language,
    };
  }

  // Get suggested questions for a place
  async getSuggestedQuestions(placeId?: string): Promise<string[]> {
    if (!placeId) {
      return [
        'What are the most important heritage sites in Vadodara?',
        'Tell me about the Gaekwad dynasty',
        'What is the history of Champaner-Pavagadh?',
        'Explain the architectural styles found in Gujarat',
      ];
    }

    const record = await prisma.heritageRecord.findUnique({
      where: { placeId },
      include: { place: { select: { name: true, category: true } } },
    });

    if (!record || !record.place) {
      return [
        'What is the history of this place?',
        'Why was this monument built?',
        'Who built this and when?',
        'What makes this place significant?',
      ];
    }

    return [
      `Why was ${record.place.name} built?`,
      `Who built ${record.place.name} and when?`,
      `Tell me the history of ${record.place.name} in 2 minutes`,
      `What is the architectural style of ${record.place.name}?`,
      `Explain ${record.place.name} like I'm 8 years old`,
      `What makes ${record.place.name} culturally significant?`,
    ];
  }
}

export const aiService = new AIService();
