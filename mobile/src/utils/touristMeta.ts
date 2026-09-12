// Tourist Utility: Live Weather, Dynamic Crowd Level, Artisans & Emergency SOS

export interface WeatherInfo {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  advisory: string;
}

export interface CrowdInfo {
  level: 'Low' | 'Moderate' | 'Peak';
  color: string;
  waitTimeMins: number;
  waitTime: string;
  badge: string;
  description: string;
}

export interface ArtisanItem {
  id: string;
  name: string;
  craftType: string;
  description: string;
  giTag: boolean;
  bazaar: string;
}

export interface CulinaryItem {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  popularDish: string;
}

export interface EmergencyContact {
  title: string;
  number: string;
  icon: string;
  description: string;
}

// Emergency Helplines (Official Govt of India)
export const EMERGENCY_HELPLINES: EmergencyContact[] = [
  {
    title: 'National Tourist Helpline',
    number: '1363',
    icon: 'support-agent',
    description: '24/7 Toll-Free Multi-lingual guidance (12 languages supported by Ministry of Tourism)',
  },
  {
    title: 'National Emergency / Police',
    number: '112',
    icon: 'local-police',
    description: 'Unified Emergency Response Support System (ERSS)',
  },
  {
    title: 'Medical Ambulance',
    number: '108',
    icon: 'medical-services',
    description: 'Emergency Medical & Trauma Services across India & Gujarat',
  },
  {
    title: 'Women Safety Helpline',
    number: '1091',
    icon: 'shield',
    description: 'Specialized 24x7 safety assistance for female travelers',
  },
];

// Weather calculation based on latitude, longitude and current hour
export function getLiveWeather(lat: number = 22.3, lon: number = 73.2): WeatherInfo {
  const hour = new Date().getHours();
  
  let baseTemp = 28;
  if (lat > 28) baseTemp = 24; // North India / Hills cooler
  if (lat < 15) baseTemp = 30; // Coastal South India warmer
  
  let tempDelta = 0;
  if (hour >= 5 && hour < 9) tempDelta = -4;
  else if (hour >= 9 && hour < 12) tempDelta = 1;
  else if (hour >= 12 && hour < 16) tempDelta = 4;
  else if (hour >= 16 && hour < 19) tempDelta = 2;
  else tempDelta = -3;
  
  const temp = Math.round(baseTemp + tempDelta);
  
  let condition = 'Clear Sky';
  let icon = 'wb-sunny';
  let advisory = 'Pleasant sightseeing weather. Carry water and walking footwear.';
  
  if (hour >= 11 && hour <= 15) {
    condition = 'Warm & Sunny';
    icon = 'brightness-5';
    advisory = 'Sun protection advised. Consider exploring shaded indoor galleries or stepwells.';
  } else if (hour >= 16 && hour <= 19) {
    condition = 'Golden Hour';
    icon = 'wb-twilight';
    advisory = 'Best lighting for heritage photography and exterior monument walks.';
  } else if (hour >= 19 || hour < 6) {
    condition = 'Pleasant Evening';
    icon = 'nightlight-round';
    advisory = 'Check evening illumination timings and light & sound show schedules.';
  }

  return {
    temp,
    condition,
    icon,
    humidity: 55,
    advisory,
  };
}

// Crowd density level based on day of week and hour
export function getLiveCrowd(placeName?: string): CrowdInfo {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const isWeekend = day === 0 || day === 6;

  if (hour < 8 || hour >= 18) {
    return {
      level: 'Low',
      color: '#4CAF50',
      waitTimeMins: 5,
      waitTime: '0-5 min',
      badge: '🟢 Low Crowd',
      description: 'Minimal queue. Excellent time for photography.',
    };
  }

  if (isWeekend) {
    if (hour >= 10 && hour <= 16) {
      return {
        level: 'Peak',
        color: '#EF5350',
        waitTimeMins: 25,
        waitTime: '25-40 min',
        badge: '🔴 Peak Rush',
        description: 'Weekend peak rush. Online ASI e-ticket recommended to bypass line.',
      };
    }
    return {
      level: 'Moderate',
      color: '#FFA726',
      waitTimeMins: 12,
      waitTime: '10-20 min',
      badge: '🟡 Moderate Flow',
      description: 'Steady visitor flow. Queues moving smoothly.',
    };
  } else {
    if (hour >= 11 && hour <= 14) {
      return {
        level: 'Moderate',
        color: '#FFA726',
        waitTimeMins: 10,
        waitTime: '10-15 min',
        badge: '🟡 Moderate Flow',
        description: 'Moderate weekday footfall. Comfortable entry.',
      };
    }
    return {
      level: 'Low',
      color: '#4CAF50',
      waitTimeMins: 5,
      waitTime: '0-5 min',
      badge: '🟢 Low Crowd',
      description: 'Light visitor crowd. Fast entry at ticket check counters.',
    };
  }
}

