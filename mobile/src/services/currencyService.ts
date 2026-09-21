export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rateToInr: number; // How many INR is 1 unit of this currency
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateToInr: 86.5 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateToInr: 91.2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rateToInr: 108.5 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rateToInr: 54.8 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', rateToInr: 60.5 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rateToInr: 0.56 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', rateToInr: 64.2 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪', rateToInr: 23.55 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', rateToInr: 11.9 },
  { code: 'CHF', symbol: 'Fr.', name: 'Swiss Franc', flag: '🇨🇭', rateToInr: 96.4 },
];

export interface PurchasingPowerItem {
  thresholdInr: number;
  label: string;
  icon: string;
}

export const PURCHASING_POWER_BENCHMARKS: PurchasingPowerItem[] = [
  { thresholdInr: 25, label: 'Street Cutting Masala Chai ☕', icon: 'local-cafe' },
  { thresholdInr: 60, label: 'Fresh Tender Coconut or Samosa Snack 🥥', icon: 'fastfood' },
  { thresholdInr: 120, label: 'Purified Water + Light South Indian Breakfast 🥞', icon: 'restaurant' },
  { thresholdInr: 350, label: 'Unlimited AC Traditional Heritage Thali Meal 🍛', icon: 'dining' },
  { thresholdInr: 650, label: 'Cross-Town Auto-Rickshaw Ride across Historic City 🛺', icon: 'local-taxi' },
  { thresholdInr: 1500, label: 'Private Licensed ASI Tour Guide Half-Day 🏛️', icon: 'badge' },
  { thresholdInr: 3500, label: 'Authentic Heritage Haveli Boutique Stay (1 Night) 🏨', icon: 'hotel' },
  { thresholdInr: 8000, label: 'Full Day Chauffeur AC Sedan & Monument Circuit 🚘', icon: 'directions-car' },
];

/**
 * Returns a tangible real-world purchasing power comparison in India for a given INR amount.
 */
export function getPurchasingPowerBenchmark(inrAmount: number): string {
  if (inrAmount <= 0) return 'Enter an amount to see Indian purchasing power.';
  if (inrAmount < 25) return 'Sub-₹25: Small roadside tips or single chai.';

  let bestMatch = PURCHASING_POWER_BENCHMARKS[0];
  for (const item of PURCHASING_POWER_BENCHMARKS) {
    if (inrAmount >= item.thresholdInr) {
      bestMatch = item;
    } else {
      break;
    }
  }

  const multiplier = Math.floor(inrAmount / bestMatch.thresholdInr);
  if (multiplier > 1 && multiplier <= 5) {
    return `≈ ${multiplier}x ${bestMatch.label}`;
  }
  return `In India, this roughly buys: ${bestMatch.label}`;
}

/**
 * Converts foreign currency to INR.
 */
export function convertToInr(amount: number, currencyCode: string): number {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);
  if (!currency) return amount;
  return Math.round(amount * currency.rateToInr * 100) / 100;
}

/**
 * Converts INR to foreign currency.
 */
export function convertFromInr(inrAmount: number, currencyCode: string): number {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);
  if (!currency || currency.rateToInr === 0) return inrAmount;
  return Math.round((inrAmount / currency.rateToInr) * 100) / 100;
}
