import prisma from '../config/database';

const PLACES_DATA = [
  {
    id: 'p1-laxmi-vilas',
    name: 'Laxmi Vilas Palace',
    nameHi: 'लक्ष्मी विलास पैलेस',
    nameGu: 'લક્ષ્મી વિલાસ પેલેસ',
    latitude: 22.2932,
    longitude: 73.1903,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lukshmi_Vilas_Palace.jpg/1280px-Lukshmi_Vilas_Palace.jpg',
    openingHours: '9:30 AM - 5:00 PM (Closed Mondays)',
    rating: 4.6,
    shortDescription: 'Grand royal palace of the Gaekwad dynasty, four times the size of Buckingham Palace.',
  },
  {
    id: 'p2-baroda-museum',
    name: 'Baroda Museum & Picture Gallery',
    nameHi: 'बड़ौदा संग्रहालय और चित्र दीर्घा',
    nameGu: 'બરોડા મ્યુઝિયમ અને પિક્ચર ગેલેરી',
    latitude: 22.3103,
    longitude: 73.1879,
    category: 'museum',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Baroda_Museum.jpg/1280px-Baroda_Museum.jpg',
    openingHours: '10:30 AM - 5:30 PM (Closed Mondays & Holidays)',
    rating: 4.3,
    shortDescription: 'One of the oldest museums in Gujarat, housing Mughal miniatures, European art, and a blue whale skeleton.',
  },
  {
    id: 'p3-kirti-mandir',
    name: 'Kirti Mandir',
    nameHi: 'कीर्ति मंदिर',
    nameGu: 'કીર્તિ મંદિર',
    latitude: 22.2988,
    longitude: 73.2014,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Kirti_Mandir_Baroda.jpg/1280px-Kirti_Mandir_Baroda.jpg',
    openingHours: '9:00 AM - 12:00 PM, 3:00 PM - 6:00 PM',
    rating: 4.2,
    shortDescription: 'Memorial temple of the Gaekwad royal family, featuring Nagara-style architecture.',
  },
  {
    id: 'p4-eme-temple',
    name: 'EME Temple (Dakshinamurthy)',
    nameHi: 'ईएमई मंदिर (दक्षिणामूर्ति)',
    nameGu: 'EME મંદિર (દક્ષિણામૂર્તિ)',
    latitude: 22.3149,
    longitude: 73.1729,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Eme_temple_baroda.jpg/1280px-Eme_temple_baroda.jpg',
    openingHours: '6:00 AM - 9:00 PM',
    rating: 4.4,
    shortDescription: 'Unique multi-faith temple built by the Indian Army with an aluminum dome.',
  },
  {
    id: 'p5-sursagar',
    name: 'Sursagar Lake',
    nameHi: 'सुरसागर झील',
    nameGu: 'સુરસાગર તળાવ',
    latitude: 22.3009,
    longitude: 73.1941,
    category: 'culture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sursagar_Talav.jpg/1280px-Sursagar_Talav.jpg',
    openingHours: 'Open 24 hours',
    rating: 4.1,
    shortDescription: 'Historic lake in the heart of Vadodara with a towering Shiva statue.',
  },
  {
    id: 'p6-sayaji-baug',
    name: 'Sayaji Baug (Kamati Baug)',
    nameHi: 'सयाजी बाग (कमाटी बाग)',
    nameGu: 'સયાજી બાગ (કમાટી બાગ)',
    latitude: 22.3108,
    longitude: 73.1892,
    category: 'culture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Sayaji_Baug_Baroda.jpg/1280px-Sayaji_Baug_Baroda.jpg',
    openingHours: '5:30 AM - 10:30 PM',
    rating: 4.5,
    shortDescription: 'Sprawling 113-acre garden commissioned by Maharaja Sayajirao III, housing the museum and zoo.',
  },
  {
    id: 'p7-nyay-mandir',
    name: 'Nyay Mandir',
    nameHi: 'न्याय मंदिर',
    nameGu: 'ન્યાય મંદિર',
    latitude: 22.2994,
    longitude: 73.2041,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Nyay_Mandir_Vadodara.JPG/1280px-Nyay_Mandir_Vadodara.JPG',
    openingHours: 'Court hours (Exterior accessible anytime)',
    rating: 4.0,
    shortDescription: 'Heritage court building known as the "Temple of Justice" with Indo-Saracenic architecture.',
  },
  {
    id: 'p8-makarpura-palace',
    name: 'Makarpura Palace',
    nameHi: 'मकरपुरा पैलेस',
    nameGu: 'મકરપુરા પેલેસ',
    latitude: 22.2627,
    longitude: 73.2082,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Makarpura_Palace_Vadodara.jpg/1280px-Makarpura_Palace_Vadodara.jpg',
    openingHours: 'Not open to public (Exterior viewable)',
    rating: 4.0,
    shortDescription: 'Italian Renaissance-style summer palace of the Gaekwad dynasty, now an IAF training facility.',
  },
  {
    id: 'p9-pratap-vilas',
    name: 'Pratap Vilas Palace',
    nameHi: 'प्रताप विलास पैलेस',
    nameGu: 'પ્રતાપ વિલાસ પેલેસ',
    latitude: 22.3301,
    longitude: 73.1756,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Railway_Staff_College_Vadodara.jpg/1280px-Railway_Staff_College_Vadodara.jpg',
    openingHours: 'Limited access (Railway Staff College)',
    rating: 4.1,
    shortDescription: 'Elegant palace built for the Gaekwad crown prince, now home to the Railway Staff College.',
  },
  {
    id: 'p10-tambekar-wada',
    name: 'Tambekar Wada',
    nameHi: 'तांबेकर वाड़ा',
    nameGu: 'તાંબેકર વાડા',
    latitude: 22.2978,
    longitude: 73.2028,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Tambekar_Wada_Baroda.jpg/1280px-Tambekar_Wada_Baroda.jpg',
    openingHours: '10:00 AM - 5:00 PM',
    rating: 4.0,
    shortDescription: 'Historic Maratha-era mansion with exquisite wall paintings depicting scenes from Hindu epics.',
  },
  {
    id: 'p11-champaner',
    name: 'Champaner-Pavagadh Archaeological Park',
    nameHi: 'चांपानेर-पावागढ़ पुरातात्विक उद्यान',
    nameGu: 'ચાંપાનેર-પાવાગઢ પુરાતત્વીય ઉદ્યાન',
    latitude: 22.4860,
    longitude: 73.5339,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Champaner.jpg/1280px-Champaner.jpg',
    openingHours: '8:30 AM - 5:00 PM',
    rating: 4.7,
    shortDescription: 'UNESCO World Heritage Site with remarkable blend of Hindu-Muslim architecture from the 15th century.',
  },
  {
    id: 'p12-jama-masjid-champaner',
    name: 'Jama Masjid, Champaner',
    nameHi: 'जामा मस्जिद, चांपानेर',
    nameGu: 'જામા મસ્જિદ, ચાંપાનેર',
    latitude: 22.4871,
    longitude: 73.5367,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Jama_Masjid_Champaner.jpg/1280px-Jama_Masjid_Champaner.jpg',
    openingHours: '8:30 AM - 5:00 PM',
    rating: 4.6,
    shortDescription: 'Magnificent 15th-century mosque blending Islamic and Jain architectural elements.',
  },
  {
    id: 'p13-kevda-masjid',
    name: 'Kevda Masjid',
    nameHi: 'केवड़ा मस्जिद',
    nameGu: 'કેવડા મસ્જિદ',
    latitude: 22.4845,
    longitude: 73.5320,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Kevda_Masjid.jpg/800px-Kevda_Masjid.jpg',
    openingHours: '8:30 AM - 5:00 PM',
    rating: 4.3,
    shortDescription: 'Beautiful medieval mosque with intricate stone latticework and carved pillars at Champaner.',
  },
  {
    id: 'p14-msu-fine-arts',
    name: 'MSU Faculty of Fine Arts',
    nameHi: 'एमएसयू ललित कला संकाय',
    nameGu: 'MSU ફાઇન આર્ટ્સ ફેકલ્ટી',
    latitude: 22.3126,
    longitude: 73.1807,
    category: 'culture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Faculty_of_Fine_Arts%2C_M.S._University_of_Baroda.jpg/1280px-Faculty_of_Fine_Arts%2C_M.S._University_of_Baroda.jpg',
    openingHours: '10:00 AM - 5:00 PM (Mon-Sat)',
    rating: 4.4,
    shortDescription: 'Premier art institution founded in 1950, showcasing contemporary and traditional Indian art.',
  },
  {
    id: 'p15-nazarbaug-palace',
    name: 'Nazarbaug Palace',
    nameHi: 'नज़रबाग पैलेस',
    nameGu: 'નઝરબાગ પેલેસ',
    latitude: 22.2960,
    longitude: 73.1983,
    category: 'heritage',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Nazar_Bagh_Palace.jpg/800px-Nazar_Bagh_Palace.jpg',
    openingHours: 'Limited access',
    rating: 3.9,
    shortDescription: 'Historic palace that once housed the famous Gaekwad star of diamonds and royal treasures.',
  },
];

