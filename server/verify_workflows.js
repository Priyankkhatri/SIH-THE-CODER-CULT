const axios = require('axios');
const BASE = 'http://localhost:3000';

async function verifyAll() {
  const report = [];

  async function test(name, fn) {
    const t0 = Date.now();
    try {
      const res = await fn();
      report.push({ name, status: 'PASS', latencyMs: Date.now() - t0, detail: res });
    } catch (err) {
      report.push({ name, status: 'FAIL', latencyMs: Date.now() - t0, error: err.message });
    }
  }

  // 1. Auth Guest
  await test('Auth Guest Session', async () => {
    const r = await axios.post(BASE + '/auth/guest');
    if (!r.data.success || !r.data.data?.token) throw new Error('No token');
    return 'Token received';
  });

  // 2. Places Nearby
  await test('Places Nearby (Vadodara)', async () => {
    const r = await axios.get(BASE + '/places/nearby?latitude=22.3072&longitude=73.1812&radiusKm=20');
    if (!r.data.success || !r.data.data.length) throw new Error('No places');
    return r.data.data.length + ' places found';
  });

  // 3. Place Detail
  await test('Place Detail (IND-GJ-06)', async () => {
    const r = await axios.get(BASE + '/places/IND-GJ-06');
    if (!r.data.success || !r.data.data.name) throw new Error('No place detail');
    return r.data.data.name;
  });

  // 4. Heritage Detail
  await test('Heritage Record (IND-GJ-06)', async () => {
    const r = await axios.get(BASE + '/heritage/IND-GJ-06');
    if (!r.data.success || !r.data.data.shortStory) throw new Error('No heritage story');
    return 'Heritage story loaded';
  });

  // 5. AI Suggestions (GET)
  await test('AI Suggestions GET', async () => {
    const r = await axios.get(BASE + '/ai/suggestions?placeId=IND-GJ-06');
    if (!r.data.success || !r.data.data.length) throw new Error('No suggestions');
    return r.data.data.length + ' questions';
  });

  // 6. AI Suggestions (POST)
  await test('AI Suggestions POST', async () => {
    const r = await axios.post(BASE + '/ai/suggest', { placeId: 'IND-GJ-06' });
    if (!r.data.success || !r.data.data.length) throw new Error('No suggestions');
    return r.data.data.length + ' questions';
  });

  // 7. Conversational AI Ask (Groq 70B)
  await test('Conversational AI Tour Guide', async () => {
    const r = await axios.post(BASE + '/api/v1/ai/ask', {
      question: 'Who built Laxmi Vilas Palace and why is it special?',
      mode: 'short',
      language: 'en'
    });
    if (!r.data.success || !r.data.data.answer) throw new Error('No answer');
    return r.data.data.answer.slice(0, 75).replace(/\n/g, ' ') + '...';
  });

  // 8. Multi-turn AI Ask
  await test('AI Multi-Turn Context Recovery', async () => {
    const r = await axios.post(BASE + '/api/v1/ai/ask', {
      question: 'In which year was it finished?',
      history: [
        { role: 'user', content: 'Tell me about Laxmi Vilas Palace' },
        { role: 'assistant', content: 'Laxmi Vilas Palace in Vadodara is an Indo-Saracenic palace.' }
      ],
      mode: 'short',
      language: 'en'
    });
    if (!r.data.success || !r.data.data.answer) throw new Error('No answer');
    return r.data.data.answer.slice(0, 75).replace(/\n/g, ' ') + '...';
  });

  // 9. Itinerary Short (30min)
  await test('Itinerary 30-Minute', async () => {
    const r = await axios.post(BASE + '/itinerary/generate', { duration: '30min', latitude: 22.3072, longitude: 73.1812 });
    if (!r.data.success || !r.data.data.stops) throw new Error('No stops');
    return r.data.data.title + ' (' + r.data.data.stops + ' stops)';
  });

  // 10. Itinerary Half-Day
  await test('Itinerary Half-Day', async () => {
    const r = await axios.post(BASE + '/itinerary/generate', { duration: 'half_day', latitude: 22.3072, longitude: 73.1812 });
    if (!r.data.success || r.data.data.stops < 3) throw new Error('Stops < 3');
    return r.data.data.title + ' (' + r.data.data.stops + ' stops, ' + r.data.data.totalTimeMinutes + 'm)';
  });

  // 11. Itinerary Full-Day
  await test('Itinerary Full-Day', async () => {
    const r = await axios.post(BASE + '/itinerary/generate', { duration: 'full_day', latitude: 22.3072, longitude: 73.1812 });
    if (!r.data.success || r.data.data.stops < 6) throw new Error('Stops < 6');
    return r.data.data.title + ' (' + r.data.data.stops + ' stops, ' + r.data.data.totalTimeMinutes + 'm)';
  });

  // 12. Translation Engine (Hindi)
  await test('Translation Engine (Hindi)', async () => {
    const r = await axios.post(BASE + '/translate', { text: 'Temple of the Sun', targetLang: 'hi' });
    if (!r.data.success || !r.data.data.translatedText) throw new Error('No translation');
    return r.data.data.translatedText;
  });

  // 13. Vision Radar Fallback
  await test('Vision Radar GPS Proximity (Patan)', async () => {
    const r = await axios.post(BASE + '/vision/identify', { latitude: 23.8589, longitude: 72.1013 });
    if (!r.data.success || !r.data.data.identified) throw new Error('Not identified by GPS');
    return 'Identified: ' + (r.data.data.placeName || r.data.data.artifact?.name);
  });

  // 14. Devtools Services Snapshot
  await test('Devtools Services Health', async () => {
    const r = await axios.get(BASE + '/devtools/services');
    if (!r.data.success) throw new Error('Services check failed');
    const groq = r.data.data.find((s) => s.name === 'groq');
    return 'Groq status: ' + (groq ? groq.status : 'not found');
  });

  console.log('\n==========================================');
  console.log('       PLATFORM WORKFLOW TEST REPORT      ');
  console.log('==========================================');
  let passCount = 0;
  report.forEach((t) => {
    const mark = t.status === 'PASS' ? 'PASS' : 'FAIL';
    if (t.status === 'PASS') passCount++;
    console.log(mark, t.name.padEnd(34), (t.latencyMs + 'ms').padStart(7), t.detail || t.error);
  });
  console.log('==========================================');
  const pct = Math.round((passCount / report.length) * 100);
  console.log(`Accuracy / Pass Rate: ${pct}% (${passCount}/${report.length})`);
  console.log('==========================================\n');
}

verifyAll();
