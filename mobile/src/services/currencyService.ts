const FOREX_API = 'https://open.er-api.com/v6/latest/USD';

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
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
];

export interface LiveRates {
  rates: Record<string, number>; // Currency code -> INR conversion rate (1 Unit = X INR)
  lastUpdated: string;
  source: string;
}

let cachedRates: LiveRates | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 min cache

/**
 * Fetches real-time live forex rates.
 * Base query is USD so we get high-precision rates against INR and all major currencies.
 */
export async function fetchLiveRates(): Promise<LiveRates> {
  const now = Date.now();
  if (cachedRates && now - cacheTimestamp < CACHE_TTL) {
    return cachedRates;
  }

  try {
    const res = await fetch(FOREX_API);
    if (!res.ok) throw new Error(`Forex API returned status ${res.status}`);
    const data = await res.json();

    const inrPerUsd = data.rates?.INR;
    if (!inrPerUsd || typeof inrPerUsd !== 'number') {
      throw new Error('Invalid rate payload: missing INR rate');
    }

    const rates: Record<string, number> = {};

    for (const cur of CURRENCIES) {
      if (cur.code === 'USD') {
        rates['USD'] = Math.round(inrPerUsd * 100) / 100;
      } else {
        const rateAgainstUsd = data.rates?.[cur.code];
        if (rateAgainstUsd && rateAgainstUsd > 0) {
          // 1 Cur = (1 / rateAgainstUsd) USD = (inrPerUsd / rateAgainstUsd) INR
          const inrVal = inrPerUsd / rateAgainstUsd;
          rates[cur.code] = Math.round(inrVal * 100) / 100;
        }
      }
    }

    cachedRates = {
      rates,
      lastUpdated: data.time_last_update_utc || new Date().toISOString(),
      source: 'Global Interbank Feed (open.er-api.com)',
    };
    cacheTimestamp = now;
    return cachedRates;
  } catch (err) {
    if (cachedRates) return cachedRates;
    throw err;
  }
}

/**
 * Converts foreign currency amount to INR.
 */
export function convertToInr(amount: number, rateToInr: number): number {
  if (!rateToInr || isNaN(amount)) return 0;
  return Math.round(amount * rateToInr * 100) / 100;
}

/**
 * Converts INR amount to foreign currency.
 */
export function convertFromInr(inrAmount: number, rateToInr: number): number {
  if (!rateToInr || rateToInr === 0 || isNaN(inrAmount)) return 0;
  return Math.round((inrAmount / rateToInr) * 100) / 100;
}