const HERITAGE_RECORDS = [
  {
    placeId: 'p1-laxmi-vilas',
    shortStory: `Laxmi Vilas Palace stands as one of the grandest royal residences ever built. Commissioned by Maharaja Sayajirao III in 1878 and completed in 1890, this magnificent palace was designed by British architect Major Charles Mant and later completed by Robert Fellowes Chisholm. Covering an astounding 500 acres, it is four times the size of Buckingham Palace, making it the largest private dwelling built to date. The palace is a masterpiece of Indo-Saracenic architecture, blending Hindu, Gothic, and Mughal elements into a breathtaking whole. Its interiors feature Venetian mosaic floors, Belgian stained-glass windows, and walls adorned with paintings by Raja Ravi Varma. The Gaekwad family still resides in a section of the palace, continuing a royal legacy spanning over a century.`,
    shortStoryHi: `लक्ष्मी विलास पैलेस अब तक बनाए गए सबसे भव्य शाही निवासों में से एक है। 1878 में महाराजा सयाजीराव तृतीय द्वारा निर्माण शुरू कराया गया और 1890 में पूरा हुआ। ब्रिटिश वास्तुकार मेजर चार्ल्स मैंट द्वारा डिज़ाइन किया गया यह महल 500 एकड़ में फैला है और बकिंघम पैलेस से चार गुना बड़ा है।`,
    shortStoryGu: `લક્ષ્મી વિલાસ પેલેસ અત્યાર સુધી બાંધવામાં આવેલા સૌથી ભવ્ય શાહી નિવાસોમાંનો એક છે. 1878માં મહારાજા સયાજીરાવ ત્રીજા દ્વારા બાંધકામ શરૂ કરાવવામાં આવ્યું હતું અને 1890માં પૂર્ણ થયું હતું. 500 એકરમાં ફેલાયેલો આ મહેલ બકિંગહામ પેલેસ કરતાં ચાર ગણો મોટો છે.`,
    history: `The history of Laxmi Vilas Palace is inseparable from the Gaekwad dynasty of Baroda. Maharaja Sayajirao III, who ascended the throne in 1875 at just 12 years of age, envisioned a palace that would reflect the progressive spirit of his rule. Construction began in 1878 under architect Major Charles Mant of the British Indian Army. Tragically, Mant died during construction, and the project was completed by Robert Fellowes Chisholm in 1890. The total cost of construction was ₹60 lakh (approximately $1.5 million at the time)—an astronomical sum. Maharaja Sayajirao III was a visionary ruler who introduced compulsory education, built libraries, and promoted industrialization in Baroda. The palace served as both the administrative seat and the personal residence of the Gaekwad family. During the Indian independence movement, the Gaekwads played a nuanced role, eventually acceding to the Indian Union in 1949. Today, the palace remains the private residence of the Gaekwad family, with select portions open to the public as a museum.`,
    historyHi: `लक्ष्मी विलास पैलेस का इतिहास बड़ौदा के गायकवाड़ राजवंश से अभिन्न रूप से जुड़ा है। महाराजा सयाजीराव तृतीय ने 1875 में मात्र 12 वर्ष की आयु में सिंहासन पर बैठे और एक ऐसे महल की कल्पना की जो उनके प्रगतिशील शासन की भावना को प्रतिबिंबित करे।`,
    historyGu: `લક્ષ્મી વિલાસ પેલેસનો ઇતિહાસ બરોડાના ગાયકવાડ રાજવંશ સાથે અવિભાજ્ય રીતે જોડાયેલો છે. મહારાજા સયાજીરાવ ત્રીજાએ 1875માં માત્ર 12 વર્ષની ઉંમરે સિંહાસન પર બેઠા અને એક એવા મહેલની કલ્પના કરી જે તેમના પ્રગતિશીલ શાસનની ભાવનાને પ્રતિબિંબિત કરે.`,
    significance: `Laxmi Vilas Palace holds immense cultural and historical significance as a symbol of the progressive Gaekwad dynasty. It represents the synthesis of Indian and European architectural traditions and stands as testament to Baroda's golden age of reform under Sayajirao III. The palace housed one of the finest collections of European and Indian art, including works by Raja Ravi Varma. It continues to be a living palace—one of the few in India still occupied by a royal family—making it a unique window into India's princely heritage.`,
    architecture: `The palace exemplifies Indo-Saracenic Revival architecture—a style that blends traditional Indian elements with Gothic Revival and Islamic motifs. Key features include: ornate domes and minarets, a massive central dome visible for miles, intricate jaali (lattice) work in stone, a grand Durbar Hall with Italian mosaic floors, Venetian chandeliers and Belgian stained glass throughout, extensive gardens designed in a mix of Mughal and English styles, and a private golf course. The interiors feature rare Italian marble, hand-carved teak, and a stunning collection of armory and sculpture.`,
    keyFacts: [
      'Built: 1878-1890 (12 years of construction)',
      'Architect: Major Charles Mant, completed by R.F. Chisholm',
      'Area: 500 acres (four times Buckingham Palace)',
      'Cost: ₹60 lakh (~$1.5 million in 1890)',
      'Style: Indo-Saracenic Revival',
      'Current Status: Private residence of Gaekwad family, partially open as museum',
      'Contains paintings by Raja Ravi Varma',
    ],
    period: '1878-1890',
  },
  {
    placeId: 'p2-baroda-museum',
    shortStory: `The Baroda Museum & Picture Gallery is one of India's oldest and most distinguished museums, established in 1894 by the visionary Maharaja Sayajirao III. Housed in a stunning Indo-Saracenic building within the lush Sayaji Baug gardens, this museum is a treasure trove spanning art, archaeology, ethnology, and natural history. Its most famous exhibit is a complete blue whale skeleton, one of only a handful displayed in all of Asia. The picture gallery features an extraordinary collection of Mughal miniatures, European oil paintings, and works by Japanese and Chinese masters. For over 130 years, this institution has served as a center of learning and cultural appreciation, fulfilling Maharaja Sayajirao's vision of public education through art and science.`,
    history: `Maharaja Sayajirao III established the museum in 1894 as part of his broader vision of modernizing Baroda through public institutions. The current building was designed in Indo-Saracenic style and has been expanded multiple times. The museum's collection grew through acquisitions from Europe, Egypt, and across India. During the early 20th century, the Gaekwad rulers donated significant portions of their personal art collections, including Mughal miniatures and European paintings. The museum survived the political upheavals of Indian independence and the merger of princely states, continuing to operate as a public institution under the Gujarat state government.`,
    significance: `As one of Gujarat's premier cultural institutions, the museum preserves over 100,000 objects spanning millennia of human civilization. It serves as an important center for art education and historical research. The collection of Mughal miniatures is considered one of the finest outside Delhi, and the natural history section provides valuable educational resources for students across Gujarat.`,
    architecture: `The museum building showcases Indo-Saracenic architecture with ornate facades, arched windows, and decorative domes. The interior features high-ceilinged galleries with natural lighting designed to showcase artwork effectively. The building is surrounded by the gardens of Sayaji Baug, creating a harmonious integration of architecture and landscape.`,
    keyFacts: [
      'Established: 1894 by Maharaja Sayajirao III',
      'Location: Inside Sayaji Baug (Kamati Baug)',
      'Famous Exhibit: Complete Blue Whale skeleton',
      'Collection: Mughal miniatures, European art, Egyptian artifacts',
      'Houses paintings by Raphael, Titian, and Murillo',
      'Over 100,000 objects in the collection',
    ],
    period: '1894',
  },
  {
    placeId: 'p3-kirti-mandir',
    shortStory: `Kirti Mandir, meaning "Temple of Fame," is a sacred memorial built in honor of the Gaekwad royal family of Baroda. Constructed between 1936 and 1941 by Maharaja Pratapsinhrao Gaekwad, it serves as the cenotaph of the Baroda ruling dynasty. The temple features stunning Hindu Nagara-style architecture with intricately carved spires and pillars. Inside, visitors find memorial plaques dedicated to each Gaekwad ruler, along with beautiful murals depicting scenes from their lives and contributions to Baroda's development. The complex also houses a music college, continuing the Gaekwad tradition of patronizing arts and culture.`,
    history: `Kirti Mandir was commissioned by Maharaja Pratapsinhrao Gaekwad to honor the memory of the Gaekwad dynasty rulers who transformed Baroda into one of India's most progressive princely states. The construction spanned from 1936 to 1941. The site was chosen for its historical significance in the old city area of Baroda.`,
    significance: `The temple serves as a lasting tribute to the Gaekwad dynasty's contributions to education, arts, and social reform in Gujarat. It is particularly significant as a memorial to Maharaja Sayajirao III, whose progressive policies including compulsory education, women's empowerment, and anti-caste discrimination made Baroda a model state.`,
    architecture: `Built in the Hindu Nagara architectural style with multiple spires (shikharas), the temple features intricate stone carvings, ornamental pillars, and painted murals. The design incorporates traditional Gujarati temple architecture with some modern elements reflecting the era of construction.`,
    keyFacts: [
      'Built: 1936-1941',
      'Purpose: Memorial/cenotaph of Gaekwad dynasty',
      'Style: Hindu Nagara architecture',
      'Commissioned by: Maharaja Pratapsinhrao Gaekwad',
      'Features murals depicting Gaekwad rulers',
      'Adjacent music college continues cultural patronage',
    ],
    period: '1936-1941',
  },
  {
    placeId: 'p4-eme-temple',
    shortStory: `The EME Temple, officially known as Dakshinamurthy Temple, is one of the most unique religious structures in India. Built by the Corps of Electronics and Mechanical Engineers (EME) of the Indian Army, this temple is a marvel of modern engineering and interfaith harmony. Its most striking feature is a geodesic dome made entirely of aluminum, giving it a futuristic appearance. What makes this temple truly special is its secular design—symbols of all major religions adorn its exterior, representing the unity and diversity of the Indian armed forces. Inside, it houses a Shiva Lingam dedicated to Lord Dakshinamurthy, the supreme teacher. The temple grounds feature decommissioned military equipment, creating a unique blend of spirituality and patriotism.`,
    history: `The temple was conceived and built by the EME Corps of the Indian Army as a tribute to the soldiers who served the nation. The construction used innovative engineering techniques, with the aluminum dome being its most distinctive feature. Military personnel from all faiths contributed to its creation, reflecting the secular ethos of the Indian armed forces.`,
    significance: `The EME Temple symbolizes India's pluralistic values and the secular traditions of the Indian military. It demonstrates that innovation and tradition can coexist, and that all faiths can find common ground in a shared space. The temple has become an important landmark in Vadodara and attracts visitors of all faiths.`,
    architecture: `The temple features a striking geodesic aluminum dome that catches light dramatically. The exterior walls display symbols of Hinduism, Islam, Christianity, Buddhism, Sikhism, and other faiths. The grounds include landscaped gardens and displays of decommissioned military equipment.`,
    keyFacts: [
      'Built by: Corps of Electronics & Mechanical Engineers (EME), Indian Army',
      'Unique Feature: Aluminum geodesic dome',
      'Multi-faith symbols on exterior',
      'Dedicated to: Lord Dakshinamurthy (Shiva)',
      'Features decommissioned military equipment',
      'Free entry for all visitors',
    ],
    period: 'Modern (20th century)',
  },
  {
    placeId: 'p5-sursagar',
    shortStory: `Sursagar Lake is a historic artificial lake situated in the heart of Vadodara, serving as the city's cultural and recreational focal point. Originally constructed to store water for the city, it has been transformed over the centuries into a beautiful urban landmark. The lake's most iconic feature is the towering 120-feet statue of Lord Shiva sitting in meditation at its center, added in the early 2000s. In the evenings, the lake comes alive with a stunning musical fountain and light show. Sursagar has witnessed centuries of Vadodara's history—from the Maratha period through the Gaekwad era to modern times—and remains the city's most beloved gathering space for festivals, evening walks, and cultural celebrations.`,
    history: `Sursagar Lake has been an integral part of Vadodara's urban landscape for centuries. Originally a natural depression, it was developed as a water reservoir during the medieval period. The Gaekwad rulers further beautified it as part of their city improvement projects. In the early 2000s, the Vadodara Municipal Corporation undertook a major renovation, adding the iconic Shiva statue and musical fountain.`,
    significance: `Sursagar serves as the cultural heart of Vadodara, hosting festivals, evening gatherings, and cultural events. The Shiva statue has become a defining symbol of the city's identity. The lake area represents the living, breathing center of Vadodara's community life.`,
    keyFacts: [
      'Location: Heart of Vadodara city',
      'Shiva Statue Height: Approximately 120 feet',
      'Features: Musical fountain and light show',
      'Originally a water reservoir',
      'Major renovation in early 2000s',
      'Popular venue for Ganesh Visarjan and festivals',
    ],
    period: 'Medieval to Modern',
  },
  {
    placeId: 'p6-sayaji-baug',
    shortStory: `Sayaji Baug, popularly known as Kamati Baug, is one of the largest and most beautiful public gardens in western India. Spanning 113 acres in the heart of Vadodara, these gardens were commissioned by the visionary Maharaja Sayajirao III in 1879. The gardens house not just stunning botanical collections but also the Baroda Museum, a planetarium, a zoo, a health museum, and a floral clock. With over 100 species of trees from around the world and beautifully manicured flowerbeds, Sayaji Baug represents the Gaekwad dynasty's commitment to public welfare and education. Every day, thousands of residents stroll through these gardens, enjoying a green oasis that has served as Vadodara's lungs for over 140 years.`,
    history: `Maharaja Sayajirao III commissioned these gardens in 1879, naming them after himself. The gardens were designed with both aesthetic beauty and educational purpose in mind. Over the decades, the gardens expanded to include educational institutions like the museum, planetarium, and zoo, making it a comprehensive public recreation and education center.`,
    significance: `Sayaji Baug represents one of the earliest public gardens in India and reflects Maharaja Sayajirao III's progressive vision of public welfare. It serves as Vadodara's primary green space, cultural hub, and educational center, attracting over 2 million visitors annually.`,
    architecture: `The gardens feature a mix of formal Mughal-style layouts and English landscaping, with wide avenues, decorative fountains, flower gardens, and wooded areas. The garden also houses multiple heritage buildings including the museum and zoo structures.`,
    keyFacts: [
      'Established: 1879 by Maharaja Sayajirao III',
      'Area: 113 acres',
      'Houses: Baroda Museum, Planetarium, Zoo, Health Museum',
      'Features a Floral Clock',
      'Over 100 species of trees from around the world',
      'Annual visitors: Over 2 million',
    ],
    period: '1879',
  },
  {
    placeId: 'p7-nyay-mandir',
    shortStory: `Nyay Mandir, meaning "Temple of Justice," is Vadodara's iconic heritage court building, a stunning example of Indo-Saracenic architecture. Built during the Gaekwad era, this judicial building was designed to embody the principle that justice is as sacred as worship. The building features an ornate clock tower, grand arches, intricate stone carvings, and a magnificent facade that blends Mughal, Gothic, and Hindu architectural elements. Even today, Nyay Mandir functions as a district court, making it one of India's most architecturally significant judicial buildings still in active use. Its very existence reflects the Gaekwad rulers' belief in establishing strong, fair institutions of governance.`,
    history: `Nyay Mandir was built during the reign of the Gaekwad dynasty as part of their comprehensive plan to modernize Baroda's administrative and judicial systems. The building was conceived as a physical embodiment of the importance of justice in governance.`,
    significance: `The building symbolizes the Gaekwad commitment to rule of law and justice. It remains one of India's most beautiful court buildings and a testament to the idea that functional government buildings can also be works of art.`,
    keyFacts: [
      'Name means: "Temple of Justice"',
      'Style: Indo-Saracenic architecture',
      'Features: Ornate clock tower, grand arches',
      'Status: Still functions as a district court',
      'Built during: Gaekwad dynasty era',
    ],
    period: 'Late 19th / Early 20th century',
  },
  {
    placeId: 'p10-tambekar-wada',
    shortStory: `Tambekar Wada is a magnificent Maratha-era mansion that houses some of the finest wall paintings in Gujarat. Built in the early 19th century by Bhau Tambekar, a minister in the Gaekwad court, this three-story wooden structure is renowned for its vibrant frescoes depicting scenes from Hindu epics—the Ramayana and Mahabharata. The murals showcase the distinct Maratha painting style with bold colors, detailed figure work, and narrative storytelling across walls and ceilings. Despite challenges of preservation over two centuries, the surviving paintings offer an invaluable glimpse into the artistic traditions and cultural life of Maratha-era Vadodara.`,
    history: `Tambekar Wada was built by Bhau Tambekar, who served as a minister under the Gaekwad rulers of Baroda. The mansion reflects the Maratha cultural influence in Gujarat during the 18th-19th centuries. The wall paintings were likely executed by artists from the Maratha Deccan tradition.`,
    significance: `The Wada represents a rare surviving example of Maratha domestic architecture and mural art in Gujarat. The paintings are among the most important examples of Maratha-era art outside Maharashtra and provide valuable insights into the artistic and cultural exchanges between the Maratha and Gujarati communities.`,
    keyFacts: [
      'Built by: Bhau Tambekar (Gaekwad minister)',
      'Era: Early 19th century (Maratha period)',
      'Famous for: Wall paintings from Hindu epics',
      'Depicts scenes from Ramayana and Mahabharata',
      'Three-story wooden structure',
      'Protected heritage structure',
    ],
    period: 'Early 19th century',
  },
  {
    placeId: 'p11-champaner',
    shortStory: `Champaner-Pavagadh Archaeological Park is a UNESCO World Heritage Site that tells the story of over 2,000 years of Indian history. This remarkable site encompasses an ancient hill fortress, medieval city ruins, and religious monuments spanning Hindu and Islamic traditions. Sultan Mahmud Begada captured Champaner in 1484 and transformed it into the capital of the Gujarat Sultanate, commissioning magnificent mosques, palaces, and civic structures that uniquely blended Islamic and Jain-Hindu architectural elements. The Kalika Mata temple atop Pavagadh Hill dates back even further, to the 10th-11th century. In 2004, UNESCO recognized the site for its exceptional universal value—it is the only complete and unchanged Islamic pre-Mughal city in the world.`,
    history: `The site's history stretches back to prehistoric times, with evidence of habitation from the Chalcolithic era. The Rajputs fortified Pavagadh Hill, and the Chauhan dynasty established a stronghold here. In 1484, Sultan Mahmud Begada of Gujarat conquered Champaner after a prolonged siege and made it his capital, renaming it Muhammadabad. He built a new planned city with mosques, palaces, and fortifications. When the Mughal emperor Humayun captured it in 1535, the capital shifted to Ahmedabad, and Champaner gradually fell into disuse.`,
    significance: `As the only complete and unchanged pre-Mughal Islamic city, Champaner holds unique archaeological and architectural significance. It demonstrates an exceptional interchange of Hindu-Muslim art and architecture, with mosques incorporating Jain and Hindu design elements—a rare example of cultural synthesis.`,
    architecture: `The site features a remarkable blend of Hindu and Islamic architecture. The mosques incorporate Jain and Hindu elements like carved pillars, jaali screens, and temple-like domes. Major structures include Jama Masjid, Kevda Masjid, Nagina Masjid, and the Citadel. The fortification walls stretch for kilometers across the landscape.`,
    keyFacts: [
      'UNESCO World Heritage Site since 2004',
      'Conquered by Sultan Mahmud Begada in 1484',
      'Only complete pre-Mughal Islamic city in the world',
      'Area: Covers 1,329 hectares',
      'Kalika Mata Temple dates to 10th-11th century',
      'Unique blend of Hindu-Jain-Islamic architecture',
      'Major structures: Jama Masjid, Kevda Masjid, Citadel',
    ],
    period: '10th century - 16th century',
  },
  {
    placeId: 'p12-jama-masjid-champaner',
    shortStory: `The Jama Masjid at Champaner is widely regarded as one of the finest mosques in India and a masterpiece of medieval architecture. Built by Sultan Mahmud Begada in the late 15th century, this mosque is extraordinary for its unique fusion of Islamic and Hindu-Jain architectural traditions. Its two soaring minarets, exquisitely carved stone jali (lattice) screens, and grand prayer hall create an atmosphere of profound beauty and serenity. What makes this mosque architecturally revolutionary is how it incorporates Hindu temple elements—carved pillars, ornamental brackets, and a covered courtyard reminiscent of Jain temple mandapas—into an Islamic prayer space. This synthesis created something entirely new in Indian architecture.`,
    history: `Built during the reign of Sultan Mahmud Begada (r. 1458-1511) when Champaner served as the capital of the Gujarat Sultanate. The mosque was part of a grand building program that transformed Champaner into a magnificent capital city. It served as the primary congregational mosque for the entire city.`,
    significance: `The Jama Masjid exemplifies the cultural synthesis that occurred in Gujarat during the Sultanate period. It is considered one of the most beautiful examples of Indian-Islamic architecture and influenced mosque design across western India.`,
    keyFacts: [
      'Built by: Sultan Mahmud Begada (late 15th century)',
      'Part of UNESCO World Heritage Site',
      'Unique Hindu-Jain-Islamic architectural fusion',
      'Features: Two tall minarets, intricate jali screens',
      'Grand prayer hall with 172 pillars',
      'Stone carved ornamentation throughout',
    ],
    period: 'Late 15th century',
  },
];

