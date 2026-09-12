export interface ReviewItem {
  id: string;
  placeId: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  badge: string;
  visitType: 'Family' | 'Solo' | 'Friends' | 'Couple';
  helpfulCount: number;
  createdAt: string;
}

export const CURATED_REVIEWS: Record<string, ReviewItem[]> = {
  'p1-laxmi-vilas': [
    {
      id: 'rev-lv-1',
      placeId: 'p1-laxmi-vilas',
      userName: 'Dr. Aarav Mehta',
      rating: 5,
      title: 'Breathtaking royal opulence – Four times Buckingham Palace!',
      comment: 'The Durbar Hall with Venetian chandeliers and Belgian stained-glass windows is mesmerizing. Make sure to take the audio guide narrated by the Gaekwad family; it provides incredible depth to the Indo-Saracenic craftsmanship.',
      badge: 'Verified Visitor',
      visitType: 'Family',
      helpfulCount: 48,
      createdAt: '2026-03-02T10:30:00Z',
    },
    {
      id: 'rev-lv-2',
      placeId: 'p1-laxmi-vilas',
      userName: 'Elena Rostova',
      rating: 5,
      title: 'Architectural marvel of Gujarat',
      comment: 'Major Mant’s vision blending Hindu, Islamic, and Gothic elements is unmatched. The sprawling 500-acre manicured golf course and peacocks roaming near the coronation throne made the morning visit unforgettable.',
      badge: 'Architecture Enthusiast',
      visitType: 'Solo',
      helpfulCount: 32,
      createdAt: '2026-02-18T14:15:00Z',
    },
    {
      id: 'rev-lv-3',
      placeId: 'p1-laxmi-vilas',
      userName: 'Kavita Patel',
      rating: 4,
      title: 'Majestic experience, visit early morning!',
      comment: 'Entry tickets are priced reasonably given the royal museum access. Photography inside the palace requires a pass, but the exterior courtyards and Maharaja armory exhibit are worth every penny.',
      badge: 'Local Guide',
      visitType: 'Couple',
      helpfulCount: 19,
      createdAt: '2026-01-29T11:00:00Z',
    },
    {
      id: 'rev-lv-4',
      placeId: 'p1-laxmi-vilas',
      userName: 'Rohan Deshmukh',
      rating: 5,
      title: 'The Raja Ravi Varma paintings are national treasures',
      comment: 'Seeing the original Raja Ravi Varma canvases commissioned by Maharaja Sayajirao III in person was a spiritual experience for an art lover. The museum collection alone deserves 2 hours.',
      badge: 'Heritage Historian',
      visitType: 'Friends',
      helpfulCount: 27,
      createdAt: '2026-01-14T16:45:00Z',
    },
  ],
  'p2-baroda-museum': [
    {
      id: 'rev-bm-1',
      placeId: 'p2-baroda-museum',
      userName: 'Sneha Banerjee',
      rating: 5,
      title: 'A massive 72-foot Blue Whale skeleton & European masterpieces!',
      comment: 'Established in 1894, this Victorian-style gallery is a hidden gem. The 72-foot blue whale skeleton suspended in the natural history wing is awe-inspiring for kids and adults alike.',
      badge: 'Verified Visitor',
      visitType: 'Family',
      helpfulCount: 35,
      createdAt: '2026-02-25T09:40:00Z',
    },
    {
      id: 'rev-bm-2',
      placeId: 'p2-baroda-museum',
      userName: 'Marcus Vance',
      rating: 4,
      title: 'Rare Asian bronzes and Egyptian mummy',
      comment: 'Extraordinary collection including Tibetan thangkas, Japanese porcelain, and a genuine ancient Egyptian mummy. Well preserved by the Department of Archaeology.',
      badge: 'Museum Scholar',
      visitType: 'Solo',
      helpfulCount: 22,
      createdAt: '2026-02-10T13:20:00Z',
    },
  ],
  'g-rani-ki-vav': [
    {
      id: 'rev-rkv-1',
      placeId: 'g-rani-ki-vav',
      userName: 'Vikramaditya Solanki',
      rating: 5,
      title: 'UNESCO World Heritage Stepwell – Subterranean Temple',
      comment: 'Built by Queen Udayamati in the 11th century, descending through the seven terraces feels like entering another dimension. The Sheshashayi Vishnu sculpture at the fourth level took my breath away.',
      badge: 'Verified Visitor',
      visitType: 'Family',
      helpfulCount: 64,
      createdAt: '2026-03-05T12:00:00Z',
    },
    {
      id: 'rev-rkv-2',
      placeId: 'g-rani-ki-vav',
      userName: 'Chloe Martin',
      rating: 5,
      title: 'Over 800 intricate sculptures preserved impeccably',
      comment: 'The craftsmanship of the Maru-Gurjara style is mind-blowing. The way water sanctification was turned into high religious art is unique in world architecture. Clean lawns and easy ASI ticketing.',
      badge: 'Global Nomad',
      visitType: 'Solo',
      helpfulCount: 41,
      createdAt: '2026-02-20T15:30:00Z',
    },
    {
      id: 'rev-rkv-3',
      placeId: 'g-rani-ki-vav',
      userName: 'Harshwardhan Joshi',
      rating: 5,
      title: 'Combine with Patan Patola handloom museum!',
      comment: 'After witnessing the stepwell, visit the Salvi weavers nearby. The AI companion route recommendations were spot on. Best lighting for photography is around 11 AM when sunlight hits the carvings.',
      badge: 'Local Guide',
      visitType: 'Friends',
      helpfulCount: 29,
      createdAt: '2026-01-18T10:15:00Z',
    },
  ],
  'g-modhera-sun-temple': [
    {
      id: 'rev-mst-1',
      placeId: 'g-modhera-sun-temple',
      userName: 'Ananya Sharma',
      rating: 5,
      title: 'Geometric perfection of Surya Kund',
      comment: 'The stepped tank with 108 miniature shrines is a wonder of Vedic geometry. Visit during equinox if you can, but even on normal days the reflection of the Sabha Mandap pillars on water is surreal.',
      badge: 'Verified Visitor',
      visitType: 'Couple',
      helpfulCount: 52,
      createdAt: '2026-03-01T08:15:00Z',
    },
    {
      id: 'rev-mst-2',
      placeId: 'g-modhera-sun-temple',
      userName: 'Rajesh Kulkarni',
      rating: 5,
      title: 'Evening light and sound show is world-class',
      comment: 'Solar-powered heritage site! The projection mapping in the evening brings 1026 AD Solanki history alive on the ancient stone carved facade.',
      badge: 'Heritage Enthusiast',
      visitType: 'Family',
      helpfulCount: 38,
      createdAt: '2026-02-14T19:00:00Z',
    },
  ],
  'g-adalaj-stepwell': [
    {
      id: 'rev-as-1',
      placeId: 'g-adalaj-stepwell',
      userName: 'Nisha Trivedi',
      rating: 5,
      title: 'Cool underground oasis of Solanki-Islamic harmony',
      comment: 'Temperature drops noticeably as you descend five storeys into the octagonal shaft. The fusion of Islamic floral motifs and Hindu iconography tells the heartbreaking tale of Queen Rudabai.',
      badge: 'Verified Visitor',
      visitType: 'Solo',
      helpfulCount: 44,
      createdAt: '2026-02-28T11:45:00Z',
    },
    {
      id: 'rev-as-2',
      placeId: 'g-adalaj-stepwell',
      userName: 'David Miller',
      rating: 5,
      title: 'A dream for architecture photographers',
      comment: 'The play of natural sunlight filtering through multi-tiered octagonal openings creates dramatic light beams. No entrance fee and very well maintained by ASI.',
      badge: 'Architecture Enthusiast',
      visitType: 'Friends',
      helpfulCount: 26,
      createdAt: '2026-02-08T09:30:00Z',
    },
  ],
  'p11-champaner-pavagadh': [
    {
      id: 'rev-cp-1',
      placeId: 'p11-champaner-pavagadh',
      userName: 'Dharmesh Shah',
      rating: 5,
      title: 'Jami Masjid’s symmetry and Pavagadh Ropeway trek',
      comment: 'The 16th-century capital of Sultan Mahmud Begada. The stone latticework of Jami Masjid and the steep ropeway ascent to Kalika Mata temple offer both spiritual fulfillment and historical awe.',
      badge: 'Verified Visitor',
      visitType: 'Family',
      helpfulCount: 39,
      createdAt: '2026-02-22T13:00:00Z',
    },
  ],
  'g-sabarmati-ashram': [
    {
      id: 'rev-sa-1',
      placeId: 'g-sabarmati-ashram',
      userName: 'Mohan Das',
      rating: 5,
      title: 'Profound peace on the banks of Sabarmati',
      comment: 'Walking into Hriday Kunj where Mahatma Gandhi lived and launched the Dandi March fills you with deep reverence. The tree-shaded courtyards and audio chronicles are very touching.',
      badge: 'Verified Visitor',
      visitType: 'Family',
      helpfulCount: 57,
      createdAt: '2026-03-04T16:00:00Z',
    },
  ],
  'g-somnath-temple': [
    {
      id: 'rev-st-1',
      placeId: 'g-somnath-temple',
      userName: 'Vaidehi Joshi',
      rating: 5,
      title: 'First among the twelve Jyotirlingas on the Arabian Sea',
      comment: 'The sound of crashing waves against the sanctum walls and the evening Aarti are deeply uplifting. The Baan Stambh (arrow pillar) indicating an unobstructed sea path to Antarctica is fascinating.',
      badge: 'Verified Visitor',
      visitType: 'Family',
      helpfulCount: 71,
      createdAt: '2026-03-06T18:30:00Z',
    },
  ],
  'g-dwarkadhish-temple': [
    {
      id: 'rev-dt-1',
      placeId: 'g-dwarkadhish-temple',
      userName: 'Gopal Krishna Bhat',
      rating: 5,
      title: 'Mokshapuri Dwarka – Spiritual grandeur of Jagat Mandir',
      comment: 'The 52-yard flag fluttering from the 78-meter tall spire is changed five times daily. Walking up the 56 steps from Gomti Ghat to Swarg Dwar is an unforgettable pilgrimage.',
      badge: 'Verified Visitor',
      visitType: 'Family',
      helpfulCount: 63,
      createdAt: '2026-02-27T08:00:00Z',
    },
  ],
  'p4-eme-temple': [
    {
      id: 'rev-eme-1',
      placeId: 'p4-eme-temple',
      userName: 'Major R. K. Nair',
      rating: 5,
      title: 'Futuristic geodesic dome honoring all faiths',
      comment: 'Built by the Corps of EME with aluminium alloy sheets, the dome incorporates Buddhist stupas, Christian spires, and Islamic motifs under Lord Shiva. Truly one of a kind in military heritage.',
      badge: 'Verified Visitor',
      visitType: 'Couple',
      helpfulCount: 31,
      createdAt: '2026-02-12T17:15:00Z',
    },
  ],
};

