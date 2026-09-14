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
    icon = 'wb-sunny';
    advisory = 'Sun protection advised. Consider exploring shaded indoor galleries or stepwells.';
  } else if (hour >= 16 && hour <= 19) {
    condition = 'Golden Hour';
    icon = 'flare';
    advisory = 'Best lighting for heritage photography and exterior monument walks.';
  } else if (hour >= 19 || hour < 6) {
    condition = 'Pleasant Evening';
    icon = 'nights-stay';
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

// Curated regional artisans & GI crafts covering all Indian heritage zones
export function getArtisansForPlace(placeName: string = '', stateOrCity: string = ''): ArtisanItem[] {
  const lower = (placeName + ' ' + stateOrCity).toLowerCase();

  // Kevadia / Narmada / Statue of Unity
  if (lower.includes('statue of unity') || lower.includes('kevadia') || lower.includes('ekta nagar') || lower.includes('narmada')) {
    return [
      {
        id: 'art-sou-1',
        name: 'Narmada Valley Bamboo & Teak Woodcraft',
        craftType: 'Eco-Artisan Woodcraft',
        description: 'Sustainable bamboo lanterns, carved teak artifacts, and natural fibre weaves crafted by local tribal collectives of Narmada district.',
        giTag: false,
        bazaar: 'Ekta Mall (Handicrafts of India) & Kevadia Tribal Haat',
      },
      {
        id: 'art-sou-2',
        name: 'Chhota Udepur Pithora Sacred Wall Art',
        craftType: 'Rathwa Tribal Heritage',
        description: 'Vibrant ceremonial folklore murals depicting equine deities and fertility blessings painted with natural mineral pigments.',
        giTag: true,
        bazaar: 'Ekta Mall Gujarat Pavilion & Narmada Craft Complex',
      },
    ];
  }

  // Patan & North Gujarat (Rani ki Vav)
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

  // Vadodara & Champaner
  if (lower.includes('vadodara') || lower.includes('laxmi vilas') || lower.includes('baroda') || lower.includes('champaner')) {
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

  // Kutch & Dholavira
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

  // Ahmedabad & Gandhinagar (Adalaj, Sidi Saiyyed, Hutheesing)
  if (lower.includes('ahmedabad') || lower.includes('sidi') || lower.includes('adalaj') || lower.includes('hutheesing') || lower.includes('sarkhej')) {
    return [
      {
        id: 'art-7',
        name: 'Ashavali Royal Brocade Sarees',
        craftType: 'Woven Brocade Textile',
        description: 'Pre-Mughal silk brocades interwoven with fine golden zari, featuring motifs inspired by stepwell carvings and jali patterns.',
        giTag: true,
        bazaar: 'Manek Chowk Heritage Market, Ahmedabad',
      },
      {
        id: 'art-8',
        name: 'Ahmedabad Wooden Block Carving',
        craftType: 'Hand Block Engraving',
        description: 'Master wood carvers hand-chiseling intricate teakwood blocks used for block-printed heritage fabrics.',
        giTag: false,
        bazaar: 'Law Garden Craft Market & Pethapur Workshops',
      },
    ];
  }

  // Rajasthan (Kumbhalgarh, Chittorgarh, Jaipur, Udaipur, Jodhpur, Jaisalmer)
  if (lower.includes('rajasthan') || lower.includes('kumbhalgarh') || lower.includes('chittorgarh') || lower.includes('jaipur') || lower.includes('udaipur') || lower.includes('jodhpur') || lower.includes('mehrangarh')) {
    return [
      {
        id: 'art-raj-1',
        name: 'Mewar Miniature Stone & Canvas Painting',
        craftType: 'Royal Court Art',
        description: 'Fine squirrel-hair brushwork depicting royal court chronicles, Maharana battles, and mythological epics using crushed gemstone pigments.',
        giTag: true,
        bazaar: 'Hathi Pol & City Palace Artisan Guilds, Udaipur',
      },
      {
        id: 'art-raj-2',
        name: 'Thewa 23K Gold-on-Glass Artwork',
        craftType: 'Royal Jewellery Craft',
        description: 'Ancient Rajasthani art of fusing intricately patterned 23-carat gold filigree sheets onto vibrant multi-colored Belgian glass.',
        giTag: true,
        bazaar: 'Johari Bazaar & Mewar Craft Emporium',
      },
    ];
  }

  // Agra & Uttar Pradesh (Taj Mahal, Agra Fort, Fatehpur Sikri, Varanasi)
  if (lower.includes('agra') || lower.includes('taj mahal') || lower.includes('uttar pradesh') || lower.includes('varanasi') || lower.includes('lucknow')) {
    return [
      {
        id: 'art-up-1',
        name: 'Agra Parchin Kari (Pietra Dura Marble Inlay)',
        craftType: 'Semi-Precious Gemstone Inlay',
        description: 'Direct descendants of the Mughal royal court craftsmen inlaying lapis lazuli, turquoise, and jasper into pure Makrana white marble.',
        giTag: true,
        bazaar: 'Fatehabad Road Artisan Arcades & Sadar Bazaar, Agra',
      },
      {
        id: 'art-up-2',
        name: 'Zari Zardozi Gold Wire Embroidery',
        craftType: 'Imperial Needlework Heritage',
        description: 'Opulent three-dimensional metallic thread embroidery hand-sewn onto velvets and silks using real silver and gold-plated coils.',
        giTag: true,
        bazaar: 'Kinari Bazaar, Old Agra & Chowk Artisan Guilds',
      },
    ];
  }

  // Delhi (Red Fort, Qutub Minar, Humayun Tomb)
  if (lower.includes('delhi') || lower.includes('qutub') || lower.includes('qutb') || lower.includes('red fort') || lower.includes('humayun')) {
    return [
      {
        id: 'art-del-1',
        name: 'Old Delhi Meenakari Enameling & Silver Filigree',
        craftType: 'Mughal Metallurgical Art',
        description: 'Delicate openwork filigree and vibrant enamel fusion over pure sterling silver perfected in the Shahjahanabad jewellers court.',
        giTag: true,
        bazaar: 'Dariba Kalan & Chandni Chowk Guild Market, Old Delhi',
      },
      {
        id: 'art-del-2',
        name: 'Dilli Haat Heritage Handloom & Terracotta',
        craftType: 'National Master Artisan Showcase',
        description: 'Rotating pan-Indian exhibitions of National Awardee weavers and master potters preserving ancient Indian craft traditions.',
        giTag: false,
        bazaar: 'Dilli Haat INA & Central Cottage Industries Emporium',
      },
    ];
  }

  // Karnataka (Hampi, Mysore, Badami, Pattadakal)
  if (lower.includes('karnataka') || lower.includes('hampi') || lower.includes('mysore') || lower.includes('badami') || lower.includes('pattadakal')) {
    return [
      {
        id: 'art-kar-1',
        name: 'Channapatna Lacquered Toy & Woodcraft',
        craftType: 'Ivory-Wood Turning Craft',
        description: 'Centuries-old turning woodcraft polished with organic vegetable dyes and edible turmeric lacquer, protected under GI status.',
        giTag: true,
        bazaar: 'Hampi Bazaar & Mysore Cauvery Handicrafts Emporium',
      },
      {
        id: 'art-kar-2',
        name: 'Bidriware Silver Inlay on Gunmetal',
        craftType: 'Ancient Metallurgical Inlay',
        description: 'Striking black zinc-copper alloy engraved with pure silver sheet inlays and oxidized with historic Bidar fort soil.',
        giTag: true,
        bazaar: 'Karnataka State Handicrafts Development Corporation',
      },
    ];
  }

  // Maharashtra (Ajanta, Ellora, Mumbai, Pune)
  if (lower.includes('maharashtra') || lower.includes('ajanta') || lower.includes('ellora') || lower.includes('aurangabad') || lower.includes('mumbai')) {
    return [
      {
        id: 'art-mah-1',
        name: 'Paithani Pure Silk & Zari Weaving',
        craftType: 'Ancient Royal Brocade',
        description: 'Regal handwoven silk sarees with peacock (Mor) pallu and oblique square borders woven on traditional tapestries since Satavahana era.',
        giTag: true,
        bazaar: 'Paithan Artisan Cluster & Aurangabad Handloom Center',
      },
      {
        id: 'art-mah-2',
        name: 'Himroo Cotton-Silk Brocade Weaving',
        craftType: 'Indo-Persian Fabric Heritage',
        description: 'Reversible figured brocades introduced under the Tughlaq dynasty featuring motifs from Ajanta and Ellora cave murals.',
        giTag: true,
        bazaar: 'Zafar Gate Himroo Weaving Center, Chhatrapati Sambhajinagar',
      },
    ];
  }

  // Odisha (Konark, Puri, Bhubaneswar)
  if (lower.includes('odisha') || lower.includes('orissa') || lower.includes('konark') || lower.includes('puri')) {
    return [
      {
        id: 'art-odi-1',
        name: 'Raghurajpur Pattachitra Cloth Scroll Art',
        craftType: 'Sacred Iconographic Heritage',
        description: 'Traditional scroll painting made on processed cotton cloth using natural stone pigments and tamarind gum, detailing celestial lore.',
        giTag: true,
        bazaar: 'Raghurajpur Heritage Crafts Village & Konark Sun Temple Arcades',
      },
      {
        id: 'art-odi-2',
        name: 'Pipli Appliqué Lanterns & Canopies',
        craftType: 'Ritualistic Canvas Embroidery',
        description: 'Geometric colored cloth patches cut and stitched onto ceremonial umbrellas and banners for the sacred Rath Yatra chariot festival.',
        giTag: true,
        bazaar: 'Pipli Craft Village, Puri-Bhubaneswar Corridor',
      },
    ];
  }

  // Madhya Pradesh (Khajuraho, Sanchi, Gwalior)
  if (lower.includes('madhya pradesh') || lower.includes('khajuraho') || lower.includes('sanchi') || lower.includes('gwalior')) {
    return [
      {
        id: 'art-mp-1',
        name: 'Chanderi Fine Silk & Gold Zari Weaving',
        craftType: 'Royal Transparent Muslin',
        description: 'Feather-light sheer handloom textiles woven with pure silk and silver-gilt thread since the Vedic and Bundela eras.',
        giTag: true,
        bazaar: 'Khajuraho Shilpgram & MP Mrignayani Emporium',
      },
      {
        id: 'art-mp-2',
        name: 'Tikamgarh Bell Metal & Dhokra Sculpture',
        craftType: 'Lost-Wax Bronze Art',
        description: 'Rustic hollow-cast brass deities, ritual oil lamps, and tribal horses shaped with beeswax and riverbed clay molds.',
        giTag: true,
        bazaar: 'Bundelkhand Artisan Guilds & Shilpgram Craft Market',
      },
    ];
  }

  // Tamil Nadu (Thanjavur, Mahabalipuram, Madurai)
  if (lower.includes('tamil nadu') || lower.includes('thanjavur') || lower.includes('tanjore') || lower.includes('mahabalipuram')) {
    return [
      {
        id: 'art-tn-1',
        name: 'Thanjavur 22K Gold Foil Relief Art',
        craftType: 'Classical South Indian Painting',
        description: 'Sacred icon panels prepared on solid teak planks with chalk-gesso relief work, studded with Jaipur gems and real gold leaf.',
        giTag: true,
        bazaar: 'Poompuhar Handicrafts Emporium & Brihadeeswarar Temple Bazaar',
      },
      {
        id: 'art-tn-2',
        name: 'Swamimalai Chola Bronze Casting',
        craftType: 'Ancient Lost-Wax Iconography',
        description: 'Panchaloha five-metal alloy statues sculpted according to strict Shilpa Shastra proportions by traditional sthapatis.',
        giTag: true,
        bazaar: 'Swamimalai Artisan Guilds & Thanjavur Art Gallery Market',
      },
    ];
  }

  // Dynamic fallback for any monument in India
  return [
    {
      id: 'art-pan-1',
      name: 'Parchin Kari Stone & Marble Relief Art',
      craftType: 'Classical Indian Stone Masonry',
      description: 'Centuries-old stone carving and semi-precious inlay technique preserving authentic regional architectural motifs.',
      giTag: true,
      bazaar: 'State Handloom & Handicrafts Emporium',
    },
    {
      id: 'art-pan-2',
      name: 'Traditional Bell Metal & Dhokra Metallurgy',
      craftType: 'Lost-Wax Artisan Heritage',
      description: 'Hollow-cast bronze artifacts, sacred temple bells, and decorative figures crafted by indigenous Indian metal smiths.',
      giTag: true,
      bazaar: 'Heritage Artisan Cooperative & Guild Markets',
    },
  ];
}

// Curated regional culinary specialties covering all Indian heritage zones
export function getFoodForPlace(placeName: string = '', stateOrCity: string = ''): CulinaryItem[] {
  const lower = (placeName + ' ' + stateOrCity).toLowerCase();

  // Kevadia / Narmada / Statue of Unity
  if (lower.includes('statue of unity') || lower.includes('kevadia') || lower.includes('ekta nagar') || lower.includes('narmada')) {
    return [
      {
        id: 'cul-sou-1',
        name: 'Narmada Valley Tribal Organic Feast',
        cuisine: 'Tribal Eco-Gastronomy',
        description: 'Traditional woodfire-cooked rustic meal featuring smoked Tuver Dal, fresh Jowar-Bajra rotla, garlic-chili chutney, and wild bamboo shoot stir-fry.',
        popularDish: 'Smoked Dal Bafla with Desi Ghee & Makai Rotla',
      },
      {
        id: 'cul-sou-2',
        name: 'Ekta Nagar Grand Multi-Cuisine Food Court',
        cuisine: 'Pan-Indian Heritage Cuisines',
        description: 'Curated dining hubs at the Statue of Unity showcasing state-authentic platters from Punjab, Gujarat, Bengal, and Tamil Nadu.',
        popularDish: 'Gujarati Farsan Platter & Royal Kesar Shrikhand',
      },
    ];
  }

  // Gujarat
  if (lower.includes('gujarat') || lower.includes('vadodara') || lower.includes('patan') || lower.includes('modhera') || lower.includes('ahmedabad') || lower.includes('somnath') || lower.includes('kutch')) {
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

  // Rajasthan
  if (lower.includes('rajasthan') || lower.includes('kumbhalgarh') || lower.includes('chittorgarh') || lower.includes('jaipur') || lower.includes('udaipur') || lower.includes('jodhpur')) {
    return [
      {
        id: 'cul-raj-1',
        name: 'Authentic Mewari Dal Baati Churma',
        cuisine: 'Royal Rajputana Gastronomy',
        description: 'Hard wheat flour dough balls baked over coal embers, drenched in pure desi ghee, served with five-lentil Panchmel dal and sweetened jaggery churma.',
        popularDish: 'Dal Baati Churma with Gatte ki Sabzi',
      },
      {
        id: 'cul-raj-2',
        name: 'Marwari Ker Sangri & Pyaaz Kachori',
        cuisine: 'Desert Herb & Street Flavors',
        description: 'Tangy desert berry and wild bean preparation seasoned with dry mango powder, paired with flaky crisp onion kachoris and Ghevar.',
        popularDish: 'Ker Sangri with Bajra Roti & Mawa Ghevar',
      },
    ];
  }

  // Delhi & Agra / Uttar Pradesh
  if (lower.includes('agra') || lower.includes('taj mahal') || lower.includes('delhi') || lower.includes('uttar pradesh') || lower.includes('varanasi') || lower.includes('lucknow')) {
    return [
      {
        id: 'cul-up-1',
        name: 'Imperial Mughal Dum Gastronomy',
        cuisine: 'Awadhi & Mughlai Royal Cuisine',
        description: 'Aromatic slow-cooked biryanis, rich cashew gravies, and saffron-infused breads perfected in the imperial kitchens of Shah Jahan and Akbar.',
        popularDish: 'Shahi Paneer / Dum Biryani with Sheermal & Roomali Roti',
      },
      {
        id: 'cul-up-2',
        name: 'Historic Old City Street Confectionery',
        cuisine: 'Heritage Street Food',
        description: 'Famous crispy Bedmi Puri with spicy hing aaloo sabzi, paired with legendary melt-in-mouth Agra Angoori Petha and Banarasi Malaiyo.',
        popularDish: 'Agra Kesar Petha & Bedmi Aloo with Rabri Jalebi',
      },
    ];
  }

  // Karnataka / South India
  if (lower.includes('karnataka') || lower.includes('hampi') || lower.includes('mysore') || lower.includes('tamil nadu') || lower.includes('thanjavur')) {
    return [
      {
        id: 'cul-kar-1',
        name: 'Royal Mysore & Vijayanagara Heritage Platter',
        cuisine: 'Traditional Karnataka Gastronomy',
        description: 'Aromatic Bisi Bele Bath laced with ghee, Davanagere butter dosas, and crispy Medu Vadas served on fresh plantain leaves with coconut chutney.',
        popularDish: 'Authentic Mysore Pak & Bisi Bele Bath',
      },
      {
        id: 'cul-kar-2',
        name: 'South Indian Filter Kaapi & Tiffin Treats',
        cuisine: 'Heritage Cafe Culture',
        description: 'Frothy chicory-blended filter coffee brewed in brass dabarah-tumbler, accompanied by steaming hot melt-in-mouth ghee podi idlis.',
        popularDish: 'Filter Coffee with Ghee Podi Idli & Masala Dosa',
      },
    ];
  }

  // Maharashtra
  if (lower.includes('maharashtra') || lower.includes('ajanta') || lower.includes('ellora') || lower.includes('mumbai') || lower.includes('pune')) {
    return [
      {
        id: 'cul-mah-1',
        name: 'Traditional Maharashtrian Thali & Puran Poli',
        cuisine: 'Authentic Marathi Gastronomy',
        description: 'Sweet jaggery and chana dal stuffed wholewheat flatbread served with aromatic Katachi Amti, Matki Usal, and steamed rice with ghee.',
        popularDish: 'Warm Puran Poli with Katachi Amti & Ghee',
      },
      {
        id: 'cul-mah-2',
        name: 'Deccan Spiced Street Flavors & Modak',
        cuisine: 'Spiced Regional Street Gastronomy',
        description: 'Fiery sprouted-bean Misal topped with farsan, fresh onions, and pav, followed by auspicious steamed coconut-jaggery Ukdiche Modak.',
        popularDish: 'Kolhapuri Misal Pav & Ukdiche Modak',
      },
    ];
  }

  // Dynamic fallback for any other heritage site in India
  return [
    {
      id: 'cul-pan-1',
      name: 'Regional Heritage Thali & Artisanal Sweets',
      cuisine: 'Traditional Regional Gastronomy',
      description: 'Nutritious balanced multi-course meal prepared according to authentic regional recipes using indigenous spices and woodfire cookware.',
      popularDish: 'State Heritage Platter with Local Artisan Dessert',
    },
    {
      id: 'cul-pan-2',
      name: 'Historic Bazaar Street Delicacies & Tea',
      cuisine: 'Traditional Street Confectionery',
      description: 'Famous local heritage delicacies perfected over generations by iconic sweetmeat confectioners and street culinary masters.',
      popularDish: 'Claypot Chai with Crisp Regional Savouries',
    },
  ];
}