const SOURCES_DATA = [
  { heritageId: 'p1-laxmi-vilas', sourceName: 'Archaeological Survey of India', sourceUrl: 'https://asi.nic.in', referenceText: 'Laxmi Vilas Palace is listed as a Grade I heritage structure. Designed by Major Charles Mant and completed by R.F. Chisholm in 1890.' },
  { heritageId: 'p1-laxmi-vilas', sourceName: 'Gujarat Tourism', sourceUrl: 'https://www.gujarattourism.com', referenceText: 'Official tourism records confirm the palace covers 500 acres and was built at a cost of ₹60 lakh.' },
  { heritageId: 'p2-baroda-museum', sourceName: 'Baroda Museum Archives', sourceUrl: 'https://www.barodamuseum.com', referenceText: 'The museum was established in 1894 by Maharaja Sayajirao III and houses over 100,000 objects.' },
  { heritageId: 'p11-champaner', sourceName: 'UNESCO World Heritage Centre', sourceUrl: 'https://whc.unesco.org/en/list/1101', referenceText: 'Inscribed in 2004. The site represents the only complete and unchanged Islamic pre-Mughal city.' },
  { heritageId: 'p11-champaner', sourceName: 'Archaeological Survey of India', sourceUrl: 'https://asi.nic.in', referenceText: 'Champaner-Pavagadh is a protected archaeological site covering 1,329 hectares with structures from the 8th to 16th century.' },
  { heritageId: 'p12-jama-masjid-champaner', sourceName: 'UNESCO World Heritage Centre', sourceUrl: 'https://whc.unesco.org/en/list/1101', referenceText: 'The Jama Masjid of Champaner is noted for its exceptional blend of Hindu and Islamic architecture.' },
  { heritageId: 'p4-eme-temple', sourceName: 'Indian Army Records', referenceText: 'The EME Temple was constructed by the Corps of Electronics and Mechanical Engineers as a multi-faith temple.' },
  { heritageId: 'p6-sayaji-baug', sourceName: 'Gujarat Tourism', sourceUrl: 'https://www.gujarattourism.com', referenceText: 'Sayaji Baug spans 113 acres and was established in 1879 by Maharaja Sayajirao Gaekwad III.' },
];