const VISITOR_NAMES = [
  'Aditi Rao', 'Kunal Verma', 'Pooja Bhatt', 'Tanya Iyer', 'Saurabh Nair',
  'Meera Chawla', 'Varun Kapoor', 'Devendra Yadav', 'Swati Deshpande', 'Arjun Saxena',
  'Bhavna Goswami', 'Chirag Singhania', 'Rhea Chakraborty', 'Naveen Menon', 'Ishaan Sengupta'
];

const REVIEW_TEMPLATES = [
  {
    rating: 5,
    title: 'Outstanding preservation & deep cultural roots',
    comment: 'Exploring this heritage landmark was one of the highlights of our journey. The historical significance is tangible in every carving and corridor. Highly recommend using the AI Audio guide for contextual stories!',
    badge: 'Verified Visitor',
    visitType: 'Family' as const,
  },
  {
    rating: 5,
    title: 'A true architectural treasure of India',
    comment: 'Incredible craftsmanship and majestic surroundings. Peaceful atmosphere in the morning hours. Captured stunning photos without the afternoon crowd. A must-visit landmark for heritage lovers.',
    badge: 'Heritage Enthusiast',
    visitType: 'Solo' as const,
  },
  {
    rating: 4,
    title: 'Rich chronicle and well organized site',
    comment: 'Very informative visit. The ASI info boards give great context and the local artisans nearby sell authentic traditional crafts. Worth spending at least 1-2 hours here.',
    badge: 'Local Guide',
    visitType: 'Friends' as const,
  },
  {
    rating: 5,
    title: 'Mesmerizing experience and tranquil environment',
    comment: 'The symmetry and masonry work left us spellbound. Such places remind us of the unparalleled civilizational legacy preserved through the ages. Clean facilities and helpful staff.',
    badge: 'Verified Visitor',
    visitType: 'Couple' as const,
  },
  {
    rating: 4,
    title: 'Great historical landmark, very scenic',
    comment: 'A magnificent heritage gem. Best to plan your visit around early morning or golden hour before sunset for the best lighting and pleasant weather.',
    badge: 'Architecture Enthusiast',
    visitType: 'Family' as const,
  }
];

