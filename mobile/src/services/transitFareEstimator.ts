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
    gujarati?: string;
    gujaratiPronunciation?: string;
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
  state?: string,
  distanceKm?: number
): FareEstimate {
  const normalizedCity = (city || '').toLowerCase().trim();
  const isMetro = METRO_CITIES.some((m) => normalizedCity.includes(m));
  const validDist = typeof distanceKm === 'number' && !isNaN(distanceKm) && distanceKm > 0 ? distanceKm : undefined;

  if (isMetro) {
    let autoRange = '₹60 – ₹120';
    let cabRange = '₹180 – ₹320 (AC Cab)';
    let sharedRange = '₹15 – ₹25 (Metro / E-Rickshaw)';

    if (validDist) {
      const minAuto = Math.max(30, Math.round(25 + Math.max(0, validDist - 1.5) * 15));
      const maxAuto = Math.max(45, Math.round(minAuto * 1.3));
      autoRange = `₹${minAuto} – ₹${maxAuto}`;

      const minCab = Math.max(100, Math.round(60 + Math.max(0, validDist - 2) * 19));
      const maxCab = Math.max(130, Math.round(minCab * 1.28));
      cabRange = `₹${minCab} – ₹${maxCab} (AC Cab)`;

      if (validDist > 6) {
        sharedRange = '₹30 – ₹50 (Metro / City Bus)';
      }
    }

    return {
      zoneType: 'metro',
      isAppRidePrevalent: true,
      hubName: 'Nearest Metro / Rail Station',
      autoPrivateRange: autoRange,
      sharedTransitRange: sharedRange,
      prepaidTaxiRange: cabRange,
      bargainingTips: [
        'App rides (Uber & Rapido) have standard pricing without meter haggling.',
        'If hailing street autos, ask: "Meter chalu kijiye" (Run the meter by law).',
        'Late-night rides (11 PM – 5 AM) legally have a +25% night surcharge over the meter.',
      ],
      localPhrase: {
        english: 'Please run the meter.',
        hindi: 'कृपया मीटर चालू कीजिए।',
        pronunciation: 'Kripya meter chaaloo kijiye.',
        gujarati: 'મહેરબાની કરીને મીટર ચાલુ કરો.',
        gujaratiPronunciation: 'Maherbani kari ne meter chalu karo.',
      },
    };
  }

  // Regional / Rural Heritage Town (Patan, Modhera, Hampi, Khajuraho, Champaner, etc.)
  let regionalAutoRange = '₹70 – ₹140';
  let regionalSharedRange = '₹20 – ₹40 (Shared Jeep / Chhakda)';
  let regionalTaxiRange = '₹350 – ₹600 (Private Taxi / Sumo)';

  if (validDist) {
    const minAuto = Math.max(40, Math.round(30 + Math.max(0, validDist - 1.5) * 17));
    const maxAuto = Math.max(60, Math.round(minAuto * 1.35));
    regionalAutoRange = `₹${minAuto} – ₹${maxAuto}`;

    const minTaxi = Math.max(250, Math.round(150 + validDist * 22));
    const maxTaxi = Math.max(350, Math.round(minTaxi * 1.3));
    regionalTaxiRange = `₹${minTaxi} – ₹${maxTaxi} (Private Taxi / Sumo)`;

    if (validDist > 10) {
      regionalSharedRange = '₹40 – ₹80 (Regional Bus / Shared Jeep)';
    }
  }

  return {
    zoneType: 'regional',
    isAppRidePrevalent: false,
    hubName: 'Nearest Bus Stand / Town Railway Station',
    autoPrivateRange: regionalAutoRange,
    sharedTransitRange: regionalSharedRange,
    fullDayAutoRange: validDist && validDist > 25 ? '₹900 – ₹1,400 (Full Day Circuit)' : '₹650 – ₹950 (3–4 Heritage Sites)',
    prepaidTaxiRange: regionalTaxiRange,
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
      gujarati: 'ત્યાં સુધીનું કેટલું લેશો? એંસી રૂપિયામાં ચાલો.',
      gujaratiPronunciation: 'Tyan sudhinu ketlu lesho? Ensi rupiyama chalo.',
    },
  };
}
