export interface AIResponse {
  answer: string;
  sources: Array<{ name: string; url?: string; text: string }>;
  confidence: number;
  mode: string;
  language: string;
}

export type ConversationalIntent =
  | 'GREETING'
  | 'WELL_BEING'
  | 'IDENTITY'
  | 'CREATOR'
  | 'CAPABILITIES'
  | 'HELP'
  | 'GRATITUDE'
  | 'FAREWELL'
  | 'TRIVIA'
  | 'RECOMMEND_GUJARAT'
  | 'RECOMMEND_INDIA'
  | 'TRIP_PLANNING'
  | 'CONCEPT_STEPWELL'
  | 'CONCEPT_TEMPLE_ARCH'
  | 'CONCEPT_UNESCO'
  | 'CONCEPT_ASI'
  | 'CONCEPT_SARDAR_PATEL'
  | 'CONCEPT_HARAPPAN';

export function detectConversationalIntent(text: string): ConversationalIntent | null {
  const q = text.toLowerCase().trim();

  // 1. Quick Greetings
  if (/^(hi+|hey+|hello+|hii+|heyy+|yo|namaste+|namaskar|salaam|satsriakal|kem\s*cho|kemcho|jai\s*shree\s*krishna|good\s*(morning|afternoon|evening|day)|sup|hola)[\s?.!,~]*$/i.test(q)) {
    return 'GREETING';
  }

  // 2. Well-being
  if (/(how\s+are\s+you|how\s+r\s+u|how\s+do\s+you\s+do|how\s+is\s+it\s+going|how's\s+it\s+going|how\s+are\s+things|kaisa\s+hai|kaise\s+ho|sab\s+theek|kem\s+cho\s+tabyat)/i.test(q)) {
    return 'WELL_BEING';
  }

  // 3. Creator / Who made you
  if (/(who\s+(made|created|built|developed|designed|coded)\s+(you|this(\s+app)?)|coder\s*cult|kisne\s+(banaya|develop\s+kiya)|kone\s+banavyu)/i.test(q)) {
    return 'CREATOR';
  }

  // 4. Identity
  if (/(who\s+are\s+you|who\s+r\s+u|what\s+is\s+your\s+name|tell\s+me\s+about\s+yourself|who\s+am\s+i\s+talking\s+to|aap\s+kaun\s+ho|tum\s+kaun\s+ho|tame\s+kon\s+cho)/i.test(q)) {
    return 'IDENTITY';
  }

  // 5. Capabilities & Features
  if (/(what\s+can\s+you\s+do|what\s+are\s+your\s+features|how\s+can\s+you\s+help|what\s+do\s+you\s+do|aap\s+kya\s+kar\s+sakte\s+ho|kya\s+madad\s+kar\s+sakte\s+ho|tame\s+shu\s+kari\s+shako)/i.test(q)) {
    return 'CAPABILITIES';
  }

  // 6. Help / Guide
  if (/^(help(\s+me)?|how\s+to\s+use|i\s+need\s+help|guide\s+me|madad\s+karo|sahayata)[\s?.!,~]*$/i.test(q)) {
    return 'HELP';
  }

  // 7. Gratitude
  if (/(thank\s*you|thanks|thx|dhanyawad|dhanyavad|shukriya|aabhar|khub\s*aabhar)[\s?.!,~]*$/i.test(q)) {
    return 'GRATITUDE';
  }

  // 8. Farewell
  if (/^(bye+|goodbye+|see\s+you|cya|alvida|phir\s+milenge|aavjo)[\s?.!,~]*$/i.test(q)) {
    return 'FAREWELL';
  }

  // 9. Trivia / Joke / Fun fact
  if (/(tell\s+me\s+a\s+joke|fun\s+fact|interesting\s+fact|heritage\s+fact|kuch\s+mazedaar|trivia|mystery|mysteries)[\s?.!,~]*$/i.test(q)) {
    return 'TRIVIA';
  }

  // 10. Trip Planning
  if (/(plan\s+(a\s+)?(trip|tour|travel|journey|itinerary)|suggest\s+an\s+itinerary|(2|3|4|5)\s+day\s+(trip|tour)|trip\s+kaise\s+plan\s+kare|tour\s+plan)/i.test(q)) {
    return 'TRIP_PLANNING';
  }

  // 11. Recommendations: Gujarat
  if (/(places\s+to\s+visit\s+in\s+gujarat|visit\s+gujarat|gujarat\s+tourism|what\s+to\s+see\s+in\s+gujarat|best\s+places\s+in\s+gujarat|top\s+monuments\s+in\s+gujarat|gujarat\s+me\s+kya\s+dekhe|gujarat\s+ferva\s+mate)/i.test(q)) {
    return 'RECOMMEND_GUJARAT';
  }

  // 12. Recommendations: India
  if (/(places\s+to\s+visit\s+in\s+india|top\s+monuments\s+in\s+india|best\s+heritage\s+sites|famous\s+temples\s+in\s+india|famous\s+forts\s+in\s+india|best\s+places\s+in\s+india)/i.test(q)) {
    return 'RECOMMEND_INDIA';
  }

  // 13. Concept: Stepwell / Vav
  if (/(what\s+is\s+a\s+stepwell|what\s+is\s+a\s+vav|why\s+were\s+stepwells\s+built|explain\s+stepwell|baori\s+kya\s+hoti\s+hai|vav\s+etle\s+shu)/i.test(q)) {
    return 'CONCEPT_STEPWELL';
  }

  // 14. Concept: Temple Architecture
  if (/(nagara\s+style|dravidian\s+style|vesara\s+style|temple\s+architecture|what\s+is\s+a\s+shikhara|mandapa|garbhagriha)/i.test(q)) {
    return 'CONCEPT_TEMPLE_ARCH';
  }

  // 15. Concept: UNESCO Sites
  if (/(unesco(\s+world\s+heritage)?\s+sites|world\s+heritage\s+sites\s+in\s+india|unesco\s+in\s+gujarat)/i.test(q)) {
    return 'CONCEPT_UNESCO';
  }

  // 16. Concept: ASI
  if (/(what\s+is\s+asi|archaeological\s+survey\s+of\s+india|who\s+protects\s+monuments)/i.test(q)) {
    return 'CONCEPT_ASI';
  }

  // 17. Concept: Sardar Patel & Statue of Unity
  if (/(who\s+was\s+sardar\s+patel|iron\s+man\s+of\s+india|why\s+was\s+statue\s+of\s+unity\s+built)/i.test(q)) {
    return 'CONCEPT_SARDAR_PATEL';
  }

  // 18. Concept: Harappan / Indus Valley
  if (/(indus\s+valley|harappan\s+civilization|lothal\s+dockyard|dholavira\s+water)/i.test(q)) {
    return 'CONCEPT_HARAPPAN';
  }

  return null;
}

export function getConversationalReply(
  intent: ConversationalIntent,
  mode: string,
  language: string
): AIResponse {
  let answer = '';
  let sourceLabel = 'AI Heritage Guide';

  switch (intent) {
    case 'GREETING': {
      if (language === 'hi') {
        answer = `🙏 **नमस्ते! मैं आपका AI Heritage Guide हूँ।**\n\nभारत के ऐतिहासिक स्मारकों, प्राचीन मंदिरों, शाही बावड़ियों और किलों के सफर में मैं आपका साथी हूँ।\n\n✨ **आप मुझसे क्या पूछ सकते हैं:**\n• *"रानी की वाव का इतिहास बताओ"*\n• *"मोढेरा सूर्य मंदिर का रहस्य क्या है?"*\n• *"गुजरात में घूमने के लिए बेहतरीन जगहें"*\n• *"3 दिन का हेरिटेज टूर कैसे प्लान करें?"*\n\nआप किसी भी स्मारक का नाम लिखकर उसकी कहानी जान सकते हैं!`;
      } else if (language === 'gu') {
        answer = `🙏 **નમસ્તે! હું તમારો AI Heritage Guide છું.**\n\nભારતના ભવ્ય વારસા, પ્રાચીન મંદિરો, ઐતિહાસિક વાવ અને કિલ્લાઓની સફરમાં તમારું સ્વાગત છે.\n\n✨ **તમે મને પૂછી શકો છો:**\n• *"રાણીની વાવનો ઇતિહાસ જણાવો"*\n• *"મોઢેરા સૂર્ય મંદિરની વિશેષતા શું છે?"*\n• *"ગુજરાતમાં ફરવા લાયક ઐતિહાસિક સ્થળો"*\n• *"3 દિવસની ટૂર કેવી રીતે પ્લાન કરવી?"*\n\nકોઈપણ સ્મારકનું નામ લખીને તેની સફર શરૂ કરો!`;
      } else {
        answer = `🙏 **Namaste! I'm your AI Heritage Guide.**\n\nI'm here to take you on a journey through India's breathtaking heritage — from royal stepwells and sun temples to ancient hill forts, rock-cut caves, and majestic palaces.\n\n✨ **Here are a few things you can ask me:**\n• *"Tell me the astronomical secrets of Modhera Sun Temple"*\n• *"Why is Rani ki Vav in Patan an inverted temple?"*\n• *"Recommend top heritage places in Gujarat"*\n• *"Help me plan a 3-day heritage tour"*\n• Or just type any monument's name to explore its story!`;
      }
      sourceLabel = 'Conversational Guide';
      break;
    }

    case 'WELL_BEING': {
      if (language === 'hi') {
        answer = `✨ **मैं बिल्कुल ठीक और उत्साहित हूँ!**\n\nभारत की अनमोल धरोहर और इतिहास की कहानियाँ साझा करने के लिए हमेशा तैयार। आज आप कहाँ का सफर करना चाहते हैं? पाटन की रानी की वाव, मोढेरा का सूर्य मंदिर या स्टैच्यू ऑफ यूनिटी?`;
      } else if (language === 'gu') {
        answer = `✨ **હું એકદમ મજામાં અને ઉત્સાહિત છું!**\n\nભારતના અદ્ભુત ઇતિહાસ અને સ્થાપત્યની વાર્તાઓ તમારી સાથે શેર કરવા સદાય તત્પર. આજે તમારે ક્યા સ્થળની મુલાકાત લેવી છે? પાટણની રાણીની વાવ, મોઢેરાનું સૂર્ય મંદિર કે એકતા નગર?`;
      } else {
        answer = `✨ **I'm doing fantastic, thank you!**\n\nAlways excited to explore India's vibrant history and architectural wonders with fellow travelers like you. Where would you like to travel today? We could explore the stepwells of Patan, the sun temple of Modhera, or the world's tallest statue at Kevadia!`;
      }
      sourceLabel = 'Conversational Guide';
      break;
    }

    case 'IDENTITY': {
      if (language === 'hi') {
        answer = `🏛️ **मैं आपका AI Heritage Guide हूँ!**\n\nमैं एक डिजिटल सांस्कृतिक मार्गदर्शक हूँ, जिसे भारतीय पुरातत्व सर्वेक्षण (ASI) के आधिकारिक अभिलेखों और 150+ राष्ट्रीय स्मारकों के ऐतिहासिक ज्ञान के साथ तैयार किया गया है।\n\n🎯 **मेरा लक्ष्य:**\nइतिहास को आपकी उंगलियों पर जीवंत बनाना! चाहे आप किसी 1,000 साल पुरानी पत्थर की नक्काशी के सामने खड़े हों या परिवार के साथ यात्रा की योजना बना रहे हों, मैं सटीक इतिहास, वास्तुकला की बारीकियाँ और यात्रा के सुझाव प्रदान करता हूँ।`;
      } else if (language === 'gu') {
        answer = `🏛️ **હું તમારો AI Heritage Guide છું!**\n\nહું એક ડિજિટલ સાંસ્કૃતિક માર્ગદર્શક છું, જે ભારતીય પુરાતત્વ સર્વેક્ષણ (ASI) ના સત્તાવાર દસ્તાવેજો અને 150+ થી વધુ રાષ્ટ્રીય સ્મારકોના ઐતિહાસિક ડેટા સાથે સજ્જ છે.\n\n🎯 **મારો હેતુ:**\nભારતના ભવ્ય ઇતિહાસ, સ્થાપત્ય અને શાહી રાજવંશોની વાર્તાઓને તમારી સમક્ષ રસપ્રદ રીતે રજૂ કરવાનો છે!`;
      } else {
        answer = `🏛️ **I am your AI Heritage Guide!**\n\nI am an intelligent cultural travel companion trained on official archaeological archives, ASI chronicles, and curated architectural records of over 150+ Indian national monuments and Gujarat heritage landmarks.\n\n🎯 **My Mission:**\nTo bring history alive right in the palm of your hand! Whether you're standing before a 1,000-year-old stone carving or planning your next family journey, I provide accurate historical chronologies, architectural breakdowns, mythological stories, and real-time travel advice.`;
      }
      sourceLabel = 'AI Heritage Companion';
      break;
    }

    case 'CREATOR': {
      if (language === 'hi') {
        answer = `⚡ **मुझे Team The Coder Cult ने विकसित किया है!**\n\n**Smart India Hackathon (SIH)** के अंतर्गत हमारे दल ने यह स्मार्ट टूरिस्ट कंपेनियन ऐप बनाया है।\n\n💡 **हमारा विज़न:**\nकैमरा-आधारित एआई विज़न स्कैनर, ऑफ़लाइन हेरिटेज नॉलेज, बहुभाषी ऑडियो गाइड और बुद्धिमान चैटबॉट के माध्यम से भारतीय पर्यटन को अत्याधुनिक और सुलभ बनाना।`;
      } else if (language === 'gu') {
        answer = `⚡ **મને Team The Coder Cult દ્વારા વિકસાવવામાં આવ્યો છે!**\n\n**Smart India Hackathon (SIH)** અંતર્ગત અમારી ટીમે આ સ્માર્ટ ટુરિસ્ટ કમ્પેનિયન સિસ્ટમ બનાવી છે.\n\n💡 **અમારું લક્ષ્ય:**\nઓન-ડિવાઇસ AI વિઝન, ઑફલાઇન સપોર્ટ અને ઑડિયો ગાઇડ વડે ભારતીય સ્મારકોના પ્રવાસનને વિશ્વસ્તરીય બનાવવું.`;
      } else {
        answer = `⚡ **I was created by Team The Coder Cult!**\n\nDeveloped with dedication for the **Smart India Hackathon (SIH)**, our team engineered this smart tourist companion app to revolutionize cultural tourism in India using on-device computer vision, offline knowledge sync, multi-lingual audio narration, and AI-powered heritage guidance.`;
      }
      sourceLabel = 'The Coder Cult - SIH';
      break;
    }

    case 'CAPABILITIES': {
      if (language === 'hi') {
        answer = `✨ **यहाँ बताया गया है कि मैं आपकी क्या मदद कर सकता हूँ:**\n\n1. 🏛️ **स्मारकों का गहन इतिहास**: 150+ स्मारकों के राजवंश, वास्तुकार, निर्माण वर्ष और रोचक लोककथाएँ जानिए।\n2. 📸 **कैमरा विज़न स्कैनर**: किसी भी स्मारक या प्राचीन मूर्ति की ओर कैमरा घुमाएँ — हमारा AI विज़न उसे तुरंत पहचान लेगा।\n3. 🗺️ **यात्रा एवं टूर प्लानिंग**: गुजरात और भारत भर में 1 दिन, 2 दिन या 5 दिन के हेरिटेज टूर का सुझाव पाएँ।\n4. 🎧 **बहुभाषी ऑडियो गाइड**: किसी भी जवाब पर स्पीकर आइकन दबाकर हिंदी, गुजराती या अंग्रेज़ी में साफ़ आवाज़ में सुनें।\n5. 🎭 **4 विशेष शैलियाँ**: **Short** (संक्षिप्त), **Detailed** (विस्तृत इतिहास), **Kids** (बच्चों के लिए कहानियाँ), और **Narrative** (काव्यात्मक अंदाज़)!\n6. 📶 **100% ऑफ़लाइन कार्य**: बिना इंटरनेट के भी पूरा ज्ञान भंडार उपलब्ध।`;
      } else if (language === 'gu') {
        answer = `✨ **હું તમારી આ બાબતોમાં મદદ કરી શકું છું:**\n\n1. 🏛️ **ઐતિહાસિક માહિતી**: 150+ સ્મારકોના ઇતિહાસ, સ્થાપત્ય અને રહસ્યો.\n2. 📸 **AI વિઝન સ્કેનર**: કેમેરા દ્વારા કોઈપણ સ્મારક કે મૂર્તિની તુરંત ઓળખ.\n3. 🗺️ **ટૂર પ્લાનિંગ**: ગુજરાત અને ભારતના ઐતિહાસિક પ્રવાસનું સચોટ આયોજન.\n4. 🎧 **ઑડિયો ગાઇડ**: ગુજરાતી, હિન્દી અને અંગ્રેજીમાં સ્પષ્ટ અવાજમાં શ્રવણ.\n5. 📶 **ઑફલાઇન સપોર્ટ**: ઇન્ટરનેટ વગર પણ સંપૂર્ણ માહિતી ઉપલબ્ધ.`;
      } else {
        answer = `✨ **Here is everything I can do for you:**\n\n1. 🏛️ **Deep Heritage Insights**: Ask me anything about 150+ national monuments — dynasty, patron king, construction year, architectural style, and legends.\n2. 📸 **Vision Monument Scanner**: Point your camera at any monument, temple pillar, or stone carving in the **Scan tab** to identify it instantly.\n3. 🗺️ **Itinerary & Route Planning**: Ask me to plan 1-day, 2-day, or 5-day heritage circuits across Gujarat and India.\n4. 🎧 **Multi-Lingual Audio Narration**: Tap the speaker icon on any response to listen to crystal-clear narration in English, Hindi, or Gujarati.\n5. 🎭 **4 Guide Personas**: Switch between **Short** (quick facts), **Detailed** (archaeological depth), **Kids** (fun fairy-tale mode), and **Narrative** (epic storytelling)!\n6. 📶 **Works 100% Offline**: Full access to verified heritage knowledge even in remote desert and mountain areas without internet.`;
      }
      sourceLabel = 'App Features & Capabilities';
      break;
    }

    case 'HELP': {
      if (language === 'hi') {
        answer = `💡 **मैं आपकी मदद के लिए यहाँ हूँ!**\n\nआप मुझसे किसी भी स्मारक के बारे में पूछ सकते हैं:\n• *"रानी की वाव क्यों खास है?"*\n• *"मोढेरा सूर्य मंदिर का समय क्या है?"*\n• *"वडोदरा का लक्ष्मी विलास पैलेस किसने बनवाया?"*\n\nआप नीचे दिए गए सुझावों पर टैप कर सकते हैं या किसी भी स्मारक का नाम लिख सकते हैं!`;
      } else {
        answer = `💡 **I'm right here to guide you!**\n\nYou can ask me questions such as:\n• *"Why is Rani ki Vav considered an architectural miracle?"*\n• *"What are the timings and best time to visit Modhera Sun Temple?"*\n• *"Who built the Laxmi Vilas Palace in Vadodara?"*\n• *"Recommend a weekend heritage trip from Ahmedabad"*\n\nYou can also tap any quick suggestion chip or type the name of any place!`;
      }
      sourceLabel = 'User Guidance';
      break;
    }

    case 'GRATITUDE': {
      if (language === 'hi') {
        answer = `🙏 **आपका बहुत-बहुत धन्यवाद!**\n\nभारत के समृद्ध इतिहास को आपके साथ साझा करना मेरा सौभाग्य है। यदि कोई और सवाल हो या यात्रा की सलाह चाहिए, तो बेझिझक पूछिए! आपकी यात्रा मंगलमय हो! ✨`;
      } else if (language === 'gu') {
        answer = `🙏 **તમારો ખૂબ ખૂબ આભાર!**\n\nભારતના ભવ્ય વારસાને આપની સાથે માણવો એ મારો લહાવો છે. આગળ કંઈ પણ પૂછવું હોય તો ચોક્કસ જણાવજો. આપનો પ્રવાસ મંગલમય રહે! ✨`;
      } else {
        answer = `🙏 **You're most welcome!**\n\nIt is my absolute pleasure to guide you through India's glorious past. If you have more questions or need travel recommendations, just ask! Happy exploring! ✨`;
      }
      sourceLabel = 'Conversational Guide';
      break;
    }

    case 'FAREWELL': {
      if (language === 'hi') {
        answer = `👋 **शुभ यात्रा और अलविदा!**\n\nआशा है कि आपकी ऐतिहासिक यात्रा सुखद और यादगार रहेगी। जब भी किसी स्मारक के बारे में जानना हो, मैं यहीं मिलूँगा!`;
      } else if (language === 'gu') {
        answer = `👋 **આવજો અને તમારી યાત્રા મંગલમય રહે!**\n\nજ્યારે પણ કોઈ ઐતિહાસિક સ્થળ વિશે જાણવું હોય, ત્યારે હું તમારી સાથે જ છું.`;
      } else {
        answer = `👋 **Safe travels and goodbye for now!**\n\nMay your journey through India's heritage monuments be filled with wonder and unforgettable memories. Come back anytime you need a guide!`;
      }
      sourceLabel = 'Conversational Guide';
      break;
    }

    case 'TRIVIA': {
      const triviaFacts = [
        '🧱 **Floating Bricks of Ramappa Temple**: The bricks used in the superstructure of the 13th-century Ramappa Temple in Telangana are so ultra-light and porous that they actually float when dropped in water, designed to reduce seismic load during earthquakes!',
        '☀️ **Solar Geometry at Modhera Sun Temple**: Masterfully engineered in 1026 AD so that during spring and autumn equinoxes, the very first ray of the dawn sun travels through the pillared halls to illuminate the golden Sun God in the inner sanctum!',
        '🛕 **The 80-Ton Capstone of Thanjavur**: The monumental granite Kumbam atop Brihadisvara Temple weighs 80 tonnes. It was hauled to a height of 66 meters along a 6-kilometer long inclined earthen ramp over 1,000 years ago!',
        '🗣️ **Gol Gumbaz Whispering Gallery**: The circular gallery of Gol Gumbaz in Bijapur is so acoustically precise that the softest whisper echoes 7 to 10 times and is clearly heard 44 meters away on the opposite side!',
        '💧 **Chand Baori\'s Optical Illusion**: With 3,500 perfectly symmetrical steps descending 13 storeys into the earth, the geometric alignment makes it almost impossible to walk down and up using the same steps twice!'
      ];
      const randomFact = triviaFacts[Math.floor(Math.random() * triviaFacts.length)];
      answer = `✨ **Fascinating Heritage Trivia:**\n\n${randomFact}\n\nWould you like to hear another mystery from ancient India? Just ask!`;
      sourceLabel = 'Architectural Curiosities & Secrets';
      break;
    }

    case 'RECOMMEND_GUJARAT': {
      answer = `🌟 **Top Heritage Destinations in Gujarat:**\n\n1. 🏛️ **Rani ki Vav (Patan)**: UNESCO World Heritage 7-storey subterranean stepwell adorned with 500+ celestial Vishnu and Apsara sculptures.\n2. ☀️ **Sun Temple (Modhera)**: 11th-century Solanki architectural masterpiece with 52 carved pillars and 108 miniature shrines around Surya Kund.\n3. 🇮🇳 **Statue of Unity (Kevadia / Ekta Nagar)**: World's tallest statue (182m) celebrating Sardar Vallabhbhai Patel with Sardar Sarovar Dam vistas.\n4. 🔱 **Somnath & Dwarka**: Somnath (First Aadi Jyotirlinga on the Arabian Sea) & Dwarkadhish Temple (ancient kingdom of Lord Krishna).\n5. 👑 **Laxmi Vilas Palace (Vadodara)**: Four times the size of Buckingham Palace, showcasing royal Indo-Saracenic grandeur.\n6. 🏰 **Champaner-Pavagadh**: UNESCO pre-Mughal archaeological city with historic mosques and hilltop Kali temple.\n7. 🏺 **Dholavira & Lothal**: 4,500-year-old Harappan cities featuring the world's earliest known tidal dockyard and urban water management system.`;
      sourceLabel = 'Gujarat Tourism & ASI Directory';
      break;
    }

    case 'RECOMMEND_INDIA': {
      answer = `🇮🇳 **Top Iconic Heritage Sites Across India:**\n\n1. 🤍 **Taj Mahal (Agra)**: The pinnacle of Mughal marble symmetry on the banks of Yamuna.\n2. 🛕 **Hampi (Karnataka)**: The majestic boulder-strewn capital of the Vijayanagara Empire with stone chariot and musical pillars.\n3. 🎨 **Ajanta & Ellora Caves (Maharashtra)**: 34 rock-cut cave temples carved entirely by hand out of basalt cliffs, crowned by the Kailasa Temple.\n4. ☀️ **Konark Sun Temple (Odisha)**: Colossal 13th-century chariot carved of stone with 24 intricate wheels serving as sundials.\n5. 🏰 **Mehrangarh Fort (Jodhpur)**: One of India's largest and most formidable hill forts, towering 400 feet above the Blue City.\n6. 🌸 **Khajuraho Group of Monuments (Madhya Pradesh)**: Chandela-dynasty Nagara temples famous for exquisite stone carvings.\n7. 🛕 **Brihadisvara Temple (Thanjavur)**: Chola architectural triumph made entirely of granite, a thousand years old.`;
      sourceLabel = 'National Heritage Highlights';
      break;
    }

    case 'TRIP_PLANNING': {
      answer = `🗺️ **Suggested 3-Day Heritage Circuit (Gujarat Heritage Triangle):**\n\n• **Day 1: Royal Stepwells & Solanki Wonders**\n  - Morning: Explore **Adalaj Stepwell** in Gandhinagar.\n  - Afternoon: Head to Patan for **Rani ki Vav** (UNESCO World Heritage Site).\n  - Evening: Sunset at **Modhera Sun Temple** to admire the carved Surya Kund.\n\n• **Day 2: Royal Vadodara & Champaner**\n  - Morning: Visit the opulent **Laxmi Vilas Palace** & Gaekwad Art Museum in Vadodara.\n  - Afternoon: UNESCO Archaeological Park of **Champaner-Pavagadh** (Jama Masjid & citadel).\n\n• **Day 3: Symbol of Unity & Ekta Nagar**\n  - Full day at **Statue of Unity** (182m observation deck, museum, Valley of Flowers, and evening laser projection show).\n\n💡 *Tip: You can also use our **Plan tab** at the bottom to customize your route and navigate step-by-step!*`;
      sourceLabel = 'Curated Itinerary Planner';
      break;
    }

    case 'CONCEPT_STEPWELL': {
      answer = `💧 **What is a Stepwell (Vav / Baori)?**\n\nA stepwell is an ingenious subterranean architectural marvel unique to Western India (primarily Gujarat and Rajasthan). Unlike ordinary vertical wells where water is hoisted with ropes, a stepwell features descending stone staircases, multi-tiered pillared pavilions, and stepped galleries that allowed travelers and locals to walk down directly to the water level as it rose and fell with the seasons.\n\n👑 **Why Were They Built?**\n1. **Water Conservation**: Essential for surviving harsh, arid dry seasons by harvesting monsoon rainwater.\n2. **Cooling Sanctuaries**: The underground chambers remained 5°C to 10°C cooler than the scorching desert surface, serving as resting havens for caravan traders.\n3. **Sacred Inverted Temples**: Adorned with deities (especially Vishnu and water goddesses) to honor water as a divine life-giving gift.\n\n🌟 **Top Examples**: Rani ki Vav (Patan), Adalaj Stepwell (Gandhinagar), Dada Harir Vav (Ahmedabad), and Chand Baori (Abhaneri).`;
      sourceLabel = 'Architectural Encyclopaedia';
      break;
    }

    case 'CONCEPT_TEMPLE_ARCH': {
      answer = `🛕 **The Three Major Classical Temple Styles of India:**\n\n1. **Nagara Style (North & Western India)**:\n   • Characterized by beehive-shaped curving towers called *Shikharas*.\n   • Square sanctum (*Garbhagriha*) preceded by pillared assembly halls (*Mandapas*).\n   • Prime examples: Modhera Sun Temple, Khajuraho, Konark, and Somnath.\n\n2. **Dravidian Style (South India)**:\n   • Marked by pyramid-stepped tower roofs called *Vimana* and monumental entrance gateway towers called *Gopurams*.\n   • Surrounded by elaborate pillared corridors (*Prakaras*) and sacred temple water tanks.\n   • Prime examples: Brihadisvara Temple (Thanjavur), Meenakshi Temple (Madurai).\n\n3. **Vesara Style (Central & Deccan India)**:\n   • A harmonious hybrid blending Nagara curvilinear spires with Dravidian stepped tiers.\n   • Championed by the Chalukyas, Hoysalas, and Kakatiyas (e.g. Belur, Halebidu, Ramappa Temple).`;
      sourceLabel = 'Indian Temple Architecture Compendium';
      break;
    }

    case 'CONCEPT_UNESCO': {
      answer = `🏛️ **UNESCO World Heritage Sites in Gujarat & India:**\n\nIndia is home to **42 UNESCO World Heritage Sites**, with Gujarat boasting 4 world-renowned marvels:\n\n1. 🏛️ **Rani ki Vav, Patan (2014)**: The supreme pinnacle of subterranean stepwell engineering and Solanki stone art.\n2. 🏰 **Champaner-Pavagadh Archaeological Park (2004)**: Complete pre-Mughal Islamic city blending Hindu-Muslim architectural forms.\n3. 🏙️ **Historic City of Ahmedabad (2017)**: India's first UNESCO World Heritage City, famous for traditional Pol housing, wooden Havelis, and Sidi Saiyyed Jali.\n4. 🏺 **Dholavira: A Harappan City (2021)**: 4,500-year-old Bronze Age metropolis in Kutch with advanced stone fortifications and massive rainwater reservoirs.`;
      sourceLabel = 'UNESCO World Heritage Centre';
      break;
    }

    case 'CONCEPT_ASI': {
      answer = `🏛️ **About the Archaeological Survey of India (ASI):**\n\nFounded in 1861 by British engineer and archaeologist **Alexander Cunningham**, the Archaeological Survey of India (ASI) is an attached agency of the Ministry of Culture, Government of India.\n\n🛡️ **Key Responsibilities:**\n• Protection and conservation of over **3,690 national monuments** and archaeological sites across India.\n• Conducting archaeological excavations, epigraphical research, and scientific chemical preservation.\n• Managing on-site site museums and promoting heritage tourism and world heritage nominations.`;
      sourceLabel = 'Archaeological Survey of India';
      break;
    }

    case 'CONCEPT_SARDAR_PATEL': {
      answer = `🇮🇳 **Sardar Vallabhbhai Patel (The Iron Man of India):**\n\nBorn in Nadiad, Gujarat, Sardar Vallabhbhai Patel was India's first Deputy Prime Minister and Home Minister. Through masterful diplomacy and decisive statesmanship, he integrated **562 princely states** into the sovereign Republic of India without bloodshed.\n\n🗽 **The Statue of Unity:**\nStanding at 182 meters (597 feet) on Sadhu Bet facing the Sardar Sarovar Dam, it was built using iron collected from millions of Indian farmers, standing as an eternal beacon of national integration, resilience, and unity.`;
      sourceLabel = 'National Archives of India';
      break;
    }

    case 'CONCEPT_HARAPPAN': {
      answer = `🏺 **The Harappan (Indus Valley) Civilization in Gujarat:**\n\nGujarat was one of the most flourishing coastal and trading centers of the Indus Valley Civilization (2600 BCE – 1900 BCE):\n\n• **Lothal (Bhal Region)**: Home to the **world's earliest known tidal dockyard**, connecting Harappan merchants by sea to ancient Mesopotamia and the Persian Gulf. Famous for bead-making factories and precise weight systems.\n• **Dholavira (Khadir Bet, Kutch)**: A planned city built entirely of dressed stone rather than mud-brick. Renowned for its sophisticated cascading rainwater harvesting system with huge rock-cut reservoirs, massive citadel, and a stadium with a signboard containing 10 Indus script symbols.`;
      sourceLabel = 'Harappan Archaeological Chronicles';
      break;
    }

    default:
      answer = `🏛️ **I'm your AI Heritage Guide!**\n\nAsk me anything about India's temples, forts, stepwells, palaces, and archaeological monuments!`;
      sourceLabel = 'AI Heritage Guide';
  }

  return {
    answer,
    sources: [{ name: sourceLabel, text: 'Verified Cultural & Heritage Archive' }],
    confidence: 0.98,
    mode,
    language,
  };
}
