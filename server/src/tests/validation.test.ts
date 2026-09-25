import assert from 'node:assert/strict';
import { z } from 'zod';

console.log('--- Running Server API Validation Tests ---');

// 1. Places Nearby Query Schema Tests
{
  const nearbyQuerySchema = z.object({
    lat: z.coerce.number().min(-90).max(90).default(22.3072),
    lng: z.coerce.number().min(-180).max(180).default(73.1812),
    radius: z.coerce.number().positive().max(500).default(50),
    category: z.string().max(50).optional(),
    lang: z.enum(['en', 'hi', 'gu']).default('en'),
  });

  // Valid params
  const valid = nearbyQuerySchema.safeParse({ lat: '23.0225', lng: '72.5714', radius: '25', lang: 'gu' });
  assert.equal(valid.success, true);
  if (valid.success) {
    assert.equal(valid.data.lat, 23.0225);
    assert.equal(valid.data.lang, 'gu');
  }
  console.log('✔ Nearby query schema accepts valid parameters');

  // Out of bounds latitude (> 90) must be rejected
  const invalidLat = nearbyQuerySchema.safeParse({ lat: '999', lng: '72.5714' });
  assert.equal(invalidLat.success, false);
  console.log('✔ Out-of-bounds latitude safely rejected');

  // Negative radius must be rejected
  const invalidRadius = nearbyQuerySchema.safeParse({ radius: '-10' });
  assert.equal(invalidRadius.success, false);
  console.log('✔ Negative radius safely rejected');

  // Unsupported language must be rejected
  const invalidLang = nearbyQuerySchema.safeParse({ lang: 'fr' });
  assert.equal(invalidLang.success, false);
  console.log('✔ Unsupported language code safely rejected');
}

// 2. AI Request Schema Tests
{
  const askRequestSchema = z.object({
    question: z.string().trim().min(1).max(1000),
    placeId: z.string().max(100).optional(),
    mode: z.enum(['short', 'detailed', 'child', 'narrative']).default('short'),
    language: z.enum(['en', 'hi', 'gu']).default('en'),
  });

  // Valid prompt
  const validAsk = askRequestSchema.safeParse({ question: 'History of Modhera Sun Temple', mode: 'detailed', language: 'hi' });
  assert.equal(validAsk.success, true);
  console.log('✔ AI ask schema accepts valid prompt and options');

  // Empty string rejected
  const emptyAsk = askRequestSchema.safeParse({ question: '   ' });
  assert.equal(emptyAsk.success, false);
  console.log('✔ Empty prompt safely rejected');

  // Oversized prompt (>1000 chars) rejected to prevent token exhaustion
  const hugeAsk = askRequestSchema.safeParse({ question: 'a'.repeat(1005) });
  assert.equal(hugeAsk.success, false);
  console.log('✔ Oversized prompt safely rejected to protect LLM context');
}

console.log('All Server API Validation tests passed successfully! ✅');
