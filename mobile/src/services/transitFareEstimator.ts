export interface FareEstimate {
  zoneType: 'metro' | 'regional';
  isAppRidePrevalent: boolean;
  hubName: string;
  autoPrivateRange: string;
  sharedTransitRange?: string;
  fullDayAutoRange?: string;
  prepaidTaxiRange?: string;
  bargainingTips: string[];
  localPhrase: {
    english: string;
    hindi: string;
    pronunciation: string;
  };
}

const METRO_CITIES = [
  'delhi',
  'new delhi',
  'mumbai',
  'bengaluru',
  'bangalore',
  'hyderabad',
  'chennai',
  'kolkata',
  'ahmedabad',
  'pune',
  'jaipur',
  'surat',
  'lucknow',
];

/**
 * Calculates regional transit benchmarks and anti-gouging guidelines for any monument.
 */
export function estimateTransitFares(
  placeName: string,
  city?: string,
  state?: string
): FareEstimate {
  const normalizedCity = (city || '').toLowerCase().trim();
  const isMetro = METRO_CITIES.some((m) => normalizedCity.includes(m));

  if (isMetro) {
    return {
      zoneType: 'metro',
      isAppRidePrevalent: true,
      hubName: 'Nearest Metro / Rail Station',
      autoPrivateRange: '₹60 – ₹120',
      sharedTransitRange: '₹15 – ₹25 (Metro / E-Rickshaw)',
      prepaidTaxiRange: '₹180 – ₹320 (AC Cab)',
      bargainingTips: [
        'App rides (Uber & Rapido) have standard pricing without meter haggling.',
        'If hailing street autos, ask: "Meter chalu kijiye" (Run the meter by law).',
        'Late-night rides (11 PM – 5 AM) legally have a +25% night surcharge over the meter.',
      ],
      localPhrase: {
        english: 'Please run the meter.',
        hindi: 'कृपया मीटर चालू कीजिए।',
        pronunciation: 'Kripya meter chaaloo kijiye.',
      },
    };
  }

  // Regional / Rural Heritage Town (Patan, Modhera, Hampi, Khajuraho, Champaner, etc.)
  return {
    zoneType: 'regional',
    isAppRidePrevalent: false,
    hubName: 'Nearest Bus Stand / Town Railway Station',
    autoPrivateRange: '₹70 – ₹140',
    sharedTransitRange: '₹20 – ₹40 (Shared Jeep / Chhakda)',
    fullDayAutoRange: '₹650 – ₹950 (3–4 Heritage Sites)',
    prepaidTaxiRange: '₹350 – ₹600 (Private Taxi / Sumo)',
    bargainingTips: [
      'App cabs may have 0 drivers here. Local autos and shared tempos dominate.',
      'Settle the EXACT total fare before stepping in. Confirm if it is per person or total.',
      'For shared autos (tum-tum/chhakda), ask co-passengers what they paid to verify fair rate.',
      'Hiring an auto for 4–5 hours to cover multiple nearby temples is usually cheaper than one-way rides.',
    ],
    localPhrase: {
      english: 'How much for the monument? Let’s settle on ₹80.',
      hindi: 'वहां तक का कितना लोगे? अस्सी रुपये में चलो।',
      pronunciation: 'Vahan tak ka kitna loge? Assi rupaye mein chalo.',
    },
  };
}
