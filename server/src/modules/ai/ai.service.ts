import OpenAI from 'openai';
import prisma from '../../config/database';
import { config } from '../../config';
import { getSystemPrompt } from './ai.prompts';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
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

    // Step 2: Build the prompt with retrieved context
    const systemPrompt = getSystemPrompt(mode, language);
    const contextText = context.passages.map((p, i) => 
      `[Source ${i + 1}: ${p.sourceName}]\n${p.content}`
    ).join('\n\n');

    const userPrompt = placeId 
      ? `Context about the heritage site:\n${contextText}\n\nPlace: ${context.placeName}\n\nQuestion: ${question}`
      : `Available heritage information:\n${contextText}\n\nQuestion: ${question}`;

    // Step 3: Generate answer using LLM
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
        confidence: context.passages.length > 0 ? 0.85 : 0.5,
        mode,
        language,
      };
    } catch (error) {
      // Fallback: return context directly if LLM fails
      console.error('LLM generation failed, using fallback:', error);
      return this.fallbackResponse(context, question, mode, language);
    }
  }

  // Retrieve relevant passages from the database
  private async retrieveContext(question: string, placeId?: string) {
    let passages: Array<{
      content: string;
      sourceName: string;
      sourceUrl?: string;
    }> = [];
    let placeName = 'Unknown Place';

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
        placeName = record.place.name;

        // Build passages from heritage data
        passages = [
          {
            content: record.shortStory,
            sourceName: 'Heritage Story',
            sourceUrl: undefined,
          },
          {
            content: record.history,
            sourceName: 'Historical Record',
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

        // Add verified sources
        record.sources.forEach((source) => {
          passages.push({
            content: source.referenceText,
            sourceName: source.sourceName,
            sourceUrl: source.sourceUrl || undefined,
          });
        });
      }
    } else {
      // General query: search across all heritage records
      const records = await prisma.heritageRecord.findMany({
        include: {
          sources: true,
          place: { select: { name: true } },
        },
        take: 5,
      });

      // Simple keyword matching for hackathon
      const questionLower = question.toLowerCase();
      const relevantRecords = records.filter((r) =>
        r.shortStory.toLowerCase().includes(questionLower) ||
        r.history.toLowerCase().includes(questionLower) ||
        r.place.name.toLowerCase().includes(questionLower)
      );

      const targetRecords = relevantRecords.length > 0 ? relevantRecords : records.slice(0, 3);

      targetRecords.forEach((record) => {
        passages.push({
          content: `${record.place.name}: ${record.shortStory}`,
          sourceName: `Heritage Record - ${record.place.name}`,
        });
      });

      if (targetRecords.length > 0) {
        placeName = targetRecords[0].place.name;
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
      answer: combinedContent || 'I don\'t have enough information to answer this question. Please try asking about a specific heritage site.',
      sources: context.passages.map((p) => ({
        name: p.sourceName,
        url: p.sourceUrl,
        text: p.content.substring(0, 150) + '...',
      })),
      confidence: 0.6,
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

    if (!record) {
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
