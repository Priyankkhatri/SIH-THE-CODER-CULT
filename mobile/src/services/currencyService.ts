const FOREX_API = 'https://open.er-api.com/v6/latest/INR';

export interface CurrencyMeta {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
];

export interface LiveRates {
  rates: Record<string, number>; // code → how many INR per 1 unit
  lastUpdated: string;
  source: string;
}

let cachedRates: LiveRates | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 min

/**
 * Fetches live exchange rates from open.er-api.com.
 * API returns rates relative to INR (e.g. 1 INR = 0.0118 USD).
 * We invert them to get: 1 USD = X INR (what users actually need).
 */
export async function fetchLiveRates(): Promise<LiveRates> {
  const now = Date.now();
  if (cachedRates && now - cacheTimestamp < CACHE_TTL) {
    return cachedRates;
  }

  try {
    const res = await fetch(FOREX_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // API returns: 1 INR = X foreign. We want 1 foreign = X INR.
    const inverted: Record<string, number> = {};
    for (const cur of CURRENCIES) {
      const foreignPerInr = data.rates?.[cur.code];
      if (foreignPerInr && foreignPerInr > 0) {
        inverted[cur.code] = Math.round((1 / foreignPerInr) * 100) / 100;
      }
    }

    cachedRates = {
      rates: inverted,
      lastUpdated: data.time_last_update_utc || new Date().toISOString(),
      source: 'open.er-api.com',
    };
    cacheTimestamp = now;
    return cachedRates;
  } catch (err) {
    // If we have stale cache, return it
    if (cachedRates) return cachedRates;
    throw err;
  }
}

/**
 * Convert foreign currency → INR using live rate.
 */
export function convertToInr(amount: number, rateToInr: number): number {
  return Math.round(amount * rateToInr * 100) / 100;
}

/**
 * Convert INR → foreign currency using live rate.
 */
export function convertFromInr(inrAmount: number, rateToInr: number): number {
  if (rateToInr === 0) return 0;
  return Math.round((inrAmount / rateToInr) * 100) / 100;
}

export interface SpendingRef {
  threshold: number;
  label: string;
}

export const SPENDING_REFS: SpendingRef[] = [
  { threshold: 25, label: 'Street masala chai ☕' },
  { threshold: 60, label: 'Samosa plate or tender coconut 🥥' },
  { threshold: 120, label: 'South Indian breakfast set 🥞' },
  { threshold: 350, label: 'Full thali meal (unlimited) 🍛' },
  { threshold: 650, label: 'Auto ride across city 🛺' },
  { threshold: 1500, label: 'Half-day licensed tour guide 🏛️' },
  { threshold: 3500, label: 'Heritage boutique stay / night 🏨' },
  { threshold: 8000, label: 'Full-day chauffeur sedan 🚘' },
];

export function getSpendingContext(inr: number): string {
  if (inr <= 0) return '';
  if (inr < 25) return 'Tip or small roadside purchase';
  let match = SPENDING_REFS[0];
  for (const ref of SPENDING_REFS) {
    if (inr >= ref.threshold) match = ref;
    else break;
  }
  const mult = Math.floor(inr / match.threshold);
  if (mult > 1 && mult <= 5) return `≈ ${mult}× ${match.label}`;
  return match.label;
}