const ARTIFACTS_DATA = [
  { placeId: 'p1-laxmi-vilas', name: 'Palace Facade', nameHi: 'महल का अग्रभाग', nameGu: 'પેલેસ ફેસાડ', description: 'The grand Indo-Saracenic facade of Laxmi Vilas Palace with ornate domes and arches.', visionLabel: 'laxmi_vilas_facade' },
  { placeId: 'p4-eme-temple', name: 'Aluminum Dome', nameHi: 'एल्युमिनियम गुंबद', nameGu: 'એલ્યુમિનિયમ ગુંબજ', description: 'The distinctive geodesic aluminum dome of EME Temple.', visionLabel: 'eme_temple_dome' },
  { placeId: 'p12-jama-masjid-champaner', name: 'Jama Masjid Minaret', nameHi: 'जामा मस्जिद मीनार', nameGu: 'જામા મસ્જિદ મિનારો', description: 'The soaring minarets of Champaner Jama Masjid.', visionLabel: 'champaner_jami_masjid' },
  { placeId: 'p2-baroda-museum', name: 'Museum Sculpture Gallery', nameHi: 'संग्रहालय मूर्ति दीर्घा', nameGu: 'મ્યુઝિયમ શિલ્પ ગેલેરી', description: 'Greco-Roman and Indian sculptures in the Baroda Museum.', visionLabel: 'baroda_museum_statue' },
  { placeId: 'p3-kirti-mandir', name: 'Kirti Mandir Spire', nameHi: 'कीर्ति मंदिर शिखर', nameGu: 'કીર્તિ મંદિર શિખર', description: 'The Nagara-style shikhara of Kirti Mandir memorial.', visionLabel: 'kirti_mandir_memorial' },
  { placeId: 'p10-tambekar-wada', name: 'Wall Murals', nameHi: 'दीवार चित्र', nameGu: 'દીવાલ ચિત્રો', description: 'Maratha-era wall paintings depicting Hindu epics.', visionLabel: 'tambekar_wada_murals' },
  { placeId: 'p5-sursagar', name: 'Shiva Statue', nameHi: 'शिव प्रतिमा', nameGu: 'શિવ પ્રતિમા', description: 'The towering 120-feet Shiva statue at Sursagar Lake.', visionLabel: 'sursagar_shiva' },
  { placeId: 'p11-champaner', name: 'Fort Walls', nameHi: 'किले की दीवारें', nameGu: 'કિલ્લાની દીવાલો', description: 'The massive fortification walls of Champaner citadel.', visionLabel: 'champaner_fort_wall' },
  { placeId: 'p7-nyay-mandir', name: 'Clock Tower', nameHi: 'घंटाघर', nameGu: 'ઘડિયાળ ટાવર', description: 'The ornate clock tower of Nyay Mandir courthouse.', visionLabel: 'nyay_mandir_clock' },
  { placeId: 'p8-makarpura-palace', name: 'Palace Gardens', nameHi: 'महल के बगीचे', nameGu: 'પેલેસ ગાર્ડન', description: 'Italian Renaissance-style gardens of Makarpura Palace.', visionLabel: 'makarpura_palace_garden' },
];

