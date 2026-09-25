export interface GateTipItem {
  id: string;
  category: 'ticket' | 'shoe' | 'guide' | 'dress' | 'photo';
  icon: string;
  badge: string;
  badgeType: 'warning' | 'info' | 'success';
  title: string;
  summary: string;
  actionableAdvice: string;
}

export interface ASITicketTier {
  category: 'World Heritage (Tier A)' | 'Ticketed ASI Monument (Tier B)' | 'Non-Ticketed / Trust Entry';
  indianInr: number;
  foreignerInr: number;
  saarcInr: number;
  childPolicy: string;
}

export interface MonumentGateGuidelines {
  placeName: string;
  monumentType: 'temple' | 'derasar' | 'fort_palace' | 'stepwell_cave' | 'mausoleum' | 'general';
  ticketTier?: ASITicketTier;
  tips: GateTipItem[];
}

/**
 * Returns curated gate tips, scam warnings, and entry customs for a given monument.
 */
export function getMonumentGateGuidelines(
  placeName: string,
  category?: string
): MonumentGateGuidelines {
  const normName = (placeName || '').toLowerCase();
  const normCat = (category || '').toLowerCase();

  let monumentType: MonumentGateGuidelines['monumentType'] = 'general';

  if (normName.includes('derasar') || normName.includes('jain') || normCat.includes('derasar')) {
    monumentType = 'derasar';
  } else if (normName.includes('mandir') || normName.includes('temple') || normCat.includes('temple')) {
    monumentType = 'temple';
  } else if (normName.includes('fort') || normName.includes('palace') || normName.includes('mahal') || normName.includes('garh') || normCat.includes('fort')) {
    monumentType = 'fort_palace';
  } else if (
    normName.includes('vav') ||
    normName.includes('stepwell') ||
    normName.includes('baoli') ||
    normName.includes('kund') ||
    normName.includes('cave')
  ) {
    monumentType = 'stepwell_cave';
  } else if (
    normName.includes('tomb') ||
    normName.includes('masjid') ||
    normName.includes('mosque') ||
    normName.includes('dargah') ||
    normName.includes('roza')
  ) {
    monumentType = 'mausoleum';
  }

  // Official ASI Ticket Tiers
  let ticketTier: ASITicketTier;
  const isWorldHeritage =
    normName.includes('rani ki vav') ||
    normName.includes('champaner') ||
    normName.includes('dholavira') ||
    normName.includes('taj mahal') ||
    normName.includes('red fort') ||
    normName.includes('qutub') ||
    normName.includes('qutb') ||
    normName.includes('humayun') ||
    normName.includes('konark') ||
    normName.includes('ajanta') ||
    normName.includes('ellora') ||
    normName.includes('khajuraho') ||
    normName.includes('hampi') ||
    normName.includes('modhera');

  const isFreeReligiousTrust =
    normName.includes('somnath') ||
    normName.includes('dwarka') ||
    normName.includes('ambaji') ||
    normName.includes('palitana') ||
    normName.includes('akshardham') ||
    normName.includes('sidi saiyed') ||
    normName.includes('sidi bashir');

  if (isFreeReligiousTrust) {
    ticketTier = {
      category: 'Non-Ticketed / Trust Entry',
      indianInr: 0,
      foreignerInr: 0,
      saarcInr: 0,
      childPolicy: 'Free entry for all pilgrims and visitors',
    };
  } else if (isWorldHeritage) {
    ticketTier = {
      category: 'World Heritage (Tier A)',
      indianInr: 50,
      foreignerInr: 600,
      saarcInr: 50,
      childPolicy: 'Children under 15 years enter FREE with age proof',
    };
  } else {
    ticketTier = {
      category: 'Ticketed ASI Monument (Tier B)',
      indianInr: 25,
      foreignerInr: 300,
      saarcInr: 25,
      childPolicy: 'Children under 15 years enter FREE with age proof',
    };
  }

  const commonTips: GateTipItem[] = [
    {
      id: 'official-ticket-tier',
      category: 'ticket',
      icon: 'payments',
      badge: ticketTier.category,
      badgeType: 'success',
      title: 'Official Govt Entry Tariff',
      summary:
        ticketTier.indianInr === 0
          ? 'Free sanctum entry maintained by temple trust.'
          : `Official ASI fee: Indian/SAARC ₹${ticketTier.indianInr}, Foreign tourists ₹${ticketTier.foreignerInr}.`,
      actionableAdvice:
        ticketTier.indianInr === 0
          ? 'Beware of bogus VIP pass sellers near outer lanes. General darshan queue is free.'
          : `Book cashless at asi.payumoney.com or gate QR boards for discount. ${ticketTier.childPolicy}.`,
    },
    {
      id: 'ticket-scam',
      category: 'ticket',
      icon: 'confirmation-number',
      badge: 'Scam Alert',
      badgeType: 'warning',
      title: 'Direct Turnstile Entry (Ignore Outside Touts)',
      summary: 'Touts often stand 100m outside claiming the monument is "closed for VIPs" or tickets are "sold out".',
      actionableAdvice: 'Walk directly to the official gate. If you booked online or have an ASI QR code, present it directly at the barcode turnstile.',
    },
    {
      id: 'shoe-deposit',
      category: 'shoe',
      icon: 'do-not-step',
      badge: 'Free by Law',
      badgeType: 'success',
      title: 'Official Shoe Deposit is 100% Free',
      summary: 'Private touts set up unauthorized stands outside charging ₹50–₹100 per pair.',
      actionableAdvice: 'Deposit your shoes inside the official ASI gate at the designated counter. It is legally free. Take your token and tip only if you wish (₹10 is standard). In summer, wear thick socks because stone courtyards get scorching hot!',
    },
    {
      id: 'guide-auth',
      category: 'guide',
      icon: 'badge',
      badge: 'Verified Guides Only',
      badgeType: 'info',
      title: 'Guide Verification & Free Yatra AI',
      summary: 'Beware of unregistered individuals who walk alongside you uninvited and later demand aggressive fees.',
      actionableAdvice: 'Official guides must wear a laminated Ministry of Tourism photo badge with a fixed rate chart. Or, put on your earbuds and use Yatra AI in this app for free, verified historical commentary.',
    },
    {
      id: 'photo-drone',
      category: 'photo',
      icon: 'photo-camera',
      badge: 'Strict Regulation',
      badgeType: 'warning',
      title: 'Photography, Tripods & Drone Ban',
      summary: 'Standard smartphone photography is allowed in open courtyards, but commercial equipment faces heavy fines.',
      actionableAdvice: 'DSLR tripods require prior written ASI permission. Flying drones within 500m of any national monument is illegal under DGCA regulations. Sanctum sanctorums strictly forbid all photography.',
    },
  ];

  // Specific custom additions based on monument type
  if (monumentType === 'derasar') {
    commonTips.unshift({
      id: 'derasar-etiquette',
      category: 'dress',
      icon: 'checkroom',
      badge: 'Strict Sacred Custom',
      badgeType: 'warning',
      title: 'Derasar Sanctity & Strict Leather Ban',
      summary: 'Jain Derasars strictly forbid all animal leather products inside.',
      actionableAdvice: 'Remove leather belts, purses, watch straps, and shoes before entering the temple compound. Modest white or respectful light attire is welcomed. Please do not carry foodstuffs or leather accessories past the porch.',
    });
  } else if (monumentType === 'stepwell_cave') {
    commonTips.unshift({
      id: 'stepwell-caution',
      category: 'shoe',
      icon: 'stairs',
      badge: 'Safety Caution',
      badgeType: 'warning',
      title: 'Steep Multi-Tier Stairs & Grip Footwear',
      summary: 'Historical subterranean stepwells have hundreds of narrow carved stone steps without modern handrails.',
      actionableAdvice: 'Wear rubber-soled gripping sneakers. Never step on wet algae near the lowest water level. Supervise children closely on open pavilion ledges.',
    });
  } else if (monumentType === 'temple') {
    commonTips.unshift({
      id: 'temple-etiquette',
      category: 'dress',
      icon: 'checkroom',
      badge: 'Mandatory Custom',
      badgeType: 'info',
      title: 'Sacred Sanctum Dress Code & Leather Ban',
      summary: 'Temples require modest attire with shoulders and knees covered.',
      actionableAdvice: 'Pure leather items (belts, wallets, jackets) are prohibited inside the inner sanctum of most historic temples. Wash hands and feet at the entrance before entering.',
    });
  } else if (monumentType === 'mausoleum') {
    commonTips.unshift({
      id: 'mausoleum-etiquette',
      category: 'dress',
      icon: 'face',
      badge: 'Mandatory Custom',
      badgeType: 'info',
      title: 'Head Covering & Respectful Silence',
      summary: 'Active shrines and mausoleums require silence and covered heads.',
      actionableAdvice: 'Carry a scarf or handkerchief to cover your head. Maintain respectful silence near prayer areas.',
    });
  }

  return {
    placeName,
    monumentType,
    ticketTier,
    tips: commonTips,
  };
}
