import assert from 'node:assert/strict';
import { convertToInr, convertFromInr, FALLBACK_INR_RATES, CURRENCIES } from '../currencyService';

console.log('--- Running CurrencyService Conversion & Fallback Tests ---');

// 1. convertToInr accuracy & edge cases
{
  // Standard conversion
  assert.equal(convertToInr(10, 83.5), 835);
  assert.equal(convertToInr(10.5, 91.2), 957.6);
  console.log('✔ Valid currency to INR conversion accuracy confirmed');

  // Input sanitization (Negative / NaN / Infinity)
  assert.equal(convertToInr(-50, 83.5), 0, 'Negative amount must return 0');
  assert.equal(convertToInr(50, -83.5), 0, 'Negative rate must return 0');
  assert.equal(convertToInr(NaN, 83.5), 0, 'NaN amount must return 0');
  assert.equal(convertToInr(50, NaN), 0, 'NaN rate must return 0');
  assert.equal(convertToInr(Infinity, 83.5), 0, 'Infinity amount must return 0');
  console.log('✔ Non-finite, negative, and invalid parameters safely sanitized to 0');
}

// 2. convertFromInr accuracy & division by zero
{
  assert.equal(convertFromInr(835, 83.5), 10);
  assert.equal(convertFromInr(0, 83.5), 0);
  console.log('✔ Valid INR to foreign currency conversion confirmed');

  // Division by zero prevention
  assert.equal(convertFromInr(1000, 0), 0, 'Zero rate must safely return 0 without division by zero');
  assert.equal(convertFromInr(1000, -10), 0, 'Negative rate must return 0');
  assert.equal(convertFromInr(-500, 83.5), 0, 'Negative amount must return 0');
  assert.equal(convertFromInr(NaN, 83.5), 0, 'NaN amount must return 0');
  console.log('✔ Zero-division and invalid numbers safely handled');
}

// 3. Fallback exchange rates completeness
{
  for (const cur of CURRENCIES) {
    const rate = FALLBACK_INR_RATES[cur.code];
    assert(typeof rate === 'number' && rate > 0, `Fallback rate missing or invalid for ${cur.code}`);
  }
  console.log(`✔ All ${CURRENCIES.length} supported international currencies have verified offline fallback rates`);
}

console.log('All CurrencyService tests passed successfully! ✅');