export async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('  Clearing existing data...');
  await prisma.itineraryItem.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.artifact.deleteMany();
  await prisma.source.deleteMany();
  await prisma.heritageRecord.deleteMany();
  await prisma.preference.deleteMany();
  await prisma.user.deleteMany();
  await prisma.place.deleteMany();

  // Seed places
  console.log('  🏛️  Seeding 15 heritage places...');
  for (const place of PLACES_DATA) {
    await prisma.place.create({ data: place });
  }
  console.log(`     ✅ ${PLACES_DATA.length} places created`);

  // Seed heritage records
  console.log('  📜 Seeding heritage records...');
  for (const record of HERITAGE_RECORDS) {
    const place = await prisma.place.findUnique({ where: { id: record.placeId } });
    if (place) {
      await prisma.heritageRecord.create({
        data: {
          placeId: record.placeId,
          shortStory: record.shortStory,
          shortStoryHi: record.shortStoryHi || null,
          shortStoryGu: record.shortStoryGu || null,
          history: record.history,
          historyHi: record.historyHi || null,
          historyGu: record.historyGu || null,
          significance: record.significance,
          architecture: record.architecture || null,
          keyFacts: record.keyFacts,
          period: record.period || null,
        },
      });
    }
  }
  console.log(`     ✅ ${HERITAGE_RECORDS.length} heritage records created`);

  // Seed sources
  console.log('  📚 Seeding verified sources...');
  for (const source of SOURCES_DATA) {
    const record = await prisma.heritageRecord.findUnique({
      where: { placeId: source.heritageId },
    });
    if (record) {
      await prisma.source.create({
        data: {
          heritageId: record.id,
          sourceName: source.sourceName,
          sourceUrl: source.sourceUrl || null,
          referenceText: source.referenceText,
        },
      });
    }
  }
  console.log(`     ✅ ${SOURCES_DATA.length} sources created`);

  // Seed artifacts
  console.log('  🎨 Seeding artifact catalog...');
  for (const artifact of ARTIFACTS_DATA) {
    await prisma.artifact.create({ data: artifact });
  }
  console.log(`     ✅ ${ARTIFACTS_DATA.length} artifacts created`);

  console.log('\n🎉 Database seeding complete!');
  console.log(`   Places: ${PLACES_DATA.length}`);
  console.log(`   Heritage Records: ${HERITAGE_RECORDS.length}`);
  console.log(`   Sources: ${SOURCES_DATA.length}`);
  console.log(`   Artifacts: ${ARTIFACTS_DATA.length}`);
}