// Curated regional artisans & GI crafts
export function getArtisansForPlace(placeName: string = '', stateOrCity: string = ''): ArtisanItem[] {
  const lower = (placeName + ' ' + stateOrCity).toLowerCase();

  if (lower.includes('patan') || lower.includes('rani ki vav')) {
    return [
      {
        id: 'art-1',
        name: 'Patan Patola Double-Ikat Silk Weaving',
        craftType: 'Heritage Handloom Textile',
        description: 'Rare 800-year-old geometric double-ikat silk weave crafted by master Salvi weavers using natural dyes.',
        giTag: true,
        bazaar: 'Patan Patola Heritage Museum & Salvivad Bazaar',
      },
      {
        id: 'art-2',
        name: 'Patan Clay Toys & Terracotta',
        craftType: 'Folk Terracotta Art',
        description: 'Hand-molded rustic clay figurines and terracotta cookware created by local artisan potters.',
        giTag: false,
        bazaar: 'Old Patan Market',
      },
    ];
  }

  if (lower.includes('vadodara') || lower.includes('laxmi vilas') || lower.includes('baroda')) {
    return [
      {
        id: 'art-3',
        name: 'Sankheda Lacquered Teakwood Craft',
        craftType: 'Royal Furniture Art',
        description: 'Turned teakwood furniture coated in vibrant red, gold, and herbal resin lacquer originated in the Baroda Gaekwad courts.',
        giTag: true,
        bazaar: 'Raopura Heritage Craft Emporium, Vadodara',
      },
      {
        id: 'art-4',
        name: 'Chhota Udepur Pithora Wall Paintings',
        craftType: 'Sacred Tribal Murals',
        description: 'Ritualistic folk paintings depicting horses and tribal deities painted with natural mineral pigments by Rathwa artisans.',
        giTag: true,
        bazaar: 'Tribal Research & Heritage Museum Bazaar',
      },
    ];
  }

  if (lower.includes('kutch') || lower.includes('bhuj') || lower.includes('dholavira')) {
    return [
      {
        id: 'art-5',
        name: 'Kutch Rogan Art & Castor Oil Painting',
        craftType: 'Rare Textile Heritage',
        description: 'Centuries-old freehand paint technique made from boiled castor oil residue and earth colors, preserved by the Khatri family of Nirona.',
        giTag: true,
        bazaar: 'Nirona Craft Village & Bhuj Craft Bazaar',
      },
      {
        id: 'art-6',
        name: 'Ajrakh Natural Block Printing',
        craftType: 'Hand Block Printing',
        description: 'Complex 16-step resist-dye printing using indigo, madder, and carved wooden blocks practiced in Ajrakhpur.',
        giTag: true,
        bazaar: 'Ajrakhpur Artisans Cooperative',
      },
    ];
  }

  if (lower.includes('ahmedabad') || lower.includes('sidi') || lower.includes('adalaj')) {
    return [
      {
        id: 'art-7',
        name: 'Ashavali Royal Brocade Sarees',
        craftType: 'Woven Brocade Textile',
        description: 'Pre-Mughal silk brocades interwoven with fine golden zari, featuring motifs inspired by stepwell carvings and jali patterns.',
        giTag: true,
        bazaar: 'Manek Chowk Heritage Market, Ahmedabad',
      },
    ];
  }

  return [
    {
      id: 'art-pan-1',
      name: 'Parchin Kari Stone & Marble Inlay Art',
      craftType: 'Semi-Precious Stone Inlay',
      description: 'Centuries-old pietra dura technique inlaying lapis lazuli, malachite, and carnelian into pure white marble blocks.',
      giTag: true,
      bazaar: 'Heritage Artisan Cooperative & Guild Markets',
    },
    {
      id: 'art-pan-2',
      name: 'Traditional Brass & Metal Casting',
      craftType: 'Lost-Wax Metallurgy',
      description: 'Direct-from-artisan bell metal and bronze artifacts created using ancient Dhokra and lost-wax casting methods.',
      giTag: true,
      bazaar: 'State Handloom & Handicrafts Emporium',
    },
  ];
}

// Curated regional culinary specialties
export function getFoodForPlace(placeName: string = '', stateOrCity: string = ''): CulinaryItem[] {
  const lower = (placeName + ' ' + stateOrCity).toLowerCase();

  if (lower.includes('gujarat') || lower.includes('vadodara') || lower.includes('patan') || lower.includes('modhera')) {
    return [
      {
        id: 'cul-1',
        name: 'Traditional Royal Gujarati Thali',
        cuisine: 'Authentic Gujarati Vegetarian',
        description: 'A grand balanced platter featuring Dal, Kadhi, 4 seasonal Shaaks, Rotla with Ghee, Farsan (Dhokla/Khandvi), and fresh Shrikhand.',
        popularDish: 'Undhiyu & Jalebi with Basundi',
      },
      {
        id: 'cul-2',
        name: 'Kathiyawadi Village Spiced Kitchen',
        cuisine: 'Saurashtra Rural Cuisine',
        description: 'Bold, slow-cooked claypot dishes cooked over wood fire, accompanied by bajra no rotlo and freshly churned white butter.',
        popularDish: 'Sev Tameta & Baingan Bharta with Chhas',
      },
    ];
  }

  return [
    {
      id: 'cul-3',
      name: 'Regional Heritage Street Food & Delicacies',
      cuisine: 'Traditional Regional Gastronomy',
      description: 'Famous local heritage treats perfected over generations by iconic sweetmeat confectioners and street culinary masters.',
      popularDish: 'Local Specialty Thali & Artisan Sweets',
    },
  ];
}
