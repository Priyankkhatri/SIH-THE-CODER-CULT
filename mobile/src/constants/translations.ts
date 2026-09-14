// Comprehensive Multilingual Dictionary: English, Hindi, Gujarati
export type Language = 'en' | 'hi' | 'gu';

export const TRANSLATIONS = {
  en: {
    // Navigation / Tabs
    tabs: {
      home: 'Home',
      explore: 'Explore',
      aiGuide: 'AI Guide',
      plan: 'Plan',
      profile: 'Profile',
    },

    // Common
    common: {
      all: 'All',
      km: 'km',
      kmAway: 'km away',
      loading: 'Loading...',
      locating: 'Locating...',
      back: 'Back',
      goBack: '← Go back',
      error: 'Error',
      retry: 'Retry',
      cancel: 'Cancel',
      save: 'Save',
      next: 'Next',
      getStarted: 'Get Started',
      skip: 'Skip',
      guestMode: 'Guest Mode',
      directions: 'Directions',
      listen: 'Listen',
      stop: 'Stop',
      askAi: 'Ask AI',
      identify: 'Identify',
      details: 'Details',
      viewDetails: 'View Details',
      openHours: 'Hours',
      scanAgain: 'Scan Again',
    },

    // Categories
    categories: {
      all: 'All',
      heritage: 'Heritage',
      museum: 'Museums',
      culture: 'Culture',
      food: 'Food',
      activity: 'Activities',
    },

    // Home
    home: {
      headerTitle: 'Yatra Heritage',
      headerSubtitle: 'Discover India\'s Timeless Wonders',
      quickActions: 'Quick Actions',
      exploreMap: 'Explore Map',
      askAiGuide: 'Ask AI',
      identifyArtifact: 'Identify',
      planHeritageTour: 'Plan Trip',
      nearbyHeritageSites: 'Nearby Heritage Sites',
      allNearbyPlaces: 'All Nearby Places',
      placesCount: 'places',
      discoveringHeritage: 'Discovering heritage sites...',
      noPlacesFound: 'No places found in this category',
      searchPlaceholder: 'Search monuments, palaces, temples...',
    },

    // Place Details
    place: {
      minuteStoryBadge: '⭐ 2-Minute Heritage Story',
      architecturalDetails: '🏛️ Architectural Details',
      completeHistory: '📖 Complete History',
      historicalSignificance: '🎯 Historical Significance',
      keyFacts: '✨ Key Facts',
      verifiedSources: '📚 Verified Sources',
      verifiedReferencesCount: 'Found {count} verified historical references',
      loadingInfo: 'Loading heritage information...',
      recordNotFound: 'Heritage record not found',
      audioGuide: 'Audio Guide',
      rating: 'Rating',
      period: 'Period',
    },

    // Explore / Map
    explore: {
      exploreSites: 'Explore heritage sites',
      radarTitle: 'Heritage Radar',
      radarActive: 'Radar Scan Active',
      placesInRange: 'Places in Radar Range',
      tapToInspect: 'Tap a place below to inspect details',
      viewStory: 'View Heritage Story',
      myLocation: 'My Location',
      distance: 'Distance',
    },

    // AI Chat
    ai: {
      title: 'AI Heritage Guide',
      subtitle: 'Ask anything about Vadodara heritage',
      contextBadge: 'Context: {name}',
      clearContext: 'Clear Context',
      inputPlaceholder: 'Ask a question about heritage...',
      send: 'Send',
      clearChat: 'Clear',
      typingText: 'AI is crafting verified answer...',
      suggestedQuestions: 'Suggested Questions',
      verifiedSourceBadge: 'Verified Sources',
      modes: {
        short: '⚡ Short',
        detailed: '📖 Detailed',
        child: '🧒 Kids',
        narrative: '📜 Story',
      },
      defaultSuggestions: [
        'What are the top heritage sites in Vadodara?',
        'Tell me about the Gaekwad dynasty',
        'History of Champaner-Pavagadh',
        'Explain Gujarat architecture styles',
      ],
    },

    // Camera / Vision
    camera: {
      title: 'Heritage Lens',
      pointCameraHint: 'Point camera at a heritage artifact',
      identifying: 'Identifying artifact...',
      artifactIdentified: 'Artifact Identified',
      viewSupported: 'View supported artifacts →',
      supportedTitle: '🎨 Supported Artifacts ({count})',
      supportedDesc: 'These artifacts can be identified during the demo',
      permTitle: 'Camera Access Required',
      permDesc: 'We need camera access to identify heritage artifacts.',
      grantPermission: 'Grant Permission',
      confidence: 'Confidence',
      notFound: 'Could not identify artifact. Please try closer or with better lighting.',
    },

    // Plan
    plan: {
      title: 'Plan Your Heritage Tour',
      subtitle: 'Smart route optimized for your time and interests',
      duration: 'Available Duration',
      yourInterests: 'Your Interests',
      generateSmartRoute: 'Generate Smart Route',
      generatingRoute: 'Generating optimal route...',
      yourItinerary: 'Your Heritage Itinerary',
      stops: 'Stops',
      estTotalTime: 'Est. Total Time',
      startNewPlan: 'Plan Another Route',
      minsVisit: 'min visit',
      travelTime: 'min travel',
      walk: 'Walk',
      mins: 'mins',
    },

    // Profile
    profile: {
      title: 'Profile & Settings',
      languageSection: 'Language',
      interestsSection: 'My Interests',
      travelStyleSection: 'Travel Style',
      savedPlacesSection: 'Saved Places',
      noSavedPlaces: 'No saved places yet. Heart any monument to save it here!',
      resetApp: 'Reset App',
      resetConfirm: 'This will reset all preferences and return to onboarding. Continue?',
      resetBtn: 'Reset',
    },

    // Onboarding
    onboarding: {
      chooseLanguage: 'Choose Your Language',
      languageSubtitle: "We'll show heritage information in your preferred language",
      whatInterests: 'What Interests You?',
      interestsSubtitle: 'Select all that appeal to you',
      yourTravelStyle: 'Your Travel Style',
      styleSubtitle: 'How do you like to explore?',
      availableTime: 'Available Time',
      durationSubtitle: 'How much time do you have today?',
    },

    // Option items
    options: {
      interests: {
        heritage: 'Heritage Sites',
        museum: 'Museums',
        culture: 'Culture & Art',
        food: 'Local Food',
        activity: 'Activities',
      },
      styles: {
        rushed: { label: 'Quick Explorer', desc: 'See more, spend less time' },
        moderate: { label: 'Balanced', desc: 'Perfect mix of exploring and learning' },
        leisurely: { label: 'Deep Diver', desc: 'Take your time, learn everything' },
      },
      durations: {
        '30min': { label: '30 min', desc: 'Quick visit' },
        '90min': { label: '90 min', desc: 'Standard tour' },
        'half-day': { label: 'Half Day', desc: '4 hours' },
        'full-day': { label: 'Full Day', desc: '8 hours' },
      },
    },
  },

  hi: {
    // Navigation / Tabs
    tabs: {
      home: 'होम',
      explore: 'खोजें',
      aiGuide: 'एआई गाइड',
      plan: 'योजना',
      profile: 'प्रोफ़ाइल',
    },

    // Common
    common: {
      all: 'सभी',
      km: 'किमी',
      kmAway: 'किमी दूर',
      loading: 'लोड हो रहा है...',
      locating: 'स्थान खोजा जा रहा है...',
      back: 'पीछे',
      goBack: '← वापस जाएं',
      error: 'त्रुटि',
      retry: 'पुनः प्रयास करें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      next: 'आगे बढ़ें',
      getStarted: 'शुरू करें',
      skip: 'छोड़ें',
      guestMode: 'अतिथि मोड',
      directions: 'दिशा-निर्देश',
      listen: 'सुनें',
      stop: 'रोकें',
      askAi: 'एआई से पूछें',
      identify: 'पहचानें',
      details: 'विवरण',
      viewDetails: 'विवरण देखें',
      openHours: 'समय',
      scanAgain: 'फिर से स्कैन करें',
    },

    // Categories
    categories: {
      all: 'सभी',
      heritage: 'विरासत',
      museum: 'संग्रहालय',
      culture: 'संस्कृति',
      food: 'खान-पान',
      activity: 'गतिविधियां',
    },

    // Home
    home: {
      headerTitle: 'यात्रा हेरिटेज',
      headerSubtitle: 'भारत के सांस्कृतिक गौरव की खोज करें',
      quickActions: 'त्वरित क्रियाएं',
      exploreMap: 'मानचित्र खोजें',
      askAiGuide: 'एआई से पूछें',
      identifyArtifact: 'स्मारक पहचानें',
      planHeritageTour: 'यात्रा योजना',
      nearbyHeritageSites: 'निकटवर्ती विरासत स्थल',
      allNearbyPlaces: 'सभी निकटवर्ती स्थल',
      placesCount: 'स्थल',
      discoveringHeritage: 'विरासत स्थलों की खोज की जा रही है...',
      noPlacesFound: 'इस श्रेणी में कोई स्थल नहीं मिला',
      searchPlaceholder: 'स्मारक, महल, मंदिर खोजें...',
    },

    // Place Details
    place: {
      minuteStoryBadge: '⭐ 2-मिनट की विरासत कहानी',
      architecturalDetails: '🏛️ वास्तुकला विवरण',
      completeHistory: '📖 संपूर्ण इतिहास',
      historicalSignificance: '🎯 ऐतिहासिक महत्व',
      keyFacts: '✨ मुख्य तथ्य',
      verifiedSources: '📚 सत्यापित स्रोत',
      verifiedReferencesCount: '{count} सत्यापित ऐतिहासिक संदर्भ उपलब्ध हैं',
      loadingInfo: 'विरासत जानकारी लोड हो रही है...',
      recordNotFound: 'विरासत रिकॉर्ड नहीं मिला',
      audioGuide: 'ऑडियो गाइड',
      rating: 'रेटिंग',
      period: 'कालखंड',
    },

    // Explore / Map
    explore: {
      exploreSites: 'विरासत स्थलों का अन्वेषण करें',
      radarTitle: 'विरासत रडार',
      radarActive: 'रडार स्कैन सक्रिय',
      placesInRange: 'रडार सीमा में स्थल',
      tapToInspect: 'विवरण देखने के लिए नीचे किसी स्थल पर टैप करें',
      viewStory: 'विरासत कहानी देखें',
      myLocation: 'मेरा स्थान',
      distance: 'दूरी',
    },

    // AI Chat
    ai: {
      title: 'एआई हेरिटेज गाइड',
      subtitle: 'वडोदरा की विरासत के बारे में कुछ भी पूछें',
      contextBadge: 'संदर्भ: {name}',
      clearContext: 'संदर्भ हटाएं',
      inputPlaceholder: 'विरासत के बारे में एक प्रश्न पूछें...',
      send: 'भेजें',
      clearChat: 'साफ़ करें',
      typingText: 'एआई सत्यापित उत्तर तैयार कर रहा है...',
      suggestedQuestions: 'सुझाए गए प्रश्न',
      verifiedSourceBadge: 'सत्यापित स्रोत',
      modes: {
        short: '⚡ संक्षिप्त',
        detailed: '📖 विस्तृत',
        child: '🧒 बच्चों के लिए',
        narrative: '📜 कहानी',
      },
      defaultSuggestions: [
        'वडोदरा के शीर्ष विरासत स्थल कौन से हैं?',
        'गायकवाड़ राजवंश के बारे में बताएं',
        'चंपानेर-पावागढ़ का इतिहास बताएं',
        'गुजरात की वास्तुकला शैलियों को समझाएं',
      ],
    },

    // Camera / Vision
    camera: {
      title: 'हेरिटेज लेंस',
      pointCameraHint: 'कैमरे को किसी ऐतिहासिक स्मारक या कलाकृति पर रखें',
      identifying: 'कलाकृति की पहचान की जा रही है...',
      artifactIdentified: 'कलाकृति पहचानी गई',
      viewSupported: 'समर्थित कलाकृतियाँ देखें →',
      supportedTitle: '🎨 समर्थित कलाकृतियाँ ({count})',
      supportedDesc: 'इन्हें डेमो के दौरान पहचाना जा सकता है',
      permTitle: 'कैमरा अनुमति आवश्यक है',
      permDesc: 'विरासत कलाकृतियों की पहचान के लिए कैमरे की अनुमति आवश्यक है।',
      grantPermission: 'अनुमति दें',
      confidence: 'सटीकता',
      notFound: 'कलाकृति की पहचान नहीं हो सकी। कृपया पास से या बेहतर रोशनी में प्रयास करें।',
    },

    // Plan
    plan: {
      title: 'विरासत यात्रा की योजना बनाएं',
      subtitle: 'आपके समय और रुचियों के अनुकूल स्मार्ट मार्ग',
      duration: 'उपलब्ध समय',
      yourInterests: 'आपकी रुचियां',
      generateSmartRoute: 'स्मार्ट मार्ग तैयार करें',
      generatingRoute: 'सर्वोत्तम मार्ग तैयार किया जा रहा है...',
      yourItinerary: 'आपकी विरासत यात्रा कार्यक्रम',
      stops: 'पड़ाव',
      estTotalTime: 'अनुमानित कुल समय',
      startNewPlan: 'दूसरा मार्ग प्लान करें',
      minsVisit: 'मिनट दर्शन',
      travelTime: 'मिनट यात्रा',
      walk: 'पैदल',
      mins: 'मिनट',
    },

    // Profile
    profile: {
      title: 'प्रोफ़ाइल और सेटिंग्स',
      languageSection: 'भाषा (Language)',
      interestsSection: 'मेरी रुचियां',
      travelStyleSection: 'यात्रा शैली',
      savedPlacesSection: 'सहेजे गए स्थल',
      noSavedPlaces: 'अभी तक कोई स्थल सहेजा नहीं गया। किसी भी स्मारक को सहेजने के लिए दिल पर टैप करें!',
      resetApp: 'ऐप रीसेट करें',
      resetConfirm: 'यह सभी प्राथमिकताओं को रीसेट कर देगा और शुरुआत में ले जाएगा। जारी रखें?',
      resetBtn: 'रीसेट करें',
    },

    // Onboarding
    onboarding: {
      chooseLanguage: 'अपनी भाषा चुनें',
      languageSubtitle: 'हम आपकी पसंदीदा भाषा में जानकारी दिखाएंगे',
      whatInterests: 'आपकी किसमें रुचि है?',
      interestsSubtitle: 'जो आपको पसंद हो उसे चुनें',
      yourTravelStyle: 'आपकी यात्रा शैली',
      styleSubtitle: 'आप कैसे घूमना पसंद करते हैं?',
      availableTime: 'उपलब्ध समय',
      durationSubtitle: 'आज आपके पास कितना समय है?',
    },

    // Option items
    options: {
      interests: {
        heritage: 'विरासत स्थल',
        museum: 'संग्रहालय',
        culture: 'कला और संस्कृति',
        food: 'स्थानीय खान-पान',
        activity: 'गतिविधियां',
      },
      styles: {
        rushed: { label: 'त्वरित खोजकर्ता', desc: 'कम समय में ज्यादा देखें' },
        moderate: { label: 'संतुलित', desc: 'घूमने और सीखने का सही संतुलन' },
        leisurely: { label: 'गहराई से जानने वाले', desc: 'पूरा समय लेकर सब कुछ जानें' },
      },
      durations: {
        '30min': { label: '30 मिनट', desc: 'त्वरित दौरा' },
        '90min': { label: '90 मिनट', desc: 'मानक दौरा' },
        'half-day': { label: 'आधा दिन', desc: '4 घंटे' },
        'full-day': { label: 'पूरा दिन', desc: '8 घंटे' },
      },
    },
  },

  gu: {
    // Navigation / Tabs
    tabs: {
      home: 'ઘર',
      explore: 'શોધો',
      aiGuide: 'AI માર્ગદર્શક',
      plan: 'આયોજન',
      profile: 'પ્રોફાઇલ',
    },

    // Common
    common: {
      all: 'બધા',
      km: 'કિમી',
      kmAway: 'કિમી દૂર',
      loading: 'લોડ થઈ રહ્યું છે...',
      locating: 'સ્થાન શોધાઈ રહ્યું છે...',
      back: 'પાછળ',
      goBack: '← પાછા જાઓ',
      error: 'ભૂલ',
      retry: 'ફરી પ્રયાસ કરો',
      cancel: 'રદ કરો',
      save: 'સાચવો',
      next: 'આગળ વધો',
      getStarted: 'શરૂ કરો',
      skip: 'છોડો',
      guestMode: 'અતિથિ મોડ',
      directions: 'દિશા-નિર્દેશ',
      listen: 'સાંભળો',
      stop: 'રોકો',
      askAi: 'AI ને પૂછો',
      identify: 'ઓળખો',
      details: 'વિગતો',
      viewDetails: 'વિગતો જુઓ',
      openHours: 'સમય',
      scanAgain: 'ફરી સ્કેન કરો',
    },

    // Categories
    categories: {
      all: 'બધા',
      heritage: 'વારસો',
      museum: 'સંગ્રહાલય',
      culture: 'સંસ્કૃતિ',
      food: 'ખોરાક',
      activity: 'પ્રવૃત્તિઓ',
    },

    // Home
    home: {
      headerTitle: 'યાત્રા વારસો',
      headerSubtitle: 'ભારતના સાંસ્કૃતિક ગૌરવની શોધ કરો',
      quickActions: 'ઝડપી ક્રિયાઓ',
      exploreMap: 'નકશો શોધો',
      askAiGuide: 'AI ને પૂછો',
      identifyArtifact: 'સ્મારક ઓળખો',
      planHeritageTour: 'યાત્રા આયોજન',
      nearbyHeritageSites: 'નજીકના વારસાના સ્થળો',
      allNearbyPlaces: 'બધા નજીકના સ્થળો',
      placesCount: 'સ્થળો',
      discoveringHeritage: 'વારસાના સ્થળો શોધાઈ રહ્યા છે...',
      noPlacesFound: 'આ શ્રેણીમાં કોઈ સ્થળ મળ્યું નથી',
      searchPlaceholder: 'સ્મારકો, મહેલો, મંદિરો શોધો...',
    },

    // Place Details
    place: {
      minuteStoryBadge: '⭐ 2-મિનિટની વારસાની વાર્તા',
      architecturalDetails: '🏛️ સ્થાપત્ય વિગતો',
      completeHistory: '📖 સંપૂર્ણ ઇતિહાસ',
      historicalSignificance: '🎯 ઐતિહાસિક મહત્વ',
      keyFacts: '✨ મુખ્ય તથ્યો',
      verifiedSources: '📚 ચકાસાયેલ સ્ત્રોતો',
      verifiedReferencesCount: '{count} ચકાસાયેલ ઐતિહાસિક સંદર્ભો ઉપલબ્ધ છે',
      loadingInfo: 'વારસાની માહિતી લોડ થઈ રહી છે...',
      recordNotFound: 'વારસાનો રેકોર્ડ મળ્યો નથી',
      audioGuide: 'ઑડિયો માર્ગદર્શિકા',
      rating: 'રેટિંગ',
      period: 'સમયગાળો',
    },

    // Explore / Map
    explore: {
      exploreSites: 'વારસાના સ્થળોનું અન્વેષણ કરો',
      radarTitle: 'વારસા રડાર',
      radarActive: 'રડાર સ્કેન સક્રિય',
      placesInRange: 'રડાર સીમામાં સ્થળો',
      tapToInspect: 'વિગતો જોવા માટે નીચેના સ્થળ પર ટેપ કરો',
      viewStory: 'વારસાની વાર્તા જુઓ',
      myLocation: 'મારું સ્થાન',
      distance: 'અંતર',
    },

    // AI Chat
    ai: {
      title: 'AI હેરિટેજ માર્ગદર્શક',
      subtitle: 'વડોદરાના વારસા વિશે કંઈપણ પૂછો',
      contextBadge: 'સંદર્ભ: {name}',
      clearContext: 'સંદર્ભ સાફ કરો',
      inputPlaceholder: 'વારસા વિશે પ્રશ્ન પૂછો...',
      send: 'મોકલો',
      clearChat: 'સાફ કરો',
      typingText: 'AI ચકાસાયેલ જવાબ તૈયાર કરી રહ્યું છે...',
      suggestedQuestions: 'સૂચવેલા પ્રશ્નો',
      verifiedSourceBadge: 'ચકાસાયેલ સ્ત્રોતો',
      modes: {
        short: '⚡ ટૂંકું',
        detailed: '📖 વિગતવાર',
        child: '🧒 બાળકો માટે',
        narrative: '📜 વાર્તા',
      },
      defaultSuggestions: [
        'વડોદરાના મુખ્ય વારસાના સ્થળો કયા છે?',
        'ગાયકવાડ રાજવંશ વિશે જણાવો',
        'ચાંપાનેર-પાવાગઢનો ઇતિહાસ જણાવો',
        'ગુજરાતની સ્થાપત્ય શૈલીઓ સમજાવો',
      ],
    },

    // Camera / Vision
    camera: {
      title: 'હેરિટેજ લેન્સ',
      pointCameraHint: 'કૅમેરાને ઐતિહાસિક સ્મારક કે કલાકૃતિ તરફ રાખો',
      identifying: 'કલાકૃતિની ઓળખ થઈ રહી છે...',
      artifactIdentified: 'કલાકૃતિ ઓળખાઈ',
      viewSupported: 'સમર્થિત કલાકૃતિઓ જુઓ →',
      supportedTitle: '🎨 સમર્થિત કલાકૃતિઓ ({count})',
      supportedDesc: 'આ કલાકૃતિઓને ડેમો દરમિયાન ઓળખી શકાય છે',
      permTitle: 'કૅમેરા પરવાનગી જરૂરી છે',
      permDesc: 'વારસાની કલાકૃતિઓ ઓળખવા માટે કૅમેરાની પરવાનગી જરૂરી છે.',
      grantPermission: 'પરવાનગી આપો',
      confidence: 'ચોકસાઈ',
      notFound: 'કલાકૃતિ ઓળખી શકાઈ નથી. કૃપા કરીને નજીકથી અથવા વધુ પ્રકાશમાં પ્રયાસ કરો.',
    },

    // Plan
    plan: {
      title: 'વારસા યાત્રાનું આયોજન કરો',
      subtitle: 'તમારા સમય અને રુચિઓ અનુસાર સ્માર્ટ માર્ગ',
      duration: 'ઉપલબ્ધ સમય',
      yourInterests: 'તમારી રુચિઓ',
      generateSmartRoute: 'સ્માર્ટ રૂટ તૈયાર કરો',
      generatingRoute: 'શ્રેષ્ઠ રૂટ તૈયાર થઈ રહ્યો છે...',
      yourItinerary: 'તમારો વારસા પ્રવાસ કાર્યક્રમ',
      stops: 'સ્ટોપ્સ',
      estTotalTime: 'અંદાજિત કુલ સમય',
      startNewPlan: 'બીજો રૂટ પ્લાન કરો',
      minsVisit: 'મિનિટ મુલાકાત',
      travelTime: 'મિનિટ પ્રવાસ',
      walk: 'ચાલવું',
      mins: 'મિનિટ',
    },

    // Profile
    profile: {
      title: 'પ્રોફાઇલ અને સેટિંગ્સ',
      languageSection: 'ભાષા (Language)',
      interestsSection: 'મારી રુચિઓ',
      travelStyleSection: 'મુસાફરી શૈલી',
      savedPlacesSection: 'સાચવેલા સ્થળો',
      noSavedPlaces: 'હજી સુધી કોઈ સ્થળ સાચવેલ નથી. સાચવવા માટે સ્મારક પર દિલ દબાવો!',
      resetApp: 'ઍપ રીસેટ કરો',
      resetConfirm: 'આ બધી પસંદગીઓ રીસેટ કરશે અને શરૂઆત પર પાછા લઈ જશે. ચાલુ રાખવું?',
      resetBtn: 'રીસેટ કરો',
    },

    // Onboarding
    onboarding: {
      chooseLanguage: 'તમારી ભાષા પસંદ કરો',
      languageSubtitle: 'અમે તમારી પસંદગીની ભાષામાં માહિતી પ્રદર્શિત કરીશું',
      whatInterests: 'તમને શેમાં રસ છે?',
      interestsSubtitle: 'તમને ગમતા તમામ વિકલ્પો પસંદ કરો',
      yourTravelStyle: 'તમારી મુસાફરી શૈલી',
      styleSubtitle: 'તમે કેવી રીતે ફરવાનું પસંદ કરો છો?',
      availableTime: 'ઉપલબ્ધ સમય',
      durationSubtitle: 'આજે તમારી પાસે કેટલો સમય છે?',
    },

    // Option items
    options: {
      interests: {
        heritage: 'વારસાના સ્થળો',
        museum: 'સંગ્રહાલય',
        culture: 'કળા અને સંસ્કૃતિ',
        food: 'સ્થાનિક ખોરાક',
        activity: 'પ્રવૃત્તિઓ',
      },
      styles: {
        rushed: { label: 'ઝડપી પ્રવાસી', desc: 'ઓછા સમયમાં વધુ જુઓ' },
        moderate: { label: 'સંતુલિત', desc: 'શોધ અને સમજનું શ્રેષ્ઠ મિશ્રણ' },
        leisurely: { label: 'ઊંડાણપૂર્વક અભ્યાસી', desc: 'આરામથી બધું સમજીને ફરો' },
      },
      durations: {
        '30min': { label: '30 મિનિટ', desc: 'ઝડપી મુલાકાત' },
        '90min': { label: '90 મિનિટ', desc: 'સામાન્ય પ્રવાસ' },
        'half-day': { label: 'અડધો દિવસ', desc: '4 કલાક' },
        'full-day': { label: 'આખો દિવસ', desc: '8 કલાક' },
      },
    },
  },
};

export function getLocalizedPlaceName(place: { name: string; nameHi?: string; nameGu?: string }, lang: string): string {
  if (lang === 'hi' && place.nameHi) return place.nameHi;
  if (lang === 'gu' && place.nameGu) return place.nameGu;
  return place.name;
}

export function getLocalizedCategoryName(categoryKey: string, lang: string): string {
  const langKey = (lang === 'hi' || lang === 'gu') ? lang : 'en';
  const catMap = TRANSLATIONS[langKey].categories as Record<string, string>;
  return catMap[categoryKey] || categoryKey;
}