export function getReviewsForPlace(placeId: string, placeName: string = 'Monument', baseRating: number = 4.6): ReviewItem[] {
  if (CURATED_REVIEWS[placeId] && CURATED_REVIEWS[placeId].length > 0) {
    return CURATED_REVIEWS[placeId];
  }

  // Generate deterministic realistic reviews for any place
  let hash = 0;
  for (let i = 0; i < placeId.length; i++) {
    hash = (hash << 5) - hash + placeId.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  const count = 3 + (seed % 3); // 3 to 5 reviews
  const reviews: ReviewItem[] = [];

  for (let i = 0; i < count; i++) {
    const nameIdx = (seed + i * 3) % VISITOR_NAMES.length;
    const templateIdx = (seed + i) % REVIEW_TEMPLATES.length;
    const template = REVIEW_TEMPLATES[templateIdx];
    const daysAgo = 3 + ((seed * 7 + i * 13) % 45);
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const ratingScore = Math.min(5, Math.max(3, Math.round((baseRating + (i % 2 === 0 ? 0.2 : -0.3)) * 10) / 10));

    reviews.push({
      id: `rev-${placeId}-${i + 1}`,
      placeId,
      userName: VISITOR_NAMES[nameIdx],
      rating: ratingScore >= 4.5 ? 5 : 4,
      title: `${template.title} - ${placeName}`,
      comment: template.comment.replace('this heritage landmark', placeName),
      badge: template.badge,
      visitType: template.visitType,
      helpfulCount: 12 + ((seed + i * 17) % 35),
      createdAt: date,
    });
  }

  return reviews;
}
