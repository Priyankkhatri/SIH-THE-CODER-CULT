import prisma from '../../config/database';
import { loadMasterUnifiedPlaces } from '../../utils/masterDataLoader';

export interface SearchOptions {
  query: string;
  category?: string;
  state?: string;
  lang?: string;
  limit?: number;
}

export interface SearchResult {
  place: any;
  score: number;
  matchedFields: string[];
}

class SearchEngine {
  private placesCatalog: any[] = [];
  private isInitialized = false;

  constructor() {
    this.initCatalog();
  }

  public initCatalog(): void {
    this.placesCatalog = loadMasterUnifiedPlaces();
    this.isInitialized = true;
  }

  public async getAllPlacesUnified(): Promise<any[]> {
    if (!this.isInitialized || this.placesCatalog.length === 0) {
      this.initCatalog();
    }

    try {
      const dbPlaces = await prisma.place.findMany({
        include: {
          heritageRecord: {
            select: { shortStory: true, period: true },
          },
        },
      });

      if (dbPlaces.length > 0) {
        const placeMap = new Map<string, any>();
        for (const p of this.placesCatalog) {
          placeMap.set(p.id, p);
        }
        for (const p of dbPlaces) {
          placeMap.set(p.id, {
            ...p,
            heritageRecord: p.heritageRecord || undefined,
          });
        }
        return Array.from(placeMap.values());
      }
    } catch {
      // Return memory catalog if DB is offline/empty
    }

    return this.placesCatalog;
  }

  public async search(options: SearchOptions): Promise<SearchResult[]> {
    const { query, category, state, limit = 50 } = options;
    const cleanQuery = (query || '').toLowerCase().trim();
    const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

    const allPlaces = await this.getAllPlacesUnified();

    if (queryTokens.length === 0 && !category && !state) {
      return allPlaces.slice(0, limit).map((p) => ({
        place: p,
        score: 1.0,
        matchedFields: ['default'],
      }));
    }

    const scoredResults: SearchResult[] = [];

    for (const place of allPlaces) {
      // Category filter
      if (category && category !== 'all') {
        if (place.category?.toLowerCase() !== category.toLowerCase()) {
          continue;
        }
      }

      // State filter
      if (state) {
        if (place.state?.toLowerCase() !== state.toLowerCase()) {
          continue;
        }
      }

      if (queryTokens.length === 0) {
        scoredResults.push({
          place,
          score: (place.rating || 4.5) * 10,
          matchedFields: ['filter_match'],
        });
        continue;
      }

      let score = 0;
      const matchedFields: string[] = [];

      const nameLower = (place.name || '').toLowerCase();
      const nameHi = (place.nameHi || '').toLowerCase();
      const nameGu = (place.nameGu || '').toLowerCase();
      const cityLower = (place.city || '').toLowerCase();
      const stateLower = (place.state || '').toLowerCase();
      const descLower = (place.shortDescription || '').toLowerCase();
      const fullDescLower = (place.description || '').toLowerCase();
      const categoryLower = (place.category || '').toLowerCase();
      const architecturalStyle = (place.architecturalStyle || '').toLowerCase();
      const tags = Array.isArray(place.tags) ? place.tags.join(' ').toLowerCase() : '';

      // 1. Exact Name Match
      if (nameLower === cleanQuery) {
        score += 150;
        matchedFields.push('exact_name');
      } else if (nameLower.startsWith(cleanQuery)) {
        score += 100;
        matchedFields.push('name_prefix');
      } else if (nameLower.includes(cleanQuery)) {
        score += 70;
        matchedFields.push('name_contains');
      }

      // 2. Indic language matches
      if (nameHi.includes(cleanQuery)) {
        score += 85;
        matchedFields.push('name_hi');
      }
      if (nameGu.includes(cleanQuery)) {
        score += 85;
        matchedFields.push('name_gu');
      }

      // 3. Location matches
      if (cityLower.includes(cleanQuery)) {
        score += 50;
        matchedFields.push('city');
      }
      if (stateLower.includes(cleanQuery)) {
        score += 40;
        matchedFields.push('state');
      }

      // 4. Token-by-token fuzzy matching
      let tokensMatched = 0;
      for (const token of queryTokens) {
        let tokenFound = false;

        if (nameLower.includes(token)) {
          score += 35;
          tokenFound = true;
        }
        if (cityLower.includes(token) || stateLower.includes(token)) {
          score += 20;
          tokenFound = true;
        }
        if (categoryLower.includes(token) || architecturalStyle.includes(token)) {
          score += 25;
          tokenFound = true;
        }
        if (tags.includes(token)) {
          score += 20;
          tokenFound = true;
        }
        if (descLower.includes(token) || fullDescLower.includes(token)) {
          score += 10;
          tokenFound = true;
        }

        if (tokenFound) tokensMatched++;
      }

      // Bonus if all search tokens matched something in the record
      if (queryTokens.length > 1 && tokensMatched === queryTokens.length) {
        score += 40;
        matchedFields.push('all_tokens_matched');
      }

      // Quality boost based on place rating
      if (score > 0) {
        const ratingBoost = (place.rating || 4.5) * 2;
        score += ratingBoost;
        scoredResults.push({ place, score, matchedFields });
      }
    }

    // Sort descending by score
    scoredResults.sort((a, b) => b.score - a.score);

    return scoredResults.slice(0, limit);
  }
}

export const searchEngine = new SearchEngine();
