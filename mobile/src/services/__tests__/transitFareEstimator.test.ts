function assert(condition: any, message?: string) {
  if (!condition) throw new Error(message || 'Assertion failed');
}
assert.equal = function (actual: any, expected: any, message?: string) {
  if (actual !== expected) throw new Error(message || `Expected ${expected}, got ${actual}`);
};

import { estimateTransitFares } from '../transitFareEstimator';

console.log('--- Running TransitFareEstimator Tests ---');

// 1. Metro zone test (Ahmedabad)
{
  const metroFare = estimateTransitFares('Sidi Saiyyed Mosque', 'Ahmedabad', 'Gujarat', 8.5);
  assert.equal(metroFare.zoneType, 'metro');
  assert.equal(metroFare.isAppRidePrevalent, true);
  assert(metroFare.autoPrivateRange.startsWith('₹'), 'Auto fare should start with currency ₹');
  assert(metroFare.localPhrase.gujarati, 'Must have Gujarati translation');
  assert(metroFare.localPhrase.gujaratiPronunciation, 'Must have Gujarati pronunciation');
  assert(metroFare.localPhrase.hindi, 'Must have Hindi translation');
  console.log('✔ Metro city fare estimate verified with Gujarati & Hindi phrases:', metroFare.autoPrivateRange);
}

// 2. Regional zone test (Patan / Rani ki Vav)
{
  const regionalFare = estimateTransitFares('Rani ki Vav', 'Patan', 'Gujarat', 12);
  assert.equal(regionalFare.zoneType, 'regional');
  assert.equal(regionalFare.isAppRidePrevalent, false);
  assert(regionalFare.fullDayAutoRange, 'Regional zone must offer full day auto circuit estimates');
  assert(regionalFare.localPhrase.gujarati?.includes('રૂપિયા'), 'Gujarati negotiation phrase must contain currency');
  assert(regionalFare.bargainingTips.length >= 3, 'Must provide anti-gouging bargaining rules');
  console.log('✔ Regional town fare estimate verified with full day circuit & anti-gouging tips:', regionalFare.autoPrivateRange);
}

// 3. Distance scaling verification
{
  const shortFare = estimateTransitFares('Local Temple', 'Vadodara', 'Gujarat', 2);
  const longFare = estimateTransitFares('Distant Fort', 'Vadodara', 'Gujarat', 25);

  const extractFirstNumber = (str: string) => {
    const match = str.match(/₹(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const shortAutoMin = extractFirstNumber(shortFare.autoPrivateRange);
  const longAutoMin = extractFirstNumber(longFare.autoPrivateRange);

  assert(longAutoMin > shortAutoMin, `Long distance fare (₹${longAutoMin}) must exceed short distance (₹${shortAutoMin})`);
  console.log(`✔ Distance scaling verified: 2km = ₹${shortAutoMin} vs 25km = ₹${longAutoMin}`);
}

console.log('All TransitFareEstimator tests passed successfully! ✅');
