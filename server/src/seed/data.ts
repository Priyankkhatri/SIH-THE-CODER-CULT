import prisma from '../config/database';

export const PLACES_DATA = [
  {
    "id": "p1-laxmi-vilas",
    "name": "Laxmi Vilas Palace",
    "nameHi": "लक्ष्मी विलास पैलेस",
    "nameGu": "લક્ષ્મી વિલાસ પેલેસ",
    "latitude": 22.2932,
    "longitude": 73.1903,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lukshmi_Vilas_Palace.jpg/1280px-Lukshmi_Vilas_Palace.jpg",
    "openingHours": "9:30 AM - 5:00 PM (Closed Mondays)",
    "rating": 4.6,
    "shortDescription": "Grand royal palace of the Gaekwad dynasty, four times the size of Buckingham Palace."
  },
  {
    "id": "p2-baroda-museum",
    "name": "Baroda Museum & Picture Gallery",
    "nameHi": "बड़ौदा संग्रहालय और चित्र दीर्घा",
    "nameGu": "બરોડા મ્યુઝિયમ અને પિક્ચર ગેલેરી",
    "latitude": 22.3103,
    "longitude": 73.1879,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Baroda_Museum.jpg/1280px-Baroda_Museum.jpg",
    "openingHours": "10:30 AM - 5:30 PM (Closed Mondays & Holidays)",
    "rating": 4.3,
    "shortDescription": "One of the oldest museums in Gujarat, housing Mughal miniatures, European art, and a blue whale skeleton."
  },
  {
    "id": "p3-kirti-mandir",
    "name": "Kirti Mandir",
    "nameHi": "कीर्ति मंदिर",
    "nameGu": "કીર્તિ મંદિર",
    "latitude": 22.2988,
    "longitude": 73.2014,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Kirti_Mandir_Baroda.jpg/1280px-Kirti_Mandir_Baroda.jpg",
    "openingHours": "9:00 AM - 12:00 PM, 3:00 PM - 6:00 PM",
    "rating": 4.2,
    "shortDescription": "Memorial temple of the Gaekwad royal family, featuring Nagara-style architecture."
  },
  {
    "id": "p4-eme-temple",
    "name": "EME Temple (Dakshinamurthy)",
    "nameHi": "ईएमई मंदिर (दक्षिणामूर्ति)",
    "nameGu": "EME મંદિર (દક્ષિણામૂર્તિ)",
    "latitude": 22.3149,
    "longitude": 73.1729,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Eme_temple_baroda.jpg/1280px-Eme_temple_baroda.jpg",
    "openingHours": "6:00 AM - 9:00 PM",
    "rating": 4.4,
    "shortDescription": "Unique multi-faith temple built by the Indian Army with an aluminum dome."
  },
  {
    "id": "p5-sursagar",
    "name": "Sursagar Lake",
    "nameHi": "सुरसागर झील",
    "nameGu": "સુરસાગર તળાવ",
    "latitude": 22.3009,
    "longitude": 73.1941,
    "category": "culture",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sursagar_Talav.jpg/1280px-Sursagar_Talav.jpg",
    "openingHours": "Open 24 hours",
    "rating": 4.1,
    "shortDescription": "Historic lake in the heart of Vadodara with a towering Shiva statue."
  },
  {
    "id": "p6-sayaji-baug",
    "name": "Sayaji Baug (Kamati Baug)",
    "nameHi": "सयाजी बाग (कमाटी बाग)",
    "nameGu": "સયાજી બાગ (કમાટી બાગ)",
    "latitude": 22.3108,
    "longitude": 73.1892,
    "category": "culture",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Sayaji_Baug_Baroda.jpg/1280px-Sayaji_Baug_Baroda.jpg",
    "openingHours": "5:30 AM - 10:30 PM",
    "rating": 4.5,
    "shortDescription": "Sprawling 113-acre garden commissioned by Maharaja Sayajirao III, housing the museum and zoo."
  },
  {
    "id": "p7-nyay-mandir",
    "name": "Nyay Mandir",
    "nameHi": "न्याय मंदिर",
    "nameGu": "ન્યાય મંદિર",
    "latitude": 22.2994,
    "longitude": 73.2041,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Nyay_Mandir_Vadodara.JPG/1280px-Nyay_Mandir_Vadodara.JPG",
    "openingHours": "Court hours (Exterior accessible anytime)",
    "rating": 4.0,
    "shortDescription": "Heritage court building known as the \"Temple of Justice\" with Indo-Saracenic architecture."
  },
  {
    "id": "p8-makarpura-palace",
    "name": "Makarpura Palace",
    "nameHi": "मकरपुरा पैलेस",
    "nameGu": "મકરપુરા પેલેસ",
    "latitude": 22.2627,
    "longitude": 73.1972,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Makarpura_Palace_Vadodara.jpg/1280px-Makarpura_Palace_Vadodara.jpg",
    "openingHours": "Exterior view only (Indian Air Force installation)",
    "rating": 3.9,
    "shortDescription": "Italian Renaissance-style summer palace built by Khanderao Gaekwad in 1870."
  },
  {
    "id": "p9-qutbuddin-tomb",
    "name": "Qutbuddin Tomb (Hazira Maqbara)",
    "nameHi": "कुतुबुद्दीन का मकबरा (हजीरा)",
    "nameGu": "કુતુબુદ્દીન મકબરો (હજીરા)",
    "latitude": 22.2858,
    "longitude": 73.2125,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Hazira_Maqbara_Vadodara.JPG/1280px-Hazira_Maqbara_Vadodara.JPG",
    "openingHours": "8:00 AM - 6:30 PM",
    "rating": 4.0,
    "shortDescription": "Mughal-era octagonal mausoleum of Qutbuddin Muhammad Khan, tutor to Akbar's son."
  },
  {
    "id": "p10-tambekar-wada",
    "name": "Tambekar Wada",
    "nameHi": "तांबेकर वाड़ा",
    "nameGu": "તાંબેકર વાડા",
    "latitude": 22.2983,
    "longitude": 73.2081,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Tambekar_Wada_Baroda.jpg/1280px-Tambekar_Wada_Baroda.jpg",
    "openingHours": "9:00 AM - 5:00 PM (Closed Sundays)",
    "rating": 4.1,
    "shortDescription": "Historic Maratha-style mansion famous for exquisite 19th-century wall paintings."
  },
  {
    "id": "p11-champaner",
    "name": "Champaner-Pavagadh Archaeological Park",
    "nameHi": "चंपानेर-पावागढ़ पुरातत्व पार्क",
    "nameGu": "ચાંપાનેર-પાવાગઢ પુરાતત્વીય પાર્ક",
    "latitude": 22.4839,
    "longitude": 73.5358,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Champaner_fort_walls.jpg/1280px-Champaner_fort_walls.jpg",
    "openingHours": "8:30 AM - 5:00 PM",
    "rating": 4.7,
    "shortDescription": "UNESCO World Heritage Site with pre-Mughal Islamic city ruins and sacred Pavagadh hill."
  },
  {
    "id": "p12-jama-masjid-champaner",
    "name": "Jama Masjid, Champaner",
    "nameHi": "जामा मस्जिद, चंपानेर",
    "nameGu": "જામા મસ્જિદ, ચાંપાનેર",
    "latitude": 22.4856,
    "longitude": 73.5383,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Jama_Masjid_Champaner.jpg/1280px-Jama_Masjid_Champaner.jpg",
    "openingHours": "8:30 AM - 5:00 PM",
    "rating": 4.8,
    "shortDescription": "Architectural masterpiece blending Hindu-Jain and Islamic traditions with intricate jali screens."
  },
  {
    "id": "p13-nazarbaug-palace",
    "name": "Nazarbaug Palace Grounds",
    "nameHi": "नज़रबाग पैलेस",
    "nameGu": "નઝરબાગ પેલેસ",
    "latitude": 22.2981,
    "longitude": 73.2106,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Vadodara_gate.jpg/1280px-Vadodara_gate.jpg",
    "openingHours": "Exterior view only",
    "rating": 3.7,
    "shortDescription": "Historic site of the oldest palace in Vadodara, built in 1721 by Malhar Rao Gaekwad."
  },
  {
    "id": "p14-khanderao-market",
    "name": "Khanderao Market Building",
    "nameHi": "खंडेराव मार्केट",
    "nameGu": "ખંડેરાવ માર્કેટ",
    "latitude": 22.2986,
    "longitude": 73.2033,
    "category": "culture",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Khanderao_Market_Vadodara.jpg/1280px-Khanderao_Market_Vadodara.jpg",
    "openingHours": "6:00 AM - 10:00 PM",
    "rating": 4.2,
    "shortDescription": "Victorian Indo-Saracenic market building presented to the municipality by Sayajirao III in 1906."
  },
  {
    "id": "p15-mandvi-gate",
    "name": "Mandvi Gate",
    "nameHi": "मांडवी गेट",
    "nameGu": "માંડવી ગેટ",
    "latitude": 22.2991,
    "longitude": 73.2089,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Mandvi_Gate_Vadodara.jpg/1280px-Mandvi_Gate_Vadodara.jpg",
    "openingHours": "Open 24 hours (City landmark)",
    "rating": 4.1,
    "shortDescription": "Mughal-era fortified pavilion gate marking the central point of the historic walled city of Vadodara."
  },
  {
    "id": "IND-HER-01",
    "name": "Taj Mahal",
    "nameHi": "ताज महल (Taj Mahal)",
    "nameGu": "ताज महल (Taj Mahal)",
    "latitude": 27.175,
    "longitude": 78.0422,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Aks_The_Reflection_Taj_Mahal.jpg/960px-Aks_The_Reflection_Taj_Mahal.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Sunrise to Sunset (Closed Fridays for prayers). Best time: Oct to March. Night viewing per",
    "rating": 4.4,
    "shortDescription": "Commissioned by Emperor Shah Jahan in 1631 in memory of his chief empress Mumtaz Mahal. Employed over 20,000 artisans under chief architect Ustad Ahmad Lahori. ..."
  },
  {
    "id": "IND-HER-02",
    "name": "Qutub Minar & Monument Complex",
    "nameHi": "क़ुतुब मीनार (Qutb Minar)",
    "nameGu": "क़ुतुब मीनार (Qutb Minar)",
    "latitude": 28.5245,
    "longitude": 77.1855,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/94/Close_view_of_the_southern_gate_of_the_Qutb_Minar_enclosure_in_Delhi_in_the_1870s.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "openingHours": "Open daily: 07:00 AM to 09:00 PM. Metro connectivity: Qutub Minar Station (Yellow Line). I",
    "rating": 4.5,
    "shortDescription": "Commenced by Qutb-ud-din Aibak in 1192 following Muhammad Ghori's victory at Tarain. Completed by Iltutmish and restored by Firoz Shah Tughlaq after a 1368 ligh..."
  },
  {
    "id": "IND-HER-03",
    "name": "Red Fort (Lal Qila)",
    "nameHi": "लाल क़िला (Lal Qila)",
    "nameGu": "लाल क़िला (Lal Qila)",
    "latitude": 28.6562,
    "longitude": 77.241,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Lahori_Gate%2C_Red_Fort%2C_Delhi.jpg/960px-Lahori_Gate%2C_Red_Fort%2C_Delhi.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:30 AM to 04:30 PM (Closed Mondays). Sound & Light Show in Hindi/English every even",
    "rating": 4.6,
    "shortDescription": "Constructed when Shah Jahan relocated the capital from Agra to Shahjahanabad. Surrounded by deep defensive moats once fed by the Yamuna River. Served as the sea..."
  },
  {
    "id": "IND-HER-04",
    "name": "Humayun's Tomb Complex",
    "nameHi": "हुमायूँ का मक़बरा (Humayun's Tomb)",
    "nameGu": "हुमायूँ का मक़बरा (Humayun's Tomb)",
    "latitude": 28.5933,
    "longitude": 77.2507,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Humayun%27s_Tomb_%28Humayun_Ka_Maqbara_-_Delhi%29.jpg/960px-Humayun%27s_Tomb_%28Humayun_Ka_Maqbara_-_Delhi%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Sunrise to Sunset daily. Best photography light: 4:00 PM to 6:00 PM. Wheelchair accessible",
    "rating": 4.7,
    "shortDescription": "First substantial example of Mughal architecture in India and direct architectural precursor to the Taj Mahal. Designed by Persian architect Mirak Mirza Ghiyas...."
  },
  {
    "id": "IND-HER-05",
    "name": "Fatehpur Sikri Imperial Citadel",
    "nameHi": "फ़तेहपुर सीकरी (Fatehpur Sikri)",
    "nameGu": "फ़तेहपुर सीकरी (Fatehpur Sikri)",
    "latitude": 27.0945,
    "longitude": 77.6679,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Buland_Darwaza%2C_Fatehpur_Sikri%2C_Agra.jpg/960px-Buland_Darwaza%2C_Fatehpur_Sikri%2C_Agra.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 06:00 PM. Battery bus service from parking to Buland Darwaza (1 km). Dist",
    "rating": 4.8,
    "shortDescription": "Founded by Akbar in honour of Sufi saint Sheikh Salim Chishti who blessed him with an heir (Prince Salim/Jahangir). Served as Mughal imperial capital for 14 yea..."
  },
  {
    "id": "IND-HER-06",
    "name": "Ajanta Caves",
    "nameHi": "अजिंठा लेणी (Ajanta Leni)",
    "nameGu": "अजिंठा लेणी (Ajanta Leni)",
    "latitude": 20.5519,
    "longitude": 75.7033,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Ajanta_Cave_1_Padmapani.jpg/960px-Ajanta_Cave_1_Padmapani.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 05:00 PM (Closed Mondays). Eco-friendly shuttle bus from T-Junction. Stri",
    "rating": 4.9,
    "shortDescription": "Rediscovered in 1819 by British cavalry officer John Smith during a tiger hunt. The murals illustrate Buddhist Jataka tales using mineral pigments bound with pl..."
  },
  {
    "id": "IND-HER-07",
    "name": "Ellora Caves & Kailash Temple",
    "nameHi": "वेरूळ लेणी व कैलास मंदिर (Ellora Leni)",
    "nameGu": "वेरूळ लेणी व कैलास मंदिर (Ellora Leni)",
    "latitude": 20.0268,
    "longitude": 75.1793,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Courtyard_and_Mahabharata_Reliefs_at_the_Kailasa_Temple%2C_Ellora_01.jpg/960px-Courtyard_and_Mahabharata_Reliefs_at_the_Kailasa_Temple%2C_Ellora_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open sunrise to sunset (Closed Tuesdays). Golf carts available on site. Direct flights and",
    "rating": 4.4,
    "shortDescription": "Cave 16 (Kailashatha) is the largest monolithic rock sculpture in the world, carved from top to bottom without scaffolding or joined masonry. Over 200,000 tonne..."
  },
  {
    "id": "IND-HER-08",
    "name": "Konark Sun Temple (The Black Pagoda)",
    "nameHi": "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର (Konark Sun Temple)",
    "nameGu": "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର (Konark Sun Temple)",
    "latitude": 19.8876,
    "longitude": 86.0945,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Closeup_of_the_center_of_a_stone_wheel_-_Konark_Sun_Temple%2C_Orissa%2C_India.jpg/960px-Closeup_of_the_center_of_a_stone_wheel_-_Konark_Sun_Temple%2C_Orissa%2C_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 08:00 PM daily. Annual Konark Dance Festival held every December in the N",
    "rating": 4.5,
    "shortDescription": "Conceived as a colossal 24-wheeled chariot carrying the Sun God Surya across the heavens, pulled by 7 spirited horses. European mariners called it the 'Black Pa..."
  },
  {
    "id": "IND-HER-09",
    "name": "Khajuraho Group of Monuments",
    "nameHi": "खजुराहो स्मारक समूह (Khajuraho Temples)",
    "nameGu": "खजुराहो स्मारक समूह (Khajuraho Temples)",
    "latitude": 24.8318,
    "longitude": 79.9199,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Homosexuality_in_Khajuraho_sculpture.jpg/960px-Homosexuality_in_Khajuraho_sculpture.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open sunrise to sunset. Western Group has automated audio guide kiosks and evening Sound &",
    "rating": 4.6,
    "shortDescription": "Constructed during the zenith of Chandela Rajput power. The temples celebrate the four purusharthas (Dharma, Artha, Kama, Moksha). Kandariya Mahadeva alone feat..."
  },
  {
    "id": "IND-HER-10",
    "name": "Hampi (Ruins of the Vijayanagara Empire)",
    "nameHi": "ಹಂಪಿ (Hampi Vijayanagara)",
    "nameGu": "ಹಂಪಿ (Hampi Vijayanagara)",
    "latitude": 15.335,
    "longitude": 76.46,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Hampi_Garuda_stone_chariot.jpg/960px-Hampi_Garuda_stone_chariot.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 06:00 PM. Bicycle and electric scooter rentals popular. Nearest railway s",
    "rating": 4.7,
    "shortDescription": "Second-largest city in the medieval world in 1500 CE after Beijing, described by Portuguese traveler Domingo Paes as overflowing with rubies, diamonds, and silk..."
  },
  {
    "id": "IND-HER-11",
    "name": "Rani ki Vav (The Queen's Stepwell)",
    "nameHi": "રાણકી વાવ (Rani ki Vav)",
    "nameGu": "રાણકી વાવ (Rani ki Vav)",
    "latitude": 23.8589,
    "longitude": 72.1018,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Rani_ki_vav%2C_Patan%2C_Gujarat_01.jpg/1280px-Rani_ki_vav%2C_Patan%2C_Gujarat_01.jpg",
    "openingHours": "Open 08:00 AM to 06:00 PM daily. Excellent wheelchair accessibility down to terrace level ",
    "rating": 4.8,
    "shortDescription": "Designed as an inverted temple highlighting the sacredness of water in the arid desert of Gujarat. Built by Queen Udayamati as a memorial stepwell for her decea..."
  },
  {
    "id": "IND-HER-12",
    "name": "Group of Monuments at Mahabalipuram",
    "nameHi": "மாமல்லபுரம் சிற்பங்கள் (Mamallapuram)",
    "nameGu": "மாமல்லபுரம் சிற்பங்கள் (Mamallapuram)",
    "latitude": 12.6269,
    "longitude": 80.1927,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Mahabalipuram_Shore_Temple%2C_Tamil_Nadu.jpg/960px-Mahabalipuram_Shore_Temple%2C_Tamil_Nadu.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 06:00 PM daily. Combined entry ticket covers Shore Temple and Five Rathas",
    "rating": 4.9,
    "shortDescription": "Built as the primary naval and merchant port of the Pallava Empire trading with Sri Lanka, Java, and China. 'Descent of the Ganges' is one of the world's larges..."
  },
  {
    "id": "IND-HER-13",
    "name": "Buddhist Monuments at Sanchi (Great Stupa 1)",
    "nameHi": "सांची का महान स्तूप (Sanchi Stupa)",
    "nameGu": "सांची का महान स्तूप (Sanchi Stupa)",
    "latitude": 23.4794,
    "longitude": 77.7397,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Buddha_Statue%2C_Sanchi_01.jpg/960px-Buddha_Statue%2C_Sanchi_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open sunrise to sunset. ASI on-site archaeological museum displays original Mauryan pillar",
    "rating": 4.4,
    "shortDescription": "Oldest stone structure in India, originally commissioned by Emperor Ashoka over the relics of the Buddha. The elaborate stone Torana gateways added by Satavahan..."
  },
  {
    "id": "IND-HER-14",
    "name": "Brihadisvara Temple (Peruvudaiyar Kovil)",
    "nameHi": "தஞ்சைப் பெருவுடையார் கோயில் (Brihadisvara)",
    "nameGu": "தஞ்சைப் பெருவுடையார் கோயில் (Brihadisvara)",
    "latitude": 10.7828,
    "longitude": 79.1318,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg/960px-Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 12:30 PM & 04:00 PM to 08:30 PM. Living temple with daily poojas. Barefoo",
    "rating": 4.5,
    "shortDescription": "Dedicated to Lord Shiva as Dakshinamurti and Rajarajeshwaram. Built to celebrate Emperor Rajaraja I's oceanic and northern conquests. Over 130,000 tonnes of gra..."
  },
  {
    "id": "IND-HER-15",
    "name": "Hawa Mahal (Palace of Winds)",
    "nameHi": "हवा महल (Hawa Mahal)",
    "nameGu": "हवा महल (Hawa Mahal)",
    "latitude": 26.9239,
    "longitude": 75.8267,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Hawa_Mahal_-_Jaipur_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "openingHours": "Open 09:00 AM to 05:00 PM. Best front facade photography: Early morning (07:30 to 09:00 AM",
    "rating": 4.6,
    "shortDescription": "Designed by Lal Chand Ustad in the shape of Lord Krishna's crown. The 953 honeycombed jharokha casements allowed royal purdah-observing women to observe daily b..."
  },
  {
    "id": "IND-HER-16",
    "name": "Amer Fort & Palace",
    "nameHi": "आमेर क़िला (Amer Durg)",
    "nameGu": "आमेर क़िला (Amer Durg)",
    "latitude": 26.9855,
    "longitude": 75.8513,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg/960px-20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 08:00 AM to 05:30 PM; Evening Sound & Light show (English/Hindi). Elephant rides avai",
    "rating": 4.7,
    "shortDescription": "Constructed atop Cheel ka Teela (Hill of Eagles) by Akbar's commander-in-chief Raja Man Singh I. Features subterranean escape tunnels directly connecting Amer P..."
  },
  {
    "id": "IND-HER-17",
    "name": "Charminar",
    "nameHi": "चारमीनार (Charminar)",
    "nameGu": "चारमीनार (Charminar)",
    "latitude": 17.3616,
    "longitude": 78.4747,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Charminar_Hyderabad_111.jpg/960px-Charminar_Hyderabad_111.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 05:30 PM daily. Evening dynamic multi-color LED illumination until 09:00 ",
    "rating": 4.8,
    "shortDescription": "Built in 1591 by Sultan Muhammad Quli Qutb Shah to commemorate the eradication of a devastating plague epidemic from the new capital city of Hyderabad. Located ..."
  },
  {
    "id": "IND-HER-18",
    "name": "Golconda Fort",
    "nameHi": "గోల్కొండ కోట (Golconda Fort)",
    "nameGu": "గోల్కొండ కోట (Golconda Fort)",
    "latitude": 17.3833,
    "longitude": 78.4011,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Gates_of_the_Golconda_Fort_in_Golconda%2C_Hyderabad_01.jpg/960px-Gates_of_the_Golconda_Fort_in_Golconda%2C_Hyderabad_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 05:30 PM. High physical climb (360 stone steps to summit); comfortable fo",
    "rating": 4.9,
    "shortDescription": "World-renowned epicenter of the historic Golconda diamond trade that yielded the Koh-i-Noor, Hope, and Daria-i-Noor diamonds. Its acoustic marvel at the entranc..."
  },
  {
    "id": "IND-HER-19",
    "name": "Victoria Memorial Hall",
    "nameHi": "ভিক্টোরিয়া মেমোরিয়াল (Victoria Memorial)",
    "nameGu": "ভিক্টোরিয়া মেমোরিয়াল (Victoria Memorial)",
    "latitude": 22.5448,
    "longitude": 88.3426,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/The_Victoria_Memorial_Hall_Kolkata_West_Bengal_India.jpg/960px-The_Victoria_Memorial_Hall_Kolkata_West_Bengal_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Gardens open 05:30 AM to 06:00 PM; Museum galleries open 10:00 AM to 06:00 PM (Closed Mond",
    "rating": 4.4,
    "shortDescription": "Conceived by Viceroy Lord Curzon following Queen Victoria's death in 1901. Opened to the public in 1921 by the Prince of Wales. Houses over 28,000 artifacts inc..."
  },
  {
    "id": "IND-HER-20",
    "name": "Golden Temple (Sri Harmandir Sahib)",
    "nameHi": "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ (Sri Harmandir Sahib)",
    "nameGu": "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ (Sri Harmandir Sahib)",
    "latitude": 31.62,
    "longitude": 74.8765,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Amritsar-golden-temple-00.JPG/960px-Amritsar-golden-temple-00.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 24 hours daily, 365 days a year. Head covering, barefoot walk through foot-cleaning w",
    "rating": 4.5,
    "shortDescription": "Founded by Guru Ram Das and constructed by Guru Arjan Dev, who invited Muslim Sufi saint Hazrat Mian Mir of Lahore to lay its foundational cornerstone in 1589. ..."
  },
  {
    "id": "IND-HER-21",
    "name": "Meenakshi Amman Temple",
    "nameHi": "மீனாட்சி சுந்தரேசுவரர் கோயில் (Meenakshi Kovil)",
    "nameGu": "மீனாட்சி சுந்தரேசுவரர் கோயில் (Meenakshi Kovil)",
    "latitude": 9.9195,
    "longitude": 78.1193,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Ganesha_on_Gopuram_in_the_Meenakshi_Temple_at_Madurai.jpg/960px-Ganesha_on_Gopuram_in_the_Meenakshi_Temple_at_Madurai.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 05:00 AM to 12:30 PM & 04:00 PM to 10:00 PM. Mobile phones and cameras strictly prohi",
    "rating": 4.6,
    "shortDescription": "One of the oldest continuously inhabited sacred temple complexes on earth, forming the epicentre of the ancient lotus-shaped city of Madurai. Sacked in 1310 by ..."
  },
  {
    "id": "IND-HER-22",
    "name": "Archaeological Site of Nalanda Mahavihara",
    "nameHi": "नालंदा महाविहार (Nalanda University)",
    "nameGu": "नालंदा महाविहार (Nalanda University)",
    "latitude": 25.1357,
    "longitude": 85.4451,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Temple_3_-_Sariputta_Stupa_-_Brick_Votive_Stupas_-_Nalanda_Mahavihara_%2812%29.jpg/960px-Temple_3_-_Sariputta_Stupa_-_Brick_Votive_Stupas_-_Nalanda_Mahavihara_%2812%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 05:00 PM daily. ASI on-site archaeological museum houses bronzes, seals, ",
    "rating": 4.7,
    "shortDescription": "The world's premier residential Buddhist university, housing over 10,000 students and 2,000 scholars from China, Korea, Japan, Tibet, Mongolia, Sri Lanka, and T..."
  },
  {
    "id": "IND-HER-23",
    "name": "Mahabodhi Temple Complex",
    "nameHi": "महाबोधि मंदिर (Mahabodhi Temple)",
    "nameGu": "महाबोधि मंदिर (Mahabodhi Temple)",
    "latitude": 24.696,
    "longitude": 84.9913,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/1847_drawing_by_Kittoe%2C_Buddhist_Bodhgaya_Mahabodhi_temple_complex%2C_Bihar_01.jpg/960px-1847_drawing_by_Kittoe%2C_Buddhist_Bodhgaya_Mahabodhi_temple_complex%2C_Bihar_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 05:00 AM to 09:00 PM daily. Meditation allowed in the serene gardens around the Bodhi",
    "rating": 4.8,
    "shortDescription": "Direct location where Siddhartha Gautama attained supreme enlightenment (Bodhi) in 528 BCE to become the Buddha. The original shrine was built by Emperor Ashoka..."
  },
  {
    "id": "IND-HER-24",
    "name": "Elephanta Caves",
    "nameHi": "घारापुरीची लेणी (Elephanta Caves)",
    "nameGu": "घारापुरीची लेणी (Elephanta Caves)",
    "latitude": 18.9633,
    "longitude": 72.9315,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Elephanta_Caves_Trimurti.jpg/960px-Elephanta_Caves_Trimurti.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 05:30 PM (Closed Mondays). Accessed via 1-hour scenic ferry from Gateway ",
    "rating": 4.9,
    "shortDescription": "Located on Gharapuri Island in Mumbai Harbour. Named 'Elephanta' by 16th-century Portuguese explorers after a colossal monolithic stone elephant found near the ..."
  },
  {
    "id": "IND-HER-25",
    "name": "Group of Monuments at Pattadakal",
    "nameHi": "ಪಟ್ಟದಕಲ್ಲು ಸ್ಮಾರಕಗಳು (Pattadakal)",
    "nameGu": "ಪಟ್ಟದಕಲ್ಲು ಸ್ಮಾರಕಗಳು (Pattadakal)",
    "latitude": 15.9493,
    "longitude": 75.8164,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Nandi_in_the_Pattadakal_temple_complex%2CPattadakal%2CKarnataka%2CIndia_July%2C2019.jpg/960px-Nandi_in_the_Pattadakal_temple_complex%2CPattadakal%2CKarnataka%2CIndia_July%2C2019.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 06:00 PM daily. Part of the Golden Triangle of Chalukyan architecture alo",
    "rating": 4.4,
    "shortDescription": "Pattadakal served as the ceremonial site where Chalukyan kings were anointed and crowned (Patta-Kisuvolal). Architecturally revolutionary as the testing ground ..."
  },
  {
    "id": "IND-HER-26",
    "name": "Kumbhalgarh Fort & The Great Wall of India",
    "nameHi": "कुंभलगढ़ दुर्ग (Kumbhalgarh)",
    "nameGu": "कुंभलगढ़ दुर्ग (Kumbhalgarh)",
    "latitude": 25.1472,
    "longitude": 73.5878,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Boundary_wall_of_Kumbhalgarh_Fort%2C_Rajsamand%2C_Rajasthan%2CIndia.jpg/960px-Boundary_wall_of_Kumbhalgarh_Fort%2C_Rajsamand%2C_Rajasthan%2CIndia.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 06:00 PM. Evening Sound & Light show. Walking the full perimeter requires",
    "rating": 4.5,
    "shortDescription": "Constructed by Maharana Kumbha atop a 1,100-meter Aravalli ridge. Birthplace of legendary warrior king Maharana Pratap. Practically impregnable; in its entire h..."
  },
  {
    "id": "IND-HER-27",
    "name": "Chittorgarh Fort & Vijay Stambha",
    "nameHi": "चित्तौड़गढ़ दुर्ग (Chittor Fort)",
    "nameGu": "चित्तौड़गढ़ दुर्ग (Chittor Fort)",
    "latitude": 24.8879,
    "longitude": 74.6453,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Chittorgarh-Rana_Kumbha_Palace-10-Vijay_Stambha-20131014.jpg/960px-Chittorgarh-Rana_Kumbha_Palace-10-Vijay_Stambha-20131014.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 05:00 PM. Vehicle driving loop available around the 13-km perimeter. Loca",
    "rating": 4.6,
    "shortDescription": "The immortal symbol of Rajput chivalry and defiance. Endured three catastrophic sieges: Alauddin Khilji (1303 CE), Bahadur Shah of Gujarat (1535 CE), and Mughal..."
  },
  {
    "id": "IND-HER-28",
    "name": "Dholavira: Ancient Harappan Metropolis",
    "nameHi": "ધોળાવીરા (Dholavira)",
    "nameGu": "ધોળાવીરા (Dholavira)",
    "latitude": 23.8878,
    "longitude": 70.2131,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/System_of_reservoirs_and_canals_found_at_Dholavira.jpg/960px-System_of_reservoirs_and_canals_found_at_Dholavira.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open sunrise to sunset. Best visited Nov to Feb during the Rann of Kutch winter season. Ro",
    "rating": 4.7,
    "shortDescription": "One of the most remarkable urban settlements of the ancient world, thriving on Khadir Bet island in the Great Rann of Kutch for 1,500 years. Pioneered the world..."
  },
  {
    "id": "IND-HER-29",
    "name": "Kakatiya Rudreshwara (Ramappa) Temple",
    "nameHi": "రామప్ప దేవాలయం (Ramappa Temple)",
    "nameGu": "రామప్ప దేవాలయం (Ramappa Temple)",
    "latitude": 18.2655,
    "longitude": 79.9439,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Sculptures_of_Ramappa_Temple_in_Palampet%2C_Telangana_03.jpg/960px-Sculptures_of_Ramappa_Temple_in_Palampet%2C_Telangana_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 06:00 PM daily. Located 70 km from Warangal and 210 km from Hyderabad. Ex",
    "rating": 4.8,
    "shortDescription": "Named uniquely after its master sculptor, Ramappa, rather than the deity or the king. Described by Italian merchant Marco Polo as the 'brightest star in the gal..."
  },
  {
    "id": "IND-HER-30",
    "name": "Sacred Ensembles of the Hoysalas: Belur & Halebidu",
    "nameHi": "ಹೊಯ್ಸಳೇಶ್ವರ ಮತ್ತು ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ (Hoysala Temples)",
    "nameGu": "ಹೊಯ್ಸಳೇಶ್ವರ ಮತ್ತು ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ (Hoysala Temples)",
    "latitude": 13.1625,
    "longitude": 75.8596,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Chennakeshava_temple_Belur_202.jpg/960px-Chennakeshava_temple_Belur_202.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 07:30 AM to 07:30 PM. Belur and Halebidu are 16 km apart. Nearest railway hub: Hassan",
    "rating": 4.9,
    "shortDescription": "The absolute pinnacle of micro-carving in stone. Built by King Vishnuvardhana to commemorate his victory over the Western Chalukyas at Talakad. The soapstone al..."
  },
  {
    "id": "IND-HER-31",
    "name": "Sun Temple Modhera",
    "nameHi": "મોઢેરા સૂર્ય મંદિર (Modhera Sun Temple)",
    "nameGu": "મોઢેરા સૂર્ય મંદિર (Modhera Sun Temple)",
    "latitude": 23.5836,
    "longitude": 72.1331,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Sun_Temple%2C_Modhera%2C_Gujarat.jpg/1280px-Sun_Temple%2C_Modhera%2C_Gujarat.jpg",
    "openingHours": "Open 07:00 AM to 06:00 PM. India's first 100% solar-powered heritage village. Night 3D pro",
    "rating": 4.4,
    "shortDescription": "Engineered with astronomical precision along the Tropic of Cancer: on the spring and autumn equinoxes (March 21 and September 23), the first rays of the rising ..."
  },
  {
    "id": "IND-HER-32",
    "name": "Rock Shelters of Bhimbetka",
    "nameHi": "भीमबेटका शैलचित्र (Bhimbetka Caves)",
    "nameGu": "भीमबेटका शैलचित्र (Bhimbetka Caves)",
    "latitude": 22.9372,
    "longitude": 77.6127,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/1_man_riding_horse_prehistoric_rock_cave_painting_Bhimbetka_Bhopal_Madhya_Pradesh_India_February_2013.jpg/960px-1_man_riding_horse_prehistoric_rock_cave_painting_Bhimbetka_Bhopal_Madhya_Pradesh_India_February_2013.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 07:00 AM to 06:00 PM daily. Paved pathways and wooden walkways connect the primary 15",
    "rating": 4.5,
    "shortDescription": "Contains the oldest documented human rock art in the Indian subcontinent. Demonstrates continuous human habitation from the Lower Paleolithic through the Mesoli..."
  },
  {
    "id": "IND-HER-33",
    "name": "Basilica of Bom Jesus & Se Cathedral",
    "nameHi": "बोम जिजस बेसिलिका (Bom Jesus Goa)",
    "nameGu": "बोम जिजस बेसिलिका (Bom Jesus Goa)",
    "latitude": 15.5009,
    "longitude": 73.9116,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Basilica_of_Bom_Jesus_%28Goa%29_Front_Gate.jpg/960px-Basilica_of_Bom_Jesus_%28Goa%29_Front_Gate.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 06:30 PM (Sundays open 10:30 AM to 06:30 PM). Dress code: Sleeveless tops",
    "rating": 4.6,
    "shortDescription": "The spiritual heart of Portuguese India. Bom Jesus is consecrated as a minor basilica and houses the 470-year-old preserved mortal remains of Saint Francis Xavi..."
  },
  {
    "id": "IND-HER-34",
    "name": "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
    "nameHi": "छत्रपती शिवाजी महाराज टर्मिनस (CSMT)",
    "nameGu": "छत्रपती शिवाजी महाराज टर्मिनस (CSMT)",
    "latitude": 18.94,
    "longitude": 72.8354,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Chhatrapati_Shivaji_Maharaj_Terminus_CSMT_Mumbai_IMG_20230818_191824_%2812%29_05.jpg/960px-Chhatrapati_Shivaji_Maharaj_Terminus_CSMT_Mumbai_IMG_20230818_191824_%2812%29_05.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Operational 24x7 as a major railway terminus. Heritage museum wing open weekdays 02:00 PM ",
    "rating": 4.7,
    "shortDescription": "Constructed over 10 years to mark the Golden Jubilee of Queen Victoria. Architect F.W. Stevens collaborated with students of Mumbai's Sir J.J. School of Art to ..."
  },
  {
    "id": "IND-HER-35",
    "name": "Gwalior Fort & Man Mandir Palace",
    "nameHi": "ग्वालियर क़िला (Gwalior Durg)",
    "nameGu": "ग्वालियर क़िला (Gwalior Durg)",
    "latitude": 26.2307,
    "longitude": 78.1695,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Gwalior_Fort_view.jpg/1280px-Gwalior_Fort_view.jpg",
    "openingHours": "Open 06:00 AM to 05:30 PM. Vehicle entry allowed via Urvai Gate. Daily evening Sound & Lig",
    "rating": 4.8,
    "shortDescription": "Described by Mughal Emperor Babur as 'the pearl amongst the fortresses of Hind'. Built atop a steep standalone sandstone ridge that controls the route from the ..."
  },
  {
    "id": "IND-HER-36",
    "name": "Daulatabad Fort & Chand Minar",
    "nameHi": "दौलताबाद किल्ला (Devagiri Fort)",
    "nameGu": "दौलताबाद किल्ला (Devagiri Fort)",
    "latitude": 19.9431,
    "longitude": 75.2131,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Chand_Minar_inside_premises_of_Daultabad_fort_alias_Deogiri_Fort%2C_Daulatabad%2C_Maharashtra_05.jpg/960px-Chand_Minar_inside_premises_of_Daultabad_fort_alias_Deogiri_Fort%2C_Daulatabad%2C_Maharashtra_05.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 06:00 PM. High physical difficulty: requires ascending 750 steep rock-hew",
    "rating": 4.9,
    "shortDescription": "Considered the most impregnable defensive fortress in medieval India. The natural basalt hill was scarped vertically to create a 50-meter sheer cliff drops into..."
  },
  {
    "id": "IND-HER-37",
    "name": "Raigad Fort (Capital of Maratha Empire)",
    "nameHi": "किल्ले रायगड (Raigad Durg)",
    "nameGu": "किल्ले रायगड (Raigad Durg)",
    "latitude": 18.2346,
    "longitude": 73.4447,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Chhatrapati_Shivaji_Maharaj_Samadhi.jpg/960px-Chhatrapati_Shivaji_Maharaj_Samadhi.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 08:00 AM to 06:00 PM. Accessible either by climbing 1,737 stone steps (2.5 hours) or ",
    "rating": 4.4,
    "shortDescription": "Chosen by Chhatrapati Shivaji Maharaj as the capital of the sovereign Maratha Empire, where he was coronated as 'Chhatrapati' on June 6, 1674. Strategically sit..."
  },
  {
    "id": "IND-HER-38",
    "name": "Murud-Janjira Sea Fort",
    "nameHi": "मुरुड जंजिरा किल्ला (Murud Janjira)",
    "nameGu": "मुरुड जंजिरा किल्ला (Murud Janjira)",
    "latitude": 18.3006,
    "longitude": 72.9642,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Murud-Janjira_Fort%2C_Raigad%2C_India.jpg/960px-Murud-Janjira_Fort%2C_Raigad%2C_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 07:00 AM to 06:00 PM (Subject to sea tidal conditions). Accessible exclusively by tra",
    "rating": 4.5,
    "shortDescription": "One of the only island sea fortresses in Indian history that remained unconquered despite furious naval and artillery assaults over centuries by the Marathas, t..."
  },
  {
    "id": "IND-HER-39",
    "name": "Gol Gumbaz (The Whispering Gallery)",
    "nameHi": "ಗೋಲ್ ಗುಮ್ಮಟ (Gol Gumbaz)",
    "nameGu": "ಗೋಲ್ ಗುಮ್ಮಟ (Gol Gumbaz)",
    "latitude": 16.8306,
    "longitude": 75.7361,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Adil_Shah%27s_Tomb%2C_Inside_Gol_Gumbaz%2C_Bijapur%2C_Karnataka.jpg/960px-Adil_Shah%27s_Tomb%2C_Inside_Gol_Gumbaz%2C_Bijapur%2C_Karnataka.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 06:00 PM daily. To experience the acoustic echo effect without crowd nois",
    "rating": 4.6,
    "shortDescription": "Constructed as the grand mausoleum of Mohammed Adil Shah, 7th Sultan of Bijapur. The central dome rests on intersecting eight-point arches without a single cent..."
  },
  {
    "id": "IND-HER-40",
    "name": "Mysore Palace (Amba Vilas Palace)",
    "nameHi": "ಮೈಸೂರು ಅರಮನೆ (Mysore Palace)",
    "nameGu": "ಮೈಸೂರು ಅರಮನೆ (Mysore Palace)",
    "latitude": 12.3051,
    "longitude": 76.6551,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Mysore_palace_at_night_01.jpg/960px-Mysore_palace_at_night_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Palace open 10:00 AM to 05:30 PM daily. Grand illumination with 97,000 electric bulbs on S",
    "rating": 4.7,
    "shortDescription": "Official residence of the Wadiyar dynasty who ruled the Kingdom of Mysore. Built after the old wooden palace burned down during a royal wedding in 1897. Commiss..."
  },
  {
    "id": "IND-HER-41",
    "name": "Jagannath Temple (Puri)",
    "nameHi": "ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର (Puri Jagannath)",
    "nameGu": "ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର (Puri Jagannath)",
    "latitude": 19.8048,
    "longitude": 85.8179,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Jagannath_Temple%2C_Puri_02.jpg/960px-Jagannath_Temple%2C_Puri_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 05:00 AM to 11:00 PM. Non-Hindus permitted up to the Lion Gate (Singhadwara) and can ",
    "rating": 4.8,
    "shortDescription": "One of the sacred Char Dham pilgrimage sites of Hinduism, dedicated to Lord Jagannath, Balabhadra, and Subhadra. The wooden deities are ritually remade every 12..."
  },
  {
    "id": "IND-HER-42",
    "name": "Cellular Jail (Kala Pani)",
    "nameHi": "सेलुलर जेल (काला पानी)",
    "nameGu": "सेलुलर जेल (काला पानी)",
    "latitude": 11.6739,
    "longitude": 92.7478,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Cellular_Jail%2C_Andaman%2C_Port_Blair%2C_India.jpg/960px-Cellular_Jail%2C_Andaman%2C_Port_Blair%2C_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 12:30 PM & 01:30 PM to 04:45 PM (Closed Mondays and National Holidays). E",
    "rating": 4.9,
    "shortDescription": "Infamous colonial penitentiary where Indian freedom fighters (including Veer Savarkar, Batukeshwar Dutt, and Yogendra Shukla) were exiled and subjected to inhum..."
  },
  {
    "id": "IND-HER-43",
    "name": "Kamakhya Temple (Guwahati)",
    "nameHi": "কামাখ্যা দেৱালয় (Kamakhya Mandir)",
    "nameGu": "কামাখ্যা দেৱালয় (Kamakhya Mandir)",
    "latitude": 26.1664,
    "longitude": 91.7052,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Kamakhya_Temple%2C_Guwahati.jpg/960px-Kamakhya_Temple%2C_Guwahati.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 05:30 AM to 01:00 PM & 02:30 PM to 06:00 PM. VIP darshan passes available online. Loc",
    "rating": 4.4,
    "shortDescription": "The foremost of the 51 sacred Shakti Peethas, where according to legend the yoni (reproductive organ) of Goddess Sati fell. Sacked by Kalapahar in 1553 and rebu..."
  },
  {
    "id": "IND-HER-44",
    "name": "Rang Ghar & Talatal Ghar (Ahom Kingdom)",
    "nameHi": "ৰংঘৰ আৰু তলাতল ঘৰ (Rang Ghar)",
    "nameGu": "ৰংঘৰ আৰু তলাতল ঘৰ (Rang Ghar)",
    "latitude": 26.9631,
    "longitude": 94.6231,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Rang_Ghar_The_first_Indian_pavilion.jpg/960px-Rang_Ghar_The_first_Indian_pavilion.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 05:00 PM daily. Located 3 km from Sivasagar town. Easy road connectivity ",
    "rating": 4.5,
    "shortDescription": "Rang Ghar ('House of Entertainment') is Asia's oldest surviving royal outdoor amphitheatre, where Ahom kings sat to watch buffalo fights, falconry, and wrestlin..."
  },
  {
    "id": "IND-HER-45",
    "name": "Martand Sun Temple",
    "nameHi": "मार्तंड सूर्य मंदिर (Martand Temple)",
    "nameGu": "मार्तंड सूर्य मंदिर (Martand Temple)",
    "latitude": 33.7464,
    "longitude": 75.2206,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/1_Sun_Temple_Martand_Jammu_Kashmir_India_ancient_Hindu_temple_in_ruins.jpg/960px-1_Sun_Temple_Martand_Jammu_Kashmir_India_ancient_Hindu_temple_in_ruins.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open sunrise to sunset daily. Located 9 km from Anantnag and 64 km from Srinagar. High sec",
    "rating": 4.6,
    "shortDescription": "Commissioned by Emperor Lalitaditya Muktapida, the greatest military conqueror of the Karkota dynasty who expanded Kashmiri suzerainty into Central Asia. Built ..."
  },
  {
    "id": "IND-HER-46",
    "name": "Bishnupur Terracotta Temples",
    "nameHi": "বিষ্ণুপুর পোড়ামাটির মন্দির (Bishnupur)",
    "nameGu": "বিষ্ণুপুর পোড়ামাটির মন্দির (Bishnupur)",
    "latitude": 23.0673,
    "longitude": 87.3188,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Bishnupur_Shyam_Rai_Temple_Script.JPG/960px-Bishnupur_Shyam_Rai_Temple_Script.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 06:00 PM. Famous for handcrafted Baluchari silk sarees. Located 140 km fr",
    "rating": 4.7,
    "shortDescription": "Because alluvial Bengal lacks hard building stones, Malla kingdom craftsmen transformed fine river silt into baked red terracotta tiles, carving thousands of mi..."
  },
  {
    "id": "IND-HER-47",
    "name": "Lepakshi Veerabhadra Temple & Hanging Pillar",
    "nameHi": "లేపాక్షి వీరభద్ర స్వామి ఆలయం (Lepakshi)",
    "nameGu": "లేపాక్షి వీరభద్ర స్వామి ఆలయం (Lepakshi)",
    "latitude": 13.8037,
    "longitude": 77.6062,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Basavannah_Temple_Nandi.jpg/960px-Basavannah_Temple_Nandi.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 06:00 PM daily. Located 120 km north of Bengaluru Airport (2.5 hours via ",
    "rating": 4.8,
    "shortDescription": "Built on the tortoiseshell-shaped hill 'Kurma Saila'. Legend states this is where the wounded divine bird Jatayu fell after battling Ravana during Sita's abduct..."
  },
  {
    "id": "IND-HER-48",
    "name": "Badami Cave Temples",
    "nameHi": "ಬಾದಾಮಿ ಗುಹಾಂತರ ದೇವಾಲಯಗಳು (Badami)",
    "nameGu": "ಬಾದಾಮಿ ಗುಹಾಂತರ ದೇವಾಲಯಗಳು (Badami)",
    "latitude": 15.9189,
    "longitude": 75.6767,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/6th_century_Nataraja_relief_at_the_Badami_Cave_temples.jpg/960px-6th_century_Nataraja_relief_at_the_Badami_Cave_temples.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 06:00 PM. High monkey activity; beware of food packets. Ideal combined wi",
    "rating": 4.9,
    "shortDescription": "Capital of the Early Chalukyas (then known as Vatapi), situated in a rugged red sandstone canyon. King Pulakeshin II famously defeated Emperor Harsha of Kannauj..."
  },
  {
    "id": "IND-HER-49",
    "name": "Aihole (Cradle of Indian Temple Architecture)",
    "nameHi": "ಐಹೊಳೆ (Aihole Temple Complex)",
    "nameGu": "ಐಹೊಳೆ (Aihole Temple Complex)",
    "latitude": 16.0222,
    "longitude": 75.8822,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Durga_Temple_-_Aihole_with_cloud.jpg/960px-Durga_Temple_-_Aihole_with_cloud.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 05:00 PM daily. ASI on-site museum displays Chalukya sculpture masterpiec",
    "rating": 4.4,
    "shortDescription": "Revered as the experimental 'cradle and laboratory of Hindu temple architecture' in India, where ancient guilds tested diverse shikhara designs, mandapas, and l..."
  },
  {
    "id": "IND-HER-50",
    "name": "Bekal Fort (Sea Bastion of Malabar)",
    "nameHi": "ബേക്കൽ കോട്ട (Bekal Fort)",
    "nameGu": "ബേക്കൽ കോട്ട (Bekal Fort)",
    "latitude": 12.3926,
    "longitude": 75.0306,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Bekal_fort_kasaragod_15.jpg/960px-Bekal_fort_kasaragod_15.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 08:00 AM to 05:30 PM. Beautiful seaside promenade with sunset views over the Arabian ",
    "rating": 4.5,
    "shortDescription": "Largest and best-preserved fort in Kerala. Unlike traditional administrative palaces, Bekal was built purely as a military sea defense bastion. Its observation ..."
  },
  {
    "id": "IND-ART-01",
    "name": "Harappan Bronze 'Dancing Girl'",
    "nameHi": "नर्तकी (Dancing Girl - Mohenjo-daro)",
    "nameGu": "नर्तकी (Dancing Girl - Mohenjo-daro)",
    "latitude": 28.6118,
    "longitude": 77.2193,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Bronze_%22Dancing_Girl%2C%22_Mohenjo-daro%2C_c._2500_BC.jpg/960px-Bronze_%22Dancing_Girl%2C%22_Mohenjo-daro%2C_c._2500_BC.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Displayed in the Harappan Gallery, National Museum, Janpath, New Delhi. Open 10:00 AM to 0",
    "rating": 4.6,
    "shortDescription": "Excavated in 1926 by archaeologist Ernest J.H. Mackay at Mohenjo-daro (HR area). Archaeologist Sir Mortimer Wheeler wrote: 'There is her insolent little stance,..."
  },
  {
    "id": "IND-ART-02",
    "name": "Lion Capital of Ashoka (National Emblem of India)",
    "nameHi": "अशोक की सिंह चतुर्मुख स्तंभशीर्ष (Ashoka Lion Capital)",
    "nameGu": "अशोक की सिंह चतुर्मुख स्तंभशीर्ष (Ashoka Lion Capital)",
    "latitude": 25.3811,
    "longitude": 83.0232,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Buddhist_Wheel_of_the_Law_surmounting_the_Lion_Capital_of_Ashoka--_best_fit_of_fragments_in_a_circle_at_the_Museum_of_Archaeology_Sarnath-outer_and_internal_diameters.jpg/960px-thumbnail.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Displayed at the Sarnath Archaeological Museum, Sarnath, Varanasi. Open 09:00 AM to 05:00 ",
    "rating": 4.7,
    "shortDescription": "Originally crowned the 15-meter Ashokan Pillar at Deer Park in Sarnath, marking the exact spot where Gautama Buddha delivered his first sermon (Dharmachakra Pra..."
  },
  {
    "id": "IND-ART-03",
    "name": "Didarganj Yakshi (Chauri Bearer)",
    "nameHi": "दीदारगंज यक्षी (Didarganj Yakshi)",
    "nameGu": "दीदारगंज यक्षी (Didarganj Yakshi)",
    "latitude": 25.6111,
    "longitude": 85.1147,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Didarganj-Yakshi-3bc-Patna.jpg/960px-Didarganj-Yakshi-3bc-Patna.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Displayed prominently in the Masterpiece Gallery of the world-class Bihar Museum, Bailey R",
    "rating": 4.8,
    "shortDescription": "Unearthed in 1917 on the banks of the Ganges River at Didarganj near Patna by villagers who saw it protruding from the muddy riverbank. Celebrated international..."
  },
  {
    "id": "IND-ART-04",
    "name": "Chola Bronze Nataraja (Cosmic Dancer)",
    "nameHi": "நடராசர் வெண்கலச் சிலை (Chola Nataraja)",
    "nameGu": "நடராசர் வெண்கலச் சிலை (Chola Nataraja)",
    "latitude": 28.6118,
    "longitude": 77.2193,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Bronze_sculpt_NMND-6.JPG/960px-Bronze_sculpt_NMND-6.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Displayed in Bronze Gallery, National Museum New Delhi and Bronze Gallery at Egmore Govern",
    "rating": 4.9,
    "shortDescription": "Regarded by philosopher Ananda Coomaraswamy and astrophysicist Carl Sagan as one of the most profound metaphors for modern quantum physics and cosmic cycles of ..."
  },
  {
    "id": "IND-ART-05",
    "name": "Mughal Imperial Chahar-Aina Armoured Cuirass",
    "nameHi": "चार-आईना (Chahar-Aina / Four Mirrors Armor)",
    "nameGu": "चार-आईना (Chahar-Aina / Four Mirrors Armor)",
    "latitude": 28.6118,
    "longitude": 77.2193,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Antique_Indian_char-aina_%28chahar-aina%29%2C_kulah_khud_and_madu.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "openingHours": "Displayed in the dedicated Arms and Armour Gallery, Ground Floor, National Museum, Janpath",
    "rating": 4.4,
    "shortDescription": "Named 'Chahar-Aina' (literally 'Four Mirrors') because its four polished steel plates reflected light like mirrors, conceptually deflecting the evil eye and ene..."
  },
  {
    "id": "IND-ART-06",
    "name": "Tipu Sultan's Wootz Steel 'Tiger of Mysore' Bedchamber Sword",
    "nameHi": "टीपू सुल्तान की शमशीर (Tipu Sultan's Sword)",
    "nameGu": "टीपू सुल्तान की शमशीर (Tipu Sultan's Sword)",
    "latitude": 28.6118,
    "longitude": 77.2193,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Tipu_Sultan_sword.jpg/1280px-Tipu_Sultan_sword.jpg",
    "openingHours": "Arms and Armour Gallery, National Museum New Delhi and ASI Mumtaz Mahal Museum, Red Fort.",
    "rating": 4.5,
    "shortDescription": "Recovered from Tipu Sultan's personal bedchamber in the fortress of Srirangapatna following the Fourth Anglo-Mysore War on May 4, 1799. Made from pure South Ind..."
  },
  {
    "id": "IND-ART-07",
    "name": "Maratha Wagh Nakh (Tiger Claws Concealed Weapon)",
    "nameHi": "वाघनख (Chhatrapati Shivaji's Wagh Nakh)",
    "nameGu": "वाघनख (Chhatrapati Shivaji's Wagh Nakh)",
    "latitude": 18.9269,
    "longitude": 72.8327,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Bagh_nakh_%28tiger_claw%29%2C_western_India%2C_1700s-1800s_-_Higgins_Armory_Museum_-_DSC05600.JPG/960px-Bagh_nakh_%28tiger_claw%29%2C_western_India%2C_1700s-1800s_-_Higgins_Armory_Museum_-_DSC05600.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Displayed at Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS), Fort, Mumbai and Sata",
    "rating": 4.6,
    "shortDescription": "Famously used by Chhatrapati Shivaji Maharaj during the historic encounter at the foothills of Pratapgad Fort on November 10, 1659. When the towering Bijapur ge..."
  },
  {
    "id": "IND-ART-08",
    "name": "Noor Jahan's White Nephrite Jade Hilt Dagger",
    "nameHi": "नूरजहाँ की खंजर (Noor Jahan's Jade Dagger)",
    "nameGu": "नूरजहाँ की खंजर (Noor Jahan's Jade Dagger)",
    "latitude": 17.3713,
    "longitude": 78.4804,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c6/Dagger_2_of_Aurangzeb_from_17th_Century.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "openingHours": "Displayed in the Jade Room (Room No. 16), Western Wing, Salar Jung Museum, Hyderabad. Open",
    "rating": 4.7,
    "shortDescription": "Belonged to Empress Noor Jahan, the powerful co-ruler of the Mughal Empire under Emperor Jahangir. Carved from a single flawless block of Khotan nephrite jade i..."
  },
  {
    "id": "IND-ART-09",
    "name": "Mughal Elephant Combat Armor (Gaj Charma)",
    "nameHi": "गज चर्म (Mughal Elephant Armor)",
    "nameGu": "गज चर्म (Mughal Elephant Armor)",
    "latitude": 28.6118,
    "longitude": 77.2193,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Elephant_Armour%2C_Royal_Armouries.jpg/1280px-Elephant_Armour%2C_Royal_Armouries.jpg",
    "openingHours": "Displayed on life-size fiber elephant models in the Central Rotunda of the Arms & Armour G",
    "rating": 4.8,
    "shortDescription": "War elephants functioned as the heavy armored battle tanks of the medieval Indian battlefield. The full suit protected the beast from enemy musket balls, crossb..."
  },
  {
    "id": "IND-ART-10",
    "name": "Veiled Rebecca Marble Sculpture",
    "nameHi": "घूंघट में रेबेका (Veiled Rebecca)",
    "nameGu": "घूंघट में रेबेका (Veiled Rebecca)",
    "latitude": 17.3713,
    "longitude": 78.4804,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Melody_In_Marble%2C_Veiled_Rebecca_at_Salar_jung_Museum%2C_Hyderabad%2C_India.jpg/960px-Melody_In_Marble%2C_Veiled_Rebecca_at_Salar_jung_Museum%2C_Hyderabad%2C_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Displayed in the Founders Gallery / European Marble Room, Salar Jung Museum, Hyderabad. Mu",
    "rating": 4.9,
    "shortDescription": "Considered an unmatched optical illusion carved into solid stone. Italian sculptor G.B. Benzoni carved the veil so thin and delicate that the stone appears tran..."
  },
  {
    "id": "IND-ART-11",
    "name": "Ancient Indian Punch-Marked Silver Karshapana & Gupta Gold Dinars",
    "nameHi": "आहत सिक्के एवं गुप्त कालीन स्वर्ण दीनार (Ancient Indian Coins)",
    "nameGu": "आहत सिक्के एवं गुप्त कालीन स्वर्ण दीनार (Ancient Indian Coins)",
    "latitude": 22.5579,
    "longitude": 88.3511,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Coin_of_Samudragupta%2C_Battle_axe_type%2C_Kannauj.jpg/960px-Coin_of_Samudragupta%2C_Battle_axe_type%2C_Kannauj.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Coin Gallery, Indian Museum, Park Street, Kolkata and National Museum Coin Gallery, New De",
    "rating": 4.4,
    "shortDescription": "India's punch-marked coins (Puranas/Karshapanas) are among the earliest coinages in world history, mentioned in Panini's Ashtadhyayi and Kautilya's Arthashastra..."
  },
  {
    "id": "IND-ART-12",
    "name": "Katar (Indian Double-Edged Push Dagger)",
    "nameHi": "कटार (Katar / Push Dagger)",
    "nameGu": "कटार (Katar / Push Dagger)",
    "latitude": 26.9258,
    "longitude": 75.8236,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Detail_of_a_photograph_of_the_weapons_of_Guru_Gobind_Singh_kept_at_Takht_Kesgarh_Sahib_being_displayed%2C_ca.1925.jpg/960px-Detail_of_a_photograph_of_the_weapons_of_Guru_Gobind_Singh_kept_at_Takht_Kesgarh_Sahib_being_displayed%2C_ca.1925.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Displayed in the Silehkhana (Armory), City Palace Jaipur and Arms Gallery, National Museum",
    "rating": 4.5,
    "shortDescription": "Unique to the Indian subcontinent. Held like a brass knuckle with fingers around the dual horizontal bars, allowing the warrior to channel their entire body wei..."
  },
  {
    "id": "IND-GJ-04",
    "name": "Champaner-Pavagadh Archaeological Park",
    "nameHi": "ચાંપાનેર-પાવાગઢ પુરાતત્વીય ઉદ્યાન (Champaner-Pavagadh)",
    "nameGu": "ચાંપાનેર-પાવાગઢ પુરાતત્વીય ઉદ્યાન (Champaner-Pavagadh)",
    "latitude": 22.4833,
    "longitude": 73.5333,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Champaner%2C_Jama_Masjid_%289840299734%29.jpg/960px-Champaner%2C_Jama_Masjid_%289840299734%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 08:30 AM to 05:00 PM daily. Pavagadh peak accessible via modern cable car ropeway (5 ",
    "rating": 4.6,
    "shortDescription": "The only complete and unchanged pre-Mughal Islamic capital city in India. Sultan Mahmud Begada besieged the Khichi Chauhan Rajput hilltop fortress of Pavagadh f..."
  },
  {
    "id": "IND-GJ-05",
    "name": "Sidi Saiyyed Mosque (The Tree of Life Jali)",
    "nameHi": "સીદી સૈયદની જાળી (Sidi Saiyyed Ni Jali)",
    "nameGu": "સીદી સૈયદની જાળી (Sidi Saiyyed Ni Jali)",
    "latitude": 23.0284,
    "longitude": 72.5815,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Carved_Mesh_of_Sidi_Saiyyed_Mosque_Ahmedabad_Gujarat_DSC001.jpg/960px-Carved_Mesh_of_Sidi_Saiyyed_Mosque_Ahmedabad_Gujarat_DSC001.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 07:00 AM to 07:00 PM daily. Located near Gheekanta / Lal Darwaza in central Ahmedabad",
    "rating": 4.7,
    "shortDescription": "Constructed by Sidi Saiyyed, an Abyssinian/Habshi general in the royal army of the Gujarat Sultanate, in the final year before Gujarat was annexed by Mughal Emp..."
  },
  {
    "id": "IND-GJ-06",
    "name": "Adalaj Stepwell (Rudabai Stepwell)",
    "nameHi": "અડાલજની વાવ (Adalaj Ni Vav)",
    "nameGu": "અડાલજની વાવ (Adalaj Ni Vav)",
    "latitude": 23.1667,
    "longitude": 72.58,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/A_pigeon_at_Adalaj_stepwell%2C_Ahmedabad.jpg/960px-A_pigeon_at_Adalaj_stepwell%2C_Ahmedabad.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 08:00 AM to 06:00 PM daily. Temperature inside the bottom gallery is consistently 5 t",
    "rating": 4.8,
    "shortDescription": "Commissioned by Queen Rudabai, wife of Vaghela chieftain Rana Veer Singh of Dandai Desh. When Veer Singh was killed in battle by Sultan Mahmud Begada, Begada wa..."
  },
  {
    "id": "IND-GJ-07",
    "name": "Lothal: Ancient Harappan Port & Tidal Dockyard",
    "nameHi": "લોથલ ગોદીવાડો (Lothal Harappan Port)",
    "nameGu": "લોથલ ગોદીવાડો (Lothal Harappan Port)",
    "latitude": 22.5228,
    "longitude": 72.2497,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Lothal_dock.jpg/1280px-Lothal_dock.jpg",
    "openingHours": "Open 10:00 AM to 05:00 PM (Closed Fridays). On-site ASI Museum displays genuine Harappan c",
    "rating": 4.9,
    "shortDescription": "The world's earliest known engineered tidal dockyard, connecting ancient India to Mesopotamia (Sumer), Bahrain (Dilmun), and Oman (Magan) via the Gulf of Khambh..."
  },
  {
    "id": "IND-GJ-08",
    "name": "Somnath Temple (Prabhas Patan)",
    "nameHi": "સોમનાથ મહાદેવ મંદિર (Somnath Temple)",
    "nameGu": "સોમનાથ મહાદેવ મંદિર (Somnath Temple)",
    "latitude": 20.888,
    "longitude": 70.4012,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Somnath_Temple%2C_Gujarat%2C_India.jpg/1280px-Somnath_Temple%2C_Gujarat%2C_India.jpg",
    "openingHours": "Open 06:00 AM to 10:00 PM daily. Aarti at 07:00 AM, 12:00 PM, and 07:00 PM. Evening Sound ",
    "rating": 4.4,
    "shortDescription": "Revered as the eternal shrine of Lord Shiva. Destroyed and rebuilt repeatedly across historical centuries—sacked by Mahmud of Ghazni (1026 CE), Alauddin Khilji'..."
  },
  {
    "id": "IND-GJ-09",
    "name": "Dwarkadhish Temple (Jagat Mandir, Dwarka)",
    "nameHi": "દ્વારકાધીશ જગત મંદિર (Dwarkadhish)",
    "nameGu": "દ્વારકાધીશ જગત મંદિર (Dwarkadhish)",
    "latitude": 22.2378,
    "longitude": 68.9678,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Dwarakadhish_Temple_Of_Lord_Krishna%2C_At_Dwarka%2C_Gujarat..JPG/960px-Dwarakadhish_Temple_Of_Lord_Krishna%2C_At_Dwarka%2C_Gujarat..JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:30 AM to 01:00 PM & 05:00 PM to 09:30 PM. Dhwajarohan (ceremonial flag-changing ce",
    "rating": 4.5,
    "shortDescription": "One of the four sacred Char Dham pilgrimage sites of Hinduism, situated on the western tip of the Saurashtra peninsula where the Gomti River meets the Arabian S..."
  },
  {
    "id": "IND-GJ-10",
    "name": "Junagadh Rock Inscriptions of Ashoka, Rudradaman & Skandagupta",
    "nameHi": "જૂનાગઢ અશોક શિલાલેખ (Junagadh Rock Inscriptions)",
    "nameGu": "જૂનાગઢ અશોક શિલાલેખ (Junagadh Rock Inscriptions)",
    "latitude": 21.5178,
    "longitude": 70.4789,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/AshokanRockEdict.jpg/960px-AshokanRockEdict.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 08:00 AM to 06:00 PM daily. Located 2 km east of Junagadh on the road to Mount Girnar",
    "rating": 4.6,
    "shortDescription": "A miracle of Indian epigraphy: three of the greatest imperial rulers across 700 years recorded their history on the very same granite rock. Ashoka (250 BCE) ins..."
  },
  {
    "id": "IND-GJ-11",
    "name": "Uparkot Fort & Buddhist Rock-Cut Caves",
    "nameHi": "ઉપરકોટ કિલ્લો અને બૌદ્ધ ગુફાઓ (Uparkot Fort)",
    "nameGu": "ઉપરકોટ કિલ્લો અને બૌદ્ધ ગુફાઓ (Uparkot Fort)",
    "latitude": 21.52,
    "longitude": 70.468,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Buddhist_caves_Uparkot_Junagadh_Gujarat_001.jpg/960px-Buddhist_caves_Uparkot_Junagadh_Gujarat_001.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 08:00 AM to 06:00 PM. Recently restored by Gujarat Tourism with golf carts, heritage ",
    "rating": 4.7,
    "shortDescription": "Founded around 319 BCE by Chandragupta Maurya and inhabited continuously for over 2,300 years. Resisted a legendary 12-year siege by Siddharaj Jaisinh of Patan ..."
  },
  {
    "id": "IND-GJ-12",
    "name": "Palitana Temples on Shatrunjaya Hill",
    "nameHi": "પાલીતાણા શેત્રુંજય તીર્થ (Palitana Temples)",
    "nameGu": "પાલીતાણા શેત્રુંજય તીર્થ (Palitana Temples)",
    "latitude": 21.5233,
    "longitude": 71.7944,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/A_nun_being_carried_Jain_culture_religion_rites_rituals_sights.jpg/960px-A_nun_being_carried_Jain_culture_religion_rites_rituals_sights.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Climb commences at 05:00 AM; devotees must descend before sunset (around 06:00 PM). Requir",
    "rating": 4.8,
    "shortDescription": "Revered as the holiest of all pilgrimage places (Siddhakshetra) in Jainism, where 23 of the 24 Tirthankaras (except Neminatha) sanctified the hill. It is the on..."
  },
  {
    "id": "IND-GJ-13",
    "name": "Vadnagar Kirti Torana & Archaeological Site",
    "nameHi": "વડનગર કીર્તિ તોરણ (Vadnagar Kirti Torana)",
    "nameGu": "વડનગર કીર્તિ તોરણ (Vadnagar Kirti Torana)",
    "latitude": 23.7833,
    "longitude": 72.6333,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/An_HDR_image_of_Kirti_Toran_-_Vadnagar.jpg/960px-An_HDR_image_of_Kirti_Toran_-_Vadnagar.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open sunrise to sunset daily. Located 40 km from Mehsana and 110 km north of Ahmedabad. Ne",
    "rating": 4.9,
    "shortDescription": "Vadnagar (ancient Anartapura / Chamatkarpur) has witnessed continuous human habitation for over 2,750 years since 750 BCE, through Mauryan, Kshatrapa, Gupta, Ma..."
  },
  {
    "id": "IND-GJ-15",
    "name": "Sarkhej Roza (The Acropolis of Ahmedabad)",
    "nameHi": "સરખેજ રોઝા (Sarkhej Roza)",
    "nameGu": "સરખેજ રોઝા (Sarkhej Roza)",
    "latitude": 22.9818,
    "longitude": 72.4998,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Queen_Tomb_-_Sarkhej_Roza%2C_Ahmedabad%2CGujarat%2C_India.jpg/960px-Queen_Tomb_-_Sarkhej_Roza%2C_Ahmedabad%2CGujarat%2C_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 06:00 PM daily. Exceptional sunset reflection photography over the water ",
    "rating": 4.5,
    "shortDescription": "Described by modern architect Le Corbusier as 'the Acropolis of Ahmedabad' due to its perfect proportional harmony and spatial rhythm. Built around the shrine o..."
  },
  {
    "id": "IND-GJ-16",
    "name": "Mahabat Maqbara Complex",
    "nameHi": "મહોબત મકબરા (Mahabat Maqbara)",
    "nameGu": "મહોબત મકબરા (Mahabat Maqbara)",
    "latitude": 21.5244,
    "longitude": 70.4619,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Mahabat_Maqbara_-_Junagadh_-_Gujarat_-_001.jpg/960px-Mahabat_Maqbara_-_Junagadh_-_Gujarat_-_001.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 08:00 AM to 06:30 PM daily. Free entry to the monument grounds; interior sanctum open",
    "rating": 4.6,
    "shortDescription": "One of India's most surreal architectural wonders, combining Islamic domes, Gothic French windows, and European baroque scrollwork. Constructed as the final res..."
  },
  {
    "id": "IND-GJ-17",
    "name": "Dada Harir Stepwell (Bai Harir Vav)",
    "nameHi": "દાદા હરીરની વાવ (Dada Harir Ni Vav)",
    "nameGu": "દાદા હરીરની વાવ (Dada Harir Ni Vav)",
    "latitude": 23.045,
    "longitude": 72.6056,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/600_YEAR_OLD_DADA_HARIR_STEPWELL_AHMEDABAD.jpg/960px-600_YEAR_OLD_DADA_HARIR_STEPWELL_AHMEDABAD.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 05:30 PM daily. Excellent example of cooling subterranean architecture, c",
    "rating": 4.7,
    "shortDescription": "Constructed by a lady of the royal court, Bai Harir (locally called Dada Harir), who served as the superintendent of Sultan Mahmud Begada's royal household. Fea..."
  },
  {
    "id": "IND-GJ-18",
    "name": "Aina Mahal & Prag Mahal",
    "nameHi": "આઈના મહેલ અને પ્રાગ મહેલ (Aina Mahal Bhuj)",
    "nameGu": "આઈના મહેલ અને પ્રાગ મહેલ (Aina Mahal Bhuj)",
    "latitude": 23.255,
    "longitude": 69.668,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Clock_Tower_Pragmahal_Bhuj_Kutch_Gujarat.jpg/960px-Clock_Tower_Pragmahal_Bhuj_Kutch_Gujarat.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 12:00 PM & 03:00 PM to 06:00 PM (Closed Thursdays). Climb the 45-meter Pr",
    "rating": 4.8,
    "shortDescription": "Aina Mahal was created by master artisan Ram Singh Malam, a Kutchi sailor who was shipwrecked in Europe, spent 18 years in the Netherlands studying glass-blowin..."
  },
  {
    "id": "IND-GJ-19",
    "name": "Sahastralinga Talav",
    "nameHi": "સહસ્ત્રલિંગ તળાવ (Sahastralinga Talav)",
    "nameGu": "સહસ્ત્રલિંગ તળાવ (Sahastralinga Talav)",
    "latitude": 23.8647,
    "longitude": 72.1089,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Sahasraling_Talav_at_Pattan.jpg/960px-Sahasraling_Talav_at_Pattan.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 08:00 AM to 06:00 PM daily. Located just 1.5 km north of Rani ki Vav. Combined ticket",
    "rating": 4.9,
    "shortDescription": "Commissioned by the greatest Solanki emperor, Siddharaj Jaisinh. Conceived as a colossal pentagonal artificial lake surrounded by 1,000 individual shrines dedic..."
  },
  {
    "id": "IND-GJ-20",
    "name": "Hutheesing Jain Temple",
    "nameHi": "હઠીસિંગનાં દેરાં (Hutheesing Temple)",
    "nameGu": "હઠીસિંગનાં દેરાં (Hutheesing Temple)",
    "latitude": 23.0417,
    "longitude": 72.5972,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/The_Hutheesing_Jain_Temple%2C_Located_on_Shahibaug_Road_in_Ahmedabad_Entry.jpg/960px-The_Hutheesing_Jain_Temple%2C_Located_on_Shahibaug_Road_in_Ahmedabad_Entry.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 08:00 AM to 01:00 PM & 02:00 PM to 05:00 PM. Peaceful marble courtyard; footwear and ",
    "rating": 4.4,
    "shortDescription": "Constructed during the devastating Gujarat famine of 1846–1848 by wealthy Jain merchant Sheth Hutheesing Kesrisinh as a famine relief charity project, employing..."
  },
  {
    "id": "IND-GJ-21",
    "name": "Vijay Vilas Palace",
    "nameHi": "વિજય વિલાસ પેલેસ (Vijay Vilas Mandvi)",
    "nameGu": "વિજય વિલાસ પેલેસ (Vijay Vilas Mandvi)",
    "latitude": 22.8258,
    "longitude": 69.3139,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/A_Dargah_on_mound_near_Vijay_Vilas_Palace%2C_Mandvi%2C_Kutch%2C_Gujarat.jpg/960px-A_Dargah_on_mound_near_Vijay_Vilas_Palace%2C_Mandvi%2C_Kutch%2C_Gujarat.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 01:00 PM & 03:00 PM to 06:00 PM daily. Royal rooftop accessible for viewi",
    "rating": 4.5,
    "shortDescription": "Commissioned as a summer coastal retreat by Maharao Vijayaraji of Kutch, constructed under the supervision of royal architects from Jaipur, Rajasthan, and stone..."
  },
  {
    "id": "IND-GJ-22",
    "name": "Bhadra Fort & Teen Darwaza",
    "nameHi": "ભદ્રનો કિલ્લો અને ત્રણ દરવાજા (Bhadra Fort)",
    "nameGu": "ભદ્રનો કિલ્લો અને ત્રણ દરવાજા (Bhadra Fort)",
    "latitude": 23.0247,
    "longitude": 72.58,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Teen-Darwaza.jpg/960px-Teen-Darwaza.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 05:00 PM daily. The pedestrian plaza connecting Bhadra Fort to Teen Darwa",
    "rating": 4.6,
    "shortDescription": "Constructed in 1411 CE as the fortified royal citadel immediately after Sultan Ahmed Shah founded the city of Ahmedabad on the banks of the Sabarmati River. Tee..."
  },
  {
    "id": "IND-GJ-23",
    "name": "Jama Masjid of Ahmedabad",
    "nameHi": "જામા મસ્જિદ (Jama Masjid Ahmedabad)",
    "nameGu": "જામા મસ્જિદ (Jama Masjid Ahmedabad)",
    "latitude": 23.0236,
    "longitude": 72.5878,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Jama_Masjid%2CAhmedabad_1.JPG/960px-Jama_Masjid%2CAhmedabad_1.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 08:00 PM (Closed to non-Muslim tourists during congregational prayer time",
    "rating": 4.7,
    "shortDescription": "Constructed in 1424 by Sultan Ahmed Shah, celebrated as one of the finest mosques in the Indian subcontinent. Demonstrates exceptional syncretism: local Hindu a..."
  },
  {
    "id": "IND-GJ-24",
    "name": "Jhulta Minar (The Shaking Minarets of Sidi Bashir)",
    "nameHi": "ઝૂલતા મીનારા (Jhulta Minar)",
    "nameGu": "ઝૂલતા મીનારા (Jhulta Minar)",
    "latitude": 23.02,
    "longitude": 72.6,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Jhulta_Minar%2C_Bibiji_Masjid.jpg/960px-Jhulta_Minar%2C_Bibiji_Masjid.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 09:00 AM to 05:00 PM daily. Located right outside Ahmedabad Junction (Kalupur) Railwa",
    "rating": 4.8,
    "shortDescription": "One of the most perplexing mechanical engineering mysteries of medieval India: when one minaret is shaken or vibrated gently at the top, the other minaret begin..."
  },
  {
    "id": "IND-GJ-25",
    "name": "Sabarmati Ashram (Hriday Kunj)",
    "nameHi": "સાબરમતી આશ્રમ / હૃદય કુંજ (Sabarmati Ashram)",
    "nameGu": "સાબરમતી આશ્રમ / હૃદય કુંજ (Sabarmati Ashram)",
    "latitude": 23.0606,
    "longitude": 72.58,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/GANDHI_ASHRAM_03.jpg/960px-GANDHI_ASHRAM_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 08:30 AM to 06:30 PM daily, 365 days a year. Free admission for all visitors. Serene ",
    "rating": 4.9,
    "shortDescription": "The spiritual and political headquarters from which Mahatma Gandhi directed India's non-violent struggle for freedom from 1917 to 1930. On March 12, 1930, Gandh..."
  },
  {
    "id": "IND-GJ-26",
    "name": "Lakhpat Fort & Gurdwara Pehli Patshahi",
    "nameHi": "લખપત કિલ્લો (Lakhpat Fort)",
    "nameGu": "લખપત કિલ્લો (Lakhpat Fort)",
    "latitude": 23.8297,
    "longitude": 68.7758,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Kot_Lakhpat_in_Kutch_01.JPG/960px-Kot_Lakhpat_in_Kutch_01.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open sunrise to sunset daily. Located at the extreme northwestern tip of India, 135 km fro",
    "rating": 4.4,
    "shortDescription": "Once a bustling maritime port generating 100,000 koris daily from maritime customs (hence 'Lakhpat' - the city of hundred thousands) when the Indus River flowed..."
  },
  {
    "id": "IND-GJ-27",
    "name": "Taranga Jain Temple & Buddhist Caves",
    "nameHi": "તારંગા જૈન મંદિર (Taranga Hill)",
    "nameGu": "તારંગા જૈન મંદિર (Taranga Hill)",
    "latitude": 23.9989,
    "longitude": 72.7667,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Ajitnatha.jpg/960px-Ajitnatha.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open 06:00 AM to 06:00 PM daily. Excellent scenic mountain drive. Paved steps lead to the ",
    "rating": 4.5,
    "shortDescription": "Constructed in 1161 CE by Chaulukya Emperor Kumarapala under the spiritual guidance of legendary Jain polymath Acharya Hemachandracharya. The grand Ajitnath tem..."
  },
  {
    "id": "IND-GJ-28",
    "name": "Sidhpur Havelis & Rudra Mahalaya Temple Ruins",
    "nameHi": "સિદ્ધપુર રુદ્ર મહાલય અને હવેલીઓ (Sidhpur)",
    "nameGu": "સિદ્ધપુર રુદ્ર મહાલય અને હવેલીઓ (Sidhpur)",
    "latitude": 23.9167,
    "longitude": 72.3833,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Architecture_at_the_Rudra_Mahalaya_at_Sidhpur%2C_Gujarat.jpg/960px-Architecture_at_the_Rudra_Mahalaya_at_Sidhpur%2C_Gujarat.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open sunrise to sunset. Located 30 km east of Patan and 115 km north of Ahmedabad along NH",
    "rating": 4.6,
    "shortDescription": "Sidhpur features two extraordinary architectural paradigms. The Rudra Mahalaya was once the largest and grandest temple in western India, described as a 3-store..."
  },
  {
    "id": "IND-GJ-29",
    "name": "Khambhalida Buddhist Caves",
    "nameHi": "ખંભાલીડા બૌદ્ધ ગુફાઓ (Khambhalida Caves)",
    "nameGu": "ખંભાલીડા બૌદ્ધ ગુફાઓ (Khambhalida Caves)",
    "latitude": 21.7833,
    "longitude": 70.7333,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Khambhalida_caves.jpg/1280px-Khambhalida_caves.jpg",
    "openingHours": "Open 09:00 AM to 05:30 PM daily. Located 60 km south of Rajkot. Peaceful picnic and histor",
    "rating": 4.7,
    "shortDescription": "Discovered in 1958 by renowned archaeologist P.P. Pandya. The central Chaitya cave features one of the most magnificent early sculptural facades in Gujarat: fla..."
  },
  {
    "id": "IND-GJ-30",
    "name": "Gop Temple (Earliest Structural Temple of Gujarat)",
    "nameHi": "ગોપ મંદિર (Gop Temple)",
    "nameGu": "ગોપ મંદિર (Gop Temple)",
    "latitude": 22.1333,
    "longitude": 70.0833,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/600_CE_Gop_Surya_temple%2C_Zinavari_Gujarat_plan%2C_1876_sketch.jpg/960px-600_CE_Gop_Surya_temple%2C_Zinavari_Gujarat_plan%2C_1876_sketch.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open sunrise to sunset daily. Located 50 km south of Jamnagar. Essential destination for a",
    "rating": 4.8,
    "shortDescription": "Archaeologically revered as the oldest surviving structural stone temple in all of Gujarat. Dating to the mid-6th century CE, it stands on an elevated double te..."
  },
  {
    "id": "IND-GJ-31",
    "name": "Surat Castle (Old Fort of Surat)",
    "nameHi": "સૂરત કિલ્લો (Surat Castle)",
    "nameGu": "સૂરત કિલ્લો (Surat Castle)",
    "latitude": 21.1959,
    "longitude": 72.8153,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Surat_Castle.jpg/1280px-Surat_Castle.jpg",
    "openingHours": "Open 10:00 AM to 06:00 PM (Closed Mondays). Fully restored by Surat Municipal Corporation ",
    "rating": 4.9,
    "shortDescription": "Built in 1540 by Safi Agha (Khudawand Khan), a Turkish Ottoman general in the service of the Sultanate of Gujarat, specifically to defend the wealthy merchant p..."
  },
  {
    "id": "IND-GJ-32",
    "name": "Ghumli Navalakha Temple & Vichia Vav",
    "nameHi": "ઘુમલી નવલખા મંદિર (Ghumli Navalakha)",
    "nameGu": "ઘુમલી નવલખા મંદિર (Ghumli Navalakha)",
    "latitude": 21.8833,
    "longitude": 69.75,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Ghumli_Navlakha_temple_black_%26_white.jpg/960px-Ghumli_Navlakha_temple_black_%26_white.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Open sunrise to sunset daily. Located in the serene valleys of Barda Wildlife Sanctuary, 4",
    "rating": 4.4,
    "shortDescription": "Ghumli served as the glorious royal capital of the Jethwa Rajput dynasty from the 9th to the 14th century. The Navalakha Temple (literally costing 'nine lakhs' ..."
  },
  {
    "id": "IND-ART-13",
    "name": "Patan Patola Double-Ikat Silk Heritage Textile",
    "nameHi": "પાટણનું પટોળું (Patan Patola Saree)",
    "nameGu": "પાટણનું પટોળું (Patan Patola Saree)",
    "latitude": 23.8493,
    "longitude": 72.1266,
    "category": "culture",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Antique_Patan_Patola_Double_Ikat_Trade_Textile_courtesy_Wovensouls_Collection%2C_Singapore.jpg/960px-Antique_Patan_Patola_Double_Ikat_Trade_Textile_courtesy_Wovensouls_Collection%2C_Singapore.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Calico Museum of Textiles, Shahibaug, Ahmedabad & Patan Patola Heritage Museum, Salvivad, ",
    "rating": 4.5,
    "shortDescription": "According to the 12th-century Jain chronicler Merutunga, King Kumarapala brought 700 Salvi weaver families from Jalna (Maharashtra) to Patan to produce ceremoni..."
  },
  {
    "id": "IND-ART-14",
    "name": "Tree of Life Stone Lattice Jali (Sidi Saiyyed Mosque)",
    "nameHi": "સીદી સૈયદની જાળી (Sidi Saiyyed Ni Jali)",
    "nameGu": "સીદી સૈયદની જાળી (Sidi Saiyyed Ni Jali)",
    "latitude": 23.0269,
    "longitude": 72.5815,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Carved_Mesh_of_Sidi_Saiyyed_Mosque_Ahmedabad_Gujarat_DSC001.jpg/960px-Carved_Mesh_of_Sidi_Saiyyed_Mosque_Ahmedabad_Gujarat_DSC001.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Sidi Saiyyed Mosque, Gheekanta, Lal Darwaza, Ahmedabad. Western wall flanking the central ",
    "rating": 4.6,
    "shortDescription": "Carved by Habshi general Sidi Saiyyid in 1572 CE during the twilight of the Gujarat Sultanate just prior to Mughal annexation by Akbar. The delicate stone folia..."
  },
  {
    "id": "IND-ART-15",
    "name": "Sabha Mandapa 52 Pillars (Sun Temple Modhera)",
    "nameHi": "મોઢેરા સૂર્ય મંદિરના ૫૨ સ્તંભો (Modhera 52 Carved Pillars)",
    "nameGu": "મોઢેરા સૂર્ય મંદિરના ૫૨ સ્તંભો (Modhera 52 Carved Pillars)",
    "latitude": 23.5835,
    "longitude": 72.1331,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Pillars_of_Sabha_Mandapa%2C_Sun_Temple%2C_Modhera.jpg/1280px-Pillars_of_Sabha_Mandapa%2C_Sun_Temple%2C_Modhera.jpg",
    "openingHours": "Modhera Sun Temple Complex, Mehsana District, Gujarat. Timings: 7:00 AM – 6:00 PM. Evening",
    "rating": 4.7,
    "shortDescription": "The 52 pillars of the Sabha Mandapa (Assembly Hall) stand as an astronomical calendar dividing the solar year into 52 weeks. On the equinox days (March 21 and S..."
  },
  {
    "id": "IND-ART-16",
    "name": "Sheshashayi Vishnu Wall Sculpture (Rani ki Vav)",
    "nameHi": "શેષશાયી વિષ્ણુ શિલ્પ (Sheshashayi Vishnu at Rani ki Vav)",
    "nameGu": "શેષશાયી વિષ્ણુ શિલ્પ (Sheshashayi Vishnu at Rani ki Vav)",
    "latitude": 23.8589,
    "longitude": 72.1018,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Rani_ki_Vav_Vishnu.jpg/1280px-Rani_ki_Vav_Vishnu.jpg",
    "openingHours": "Rani ki Vav, Mohan Nagar Society, Patan, Gujarat. Level 4 corridor on north gallery wall. ",
    "rating": 4.8,
    "shortDescription": "Positioned at the fourth subterranean gallery level of Rani ki Vav, this masterpiece represents the primordial waters of creation (Kshira Sagara). Built by Quee..."
  },
  {
    "id": "IND-ART-17",
    "name": "Rust-Resistant Iron Pillar of Delhi",
    "nameHi": "दिल्ली का लौह स्तम्भ (Iron Pillar of Chandragupta II)",
    "nameGu": "दिल्ली का लौह स्तम्भ (Iron Pillar of Chandragupta II)",
    "latitude": 28.5247,
    "longitude": 77.1855,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Delhi_Iron_pillar%2C_2010-09-27.jpg/960px-Delhi_Iron_pillar%2C_2010-09-27.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Qutub Minar Complex, Mehrauli, New Delhi. Located in the open courtyard of Quwwat-ul-Islam",
    "rating": 4.9,
    "shortDescription": "A metallurgical mystery that baffled Western scientists for centuries. Metallurgists at IIT Kanpur discovered that ancient Indian ironsmiths created a protectiv..."
  },
  {
    "id": "IND-ART-18",
    "name": "Konark Sun Chariot Sundial Wheels",
    "nameHi": "कोणार्क सूर्य रथ चक्र (Konark Sun Wheels)",
    "nameGu": "कोणार्क सूर्य रथ चक्र (Konark Sun Wheels)",
    "latitude": 19.8876,
    "longitude": 86.0945,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Closeup_of_the_center_of_a_stone_wheel_-_Konark_Sun_Temple%2C_Orissa%2C_India.jpg/960px-Closeup_of_the_center_of_a_stone_wheel_-_Konark_Sun_Temple%2C_Orissa%2C_India.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Konark Sun Temple Complex, Konark, Odisha. Plinth of Jagamohana hall. Timings: 6:00 AM – 8",
    "rating": 4.4,
    "shortDescription": "The 24 wheels of the Konark Sun Temple represent the 24 fortnights (Pakshas) of the Hindu solar year, pulled by seven spirited horses (representing the 7 days o..."
  },
  {
    "id": "IND-ART-19",
    "name": "Monolithic Stone Chariot (Vittala Temple Hampi)",
    "nameHi": "ಕಲ್ಲಿನ ರಥ (Hampi Stone Chariot)",
    "nameGu": "ಕಲ್ಲಿನ ರಥ (Hampi Stone Chariot)",
    "latitude": 15.3402,
    "longitude": 76.4795,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Hampi_Garuda_stone_chariot.jpg/960px-Hampi_Garuda_stone_chariot.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "Vittala Temple Complex, Hampi, Karnataka. Main courtyard center. Battery-operated golf car",
    "rating": 4.5,
    "shortDescription": "Built by King Krishnadevaraya inspired by Konark's sun chariot during his Kalinga campaigns. Dedicated to Garuda, the celestial mount of Lord Vishnu. The wheels..."
  },
  {
    "id": "IND-ART-20",
    "name": "Baan Stambh (Arrow Pillar of Somnath)",
    "nameHi": "બાણ સ્તંભ સોમનાથ (Baan Stambh / Arrow Pillar)",
    "nameGu": "બાણ સ્તંભ સોમનાથ (Baan Stambh / Arrow Pillar)",
    "latitude": 20.888,
    "longitude": 70.4013,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Arrow_Pillar_Somnath_Baan_Stambh.jpg/1280px-Arrow_Pillar_Somnath_Baan_Stambh.jpg",
    "openingHours": "Somnath Temple Complex, Prabhas Patan, Gujarat. Located on the sea-facing protection wall ",
    "rating": 4.6,
    "shortDescription": "A staggering geographical and astronomical achievement of ancient India. The pillar marks a straight ocean meridian line from Somnath Temple directly to Antarct..."
  },
  {
    "id": "IND-ART-21",
    "name": "Pashupati Seal (Proto-Shiva Intaglio)",
    "nameHi": "पशुपति मुहर (Pashupati Seal)",
    "nameGu": "पशुपति मुहर (Pashupati Seal)",
    "latitude": 28.6118,
    "longitude": 77.2193,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/81/Image-Pashupati.jpeg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "openingHours": "🏛️ Location: National Museum, Janpath, New Delhi | Gallery: Ground Floor, Harappan Civiliz",
    "rating": 4.7,
    "shortDescription": "Discovered at Mohenjo-daro by Sir John Marshall in 1928–29. Widely recognized as one of the earliest depictions of proto-Shiva as 'Lord of Animals' (Pashupati) ..."
  },
  {
    "id": "IND-ART-22",
    "name": "Holy Piprahwa Relics of Lord Gautama Buddha",
    "nameHi": "भगवान बुद्ध के पवित्र धातु अवशेष (Buddha Holy Relics)",
    "nameGu": "भगवान बुद्ध के पवित्र धातु अवशेष (Buddha Holy Relics)",
    "latitude": 28.6118,
    "longitude": 77.2193,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Buddhist_Stupa_containing_relics_of_Buddha%2C_National_Museum%2C_New_Delhi.jpg/960px-Buddhist_Stupa_containing_relics_of_Buddha%2C_National_Museum%2C_New_Delhi.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "🏛️ Location: National Museum, Janpath, New Delhi | Gallery: 1st Floor, Dedicated Buddhist ",
    "rating": 4.8,
    "shortDescription": "Excavated from the main stupa at Piprahwa (ancient Kapilavastu) in Uttar Pradesh by K.M. Srivastava (ASI) in 1971-73. The inscribed Brahmi text confirms the rel..."
  },
  {
    "id": "IND-ART-23",
    "name": "Sword of Emperor Aurangzeb (Wootz Steel with Calligraphy)",
    "nameHi": "औरंगज़ेब की तलवार (Aurangzeb's Sword)",
    "nameGu": "औरंगज़ेब की तलवार (Aurangzeb's Sword)",
    "latitude": 28.6118,
    "longitude": 77.2193,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mughal_Sword_Tulwar.jpg/1280px-Mughal_Sword_Tulwar.jpg",
    "openingHours": "🏛️ Location: National Museum, Janpath, New Delhi | Gallery: 2nd Floor, Arms and Armor Gall",
    "rating": 4.9,
    "shortDescription": "Carried by Mughal Emperor Aurangzeb during his 25-year Deccan campaigns. The blade was forged using high-carbon Southern Indian wootz steel renowned globally fo..."
  },
  {
    "id": "IND-ART-24",
    "name": "Shield of Emperor Akbar (Zodiac Gold Damascened Dhal)",
    "nameHi": "अकबर की ढाल (Emperor Akbar's Shield)",
    "nameGu": "अकबर की ढाल (Emperor Akbar's Shield)",
    "latitude": 28.6118,
    "longitude": 77.2193,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Akbar_shield_Prince_of_Wales_Museum.jpg/1280px-Akbar_shield_Prince_of_Wales_Museum.jpg",
    "openingHours": "🏛️ Location: National Museum, Janpath, New Delhi | Gallery: 2nd Floor, Arms & Armor Galler",
    "rating": 4.4,
    "shortDescription": "Specially crafted for Jalal-ud-din Muhammad Akbar in 1594 CE. The shield combines Islamic astrological symbology with Rajput defensive warfare. The 12 zodiac me..."
  },
  {
    "id": "IND-ART-25",
    "name": "Dharmachakra Pravartana Buddha (Gupta 5th Century)",
    "nameHi": "धर्मचक्र प्रवर्तन बुद्ध (Preaching Buddha of Sarnath)",
    "nameGu": "धर्मचक्र प्रवर्तन बुद्ध (Preaching Buddha of Sarnath)",
    "latitude": 25.3811,
    "longitude": 83.0214,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Buddha_preaching_his_First_Sermon_%28Sarnath%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "openingHours": "🏛️ Location: Sarnath Archaeological Museum, Sarnath, Varanasi | Gallery: Main Sculpture Ga",
    "rating": 4.5,
    "shortDescription": "Universally recognized as the quintessential icon of Buddha in art history. Excavated at Sarnath by F.O. Oertel in 1904-05. The peaceful spiritual expression, d..."
  },
  {
    "id": "IND-ART-26",
    "name": "Bharhut Stupa Torana Gateway & Railing Panels",
    "nameHi": "भरहुत तोरण द्वार एवं वेदिका (Bharhut Gateway)",
    "nameGu": "भरहुत तोरण द्वार एवं वेदिका (Bharhut Gateway)",
    "latitude": 22.5579,
    "longitude": 88.3511,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Polished_sandstone_Vedika%2C_Bharhut_stupa%2C_Shunga_dynasty%2C_Indian_Museum%2C_Kolkata_1515.jpg/960px-Polished_sandstone_Vedika%2C_Bharhut_stupa%2C_Shunga_dynasty%2C_Indian_Museum%2C_Kolkata_1515.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "🏛️ Location: Indian Museum, 27 Jawaharlal Nehru Road, Kolkata | Gallery: Ground Floor, Bha",
    "rating": 4.6,
    "shortDescription": "Discovered in 1873 at Bharhut (Madhya Pradesh) by Alexander Cunningham, founder of the ASI. To save the carvings from local quarrying, Cunningham transported th..."
  },
  {
    "id": "IND-ART-27",
    "name": "Gandhara Standing Buddha (Greco-Buddhist Masterpiece)",
    "nameHi": "गांधार बुद्ध (Gandhara Standing Buddha)",
    "nameGu": "गांधार बुद्ध (Gandhara Standing Buddha)",
    "latitude": 22.5579,
    "longitude": 88.3511,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/4._Standing_Buddha%2C_2nd_century_CE%2C_Loriyan_Tangai%2C_Gandhara_Gallery%2C_Indian_Museum%2C_Kolkata.-_4905-A23215.jpg/960px-4._Standing_Buddha%2C_2nd_century_CE%2C_Loriyan_Tangai%2C_Gandhara_Gallery%2C_Indian_Museum%2C_Kolkata.-_4905-A23215.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "🏛️ Location: Indian Museum, Kolkata | Gallery: Ground Floor, Gandhara Sculpture Gallery | ",
    "rating": 4.7,
    "shortDescription": "Demonstrates the fascinating cultural synthesis between Greek Hellenistic artistic traditions left by Alexander the Great's successors and Mahayana Buddhism und..."
  },
  {
    "id": "IND-ART-28",
    "name": "4,000-Year-Old Egyptian Ptolemaic Mummy",
    "nameHi": "मिस्र की ममी (Egyptian Mummy of Kolkata)",
    "nameGu": "मिस्र की ममी (Egyptian Mummy of Kolkata)",
    "latitude": 22.5579,
    "longitude": 88.3511,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Egyptian_Human_Mummy_-_Egyptian_Gallery_-_Indian_Museum_-_Kolkata_2014-02-14_3289.JPG/960px-Egyptian_Human_Mummy_-_Egyptian_Gallery_-_Indian_Museum_-_Kolkata_2014-02-14_3289.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "🏛️ Location: Indian Museum, Kolkata | Gallery: 1st Floor, Dedicated Egyptian Room | Showca",
    "rating": 4.8,
    "shortDescription": "Brought to Calcutta in 1834 by British traveler Lieutenant EC Archbold from Luxor, Egypt, and gifted to the Asiatic Society of Bengal. Underwent non-invasive CT..."
  },
  {
    "id": "IND-ART-29",
    "name": "Double-Sided Wood Statue of Mephistopheles and Margaretta",
    "nameHi": "मेफिस्टोफिल्स और मार्गरेट (Double Statue)",
    "nameGu": "मेफिस्टोफिल्स और मार्गरेट (Double Statue)",
    "latitude": 17.3713,
    "longitude": 78.4803,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Salar_Jung_Museum_Double_Statue.jpg/960px-Salar_Jung_Museum_Double_Statue.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "🏛️ Location: Salar Jung Museum, Hyderabad | Gallery: 1st Floor, Western Section, European ",
    "rating": 4.9,
    "shortDescription": "Acquired by Nawab Mir Yousuf Ali Khan in France. Depicts the duality of good and evil from Johann Wolfgang von Goethe's dramatic tragedy 'Faust'. Carved from a ..."
  },
  {
    "id": "IND-ART-30",
    "name": "Salar Jung Musical Clock (Cook & Kelvey 19th-Century)",
    "nameHi": "सालार जंग संगीतमय घड़ी (Musical Clock)",
    "nameGu": "सालार जंग संगीतमय घड़ी (Musical Clock)",
    "latitude": 17.3713,
    "longitude": 78.4803,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Salar_Jung_Museum_Clock.jpg/1280px-Salar_Jung_Museum_Clock.jpg",
    "openingHours": "🏛️ Location: Salar Jung Museum, Hyderabad | Gallery: Central Courtyard Atrium, Ground Floo",
    "rating": 4.4,
    "shortDescription": "Every day, hundreds of tourists gather in the central hall of the museum before the top of each hour to witness the mechanical toy watchman step out of the door..."
  },
  {
    "id": "IND-ART-31",
    "name": "Sword of Chhatrapati Shivaji Maharaj (Historical Maratha Talwar)",
    "nameHi": "छत्रपती शिवाजी महाराजांची तलवार (Shivaji Maharaj Talwar)",
    "nameGu": "छत्रपती शिवाजी महाराजांची तलवार (Shivaji Maharaj Talwar)",
    "latitude": 18.9269,
    "longitude": 72.8327,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Weapons_as_used_by_Shivaji%2C_CSMVS.jpg/960px-Weapons_as_used_by_Shivaji%2C_CSMVS.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "🏛️ Location: Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS), Fort, Mumbai | Galler",
    "rating": 4.5,
    "shortDescription": "Represents the military spirit of Swarajya founded by Chhatrapati Shivaji Maharaj. Forged from Deccan crucible steel, these swords enabled Maratha guerrilla for..."
  },
  {
    "id": "IND-ART-32",
    "name": "Ardhanarisvara Chola Bronze of Tiruvenkadu",
    "nameHi": "அர்த்தநாரீஸ்வரர் வெண்கலச் சிற்பம் (Ardhanarisvara)",
    "nameGu": "அர்த்தநாரீஸ்வரர் வெண்கலச் சிற்பம் (Ardhanarisvara)",
    "latitude": 13.0732,
    "longitude": 80.2585,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/28/Ardhanari.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "openingHours": "🏛️ Location: Government Museum, Pantheon Road, Egmore, Chennai | Gallery: Dedicated Bronze",
    "rating": 4.6,
    "shortDescription": "Excavated from Tiruvenkadu temple in Mayiladuthurai district, Tamil Nadu. Considered by art historians like Stella Kramrisch and C. Sivaramamurti as the supreme..."
  },
  {
    "id": "IND-ART-33",
    "name": "Akota Jain Bronzes Hoard (Vadodara)",
    "nameHi": "અકોટા જૈન કાંસ્ય શિલ્પો (Akota Bronzes)",
    "nameGu": "અકોટા જૈન કાંસ્ય શિલ્પો (Akota Bronzes)",
    "latitude": 22.3128,
    "longitude": 73.1812,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Akota_Bronzes_Rishabhanatha_Baroda_Museum.jpg/1280px-Akota_Bronzes_Rishabhanatha_Baroda_Museum.jpg",
    "openingHours": "🏛️ Location: Baroda Museum and Picture Gallery, Sayaji Baug, Vadodara, Gujarat | Gallery: ",
    "rating": 4.7,
    "shortDescription": "Discovered in 1951 accidentally during brick-quarrying at Akota near Vadodara. The 68 metallic idols establish that Gujarat possessed a bronze-casting school eq..."
  },
  {
    "id": "IND-ART-34",
    "name": "17th-Century Shrinathji Nathdwara Pichhwai (Calico Museum)",
    "nameHi": "શ્રીનાથજી હવેલી પિછવાઈ (Shrinathji Pichhwai on Silk)",
    "nameGu": "શ્રીનાથજી હવેલી પિછવાઈ (Shrinathji Pichhwai on Silk)",
    "latitude": 23.0569,
    "longitude": 72.5934,
    "category": "culture",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Nathdwara_pichhwai_painting.jpg/1280px-Nathdwara_pichhwai_painting.jpg",
    "openingHours": "🏛️ Location: Calico Museum of Textiles, The Retreat, Shahibaug, Ahmedabad, Gujarat | Galle",
    "rating": 4.8,
    "shortDescription": "Pichhwais ('hanging at the back') are large devotional textile paintings hung behind the sanctum deity in Pushtimarg Vaishnava temples. The Calico Museum in Ahm..."
  },
  {
    "id": "IND-ART-35",
    "name": "1st-Century Andhau Inscriptions of Rudradaman (Kutch Museum)",
    "nameHi": "અંધૌ શિલાલેખ (Andhau Stone Inscription of Kutch)",
    "nameGu": "અંધૌ શિલાલેખ (Andhau Stone Inscription of Kutch)",
    "latitude": 23.2508,
    "longitude": 69.6672,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Kshatrapa_inscription_stone.jpg/1280px-Kshatrapa_inscription_stone.jpg",
    "openingHours": "🏛️ Location: Kutch Museum (Oldest Museum in Gujarat, founded 1877), Near Hamirsar Lake, Bh",
    "rating": 4.9,
    "shortDescription": "Found at Andhau village in the Rann of Kutch. These four inscribed pillars are the oldest known epigraphs found in Gujarat using the Saka era. They provide cruc..."
  },
  {
    "id": "IND-ART-36",
    "name": "Airavat Sacred Wooden Elephant (Kutch Museum)",
    "nameHi": "ઐરાવત હાથી (Kutch Royal Airavat Wood Carving)",
    "nameGu": "ઐરાવત હાથી (Kutch Royal Airavat Wood Carving)",
    "latitude": 23.2508,
    "longitude": 69.6672,
    "category": "culture",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Airavata_elephant_sculpture.jpg/1280px-Airavata_elephant_sculpture.jpg",
    "openingHours": "🏛️ Location: Kutch Museum, Opposite Hamirsar Lake, Bhuj, Gujarat | Gallery: 1st Floor, Ant",
    "rating": 4.4,
    "shortDescription": "Used during the annual royal Navratri and Dussehra state processions in Bhuj. The Maharaos of Kutch were carried on this seven-trunked elephant carriage from Ai..."
  },
  {
    "id": "IND-ART-37",
    "name": "Rangpur Harappan Terracotta Toy Cart & Painted Pottery",
    "nameHi": "રંગપુર સિંધુ ખીણના વાસણો (Rangpur Harappan Pottery)",
    "nameGu": "રંગપુર સિંધુ ખીણના વાસણો (Rangpur Harappan Pottery)",
    "latitude": 22.3039,
    "longitude": 70.8022,
    "category": "museum",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Harappan_terracotta_toy_cart.jpg/1280px-Harappan_terracotta_toy_cart.jpg",
    "openingHours": "🏛️ Location: Watson Museum, Jubilee Garden, Rajkot, Gujarat | Gallery: Ground Floor, Indus",
    "rating": 4.5,
    "shortDescription": "Excavated at Rangpur in Surendranagar/Ahmedabad district by M.S. Vats in 1935 and S.R. Rao in 1953-56. Rangpur is the type-site that proved the Indus Valley Civ..."
  },
  {
    "id": "IND-ART-38",
    "name": "Ravana Shaking Mount Kailash Bas-Relief (Ellora Cave 16)",
    "nameHi": "रावणानुग्रह मूर्ति (Ravana Shaking Mount Kailash)",
    "nameGu": "रावणानुग्रह मूर्ति (Ravana Shaking Mount Kailash)",
    "latitude": 20.0242,
    "longitude": 75.1793,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Ellora%2C_cave_29%2C_Ravana_shaking_Mount_Kailasa_%289841650413%29.jpg/960px-Ellora%2C_cave_29%2C_Ravana_shaking_Mount_Kailasa_%289841650413%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "🏛️ Location: Ellora Caves, Aurangabad, Maharashtra | Monument: Cave 16 (Kailash Temple) | ",
    "rating": 4.6,
    "shortDescription": "Considered the most dramatic, dynamic relief sculpture in Indian rock-cut art. Carved from a single volcanic basalt cliffside at the foot of the monolithic Kail..."
  },
  {
    "id": "IND-ART-39",
    "name": "Padmapani Bodhisattva Fresco (Ajanta Cave 1)",
    "nameHi": "पद्मपाणि बोधिसत्व भित्तिचित्र (Bodhisattva Padmapani)",
    "nameGu": "पद्मपाणि बोधिसत्व भित्तिचित्र (Bodhisattva Padmapani)",
    "latitude": 20.5519,
    "longitude": 75.7033,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/022_Cave_1%2C_Padmapani_%2833896247830%29.jpg/960px-022_Cave_1%2C_Padmapani_%2833896247830%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "🏛️ Location: Ajanta Caves, Aurangabad, Maharashtra | Monument: Cave 1 (Vihara Monastery) |",
    "rating": 4.7,
    "shortDescription": "The supreme masterpiece of Asian ancient painting. Surviving in complete darkness inside Cave 1 for 1,500 years, illuminated only by fiber-optic non-heat museum..."
  },
  {
    "id": "IND-ART-40",
    "name": "Krishna's Butterball (Mahabalipuram Balancing Boulder)",
    "nameHi": "கிருஷ்ண வெண்ணெய் பந்து (Krishna's Butterball)",
    "nameGu": "கிருஷ்ண வெண்ணெய் பந்து (Krishna's Butterball)",
    "latitude": 12.6186,
    "longitude": 80.1925,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Krishna%27s_Butterball_at_Mahabalipuram_heritage_complex_01.jpg/960px-Krishna%27s_Butterball_at_Mahabalipuram_heritage_complex_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "🏛️ Location: Mahabalipuram Historic Park, Mahabalipuram, Tamil Nadu | Position: Open-air r",
    "rating": 4.8,
    "shortDescription": "Named after the myth of infant Lord Krishna repeatedly stealing butter (makhan) from his mother's pot. In 1908, the British Governor of Madras, Arthur Havelock,..."
  },
  {
    "id": "IND-ART-41",
    "name": "Fateh Darwaza Acoustic Clapping Dome (Golconda Fort)",
    "nameHi": "फतेह दरवाजा (Fateh Darwaza Acoustic Arch)",
    "nameGu": "फतेह दरवाजा (Fateh Darwaza Acoustic Arch)",
    "latitude": 17.3833,
    "longitude": 78.4011,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Golconda_Fort_3.JPG/960px-Golconda_Fort_3.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "🏛️ Location: Golconda Fort, Hyderabad | Position: Main Eastern Entrance Gate (Fateh Darwaz",
    "rating": 4.9,
    "shortDescription": "A military engineering marvel built for defense against surprise siege attacks. A single hand clap struck under the dome of Fateh Darwaza travels through acoust..."
  },
  {
    "id": "IND-ART-42",
    "name": "Neelam and Manek Ottoman Cannons (Uparkot Fort)",
    "nameHi": "નીલમ અને માણેક તોપ (Neelam & Manek Top)",
    "nameGu": "નીલમ અને માણેક તોપ (Neelam & Manek Top)",
    "latitude": 21.5205,
    "longitude": 70.4705,
    "category": "museum",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Jama_Masjid%2C_Uperkot_11.jpg/960px-Jama_Masjid%2C_Uperkot_11.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "🏛️ Location: Uparkot Fort, Junagadh, Gujarat | Position: Highest Ramparts / Western Bastio",
    "rating": 4.4,
    "shortDescription": "Cast in Cairo, Egypt by Ottoman Sultan Suleiman's imperial foundries and dispatched with admiral Hadim Suleiman Pasha's fleet to Diu to aid Gujarat Sultan Bahad..."
  },
  {
    "id": "IND-ART-43",
    "name": "Navagraha Frieze & Ami Khumbh Reservoir (Adalaj Stepwell)",
    "nameHi": "નવગ્રહ શિલ્પ અને અમી કુંભ (Adalaj Navagraha & Water Pot)",
    "nameGu": "નવગ્રહ શિલ્પ અને અમી કુંભ (Adalaj Navagraha & Water Pot)",
    "latitude": 23.1667,
    "longitude": 72.58,
    "category": "heritage",
    "imageUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Adalaj_Stepwell_carvings.jpg/960px-Adalaj_Stepwell_carvings.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "openingHours": "🏛️ Location: Adalaj Stepwell, Adalaj Village, Gandhinagar, Gujarat | Position: 5th Subterr",
    "rating": 4.5,
    "shortDescription": "Built in 1499 by Queen Rudabai in memory of her husband Rana Veer Singh. Adalaj Stepwell is famous for its unique blend of Hindu and Jain iconographic symbols w..."
  },
  {
    "id": "p-gateway-of-india",
    "name": "Gateway of India",
    "nameHi": "गेटवे ऑफ़ इंडिया (Gateway of India)",
    "nameGu": "गेटवे ऑफ़ इंडिया (Gateway of India)",
    "latitude": 18.922,
    "longitude": 72.8347,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/800px-Mumbai_03-2016_30_Gateway_of_India.jpg",
    "openingHours": "Open 24 Hours. Best visited sunrise or sunset. Ferry terminal for Elephanta Caves departs from the rear steps. High security baggage screening.",
    "rating": 4.8,
    "shortDescription": "Erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder in December 1911. Historically significant as the ceremo..."
  },
  {
    "id": "p-brihadeeswarar-temple",
    "name": "Brihadeeswarar Temple",
    "nameHi": "பெருவுடையார் கோயில் (Brihadisvara Temple)",
    "nameGu": "பெருவுடையார் கோயில் (Brihadisvara Temple)",
    "latitude": 10.7828,
    "longitude": 79.1318,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Brihadisvara_Temple%2C_Thanjavur.jpg/800px-Brihadisvara_Temple%2C_Thanjavur.jpg",
    "openingHours": "Open 6:00 AM – 12:30 PM & 4:00 PM – 8:30 PM. Free entry. Non-leather footwear strictly enforced.",
    "rating": 4.8,
    "shortDescription": "Commissioned by the greatest Chola conqueror, Rajaraja I, in 1010 CE to celebrate his naval victories across the Bay of Bengal, Sri Lanka, a..."
  },
  {
    "id": "p-india-gate",
    "name": "India Gate",
    "nameHi": "इंडिया गेट (India Gate)",
    "nameGu": "इंडिया गेट (India Gate)",
    "latitude": 28.6129,
    "longitude": 77.2295,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/India_Gate_in_New_Delhi_03-2016.jpg/800px-India_Gate_in_New_Delhi_03-2016.jpg",
    "openingHours": "Open 24 hours. Illuminated daily from 7:00 PM – 10:00 PM. Adjacent to National War Memorial.",
    "rating": 4.8,
    "shortDescription": "Dedicated to 84,000 soldiers of the British Indian Army who made the supreme sacrifice in the First World War (1914–1918) and the Third Angl..."
  },
  {
    "id": "p-lotus-temple",
    "name": "Lotus Temple",
    "nameHi": "लोटस टेम्पल (Lotus Temple)",
    "nameGu": "लोटस टेम्पल (Lotus Temple)",
    "latitude": 28.5535,
    "longitude": 77.2588,
    "category": "heritage",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Lotus_Temple_in_the_evening.jpg/800px-Lotus_Temple_in_the_evening.jpg",
    "openingHours": "9:00 AM – 5:30 PM (Winter) / 7:00 PM (Summer). Closed Mondays. Silence strictly observed inside sanctum.",
    "rating": 4.8,
    "shortDescription": "A monument to the oneness of humanity and universal worship, conceived in the form of an opening Sacred Lotus (Nelumbo nucifera). Designed b..."
  },
  {
    "id": "p-sinhagad-fort",
    "name": "Sinhagad Fort",
    "nameHi": "सिंहगड किल्ला (Sinhagad Fort)",
    "nameGu": "सिंहगड किल्ला (Sinhagad Fort)",
    "latitude": 18.3663,
    "longitude": 73.7558,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Sinhagad_Fort_Kalyan_Darwaja.jpg/800px-Sinhagad_Fort_Kalyan_Darwaja.jpg",
    "openingHours": "6:00 AM – 6:00 PM daily. Excellent monsoon trekking. Traditional Kanda Bhaji and Pitla Bhakri served by local villagers atop fort.",
    "rating": 4.8,
    "shortDescription": "Site of the legendary Battle of Sinhagad (February 1670), where Maratha subedar Tanaji Malusare scaled the sheer, near-vertical southern cli..."
  },
  {
    "id": "p-pratapgad-fort",
    "name": "Pratapgad Fort",
    "nameHi": "प्रतापगड किल्ला (Pratapgad Fort)",
    "nameGu": "प्रतापगड किल्ला (Pratapgad Fort)",
    "latitude": 17.9272,
    "longitude": 73.5794,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Pratapgad_Fort_overview.jpg/800px-Pratapgad_Fort_overview.jpg",
    "openingHours": "6:00 AM – 6:00 PM. High rain during monsoons. Guides available at the base village.",
    "rating": 4.8,
    "shortDescription": "Famed for the fateful encounter on November 10, 1659, between Chhatrapati Shivaji Maharaj and Bijapur general Afzal Khan. When Afzal Khan at..."
  },
  {
    "id": "p-murud-janjira-fort",
    "name": "Murud-Janjira Fort",
    "nameHi": "मुरुड-जंजिरा किल्ला (Murud-Janjira)",
    "nameGu": "मुरुड-जंजिरा किल्ला (Murud-Janjira)",
    "latitude": 18.3005,
    "longitude": 72.9644,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Murud_Janjira_Sea_Fort.jpg/800px-Murud_Janjira_Sea_Fort.jpg",
    "openingHours": "7:00 AM – 5:30 PM (Subject to ocean tide schedules). Reached exclusively by local sailboat ferries from Rajapuri jetty. Closed during heavy monsoon squalls (June to August).",
    "rating": 4.8,
    "shortDescription": "Considered the only unconquered sea fort along India's western coastline. Resisted repeated amphibious and land sieges by the Marathas under..."
  },
  {
    "id": "p-mehrangarh-fort",
    "name": "Mehrangarh Fort",
    "nameHi": "मेहरानगढ़ दुर्ग (Mehrangarh Fort)",
    "nameGu": "मेहरानगढ़ दुर्ग (Mehrangarh Fort)",
    "latitude": 26.2978,
    "longitude": 73.0185,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Mehrangarh_Fort_in_Jodhpur%2C_Rajasthan.jpg/800px-Mehrangarh_Fort_in_Jodhpur%2C_Rajasthan.jpg",
    "openingHours": "9:00 AM – 5:00 PM daily. Elevator service available to the top museum deck. Audio guides in 12 languages. Zip-lining (Flying Fox) tours operate across fort battlements.",
    "rating": 4.8,
    "shortDescription": "Founded in 1459 by Rao Jodha atop Bhakurcheeria ('Mountain of Birds'). Cannonball marks from attacking Jaipur forces are still visible near ..."
  },
  {
    "id": "p-jaisalmer-fort",
    "name": "Jaisalmer Fort",
    "nameHi": "जैसलमेर दुर्ग (Sonar Qila)",
    "nameGu": "जैसलमेर दुर्ग (Sonar Qila)",
    "latitude": 26.9124,
    "longitude": 70.9127,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Jaisalmer_Fort_at_Dusk.jpg/800px-Jaisalmer_Fort_at_Dusk.jpg",
    "openingHours": "Open 24 hours (living fort). Museum timings: 9:00 AM – 6:00 PM. Walking tours recommended through narrow cobblestone alleys.",
    "rating": 4.8,
    "shortDescription": "One of the world's very few fully inhabited 'living forts'. It glows with a brilliant honey-gold hue in desert sunlight, earning the sobriqu..."
  },
  {
    "id": "p-bhujia-fort-hill-citadel",
    "name": "Bhujia Fort & Hill Citadel",
    "nameHi": "ભુજિયો કિલ્લો (Bhujia Killo)",
    "nameGu": "ભુજિયો કિલ્લો (Bhujia Killo)",
    "latitude": 23.2458,
    "longitude": 69.6914,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Bhujia_Fort_Bhuj.jpg/800px-Bhujia_Fort_Bhuj.jpg",
    "openingHours": "6:00 AM – 7:00 PM. Steep climb of ~600 steps. Annual festive fair held on Nag Panchami (Shravan month).",
    "rating": 4.8,
    "shortDescription": "Constructed to safeguard Bhuj from marauding Mughal viceroys and bandit raids. Played a dramatic role in 1723 when Sher Buland Khan, Mughal ..."
  },
  {
    "id": "p-diu-fort",
    "name": "Diu Fort",
    "nameHi": "દીવ કિલ્લો (Diu Fort)",
    "nameGu": "દીવ કિલ્લો (Diu Fort)",
    "latitude": 20.7139,
    "longitude": 70.9942,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Diu_Fort_Light_House.jpg/800px-Diu_Fort_Light_House.jpg",
    "openingHours": "8:00 AM – 6:00 PM. Sweeping 360-degree views of the Arabian Sea. Cool sea breezes even in midday.",
    "rating": 4.8,
    "shortDescription": "Built following an alliance between Bahadur Shah, Sultan of Gujarat, and the Portuguese against Mughal Emperor Humayun in 1535. Survived epi..."
  },
  {
    "id": "p-idar-fort",
    "name": "Idar Fort",
    "nameHi": "ઈડરિયો ગઢ (Idargadh)",
    "nameGu": "ઈડરિયો ગઢ (Idargadh)",
    "latitude": 23.8344,
    "longitude": 73.0033,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Idar_gadh_step_entrance.jpg/800px-Idar_gadh_step_entrance.jpg",
    "openingHours": "6:00 AM – 6:00 PM daily. Excellent boulder hiking and photography of weathered granite formations.",
    "rating": 4.8,
    "shortDescription": "Celebrated in Gujarati folklore and proverbs ('Idario Gadh Jitya' - 'Conquering the unconquerable fort of Idar'). Perched amid colossal natu..."
  },
  {
    "id": "p-kanthkot-fort",
    "name": "Kanthkot Fort",
    "nameHi": "કંથકોટનો કિલ્લો (Kanthkot Fort)",
    "nameGu": "કંથકોટનો કિલ્લો (Kanthkot Fort)",
    "latitude": 23.4833,
    "longitude": 70.5167,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Kanthkot_Fort_ruins.jpg/800px-Kanthkot_Fort_ruins.jpg",
    "openingHours": "Sunrise to Sunset. Remote site; 4x4 or sturdy vehicle recommended. Fascinating for archaeology enthusiasts.",
    "rating": 4.8,
    "shortDescription": "Historic refuge of Solanki King Bhima I when Mahmud of Ghazni invaded Gujarat in 1025 CE. Built atop a flat, isolated tableland surrounded b..."
  },
  {
    "id": "p-roha-fort",
    "name": "Roha Fort",
    "nameHi": "રોહા કિલ્લો (Roha Fort)",
    "nameGu": "રોહા કિલ્લો (Roha Fort)",
    "latitude": 23.2,
    "longitude": 69.0333,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Roha_Fort_Kutch.jpg/800px-Roha_Fort_Kutch.jpg",
    "openingHours": "Sunrise to Sunset. Quiet, atmospheric ruins with panoramic views of the Western Kutch expanse.",
    "rating": 4.8,
    "shortDescription": "Famed for tragic valor where 120 Sumra Rajput princesses committed Jauhar to protect their honor during invasions. In modern times, celebrat..."
  },
  {
    "id": "p-kangra-fort",
    "name": "Kangra Fort",
    "nameHi": "कांगड़ा किला (Kangra Fort)",
    "nameGu": "कांगड़ा किला (Kangra Fort)",
    "latitude": 32.0998,
    "longitude": 76.257,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kangra_Fort_Overview.jpg/800px-Kangra_Fort_Overview.jpg",
    "openingHours": "9:00 AM – 6:00 PM. High-tech audio guide available in the Maharaja Sansar Chandra Museum at base.",
    "rating": 4.8,
    "shortDescription": "Recognized as the oldest dated fort in India, tracing lineage to the Trigarta Kingdom mentioned in the Mahabharata. Guarded immense treasure..."
  },
  {
    "id": "p-fort-aguada-lighthouse",
    "name": "Fort Aguada & Lighthouse",
    "nameHi": "Fort Aguada (Forte da Aguada)",
    "nameGu": "Fort Aguada (Forte da Aguada)",
    "latitude": 15.492,
    "longitude": 73.7736,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Aguada_Fort_Lighthouse_Goa.jpg/800px-Aguada_Fort_Lighthouse_Goa.jpg",
    "openingHours": "9:30 AM – 6:00 PM. High vantage point for viewing dolphins in the Mandovi estuary.",
    "rating": 4.8,
    "shortDescription": "Named after the Portuguese word 'Água' (water) because ocean-going galleons docked here to replenish their freshwater supplies from natural ..."
  },
  {
    "id": "p-bidar-fort-mahmud-gawan-citadel",
    "name": "Bidar Fort & Mahmud Gawan Citadel",
    "nameHi": "ಬೀದರ್ ಕೋಟೆ (Bidar Fort)",
    "nameGu": "ಬೀದರ್ ಕೋಟೆ (Bidar Fort)",
    "latitude": 17.9255,
    "longitude": 77.5303,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Bidar_Fort_Entrance_Gate.jpg/800px-Bidar_Fort_Entrance_Gate.jpg",
    "openingHours": "8:00 AM – 6:30 PM. Free entry. Bidriware silver inlay artisan workshops located in nearby Bidar old city.",
    "rating": 4.8,
    "shortDescription": "Ahmad Shah Wali relocated the Bahmani capital from Gulbarga to Bidar in 1428. Renowned for its unique 'Karez' subterranean canal network eng..."
  },
  {
    "id": "p-chitradurga-fort",
    "name": "Chitradurga Fort",
    "nameHi": "ಚಿತ್ರದುರ್ಗದ ಕೋಟೆ (Chitradurga Fort)",
    "nameGu": "ಚಿತ್ರದುರ್ಗದ ಕೋಟೆ (Chitradurga Fort)",
    "latitude": 14.2185,
    "longitude": 76.3986,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Chitradurga_Fort_Gates.jpg/800px-Chitradurga_Fort_Gates.jpg",
    "openingHours": "6:00 AM – 5:30 PM daily. Requires 3-4 hours of walking across granite steps. Excellent rainwater conservation models.",
    "rating": 4.8,
    "shortDescription": "Never taken by frontal military assault due to its 7 concentric labyrinthine rings. Site of the famous 1779 siege by Hyder Ali: when soldier..."
  },
  {
    "id": "p-rohtasgarh-fort",
    "name": "Rohtasgarh Fort",
    "nameHi": "रोहतासगढ़ किला (Rohtasgarh Fort)",
    "nameGu": "रोहतासगढ़ किला (Rohtasgarh Fort)",
    "latitude": 24.6289,
    "longitude": 83.9169,
    "category": "fort",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Rohtasgarh_Fort_Man_Singh_Palace.jpg/800px-Rohtasgarh_Fort_Man_Singh_Palace.jpg",
    "openingHours": "6:00 AM – 5:00 PM. High trekking destination across scenic Kaimur plateau.",
    "rating": 4.8,
    "shortDescription": "One of the largest hill fortresses in the world by plateau area. Captured with strategic subterfuge by Sher Shah Suri in 1538 by sending arm..."
  }
];

export const HERITAGE_RECORDS = [
  {
    "placeId": "p1-laxmi-vilas",
    "shortStory": "Built in 1890 by Maharaja Sayajirao Gaekwad III, Laxmi Vilas Palace is a triumph of Indo-Saracenic architecture. Spanning over 500 acres, this palace is four times the size of Buckingham Palace. It was designed by Major Charles Mant and features an extraordinary blend of Hindu, Mughal, and Gothic elements. The Darbar Hall boasts Venetian mosaic flooring, Belgium stained-glass windows, and intricate woodwork. The palace still serves as the residence of the Vadodara royal family, making it one of the largest private residences in the world.",
    "history": "Commissioned in 1890 by Maharaja Sayajirao Gaekwad III, one of the most progressive rulers in Indian history. Designed by architect Major Charles Mant and completed by R.F. Chisholm after Mant's death. Cost ₹60 lakh at the time. Equipped with modern amenities rare for its era, including elevators and an internal telephone exchange.",
    "significance": "Symbolizes the golden age of the Baroda State under Sayajirao III. Represents one of the finest examples of Indo-Saracenic architecture in India, reflecting the Gaekwads' patronship of art, culture, and progress.",
    "architecture": "Indo-Saracenic style blending Indian Mughal and Rajput features with European Gothic and Renaissance elements. Built using Agra red sandstone, Rajasthani marble, and local trap rock.",
    "keyFacts": [
      "Built: 1890 by Maharaja Sayajirao III",
      "Size: 500 acres — 4x Buckingham Palace",
      "Architect: Major Charles Mant & R.F. Chisholm",
      "Darbar Hall has Belgian stained glass and Venetian mosaic floors",
      "Still the residence of the Gaekwad royal family"
    ],
    "period": "Late 19th century (1890)"
  },
  {
    "placeId": "p2-baroda-museum",
    "shortStory": "Founded in 1894 by Maharaja Sayajirao Gaekwad III, the Baroda Museum & Picture Gallery is modeled on London's Victoria & Albert Museum. It houses an astonishing collection ranging from a 22-meter blue whale skeleton to rare Mughal miniature paintings, Greco-Roman sculptures, and original European oil paintings by masters like Turner and Constable. The museum is a testament to Sayajirao's vision of bringing world culture to the people of Gujarat.",
    "history": "Established in 1894; Picture Gallery added in 1914. Designed by Major Mant and R.F. Chisholm in Indo-Saracenic style. Sayajirao III traveled the world collecting artifacts specifically to educate the citizens of Baroda.",
    "significance": "One of India's most important regional museums, preserving over 100,000 artifacts across art, archaeology, natural history, and ethnology.",
    "keyFacts": [
      "Founded: 1894 by Sayajirao III",
      "Houses 22-meter blue whale skeleton",
      "Picture Gallery holds European master paintings (Turner, Constable)",
      "Over 100,000 artifacts in collection",
      "Modeled after London's Victoria & Albert Museum"
    ],
    "period": "Late 19th - Early 20th century (1894-1914)",
    "architecture": "Historic regional architecture with authentic period craftsmanship."
  },
  {
    "placeId": "p3-kirti-mandir",
    "shortStory": "Kirti Mandir, or the 'Temple of Fame', was built in 1936 by Maharaja Sayajirao III to commemorate the diamond jubilee of his reign and honor his ancestors. The E-shaped building features balconies, terraces, and a central shikhara reaching 35 meters, decorated with motifs from Hindu mythology. The interior walls feature murals by the renowned artist Nandalal Bose, depicting scenes from the Mahabharata, the life of Mirabai, and the history of the Gaekwad dynasty.",
    "history": "Constructed in 1936 during the diamond jubilee celebrations of Maharaja Sayajirao Gaekwad III. Serves as the family memorial and cenotaph (chhatri) of the Gaekwad dynasty.",
    "significance": "Cultural and spiritual landmark preserving the memory of the Gaekwad rulers. Houses priceless murals by Nandalal Bose, a pioneer of modern Indian art.",
    "keyFacts": [
      "Built: 1936 (Diamond Jubilee of Sayajirao III)",
      "Shikhara height: 35 meters",
      "Murals by legendary artist Nandalal Bose",
      "E-shaped architectural layout",
      "Family memorial of the Gaekwads"
    ],
    "period": "1936 (20th century)",
    "architecture": "Historic regional architecture with authentic period craftsmanship."
  },
  {
    "placeId": "p4-eme-temple",
    "shortStory": "The EME Temple, formally known as the Dakshinamurthy Temple, is a remarkable modern structure built in 1966 by the Corps of Electrical and Mechanical Engineers of the Indian Army. What makes it extraordinary is its aluminum geodesic dome and its synthesis of multiple religious traditions: the kalasha represents Hinduism, the dome symbolizes Islam, the tower structure reflects Christianity, the golden tower top honors Buddhism, and the open architecture draws from Jainism. It is dedicated to Lord Shiva as Dakshinamurthy (the supreme teacher).",
    "history": "Built in 1966 under the guidance of Christian general Major General Harkirat Singh and designed by the Indian Army's EME Corps. The concept was to create a place of worship embodying the secular, inclusive spirit of the Indian Armed Forces.",
    "significance": "A symbol of religious harmony and modern Indian architecture. It is one of the very few geodesic dome temples in the world.",
    "keyFacts": [
      "Built: 1966 by the Indian Army EME Corps",
      "Unique aluminum geodesic dome",
      "Synthesizes elements from 5 major world religions",
      "Dedicated to Lord Shiva as Dakshinamurthy",
      "Surrounded by lush military cantonment gardens"
    ],
    "period": "1966 (Mid-20th century)",
    "architecture": "Historic regional architecture with authentic period craftsmanship."
  },
  {
    "placeId": "p5-sursagar",
    "shortStory": "Sursagar Lake, also known as Chand Talao, is an ancient water reservoir that has been the beating heart of Vadodara for centuries. In 2002, a magnificent 120-foot statue of Lord Shiva was installed at its center, which is illuminated with golden light every evening. The lake was rebuilt with stone masonry banks during the Gaekwad era and features underground water channels dating back to the 18th century.",
    "history": "Originally constructed in the medieval era and fortified with stone embankments by the Gaekwads. Reconstructed under Maharaja Sayajirao III with sluice gates to regulate floodwaters.",
    "significance": "Center of religious celebrations in Vadodara, especially Maha Shivratri when thousands gather around the lake for the grand aarti.",
    "keyFacts": [
      "120-foot Lord Shiva statue in the center",
      "Night lighting creates a spectacular golden reflection",
      "Epicenter of Maha Shivratri celebrations",
      "Underground drainage gates prevent city flooding",
      "Historic water reservoir of medieval Baroda"
    ],
    "period": "Medieval origin, rebuilt 18th-19th century",
    "architecture": "Historic regional architecture with authentic period craftsmanship."
  },
  {
    "placeId": "p6-sayaji-baug",
    "shortStory": "Spanning 113 acres along the Vishwamitri River, Sayaji Baug was gifted to the citizens of Vadodara in 1879 by Maharaja Sayajirao Gaekwad III. It is the largest public garden in western India, home to over 98 species of trees, a zoo, a planetarium, a toy train, and the Baroda Museum & Picture Gallery. Sayajirao believed public parks were essential for the health and culture of his people.",
    "history": "Established in 1879 by Sayajirao III. The zoo was added in 1879 and the floral clock—one of the few in India—was installed in the 20th century.",
    "significance": "A premier public park exemplifying enlightened civic planning in princely India. Major green lung and recreational center of Vadodara.",
    "keyFacts": [
      "Spans 113 acres along the Vishwamitri River",
      "Over 98 tree species from around the world",
      "Features a working floral clock",
      "Includes Sardar Patel Planetarium and mini zoo",
      "Gifted to the city by Sayajirao III in 1879"
    ],
    "period": "Established 1879",
    "architecture": "Historic regional architecture with authentic period craftsmanship."
  },
  {
    "placeId": "p7-nyay-mandir",
    "shortStory": "Nyay Mandir, meaning 'Temple of Justice', was designed by Robert Fellowes Chisholm and inaugurated in 1896. Originally conceived as a vegetable market, Maharaja Sayajirao III transformed it into the central courthouse to symbolize the sanctity of the law. The building features an Indo-Saracenic clock tower, Italian marble arcades, and a central statue of Maharani Chimnabai I.",
    "history": "Completed in 1896 by architect R.F. Chisholm. Served as the District Court of Vadodara for over a century until courts moved to a new complex in 2018.",
    "significance": "Iconic civic monument representing the progressive judicial reforms introduced by Sayajirao III in the princely state of Baroda.",
    "keyFacts": [
      "Completed in 1896 by architect R.F. Chisholm",
      "Indo-Saracenic clock tower with Gothic arches",
      "Central statue of Maharani Chimnabai I",
      "Served as the District Court for over 120 years",
      "Key architectural landmark of Old Vadodara"
    ],
    "period": "1896 (Late 19th century)",
    "architecture": "Historic regional architecture with authentic period craftsmanship."
  },
  {
    "placeId": "p8-makarpura-palace",
    "shortStory": "Makarpura Palace was built in 1870 by Khanderao Gaekwad as a summer retreat and hunting lodge, then extensively expanded and remodeled in Italian Renaissance style by Sayajirao III in 1890. Surrounded by ornate Italianate gardens with fountains and pergolas, it was one of the most stylish royal retreats in western India. Today it is maintained by the Indian Air Force as an officer training facility.",
    "history": "First built by Khanderao in 1870; remodeled by Sayajirao III in 1890 with architect R.F. Chisholm. Handed over to the Indian Air Force after independence.",
    "significance": "A rare example of pure Italian Renaissance palace architecture in western India, reflecting the cosmopolitan tastes of the Gaekwads.",
    "keyFacts": [
      "Built: 1870, expanded 1890",
      "Italian Renaissance architectural style",
      "Ornate fountains and Renaissance gardens",
      "Summer residence of the Gaekwad Maharajas",
      "Now maintained as an Indian Air Force installation"
    ],
    "period": "1870-1890 (Late 19th century)",
    "architecture": "Historic regional architecture with authentic period craftsmanship."
  },
  {
    "placeId": "p9-qutbuddin-tomb",
    "shortStory": "Hazira Maqbara is the 16th-century tomb of Qutbuddin Muhammad Khan, the governor of Gujarat and maternal uncle of Emperor Akbar's son, Prince Salim (later Emperor Jahangir). Built in typical Mughal style with red sandstone and brick masonry, it features an octagonal chamber, high arched openings, and delicate jali screens. It is the most prominent Mughal-period monument in Vadodara.",
    "history": "Built in 1586 following the death of Qutbuddin Muhammad Khan during the Mughal conquest of Gujarat. Qutbuddin served as tutor (ataliq) to Prince Salim.",
    "significance": "One of the very few surviving high-Mughal funerary monuments in central Gujarat, showing architectural connections to the tombs of Delhi and Agra.",
    "keyFacts": [
      "Built: 1586 during Emperor Akbar's reign",
      "Mausoleum of tutor to Emperor Jahangir",
      "Octagonal Mughal tomb design",
      "Intricate stone jali work and arched verandahs",
      "Centrally protected ASI monument"
    ],
    "period": "1586 (Late 16th century)",
    "architecture": "Historic regional architecture with authentic period craftsmanship."
  },
  {
    "placeId": "p10-tambekar-wada",
    "shortStory": "Tambekar Wada is a four-storey Maratha townhouse (wada) that belonged to Bhaskar Ramchandra Tambekar, the Diwan (Prime Minister) of Baroda State in the mid-19th century. The interior walls and ceilings are covered with breathtaking 19th-century tempera murals depicting scenes from the Mahabharata, the Ramayana, the life of Krishna, and Anglo-Maratha battles with soldiers in colonial uniforms.",
    "history": "Constructed in the mid-19th century by Diwan Bhaskar Tambekar. Restored by the Archaeological Survey of India (ASI) to preserve its rare folk murals.",
    "significance": "Houses the finest surviving collection of 19th-century Maratha wall paintings in Gujarat, bridging traditional Indian miniature styles with European influences.",
    "keyFacts": [
      "Mid-19th century Maratha mansion",
      "Priceless 150-year-old tempera wall murals",
      "Depicts scenes from Mahabharata and Krishna Leela",
      "Includes historic scenes of Anglo-Maratha wars",
      "Protected by Archaeological Survey of India"
    ],
    "period": "Mid-19th century (c. 1850)",
    "architecture": "Historic regional architecture with authentic period craftsmanship."
  },
  {
    "placeId": "p11-champaner",
    "shortStory": "The Champaner-Pavagadh Archaeological Park is a UNESCO World Heritage Site located 45 km from Vadodara. It contains the ruins of the only complete and unchanged Islamic pre-Mughal city in India, founded by Sultan Mahmud Begada in the late 15th century. Spanning over 1,300 hectares from the plains to the summit of Pavagadh Hill, the site includes palaces, mosques, tombs, stepwells, fortresses, and the revered Kalika Mata Temple.",
    "history": "Settled since the 8th century by Chavda Rajputs; captured in 1484 by Sultan Mahmud Begada who made it his capital (Muhammadabad). Inscribed as a UNESCO World Heritage Site in 2004.",
    "significance": "A rare cultural landscape where ancient Hindu and Jain sacred geography merges with exquisite Indo-Islamic urban architecture.",
    "keyFacts": [
      "UNESCO World Heritage Site (Inscribed 2004)",
      "Over 114 monument structures cataloged",
      "Spans 1,329 hectares across Pavagadh Hill and plains",
      "Capital of Gujarat Sultanate under Mahmud Begada",
      "Sacred pilgrimage site of Kalika Mata"
    ],
    "period": "8th to 16th century (Peak: 1484-1536)",
    "architecture": "Historic regional architecture with authentic period craftsmanship."
  },
  {
    "placeId": "p12-jama-masjid-champaner",
    "shortStory": "The Jama Masjid at Champaner is widely regarded as one of the finest mosques in India and a masterpiece of medieval architecture. Built by Sultan Mahmud Begada in the late 15th century, this mosque is extraordinary for its unique fusion of Islamic and Hindu-Jain architectural traditions. Its two soaring minarets, exquisitely carved stone jali screens, and grand prayer hall create an atmosphere of profound beauty and serenity.",
    "history": "Built during the reign of Sultan Mahmud Begada (r. 1458-1511) when Champaner served as the capital of the Gujarat Sultanate. It served as the primary congregational mosque for the entire city.",
    "significance": "The Jama Masjid exemplifies the cultural synthesis that occurred in Gujarat during the Sultanate period. It is considered one of the most beautiful examples of Indian-Islamic architecture.",
    "keyFacts": [
      "Built by: Sultan Mahmud Begada (late 15th century)",
      "Part of UNESCO World Heritage Site",
      "Unique Hindu-Jain-Islamic architectural fusion",
      "Features: Two tall minarets, intricate jali screens",
      "Grand prayer hall with 172 pillars"
    ],
    "period": "Late 15th century",
    "architecture": "Historic regional architecture with authentic period craftsmanship."
  },
  {
    "placeId": "p13-nazarbaug-palace",
    "shortStory": "Nazarbaug Palace was constructed in 1721 by Malhar Rao Gaekwad. Renowned for its white stucco neoclassical design and housing the legendary Baroda Pearl Carpet and Gaekwad jewels.",
    "history": "Built as an urban palace in the heart of Mandvi, Nazarbaug Palace featured four storeys of European and Maratha neoclassical architecture. It historically housed the legendary Gaekwad treasury including the Star of the South diamond (128 carats) and the English Dresden diamond.",
    "significance": "A testament to early 18th-century royal residential architecture and historical royal court regalia in Gujarat.",
    "architecture": "Neoclassical Italianate facade with classical Greek porticos and Venetian shuttered balconies.",
    "keyFacts": [
      "Built: 1721 CE by Malhar Rao Gaekwad",
      "Style: Neoclassical Italianate & Maratha Royal Court",
      "Famous for: Housed the 128-carat Star of the South diamond",
      "Location: Mandvi, Vadodara, Gujarat"
    ],
    "period": "1721 CE (18th Century)"
  },
  {
    "placeId": "p14-khanderao-market",
    "shortStory": "Khanderao Market is a grand heritage municipal building constructed in 1906 by Maharaja Sayajirao Gaekwad III as a gift to the city on the silver jubilee of his administration.",
    "history": "Designed by British architect Robert Chisholm in an exuberant Indo-Saracenic revival style. Today it serves both as the headquarters of the Vadodara Municipal Corporation (VMC) and a vibrant, bustling daily market.",
    "significance": "One of India's earliest purpose-built municipal civic markets, reflecting Sayajirao's visionary civic infrastructure.",
    "architecture": "Indo-Saracenic Revival with Gujarati Hindu motifs, domed corner pavilions, and ornate stone clock tower.",
    "keyFacts": [
      "Built: 1906 CE by Maharaja Sayajirao Gaekwad III",
      "Architect: Robert Fellowes Chisholm",
      "Style: Indo-Saracenic Revival",
      "Function: City Municipal Headquarters & Heritage Bazaar"
    ],
    "period": "1906 CE (20th Century)"
  },
  {
    "placeId": "p15-mandvi-gate",
    "shortStory": "Mandvi Gate is the historic central north gate of the walled citadel of Vadodara, built during the Sultanate era and later rebuilt by Damaji Rao Gaekwad in 1736 CE.",
    "history": "During the Gujarat Sultanate and Mughal period, Mandvi was the collection center for customs tolls and merchant duties (Mandapa). It was illuminated with oil lamps on festive nights, a tradition continuing to this day during Diwali.",
    "significance": "The geographical and historical epicenter of historic Vadodara's fortified walled city.",
    "architecture": "Sultanate arched gateway with subsequent Maratha wooden canopy pavilions and three-tiered arched passageways.",
    "keyFacts": [
      "Built: 15th Century Sultanate; Rebuilt 1736 CE by Damajirao Gaekwad",
      "Style: Gujarat Sultanate & Maratha Fortification",
      "Historical Role: Toll and customs gate for merchants",
      "Location: Mandvi Chowk, Old Walled City, Vadodara"
    ],
    "period": "15th – 18th Century CE"
  },
  {
    "placeId": "IND-HER-01",
    "shortStory": "Commissioned by Emperor Shah Jahan in 1631 in memory of his chief empress Mumtaz Mahal. Employed over 20,000 artisans under chief architect Ustad Ahmad Lahori. The complex embodies the Islamic concept of the gardens of paradise (Rawda) with an octagonal central chamber, acoustic dome resonance, and flawless bilateral symmetry flanked by the river Yamuna.",
    "history": "Built during 1632 – 1648 CE (17th Century) under Mughal Empire (Emperor Shah Jahan). Construction: Makrana Pure White Marble, Red Sandstone (Outbuildings), 43 types of Inlaid Gemstones (Parchin Kari). Style: Mughal Classical Architecture (Symmetrical Charbagh with Bilateral Axis).",
    "significance": "Taj Mahal is a prominent heritage landmark in Uttar Pradesh. ASI Ref: N-UP-A28, UNESCO Status: 252 (Inscribed 1983).",
    "architecture": "Style: Mughal Classical Architecture (Symmetrical Charbagh with Bilateral Axis). Construction Materials: Makrana Pure White Marble, Red Sandstone (Outbuildings), 43 types of Inlaid Gemstones (Parchin Kari). Dimensions: Height: 73 m (240 ft); Complex Area: 17 hectares (42 acres); Plinth: 95m x 95m.",
    "keyFacts": [
      "Ruler / Dynasty: Mughal Empire (Emperor Shah Jahan)",
      "Period: 1632 – 1648 CE (17th Century)",
      "Architectural Style: Mughal Classical Architecture (Symmetrical Charbagh with Bilateral Axis)",
      "Location: Agra District, Agra, Uttar Pradesh",
      "ASI Reference: N-UP-A28",
      "UNESCO: 252 (Inscribed 1983)"
    ],
    "period": "1632 – 1648 CE (17th Century)"
  },
  {
    "placeId": "IND-HER-02",
    "shortStory": "Commenced by Qutb-ud-din Aibak in 1192 following Muhammad Ghori's victory at Tarain. Completed by Iltutmish and restored by Firoz Shah Tughlaq after a 1368 lightning strike. Decorated with intricate calligraphic Quranic bands and honeycomb stalactite (muqarnas) bracket supports beneath each balcony.",
    "history": "Built during 1192 – 1368 CE (12th-14th Century) under Delhi Sultanate (Qutb-ud-din Aibak, Iltutmish, Firoz Shah Tughlaq). Construction: Chiseled Red Sandstone, Buff Sandstone, White Marble (top two storeys). Style: Indo-Islamic Ghurid Fluted Architecture.",
    "significance": "Qutub Minar & Monument Complex is a prominent heritage landmark in Delhi. ASI Ref: N-DL-1, UNESCO Status: 607 (Inscribed 1993).",
    "architecture": "Style: Indo-Islamic Ghurid Fluted Architecture. Construction Materials: Chiseled Red Sandstone, Buff Sandstone, White Marble (top two storeys). Dimensions: Height: 72.5 m (238 ft); Base Diameter: 14.3 m; Top Diameter: 2.7 m; 379 Steps.",
    "keyFacts": [
      "Ruler / Dynasty: Delhi Sultanate (Qutb-ud-din Aibak, Iltutmish, Firoz Shah Tughlaq)",
      "Period: 1192 – 1368 CE (12th-14th Century)",
      "Architectural Style: Indo-Islamic Ghurid Fluted Architecture",
      "Location: South Delhi, Mehrauli, Delhi",
      "ASI Reference: N-DL-1",
      "UNESCO: 607 (Inscribed 1993)"
    ],
    "period": "1192 – 1368 CE (12th-14th Century)"
  },
  {
    "placeId": "IND-HER-03",
    "shortStory": "Constructed when Shah Jahan relocated the capital from Agra to Shahjahanabad. Surrounded by deep defensive moats once fed by the Yamuna River. Served as the seat of Mughal governance until 1857. Captured by the British after the Revolt of 1857, who converted large palace barracks into military cantonments. Today serves as the venue for the Prime Minister's Independence Day address.",
    "history": "Built during 1639 – 1648 CE (17th Century) under Mughal Empire (Emperor Shah Jahan). Construction: Red Sikri Sandstone, White Makrana Marble, Enamelled Ceramic Tiles, Gilded Copper. Style: High Mughal Imperial Citadel Architecture.",
    "significance": "Red Fort (Lal Qila) is a prominent heritage landmark in Delhi. ASI Ref: N-DL-2, UNESCO Status: 1054 (Inscribed 2007).",
    "architecture": "Style: High Mughal Imperial Citadel Architecture. Construction Materials: Red Sikri Sandstone, White Makrana Marble, Enamelled Ceramic Tiles, Gilded Copper. Dimensions: Perimeter: 2.41 km; Wall Height: 18m to 33m; Enclosed Area: 254.67 acres.",
    "keyFacts": [
      "Ruler / Dynasty: Mughal Empire (Emperor Shah Jahan)",
      "Period: 1639 – 1648 CE (17th Century)",
      "Architectural Style: High Mughal Imperial Citadel Architecture",
      "Location: Central Delhi, Old Delhi, Delhi",
      "ASI Reference: N-DL-2",
      "UNESCO: 1054 (Inscribed 2007)"
    ],
    "period": "1639 – 1648 CE (17th Century)"
  },
  {
    "placeId": "IND-HER-04",
    "shortStory": "First substantial example of Mughal architecture in India and direct architectural precursor to the Taj Mahal. Designed by Persian architect Mirak Mirza Ghiyas. Features the first Indian use of a high double-dome with kiosks (chhatris). In September 1857, the last Mughal Emperor Bahadur Shah Zafar was captured here by Captain William Hodson.",
    "history": "Built during 1565 – 1572 CE (16th Century) under Mughal Empire (Empress Bega Begum / Akbar). Construction: Red Sandstone trimmed with White Marble, Yellow Sandstone, Quartzite rubble masonry. Style: Early Mughal Timurid-Persian Synthesis.",
    "significance": "Humayun's Tomb Complex is a prominent heritage landmark in Delhi. ASI Ref: N-DL-5, UNESCO Status: 232 (Inscribed 1993).",
    "architecture": "Style: Early Mughal Timurid-Persian Synthesis. Construction Materials: Red Sandstone trimmed with White Marble, Yellow Sandstone, Quartzite rubble masonry. Dimensions: Height: 47 m (154 ft); Width: 91 m plinth; Garden: 30 acres divided into 36 Charbagh squares.",
    "keyFacts": [
      "Ruler / Dynasty: Mughal Empire (Empress Bega Begum / Akbar)",
      "Period: 1565 – 1572 CE (16th Century)",
      "Architectural Style: Early Mughal Timurid-Persian Synthesis",
      "Location: South East Delhi, Nizamuddin East, Delhi",
      "ASI Reference: N-DL-5",
      "UNESCO: 232 (Inscribed 1993)"
    ],
    "period": "1565 – 1572 CE (16th Century)"
  },
  {
    "placeId": "IND-HER-05",
    "shortStory": "Founded by Akbar in honour of Sufi saint Sheikh Salim Chishti who blessed him with an heir (Prince Salim/Jahangir). Served as Mughal imperial capital for 14 years before being abandoned in 1585 due to severe water shortages and military campaigns in the northwest. The Diwan-i-Khas contains a single stone pillar with 36 serpentine brackets where Akbar held multi-faith philosophical debates (Ibadat Khana).",
    "history": "Built during 1571 – 1585 CE (16th Century) under Mughal Empire (Emperor Akbar the Great). Construction: Chiselled Sikri Red Sandstone, White Marble (Tomb of Salim Chishti). Style: Akbari Syncretic (Indo-Persian & Gujarati Hindu timber-stone carving).",
    "significance": "Fatehpur Sikri Imperial Citadel is a prominent heritage landmark in Uttar Pradesh. ASI Ref: N-UP-A25, UNESCO Status: 255 (Inscribed 1986).",
    "architecture": "Style: Akbari Syncretic (Indo-Persian & Gujarati Hindu timber-stone carving). Construction Materials: Chiselled Sikri Red Sandstone, White Marble (Tomb of Salim Chishti). Dimensions: Fortified ridge perimeter: 11 km; Buland Darwaza Height: 54 m (177 ft).",
    "keyFacts": [
      "Ruler / Dynasty: Mughal Empire (Emperor Akbar the Great)",
      "Period: 1571 – 1585 CE (16th Century)",
      "Architectural Style: Akbari Syncretic (Indo-Persian & Gujarati Hindu timber-stone carving)",
      "Location: Agra District, Fatehpur Sikri, Uttar Pradesh",
      "ASI Reference: N-UP-A25",
      "UNESCO: 255 (Inscribed 1986)"
    ],
    "period": "1571 – 1585 CE (16th Century)"
  },
  {
    "placeId": "IND-HER-06",
    "shortStory": "Rediscovered in 1819 by British cavalry officer John Smith during a tiger hunt. The murals illustrate Buddhist Jataka tales using mineral pigments bound with plant sap, exhibiting chiaroscuro lighting effects centuries ahead of European Renaissance. The horseshoe cliff gorge provided monk hermitages strategic acoustic isolation from bustling trade routes linking the Deccan to Ujjain.",
    "history": "Built during 2nd Century BCE – 6th Century CE under Satavahana Dynasty (Phase 1) & Vakataka Dynasty (Harishena, Phase 2). Construction: Monolithic Basaltic Deccan Trap Rock, Organic Tempera Frescoes (Cow dung, clay, rice husk, lapis lazuli pigments). Style: Rock-Cut Buddhist Rock Architecture (Hinayana & Mahayana).",
    "significance": "Ajanta Caves is a prominent heritage landmark in Maharashtra. ASI Ref: W-MH-A1, UNESCO Status: 242 (Inscribed 1983).",
    "architecture": "Style: Rock-Cut Buddhist Rock Architecture (Hinayana & Mahayana). Construction Materials: Monolithic Basaltic Deccan Trap Rock, Organic Tempera Frescoes (Cow dung, clay, rice husk, lapis lazuli pigments). Dimensions: 30 rock-cut caves carved into a 75m high crescent-shaped horseshoe gorge along the Waghur River.",
    "keyFacts": [
      "Ruler / Dynasty: Satavahana Dynasty (Phase 1) & Vakataka Dynasty (Harishena, Phase 2)",
      "Period: 2nd Century BCE – 6th Century CE",
      "Architectural Style: Rock-Cut Buddhist Rock Architecture (Hinayana & Mahayana)",
      "Location: Chhatrapati Sambhaji Nagar (Aurangabad), Maharashtra",
      "ASI Reference: W-MH-A1",
      "UNESCO: 242 (Inscribed 1983)"
    ],
    "period": "2nd Century BCE – 6th Century CE"
  },
  {
    "placeId": "IND-HER-07",
    "shortStory": "Cave 16 (Kailashatha) is the largest monolithic rock sculpture in the world, carved from top to bottom without scaffolding or joined masonry. Over 200,000 tonnes of basalt were chiselled away using simple iron picks and wedges. Demonstrates exceptional religious harmony with 17 Hindu caves, 12 Buddhist caves, and 5 Jain caves co-existing on the same basalt escarpment.",
    "history": "Built during 600 – 1000 CE (7th - 10th Century) under Rashtrakuta Dynasty (King Krishna I for Kailash) & Yadava/Kalachuri. Construction: Monolithic Basalt Cliff (Top-down vertical excavation, Deccan Trap). Style: Dravidian Monolithic Rock-Cut (Multi-Religious: Hindu, Buddhist, Jain).",
    "significance": "Ellora Caves & Kailash Temple is a prominent heritage landmark in Maharashtra. ASI Ref: W-MH-A2, UNESCO Status: 243 (Inscribed 1983).",
    "architecture": "Style: Dravidian Monolithic Rock-Cut (Multi-Religious: Hindu, Buddhist, Jain). Construction Materials: Monolithic Basalt Cliff (Top-down vertical excavation, Deccan Trap). Dimensions: 34 major caves spanning 2 km; Cave 16 (Kailash): 50m long, 33m wide, 30m high; 200,000 tons of rock excavated.",
    "keyFacts": [
      "Ruler / Dynasty: Rashtrakuta Dynasty (King Krishna I for Kailash) & Yadava/Kalachuri",
      "Period: 600 – 1000 CE (7th - 10th Century)",
      "Architectural Style: Dravidian Monolithic Rock-Cut (Multi-Religious: Hindu, Buddhist, Jain)",
      "Location: Chhatrapati Sambhaji Nagar (Aurangabad), Maharashtra",
      "ASI Reference: W-MH-A2",
      "UNESCO: 243 (Inscribed 1983)"
    ],
    "period": "600 – 1000 CE (7th - 10th Century)"
  },
  {
    "placeId": "IND-HER-08",
    "shortStory": "Conceived as a colossal 24-wheeled chariot carrying the Sun God Surya across the heavens, pulled by 7 spirited horses. European mariners called it the 'Black Pagoda' because its dark iron lodestone tower was said to exert magnetic pull on passing ships' navigational compasses. Legend attributes the final stone placement to 12-year-old child prodigy Dharmapada.",
    "history": "Built during 1250 CE (13th Century) under Eastern Ganga Dynasty (King Narasimhadeva I). Construction: Khondalite Sandstone, Chlorite stone doorframes, Iron dowels and magnetic stone lodestone clamps. Style: Kalinga Architecture (Rekha Deula and Pidha Deula).",
    "significance": "Konark Sun Temple (The Black Pagoda) is a prominent heritage landmark in Odisha. ASI Ref: E-OD-1, UNESCO Status: 246 (Inscribed 1984).",
    "architecture": "Style: Kalinga Architecture (Rekha Deula and Pidha Deula). Construction Materials: Khondalite Sandstone, Chlorite stone doorframes, Iron dowels and magnetic stone lodestone clamps. Dimensions: Jagamohana Height: 39 m (128 ft); Original Rekha Deula estimated at 70 m (collapsed); 24 carved stone wheels of 3m diameter.",
    "keyFacts": [
      "Ruler / Dynasty: Eastern Ganga Dynasty (King Narasimhadeva I)",
      "Period: 1250 CE (13th Century)",
      "Architectural Style: Kalinga Architecture (Rekha Deula and Pidha Deula)",
      "Location: Puri District, Konark, Odisha",
      "ASI Reference: E-OD-1",
      "UNESCO: 246 (Inscribed 1984)"
    ],
    "period": "1250 CE (13th Century)"
  },
  {
    "placeId": "IND-HER-09",
    "shortStory": "Constructed during the zenith of Chandela Rajput power. The temples celebrate the four purusharthas (Dharma, Artha, Kama, Moksha). Kandariya Mahadeva alone features 872 meticulously carved sculptures, representing the microcosm of cosmic existence. Hidden inside dense sal forests for centuries, protecting them from Delhi Sultanate iconoclasts until rediscovered by British surveyor T.S. Burt in 1838.",
    "history": "Built during 950 – 1050 CE (10th-11th Century) under Chandela Dynasty (Kings Dhanga, Ganda, and Vidyadhara). Construction: Buff and Pink Fine-grained Sandstone from Panna quarries, Granite foundation plinths. Style: Nagara Style (Sandhara & Latina temples with curvilinear Shikharas).",
    "significance": "Khajuraho Group of Monuments is a prominent heritage landmark in Madhya Pradesh. ASI Ref: C-MP-1, UNESCO Status: 240 (Inscribed 1986).",
    "architecture": "Style: Nagara Style (Sandhara & Latina temples with curvilinear Shikharas). Construction Materials: Buff and Pink Fine-grained Sandstone from Panna quarries, Granite foundation plinths. Dimensions: Kandariya Mahadeva Height: 31 m (102 ft); 25 surviving temples clustered in Western, Eastern, and Southern groups.",
    "keyFacts": [
      "Ruler / Dynasty: Chandela Dynasty (Kings Dhanga, Ganda, and Vidyadhara)",
      "Period: 950 – 1050 CE (10th-11th Century)",
      "Architectural Style: Nagara Style (Sandhara & Latina temples with curvilinear Shikharas)",
      "Location: Chhatarpur District, Khajuraho, Madhya Pradesh",
      "ASI Reference: C-MP-1",
      "UNESCO: 240 (Inscribed 1986)"
    ],
    "period": "950 – 1050 CE (10th-11th Century)"
  },
  {
    "placeId": "IND-HER-10",
    "shortStory": "Second-largest city in the medieval world in 1500 CE after Beijing, described by Portuguese traveler Domingo Paes as overflowing with rubies, diamonds, and silks. Capital of emperor Krishna Deva Raya. Sacked, burned, and looted for 6 months following the Battle of Talikota in 1565 by the combined Deccan Sultanates.",
    "history": "Built during 1336 – 1565 CE (14th-16th Century) under Vijayanagara Empire (Sangama, Saluva, Tuluva & Aravidu dynasties; Krishna Deva Raya). Construction: Local Porphyritic Granite Boulders, Lime plaster, Timber roofing. Style: Vijayanagara Dravidian (Massive granite monolithic structures with musical pillars).",
    "significance": "Hampi (Ruins of the Vijayanagara Empire) is a prominent heritage landmark in Karnataka. ASI Ref: S-KA-1, UNESCO Status: 241 (Inscribed 1986).",
    "architecture": "Style: Vijayanagara Dravidian (Massive granite monolithic structures with musical pillars). Construction Materials: Local Porphyritic Granite Boulders, Lime plaster, Timber roofing. Dimensions: Spans over 4,187 hectares (41.8 sq km); Over 1,600 surviving monuments amidst boulder-strewn hills.",
    "keyFacts": [
      "Ruler / Dynasty: Vijayanagara Empire (Sangama, Saluva, Tuluva & Aravidu dynasties; Krishna Deva Raya)",
      "Period: 1336 – 1565 CE (14th-16th Century)",
      "Architectural Style: Vijayanagara Dravidian (Massive granite monolithic structures with musical pillars)",
      "Location: Vijayanagara District, Hosapete, Karnataka",
      "ASI Reference: S-KA-1",
      "UNESCO: 241 (Inscribed 1986)"
    ],
    "period": "1336 – 1565 CE (14th-16th Century)"
  },
  {
    "placeId": "IND-HER-11",
    "shortStory": "Designed as an inverted temple highlighting the sacredness of water in the arid desert of Gujarat. Built by Queen Udayamati as a memorial stepwell for her deceased husband King Bhima I. Silted over by the Saraswati River floods for over 800 years, which miraculously preserved its 500 master stone reliefs in mint condition until excavated by ASI in the 1980s. Featured on the new Indian ₹100 currency note.",
    "history": "Built during 1063 – 1083 CE (11th Century) under Chaulukya / Solanki Dynasty (Queen Udayamati for King Bhima I). Construction: Dhrangadhra Sandstone with interlocking dry-stone masonry, Lime mortar. Style: Māru-Gurjara Subterranean Temple Architecture.",
    "significance": "Rani ki Vav (The Queen's Stepwell) is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-1, UNESCO Status: 922 (Inscribed 2014).",
    "architecture": "Style: Māru-Gurjara Subterranean Temple Architecture. Construction Materials: Dhrangadhra Sandstone with interlocking dry-stone masonry, Lime mortar. Dimensions: Length: 64 m (210 ft); Width: 20 m (66 ft); Depth: 28 m (92 ft) across 7 terraced levels.",
    "keyFacts": [
      "Ruler / Dynasty: Chaulukya / Solanki Dynasty (Queen Udayamati for King Bhima I)",
      "Period: 1063 – 1083 CE (11th Century)",
      "Architectural Style: Māru-Gurjara Subterranean Temple Architecture",
      "Location: Patan District, Patan, Gujarat",
      "ASI Reference: W-GJ-1",
      "UNESCO: 922 (Inscribed 2014)"
    ],
    "period": "1063 – 1083 CE (11th Century)"
  },
  {
    "placeId": "IND-HER-12",
    "shortStory": "Built as the primary naval and merchant port of the Pallava Empire trading with Sri Lanka, Java, and China. 'Descent of the Ganges' is one of the world's largest open-air rock bas-reliefs, carved onto two monolithic boulders with a natural cleft depicting the cosmic descent of the sacred river. Survived the catastrophic 2004 Indian Ocean Tsunami, which exposed submerged foundational temple blocks offshore.",
    "history": "Built during 7th – 8th Century CE under Pallava Dynasty (Narasimhavarman I Mamalla & Rajasimha). Construction: Grey Granite Boulders, Monolithic Diorite Outcrops, Dressed coastal granite blocks. Style: Early Dravidian Pallava Rock-Cut & Structural Architecture.",
    "significance": "Group of Monuments at Mahabalipuram is a prominent heritage landmark in Tamil Nadu. ASI Ref: S-TN-1, UNESCO Status: 249 (Inscribed 1984).",
    "architecture": "Style: Early Dravidian Pallava Rock-Cut & Structural Architecture. Construction Materials: Grey Granite Boulders, Monolithic Diorite Outcrops, Dressed coastal granite blocks. Dimensions: Relief: 29m x 13m; Pancha Rathas monolithic campus; Shore temple twin structural towers.",
    "keyFacts": [
      "Ruler / Dynasty: Pallava Dynasty (Narasimhavarman I Mamalla & Rajasimha)",
      "Period: 7th – 8th Century CE",
      "Architectural Style: Early Dravidian Pallava Rock-Cut & Structural Architecture",
      "Location: Chengalpattu District, Mamallapuram, Tamil Nadu",
      "ASI Reference: S-TN-1",
      "UNESCO: 249 (Inscribed 1984)"
    ],
    "period": "7th – 8th Century CE"
  },
  {
    "placeId": "IND-HER-13",
    "shortStory": "Oldest stone structure in India, originally commissioned by Emperor Ashoka over the relics of the Buddha. The elaborate stone Torana gateways added by Satavahana craftsmen mimic earlier wooden carpentry techniques, illustrating Jataka stories and the life of Gautama Buddha in aniconic symbolic form (Bodhi tree, throne, footprints, dharmachakra).",
    "history": "Built during 3rd Century BCE – 1st Century CE under Maurya Empire (Emperor Ashoka), Shunga & Satavahana Dynasties. Construction: Local Sandstone Blocks, Core burnt brick hemispherical dome, Polished Chunar stone Ashokan Pillar. Style: Classical Buddhist Stupa with Torana Gateways.",
    "significance": "Buddhist Monuments at Sanchi (Great Stupa 1) is a prominent heritage landmark in Madhya Pradesh. ASI Ref: C-MP-2, UNESCO Status: 524 (Inscribed 1989).",
    "architecture": "Style: Classical Buddhist Stupa with Torana Gateways. Construction Materials: Local Sandstone Blocks, Core burnt brick hemispherical dome, Polished Chunar stone Ashokan Pillar. Dimensions: Dome Height: 16.5 m (54 ft); Dome Diameter: 36.5 m (120 ft); Four 10m high Toranas.",
    "keyFacts": [
      "Ruler / Dynasty: Maurya Empire (Emperor Ashoka), Shunga & Satavahana Dynasties",
      "Period: 3rd Century BCE – 1st Century CE",
      "Architectural Style: Classical Buddhist Stupa with Torana Gateways",
      "Location: Raisen District, Sanchi, Madhya Pradesh",
      "ASI Reference: C-MP-2",
      "UNESCO: 524 (Inscribed 1989)"
    ],
    "period": "3rd Century BCE – 1st Century CE"
  },
  {
    "placeId": "IND-HER-14",
    "shortStory": "Dedicated to Lord Shiva as Dakshinamurti and Rajarajeshwaram. Built to celebrate Emperor Rajaraja I's oceanic and northern conquests. Over 130,000 tonnes of granite were hauled to the site despite no granite quarries existing within 60 km. The 80-tonne granite octagonal apex stone was rolled to the top of the 66-meter tower using an inclined earthen ramp over 6 km long.",
    "history": "Built during 1003 – 1010 CE (11th Century) under Chola Dynasty (Emperor Rajaraja Chola I). Construction: Interlocking Monolithic Granite Blocks (Dry-masonry without mortar), Chola fresco tempera. Style: Apex Dravidian Chola Temple Architecture.",
    "significance": "Brihadisvara Temple (Peruvudaiyar Kovil) is a prominent heritage landmark in Tamil Nadu. ASI Ref: S-TN-2, UNESCO Status: 250bis (Inscribed 1987).",
    "architecture": "Style: Apex Dravidian Chola Temple Architecture. Construction Materials: Interlocking Monolithic Granite Blocks (Dry-masonry without mortar), Chola fresco tempera. Dimensions: Vimana Height: 66 m (216 ft); Kumbam (Cap-stone) Weight: 80 tonnes; Monolithic Nandi: 20 tonnes.",
    "keyFacts": [
      "Ruler / Dynasty: Chola Dynasty (Emperor Rajaraja Chola I)",
      "Period: 1003 – 1010 CE (11th Century)",
      "Architectural Style: Apex Dravidian Chola Temple Architecture",
      "Location: Thanjavur District, Thanjavur, Tamil Nadu",
      "ASI Reference: S-TN-2",
      "UNESCO: 250bis (Inscribed 1987)"
    ],
    "period": "1003 – 1010 CE (11th Century)"
  },
  {
    "placeId": "IND-HER-15",
    "shortStory": "Designed by Lal Chand Ustad in the shape of Lord Krishna's crown. The 953 honeycombed jharokha casements allowed royal purdah-observing women to observe daily bazaar life, religious processions, and military parades unseen from the street. The unique microclimate channels harness the Venturi effect, maintaining breezy temperatures even during scorching 45°C Rajasthani summers.",
    "history": "Built during 1799 CE (Late 18th Century) under Kachwaha Rajput Dynasty (Maharaja Sawai Pratap Singh). Construction: Local Pink and Red Banded Sandstone, White Chunam (Lime) plaster detailing. Style: Rajput-Mughal Fusion (Form of Lord Krishna's Mukut/Crown).",
    "significance": "Hawa Mahal (Palace of Winds) is a prominent heritage landmark in Rajasthan. ASI Ref: W-RJ-1, UNESCO Status: Component of Jaipur City UNESCO Site 1478.",
    "architecture": "Style: Rajput-Mughal Fusion (Form of Lord Krishna's Mukut/Crown). Construction Materials: Local Pink and Red Banded Sandstone, White Chunam (Lime) plaster detailing. Dimensions: Height: 15 m (50 ft); 5 Storeys; Only 20 cm thick at the top floor wall.",
    "keyFacts": [
      "Ruler / Dynasty: Kachwaha Rajput Dynasty (Maharaja Sawai Pratap Singh)",
      "Period: 1799 CE (Late 18th Century)",
      "Architectural Style: Rajput-Mughal Fusion (Form of Lord Krishna's Mukut/Crown)",
      "Location: Jaipur District, Jaipur (Pink City), Rajasthan",
      "ASI Reference: W-RJ-1",
      "UNESCO: Component of Jaipur City UNESCO Site 1478"
    ],
    "period": "1799 CE (Late 18th Century)"
  },
  {
    "placeId": "IND-HER-16",
    "shortStory": "Constructed atop Cheel ka Teela (Hill of Eagles) by Akbar's commander-in-chief Raja Man Singh I. Features subterranean escape tunnels directly connecting Amer Palace to the higher military fortress of Jaigarh Fort, home to the 'Jaivana' cannon, the world's largest wheeled cannon of its era. Withstood multiple regional sieges.",
    "history": "Built during 1592 – 1727 CE (16th-18th Century) under Kachwaha Rajput Clan (Raja Man Singh I & Sawai Jai Singh). Construction: Yellow and Pink Sandstone, White Marble, Belgian Concave Convex Mirrors, Stucco plaster. Style: Classical Rajput-Mughal Defensive Palace Architecture.",
    "significance": "Amer Fort & Palace is a prominent heritage landmark in Rajasthan. ASI Ref: W-RJ-2, UNESCO Status: 247-001 (Hill Forts of Rajasthan, 2013).",
    "architecture": "Style: Classical Rajput-Mughal Defensive Palace Architecture. Construction Materials: Yellow and Pink Sandstone, White Marble, Belgian Concave Convex Mirrors, Stucco plaster. Dimensions: Overlooks Maota Lake; Built across 4 courtyard levels connected by fortified ramparts to Jaigarh Fort.",
    "keyFacts": [
      "Ruler / Dynasty: Kachwaha Rajput Clan (Raja Man Singh I & Sawai Jai Singh)",
      "Period: 1592 – 1727 CE (16th-18th Century)",
      "Architectural Style: Classical Rajput-Mughal Defensive Palace Architecture",
      "Location: Jaipur District, Amer, Rajasthan",
      "ASI Reference: W-RJ-2",
      "UNESCO: 247-001 (Hill Forts of Rajasthan, 2013)"
    ],
    "period": "1592 – 1727 CE (16th-18th Century)"
  },
  {
    "placeId": "IND-HER-17",
    "shortStory": "Built in 1591 by Sultan Muhammad Quli Qutb Shah to commemorate the eradication of a devastating plague epidemic from the new capital city of Hyderabad. Located at the intersection of historic trade routes connecting Golconda diamond mines to the port of Machilipatnam on the Bay of Bengal.",
    "history": "Built during 1591 CE (Late 16th Century) under Qutb Shahi Dynasty (Muhammad Quli Qutb Shah). Construction: Granite, Mortar, Marble plinth, Ground Shell Lime and Pulverized Marble plaster. Style: Indo-Islamic Qutb Shahi Architecture.",
    "significance": "Charminar is a prominent heritage landmark in Telangana. ASI Ref: H-TL-1, UNESCO Status: Tentative List (Monuments of the Deccan Sultanate).",
    "architecture": "Style: Indo-Islamic Qutb Shahi Architecture. Construction Materials: Granite, Mortar, Marble plinth, Ground Shell Lime and Pulverized Marble plaster. Dimensions: Height: 48.7 m (160 ft); Square Plan: 20 m on each side; 4 Minarets: 48.7m high with 149 spiral steps.",
    "keyFacts": [
      "Ruler / Dynasty: Qutb Shahi Dynasty (Muhammad Quli Qutb Shah)",
      "Period: 1591 CE (Late 16th Century)",
      "Architectural Style: Indo-Islamic Qutb Shahi Architecture",
      "Location: Hyderabad District, Old City Hyderabad, Telangana",
      "ASI Reference: H-TL-1",
      "UNESCO: Tentative List (Monuments of the Deccan Sultanate)"
    ],
    "period": "1591 CE (Late 16th Century)"
  },
  {
    "placeId": "IND-HER-18",
    "shortStory": "World-renowned epicenter of the historic Golconda diamond trade that yielded the Koh-i-Noor, Hope, and Daria-i-Noor diamonds. Its acoustic marvel at the entrance gate (Fateh Darwaza) allows a handclap at the center dome to echo clearly to the Bala Hissar pavilion 1 km away atop the citadel, alerting defenders to surprise attacks. Withstood an 8-month siege by Mughal Emperor Aurangzeb in 1687 before falling due to internal bribery.",
    "history": "Built during 1143 – 1687 CE (12th-17th Century) under Kakatiya Dynasty (Origin) & Qutb Shahi Dynasty. Construction: Granite Cyclopean Blocks, Lime mortar, Basalt cannon bastions. Style: Deccani Military Fortification Architecture.",
    "significance": "Golconda Fort is a prominent heritage landmark in Telangana. ASI Ref: H-TL-2, UNESCO Status: Tentative List (Qutb Shahi Monuments).",
    "architecture": "Style: Deccani Military Fortification Architecture. Construction Materials: Granite Cyclopean Blocks, Lime mortar, Basalt cannon bastions. Dimensions: Circumference: 10 km; 87 semi-circular bastions; 8 massive gateways studded with iron anti-elephant spikes.",
    "keyFacts": [
      "Ruler / Dynasty: Kakatiya Dynasty (Origin) & Qutb Shahi Dynasty",
      "Period: 1143 – 1687 CE (12th-17th Century)",
      "Architectural Style: Deccani Military Fortification Architecture",
      "Location: Hyderabad District, Golconda, Telangana",
      "ASI Reference: H-TL-2",
      "UNESCO: Tentative List (Qutb Shahi Monuments)"
    ],
    "period": "1143 – 1687 CE (12th-17th Century)"
  },
  {
    "placeId": "IND-HER-19",
    "shortStory": "Conceived by Viceroy Lord Curzon following Queen Victoria's death in 1901. Opened to the public in 1921 by the Prince of Wales. Houses over 28,000 artifacts including the world's largest collection of paintings by Thomas and William Daniell, rare Mughal miniature manuscripts, and documents detailing the Indian freedom struggle and the 1857 Sepoy Mutiny.",
    "history": "Built during 1906 – 1921 CE (Early 20th Century) under British Raj (Lord Curzon / Architect William Emerson). Construction: Makrana White Marble (Same quarry as Taj Mahal), Cast iron framing, Bronze statues. Style: Indo-Saracenic Revival with Italian Renaissance & Mughal Domes.",
    "significance": "Victoria Memorial Hall is a prominent heritage landmark in West Bengal. ASI Ref: E-WB-1, UNESCO Status: National Treasure of India.",
    "architecture": "Style: Indo-Saracenic Revival with Italian Renaissance & Mughal Domes. Construction Materials: Makrana White Marble (Same quarry as Taj Mahal), Cast iron framing, Bronze statues. Dimensions: Height: 56 m (184 ft); Grounds: 64 acres with reflecting water bodies.",
    "keyFacts": [
      "Ruler / Dynasty: British Raj (Lord Curzon / Architect William Emerson)",
      "Period: 1906 – 1921 CE (Early 20th Century)",
      "Architectural Style: Indo-Saracenic Revival with Italian Renaissance & Mughal Domes",
      "Location: Kolkata District, Kolkata, West Bengal",
      "ASI Reference: E-WB-1",
      "UNESCO: National Treasure of India"
    ],
    "period": "1906 – 1921 CE (Early 20th Century)"
  },
  {
    "placeId": "IND-HER-20",
    "shortStory": "Founded by Guru Ram Das and constructed by Guru Arjan Dev, who invited Muslim Sufi saint Hazrat Mian Mir of Lahore to lay its foundational cornerstone in 1589. Features four entrances facing North, South, East, and West, symbolizing universal acceptance of all castes, creeds, and religions. Rebuilt by the Sikh Misls after being desecrated multiple times by Ahmad Shah Durrani (Abdali). Gilded with 500 kg of gold by Maharaja Ranjit Singh in 1830.",
    "history": "Built during 1581 – 1604 CE; Gilded in 1830 CE under Sikh Gurus (Guru Arjan Dev Ji) & Sikh Empire (Maharaja Ranjit Singh). Construction: White Marble, Copper plates gilded with 500 kg of pure 24-karat Gold leaf, Pietra Dura floral inlay. Style: Sikh Architecture (Synthesis of Indo-Islamic and Rajput motifs with four open entrances).",
    "significance": "Golden Temple (Sri Harmandir Sahib) is a prominent heritage landmark in Punjab. ASI Ref: State Heritage / SGPC, UNESCO Status: Tentative List (Sri Harmandir Sahib).",
    "architecture": "Style: Sikh Architecture (Synthesis of Indo-Islamic and Rajput motifs with four open entrances). Construction Materials: White Marble, Copper plates gilded with 500 kg of pure 24-karat Gold leaf, Pietra Dura floral inlay. Dimensions: Sarovar (Holy Pool): 150m x 150m; Central sanctum: 12.25m x 12.25m accessed via 62m Causeway.",
    "keyFacts": [
      "Ruler / Dynasty: Sikh Gurus (Guru Arjan Dev Ji) & Sikh Empire (Maharaja Ranjit Singh)",
      "Period: 1581 – 1604 CE; Gilded in 1830 CE",
      "Architectural Style: Sikh Architecture (Synthesis of Indo-Islamic and Rajput motifs with four open entrances)",
      "Location: Amritsar District, Amritsar, Punjab",
      "ASI Reference: State Heritage / SGPC",
      "UNESCO: Tentative List (Sri Harmandir Sahib)"
    ],
    "period": "1581 – 1604 CE; Gilded in 1830 CE"
  },
  {
    "placeId": "IND-HER-21",
    "shortStory": "One of the oldest continuously inhabited sacred temple complexes on earth, forming the epicentre of the ancient lotus-shaped city of Madurai. Sacked in 1310 by Malik Kafur of the Delhi Sultanate, but magnificently rebuilt to cosmic proportions by King Thirumalai Nayak of the Madurai Nayak dynasty in the 17th century. Dedicated to Goddess Meenakshi (Parvati) and Lord Sundareswarar (Shiva).",
    "history": "Built during 6th Century BCE (Origin); Rebuilt 1623 – 1659 CE under Pandya Dynasty (Origin) & Nayaka Dynasty (Thirumalai Nayak). Construction: Granite foundation, Stucco plaster polychromatic statues, Teak wood timbering. Style: Late Dravidian Nayaka Temple Architecture.",
    "significance": "Meenakshi Amman Temple is a prominent heritage landmark in Tamil Nadu. ASI Ref: S-TN-3, UNESCO Status: Tentative List (Great Temple of Madurai).",
    "architecture": "Style: Late Dravidian Nayaka Temple Architecture. Construction Materials: Granite foundation, Stucco plaster polychromatic statues, Teak wood timbering. Dimensions: Complex Area: 14 acres (5.7 hectares); 14 Gopuram gateway towers; South Gopuram Height: 52 m (170 ft).",
    "keyFacts": [
      "Ruler / Dynasty: Pandya Dynasty (Origin) & Nayaka Dynasty (Thirumalai Nayak)",
      "Period: 6th Century BCE (Origin); Rebuilt 1623 – 1659 CE",
      "Architectural Style: Late Dravidian Nayaka Temple Architecture",
      "Location: Madurai District, Madurai, Tamil Nadu",
      "ASI Reference: S-TN-3",
      "UNESCO: Tentative List (Great Temple of Madurai)"
    ],
    "period": "6th Century BCE (Origin); Rebuilt 1623 – 1659 CE"
  },
  {
    "placeId": "IND-HER-22",
    "shortStory": "The world's premier residential Buddhist university, housing over 10,000 students and 2,000 scholars from China, Korea, Japan, Tibet, Mongolia, Sri Lanka, and Turkey. Visited and documented extensively by Chinese pilgrim Xuanzang (Hiuen Tsang) in the 7th century CE. Destroyed around 1193 CE by Bakhtiyar Khilji, whose troops set fire to its colossal nine-storey library (Dharmaganja), which according to Persian chronicles burned continuously for three months.",
    "history": "Built during 5th Century CE – 1200 CE under Gupta Empire (Kumaragupta I) & Harsha / Pala Empire. Construction: Burnt Red Clay Bricks (Dry-laid with lime-sand mortar), Stucco relief panels, Granite pillar bases. Style: Ancient Buddhist Brick Vihara & Chaitya Architecture.",
    "significance": "Archaeological Site of Nalanda Mahavihara is a prominent heritage landmark in Bihar. ASI Ref: E-BR-1, UNESCO Status: 1502 (Inscribed 2016).",
    "architecture": "Style: Ancient Buddhist Brick Vihara & Chaitya Architecture. Construction Materials: Burnt Red Clay Bricks (Dry-laid with lime-sand mortar), Stucco relief panels, Granite pillar bases. Dimensions: Excavated Area: 12 hectares (Estimated original campus: 16 sq km); 11 Monasteries and 6 Temples.",
    "keyFacts": [
      "Ruler / Dynasty: Gupta Empire (Kumaragupta I) & Harsha / Pala Empire",
      "Period: 5th Century CE – 1200 CE",
      "Architectural Style: Ancient Buddhist Brick Vihara & Chaitya Architecture",
      "Location: Nalanda District, Rajgir, Bihar",
      "ASI Reference: E-BR-1",
      "UNESCO: 1502 (Inscribed 2016)"
    ],
    "period": "5th Century CE – 1200 CE"
  },
  {
    "placeId": "IND-HER-23",
    "shortStory": "Direct location where Siddhartha Gautama attained supreme enlightenment (Bodhi) in 528 BCE to become the Buddha. The original shrine was built by Emperor Ashoka around 260 BCE. The sacred Bodhi Tree standing behind the temple is a direct living descendant of the original pipal tree, replanted via a sapling brought back from Sri Lanka (originally taken there by Emperor Ashoka's daughter Sanghamitta).",
    "history": "Built during 3rd Century BCE (Origin); 5th – 6th Century CE under Maurya Empire (Ashoka) & Late Gupta / Pala Dynasties. Construction: All-Brick Masonry structure (One of the earliest surviving brick temples in India), Gold plated pinnacle. Style: Classical Brick Shikhara Stupa Architecture.",
    "significance": "Mahabodhi Temple Complex is a prominent heritage landmark in Bihar. ASI Ref: E-BR-2, UNESCO Status: 1056 (Inscribed 2002).",
    "architecture": "Style: Classical Brick Shikhara Stupa Architecture. Construction Materials: All-Brick Masonry structure (One of the earliest surviving brick temples in India), Gold plated pinnacle. Dimensions: Grand Pyramid Tower Height: 55 m (180 ft); Enclosed holy grounds: 4.8 hectares.",
    "keyFacts": [
      "Ruler / Dynasty: Maurya Empire (Ashoka) & Late Gupta / Pala Dynasties",
      "Period: 3rd Century BCE (Origin); 5th – 6th Century CE",
      "Architectural Style: Classical Brick Shikhara Stupa Architecture",
      "Location: Gaya District, Bodh Gaya, Bihar",
      "ASI Reference: E-BR-2",
      "UNESCO: 1056 (Inscribed 2002)"
    ],
    "period": "3rd Century BCE (Origin); 5th – 6th Century CE"
  },
  {
    "placeId": "IND-HER-24",
    "shortStory": "Located on Gharapuri Island in Mumbai Harbour. Named 'Elephanta' by 16th-century Portuguese explorers after a colossal monolithic stone elephant found near the landing point. The colossal 6-meter high Trimurti bust represents the three essential cosmic aspects of Shiva: Creator (Aghora/Bhairava), Preserver (Tatpurusha), and Destroyer (Vamadeva). Defaced by Portuguese soldiers who used the stone reliefs for target practice in the 17th century.",
    "history": "Built during 5th – 8th Century CE under Kalachuri Dynasty & Konkan Mauryas / Rashtrakutas. Construction: Solid Basaltic Rock Hill (Gharapuri Island). Style: Monolithic Basalt Rock-Cut Shaivite Architecture.",
    "significance": "Elephanta Caves is a prominent heritage landmark in Maharashtra. ASI Ref: W-MH-A3, UNESCO Status: 244 (Inscribed 1987).",
    "architecture": "Style: Monolithic Basalt Rock-Cut Shaivite Architecture. Construction Materials: Solid Basaltic Rock Hill (Gharapuri Island). Dimensions: Main Cave 1 (Maheshmurti Cave): 39 m square pillared mandapa carved deep into hill.",
    "keyFacts": [
      "Ruler / Dynasty: Kalachuri Dynasty & Konkan Mauryas / Rashtrakutas",
      "Period: 5th – 8th Century CE",
      "Architectural Style: Monolithic Basalt Rock-Cut Shaivite Architecture",
      "Location: Mumbai Harbour, Raigad District, Maharashtra",
      "ASI Reference: W-MH-A3",
      "UNESCO: 244 (Inscribed 1987)"
    ],
    "period": "5th – 8th Century CE"
  },
  {
    "placeId": "IND-HER-25",
    "shortStory": "Pattadakal served as the ceremonial site where Chalukyan kings were anointed and crowned (Patta-Kisuvolal). Architecturally revolutionary as the testing ground where North Indian curvilinear Nagara spires and South Indian stepped pyramidal Dravidian towers were built directly side by side by royal guild master architects Gundan Anivaritachari.",
    "history": "Built during 7th – 8th Century CE under Early Chalukya Dynasty (Vikramaditya II & Queen Lokamahadevi). Construction: Dressed Reddish Sandstone ashlar blocks without mortar, Malaprabha riverbed stone. Style: Vesara Hybrid Architecture (Confluence of Nagara North Indian and Dravida South Indian styles).",
    "significance": "Group of Monuments at Pattadakal is a prominent heritage landmark in Karnataka. ASI Ref: S-KA-2, UNESCO Status: 239 (Inscribed 1987).",
    "architecture": "Style: Vesara Hybrid Architecture (Confluence of Nagara North Indian and Dravida South Indian styles). Construction Materials: Dressed Reddish Sandstone ashlar blocks without mortar, Malaprabha riverbed stone. Dimensions: Complex of 10 major temples on the west bank of the Malaprabha River.",
    "keyFacts": [
      "Ruler / Dynasty: Early Chalukya Dynasty (Vikramaditya II & Queen Lokamahadevi)",
      "Period: 7th – 8th Century CE",
      "Architectural Style: Vesara Hybrid Architecture (Confluence of Nagara North Indian and Dravida South Indian styles)",
      "Location: Bagalkot District, Badami Taluk, Karnataka",
      "ASI Reference: S-KA-2",
      "UNESCO: 239 (Inscribed 1987)"
    ],
    "period": "7th – 8th Century CE"
  },
  {
    "placeId": "IND-HER-26",
    "shortStory": "Constructed by Maharana Kumbha atop a 1,100-meter Aravalli ridge. Birthplace of legendary warrior king Maharana Pratap. Practically impregnable; in its entire history, it fell only once to a combined coalition of Emperor Akbar, Raja Man Singh of Amer, and the Sultans of Gujarat and Malwa, and only after defenders ran out of drinking water during a six-month siege.",
    "history": "Built during 1443 – 1458 CE (15th Century) under Sisodia Rajput Clan (Rana Kumbha). Construction: Rough-hewn Granite blocks, Lime mortar, Hard stone bastions. Style: Mewar Defensive Mountain Fortress Architecture.",
    "significance": "Kumbhalgarh Fort & The Great Wall of India is a prominent heritage landmark in Rajasthan. ASI Ref: W-RJ-3, UNESCO Status: 247-002 (Hill Forts of Rajasthan, 2013).",
    "architecture": "Style: Mewar Defensive Mountain Fortress Architecture. Construction Materials: Rough-hewn Granite blocks, Lime mortar, Hard stone bastions. Dimensions: Wall Length: 36 km (Second-longest continuous wall in the world after the Great Wall of China); Wall Width: 15 feet (8 horses wide).",
    "keyFacts": [
      "Ruler / Dynasty: Sisodia Rajput Clan (Rana Kumbha)",
      "Period: 1443 – 1458 CE (15th Century)",
      "Architectural Style: Mewar Defensive Mountain Fortress Architecture",
      "Location: Rajsamand District, Kumbhalgarh, Rajasthan",
      "ASI Reference: W-RJ-3",
      "UNESCO: 247-002 (Hill Forts of Rajasthan, 2013)"
    ],
    "period": "1443 – 1458 CE (15th Century)"
  },
  {
    "placeId": "IND-HER-27",
    "shortStory": "The immortal symbol of Rajput chivalry and defiance. Endured three catastrophic sieges: Alauddin Khilji (1303 CE), Bahadur Shah of Gujarat (1535 CE), and Mughal Emperor Akbar (1567-68 CE). Each siege culminated in Jauhar (mass self-immolation by Rajput queens and women, including Rani Padmini and Rani Karnavati) while the warriors fought to the death in saffron robes.",
    "history": "Built during 7th – 16th Century CE under Mori Rajputs (Origin) & Sisodia Dynasty (Rana Ratan Singh, Rana Kumbha, Maharana Sanga). Construction: Local Sandstone and Granite, White marble detailing, Lime concrete. Style: Rajput Citadel Architecture with Stepwells and Victory Towers.",
    "significance": "Chittorgarh Fort & Vijay Stambha is a prominent heritage landmark in Rajasthan. ASI Ref: W-RJ-4, UNESCO Status: 247-003 (Hill Forts of Rajasthan, 2013).",
    "architecture": "Style: Rajput Citadel Architecture with Stepwells and Victory Towers. Construction Materials: Local Sandstone and Granite, White marble detailing, Lime concrete. Dimensions: Plateau Area: 691.9 acres (2.8 sq km); Circumference: 13 km; Perched 180m above plains.",
    "keyFacts": [
      "Ruler / Dynasty: Mori Rajputs (Origin) & Sisodia Dynasty (Rana Ratan Singh, Rana Kumbha, Maharana Sanga)",
      "Period: 7th – 16th Century CE",
      "Architectural Style: Rajput Citadel Architecture with Stepwells and Victory Towers",
      "Location: Chittorgarh District, Chittorgarh, Rajasthan",
      "ASI Reference: W-RJ-4",
      "UNESCO: 247-003 (Hill Forts of Rajasthan, 2013)"
    ],
    "period": "7th – 16th Century CE"
  },
  {
    "placeId": "IND-HER-28",
    "shortStory": "One of the most remarkable urban settlements of the ancient world, thriving on Khadir Bet island in the Great Rann of Kutch for 1,500 years. Pioneered the world's earliest advanced rainwater harvesting network: seasonal streams (Manhar and Mansar) were dammed, and runoff was diverted into 16 interconnected stepped reservoirs carved directly into bedrock, ensuring fresh water in an arid salty desert.",
    "history": "Built during 3000 BCE – 1500 BCE (Bronze Age) under Indus Valley Civilization (Mature Harappan Phase). Construction: Dressed Limestone and Sandstone Masonry (Unique among brick Harappan sites), Mud-brick, Plaster. Style: Harappan Urban Planning & Advanced Hydraulic Civil Engineering.",
    "significance": "Dholavira: Ancient Harappan Metropolis is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-2, UNESCO Status: 1644 (Inscribed 2021).",
    "architecture": "Style: Harappan Urban Planning & Advanced Hydraulic Civil Engineering. Construction Materials: Dressed Limestone and Sandstone Masonry (Unique among brick Harappan sites), Mud-brick, Plaster. Dimensions: Enclosed urban area: 47 hectares; Castle, Bailey, Middle Town, and Lower Town divisions.",
    "keyFacts": [
      "Ruler / Dynasty: Indus Valley Civilization (Mature Harappan Phase)",
      "Period: 3000 BCE – 1500 BCE (Bronze Age)",
      "Architectural Style: Harappan Urban Planning & Advanced Hydraulic Civil Engineering",
      "Location: Kutch District, Khadir Bet, Gujarat",
      "ASI Reference: W-GJ-2",
      "UNESCO: 1644 (Inscribed 2021)"
    ],
    "period": "3000 BCE – 1500 BCE (Bronze Age)"
  },
  {
    "placeId": "IND-HER-29",
    "shortStory": "Named uniquely after its master sculptor, Ramappa, rather than the deity or the king. Described by Italian merchant Marco Polo as the 'brightest star in the galaxy of medieval temples'. Survived major regional earthquakes because of its sandbox foundation technology (deep pits filled with sand, granite dust, and jaggery) that absorbed seismic shockwaves. The superstructure bricks are so light and porous they float when dropped in water.",
    "history": "Built during 1213 CE (13th Century) under Kakatiya Dynasty (General Recharla Rudra / King Ganapati Deva). Construction: Reddish Sandstone plinth, Carved Black Basalt (Dolerite) bracket figures, Ultra-lightweight Porous Floating Bricks. Style: Kakatiya Vesara Temple Architecture (Sandbox foundation technology).",
    "significance": "Kakatiya Rudreshwara (Ramappa) Temple is a prominent heritage landmark in Telangana. ASI Ref: H-TL-3, UNESCO Status: 1570 (Inscribed 2021).",
    "architecture": "Style: Kakatiya Vesara Temple Architecture (Sandbox foundation technology). Construction Materials: Reddish Sandstone plinth, Carved Black Basalt (Dolerite) bracket figures, Ultra-lightweight Porous Floating Bricks. Dimensions: 6-foot high star-shaped plinth (Upapitha); Central Shikhara built with low-density spongy bricks that float on water.",
    "keyFacts": [
      "Ruler / Dynasty: Kakatiya Dynasty (General Recharla Rudra / King Ganapati Deva)",
      "Period: 1213 CE (13th Century)",
      "Architectural Style: Kakatiya Vesara Temple Architecture (Sandbox foundation technology)",
      "Location: Mulugu District, Palampet, Telangana",
      "ASI Reference: H-TL-3",
      "UNESCO: 1570 (Inscribed 2021)"
    ],
    "period": "1213 CE (13th Century)"
  },
  {
    "placeId": "IND-HER-30",
    "shortStory": "The absolute pinnacle of micro-carving in stone. Built by King Vishnuvardhana to commemorate his victory over the Western Chalukyas at Talakad. The soapstone allowed master artists like Jakanachari and Ruvari Mallitamma to sign their works, carving fingernails, translucent garments, and hanging jewellery rings with jeweler-like precision.",
    "history": "Built during 1117 – 1160 CE (12th Century) under Hoysala Empire (King Vishnuvardhana & Queen Shantala). Construction: Chloritic Schist (Green Soapstone - soft to carve when quarried, oxidizes into hard rock). Style: Hoysala Architecture (Star-shaped Stellate plan on Jagati platform).",
    "significance": "Sacred Ensembles of the Hoysalas: Belur & Halebidu is a prominent heritage landmark in Karnataka. ASI Ref: S-KA-3, UNESCO Status: 1670 (Inscribed 2023).",
    "architecture": "Style: Hoysala Architecture (Star-shaped Stellate plan on Jagati platform). Construction Materials: Chloritic Schist (Green Soapstone - soft to carve when quarried, oxidizes into hard rock). Dimensions: Chennakeshava Temple plinth: 55m x 45m; Hoysaleswara twin shrine with 200m relief frieze.",
    "keyFacts": [
      "Ruler / Dynasty: Hoysala Empire (King Vishnuvardhana & Queen Shantala)",
      "Period: 1117 – 1160 CE (12th Century)",
      "Architectural Style: Hoysala Architecture (Star-shaped Stellate plan on Jagati platform)",
      "Location: Hassan District, Belur & Halebidu, Karnataka",
      "ASI Reference: S-KA-3",
      "UNESCO: 1670 (Inscribed 2023)"
    ],
    "period": "1117 – 1160 CE (12th Century)"
  },
  {
    "placeId": "IND-HER-31",
    "shortStory": "Engineered with astronomical precision along the Tropic of Cancer: on the spring and autumn equinoxes (March 21 and September 23), the first rays of the rising sun passed through open pillared portals to illuminate the diamond-studded crown of the golden idol of Surya in the inner sanctum. Plundered by Mahmud of Ghazni, yet the structural stone mandapa remains an engineering marvel.",
    "history": "Built during 1026 – 1027 CE (11th Century) under Chaulukya / Solanki Dynasty (King Bhima I). Construction: Golden-yellow Dhrangadhra Sandstone, Dry-ashlar interlocking stone joints. Style: Māru-Gurjara Architecture (Solar alignment along Tropic of Cancer).",
    "significance": "Sun Temple Modhera is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-3, UNESCO Status: Tentative List (Sun Temple Modhera).",
    "architecture": "Style: Māru-Gurjara Architecture (Solar alignment along Tropic of Cancer). Construction Materials: Golden-yellow Dhrangadhra Sandstone, Dry-ashlar interlocking stone joints. Dimensions: Three axial components: Surya Kund (Stepped tank), Sabha Mandapa (Assembly hall), Guda Mandapa (Sanctum).",
    "keyFacts": [
      "Ruler / Dynasty: Chaulukya / Solanki Dynasty (King Bhima I)",
      "Period: 1026 – 1027 CE (11th Century)",
      "Architectural Style: Māru-Gurjara Architecture (Solar alignment along Tropic of Cancer)",
      "Location: Mehsana District, Modhera, Gujarat",
      "ASI Reference: W-GJ-3",
      "UNESCO: Tentative List (Sun Temple Modhera)"
    ],
    "period": "1026 – 1027 CE (11th Century)"
  },
  {
    "placeId": "IND-HER-32",
    "shortStory": "Contains the oldest documented human rock art in the Indian subcontinent. Demonstrates continuous human habitation from the Lower Paleolithic through the Mesolithic to historical times. The red and white pigments have survived thousands of years of weathering because the mineral ochre chemically bonded with the porous quartzite rock. Discovered in 1957 by Indian archaeologist Dr. V.S. Wakankar.",
    "history": "Built during 100,000 BCE – 10,000 BCE (Rock art: ~30,000 years old) under Prehistoric Hunter-Gatherers (Upper Paleolithic to Medieval). Construction: Dense orthoquartzite rock formations, Mineral pigments (Manganese oxide, hematite red ochre, plant sap). Style: Natural Sandstone Grottoes & Prehistoric Pictographs.",
    "significance": "Rock Shelters of Bhimbetka is a prominent heritage landmark in Madhya Pradesh. ASI Ref: C-MP-3, UNESCO Status: 925 (Inscribed 2003).",
    "architecture": "Style: Natural Sandstone Grottoes & Prehistoric Pictographs. Construction Materials: Dense orthoquartzite rock formations, Mineral pigments (Manganese oxide, hematite red ochre, plant sap). Dimensions: Over 750 rock shelters distributed over 7 hills across 10 km; 15 shelters open to tourists.",
    "keyFacts": [
      "Ruler / Dynasty: Prehistoric Hunter-Gatherers (Upper Paleolithic to Medieval)",
      "Period: 100,000 BCE – 10,000 BCE (Rock art: ~30,000 years old)",
      "Architectural Style: Natural Sandstone Grottoes & Prehistoric Pictographs",
      "Location: Raisen District, Bhojpur, Madhya Pradesh",
      "ASI Reference: C-MP-3",
      "UNESCO: 925 (Inscribed 2003)"
    ],
    "period": "100,000 BCE – 10,000 BCE (Rock art: ~30,000 years old)"
  },
  {
    "placeId": "IND-HER-33",
    "shortStory": "The spiritual heart of Portuguese India. Bom Jesus is consecrated as a minor basilica and houses the 470-year-old preserved mortal remains of Saint Francis Xavier inside an ornate three-tiered silver casket crafted by 17th-century Florentine jeweler Giovanni Battista Foggini. Se Cathedral opposite is dedicated to Saint Catherine of Alexandria, built to celebrate Afonso de Albuquerque's conquest of Goa in 1510.",
    "history": "Built during 1594 – 1605 CE (Late 16th-Early 17th Century) under Portuguese Colonial Era (Jesuit Order). Construction: Exposed Red Laterite Stone, Basalt dressings, Teak wood altarpiece with gold leaf. Style: Jesuit Mannerist Baroque & Doric/Ionic Columns.",
    "significance": "Basilica of Bom Jesus & Se Cathedral is a prominent heritage landmark in Goa. ASI Ref: W-GA-1, UNESCO Status: 234 (Churches and Convents of Goa, 1986).",
    "architecture": "Style: Jesuit Mannerist Baroque & Doric/Ionic Columns. Construction Materials: Exposed Red Laterite Stone, Basalt dressings, Teak wood altarpiece with gold leaf. Dimensions: Basilica Length: 56 m; Width: 17 m; Height: 18.5 m; Se Cathedral Golden Bell Tower.",
    "keyFacts": [
      "Ruler / Dynasty: Portuguese Colonial Era (Jesuit Order)",
      "Period: 1594 – 1605 CE (Late 16th-Early 17th Century)",
      "Architectural Style: Jesuit Mannerist Baroque & Doric/Ionic Columns",
      "Location: North Goa, Old Goa (Velha Goa), Goa",
      "ASI Reference: W-GA-1",
      "UNESCO: 234 (Churches and Convents of Goa, 1986)"
    ],
    "period": "1594 – 1605 CE (Late 16th-Early 17th Century)"
  },
  {
    "placeId": "IND-HER-34",
    "shortStory": "Constructed over 10 years to mark the Golden Jubilee of Queen Victoria. Architect F.W. Stevens collaborated with students of Mumbai's Sir J.J. School of Art to incorporate indigenous stone carvings of Indian fauna, flora, and turbaned figures into traditional European Gothic ribbed vaults. Formed the terminus for the Great Indian Peninsula Railway, which operated the first commercial passenger train in Asia in 1853.",
    "history": "Built during 1878 – 1887 CE (Late 19th Century) under British Raj (Architect Frederick William Stevens). Construction: Malad Yellow Basalt Stone, Porbandar Sandstone, Italian Carrara Marble, Cast Iron Groined Vaults. Style: Victorian High Gothic Revival with Traditional Indian Palatial Motifs.",
    "significance": "Chhatrapati Shivaji Maharaj Terminus (CSMT) is a prominent heritage landmark in Maharashtra. ASI Ref: W-MH-A4, UNESCO Status: 945rev (Inscribed 2004).",
    "architecture": "Style: Victorian High Gothic Revival with Traditional Indian Palatial Motifs. Construction Materials: Malad Yellow Basalt Stone, Porbandar Sandstone, Italian Carrara Marble, Cast Iron Groined Vaults. Dimensions: Central Dome Height: 100 m; Footprint: 2.85 hectares; Serves over 3 million commuters daily.",
    "keyFacts": [
      "Ruler / Dynasty: British Raj (Architect Frederick William Stevens)",
      "Period: 1878 – 1887 CE (Late 19th Century)",
      "Architectural Style: Victorian High Gothic Revival with Traditional Indian Palatial Motifs",
      "Location: Mumbai City, Fort / Bori Bunder, Maharashtra",
      "ASI Reference: W-MH-A4",
      "UNESCO: 945rev (Inscribed 2004)"
    ],
    "period": "1878 – 1887 CE (Late 19th Century)"
  },
  {
    "placeId": "IND-HER-35",
    "shortStory": "Described by Mughal Emperor Babur as 'the pearl amongst the fortresses of Hind'. Built atop a steep standalone sandstone ridge that controls the route from the Gangetic plains into Malwa. In 1858, legendary warrior queen Rani Lakshmibai of Jhansi fought her final heroic battle against British General Hugh Rose beneath its defensive ramparts.",
    "history": "Built during 8th Century (Origin); Man Mandir: 1486 – 1516 CE under Tomara Dynasty (Raja Man Singh Tomar) & Scindia Dynasty. Construction: Gwalior Sandstone, Blue, Yellow, and Green Glazed Ceramic Tiles (Kashi work). Style: Medieval Rajput Palace Architecture with Glazed Turquoise Ceramic Tiles.",
    "significance": "Gwalior Fort & Man Mandir Palace is a prominent heritage landmark in Madhya Pradesh. ASI Ref: C-MP-4, UNESCO Status: Component of Gwalior UNESCO Creative Cities Network.",
    "architecture": "Style: Medieval Rajput Palace Architecture with Glazed Turquoise Ceramic Tiles. Construction Materials: Gwalior Sandstone, Blue, Yellow, and Green Glazed Ceramic Tiles (Kashi work). Dimensions: Hilltop Length: 2.8 km; Width: 200m to 850m; Steep 100m vertical sandstone escarpment.",
    "keyFacts": [
      "Ruler / Dynasty: Tomara Dynasty (Raja Man Singh Tomar) & Scindia Dynasty",
      "Period: 8th Century (Origin); Man Mandir: 1486 – 1516 CE",
      "Architectural Style: Medieval Rajput Palace Architecture with Glazed Turquoise Ceramic Tiles",
      "Location: Gwalior District, Gwalior, Madhya Pradesh",
      "ASI Reference: C-MP-4",
      "UNESCO: Component of Gwalior UNESCO Creative Cities Network"
    ],
    "period": "8th Century (Origin); Man Mandir: 1486 – 1516 CE"
  },
  {
    "placeId": "IND-HER-36",
    "shortStory": "Considered the most impregnable defensive fortress in medieval India. The natural basalt hill was scarped vertically to create a 50-meter sheer cliff drops into a deep water moat. In 1327 CE, Sultan Muhammad bin Tughlaq infamously ordered the entire population of Delhi to march 1,100 km south to make Daulatabad his new capital. Captured by Aurangzeb in 1636 after a prolonged siege.",
    "history": "Built during 1187 – 1636 CE (12th-17th Century) under Yadava Dynasty (King Bhillama V) & Tughlaq / Bahmani / Nizam Shahi. Construction: Chiselled Basalt Mountain, Lime mortar, Cast bronze cannons. Style: Deccani Military Defense Fortification (Conical hill citadel with pitch-black maze).",
    "significance": "Daulatabad Fort & Chand Minar is a prominent heritage landmark in Maharashtra. ASI Ref: W-MH-A5, UNESCO Status: Tentative List (Monuments of Deccan Sultanate).",
    "architecture": "Style: Deccani Military Defense Fortification (Conical hill citadel with pitch-black maze). Construction Materials: Chiselled Basalt Mountain, Lime mortar, Cast bronze cannons. Dimensions: Conical hill height: 200 m (656 ft); Three concentric rings of curtain walls (Kala Kot, Mahakot, Amberkot).",
    "keyFacts": [
      "Ruler / Dynasty: Yadava Dynasty (King Bhillama V) & Tughlaq / Bahmani / Nizam Shahi",
      "Period: 1187 – 1636 CE (12th-17th Century)",
      "Architectural Style: Deccani Military Defense Fortification (Conical hill citadel with pitch-black maze)",
      "Location: Chhatrapati Sambhaji Nagar (Aurangabad), Maharashtra",
      "ASI Reference: W-MH-A5",
      "UNESCO: Tentative List (Monuments of Deccan Sultanate)"
    ],
    "period": "1187 – 1636 CE (12th-17th Century)"
  },
  {
    "placeId": "IND-HER-37",
    "shortStory": "Chosen by Chhatrapati Shivaji Maharaj as the capital of the sovereign Maratha Empire, where he was coronated as 'Chhatrapati' on June 6, 1674. Strategically situated in the Western Ghats surrounded by deep valleys on all sides, ensuring natural defense. The royal market street (Bazaar Peth) was elevated on plinths allowing Maratha horse riders to shop without dismounting.",
    "history": "Built during 1674 CE (Coronation Capital) under Maratha Empire (Chhatrapati Shivaji Maharaj / Hiroji Indulkar). Construction: Rough-hewn Basalt Stone, Timber frames, Lime concrete. Style: Maratha Indigenous Military Hill Fortress Architecture.",
    "significance": "Raigad Fort (Capital of Maratha Empire) is a prominent heritage landmark in Maharashtra. ASI Ref: W-MH-A6, UNESCO Status: Component of Maratha Military Landscapes UNESCO Nomination.",
    "architecture": "Style: Maratha Indigenous Military Hill Fortress Architecture. Construction Materials: Rough-hewn Basalt Stone, Timber frames, Lime concrete. Dimensions: Elevation: 820 m (2,700 ft) above sea level; Summit plateau: 2.5 km long by 1.5 km wide.",
    "keyFacts": [
      "Ruler / Dynasty: Maratha Empire (Chhatrapati Shivaji Maharaj / Hiroji Indulkar)",
      "Period: 1674 CE (Coronation Capital)",
      "Architectural Style: Maratha Indigenous Military Hill Fortress Architecture",
      "Location: Raigad District, Mahad, Maharashtra",
      "ASI Reference: W-MH-A6",
      "UNESCO: Component of Maratha Military Landscapes UNESCO Nomination"
    ],
    "period": "1674 CE (Coronation Capital)"
  },
  {
    "placeId": "IND-HER-38",
    "shortStory": "One of the only island sea fortresses in Indian history that remained unconquered despite furious naval and artillery assaults over centuries by the Marathas, the British East India Company, and the Portuguese. Held by the Siddis (naval warriors of Ethiopian/Abyssinian descent). Houses two natural freshwater spring reservoirs despite being completely surrounded by the salty waters of the Arabian Sea.",
    "history": "Built during 15th – 17th Century CE under Siddis of Janjira (Habshi/Abyssinian Naval Chieftains). Construction: Basalt Blocks, Lead and Molten Glass joints, High-strength lime-sand mortar. Style: Marine Coastal Bastion Architecture.",
    "significance": "Murud-Janjira Sea Fort is a prominent heritage landmark in Maharashtra. ASI Ref: W-MH-A7, UNESCO Status: Component of Maratha Military Landscapes Nomination.",
    "architecture": "Style: Marine Coastal Bastion Architecture. Construction Materials: Basalt Blocks, Lead and Molten Glass joints, High-strength lime-sand mortar. Dimensions: Oval island footprint: 22 acres; 19 rounded bastions rising 40 feet out of the Arabian Sea.",
    "keyFacts": [
      "Ruler / Dynasty: Siddis of Janjira (Habshi/Abyssinian Naval Chieftains)",
      "Period: 15th – 17th Century CE",
      "Architectural Style: Marine Coastal Bastion Architecture",
      "Location: Raigad District, Murud, Maharashtra",
      "ASI Reference: W-MH-A7",
      "UNESCO: Component of Maratha Military Landscapes Nomination"
    ],
    "period": "15th – 17th Century CE"
  },
  {
    "placeId": "IND-HER-39",
    "shortStory": "Constructed as the grand mausoleum of Mohammed Adil Shah, 7th Sultan of Bijapur. The central dome rests on intersecting eight-point arches without a single central pillar support. Its internal Whispering Gallery is an acoustic miracle: the softest whisper against the stone wall travels around the 44-meter gallery and can be heard clearly on the opposite side, while a single handclap echoes distinctly 7 to 11 times.",
    "history": "Built during 1626 – 1656 CE (17th Century) under Adil Shahi Dynasty (Sultan Mohammed Adil Shah). Construction: Dark Grey Basalt stone, Plaster masonry, Pendentive interlocking brick arch vaulting. Style: Deccani Indo-Islamic Classical Architecture.",
    "significance": "Gol Gumbaz (The Whispering Gallery) is a prominent heritage landmark in Karnataka. ASI Ref: S-KA-4, UNESCO Status: Tentative List (Monuments of Deccan Sultanate).",
    "architecture": "Style: Deccani Indo-Islamic Classical Architecture. Construction Materials: Dark Grey Basalt stone, Plaster masonry, Pendentive interlocking brick arch vaulting. Dimensions: Dome External Diameter: 44 m (144 ft); Height: 51 m (167 ft); Floor area: 1,700 sq m without central pillar supports.",
    "keyFacts": [
      "Ruler / Dynasty: Adil Shahi Dynasty (Sultan Mohammed Adil Shah)",
      "Period: 1626 – 1656 CE (17th Century)",
      "Architectural Style: Deccani Indo-Islamic Classical Architecture",
      "Location: Vijayapura (Bijapur) District, Bijapur, Karnataka",
      "ASI Reference: S-KA-4",
      "UNESCO: Tentative List (Monuments of Deccan Sultanate)"
    ],
    "period": "1626 – 1656 CE (17th Century)"
  },
  {
    "placeId": "IND-HER-40",
    "shortStory": "Official residence of the Wadiyar dynasty who ruled the Kingdom of Mysore. Built after the old wooden palace burned down during a royal wedding in 1897. Commissioned from British architect Henry Irwin. Famous worldwide for its spectacular Mysore Dasara festivities, where the Golden Throne is mounted atop royal caparisoned elephants in grand state procession.",
    "history": "Built during 1897 – 1912 CE (Designed by Henry Irwin) under Wadiyar Dynasty (Maharani Kempananjammanni & Maharaja Krishnaraja Wadiyar IV). Construction: Fine Grey Granite with Pink Marble Domes, Cast Iron Pillars, Bohemian Crystal Chandeliers, Teakwood carvings. Style: Indo-Saracenic with Neo-Classical, Rajput, and Gothic embellishments.",
    "significance": "Mysore Palace (Amba Vilas Palace) is a prominent heritage landmark in Karnataka. ASI Ref: KA-HER-1, UNESCO Status: Karnataka State Heritage Masterpiece.",
    "architecture": "Style: Indo-Saracenic with Neo-Classical, Rajput, and Gothic embellishments. Construction Materials: Fine Grey Granite with Pink Marble Domes, Cast Iron Pillars, Bohemian Crystal Chandeliers, Teakwood carvings. Dimensions: Facade Length: 75 m; Width: 48 m; Tower Height: 44 m; Palace grounds: 72 acres.",
    "keyFacts": [
      "Ruler / Dynasty: Wadiyar Dynasty (Maharani Kempananjammanni & Maharaja Krishnaraja Wadiyar IV)",
      "Period: 1897 – 1912 CE (Designed by Henry Irwin)",
      "Architectural Style: Indo-Saracenic with Neo-Classical, Rajput, and Gothic embellishments",
      "Location: Mysuru District, Mysuru, Karnataka",
      "ASI Reference: KA-HER-1",
      "UNESCO: Karnataka State Heritage Masterpiece"
    ],
    "period": "1897 – 1912 CE (Designed by Henry Irwin)"
  },
  {
    "placeId": "IND-HER-41",
    "shortStory": "One of the sacred Char Dham pilgrimage sites of Hinduism, dedicated to Lord Jagannath, Balabhadra, and Subhadra. The wooden deities are ritually remade every 12-19 years from sacred neem logs in the mysterious 'Nabakalebara' ceremony. The temple kitchen (Roshaghara) is the largest in the world, preparing pure Mahaprasad for up to 100,000 devotees daily using traditional earthen pots stacked seven high over wood fires.",
    "history": "Built during 1161 CE (12th Century) under Eastern Ganga Dynasty (King Anantavarman Chodaganga Deva). Construction: Chiselled Khondalite and Sandstone blocks, Iron clamps, Lime whitewash coat. Style: Kalinga Architecture (Bada Deula with Pancharatha plan).",
    "significance": "Jagannath Temple (Puri) is a prominent heritage landmark in Odisha. ASI Ref: E-OD-2, UNESCO Status: National Sacred Treasure of India.",
    "architecture": "Style: Kalinga Architecture (Bada Deula with Pancharatha plan). Construction Materials: Chiselled Khondalite and Sandstone blocks, Iron clamps, Lime whitewash coat. Dimensions: Main Deula Height: 65 m (214 ft); Enclosed compound area: 10.7 acres surrounded by 20-foot high Meghanada Pacheri walls.",
    "keyFacts": [
      "Ruler / Dynasty: Eastern Ganga Dynasty (King Anantavarman Chodaganga Deva)",
      "Period: 1161 CE (12th Century)",
      "Architectural Style: Kalinga Architecture (Bada Deula with Pancharatha plan)",
      "Location: Puri District, Puri, Odisha",
      "ASI Reference: E-OD-2",
      "UNESCO: National Sacred Treasure of India"
    ],
    "period": "1161 CE (12th Century)"
  },
  {
    "placeId": "IND-HER-42",
    "shortStory": "Infamous colonial penitentiary where Indian freedom fighters (including Veer Savarkar, Batukeshwar Dutt, and Yogendra Shukla) were exiled and subjected to inhuman solitary confinement and hard labour (operating heavy oil-pressing mills). Named 'Cellular' because each cell was designed to ensure total acoustic and visual isolation, preventing any prisoner communication. Declared a National Memorial in 1979.",
    "history": "Built during 1896 – 1906 CE (Turn of 20th Century) under British Raj (Public Works Department). Construction: Pucca Red Bricks shipped from Burma (Myanmar), Granite blocks, Cast iron gratings. Style: Jeremy Bentham Panopticon Surveillance Architecture.",
    "significance": "Cellular Jail (Kala Pani) is a prominent heritage landmark in Andaman and Nicobar Islands. ASI Ref: ASI National Memorial, UNESCO Status: National Heritage Monument of India.",
    "architecture": "Style: Jeremy Bentham Panopticon Surveillance Architecture. Construction Materials: Pucca Red Bricks shipped from Burma (Myanmar), Granite blocks, Cast iron gratings. Dimensions: Originally 7 three-storey wings radiating from a central watchtower; 693 individual solitary confinement cells (13.5ft x 7.5ft).",
    "keyFacts": [
      "Ruler / Dynasty: British Raj (Public Works Department)",
      "Period: 1896 – 1906 CE (Turn of 20th Century)",
      "Architectural Style: Jeremy Bentham Panopticon Surveillance Architecture",
      "Location: South Andaman, Port Blair, Andaman and Nicobar Islands",
      "ASI Reference: ASI National Memorial",
      "UNESCO: National Heritage Monument of India"
    ],
    "period": "1896 – 1906 CE (Turn of 20th Century)"
  },
  {
    "placeId": "IND-HER-43",
    "shortStory": "The foremost of the 51 sacred Shakti Peethas, where according to legend the yoni (reproductive organ) of Goddess Sati fell. Sacked by Kalapahar in 1553 and rebuilt in 1565 by Koch King Naranarayan and his general Chilarai, creating the unique 'Nilachal' architectural hybrid combining a rounded Nagara shikhara with an Islamic-style dome. Host to the annual Ambubachi Mela celebrating the Earth's fertility cycle.",
    "history": "Built during 8th – 9th Century (Origin); Rebuilt 1565 CE under Koch Dynasty (King Naranarayan & General Chilarai) & Ahom Kings. Construction: Local Sandstone plinth, Burnt brick dome, Brass kalasha finial. Style: Nilachal Architecture (Hemispherical beehive dome on cruciform plinth).",
    "significance": "Kamakhya Temple (Guwahati) is a prominent heritage landmark in Assam. ASI Ref: AS-HER-1, UNESCO Status: Assam State Heritage Monument.",
    "architecture": "Style: Nilachal Architecture (Hemispherical beehive dome on cruciform plinth). Construction Materials: Local Sandstone plinth, Burnt brick dome, Brass kalasha finial. Dimensions: Perched atop Nilachal Hill at 800 feet elevation; Complex of 10 Mahavidya temples.",
    "keyFacts": [
      "Ruler / Dynasty: Koch Dynasty (King Naranarayan & General Chilarai) & Ahom Kings",
      "Period: 8th – 9th Century (Origin); Rebuilt 1565 CE",
      "Architectural Style: Nilachal Architecture (Hemispherical beehive dome on cruciform plinth)",
      "Location: Kamrup Metropolitan, Guwahati, Assam",
      "ASI Reference: AS-HER-1",
      "UNESCO: Assam State Heritage Monument"
    ],
    "period": "8th – 9th Century (Origin); Rebuilt 1565 CE"
  },
  {
    "placeId": "IND-HER-44",
    "shortStory": "Rang Ghar ('House of Entertainment') is Asia's oldest surviving royal outdoor amphitheatre, where Ahom kings sat to watch buffalo fights, falconry, and wrestling during Rongali Bihu celebrations. The nearby Talatal Ghar palace featured three underground secret escape tunnels engineered to evacuate the royal family during Burmese or Mughal invasions, constructed with an extraordinary indigenous mortar made of sticky rice and duck eggs.",
    "history": "Built during 1744 – 1751 CE (18th Century) under Ahom Dynasty (Swargadeo Pramatta Singha & Rajeswar Singha). Construction: Flat Thin Bricks, Indigenous Mortar (Karoli-Bor: sticky rice, duck eggs, snail lime, and fish oil). Style: Indigenous Ahom Architecture (Inverted boat-shaped roof).",
    "significance": "Rang Ghar & Talatal Ghar (Ahom Kingdom) is a prominent heritage landmark in Assam. ASI Ref: NE-AS-1, UNESCO Status: Component of Ahom Monuments Tentative List.",
    "architecture": "Style: Indigenous Ahom Architecture (Inverted boat-shaped roof). Construction Materials: Flat Thin Bricks, Indigenous Mortar (Karoli-Bor: sticky rice, duck eggs, snail lime, and fish oil). Dimensions: Rang Ghar: 2-storey pavilion, 10m high x 27m wide; Talatal Ghar: 7-storey palace (3 subterranean).",
    "keyFacts": [
      "Ruler / Dynasty: Ahom Dynasty (Swargadeo Pramatta Singha & Rajeswar Singha)",
      "Period: 1744 – 1751 CE (18th Century)",
      "Architectural Style: Indigenous Ahom Architecture (Inverted boat-shaped roof)",
      "Location: Sivasagar District, Sivasagar, Assam",
      "ASI Reference: NE-AS-1",
      "UNESCO: Component of Ahom Monuments Tentative List"
    ],
    "period": "1744 – 1751 CE (18th Century)"
  },
  {
    "placeId": "IND-HER-45",
    "shortStory": "Commissioned by Emperor Lalitaditya Muktapida, the greatest military conqueror of the Karkota dynasty who expanded Kashmiri suzerainty into Central Asia. Built atop a plateau overlooking the entire Kashmir Valley. Synthesizes Greco-Roman Gandharan fluted columns, Roman arches, and Hindu sacred iconography. Destroyed in the early 15th century by Sultan Sikandar Butshikan.",
    "history": "Built during 8th Century CE (c. 725 – 756 CE) under Karkota Dynasty (Emperor Lalitaditya Muktapida). Construction: Massive Dressed Limestone ashlar blocks joined with iron dowels, Lime mortar. Style: Classical Kashmiri Architecture (Gandharan-Greco-Roman fusion with Trefoil arches).",
    "significance": "Martand Sun Temple is a prominent heritage landmark in Jammu and Kashmir. ASI Ref: N-JK-1, UNESCO Status: National Heritage Monument of India.",
    "architecture": "Style: Classical Kashmiri Architecture (Gandharan-Greco-Roman fusion with Trefoil arches). Construction Materials: Massive Dressed Limestone ashlar blocks joined with iron dowels, Lime mortar. Dimensions: Peristyle Courtyard: 67 m x 43 m; 84 fluted Doric-inspired colonnade pillars enclosing central sanctum.",
    "keyFacts": [
      "Ruler / Dynasty: Karkota Dynasty (Emperor Lalitaditya Muktapida)",
      "Period: 8th Century CE (c. 725 – 756 CE)",
      "Architectural Style: Classical Kashmiri Architecture (Gandharan-Greco-Roman fusion with Trefoil arches)",
      "Location: Anantnag District, Mattan, Jammu and Kashmir",
      "ASI Reference: N-JK-1",
      "UNESCO: National Heritage Monument of India"
    ],
    "period": "8th Century CE (c. 725 – 756 CE)"
  },
  {
    "placeId": "IND-HER-46",
    "shortStory": "Because alluvial Bengal lacks hard building stones, Malla kingdom craftsmen transformed fine river silt into baked red terracotta tiles, carving thousands of miniature narrative scenes of Krishna-lila and royal elephant processions. The Rasmancha, built in 1600 CE, is unique in all of India: a stepped brick pyramid surrounded by tiered galleries of arches where deities from all neighboring villages were assembled annually during the grand Ras festival.",
    "history": "Built during 16th – 17th Century CE under Malla Dynasty (Raja Bir Hambir & Raghunath Singha). Construction: Alluvial Clay Terracotta Baked Tiles, Laterite stone plinths. Style: Bengal Chala & Ratna Architecture (Curved thatched roof mimicry in terracotta).",
    "significance": "Bishnupur Terracotta Temples is a prominent heritage landmark in West Bengal. ASI Ref: E-WB-2, UNESCO Status: Tentative List (Temples at Bishnupur).",
    "architecture": "Style: Bengal Chala & Ratna Architecture (Curved thatched roof mimicry in terracotta). Construction Materials: Alluvial Clay Terracotta Baked Tiles, Laterite stone plinths. Dimensions: Rasmancha: 24m square pyramidal monument; Shyam Rai: Pancha-ratna (5-pinnacle) shrine.",
    "keyFacts": [
      "Ruler / Dynasty: Malla Dynasty (Raja Bir Hambir & Raghunath Singha)",
      "Period: 16th – 17th Century CE",
      "Architectural Style: Bengal Chala & Ratna Architecture (Curved thatched roof mimicry in terracotta)",
      "Location: Bankura District, Bishnupur, West Bengal",
      "ASI Reference: E-WB-2",
      "UNESCO: Tentative List (Temples at Bishnupur)"
    ],
    "period": "16th – 17th Century CE"
  },
  {
    "placeId": "IND-HER-47",
    "shortStory": "Built on the tortoiseshell-shaped hill 'Kurma Saila'. Legend states this is where the wounded divine bird Jatayu fell after battling Ravana during Sita's abduction (Lord Rama cried 'Le Pakshi' - Rise Bird). The famous Hanging Pillar hangs detached from the granite floor, supported only by the ceiling cantilever structure, baffling engineers for centuries.",
    "history": "Built during 1530 – 1545 CE (16th Century) under Vijayanagara Empire (Brothers Virupanna and Veeranna). Construction: Monolithic Granite Gneiss Outcrop (Kurma Saila hill), Fresco tempera pigments. Style: Vijayanagara Style (Monolithic Rock Carving & Frescoes).",
    "significance": "Lepakshi Veerabhadra Temple & Hanging Pillar is a prominent heritage landmark in Andhra Pradesh. ASI Ref: H-AP-1, UNESCO Status: Tentative List (Lepakshi Veerabhadra Temple).",
    "architecture": "Style: Vijayanagara Style (Monolithic Rock Carving & Frescoes). Construction Materials: Monolithic Granite Gneiss Outcrop (Kurma Saila hill), Fresco tempera pigments. Dimensions: Hanging Pillar: 70 pillars support the ceiling, with 1 pillar floating 1 inch off the floor; Monolithic Nandi: 4.5m high x 8.2m long.",
    "keyFacts": [
      "Ruler / Dynasty: Vijayanagara Empire (Brothers Virupanna and Veeranna)",
      "Period: 1530 – 1545 CE (16th Century)",
      "Architectural Style: Vijayanagara Style (Monolithic Rock Carving & Frescoes)",
      "Location: Sri Sathya Sai District, Lepakshi, Andhra Pradesh",
      "ASI Reference: H-AP-1",
      "UNESCO: Tentative List (Lepakshi Veerabhadra Temple)"
    ],
    "period": "1530 – 1545 CE (16th Century)"
  },
  {
    "placeId": "IND-HER-48",
    "shortStory": "Capital of the Early Chalukyas (then known as Vatapi), situated in a rugged red sandstone canyon. King Pulakeshin II famously defeated Emperor Harsha of Kannauj on the banks of Narmada River from this capital. Sacked in 642 CE by Pallava King Narasimhavarman I, who assumed the title 'Vatapikonda' (Conqueror of Vatapi).",
    "history": "Built during 540 – 578 CE (6th Century) under Early Chalukya Dynasty (Pulakeshin I & Mangalesha). Construction: Monolithic Red Sandstone Ravine Cliffs overlooking Agastya Lake. Style: Early Chalukyan Rock-Cut Architecture.",
    "significance": "Badami Cave Temples is a prominent heritage landmark in Karnataka. ASI Ref: S-KA-5, UNESCO Status: Tentative List (Evolution of Temple Architecture - Aihole-Badami-Pattadakal).",
    "architecture": "Style: Early Chalukyan Rock-Cut Architecture. Construction Materials: Monolithic Red Sandstone Ravine Cliffs overlooking Agastya Lake. Dimensions: Four rock-cut caves carved into cliffs (Cave 1: Shiva, Cave 2 & 3: Vishnu, Cave 4: Jain Tirthankaras).",
    "keyFacts": [
      "Ruler / Dynasty: Early Chalukya Dynasty (Pulakeshin I & Mangalesha)",
      "Period: 540 – 578 CE (6th Century)",
      "Architectural Style: Early Chalukyan Rock-Cut Architecture",
      "Location: Bagalkot District, Badami, Karnataka",
      "ASI Reference: S-KA-5",
      "UNESCO: Tentative List (Evolution of Temple Architecture - Aihole-Badami-Pattadakal)"
    ],
    "period": "540 – 578 CE (6th Century)"
  },
  {
    "placeId": "IND-HER-49",
    "shortStory": "Revered as the experimental 'cradle and laboratory of Hindu temple architecture' in India, where ancient guilds tested diverse shikhara designs, mandapas, and layouts. The Meguti Temple contains the priceless 634 CE Sanskrit stone inscription composed by court poet Ravikirti, which accurately dates the Mahabharata war and celebrates Pulakeshin II's military defeat of Emperor Harsha.",
    "history": "Built during 5th – 8th Century CE under Early Chalukya Dynasty. Construction: Reddish Sandstone blocks, Ashlar masonry without bonding cement. Style: Early Experimental Hindu & Jain Architecture (Apsidal Durga Temple).",
    "significance": "Aihole (Cradle of Indian Temple Architecture) is a prominent heritage landmark in Karnataka. ASI Ref: S-KA-6, UNESCO Status: Tentative List (Aihole Complex).",
    "architecture": "Style: Early Experimental Hindu & Jain Architecture (Apsidal Durga Temple). Construction Materials: Reddish Sandstone blocks, Ashlar masonry without bonding cement. Dimensions: Over 125 stone temples clustered over the Malaprabha River valley.",
    "keyFacts": [
      "Ruler / Dynasty: Early Chalukya Dynasty",
      "Period: 5th – 8th Century CE",
      "Architectural Style: Early Experimental Hindu & Jain Architecture (Apsidal Durga Temple)",
      "Location: Bagalkot District, Aihole, Karnataka",
      "ASI Reference: S-KA-6",
      "UNESCO: Tentative List (Aihole Complex)"
    ],
    "period": "5th – 8th Century CE"
  },
  {
    "placeId": "IND-HER-50",
    "shortStory": "Largest and best-preserved fort in Kerala. Unlike traditional administrative palaces, Bekal was built purely as a military sea defense bastion. Its observation tower at the center was designed so a commander could spot incoming naval warships 15 km away, with multi-level embrasures allowing musket and cannon fire at enemy vessels regardless of sea tides.",
    "history": "Built during 1650 CE (17th Century) under Keladi Nayakas (Shivappa Nayaka) & Tipu Sultan. Construction: Chiselled Red Laterite Stone Blocks, Lime plaster, Heavy sea masonry. Style: Malabar Coastal Military Defense Architecture.",
    "significance": "Bekal Fort (Sea Bastion of Malabar) is a prominent heritage landmark in Kerala. ASI Ref: S-KL-1, UNESCO Status: State Heritage Coastal Monument.",
    "architecture": "Style: Malabar Coastal Military Defense Architecture. Construction Materials: Chiselled Red Laterite Stone Blocks, Lime plaster, Heavy sea masonry. Dimensions: Footprint: 40 acres; Keyhole-shaped coastal peninsula jutting into the Arabian Sea.",
    "keyFacts": [
      "Ruler / Dynasty: Keladi Nayakas (Shivappa Nayaka) & Tipu Sultan",
      "Period: 1650 CE (17th Century)",
      "Architectural Style: Malabar Coastal Military Defense Architecture",
      "Location: Kasaragod District, Bekal, Kerala",
      "ASI Reference: S-KL-1",
      "UNESCO: State Heritage Coastal Monument"
    ],
    "period": "1650 CE (17th Century)"
  },
  {
    "placeId": "IND-ART-01",
    "shortStory": "Excavated in 1926 by archaeologist Ernest J.H. Mackay at Mohenjo-daro (HR area). Archaeologist Sir Mortimer Wheeler wrote: 'There is her insolent little stance, she's about fifteen years old, but she stands there with her hands on her hips and her legs slightly forward, perfectly confident of herself and the world.' Proves that 4,500 years ago, Harappans mastered complex lost-wax metallurgical casting centuries before the Aegean civilizations.",
    "history": "Built during c. 2500 BCE (4,500 years old) under Indus Valley Civilization (Mature Harappan Phase). Construction: High-tin Bronze (Alloy of copper and tin with natural lead traces). Style: Cire-Perdue (Lost-Wax) Bronze Metallurgical Casting.",
    "significance": "Harappan Bronze 'Dancing Girl' is a prominent heritage landmark in Delhi (National Museum). ASI Ref: National Museum Accession No. HR 5721/195, UNESCO Status: National Treasure of India (Global Icon).",
    "architecture": "Style: Cire-Perdue (Lost-Wax) Bronze Metallurgical Casting. Construction Materials: High-tin Bronze (Alloy of copper and tin with natural lead traces). Dimensions: Height: 10.5 cm (4.1 in); Width: 5 cm; Depth: 2.5 cm; Weight: approx. 332 grams.",
    "keyFacts": [
      "Ruler / Dynasty: Indus Valley Civilization (Mature Harappan Phase)",
      "Period: c. 2500 BCE (4,500 years old)",
      "Architectural Style: Cire-Perdue (Lost-Wax) Bronze Metallurgical Casting",
      "Location: Central Delhi, Janpath, Delhi (National Museum)",
      "ASI Reference: National Museum Accession No. HR 5721/195",
      "UNESCO: National Treasure of India (Global Icon)"
    ],
    "period": "c. 2500 BCE (4,500 years old)"
  },
  {
    "placeId": "IND-ART-02",
    "shortStory": "Originally crowned the 15-meter Ashokan Pillar at Deer Park in Sarnath, marking the exact spot where Gautama Buddha delivered his first sermon (Dharmachakra Pravartana). The four roaring lions symbolize the Dharma radiating fearless truth to all four corners of the universe. Adopted on 26 January 1950 as the official National Emblem of the Republic of India; the Ashoka Chakra adorns the center of the Indian National Flag.",
    "history": "Built during c. 250 BCE (3rd Century BCE) under Maurya Empire (Emperor Ashoka the Great). Construction: Single monolithic block of fine-grained Chunar Sandstone. Style: Mauryan Court Art (High Glass-like Mirror Polish).",
    "significance": "Lion Capital of Ashoka (National Emblem of India) is a prominent heritage landmark in Uttar Pradesh (Sarnath Archaeological Museum). ASI Ref: ASI Museum Sarnath Acc. No. 544, UNESCO Status: Adopted as National Emblem of India (Jan 26, 1950).",
    "architecture": "Style: Mauryan Court Art (High Glass-like Mirror Polish). Construction Materials: Single monolithic block of fine-grained Chunar Sandstone. Dimensions: Height: 2.15 m (7.05 ft); Base Diameter: 0.9 m; Mirror polished abacus.",
    "keyFacts": [
      "Ruler / Dynasty: Maurya Empire (Emperor Ashoka the Great)",
      "Period: c. 250 BCE (3rd Century BCE)",
      "Architectural Style: Mauryan Court Art (High Glass-like Mirror Polish)",
      "Location: Varanasi District, Sarnath, Uttar Pradesh (Sarnath Archaeological Museum)",
      "ASI Reference: ASI Museum Sarnath Acc. No. 544",
      "UNESCO: Adopted as National Emblem of India (Jan 26, 1950)"
    ],
    "period": "c. 250 BCE (3rd Century BCE)"
  },
  {
    "placeId": "IND-ART-03",
    "shortStory": "Unearthed in 1917 on the banks of the Ganges River at Didarganj near Patna by villagers who saw it protruding from the muddy riverbank. Celebrated internationally as the crowning masterpiece of ancient Indian figural sculpture. Her sensuous posture, anatomically precise proportions, and glass-like mirror polish demonstrate the miraculous lapidary techniques of Mauryan stone sculptors.",
    "history": "Built during 3rd – 2nd Century BCE under Maurya Empire / Early Shunga Period. Construction: Single block of buff-coloured Chunar Sandstone with exquisite Mauryan mirror glaze. Style: Mauryan Imperial Monumental Sculpture with Luster Polish.",
    "significance": "Didarganj Yakshi (Chauri Bearer) is a prominent heritage landmark in Bihar (Bihar Museum). ASI Ref: Bihar Museum Display No. 1, UNESCO Status: National Treasure of India.",
    "architecture": "Style: Mauryan Imperial Monumental Sculpture with Luster Polish. Construction Materials: Single block of buff-coloured Chunar Sandstone with exquisite Mauryan mirror glaze. Dimensions: Height: 1.63 m (5 ft 4 in, 6 ft 4 in including pedestal); Carved completely in the round.",
    "keyFacts": [
      "Ruler / Dynasty: Maurya Empire / Early Shunga Period",
      "Period: 3rd – 2nd Century BCE",
      "Architectural Style: Mauryan Imperial Monumental Sculpture with Luster Polish",
      "Location: Patna District, Patna, Bihar (Bihar Museum)",
      "ASI Reference: Bihar Museum Display No. 1",
      "UNESCO: National Treasure of India"
    ],
    "period": "3rd – 2nd Century BCE"
  },
  {
    "placeId": "IND-ART-04",
    "shortStory": "Regarded by philosopher Ananda Coomaraswamy and astrophysicist Carl Sagan as one of the most profound metaphors for modern quantum physics and cosmic cycles of matter. Cast as a single solid piece using the lost-wax technique. Demonstrates the five divine activities (Panchakritya): Shrishti (Creation), Sthiti (Preservation), Samhara (Destruction), Tirobhava (Illusion), and Anugraha (Grace).",
    "history": "Built during 10th – 11th Century CE under Imperial Chola Dynasty (Queen Sembiyan Mahadevi era). Construction: Panchaloha / Ashtadhatu (Five to Eight Metal Bronze Alloy: Copper, Tin, Zinc, Lead, traces of Gold/Silver). Style: Classical Chola Lost-Wax Bronze Metallurgy (Silpa Shastra canon).",
    "significance": "Chola Bronze Nataraja (Cosmic Dancer) is a prominent heritage landmark in Delhi & Tamil Nadu (National Museum / Government Museum Chennai). ASI Ref: National Museum Acc. No. 56.124, UNESCO Status: Global Masterpiece of Indian Art.",
    "architecture": "Style: Classical Chola Lost-Wax Bronze Metallurgy (Silpa Shastra canon). Construction Materials: Panchaloha / Ashtadhatu (Five to Eight Metal Bronze Alloy: Copper, Tin, Zinc, Lead, traces of Gold/Silver). Dimensions: Height: 96 cm; Width: 83 cm; Prabhamandala arch with 32 flame tongues.",
    "keyFacts": [
      "Ruler / Dynasty: Imperial Chola Dynasty (Queen Sembiyan Mahadevi era)",
      "Period: 10th – 11th Century CE",
      "Architectural Style: Classical Chola Lost-Wax Bronze Metallurgy (Silpa Shastra canon)",
      "Location: Central Delhi / Egmore, Chennai, Delhi & Tamil Nadu (National Museum / Government Museum Chennai)",
      "ASI Reference: National Museum Acc. No. 56.124",
      "UNESCO: Global Masterpiece of Indian Art"
    ],
    "period": "10th – 11th Century CE"
  },
  {
    "placeId": "IND-ART-05",
    "shortStory": "Named 'Chahar-Aina' (literally 'Four Mirrors') because its four polished steel plates reflected light like mirrors, conceptually deflecting the evil eye and enemy arrows. Worn over a coat of fine riveted chainmail (Zirah). Capable of withstanding direct sword slashes and early lead matchlock musket balls at distance.",
    "history": "Built during Late 16th – 17th Century CE under Mughal Empire (Emperor Akbar & Jahangir era). Construction: Crucible Damascus Steel (Wootz), 24k Gold Koftgari Calligraphic Inlay, Velvet quilted padding. Style: Indo-Persian Plate & Mail Metallurgy.",
    "significance": "Mughal Imperial Chahar-Aina Armoured Cuirass is a prominent heritage landmark in Delhi (National Museum Arms Gallery). ASI Ref: Arms & Armor Collection Acc. No. 60.1179, UNESCO Status: Rare Combat Armour Collection.",
    "architecture": "Style: Indo-Persian Plate & Mail Metallurgy. Construction Materials: Crucible Damascus Steel (Wootz), 24k Gold Koftgari Calligraphic Inlay, Velvet quilted padding. Dimensions: Four curved plates (Front, Back, 2 Side Flanks); Height: 38 cm; Total Weight: approx. 6.2 kg.",
    "keyFacts": [
      "Ruler / Dynasty: Mughal Empire (Emperor Akbar & Jahangir era)",
      "Period: Late 16th – 17th Century CE",
      "Architectural Style: Indo-Persian Plate & Mail Metallurgy",
      "Location: Central Delhi, Janpath, Delhi (National Museum Arms Gallery)",
      "ASI Reference: Arms & Armor Collection Acc. No. 60.1179",
      "UNESCO: Rare Combat Armour Collection"
    ],
    "period": "Late 16th – 17th Century CE"
  },
  {
    "placeId": "IND-ART-06",
    "shortStory": "Recovered from Tipu Sultan's personal bedchamber in the fortress of Srirangapatna following the Fourth Anglo-Mysore War on May 4, 1799. Made from pure South Indian Wootz steel, which was smelted in sealed clay crucibles in Kodumanal and Golconda, containing microscopic iron carbide nanotubes that gave the blade legendary sharpness capable of slicing cleanly through European iron helmets.",
    "history": "Built during 1782 – 1799 CE (Late 18th Century) under Kingdom of Mysore (Tipu Sultan, the Tiger of Mysore). Construction: Indian Wootz Crucible High-Carbon Steel (Ukkul), Gold Calligraphy Inlay, Tiger-stripe Damascening. Style: Deccani Wootz Steel Metallurgical Craftsmanship.",
    "significance": "Tipu Sultan's Wootz Steel 'Tiger of Mysore' Bedchamber Sword is a prominent heritage landmark in Delhi (National Museum / ASI Red Fort Museum). ASI Ref: National Museum / ASI Memorial Acc. No. 58.42/1, UNESCO Status: National Historic Treasure.",
    "architecture": "Style: Deccani Wootz Steel Metallurgical Craftsmanship. Construction Materials: Indian Wootz Crucible High-Carbon Steel (Ukkul), Gold Calligraphy Inlay, Tiger-stripe Damascening. Dimensions: Blade Length: 84 cm (33 in); Weight: 1.15 kg; Curved single-edged razor profile.",
    "keyFacts": [
      "Ruler / Dynasty: Kingdom of Mysore (Tipu Sultan, the Tiger of Mysore)",
      "Period: 1782 – 1799 CE (Late 18th Century)",
      "Architectural Style: Deccani Wootz Steel Metallurgical Craftsmanship",
      "Location: Central Delhi, Old Delhi & Janpath, Delhi (National Museum / ASI Red Fort Museum)",
      "ASI Reference: National Museum / ASI Memorial Acc. No. 58.42/1",
      "UNESCO: National Historic Treasure"
    ],
    "period": "1782 – 1799 CE (Late 18th Century)"
  },
  {
    "placeId": "IND-ART-07",
    "shortStory": "Famously used by Chhatrapati Shivaji Maharaj during the historic encounter at the foothills of Pratapgad Fort on November 10, 1659. When the towering Bijapur general Afzal Khan attempted to crush Shivaji in an embrace, Shivaji slashed Khan with the concealed Wagh Nakh hidden within his left palm and finished him with a Bichuwa dagger, turning the tide of Maratha history.",
    "history": "Built during 1659 CE (17th Century) under Maratha Empire (Chhatrapati Shivaji Maharaj). Construction: Forged High-Carbon Iron & Steel, Dual Ring finger retainers. Style: Indigenous Maratha Close-Quarter Weapon Design.",
    "significance": "Maratha Wagh Nakh (Tiger Claws Concealed Weapon) is a prominent heritage landmark in Maharashtra (CSMVS Mumbai / Central Museum Satara). ASI Ref: CSMVS Historic Weapons Register No. WN-1659, UNESCO Status: State Icon of Maratha Chivalry.",
    "architecture": "Style: Indigenous Maratha Close-Quarter Weapon Design. Construction Materials: Forged High-Carbon Iron & Steel, Dual Ring finger retainers. Dimensions: Width across crossbar: 9 cm; 4 Razor-sharp curved iron talons (Length: 5.5 cm each).",
    "keyFacts": [
      "Ruler / Dynasty: Maratha Empire (Chhatrapati Shivaji Maharaj)",
      "Period: 1659 CE (17th Century)",
      "Architectural Style: Indigenous Maratha Close-Quarter Weapon Design",
      "Location: Mumbai / Satara District, Maharashtra (CSMVS Mumbai / Central Museum Satara)",
      "ASI Reference: CSMVS Historic Weapons Register No. WN-1659",
      "UNESCO: State Icon of Maratha Chivalry"
    ],
    "period": "1659 CE (17th Century)"
  },
  {
    "placeId": "IND-ART-08",
    "shortStory": "Belonged to Empress Noor Jahan, the powerful co-ruler of the Mughal Empire under Emperor Jahangir. Carved from a single flawless block of Khotan nephrite jade imported via the Silk Route. Indian hardstone carvers were renowned for drilling, abrading, and polishing jade using corundum slurry, inlaying precious gemstones into cold jade using pure pliable 24k gold leaf ribbons.",
    "history": "Built during c. 1615 – 1625 CE (17th Century) under Mughal Empire (Empress Noor Jahan & Emperor Jahangir). Construction: Pure White Nephrite (Kashgar Jade), Indian Wootz Watered Steel Blade, Inlaid Rubies and Emeralds in 24k Pure Gold (Kundan setting). Style: Imperial Mughal Hardstone Lapidary & Wootz Metallurgy.",
    "significance": "Noor Jahan's White Nephrite Jade Hilt Dagger is a prominent heritage landmark in Telangana (Salar Jung Museum, Hyderabad). ASI Ref: SJM Accession No. 42-XXX/Arms, UNESCO Status: National Masterpiece Collection.",
    "architecture": "Style: Imperial Mughal Hardstone Lapidary & Wootz Metallurgy. Construction Materials: Pure White Nephrite (Kashgar Jade), Indian Wootz Watered Steel Blade, Inlaid Rubies and Emeralds in 24k Pure Gold (Kundan setting). Dimensions: Total Length: 32.5 cm; Blade Length: 20.5 cm; Curved double-edged profile with reinforced armor-piercing tip.",
    "keyFacts": [
      "Ruler / Dynasty: Mughal Empire (Empress Noor Jahan & Emperor Jahangir)",
      "Period: c. 1615 – 1625 CE (17th Century)",
      "Architectural Style: Imperial Mughal Hardstone Lapidary & Wootz Metallurgy",
      "Location: Hyderabad District, Dar-ul-Shifa, Telangana (Salar Jung Museum, Hyderabad)",
      "ASI Reference: SJM Accession No. 42-XXX/Arms",
      "UNESCO: National Masterpiece Collection"
    ],
    "period": "c. 1615 – 1625 CE (17th Century)"
  },
  {
    "placeId": "IND-ART-09",
    "shortStory": "War elephants functioned as the heavy armored battle tanks of the medieval Indian battlefield. The full suit protected the beast from enemy musket balls, crossbow bolts, and pike charges. Elephants wearing this armor also held 3-foot curved steel swords attached to their tusks to smash enemy infantry formations.",
    "history": "Built during 16th – 17th Century CE under Mughal Empire / Rajput Kingdoms. Construction: 5,840 Steel and Brass Interlocking Plates connected by 8,000 Mail Rings, Lined with thick felt and padded quilted canvas. Style: Heavy Combat Plate-and-Mail Equine/Pachyderm Armor.",
    "significance": "Mughal Elephant Combat Armor (Gaj Charma) is a prominent heritage landmark in Delhi & Rajasthan (National Museum / Mehrangarh Museum). ASI Ref: National Museum Acc. No. 62.450, UNESCO Status: World's Largest Historic Animal Armor.",
    "architecture": "Style: Heavy Combat Plate-and-Mail Equine/Pachyderm Armor. Construction Materials: 5,840 Steel and Brass Interlocking Plates connected by 8,000 Mail Rings, Lined with thick felt and padded quilted canvas. Dimensions: Complete suit weight: approx. 118 kg (260 lbs); Covers entire forehead, trunk, ears, flanks, and hindquarters of a full-grown battle elephant.",
    "keyFacts": [
      "Ruler / Dynasty: Mughal Empire / Rajput Kingdoms",
      "Period: 16th – 17th Century CE",
      "Architectural Style: Heavy Combat Plate-and-Mail Equine/Pachyderm Armor",
      "Location: Central Delhi / Jodhpur, Delhi & Rajasthan (National Museum / Mehrangarh Museum)",
      "ASI Reference: National Museum Acc. No. 62.450",
      "UNESCO: World's Largest Historic Animal Armor"
    ],
    "period": "16th – 17th Century CE"
  },
  {
    "placeId": "IND-ART-10",
    "shortStory": "Considered an unmatched optical illusion carved into solid stone. Italian sculptor G.B. Benzoni carved the veil so thin and delicate that the stone appears transparent, revealing the facial contours beneath. Acquired in Rome in 1876 by Mir Turab Ali Khan (Salar Jung I), Prime Minister of the Nizam of Hyderabad. One of only four known originals by Benzoni in the entire world.",
    "history": "Built during 1876 CE (19th Century) under Sculpted by Italian Master Giovanni Battista Benzoni. Construction: Single monolithic block of Pure White Italian Carrara Marble. Style: Neoclassical Marble Illusionist Carving.",
    "significance": "Veiled Rebecca Marble Sculpture is a prominent heritage landmark in Telangana (Salar Jung Museum, Hyderabad). ASI Ref: SJM European Statuary Reg. No. 1876-BZ, UNESCO Status: Acquired by Salar Jung I in Rome, 1876.",
    "architecture": "Style: Neoclassical Marble Illusionist Carving. Construction Materials: Single monolithic block of Pure White Italian Carrara Marble. Dimensions: Height: 167 cm; Life-size standing maiden on round marble pedestal.",
    "keyFacts": [
      "Ruler / Dynasty: Sculpted by Italian Master Giovanni Battista Benzoni",
      "Period: 1876 CE (19th Century)",
      "Architectural Style: Neoclassical Marble Illusionist Carving",
      "Location: Hyderabad District, Dar-ul-Shifa, Telangana (Salar Jung Museum, Hyderabad)",
      "ASI Reference: SJM European Statuary Reg. No. 1876-BZ",
      "UNESCO: Acquired by Salar Jung I in Rome, 1876"
    ],
    "period": "1876 CE (19th Century)"
  },
  {
    "placeId": "IND-ART-11",
    "shortStory": "India's punch-marked coins (Puranas/Karshapanas) are among the earliest coinages in world history, mentioned in Panini's Ashtadhyayi and Kautilya's Arthashastra. The Gupta gold dinars mark the zenith of Indian numismatic artistry, depicting Samudragupta as a musician king playing the veena on one side and the goddess of fortune Lakshmi on the reverse, accompanied by intricate Sanskrit metrical legends in Gupta Brahmi script.",
    "history": "Built during 6th Century BCE – 5th Century CE under Mauryan Empire, Kushan Empire, and Gupta Dynasty (Samudragupta & Chandragupta II). Construction: High-purity Silver (Karshapana) and High-purity 24-Karat Gold (Dinar). Style: Classical Ancient Indian Die-Struck and Punch-Marked Coinage.",
    "significance": "Ancient Indian Punch-Marked Silver Karshapana & Gupta Gold Dinars is a prominent heritage landmark in West Bengal & Delhi (Indian Museum Kolkata / National Museum). ASI Ref: Indian Museum Coin Cabinet Vault No. 1, UNESCO Status: National Numismatic Masterpiece Collection.",
    "architecture": "Style: Classical Ancient Indian Die-Struck and Punch-Marked Coinage. Construction Materials: High-purity Silver (Karshapana) and High-purity 24-Karat Gold (Dinar). Dimensions: Diameter: 18mm to 24mm; Weight: Silver (3.4g, 32 rattis), Gold Dinar (7.8g to 8.2g).",
    "keyFacts": [
      "Ruler / Dynasty: Mauryan Empire, Kushan Empire, and Gupta Dynasty (Samudragupta & Chandragupta II)",
      "Period: 6th Century BCE – 5th Century CE",
      "Architectural Style: Classical Ancient Indian Die-Struck and Punch-Marked Coinage",
      "Location: Kolkata / Central Delhi, West Bengal & Delhi (Indian Museum Kolkata / National Museum)",
      "ASI Reference: Indian Museum Coin Cabinet Vault No. 1",
      "UNESCO: National Numismatic Masterpiece Collection"
    ],
    "period": "6th Century BCE – 5th Century CE"
  },
  {
    "placeId": "IND-ART-12",
    "shortStory": "Unique to the Indian subcontinent. Held like a brass knuckle with fingers around the dual horizontal bars, allowing the warrior to channel their entire body weight directly into a linear punch. The thickened diamond-cross section tip was specifically engineered to pierce riveted chainmail and quilted iron coats. Highly favored by Rajput warriors for ceremonial tiger-hunting on foot.",
    "history": "Built during 14th – 18th Century CE under Rajput, Mughal, and Vijayanagara Armies. Construction: Crucible Wootz Steel Blade, Thickened diamond-cross section armour-piercing point, Gold Koftgari on side bars. Style: Wootz Steel Push-Thrust Armor Penetrator.",
    "significance": "Katar (Indian Double-Edged Push Dagger) is a prominent heritage landmark in Rajasthan & Delhi (City Palace Jaipur / National Museum). ASI Ref: Royal Silehkhana Armory Inv. No. K-402, UNESCO Status: Iconic Indian Martial Weapon.",
    "architecture": "Style: Wootz Steel Push-Thrust Armor Penetrator. Construction Materials: Crucible Wootz Steel Blade, Thickened diamond-cross section armour-piercing point, Gold Koftgari on side bars. Dimensions: Length: 42 cm; Blade: 26 cm triangular straight double-edged blade; Side bars: 2 parallel steel side guards connected by dual crossbars.",
    "keyFacts": [
      "Ruler / Dynasty: Rajput, Mughal, and Vijayanagara Armies",
      "Period: 14th – 18th Century CE",
      "Architectural Style: Wootz Steel Push-Thrust Armor Penetrator",
      "Location: Jaipur / Central Delhi, Rajasthan & Delhi (City Palace Jaipur / National Museum)",
      "ASI Reference: Royal Silehkhana Armory Inv. No. K-402",
      "UNESCO: Iconic Indian Martial Weapon"
    ],
    "period": "14th – 18th Century CE"
  },
  {
    "placeId": "IND-GJ-04",
    "shortStory": "The only complete and unchanged pre-Mughal Islamic capital city in India. Sultan Mahmud Begada besieged the Khichi Chauhan Rajput hilltop fortress of Pavagadh for 20 months before capturing it in 1484, founding his grand royal capital Champaner at its base. The Jama Masjid features central dome lanterns that illuminate the prayer hall with daylight while maintaining cool air flow. The Kalika Mata Temple atop Pavagadh peak is a revered ancient Shakti Peetha with a modern ropeway.",
    "history": "Built during 8th – 16th Century CE under Chavda / Khichi Chauhan Rajputs & Gujarat Sultanate (Mahmud Begada). Construction: Local Golden-Yellow Sandstone, Porphyritic basalt rock, Interlocking stone masonry. Style: Indo-Saracenic Gujarat Sultanate Architecture (Syncretic Hindu-Muslim).",
    "significance": "Champaner-Pavagadh Archaeological Park is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-4, UNESCO Status: 1101 (Inscribed 2004).",
    "architecture": "Style: Indo-Saracenic Gujarat Sultanate Architecture (Syncretic Hindu-Muslim). Construction Materials: Local Golden-Yellow Sandstone, Porphyritic basalt rock, Interlocking stone masonry. Dimensions: Park Area: 1,329 hectares with buffer zone of 2,912 hectares; Pavagadh peak: 800m high.",
    "keyFacts": [
      "Ruler / Dynasty: Chavda / Khichi Chauhan Rajputs & Gujarat Sultanate (Mahmud Begada)",
      "Period: 8th – 16th Century CE",
      "Architectural Style: Indo-Saracenic Gujarat Sultanate Architecture (Syncretic Hindu-Muslim)",
      "Location: Panchmahal District, Champaner, Gujarat",
      "ASI Reference: W-GJ-4",
      "UNESCO: 1101 (Inscribed 2004)"
    ],
    "period": "8th – 16th Century CE"
  },
  {
    "placeId": "IND-GJ-05",
    "shortStory": "Constructed by Sidi Saiyyed, an Abyssinian/Habshi general in the royal army of the Gujarat Sultanate, in the final year before Gujarat was annexed by Mughal Emperor Akbar in 1573. The western wall contains twin semi-circular stone jalis depicting intertwined banyan tree branches and palm foliage so delicately perforated they look like woven lace rather than solid sandstone. Chosen as the official emblem and insignia of the Indian Institute of Management Ahmedabad (IIMA).",
    "history": "Built during 1572 – 1573 CE (Late 16th Century) under Gujarat Sultanate (Sidi Saiyyed / Sultan Muzaffar Shah III). Construction: Yellow Dhrangadhra Sandstone chiselled into ultra-fine openwork tracery. Style: Gujarat Sultanate Architectural Filigree.",
    "significance": "Sidi Saiyyed Mosque (The Tree of Life Jali) is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-5, UNESCO Status: Component of Historic City of Ahmadabad UNESCO Site 1551.",
    "architecture": "Style: Gujarat Sultanate Architectural Filigree. Construction Materials: Yellow Dhrangadhra Sandstone chiselled into ultra-fine openwork tracery. Dimensions: Twin Ten-foot Semi-Circular Pierced Stone Lattice Windows (Jalis).",
    "keyFacts": [
      "Ruler / Dynasty: Gujarat Sultanate (Sidi Saiyyed / Sultan Muzaffar Shah III)",
      "Period: 1572 – 1573 CE (Late 16th Century)",
      "Architectural Style: Gujarat Sultanate Architectural Filigree",
      "Location: Ahmedabad District, Old City Ahmedabad, Gujarat",
      "ASI Reference: W-GJ-5",
      "UNESCO: Component of Historic City of Ahmadabad UNESCO Site 1551"
    ],
    "period": "1572 – 1573 CE (Late 16th Century)"
  },
  {
    "placeId": "IND-GJ-06",
    "shortStory": "Commissioned by Queen Rudabai, wife of Vaghela chieftain Rana Veer Singh of Dandai Desh. When Veer Singh was killed in battle by Sultan Mahmud Begada, Begada was captivated by Rudabai's beauty and proposed marriage. She agreed on the condition that he finish the sacred stepwell her husband had begun. Upon its completion in 1498, Rani Rudabai inspected the work, circumambulated the waters, and jumped into the well to join her husband in death rather than submit to the Sultan.",
    "history": "Built during 1498 CE (Late 15th Century) under Vaghela Rajput Dynasty (Rani Rudabai) & Mahmud Begada. Construction: Fine Sandstone, Dry-ashlar interlocking stone joints, Lime mortar. Style: Solanki-Islamic Indo-Saracenic Subterranean Architecture.",
    "significance": "Adalaj Stepwell (Rudabai Stepwell) is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-6, UNESCO Status: National Protected Monument of India.",
    "architecture": "Style: Solanki-Islamic Indo-Saracenic Subterranean Architecture. Construction Materials: Fine Sandstone, Dry-ashlar interlocking stone joints, Lime mortar. Dimensions: Length: 75 m; 5 Storeys subterranean depth; Octagonal central shaft opening to the sky.",
    "keyFacts": [
      "Ruler / Dynasty: Vaghela Rajput Dynasty (Rani Rudabai) & Mahmud Begada",
      "Period: 1498 CE (Late 15th Century)",
      "Architectural Style: Solanki-Islamic Indo-Saracenic Subterranean Architecture",
      "Location: Gandhinagar District, Adalaj, Gujarat",
      "ASI Reference: W-GJ-6",
      "UNESCO: National Protected Monument of India"
    ],
    "period": "1498 CE (Late 15th Century)"
  },
  {
    "placeId": "IND-GJ-07",
    "shortStory": "The world's earliest known engineered tidal dockyard, connecting ancient India to Mesopotamia (Sumer), Bahrain (Dilmun), and Oman (Magan) via the Gulf of Khambhat and Sabarmati River basin. Harappan engineers understood tidal dynamics, designing a masonry lock-gate system: high tide opened the inlet channel to let cargo boats float into the basin, while the sluice gate trapped water at low tide so ships remained buoyant for unloading.",
    "history": "Built during 2400 BCE – 1900 BCE (Bronze Age, 4,400 years old) under Indus Valley Civilization (Mature Harappan Maritime Merchants). Construction: Kiln-fired Water-resistant Red Clay Bricks (Standardized 1:2:4 ratio), Gypsum-lime waterproof plaster. Style: Harappan Hydraulic Maritime Civil Engineering & Kiln-Burnt Brick Dock.",
    "significance": "Lothal: Ancient Harappan Port & Tidal Dockyard is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-7, UNESCO Status: Tentative List (Archaeological Remains of Lothal).",
    "architecture": "Style: Harappan Hydraulic Maritime Civil Engineering & Kiln-Burnt Brick Dock. Construction Materials: Kiln-fired Water-resistant Red Clay Bricks (Standardized 1:2:4 ratio), Gypsum-lime waterproof plaster. Dimensions: Dockyard Basin: 214 m long x 36 m wide x 4.2 m deep; Acropolis and Lower Town.",
    "keyFacts": [
      "Ruler / Dynasty: Indus Valley Civilization (Mature Harappan Maritime Merchants)",
      "Period: 2400 BCE – 1900 BCE (Bronze Age, 4,400 years old)",
      "Architectural Style: Harappan Hydraulic Maritime Civil Engineering & Kiln-Burnt Brick Dock",
      "Location: Ahmedabad District, Saragwala village, Dholka, Gujarat",
      "ASI Reference: W-GJ-7",
      "UNESCO: Tentative List (Archaeological Remains of Lothal)"
    ],
    "period": "2400 BCE – 1900 BCE (Bronze Age, 4,400 years old)"
  },
  {
    "placeId": "IND-GJ-08",
    "shortStory": "Revered as the eternal shrine of Lord Shiva. Destroyed and rebuilt repeatedly across historical centuries—sacked by Mahmud of Ghazni (1026 CE), Alauddin Khilji's generals (1299 CE), and Aurangzeb (1706 CE). Rebuilt with great reverence by Queen Ahilyabai Holkar of Indore in 1783. Following India's independence, iron-man Deputy Prime Minister Sardar Vallabhbhai Patel resolved in November 1947 to resurrect Somnath to its original ancient glory, inaugurated in 1951 by President Dr. Rajendra Prasad.",
    "history": "Built during Ancient Origin; Reconstructed 1951 CE under Yadavas, Solankis (Kumarapala), Ahilyabai Holkar & Sardar Vallabhbhai Patel. Construction: Dhrangadhra Yellow Sandstone blocks, Red lead copper dowels, Gold-plated Kalasha flagstaff. Style: Kailash Mahameru Prasad (Classical Māru-Gurjara Temple Architecture).",
    "significance": "Somnath Temple (Prabhas Patan) is a prominent heritage landmark in Gujarat. ASI Ref: Shree Somnath Trust / State Heritage, UNESCO Status: Adyaprathama Jyotirlinga of India.",
    "architecture": "Style: Kailash Mahameru Prasad (Classical Māru-Gurjara Temple Architecture). Construction Materials: Dhrangadhra Yellow Sandstone blocks, Red lead copper dowels, Gold-plated Kalasha flagstaff. Dimensions: Shikhara Height: 47 m (155 ft); 10-tonne Kalash finial; Overlooks Triveni Sangam and Arabian Sea.",
    "keyFacts": [
      "Ruler / Dynasty: Yadavas, Solankis (Kumarapala), Ahilyabai Holkar & Sardar Vallabhbhai Patel",
      "Period: Ancient Origin; Reconstructed 1951 CE",
      "Architectural Style: Kailash Mahameru Prasad (Classical Māru-Gurjara Temple Architecture)",
      "Location: Gir Somnath District, Veraval, Gujarat",
      "ASI Reference: Shree Somnath Trust / State Heritage",
      "UNESCO: Adyaprathama Jyotirlinga of India"
    ],
    "period": "Ancient Origin; Reconstructed 1951 CE"
  },
  {
    "placeId": "IND-GJ-09",
    "shortStory": "One of the four sacred Char Dham pilgrimage sites of Hinduism, situated on the western tip of the Saurashtra peninsula where the Gomti River meets the Arabian Sea. Archaeological marine excavations conducted by Dr. S.R. Rao of the National Institute of Oceanography (NIO) discovered submerged stone anchors, defensive bastions, and jetty pillars underwater, verifying the epic underwater city of Dwarka described in the Mahabharata.",
    "history": "Built during Origin: 2,200 years ago; Present structural temple: 15th – 16th Century CE under Vajranabha (Grandson of Krishna, Traditional) & Chaulukya / Solanki Dynasty. Construction: Dressed Limestone and Soft Sandstone, Teak timbering, 52-yard silk flagstaff. Style: Māru-Gurjara Chalukya Temple Architecture.",
    "significance": "Dwarkadhish Temple (Jagat Mandir, Dwarka) is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-8, UNESCO Status: Char Dham of India & National Sacred Treasure.",
    "architecture": "Style: Māru-Gurjara Chalukya Temple Architecture. Construction Materials: Dressed Limestone and Soft Sandstone, Teak timbering, 52-yard silk flagstaff. Dimensions: Height: 78 m (256 ft); 5 Storeys supported by 72 monolithic carved stone pillars.",
    "keyFacts": [
      "Ruler / Dynasty: Vajranabha (Grandson of Krishna, Traditional) & Chaulukya / Solanki Dynasty",
      "Period: Origin: 2,200 years ago; Present structural temple: 15th – 16th Century CE",
      "Architectural Style: Māru-Gurjara Chalukya Temple Architecture",
      "Location: Devbhumi Dwarka District, Dwarka, Gujarat",
      "ASI Reference: W-GJ-8",
      "UNESCO: Char Dham of India & National Sacred Treasure"
    ],
    "period": "Origin: 2,200 years ago; Present structural temple: 15th – 16th Century CE"
  },
  {
    "placeId": "IND-GJ-10",
    "shortStory": "A miracle of Indian epigraphy: three of the greatest imperial rulers across 700 years recorded their history on the very same granite rock. Ashoka (250 BCE) inscribed his moral edicts advocating non-violence (Ahimsa) and medical treatment for animals. Rudradaman I (150 CE) recorded his rebuilding of the Sudarshana Lake dam without levying any tax on citizens. Skandagupta (455 CE) documented repelling the brutal Huna barbarian invasion.",
    "history": "Built during 250 BCE – 455 CE (spanning 700 years on a single boulder) under Maurya Empire (Ashoka), Western Kshatrapas (Rudradaman I), and Gupta Empire (Skandagupta). Construction: Monolithic Basaltic Granite Boulder enclosed inside an ASI protective heritage pavilion. Style: Imperial Rock Edicts & Early Sanskrit Epigraphy.",
    "significance": "Junagadh Rock Inscriptions of Ashoka, Rudradaman & Skandagupta is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-9, UNESCO Status: National Epigraphical Monument of India.",
    "architecture": "Style: Imperial Rock Edicts & Early Sanskrit Epigraphy. Construction Materials: Monolithic Basaltic Granite Boulder enclosed inside an ASI protective heritage pavilion. Dimensions: Granite Boulder Circumference: 23 meters; 14 Edicts of Ashoka, Rudradaman inscription, Skandagupta inscription.",
    "keyFacts": [
      "Ruler / Dynasty: Maurya Empire (Ashoka), Western Kshatrapas (Rudradaman I), and Gupta Empire (Skandagupta)",
      "Period: 250 BCE – 455 CE (spanning 700 years on a single boulder)",
      "Architectural Style: Imperial Rock Edicts & Early Sanskrit Epigraphy",
      "Location: Junagadh District, Girnar foothills, Gujarat",
      "ASI Reference: W-GJ-9",
      "UNESCO: National Epigraphical Monument of India"
    ],
    "period": "250 BCE – 455 CE (spanning 700 years on a single boulder)"
  },
  {
    "placeId": "IND-GJ-11",
    "shortStory": "Founded around 319 BCE by Chandragupta Maurya and inhabited continuously for over 2,300 years. Resisted a legendary 12-year siege by Siddharaj Jaisinh of Patan against Chudasama ruler Ra Khengar. The Adi Kadi Vav and Navghan Kuvo were excavated directly into solid rock to ensure the citadel never ran out of water during multi-year sieges; local folklore says 'Adi Kadi Vav and Navghan Kuvo: if you haven't seen them, you've lived for nothing'.",
    "history": "Built during 319 BCE (Origin); 2nd – 15th Century CE under Maurya Empire (Chandragupta Maurya) & Chudasama Rajputs (Ra Navghan). Construction: Monolithic Bedrock Basalt, Chiseled rock-cut stairwells, Bronze artillery cannons. Style: Ancient Rock-Cut Fortress & Subterranean Stepwells.",
    "significance": "Uparkot Fort & Buddhist Rock-Cut Caves is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-10, UNESCO Status: Ancient Citadel of Saurashtra.",
    "architecture": "Style: Ancient Rock-Cut Fortress & Subterranean Stepwells. Construction Materials: Monolithic Bedrock Basalt, Chiseled rock-cut stairwells, Bronze artillery cannons. Dimensions: Moat Depth: 20m cut into solid rock; Uparkot Caves: 3-tiered rock-cut monastery with bathing cisterns.",
    "keyFacts": [
      "Ruler / Dynasty: Maurya Empire (Chandragupta Maurya) & Chudasama Rajputs (Ra Navghan)",
      "Period: 319 BCE (Origin); 2nd – 15th Century CE",
      "Architectural Style: Ancient Rock-Cut Fortress & Subterranean Stepwells",
      "Location: Junagadh District, Junagadh, Gujarat",
      "ASI Reference: W-GJ-10",
      "UNESCO: Ancient Citadel of Saurashtra"
    ],
    "period": "319 BCE (Origin); 2nd – 15th Century CE"
  },
  {
    "placeId": "IND-GJ-12",
    "shortStory": "Revered as the holiest of all pilgrimage places (Siddhakshetra) in Jainism, where 23 of the 24 Tirthankaras (except Neminatha) sanctified the hill. It is the only mountain in the world with over 800 temples built atop it. Every evening at sunset, all priests and devotees must descend the sacred hill—not even the priests are permitted to sleep on the hill at night, leaving the holy city to the gods alone. In 2014, Palitana became the world's first legally 100% vegetarian city.",
    "history": "Built during 11th Century CE – Present (spanning 900 years of continuous carving) under Solanki Kings & Jain Merchant Guilds (Vimal Shah, Vastupala, Tejapala). Construction: Pure Makrana and Rajasthan White Marble, Intricately carved stone brackets. Style: Apex Māru-Gurjara White Marble Temple Architecture.",
    "significance": "Palitana Temples on Shatrunjaya Hill is a prominent heritage landmark in Gujarat. ASI Ref: Anandji Kalyanji Pedhi / State Heritage, UNESCO Status: World's Largest Cluster of Temple Shrines on a Single Hill.",
    "architecture": "Style: Apex Māru-Gurjara White Marble Temple Architecture. Construction Materials: Pure Makrana and Rajasthan White Marble, Intricately carved stone brackets. Dimensions: Over 863 white marble temples grouped into 9 fortified tuks (enclosures); 3,500 stone steps to summit.",
    "keyFacts": [
      "Ruler / Dynasty: Solanki Kings & Jain Merchant Guilds (Vimal Shah, Vastupala, Tejapala)",
      "Period: 11th Century CE – Present (spanning 900 years of continuous carving)",
      "Architectural Style: Apex Māru-Gurjara White Marble Temple Architecture",
      "Location: Bhavnagar District, Palitana, Gujarat",
      "ASI Reference: Anandji Kalyanji Pedhi / State Heritage",
      "UNESCO: World's Largest Cluster of Temple Shrines on a Single Hill"
    ],
    "period": "11th Century CE – Present (spanning 900 years of continuous carving)"
  },
  {
    "placeId": "IND-GJ-13",
    "shortStory": "Vadnagar (ancient Anartapura / Chamatkarpur) has witnessed continuous human habitation for over 2,750 years since 750 BCE, through Mauryan, Kshatrapa, Gupta, Maitraka, and Solanki eras without ever being abandoned. The twin Kirti Toranas were erected as ceremonial victory gateways to welcome returning victorious armies. Excavations by ASI in 2023 unearthed a 7-stage archaeological trench spanning from pre-Christian times to modern day, proving deep international Buddhist connections visited by Chinese pilgrim Hiuen Tsang in 640 CE.",
    "history": "Built during 12th Century CE (c. 1150 CE) under Chaulukya / Solanki Dynasty (King Kumarapala / Jayasimha Siddharaja). Construction: Dressed Red and Yellow Sandstone with deep-relief carvings without mortar. Style: Solanki Ornamental Free-Standing Stone Gateways.",
    "significance": "Vadnagar Kirti Torana & Archaeological Site is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-11, UNESCO Status: Tentative List (Vadnagar Historic Town).",
    "architecture": "Style: Solanki Ornamental Free-Standing Stone Gateways. Construction Materials: Dressed Red and Yellow Sandstone with deep-relief carvings without mortar. Dimensions: Height: 12 m (40 ft); Twin freestanding pillars supporting archway pediment.",
    "keyFacts": [
      "Ruler / Dynasty: Chaulukya / Solanki Dynasty (King Kumarapala / Jayasimha Siddharaja)",
      "Period: 12th Century CE (c. 1150 CE)",
      "Architectural Style: Solanki Ornamental Free-Standing Stone Gateways",
      "Location: Mehsana District, Vadnagar, Gujarat",
      "ASI Reference: W-GJ-11",
      "UNESCO: Tentative List (Vadnagar Historic Town)"
    ],
    "period": "12th Century CE (c. 1150 CE)"
  },
  {
    "placeId": "IND-GJ-15",
    "shortStory": "Described by modern architect Le Corbusier as 'the Acropolis of Ahmedabad' due to its perfect proportional harmony and spatial rhythm. Built around the shrine of Sufi saint Sheikh Ahmed Khattu Ganj Baksh, the spiritual advisor who counselled Sultan Ahmed Shah to found Ahmedabad. Uniquely devoid of Persian arches and minarets; instead, it relies completely on indigenous Indian trabeated post-and-beam stone architecture.",
    "history": "Built during 1445 – 1510 CE (15th Century) under Gujarat Sultanate (Sultan Muhammad Shah, Qutbuddin Ahmad Shah, Mahmud Begada). Construction: Local Dhrangadhra Sandstone, Brass jali screens, Interlocking stone pillars. Style: Indo-Saracenic Gujarat Islamic (Without minarets, using post-and-beam trabeated system).",
    "significance": "Sarkhej Roza (The Acropolis of Ahmedabad) is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-12, UNESCO Status: Component of Historic City of Ahmadabad UNESCO Site 1551.",
    "architecture": "Style: Indo-Saracenic Gujarat Islamic (Without minarets, using post-and-beam trabeated system). Construction Materials: Local Dhrangadhra Sandstone, Brass jali screens, Interlocking stone pillars. Dimensions: Complex: 34 acres around a central 17-acre excavated royal lake (Ahmed Sar).",
    "keyFacts": [
      "Ruler / Dynasty: Gujarat Sultanate (Sultan Muhammad Shah, Qutbuddin Ahmad Shah, Mahmud Begada)",
      "Period: 1445 – 1510 CE (15th Century)",
      "Architectural Style: Indo-Saracenic Gujarat Islamic (Without minarets, using post-and-beam trabeated system)",
      "Location: Ahmedabad District, Makarba / Sarkhej, Gujarat",
      "ASI Reference: W-GJ-12",
      "UNESCO: Component of Historic City of Ahmadabad UNESCO Site 1551"
    ],
    "period": "1445 – 1510 CE (15th Century)"
  },
  {
    "placeId": "IND-GJ-16",
    "shortStory": "One of India's most surreal architectural wonders, combining Islamic domes, Gothic French windows, and European baroque scrollwork. Constructed as the final resting place of Nawab Mahabat Khan II and his vizier Baha-ud-din. The vizier's tomb (Baha-ud-din Maqbara) features four standalone corner minarets with open spiral external stone stairs encircling each tower, creating an optical illusion resembling twisting marble confectionery.",
    "history": "Built during 1878 – 1892 CE (Late 19th Century) under Babi Dynasty (Nawabs of Junagadh: Nawab Mahabat Khan II & Baha-ud-din Bhar). Construction: Fine-grained Yellow Sandstone, Carved marble jalis, Silver plated wooden doors. Style: Eclectic Indo-Islamic, Neo-Gothic, French Baroque and Anglo-Indian Fusion.",
    "significance": "Mahabat Maqbara Complex is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-13, UNESCO Status: State Heritage Architectural Marvel.",
    "architecture": "Style: Eclectic Indo-Islamic, Neo-Gothic, French Baroque and Anglo-Indian Fusion. Construction Materials: Fine-grained Yellow Sandstone, Carved marble jalis, Silver plated wooden doors. Dimensions: Twin mausoleums: Mahabat Maqbara (1878) and Baha-ud-din Maqbara (1892) with four 4-storey corner minarets.",
    "keyFacts": [
      "Ruler / Dynasty: Babi Dynasty (Nawabs of Junagadh: Nawab Mahabat Khan II & Baha-ud-din Bhar)",
      "Period: 1878 – 1892 CE (Late 19th Century)",
      "Architectural Style: Eclectic Indo-Islamic, Neo-Gothic, French Baroque and Anglo-Indian Fusion",
      "Location: Junagadh District, Junagadh, Gujarat",
      "ASI Reference: W-GJ-13",
      "UNESCO: State Heritage Architectural Marvel"
    ],
    "period": "1878 – 1892 CE (Late 19th Century)"
  },
  {
    "placeId": "IND-GJ-17",
    "shortStory": "Constructed by a lady of the royal court, Bai Harir (locally called Dada Harir), who served as the superintendent of Sultan Mahmud Begada's royal household. Features priceless dual stone inscriptions: one in classical Sanskrit and one in Arabic, both recording the construction date (December 1499) and invoking divine blessings on travelers and beasts of burden walking along trade routes north toward Patan.",
    "history": "Built during 1499 CE (Late 15th Century) under Gujarat Sultanate (Built by Bai Harir Sultani, royal superintendent of the harem). Construction: Dressed Sandstone, Sandstone block pillars with carved scrollwork. Style: Solanki-Sultanate Subterranean Trabeated Architecture.",
    "significance": "Dada Harir Stepwell (Bai Harir Vav) is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-14, UNESCO Status: National Protected Monument of India.",
    "architecture": "Style: Solanki-Sultanate Subterranean Trabeated Architecture. Construction Materials: Dressed Sandstone, Sandstone block pillars with carved scrollwork. Dimensions: Length: 60 m; Width: 12 m; 5 subterranean storeys dropping to spiral well shaft.",
    "keyFacts": [
      "Ruler / Dynasty: Gujarat Sultanate (Built by Bai Harir Sultani, royal superintendent of the harem)",
      "Period: 1499 CE (Late 15th Century)",
      "Architectural Style: Solanki-Sultanate Subterranean Trabeated Architecture",
      "Location: Ahmedabad District, Asarwa, Gujarat",
      "ASI Reference: W-GJ-14",
      "UNESCO: National Protected Monument of India"
    ],
    "period": "1499 CE (Late 15th Century)"
  },
  {
    "placeId": "IND-GJ-18",
    "shortStory": "Aina Mahal was created by master artisan Ram Singh Malam, a Kutchi sailor who was shipwrecked in Europe, spent 18 years in the Netherlands studying glass-blowing, tile-casting, and clockmaking, and returned to Kutch to create this Venetian mirror palace for Rao Lakhpatji. Prag Mahal alongside was built in Italian Gothic style out of local red sandstone. Both palaces survived the devastating 7.7-magnitude 2001 Gujarat earthquake and were painstakingly restored.",
    "history": "Built during Aina Mahal: 1752 CE; Prag Mahal: 1879 CE under Jadeja Rajput Dynasty (Rao Lakhpatji & Maharao Pragmalji II). Construction: Local Sandstone, Venetian Glass mirrors, Delftware tiles, Indian Teakwood, Italian Carrara Marble. Style: Indo-Venetian Fusion (Aina Mahal) & Italian Gothic (Prag Mahal by Col. Wilkins).",
    "significance": "Aina Mahal & Prag Mahal is a prominent heritage landmark in Gujarat. ASI Ref: Kutch Heritage / State Protected, UNESCO Status: Royal Palace Complex of the Maharaos of Kutch.",
    "architecture": "Style: Indo-Venetian Fusion (Aina Mahal) & Italian Gothic (Prag Mahal by Col. Wilkins). Construction Materials: Local Sandstone, Venetian Glass mirrors, Delftware tiles, Indian Teakwood, Italian Carrara Marble. Dimensions: Clock Tower Height: 45 m (150 ft) with panoramic view of Bhuj town; Durbar Hall: 80ft x 40ft.",
    "keyFacts": [
      "Ruler / Dynasty: Jadeja Rajput Dynasty (Rao Lakhpatji & Maharao Pragmalji II)",
      "Period: Aina Mahal: 1752 CE; Prag Mahal: 1879 CE",
      "Architectural Style: Indo-Venetian Fusion (Aina Mahal) & Italian Gothic (Prag Mahal by Col. Wilkins)",
      "Location: Kutch District, Bhuj, Gujarat",
      "ASI Reference: Kutch Heritage / State Protected",
      "UNESCO: Royal Palace Complex of the Maharaos of Kutch"
    ],
    "period": "Aina Mahal: 1752 CE; Prag Mahal: 1879 CE"
  },
  {
    "placeId": "IND-GJ-19",
    "shortStory": "Commissioned by the greatest Solanki emperor, Siddharaj Jaisinh. Conceived as a colossal pentagonal artificial lake surrounded by 1,000 individual shrines dedicated to Lord Shiva (Sahastra-Linga). Water from the Saraswati River was diverted through an engineered 300-meter masonry canal into a circular desilting chamber before entering the main reservoir, combining civic water management with sacred worship.",
    "history": "Built during 1140 CE (12th Century) under Chaulukya / Solanki Dynasty (Siddharaj Jaisinh). Construction: Dressed Sandstone Masonry, Stone water inlets and siltation basins, Siphon channels. Style: Solanki Hydraulic Engineering & Temple Architecture.",
    "significance": "Sahastralinga Talav is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-15, UNESCO Status: National Protected Hydraulic Wonder.",
    "architecture": "Style: Solanki Hydraulic Engineering & Temple Architecture. Construction Materials: Dressed Sandstone Masonry, Stone water inlets and siltation basins, Siphon channels. Dimensions: Water Reservoir Perimeter: 5 km (3 miles); Over 1,000 miniature Shiva shrines along the embankments.",
    "keyFacts": [
      "Ruler / Dynasty: Chaulukya / Solanki Dynasty (Siddharaj Jaisinh)",
      "Period: 1140 CE (12th Century)",
      "Architectural Style: Solanki Hydraulic Engineering & Temple Architecture",
      "Location: Patan District, Patan, Gujarat",
      "ASI Reference: W-GJ-15",
      "UNESCO: National Protected Hydraulic Wonder"
    ],
    "period": "1140 CE (12th Century)"
  },
  {
    "placeId": "IND-GJ-20",
    "shortStory": "Constructed during the devastating Gujarat famine of 1846–1848 by wealthy Jain merchant Sheth Hutheesing Kesrisinh as a famine relief charity project, employing hundreds of master stone artisans for over two years. When Kesrisinh died prematurely at age 49, his devoted widow Harkunwar Ba oversaw its completion at a total cost of over 1 million rupees, creating one of the most stunning white marble sanctuaries in western India.",
    "history": "Built during 1848 CE (Mid 19th Century) under Built by Sheth Hutheesing Kesrisinh & completed by Harkunwar Ba. Construction: Pure White Makrana Marble, Intricately carved lattice screens, Gilded kalashas. Style: Apex Māru-Gurjara White Marble Architecture (Designed by Premchand Salat).",
    "significance": "Hutheesing Jain Temple is a prominent heritage landmark in Gujarat. ASI Ref: Hutheesing Family Trust / Heritage, UNESCO Status: Component of Ahmedabad Heritage City.",
    "architecture": "Style: Apex Māru-Gurjara White Marble Architecture (Designed by Premchand Salat). Construction Materials: Pure White Makrana Marble, Intricately carved lattice screens, Gilded kalashas. Dimensions: Courtyard with 52 individual shrines (Devakulikas); Central 2-storey Mandapa with 12 pillars.",
    "keyFacts": [
      "Ruler / Dynasty: Built by Sheth Hutheesing Kesrisinh & completed by Harkunwar Ba",
      "Period: 1848 CE (Mid 19th Century)",
      "Architectural Style: Apex Māru-Gurjara White Marble Architecture (Designed by Premchand Salat)",
      "Location: Ahmedabad District, Bardolpura, Gujarat",
      "ASI Reference: Hutheesing Family Trust / Heritage",
      "UNESCO: Component of Ahmedabad Heritage City"
    ],
    "period": "1848 CE (Mid 19th Century)"
  },
  {
    "placeId": "IND-GJ-21",
    "shortStory": "Commissioned as a summer coastal retreat by Maharao Vijayaraji of Kutch, constructed under the supervision of royal architects from Jaipur, Rajasthan, and stone carvers from Mewar and Bengal. Features a private 2-km pristine sandy beach on the Arabian Sea with its own sanctuary of blue bulls (Nilgai) and migratory flamingoes. Frequently featured in Indian cinema (notably 'Hum Dil De Chuke Sanam').",
    "history": "Built during 1929 CE (Early 20th Century) under Jadeja Rajput Dynasty (Maharao Vijayaraji of Kutch). Construction: Carved Red Sandstone from Orchha and Rajasthan, Colored glass windows, Teak woodwork. Style: Classical Rajput-Mughal Fusion with Jali screens and Bengal Chhatris.",
    "significance": "Vijay Vilas Palace is a prominent heritage landmark in Gujarat. ASI Ref: Kutch Royal Trust / State Heritage, UNESCO Status: Royal Seaside Palace of the Maharaos of Kutch.",
    "architecture": "Style: Classical Rajput-Mughal Fusion with Jali screens and Bengal Chhatris. Construction Materials: Carved Red Sandstone from Orchha and Rajasthan, Colored glass windows, Teak woodwork. Dimensions: Estate: 450 acres on private Arabian Sea beach; 3-storey palace with central high dome.",
    "keyFacts": [
      "Ruler / Dynasty: Jadeja Rajput Dynasty (Maharao Vijayaraji of Kutch)",
      "Period: 1929 CE (Early 20th Century)",
      "Architectural Style: Classical Rajput-Mughal Fusion with Jali screens and Bengal Chhatris",
      "Location: Kutch District, Mandvi, Gujarat",
      "ASI Reference: Kutch Royal Trust / State Heritage",
      "UNESCO: Royal Seaside Palace of the Maharaos of Kutch"
    ],
    "period": "1929 CE (Early 20th Century)"
  },
  {
    "placeId": "IND-GJ-22",
    "shortStory": "Constructed in 1411 CE as the fortified royal citadel immediately after Sultan Ahmed Shah founded the city of Ahmedabad on the banks of the Sabarmati River. Teen Darwaza ('Three Gates') served as the monumental ceremonial gateway leading from the fort into the grand royal square (Maidan-e-Shahi), from where sultans inspected marches and threw gold coins to crowds. An eternal flame has been kept lit inside a niche in Teen Darwaza for over 600 years, honoring Goddess Lakshmi.",
    "history": "Built during 1411 CE (15th Century) under Gujarat Sultanate (Sultan Ahmed Shah). Construction: Dressed Red Sandstone, Yellow Sandstone, Teak timbering, Lime concrete. Style: Indo-Islamic Gujarat Military Citadel Architecture.",
    "significance": "Bhadra Fort & Teen Darwaza is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-16, UNESCO Status: Component of Historic City of Ahmadabad UNESCO Site 1551.",
    "architecture": "Style: Indo-Islamic Gujarat Military Citadel Architecture. Construction Materials: Dressed Red Sandstone, Yellow Sandstone, Teak timbering, Lime concrete. Dimensions: Citadel Area: 43 acres; 14 rounded defensive bastions; Teen Darwaza: 25ft high triple arches.",
    "keyFacts": [
      "Ruler / Dynasty: Gujarat Sultanate (Sultan Ahmed Shah)",
      "Period: 1411 CE (15th Century)",
      "Architectural Style: Indo-Islamic Gujarat Military Citadel Architecture",
      "Location: Ahmedabad District, Old Ahmedabad, Gujarat",
      "ASI Reference: W-GJ-16",
      "UNESCO: Component of Historic City of Ahmadabad UNESCO Site 1551"
    ],
    "period": "1411 CE (15th Century)"
  },
  {
    "placeId": "IND-GJ-23",
    "shortStory": "Constructed in 1424 by Sultan Ahmed Shah, celebrated as one of the finest mosques in the Indian subcontinent. Demonstrates exceptional syncretism: local Hindu and Jain stone carvers were employed, who integrated traditional temple motifs (hanging bell-and-chain pendants, lotus rosettes) into the 260 columns. The clerestory ceiling design creates natural convection currents, drawing hot air upward and keeping the vast prayer hall cool even in 45°C summers.",
    "history": "Built during 1424 CE (15th Century) under Gujarat Sultanate (Sultan Ahmed Shah I). Construction: Chiselled Yellow Sandstone, White marble floor inlays, Interlocking post-and-lintel stone columns. Style: Indo-Islamic Synthesis with Hindu & Jain Temple Trabeated Pillars.",
    "significance": "Jama Masjid of Ahmedabad is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-17, UNESCO Status: Component of Historic City of Ahmadabad UNESCO Site 1551.",
    "architecture": "Style: Indo-Islamic Synthesis with Hindu & Jain Temple Trabeated Pillars. Construction Materials: Chiselled Yellow Sandstone, White marble floor inlays, Interlocking post-and-lintel stone columns. Dimensions: Courtyard: 75m x 66m; Prayer hall supported by 260 carved stone pillars with 15 domes.",
    "keyFacts": [
      "Ruler / Dynasty: Gujarat Sultanate (Sultan Ahmed Shah I)",
      "Period: 1424 CE (15th Century)",
      "Architectural Style: Indo-Islamic Synthesis with Hindu & Jain Temple Trabeated Pillars",
      "Location: Ahmedabad District, Old City, Manek Chowk, Gujarat",
      "ASI Reference: W-GJ-17",
      "UNESCO: Component of Historic City of Ahmadabad UNESCO Site 1551"
    ],
    "period": "1424 CE (15th Century)"
  },
  {
    "placeId": "IND-GJ-24",
    "shortStory": "One of the most perplexing mechanical engineering mysteries of medieval India: when one minaret is shaken or vibrated gently at the top, the other minaret begins to oscillate in resonance after a few seconds, while the connecting stone arch between them remains completely motionless. British engineers in the 19th century even partially dismantled one minaret to discover the secret mechanism but could not decipher the flexible engineering joints, and were unable to put it back together.",
    "history": "Built during 1452 CE (15th Century) under Gujarat Sultanate (Sidi Bashir, slave of Sultan Ahmed Shah). Construction: Yellow Sandstone with deep ornamental stone carvings, Flexible mortar joints. Style: Indo-Islamic Carved Sandstone Minaret Architecture.",
    "significance": "Jhulta Minar (The Shaking Minarets of Sidi Bashir) is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-18, UNESCO Status: Component of Ahmedabad Heritage Matrix.",
    "architecture": "Style: Indo-Islamic Carved Sandstone Minaret Architecture. Construction Materials: Yellow Sandstone with deep ornamental stone carvings, Flexible mortar joints. Dimensions: Height: 21.3 m (70 ft); Three storeys with carved stone balconies.",
    "keyFacts": [
      "Ruler / Dynasty: Gujarat Sultanate (Sidi Bashir, slave of Sultan Ahmed Shah)",
      "Period: 1452 CE (15th Century)",
      "Architectural Style: Indo-Islamic Carved Sandstone Minaret Architecture",
      "Location: Ahmedabad District, Sakar Bazar / Sarangpur, Gujarat",
      "ASI Reference: W-GJ-18",
      "UNESCO: Component of Ahmedabad Heritage Matrix"
    ],
    "period": "1452 CE (15th Century)"
  },
  {
    "placeId": "IND-GJ-25",
    "shortStory": "The spiritual and political headquarters from which Mahatma Gandhi directed India's non-violent struggle for freedom from 1917 to 1930. On March 12, 1930, Gandhi marched out of this ashram with 78 volunteers on the historic 385-km Dandi Salt March, vowing never to return to the ashram until India had achieved Purna Swaraj (total independence) from the British Empire.",
    "history": "Built during 1917 – 1930 CE (Early 20th Century) under Mahatma Gandhi (Mohandas Karamchand Gandhi). Construction: White-washed lime walls, Mangalore terracotta tiled roofs, Teakwood pillars, Polished stone floors. Style: Minimalist Vernacular Indigenous Architecture (Charles Correa Memorial Museum).",
    "significance": "Sabarmati Ashram (Hriday Kunj) is a prominent heritage landmark in Gujarat. ASI Ref: National Memorial (Ministry of Culture), UNESCO Status: National Sacred Historic Monument of India.",
    "architecture": "Style: Minimalist Vernacular Indigenous Architecture (Charles Correa Memorial Museum). Construction Materials: White-washed lime walls, Mangalore terracotta tiled roofs, Teakwood pillars, Polished stone floors. Dimensions: Ashram grounds: 36 acres overlooking the tranquil Sabarmati River.",
    "keyFacts": [
      "Ruler / Dynasty: Mahatma Gandhi (Mohandas Karamchand Gandhi)",
      "Period: 1917 – 1930 CE (Early 20th Century)",
      "Architectural Style: Minimalist Vernacular Indigenous Architecture (Charles Correa Memorial Museum)",
      "Location: Ahmedabad District, Sabarmati, Gujarat",
      "ASI Reference: National Memorial (Ministry of Culture)",
      "UNESCO: National Sacred Historic Monument of India"
    ],
    "period": "1917 – 1930 CE (Early 20th Century)"
  },
  {
    "placeId": "IND-GJ-26",
    "shortStory": "Once a bustling maritime port generating 100,000 koris daily from maritime customs (hence 'Lakhpat' - the city of hundred thousands) when the Indus River flowed directly through it into the sea. Guru Nanak Dev Ji stayed here on his journey to Mecca. In 1819, a catastrophic 7.8-magnitude earthquake created the 'Allah Bund' (Mound of God), which permanently dammed and diverted the Indus River 100 km westward into Sindh, overnight turning Lakhpat into an evocative desert ghost town.",
    "history": "Built during 1801 CE (Early 19th Century) under Jadeja Rulers of Kutch (Jamadar Fateh Muhammad). Construction: Dressed Hard Sandstone Blocks, Heavy crenellated battlements, Lime mortar. Style: Frontier Military Rampart & Coastal Fortress Architecture.",
    "significance": "Lakhpat Fort & Gurdwara Pehli Patshahi is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-19, UNESCO Status: National Protected Western Frontier Fortress.",
    "architecture": "Style: Frontier Military Rampart & Coastal Fortress Architecture. Construction Materials: Dressed Hard Sandstone Blocks, Heavy crenellated battlements, Lime mortar. Dimensions: Fort Rampart Perimeter: 7 km continuous battlements; Overlooks Kori Creek and Great Rann of Kutch.",
    "keyFacts": [
      "Ruler / Dynasty: Jadeja Rulers of Kutch (Jamadar Fateh Muhammad)",
      "Period: 1801 CE (Early 19th Century)",
      "Architectural Style: Frontier Military Rampart & Coastal Fortress Architecture",
      "Location: Kutch District, Lakhpat, Gujarat",
      "ASI Reference: W-GJ-19",
      "UNESCO: National Protected Western Frontier Fortress"
    ],
    "period": "1801 CE (Early 19th Century)"
  },
  {
    "placeId": "IND-GJ-27",
    "shortStory": "Constructed in 1161 CE by Chaulukya Emperor Kumarapala under the spiritual guidance of legendary Jain polymath Acharya Hemachandracharya. The grand Ajitnath temple stands on a high mountain plateau in the Aravalli range. Recent archaeological digs also uncovered ancient 4th-century CE rock-cut Buddhist grottoes and inscriptions dedicated to Buddhist Goddess Tara (giving 'Taranga' its name), proving millennia of multi-faith spiritual coexistence.",
    "history": "Built during 1161 CE (12th Century) under Chaulukya / Solanki Dynasty (King Kumarapala). Construction: Yellow and Pink Sandstone, Dry-ashlar interlocking stone, Carved marble Tirthankara. Style: Māru-Gurjara Temple Architecture (Mahaprasada style).",
    "significance": "Taranga Jain Temple & Buddhist Caves is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-20, UNESCO Status: State Heritage Pilgrimage Mountain.",
    "architecture": "Style: Māru-Gurjara Temple Architecture (Mahaprasada style). Construction Materials: Yellow and Pink Sandstone, Dry-ashlar interlocking stone, Carved marble Tirthankara. Dimensions: Height: 43 m (142 ft); Perimeter: 45m x 30m plinth; Perched on Taranga Hill surrounded by forested peaks.",
    "keyFacts": [
      "Ruler / Dynasty: Chaulukya / Solanki Dynasty (King Kumarapala)",
      "Period: 1161 CE (12th Century)",
      "Architectural Style: Māru-Gurjara Temple Architecture (Mahaprasada style)",
      "Location: Mehsana District, Kheralu / Taranga, Gujarat",
      "ASI Reference: W-GJ-20",
      "UNESCO: State Heritage Pilgrimage Mountain"
    ],
    "period": "1161 CE (12th Century)"
  },
  {
    "placeId": "IND-GJ-28",
    "shortStory": "Sidhpur features two extraordinary architectural paradigms. The Rudra Mahalaya was once the largest and grandest temple in western India, described as a 3-storey temple resting on 1,600 pillars so magnificent that its torana archways still tower over the town despite being sacked by Alauddin Khilji in 1296. Just 1 km away stand the pastel-hued Dawoodi Bohra havelis—Europe-inspired neoclassical and art nouveau timber mansions built by wealthy sea merchants with imported Belgian glass and Italian balustrades.",
    "history": "Built during Rudra Mahalaya: 943 – 1140 CE; Havelis: 1880 – 1920 CE under Solanki Dynasty (Mulraja & Siddharaj Jaisinh) & Dawoodi Bohra Merchant Guilds. Construction: Giant Sandstone Megaliths, Burnt brick, Burma Teakwood with European pastel stucco. Style: Solanki Mega-Temple Architecture & Victorian-Gothic-Baroque Wooden Havelis.",
    "significance": "Sidhpur Havelis & Rudra Mahalaya Temple Ruins is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-21, UNESCO Status: Tentative List (Bohra Havelis of Sidhpur).",
    "architecture": "Style: Solanki Mega-Temple Architecture & Victorian-Gothic-Baroque Wooden Havelis. Construction Materials: Giant Sandstone Megaliths, Burnt brick, Burma Teakwood with European pastel stucco. Dimensions: Rudra Mahalaya was a 3-storey temple with 1,600 pillars; Sidhpur Bohrwads feature over 1,000 havelis.",
    "keyFacts": [
      "Ruler / Dynasty: Solanki Dynasty (Mulraja & Siddharaj Jaisinh) & Dawoodi Bohra Merchant Guilds",
      "Period: Rudra Mahalaya: 943 – 1140 CE; Havelis: 1880 – 1920 CE",
      "Architectural Style: Solanki Mega-Temple Architecture & Victorian-Gothic-Baroque Wooden Havelis",
      "Location: Patan District, Sidhpur, Gujarat",
      "ASI Reference: W-GJ-21",
      "UNESCO: Tentative List (Bohra Havelis of Sidhpur)"
    ],
    "period": "Rudra Mahalaya: 943 – 1140 CE; Havelis: 1880 – 1920 CE"
  },
  {
    "placeId": "IND-GJ-29",
    "shortStory": "Discovered in 1958 by renowned archaeologist P.P. Pandya. The central Chaitya cave features one of the most magnificent early sculptural facades in Gujarat: flanking the entrance are two colossal, life-size figures of Bodhisattvas Avalokiteshvara and Vajrapani accompanied by dwarf attendants, carved with a flowing grace reminiscent of Gupta classical aesthetics.",
    "history": "Built during 4th – 5th Century CE under Western Kshatrapas / Gupta Era. Construction: Monolithic Limestone Cliffs overlooking a natural spring stream. Style: Rock-Cut Buddhist Chaitya & Vihara Architecture.",
    "significance": "Khambhalida Buddhist Caves is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-22, UNESCO Status: State Heritage Rock-Cut Sanctuary.",
    "architecture": "Style: Rock-Cut Buddhist Chaitya & Vihara Architecture. Construction Materials: Monolithic Limestone Cliffs overlooking a natural spring stream. Dimensions: Three rock-cut caves carved into limestone bank; Central cave has a Chaitya hall and stupa.",
    "keyFacts": [
      "Ruler / Dynasty: Western Kshatrapas / Gupta Era",
      "Period: 4th – 5th Century CE",
      "Architectural Style: Rock-Cut Buddhist Chaitya & Vihara Architecture",
      "Location: Rajkot District, Jetpur / Gondal, Gujarat",
      "ASI Reference: W-GJ-22",
      "UNESCO: State Heritage Rock-Cut Sanctuary"
    ],
    "period": "4th – 5th Century CE"
  },
  {
    "placeId": "IND-GJ-30",
    "shortStory": "Archaeologically revered as the oldest surviving structural stone temple in all of Gujarat. Dating to the mid-6th century CE, it stands on an elevated double terrace overlooking the Vartu River basin. Architecturally fascinating because its tiered pyramidal shikhara exhibits horseshoe arches containing figures that show unmistakable Gandharan-Kashmiri and Gupta influences, indicating ancient trans-continental trade and artistic transmission.",
    "history": "Built during 6th Century CE (c. 550 – 575 CE, 1,450 years old) under Maitraka Dynasty of Vallabhi. Construction: Local Yellow Dressed Limestone ashlar blocks laid without mortar, stepped pyramidal roof. Style: Archaic Maitraka Temple Style with Gandhara & Gupta synthesis.",
    "significance": "Gop Temple (Earliest Structural Temple of Gujarat) is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-23, UNESCO Status: Earliest Surviving Structural Temple in Gujarat.",
    "architecture": "Style: Archaic Maitraka Temple Style with Gandhara & Gupta synthesis. Construction Materials: Local Yellow Dressed Limestone ashlar blocks laid without mortar, stepped pyramidal roof. Dimensions: Square Sanctum: 3.3m x 3.3m; Stepped tiered pyramidal roof: 7m high.",
    "keyFacts": [
      "Ruler / Dynasty: Maitraka Dynasty of Vallabhi",
      "Period: 6th Century CE (c. 550 – 575 CE, 1,450 years old)",
      "Architectural Style: Archaic Maitraka Temple Style with Gandhara & Gupta synthesis",
      "Location: Jamnagar District, Zinavari Gop, Jamjodhpur, Gujarat",
      "ASI Reference: W-GJ-23",
      "UNESCO: Earliest Surviving Structural Temple in Gujarat"
    ],
    "period": "6th Century CE (c. 550 – 575 CE, 1,450 years old)"
  },
  {
    "placeId": "IND-GJ-31",
    "shortStory": "Built in 1540 by Safi Agha (Khudawand Khan), a Turkish Ottoman general in the service of the Sultanate of Gujarat, specifically to defend the wealthy merchant port of Surat against repeated burning and raiding by Portuguese fleets. The walls were constructed using stone blocks bonded with molten lead rather than mortar to cushion direct hits from Portuguese ship cannons. Later conquered by Akbar in 1573 and famously attacked by Chhatrapati Shivaji Maharaj in 1664.",
    "history": "Built during 1540 – 1546 CE (16th Century) under Gujarat Sultanate (Built by Khudawand Khan for Sultan Mahmud Shah III). Construction: Burnt Bricks, Heavy stone blocks clamped with lead, Molten iron joints, Bronze and iron cannons. Style: Indo-Turkish Military Coastal Bastion Architecture.",
    "significance": "Surat Castle (Old Fort of Surat) is a prominent heritage landmark in Gujarat. ASI Ref: Surat Municipal Corporation / State Heritage, UNESCO Status: Defensive Fortress of the Premier Port of the Mughal Empire.",
    "architecture": "Style: Indo-Turkish Military Coastal Bastion Architecture. Construction Materials: Burnt Bricks, Heavy stone blocks clamped with lead, Molten iron joints, Bronze and iron cannons. Dimensions: Irregular Quadrangle with 4 massive 40-foot round corner bastions; Moat: 60ft wide on three sides.",
    "keyFacts": [
      "Ruler / Dynasty: Gujarat Sultanate (Built by Khudawand Khan for Sultan Mahmud Shah III)",
      "Period: 1540 – 1546 CE (16th Century)",
      "Architectural Style: Indo-Turkish Military Coastal Bastion Architecture",
      "Location: Surat District, Old Surat City, Tapi Riverbank, Gujarat",
      "ASI Reference: Surat Municipal Corporation / State Heritage",
      "UNESCO: Defensive Fortress of the Premier Port of the Mughal Empire"
    ],
    "period": "1540 – 1546 CE (16th Century)"
  },
  {
    "placeId": "IND-GJ-32",
    "shortStory": "Ghumli served as the glorious royal capital of the Jethwa Rajput dynasty from the 9th to the 14th century. The Navalakha Temple (literally costing 'nine lakhs' of gold coins) is the largest and most architecturally accomplished medieval temple in the Kathiawar peninsula. Sacked in 1313 CE by Jam Unaji of Sindh after a famous curse, causing the Jethwas to abandon the city and retreat to Ranpur and Porbandar.",
    "history": "Built during 12th Century CE (c. 1150 – 1200 CE) under Jethwa Rajput Dynasty (Rana Bhanji & Sangramji Jethwa). Construction: Local Fine Yellow Sandstone, Stepped high plinth (Jagati), Intricately carved stone pillars. Style: Māru-Gurjara Temple Architecture (Largest stepped-plinth temple in Saurashtra).",
    "significance": "Ghumli Navalakha Temple & Vichia Vav is a prominent heritage landmark in Gujarat. ASI Ref: W-GJ-24, UNESCO Status: National Protected Monument of India.",
    "architecture": "Style: Māru-Gurjara Temple Architecture (Largest stepped-plinth temple in Saurashtra). Construction Materials: Local Fine Yellow Sandstone, Stepped high plinth (Jagati), Intricately carved stone pillars. Dimensions: Plinth: 45m x 30m; Two-storey Mandapa supported by carved bracket columns; Adjacent Vichia Vav stepwell.",
    "keyFacts": [
      "Ruler / Dynasty: Jethwa Rajput Dynasty (Rana Bhanji & Sangramji Jethwa)",
      "Period: 12th Century CE (c. 1150 – 1200 CE)",
      "Architectural Style: Māru-Gurjara Temple Architecture (Largest stepped-plinth temple in Saurashtra)",
      "Location: Devbhumi Dwarka / Porbandar border, Barda Hills, Gujarat",
      "ASI Reference: W-GJ-24",
      "UNESCO: National Protected Monument of India"
    ],
    "period": "12th Century CE (c. 1150 – 1200 CE)"
  },
  {
    "placeId": "IND-ART-13",
    "shortStory": "According to the 12th-century Jain chronicler Merutunga, King Kumarapala brought 700 Salvi weaver families from Jalna (Maharashtra) to Patan to produce ceremonial daily Patolas. Both the warp and weft threads are individually tie-dyed prior to weaving with mathematical precision. Popular Gujarati proverb: 'Padi Patole bhat, fatey pan fitey nahin' (The design on a Patola may wear out with time, but its colors will never fade).",
    "history": "Built during 12th Century Tradition to Present (800+ Years) under Patronized by King Kumarapala (Solanki Dynasty). Construction: Pure 8-Ply Mulberry Silk, 100% Natural Organic Dyes (Madder, Indigo, Turmeric, Pomegranate rinds). Style: Salvi Double-Ikat Mathematical Weaving.",
    "significance": "Patan Patola Double-Ikat Silk Heritage Textile is a prominent heritage landmark in Gujarat. ASI Ref: Calico Museum Acc. TX-784 / GI Registry #40, UNESCO Status: Intangible Cultural Heritage of Humanity & GI Tagged.",
    "architecture": "Style: Salvi Double-Ikat Mathematical Weaving. Construction Materials: Pure 8-Ply Mulberry Silk, 100% Natural Organic Dyes (Madder, Indigo, Turmeric, Pomegranate rinds). Dimensions: Length: 5.5 m, Width: 1.15 m; Weaving time: 6 months to 1 year per saree.",
    "keyFacts": [
      "Ruler / Dynasty: Patronized by King Kumarapala (Solanki Dynasty)",
      "Period: 12th Century Tradition to Present (800+ Years)",
      "Architectural Style: Salvi Double-Ikat Mathematical Weaving",
      "Location: Patan, North Gujarat, Gujarat",
      "ASI Reference: Calico Museum Acc. TX-784 / GI Registry #40",
      "UNESCO: Intangible Cultural Heritage of Humanity & GI Tagged"
    ],
    "period": "12th Century Tradition to Present (800+ Years)"
  },
  {
    "placeId": "IND-ART-14",
    "shortStory": "Carved by Habshi general Sidi Saiyyid in 1572 CE during the twilight of the Gujarat Sultanate just prior to Mughal annexation by Akbar. The delicate stone foliage served as the official insignia and logo of the Indian Institute of Management Ahmedabad (IIMA) and remains the global symbol of Ahmedabad.",
    "history": "Built during 1572 – 1573 CE (16th Century) under Gujarat Sultanate (Shams-ud-din Muzaffar Shah III / Sidi Saiyyid). Construction: Yellow Dhrangadhra Sandstone carved from single slab spans. Style: Indo-Islamic Gujarat Sultanate Open-Work Filigree.",
    "significance": "Tree of Life Stone Lattice Jali (Sidi Saiyyed Mosque) is a prominent heritage landmark in Gujarat. ASI Ref: N-GJ-3 (Sidi Saiyyed Mosque), UNESCO Status: Ahmedabad World Heritage City Key Monument.",
    "architecture": "Style: Indo-Islamic Gujarat Sultanate Open-Work Filigree. Construction Materials: Yellow Dhrangadhra Sandstone carved from single slab spans. Dimensions: Span: 3.05 m wide x 2.1 m high (10 ft x 7 ft); Thickness: ~8 cm.",
    "keyFacts": [
      "Ruler / Dynasty: Gujarat Sultanate (Shams-ud-din Muzaffar Shah III / Sidi Saiyyid)",
      "Period: 1572 – 1573 CE (16th Century)",
      "Architectural Style: Indo-Islamic Gujarat Sultanate Open-Work Filigree",
      "Location: Ahmedabad Old City, Gujarat",
      "ASI Reference: N-GJ-3 (Sidi Saiyyed Mosque)",
      "UNESCO: Ahmedabad World Heritage City Key Monument"
    ],
    "period": "1572 – 1573 CE (16th Century)"
  },
  {
    "placeId": "IND-ART-15",
    "shortStory": "The 52 pillars of the Sabha Mandapa (Assembly Hall) stand as an astronomical calendar dividing the solar year into 52 weeks. On the equinox days (March 21 and Sept 23), the morning sun passes through the Sabha Mandapa to hit the golden jewel on Surya's crown in the inner sanctum.",
    "history": "Built during 1026 – 1027 CE (11th Century) under Chaulukya / Solanki Dynasty (King Bhima I). Construction: Golden-Yellow Sandstone, dry-masonry interlocking without mortar. Style: Maha-Gurjara / Maru-Gurjara Temple Architecture.",
    "significance": "Sabha Mandapa 52 Pillars (Sun Temple Modhera) is a prominent heritage landmark in Gujarat. ASI Ref: N-GJ-140 (Sun Temple Modhera), UNESCO Status: Tentative List World Heritage Site.",
    "architecture": "Style: Maha-Gurjara / Maru-Gurjara Temple Architecture. Construction Materials: Golden-Yellow Sandstone, dry-masonry interlocking without mortar. Dimensions: Height: 4.8 m each; 52 Pillars representing 52 weeks of the solar year.",
    "keyFacts": [
      "Ruler / Dynasty: Chaulukya / Solanki Dynasty (King Bhima I)",
      "Period: 1026 – 1027 CE (11th Century)",
      "Architectural Style: Maha-Gurjara / Maru-Gurjara Temple Architecture",
      "Location: Modhera, Mehsana District, Gujarat",
      "ASI Reference: N-GJ-140 (Sun Temple Modhera)",
      "UNESCO: Tentative List World Heritage Site"
    ],
    "period": "1026 – 1027 CE (11th Century)"
  },
  {
    "placeId": "IND-ART-16",
    "shortStory": "Positioned at the fourth subterranean gallery level of Rani ki Vav, this masterpiece represents the primordial waters of creation (Kshira Sagara). Built by Queen Udayamati as a memorial to her husband Bhima I. The stepwell is conceived as an inverted temple honoring the sanctity of water.",
    "history": "Built during c. 1063 CE (11th Century) under Chaulukya / Solanki Dynasty (Queen Udayamati). Construction: White and buff sandstone, fine undercut relief carving. Style: Maru-Gurjara Subterranean Temple Architecture.",
    "significance": "Sheshashayi Vishnu Wall Sculpture (Rani ki Vav) is a prominent heritage landmark in Gujarat. ASI Ref: N-GJ-156 (Rani ki Vav), UNESCO Status: UNESCO World Heritage Site Ref. 922.",
    "architecture": "Style: Maru-Gurjara Subterranean Temple Architecture. Construction Materials: White and buff sandstone, fine undercut relief carving. Dimensions: Panel Height: 1.8 m, Width: 1.2 m; Depth in Vav: Level 4, 18m below ground.",
    "keyFacts": [
      "Ruler / Dynasty: Chaulukya / Solanki Dynasty (Queen Udayamati)",
      "Period: c. 1063 CE (11th Century)",
      "Architectural Style: Maru-Gurjara Subterranean Temple Architecture",
      "Location: Patan, North Gujarat, Gujarat",
      "ASI Reference: N-GJ-156 (Rani ki Vav)",
      "UNESCO: UNESCO World Heritage Site Ref. 922"
    ],
    "period": "c. 1063 CE (11th Century)"
  },
  {
    "placeId": "IND-ART-17",
    "shortStory": "A metallurgical mystery that baffled Western scientists for centuries. Metallurgists at IIT Kanpur discovered that ancient Indian ironsmiths created a protective passive film of crystalline iron hydrogen phosphate hydrate (misawite) across the surface, preventing rust entirely. Inscription commemorates King Chandra's victory over Vanga and Vahlika.",
    "history": "Built during c. 402 CE (1,600+ Years Old) under Gupta Empire (King Chandragupta II Vikramaditya). Construction: Pure High-Phosphorus Low-Carbon Wrought Iron (99.7% pure Fe). Style: Ancient Indian Forge-Welded Metallurgy.",
    "significance": "Rust-Resistant Iron Pillar of Delhi is a prominent heritage landmark in Delhi. ASI Ref: N-DL-1/Pillar, UNESCO Status: Part of Qutb Complex UNESCO Site 233.",
    "architecture": "Style: Ancient Indian Forge-Welded Metallurgy. Construction Materials: Pure High-Phosphorus Low-Carbon Wrought Iron (99.7% pure Fe). Dimensions: Height: 7.21 m (23 ft 8 in), Diameter: 41 cm (base) to 30 cm (top); Weight: 6,511 kg (6.5 Tonnes).",
    "keyFacts": [
      "Ruler / Dynasty: Gupta Empire (King Chandragupta II Vikramaditya)",
      "Period: c. 402 CE (1,600+ Years Old)",
      "Architectural Style: Ancient Indian Forge-Welded Metallurgy",
      "Location: Mehrauli, South Delhi, Delhi",
      "ASI Reference: N-DL-1/Pillar",
      "UNESCO: Part of Qutb Complex UNESCO Site 233"
    ],
    "period": "c. 402 CE (1,600+ Years Old)"
  },
  {
    "placeId": "IND-ART-18",
    "shortStory": "The 24 wheels of the Konark Sun Temple represent the 24 fortnights (Pakshas) of the Hindu solar year, pulled by seven spirited horses (representing the 7 days of the week and 7 colors of sunlight). Even today, tour guides place a finger on the central axle to tell the exact local solar time using shadow position.",
    "history": "Built during 1250 CE (13th Century) under Eastern Ganga Dynasty (King Narasimhadeva I). Construction: Khondalite Stone with Chlorite Insets. Style: Kalinga Architectural Style (Rekha Deula).",
    "significance": "Konark Sun Chariot Sundial Wheels is a prominent heritage landmark in Odisha. ASI Ref: N-OR-63 (Sun Temple Konark), UNESCO Status: UNESCO World Heritage Site Ref. 242.",
    "architecture": "Style: Kalinga Architectural Style (Rekha Deula). Construction Materials: Khondalite Stone with Chlorite Insets. Dimensions: Diameter: 3.0 m (9.8 ft); 24 carved wheels along temple base.",
    "keyFacts": [
      "Ruler / Dynasty: Eastern Ganga Dynasty (King Narasimhadeva I)",
      "Period: 1250 CE (13th Century)",
      "Architectural Style: Kalinga Architectural Style (Rekha Deula)",
      "Location: Konark, Puri District, Odisha",
      "ASI Reference: N-OR-63 (Sun Temple Konark)",
      "UNESCO: UNESCO World Heritage Site Ref. 242"
    ],
    "period": "1250 CE (13th Century)"
  },
  {
    "placeId": "IND-ART-19",
    "shortStory": "Built by King Krishnadevaraya inspired by Konark's sun chariot during his Kalinga campaigns. Dedicated to Garuda, the celestial mount of Lord Vishnu. The wheels were carved so precisely that British officers in the 1800s reportedly attempted to turn them. It stands in the axis of the famed 56 musical pillars of Vittala Temple.",
    "history": "Built during 16th Century CE (c. 1513 CE) under Vijayanagara Empire (King Krishnadevaraya). Construction: Granite blocks interlocking with hidden joints to simulate a single monolith. Style: Vijayanagara Imperial Dravidian Granite Masonry.",
    "significance": "Monolithic Stone Chariot (Vittala Temple Hampi) is a prominent heritage landmark in Karnataka. ASI Ref: N-KA-B34 (Vittala Temple Complex), UNESCO Status: UNESCO World Heritage Site Ref. 241.",
    "architecture": "Style: Vijayanagara Imperial Dravidian Granite Masonry. Construction Materials: Granite blocks interlocking with hidden joints to simulate a single monolith. Dimensions: Height: 6.5 m (21 ft); Base: 4.5m x 4.0m.",
    "keyFacts": [
      "Ruler / Dynasty: Vijayanagara Empire (King Krishnadevaraya)",
      "Period: 16th Century CE (c. 1513 CE)",
      "Architectural Style: Vijayanagara Imperial Dravidian Granite Masonry",
      "Location: Hampi, Vijayanagara District, Karnataka",
      "ASI Reference: N-KA-B34 (Vittala Temple Complex)",
      "UNESCO: UNESCO World Heritage Site Ref. 241"
    ],
    "period": "16th Century CE (c. 1513 CE)"
  },
  {
    "placeId": "IND-ART-20",
    "shortStory": "A staggering geographical and astronomical achievement of ancient India. The pillar marks a straight ocean meridian line from Somnath Temple directly to Antarctica (South Pole) at 0° longitudinal obstruction—proving that ancient Indian geographers mapped global oceanic coordinates long before European voyages.",
    "history": "Built during c. 6th – 10th Century CE Inscribed Tradition under Ancient Saurashtra Navigators & Solanki Rulers. Construction: Carved Red Sandstone Pillar with Brass Arrow Finial. Style: Saurashtra Red Sandstone Inscribed Stambh.",
    "significance": "Baan Stambh (Arrow Pillar of Somnath) is a prominent heritage landmark in Gujarat. ASI Ref: Somnath Trust Heritage Monument, UNESCO Status: Ancient Indian Maritime Heritage.",
    "architecture": "Style: Saurashtra Red Sandstone Inscribed Stambh. Construction Materials: Carved Red Sandstone Pillar with Brass Arrow Finial. Dimensions: Height: 5.5 m (18 ft); Pillar Diameter: 40 cm.",
    "keyFacts": [
      "Ruler / Dynasty: Ancient Saurashtra Navigators & Solanki Rulers",
      "Period: c. 6th – 10th Century CE Inscribed Tradition",
      "Architectural Style: Saurashtra Red Sandstone Inscribed Stambh",
      "Location: Prabhas Patan, Gir Somnath District, Gujarat",
      "ASI Reference: Somnath Trust Heritage Monument",
      "UNESCO: Ancient Indian Maritime Heritage"
    ],
    "period": "c. 6th – 10th Century CE Inscribed Tradition"
  },
  {
    "placeId": "IND-ART-21",
    "shortStory": "Discovered at Mohenjo-daro by Sir John Marshall in 1928–29. Widely recognized as one of the earliest depictions of proto-Shiva as 'Lord of Animals' (Pashupati) and Mahayogi. The seal showcases miniature stone engraving and pictographic writing.",
    "history": "Built during c. 2350 – 2000 BCE under Indus Valley Civilization (Mature Harappan). Construction: Glazed Steatite (Soapstone) treated with high heat. Style: Steatite Glyptic Intaglio Carving.",
    "significance": "Pashupati Seal (Proto-Shiva Intaglio) is a prominent heritage landmark in Delhi. ASI Ref: Acc. No. 4208 / National Museum, UNESCO Status: National Treasure of India.",
    "architecture": "Style: Steatite Glyptic Intaglio Carving. Construction Materials: Glazed Steatite (Soapstone) treated with high heat. Dimensions: Dimensions: 3.4 cm x 3.4 cm, Thickness: 0.53 cm.",
    "keyFacts": [
      "Ruler / Dynasty: Indus Valley Civilization (Mature Harappan)",
      "Period: c. 2350 – 2000 BCE",
      "Architectural Style: Steatite Glyptic Intaglio Carving",
      "Location: New Delhi, Central Delhi, Delhi",
      "ASI Reference: Acc. No. 4208 / National Museum",
      "UNESCO: National Treasure of India"
    ],
    "period": "c. 2350 – 2000 BCE"
  },
  {
    "placeId": "IND-ART-22",
    "shortStory": "Excavated from the main stupa at Piprahwa (ancient Kapilavastu) in Uttar Pradesh by K.M. Srivastava (ASI) in 1971-73. The inscribed Brahmi text confirms the relics belong to the Shakya clan of Gautama Buddha. Treated as sovereign sacred treasures.",
    "history": "Built during 5th Century – 3rd Century BCE under Shakya Republic / Emperor Ashoka (Maurya Empire). Construction: Steatite Relic Caskets, Charred Bone Relics, Gold Leaf Flowers, Amethyst, Carnelian, Pearl Beads. Style: Mauryan Steatite & Soapstone Casket Lapidary.",
    "significance": "Holy Piprahwa Relics of Lord Gautama Buddha is a prominent heritage landmark in Delhi. ASI Ref: ASI Piprahwa Relic Cache, UNESCO Status: Grade 1 National Sacred Antiquity.",
    "architecture": "Style: Mauryan Steatite & Soapstone Casket Lapidary. Construction Materials: Steatite Relic Caskets, Charred Bone Relics, Gold Leaf Flowers, Amethyst, Carnelian, Pearl Beads. Dimensions: Casket Height: 15 cm; Gilded Vitrine: 1.8m x 1.2m.",
    "keyFacts": [
      "Ruler / Dynasty: Shakya Republic / Emperor Ashoka (Maurya Empire)",
      "Period: 5th Century – 3rd Century BCE",
      "Architectural Style: Mauryan Steatite & Soapstone Casket Lapidary",
      "Location: New Delhi, Central Delhi, Delhi",
      "ASI Reference: ASI Piprahwa Relic Cache",
      "UNESCO: Grade 1 National Sacred Antiquity"
    ],
    "period": "5th Century – 3rd Century BCE"
  },
  {
    "placeId": "IND-ART-23",
    "shortStory": "Carried by Mughal Emperor Aurangzeb during his 25-year Deccan campaigns. The blade was forged using high-carbon Southern Indian wootz steel renowned globally for holding an edge capable of slicing silk in mid-air. The gold calligraphy was applied by master court armorers.",
    "history": "Built during Late 17th Century CE (c. 1675 CE) under Mughal Empire (Emperor Aurangzeb Alamgir). Construction: Crucible Damascus Wootz Steel (Ukku), Pure 24K Gold Wire Inlay (Teh-nishan), Velvet covered Wood Scabbard. Style: Indo-Persian Damascened Metalwork (Koftgari).",
    "significance": "Sword of Emperor Aurangzeb (Wootz Steel with Calligraphy) is a prominent heritage landmark in Delhi. ASI Ref: Acc. No. 60.1477 / National Museum, UNESCO Status: National Treasure of Arms.",
    "architecture": "Style: Indo-Persian Damascened Metalwork (Koftgari). Construction Materials: Crucible Damascus Wootz Steel (Ukku), Pure 24K Gold Wire Inlay (Teh-nishan), Velvet covered Wood Scabbard. Dimensions: Total Length: 94 cm; Blade Length: 81 cm; Weight: 1.15 kg.",
    "keyFacts": [
      "Ruler / Dynasty: Mughal Empire (Emperor Aurangzeb Alamgir)",
      "Period: Late 17th Century CE (c. 1675 CE)",
      "Architectural Style: Indo-Persian Damascened Metalwork (Koftgari)",
      "Location: New Delhi, Central Delhi, Delhi",
      "ASI Reference: Acc. No. 60.1477 / National Museum",
      "UNESCO: National Treasure of Arms"
    ],
    "period": "Late 17th Century CE (c. 1675 CE)"
  },
  {
    "placeId": "IND-ART-24",
    "shortStory": "Specially crafted for Jalal-ud-din Muhammad Akbar in 1594 CE. The shield combines Islamic astrological symbology with Rajput defensive warfare. The 12 zodiac medallions were hand-hammered and overlaid with pure gold wire using true teh-nishan damascening.",
    "history": "Built during 1594 CE (Late 16th Century) under Mughal Empire (Emperor Akbar the Great). Construction: Tempered Steel, 24K Gold Inlay Wire, Leather padding and brass bosses. Style: Mughal Imperial Koftgari Gold Inlay.",
    "significance": "Shield of Emperor Akbar (Zodiac Gold Damascened Dhal) is a prominent heritage landmark in Delhi. ASI Ref: Acc. No. 58.42 / National Museum, UNESCO Status: National Treasure of Arms.",
    "architecture": "Style: Mughal Imperial Koftgari Gold Inlay. Construction Materials: Tempered Steel, 24K Gold Inlay Wire, Leather padding and brass bosses. Dimensions: Diameter: 44 cm (17.3 in), Convex Depth: 7 cm; Weight: 2.3 kg.",
    "keyFacts": [
      "Ruler / Dynasty: Mughal Empire (Emperor Akbar the Great)",
      "Period: 1594 CE (Late 16th Century)",
      "Architectural Style: Mughal Imperial Koftgari Gold Inlay",
      "Location: New Delhi, Central Delhi, Delhi",
      "ASI Reference: Acc. No. 58.42 / National Museum",
      "UNESCO: National Treasure of Arms"
    ],
    "period": "1594 CE (Late 16th Century)"
  },
  {
    "placeId": "IND-ART-25",
    "shortStory": "Universally recognized as the quintessential icon of Buddha in art history. Excavated at Sarnath by F.O. Oertel in 1904-05. The peaceful spiritual expression, downcast half-closed meditative eyes, and mathematical symmetry represent the artistic pinnacle of the Gupta 'Golden Age'.",
    "history": "Built during c. 475 CE (5th Century CE) under Gupta Empire (Classical Golden Age). Construction: Chunar Buff Sandstone with Smooth Cream Patina. Style: Sarnath School of Gupta Sculpture.",
    "significance": "Dharmachakra Pravartana Buddha (Gupta 5th Century) is a prominent heritage landmark in Uttar Pradesh. ASI Ref: ASI Sarnath Site Museum Acc. No. B(b) 181, UNESCO Status: Classical Peak of World Buddhist Art.",
    "architecture": "Style: Sarnath School of Gupta Sculpture. Construction Materials: Chunar Buff Sandstone with Smooth Cream Patina. Dimensions: Height: 1.57 m (5 ft 2 in); Width: 86 cm.",
    "keyFacts": [
      "Ruler / Dynasty: Gupta Empire (Classical Golden Age)",
      "Period: c. 475 CE (5th Century CE)",
      "Architectural Style: Sarnath School of Gupta Sculpture",
      "Location: Sarnath, Varanasi District, Uttar Pradesh",
      "ASI Reference: ASI Sarnath Site Museum Acc. No. B(b) 181",
      "UNESCO: Classical Peak of World Buddhist Art"
    ],
    "period": "c. 475 CE (5th Century CE)"
  },
  {
    "placeId": "IND-ART-26",
    "shortStory": "Discovered in 1873 at Bharhut (Madhya Pradesh) by Alexander Cunningham, founder of the ASI. To save the carvings from local quarrying, Cunningham transported the dismantled torana and railings to the Indian Museum Kolkata, where they form the world's most complete early Buddhist narrative monument.",
    "history": "Built during c. 150 – 100 BCE (2nd Century BCE) under Shunga Empire (King Dhanabhuti). Construction: Red Sandstone from Satna (Madhya Pradesh). Style: Early Buddhist Shunga Narrative Bas-Relief.",
    "significance": "Bharhut Stupa Torana Gateway & Railing Panels is a prominent heritage landmark in West Bengal. ASI Ref: Indian Museum Kolkata Bharhut Gallery, UNESCO Status: Earliest Narrative Relief Art of India.",
    "architecture": "Style: Early Buddhist Shunga Narrative Bas-Relief. Construction Materials: Red Sandstone from Satna (Madhya Pradesh). Dimensions: Gateway Height: 6.8 m (22 ft); Railing length: 30 m.",
    "keyFacts": [
      "Ruler / Dynasty: Shunga Empire (King Dhanabhuti)",
      "Period: c. 150 – 100 BCE (2nd Century BCE)",
      "Architectural Style: Early Buddhist Shunga Narrative Bas-Relief",
      "Location: Kolkata, Central Kolkata, West Bengal",
      "ASI Reference: Indian Museum Kolkata Bharhut Gallery",
      "UNESCO: Earliest Narrative Relief Art of India"
    ],
    "period": "c. 150 – 100 BCE (2nd Century BCE)"
  },
  {
    "placeId": "IND-ART-27",
    "shortStory": "Demonstrates the fascinating cultural synthesis between Greek Hellenistic artistic traditions left by Alexander the Great's successors and Mahayana Buddhism under the Kushan Empire. The serene statue influenced Buddhist art across the Silk Road to China and Japan.",
    "history": "Built during 2nd Century CE (c. 150 CE) under Kushan Empire (Emperor Kanishka Era). Construction: Grey Micaceous Schist Stone from Swat/Gandhara. Style: Gandharan Greco-Roman Buddhist Synthesis.",
    "significance": "Gandhara Standing Buddha (Greco-Buddhist Masterpiece) is a prominent heritage landmark in West Bengal. ASI Ref: Indian Museum Acc. No. G-12, UNESCO Status: Greco-Indian Classical Synthesis.",
    "architecture": "Style: Gandharan Greco-Roman Buddhist Synthesis. Construction Materials: Grey Micaceous Schist Stone from Swat/Gandhara. Dimensions: Height: 1.82 m (6 ft); Width: 65 cm; Weight: ~380 kg.",
    "keyFacts": [
      "Ruler / Dynasty: Kushan Empire (Emperor Kanishka Era)",
      "Period: 2nd Century CE (c. 150 CE)",
      "Architectural Style: Gandharan Greco-Roman Buddhist Synthesis",
      "Location: Kolkata, Central Kolkata, West Bengal",
      "ASI Reference: Indian Museum Acc. No. G-12",
      "UNESCO: Greco-Indian Classical Synthesis"
    ],
    "period": "2nd Century CE (c. 150 CE)"
  },
  {
    "placeId": "IND-ART-28",
    "shortStory": "Brought to Calcutta in 1834 by British traveler Lieutenant EC Archbold from Luxor, Egypt, and gifted to the Asiatic Society of Bengal. Underwent non-invasive CT scan conservation in 2017 at a Kolkata hospital, revealing internal brain extraction and preserved spinal structure.",
    "history": "Built during c. 300 – 200 BCE (Ptolemaic Era) under Ptolemaic Kingdom of Egypt (Acquired 1834). Construction: Embalmed Human Remains, Linen Bandages, Gesso, Pigments, Cedar Wood Coffin. Style: Ancient Egyptian Mummification & Funerary Art.",
    "significance": "4,000-Year-Old Egyptian Ptolemaic Mummy is a prominent heritage landmark in West Bengal. ASI Ref: Indian Museum Egyptian Gallery Acc. No. 1, UNESCO Status: Only One of Six Authentic Egyptian Mummies in India.",
    "architecture": "Style: Ancient Egyptian Mummification & Funerary Art. Construction Materials: Embalmed Human Remains, Linen Bandages, Gesso, Pigments, Cedar Wood Coffin. Dimensions: Length: 1.65 m (5 ft 5 in); Vitrine: 2.2m x 0.8m.",
    "keyFacts": [
      "Ruler / Dynasty: Ptolemaic Kingdom of Egypt (Acquired 1834)",
      "Period: c. 300 – 200 BCE (Ptolemaic Era)",
      "Architectural Style: Ancient Egyptian Mummification & Funerary Art",
      "Location: Kolkata, Central Kolkata, West Bengal",
      "ASI Reference: Indian Museum Egyptian Gallery Acc. No. 1",
      "UNESCO: Only One of Six Authentic Egyptian Mummies in India"
    ],
    "period": "c. 300 – 200 BCE (Ptolemaic Era)"
  },
  {
    "placeId": "IND-ART-29",
    "shortStory": "Acquired by Nawab Mir Yousuf Ali Khan in France. Depicts the duality of good and evil from Johann Wolfgang von Goethe's dramatic tragedy 'Faust'. Carved from a single timber trunk with zero seams or joints.",
    "history": "Built during Late 19th Century CE under Collection of Salar Jung III. Construction: Single Block of Seasoned Sycamore / Pear Wood. Style: 19th Century French Wood Sculpting (Goethe's Faust).",
    "significance": "Double-Sided Wood Statue of Mephistopheles and Margaretta is a prominent heritage landmark in Telangana. ASI Ref: Salar Jung Museum Acc. No. 74.8, UNESCO Status: Masterpiece of Allegorical Wood Sculpture.",
    "architecture": "Style: 19th Century French Wood Sculpting (Goethe's Faust). Construction Materials: Single Block of Seasoned Sycamore / Pear Wood. Dimensions: Height: 177 cm (5 ft 10 in); Pedestal: 45 cm.",
    "keyFacts": [
      "Ruler / Dynasty: Collection of Salar Jung III",
      "Period: Late 19th Century CE",
      "Architectural Style: 19th Century French Wood Sculpting (Goethe's Faust)",
      "Location: Hyderabad, Old City, Telangana",
      "ASI Reference: Salar Jung Museum Acc. No. 74.8",
      "UNESCO: Masterpiece of Allegorical Wood Sculpture"
    ],
    "period": "Late 19th Century CE"
  },
  {
    "placeId": "IND-ART-30",
    "shortStory": "Every day, hundreds of tourists gather in the central hall of the museum before the top of each hour to witness the mechanical toy watchman step out of the door, hammer the gong, and retreat back inside. The clock has functioned with original precision mechanics for over 150 years.",
    "history": "Built during c. 1870 CE (19th Century) under Crafted by Cook & Kelvey Co., Calcutta & London for Salar Jung. Construction: Mahogany Wood Case, Brass Gears, Enamelled Dials, Gilded Bronze Figurines. Style: Victorian Mechanical Automaton Horology.",
    "significance": "Salar Jung Musical Clock (Cook & Kelvey 19th-Century) is a prominent heritage landmark in Telangana. ASI Ref: Salar Jung Museum Horological Collection, UNESCO Status: Iconic Horological Heritage of India.",
    "architecture": "Style: Victorian Mechanical Automaton Horology. Construction Materials: Mahogany Wood Case, Brass Gears, Enamelled Dials, Gilded Bronze Figurines. Dimensions: Height: 1.8 m (6 ft); Width: 1.2 m; Weight: ~220 kg.",
    "keyFacts": [
      "Ruler / Dynasty: Crafted by Cook & Kelvey Co., Calcutta & London for Salar Jung",
      "Period: c. 1870 CE (19th Century)",
      "Architectural Style: Victorian Mechanical Automaton Horology",
      "Location: Hyderabad, Old City, Telangana",
      "ASI Reference: Salar Jung Museum Horological Collection",
      "UNESCO: Iconic Horological Heritage of India"
    ],
    "period": "c. 1870 CE (19th Century)"
  },
  {
    "placeId": "IND-ART-31",
    "shortStory": "Represents the military spirit of Swarajya founded by Chhatrapati Shivaji Maharaj. Forged from Deccan crucible steel, these swords enabled Maratha guerrilla forces (Ganimi Kava) to defeat Mughal heavy cavalry.",
    "history": "Built during Mid 17th Century CE (c. 1650 – 1674 CE) under Maratha Empire (Chhatrapati Shivaji Maharaj). Construction: Crucible Damascus Wootz Steel with Gold Inlay, Steel basket hilt with handguard (dhal). Style: Classical Maratha Armory (Khanda-Talwar Hybrid).",
    "significance": "Sword of Chhatrapati Shivaji Maharaj (Historical Maratha Talwar) is a prominent heritage landmark in Maharashtra. ASI Ref: CSMVS Acc. Arms-1674, UNESCO Status: National Sacred Relic of Maratha Empire.",
    "architecture": "Style: Classical Maratha Armory (Khanda-Talwar Hybrid). Construction Materials: Crucible Damascus Wootz Steel with Gold Inlay, Steel basket hilt with handguard (dhal). Dimensions: Blade Length: 88 cm; Total Length: 99 cm; Weight: 1.2 kg.",
    "keyFacts": [
      "Ruler / Dynasty: Maratha Empire (Chhatrapati Shivaji Maharaj)",
      "Period: Mid 17th Century CE (c. 1650 – 1674 CE)",
      "Architectural Style: Classical Maratha Armory (Khanda-Talwar Hybrid)",
      "Location: Mumbai, Fort / Kala Ghoda, Maharashtra",
      "ASI Reference: CSMVS Acc. Arms-1674",
      "UNESCO: National Sacred Relic of Maratha Empire"
    ],
    "period": "Mid 17th Century CE (c. 1650 – 1674 CE)"
  },
  {
    "placeId": "IND-ART-32",
    "shortStory": "Excavated from Tiruvenkadu temple in Mayiladuthurai district, Tamil Nadu. Considered by art historians like Stella Kramrisch and C. Sivaramamurti as the supreme global representation of gender non-duality and cosmic harmony (Purusha and Prakriti united in one body).",
    "history": "Built during 11th Century CE (c. 1010 CE) under Chola Dynasty (Reign of Rajendra Chola I). Construction: Solid Cast Panchaloha (Five Metals) with Greenish Brown Noble Patina. Style: Dravidian Chola Classical Bronze Casting.",
    "significance": "Ardhanarisvara Chola Bronze of Tiruvenkadu is a prominent heritage landmark in Tamil Nadu. ASI Ref: Government Museum Chennai Acc. No. 12/Bronze, UNESCO Status: Greatest Composite Icon of Indian Art.",
    "architecture": "Style: Dravidian Chola Classical Bronze Casting. Construction Materials: Solid Cast Panchaloha (Five Metals) with Greenish Brown Noble Patina. Dimensions: Height: 102 cm (3 ft 4 in); Base: 40 cm; Weight: ~62 kg.",
    "keyFacts": [
      "Ruler / Dynasty: Chola Dynasty (Reign of Rajendra Chola I)",
      "Period: 11th Century CE (c. 1010 CE)",
      "Architectural Style: Dravidian Chola Classical Bronze Casting",
      "Location: Chennai, Egmore, Tamil Nadu",
      "ASI Reference: Government Museum Chennai Acc. No. 12/Bronze",
      "UNESCO: Greatest Composite Icon of Indian Art"
    ],
    "period": "11th Century CE (c. 1010 CE)"
  },
  {
    "placeId": "IND-ART-33",
    "shortStory": "Discovered in 1951 accidentally during brick-quarrying at Akota near Vadodara. The 68 metallic idols establish that Gujarat possessed a bronze-casting school equal in artistry to Chola bronzes. Inscriptions on pedestal backs record donations by Jain laywomen (shravikas) and merchant guilds of ancient Ankottaka.",
    "history": "Built during 5th – 11th Century CE (Over 68 Sculptures) under Maitraka Dynasty & Gurjara-Pratihara (Gujarat). Construction: Cast Bronze (Ashtadhatu / Panchaloha) with Inlaid Silver Eyes and Copper Patina. Style: Western Indian Classical Metallurgical School (Akota Style).",
    "significance": "Akota Jain Bronzes Hoard (Vadodara) is a prominent heritage landmark in Gujarat. ASI Ref: Baroda Museum Acc. Akota-1 to 68, UNESCO Status: National Treasure of Western Indian Art.",
    "architecture": "Style: Western Indian Classical Metallurgical School (Akota Style). Construction Materials: Cast Bronze (Ashtadhatu / Panchaloha) with Inlaid Silver Eyes and Copper Patina. Dimensions: Heights range from 18 cm to 72 cm.",
    "keyFacts": [
      "Ruler / Dynasty: Maitraka Dynasty & Gurjara-Pratihara (Gujarat)",
      "Period: 5th – 11th Century CE (Over 68 Sculptures)",
      "Architectural Style: Western Indian Classical Metallurgical School (Akota Style)",
      "Location: Vadodara (Baroda), Gujarat",
      "ASI Reference: Baroda Museum Acc. Akota-1 to 68",
      "UNESCO: National Treasure of Western Indian Art"
    ],
    "period": "5th – 11th Century CE (Over 68 Sculptures)"
  },
  {
    "placeId": "IND-ART-34",
    "shortStory": "Pichhwais ('hanging at the back') are large devotional textile paintings hung behind the sanctum deity in Pushtimarg Vaishnava temples. The Calico Museum in Ahmedabad houses the finest international collection of ancient Pichhwais.",
    "history": "Built during Late 17th Century CE (c. 1680 CE) under Pushtimarg Vallabhacharya Tradition (Mewar / Gujarat). Construction: Hand-Spun Cotton and Silk, Natural Mineral and Plant Pigments (Lapis Lazuli, Malachite, Orpiment, Pure Gold Leaf Foil). Style: Nathdwara School of Sacred Miniature Painting.",
    "significance": "17th-Century Shrinathji Nathdwara Pichhwai (Calico Museum) is a prominent heritage landmark in Gujarat. ASI Ref: Calico Museum Acc. PIC-102, UNESCO Status: Masterpiece of Indian Temple Textiles.",
    "architecture": "Style: Nathdwara School of Sacred Miniature Painting. Construction Materials: Hand-Spun Cotton and Silk, Natural Mineral and Plant Pigments (Lapis Lazuli, Malachite, Orpiment, Pure Gold Leaf Foil). Dimensions: Height: 2.4 m (7.8 ft); Width: 1.8 m.",
    "keyFacts": [
      "Ruler / Dynasty: Pushtimarg Vallabhacharya Tradition (Mewar / Gujarat)",
      "Period: Late 17th Century CE (c. 1680 CE)",
      "Architectural Style: Nathdwara School of Sacred Miniature Painting",
      "Location: Ahmedabad, Shahibaug, Gujarat",
      "ASI Reference: Calico Museum Acc. PIC-102",
      "UNESCO: Masterpiece of Indian Temple Textiles"
    ],
    "period": "Late 17th Century CE (c. 1680 CE)"
  },
  {
    "placeId": "IND-ART-35",
    "shortStory": "Found at Andhau village in the Rann of Kutch. These four inscribed pillars are the oldest known epigraphs found in Gujarat using the Saka era. They provide crucial historical proof of the joint rule of King Chashtana and his grandson Rudradaman I.",
    "history": "Built during 130 CE (Saka Year 52 / 2nd Century CE) under Western Kshatrapa Dynasty (Mahakshatrapa Rudradaman I & Chashtana). Construction: Local Brown Basalt Stone Stele. Style: Early Brahmi Epigraphy on Basalt Stone.",
    "significance": "1st-Century Andhau Inscriptions of Rudradaman (Kutch Museum) is a prominent heritage landmark in Gujarat. ASI Ref: Kutch Museum Inscription Gallery No. 1, UNESCO Status: Oldest Dated Sanskrit Inscriptions in Gujarat.",
    "architecture": "Style: Early Brahmi Epigraphy on Basalt Stone. Construction Materials: Local Brown Basalt Stone Stele. Dimensions: Height: 110 cm; Width: 32 cm; Thickness: 18 cm.",
    "keyFacts": [
      "Ruler / Dynasty: Western Kshatrapa Dynasty (Mahakshatrapa Rudradaman I & Chashtana)",
      "Period: 130 CE (Saka Year 52 / 2nd Century CE)",
      "Architectural Style: Early Brahmi Epigraphy on Basalt Stone",
      "Location: Bhuj, Kutch District, Gujarat",
      "ASI Reference: Kutch Museum Inscription Gallery No. 1",
      "UNESCO: Oldest Dated Sanskrit Inscriptions in Gujarat"
    ],
    "period": "130 CE (Saka Year 52 / 2nd Century CE)"
  },
  {
    "placeId": "IND-ART-36",
    "shortStory": "Used during the annual royal Navratri and Dussehra state processions in Bhuj. The Maharaos of Kutch were carried on this seven-trunked elephant carriage from Aina Mahal through the city gates.",
    "history": "Built during 18th Century CE under Cutch State (Maharao of Kutch). Construction: Seasoned Teak Wood, Natural Vegetable Lacquer Pigments, Brass Ornaments. Style: Kutch Polychrome Lacquer & Teak Carving.",
    "significance": "Airavat Sacred Wooden Elephant (Kutch Museum) is a prominent heritage landmark in Gujarat. ASI Ref: Kutch Museum Folk Gallery Acc. No. 42, UNESCO Status: Royal Kutch Decorative Arts Heritage.",
    "architecture": "Style: Kutch Polychrome Lacquer & Teak Carving. Construction Materials: Seasoned Teak Wood, Natural Vegetable Lacquer Pigments, Brass Ornaments. Dimensions: Height: 2.1 m (7 ft); Length: 2.6 m; Weight: ~400 kg.",
    "keyFacts": [
      "Ruler / Dynasty: Cutch State (Maharao of Kutch)",
      "Period: 18th Century CE",
      "Architectural Style: Kutch Polychrome Lacquer & Teak Carving",
      "Location: Bhuj, Kutch District, Gujarat",
      "ASI Reference: Kutch Museum Folk Gallery Acc. No. 42",
      "UNESCO: Royal Kutch Decorative Arts Heritage"
    ],
    "period": "18th Century CE"
  },
  {
    "placeId": "IND-ART-37",
    "shortStory": "Excavated at Rangpur in Surendranagar/Ahmedabad district by M.S. Vats in 1935 and S.R. Rao in 1953-56. Rangpur is the type-site that proved the Indus Valley Civilization did not suddenly die out, but evolved smoothly into the Lustrous Red Ware culture of Saurashtra, Gujarat.",
    "history": "Built during c. 1900 – 1400 BCE (3,500+ Years Old) under Indus Valley Civilization (Late Harappan Rangpur Phase). Construction: Terracotta baked clay with burnished iron oxide slip and black geometric paint. Style: Lustrous Red Ware Painted Ceramic.",
    "significance": "Rangpur Harappan Terracotta Toy Cart & Painted Pottery is a prominent heritage landmark in Gujarat. ASI Ref: Watson Museum Acc. R-101 to R-140, UNESCO Status: Indus Valley Regional Civilization Heritage.",
    "architecture": "Style: Lustrous Red Ware Painted Ceramic. Construction Materials: Terracotta baked clay with burnished iron oxide slip and black geometric paint. Dimensions: Jars Height: 25 to 45 cm; Toy Cart: 14 cm x 9 cm.",
    "keyFacts": [
      "Ruler / Dynasty: Indus Valley Civilization (Late Harappan Rangpur Phase)",
      "Period: c. 1900 – 1400 BCE (3,500+ Years Old)",
      "Architectural Style: Lustrous Red Ware Painted Ceramic",
      "Location: Rajkot, Saurashtra, Gujarat",
      "ASI Reference: Watson Museum Acc. R-101 to R-140",
      "UNESCO: Indus Valley Regional Civilization Heritage"
    ],
    "period": "c. 1900 – 1400 BCE (3,500+ Years Old)"
  },
  {
    "placeId": "IND-ART-38",
    "shortStory": "Considered the most dramatic, dynamic relief sculpture in Indian rock-cut art. Carved from a single volcanic basalt cliffside at the foot of the monolithic Kailash Temple (Cave 16). The contrast between Ravana's violent, muscular exertion at the bottom and Shiva's effortless divine calm at the top is celebrated worldwide.",
    "history": "Built during 8th Century CE (c. 760 – 775 CE) under Rashtrakuta Dynasty (King Krishna I). Construction: Basalt Trap Rock excavated top-down from volcanic hillside. Style: Rashtrakuta Monolithic Rock-Cut Sculpture.",
    "significance": "Ravana Shaking Mount Kailash Bas-Relief (Ellora Cave 16) is a prominent heritage landmark in Maharashtra. ASI Ref: N-MH-A12 (Ellora Caves / Cave 16), UNESCO Status: Part of UNESCO World Heritage Site Ref. 243.",
    "architecture": "Style: Rashtrakuta Monolithic Rock-Cut Sculpture. Construction Materials: Basalt Trap Rock excavated top-down from volcanic hillside. Dimensions: Height: 4.2 m (13.8 ft); Width: 3.5 m; Depth of relief: 80 cm.",
    "keyFacts": [
      "Ruler / Dynasty: Rashtrakuta Dynasty (King Krishna I)",
      "Period: 8th Century CE (c. 760 – 775 CE)",
      "Architectural Style: Rashtrakuta Monolithic Rock-Cut Sculpture",
      "Location: Ellora, Aurangabad (Chhatrapati Sambhajinagar), Maharashtra",
      "ASI Reference: N-MH-A12 (Ellora Caves / Cave 16)",
      "UNESCO: Part of UNESCO World Heritage Site Ref. 243"
    ],
    "period": "8th Century CE (c. 760 – 775 CE)"
  },
  {
    "placeId": "IND-ART-39",
    "shortStory": "The supreme masterpiece of Asian ancient painting. Surviving in complete darkness inside Cave 1 for 1,500 years, illuminated only by fiber-optic non-heat museum lamps. It represents universal compassion (Karuna) and influenced Buddhist art across the Silk Road to Dunhuang, China.",
    "history": "Built during Late 5th Century CE (c. 480 CE) under Vakataka Dynasty (Emperor Harishena). Construction: Mud Plaster on Basalt, Cow Dung, Rice Husk, Natural Mineral Pigments (Lapis Lazuli, Ochre, Lamp Black, Lime). Style: Classical Gupta-Vakataka Tempera Mural.",
    "significance": "Padmapani Bodhisattva Fresco (Ajanta Cave 1) is a prominent heritage landmark in Maharashtra. ASI Ref: N-MH-A1 (Ajanta Caves / Cave 1), UNESCO Status: UNESCO World Heritage Site Ref. 242.",
    "architecture": "Style: Classical Gupta-Vakataka Tempera Mural. Construction Materials: Mud Plaster on Basalt, Cow Dung, Rice Husk, Natural Mineral Pigments (Lapis Lazuli, Ochre, Lamp Black, Lime). Dimensions: Height: 2.1 m; Width: 1.3 m.",
    "keyFacts": [
      "Ruler / Dynasty: Vakataka Dynasty (Emperor Harishena)",
      "Period: Late 5th Century CE (c. 480 CE)",
      "Architectural Style: Classical Gupta-Vakataka Tempera Mural",
      "Location: Ajanta, Aurangabad (Chhatrapati Sambhajinagar), Maharashtra",
      "ASI Reference: N-MH-A1 (Ajanta Caves / Cave 1)",
      "UNESCO: UNESCO World Heritage Site Ref. 242"
    ],
    "period": "Late 5th Century CE (c. 480 CE)"
  },
  {
    "placeId": "IND-ART-40",
    "shortStory": "Named after the myth of infant Lord Krishna repeatedly stealing butter (makhan) from his mother's pot. In 1908, the British Governor of Madras, Arthur Havelock, tied seven elephants to the boulder in an attempt to pull it down for public safety, but the stone refused to budge an inch.",
    "history": "Built during 7th Century CE (Over 1,300 Years Balanced) under Pallava Dynasty (King Narasimhavarman I / Mamalla). Construction: Solid Crystalline Grey Granite. Style: Natural Monolithic Granite Balancing Formation.",
    "significance": "Krishna's Butterball (Mahabalipuram Balancing Boulder) is a prominent heritage landmark in Tamil Nadu. ASI Ref: Part of Mahabalipuram Monuments, UNESCO Status: Part of Group of Monuments at Mahabalipuram (Ref. 249).",
    "architecture": "Style: Natural Monolithic Granite Balancing Formation. Construction Materials: Solid Crystalline Grey Granite. Dimensions: Diameter: ~6 m (20 ft); Height: 6 m; Weight: ~250 Tonnes.",
    "keyFacts": [
      "Ruler / Dynasty: Pallava Dynasty (King Narasimhavarman I / Mamalla)",
      "Period: 7th Century CE (Over 1,300 Years Balanced)",
      "Architectural Style: Natural Monolithic Granite Balancing Formation",
      "Location: Mahabalipuram, Chengalpattu District, Tamil Nadu",
      "ASI Reference: Part of Mahabalipuram Monuments",
      "UNESCO: Part of Group of Monuments at Mahabalipuram (Ref. 249)"
    ],
    "period": "7th Century CE (Over 1,300 Years Balanced)"
  },
  {
    "placeId": "IND-ART-41",
    "shortStory": "A military engineering marvel built for defense against surprise siege attacks. A single hand clap struck under the dome of Fateh Darwaza travels through acoustic compression tunnels up the granite hill to alert guards at the hilltop citadel 1,000 meters away.",
    "history": "Built during 16th Century CE under Qutb Shahi Dynasty (Sultan Quli Qutb Shah). Construction: Dressed Granite Blocks with Lime Surkhi Mortar. Style: Deccani Military Indo-Persian Architecture.",
    "significance": "Fateh Darwaza Acoustic Clapping Dome (Golconda Fort) is a prominent heritage landmark in Telangana. ASI Ref: N-TL-2 (Golconda Fort), UNESCO Status: Tentative List World Heritage Site.",
    "architecture": "Style: Deccani Military Indo-Persian Architecture. Construction Materials: Dressed Granite Blocks with Lime Surkhi Mortar. Dimensions: Arch Span: 4.8 m, Vault Height: 9.5 m; Signal distance: 1 km.",
    "keyFacts": [
      "Ruler / Dynasty: Qutb Shahi Dynasty (Sultan Quli Qutb Shah)",
      "Period: 16th Century CE",
      "Architectural Style: Deccani Military Indo-Persian Architecture",
      "Location: Hyderabad, Golconda, Telangana",
      "ASI Reference: N-TL-2 (Golconda Fort)",
      "UNESCO: Tentative List World Heritage Site"
    ],
    "period": "16th Century CE"
  },
  {
    "placeId": "IND-ART-42",
    "shortStory": "Cast in Cairo, Egypt by Ottoman Sultan Suleiman's imperial foundries and dispatched with admiral Hadim Suleiman Pasha's fleet to Diu to aid Gujarat Sultan Bahadur Shah against Portuguese naval expansion. Following the siege of Diu in 1538, the cannons were moved to the citadel of Uparkot in Junagadh.",
    "history": "Built during 1531 CE (16th Century) under Ottoman Empire (Sultan Suleiman the Magnificent) & Gujarat Sultanate (Bahadur Shah). Construction: Cast Bell Bronze Alloy with Arabic Epigraphy. Style: Ottoman Imperial Bronze Heavy Ordnance.",
    "significance": "Neelam and Manek Ottoman Cannons (Uparkot Fort) is a prominent heritage landmark in Gujarat. ASI Ref: Uparkot Citadel Armory Heritage, UNESCO Status: Historic Saurashtra Defense Heritage.",
    "architecture": "Style: Ottoman Imperial Bronze Heavy Ordnance. Construction Materials: Cast Bell Bronze Alloy with Arabic Epigraphy. Dimensions: Length: 5.2 m (17 ft); Bore Diameter: 24 cm (9.5 in); Weight: ~11 Tonnes.",
    "keyFacts": [
      "Ruler / Dynasty: Ottoman Empire (Sultan Suleiman the Magnificent) & Gujarat Sultanate (Bahadur Shah)",
      "Period: 1531 CE (16th Century)",
      "Architectural Style: Ottoman Imperial Bronze Heavy Ordnance",
      "Location: Junagadh, Saurashtra, Gujarat",
      "ASI Reference: Uparkot Citadel Armory Heritage",
      "UNESCO: Historic Saurashtra Defense Heritage"
    ],
    "period": "1531 CE (16th Century)"
  },
  {
    "placeId": "IND-ART-43",
    "shortStory": "Built in 1499 by Queen Rudabai in memory of her husband Rana Veer Singh. Adalaj Stepwell is famous for its unique blend of Hindu and Jain iconographic symbols with Islamic geometric floral screens. The Navagraha frieze was carved near the water line to protect the well from cosmic malevolence and earthquakes.",
    "history": "Built during 1499 CE (Late 15th Century) under Vaghela Dynasty (Rani Rudabai & Rana Veer Singh). Construction: Porbandar and Dhrangadhra fine sandstone. Style: Maru-Gurjara Solanki & Indo-Islamic Synthesis.",
    "significance": "Navagraha Frieze & Ami Khumbh Reservoir (Adalaj Stepwell) is a prominent heritage landmark in Gujarat. ASI Ref: N-GJ-73 (Adalaj Stepwell), UNESCO Status: Centrally Protected Monument of National Importance.",
    "architecture": "Style: Maru-Gurjara Solanki & Indo-Islamic Synthesis. Construction Materials: Porbandar and Dhrangadhra fine sandstone. Dimensions: Frieze length: 2.2 m; Depth: 5th subterranean level (25m down).",
    "keyFacts": [
      "Ruler / Dynasty: Vaghela Dynasty (Rani Rudabai & Rana Veer Singh)",
      "Period: 1499 CE (Late 15th Century)",
      "Architectural Style: Maru-Gurjara Solanki & Indo-Islamic Synthesis",
      "Location: Adalaj, Gandhinagar District, Gujarat",
      "ASI Reference: N-GJ-73 (Adalaj Stepwell)",
      "UNESCO: Centrally Protected Monument of National Importance"
    ],
    "period": "1499 CE (Late 15th Century)"
  },
  {
    "placeId": "p-gateway-of-india",
    "shortStory": "Erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder in December 1911. Historically significant as the ceremonial departure point for the last British troops (First Battalion of Somerset Light Infantry) exiting independent India on February 28, 1948.",
    "detailedHistory": "Gateway of India is situated in Mumbai District, South Mumbai, Maharashtra. Architectural Style: Indo-Saracenic Revival with Gujarati 16th-century Architectural Elements. Built during 1911 – 1924 CE (20th Century) by British Raj (Architect: George Wittet). Key scannable features include Central Grand Arch, 4 Corner Turrets, Intricate Basalt Latticework, Waterfront Sea Steps, Commemorative Inscriptions. Ingested from Archaeological Survey of India (Mumbai Circle) & Maharashtra Tourism Development Corporation (MTDC) with Kaggle benchmark validation.",
    "childStory": "Did you know? Gateway of India was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Gateway of India. As you gaze upon this majestic site, notice the intricate Indo-Saracenic Revival with Gujarati 16th-century Architectural Elements. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "Centrally Protected Monument (ASI)",
      "Maharashtra",
      "Kaggle Benchmark"
    ],
    "history": "Gateway of India is situated in Mumbai District, South Mumbai, Maharashtra. Architectural Style: Indo-Saracenic Revival with Gujarati 16th-century Architectural Elements. Built during 1911 – 1924 CE (20th Century) by British Raj (Architect: George Wittet). Key scannable features include Central Grand Arch, 4 Corner Turrets, Intricate Basalt Latticework, Waterfront Sea Steps, Commemorative Inscriptions. Ingested from Archaeological Survey of India (Mumbai Circle) & Maharashtra Tourism Development Corporation (MTDC) with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Gateway of India.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Gateway of India",
      "Category: Heritage",
      "Coordinates: 18.9220 N, 72.8347 E",
      "Visiting: Open 24 Hours. Best visited sunrise or sunset. Ferry terminal for Elephanta Caves departs from the rear steps. High security baggage screening."
    ]
  },
  {
    "placeId": "p-brihadeeswarar-temple",
    "shortStory": "Commissioned by the greatest Chola conqueror, Rajaraja I, in 1010 CE to celebrate his naval victories across the Bay of Bengal, Sri Lanka, and Southeast Asia. The octagonal shikhara was positioned via a 6-km inclined earthen ramp.",
    "detailedHistory": "Brihadeeswarar Temple (Peruvudaiyar Kovil) is situated in Thanjavur District, Thanjavur, Tamil Nadu. Architectural Style: Pure Dravidian Temple Architecture (Dravida Vimana Pinnacle). Built during 1003 – 1010 CE (11th Century) by Chola Empire (Emperor Raja Raja Chola I). Key scannable features include 66m Soaring Vimana Tower, 80-tonne Monolithic Kumbam, Massive Monolithic Nandi (12-tonne single granite), Nataraja Bronzes, Tamil Chola Inscriptions. Ingested from Archaeological Survey of India (Chennai Circle) & UNESCO WHC Dossier No. 250 with Kaggle benchmark validation.",
    "childStory": "Did you know? Brihadeeswarar Temple was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Brihadeeswarar Temple. As you gaze upon this majestic site, notice the intricate Pure Dravidian Temple Architecture (Dravida Vimana Pinnacle). Let your eyes travel up to the towering ramparts...",
    "tags": [
      "UNESCO World Heritage Site",
      "Tamil Nadu",
      "Kaggle Benchmark"
    ],
    "history": "Brihadeeswarar Temple (Peruvudaiyar Kovil) is situated in Thanjavur District, Thanjavur, Tamil Nadu. Architectural Style: Pure Dravidian Temple Architecture (Dravida Vimana Pinnacle). Built during 1003 – 1010 CE (11th Century) by Chola Empire (Emperor Raja Raja Chola I). Key scannable features include 66m Soaring Vimana Tower, 80-tonne Monolithic Kumbam, Massive Monolithic Nandi (12-tonne single granite), Nataraja Bronzes, Tamil Chola Inscriptions. Ingested from Archaeological Survey of India (Chennai Circle) & UNESCO WHC Dossier No. 250 with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Brihadeeswarar Temple.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Brihadeeswarar Temple",
      "Category: Heritage",
      "Coordinates: 10.7828 N, 79.1318 E",
      "Visiting: Open 6:00 AM – 12:30 PM & 4:00 PM – 8:30 PM. Free entry. Non-leather footwear strictly enforced."
    ]
  },
  {
    "placeId": "p-india-gate",
    "shortStory": "Dedicated to 84,000 soldiers of the British Indian Army who made the supreme sacrifice in the First World War (1914–1918) and the Third Anglo-Afghan War (1919). The foundation stone was laid by the Duke of Connaught in 1921.",
    "detailedHistory": "India Gate (All India War Memorial) is situated in New Delhi District, Central Vista, Delhi. Architectural Style: Beaux-Arts Classical Triumphal Arch. Built during 1921 – 1931 CE (20th Century) by British India (Architect: Sir Edwin Lutyens). Key scannable features include Amar Jawan Jyoti, Inscribed Names of 13,300+ Fallen Soldiers, Shallow Domed Roof Cenotaph, Grand Canopy, Kartavya Path Vista. Ingested from Ministry of Defence / Archaeological Survey of India (Delhi Circle) & data.gov.in with Kaggle benchmark validation.",
    "childStory": "Did you know? India Gate was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to India Gate. As you gaze upon this majestic site, notice the intricate Beaux-Arts Classical Triumphal Arch. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "National Memorial & Monument",
      "Delhi",
      "Kaggle Benchmark"
    ],
    "history": "India Gate (All India War Memorial) is situated in New Delhi District, Central Vista, Delhi. Architectural Style: Beaux-Arts Classical Triumphal Arch. Built during 1921 – 1931 CE (20th Century) by British India (Architect: Sir Edwin Lutyens). Key scannable features include Amar Jawan Jyoti, Inscribed Names of 13,300+ Fallen Soldiers, Shallow Domed Roof Cenotaph, Grand Canopy, Kartavya Path Vista. Ingested from Ministry of Defence / Archaeological Survey of India (Delhi Circle) & data.gov.in with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of India Gate.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: India Gate",
      "Category: Heritage",
      "Coordinates: 28.6129 N, 77.2295 E",
      "Visiting: Open 24 hours. Illuminated daily from 7:00 PM – 10:00 PM. Adjacent to National War Memorial."
    ]
  },
  {
    "placeId": "p-lotus-temple",
    "shortStory": "A monument to the oneness of humanity and universal worship, conceived in the form of an opening Sacred Lotus (Nelumbo nucifera). Designed by Iranian-Canadian architect Fariborz Sahba, its 27 delicate petals are clad in pure white marble quarried from Mount Pentelikon in Greece.",
    "detailedHistory": "Lotus Temple (Baháʼí House of Worship) is situated in South Delhi District, Kalkaji, Delhi. Architectural Style: Biomorphic Expressionist Lotus Architecture. Built during 1980 – 1986 CE (20th Century) by Baháʼí International Community (Architect: Fariborz Sahba). Key scannable features include 27 Free-standing Petals in 3 Clusters, 9 Symmetrical Ponds, Central Hall of Silence, Skylight Optical Glazing. Ingested from National Baháʼí Council of India & Delhi Tourism (DTTDC) with Kaggle benchmark validation.",
    "childStory": "Did you know? Lotus Temple was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Lotus Temple. As you gaze upon this majestic site, notice the intricate Biomorphic Expressionist Lotus Architecture. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "Centrally Protected Monument (ASI)",
      "Delhi",
      "Kaggle Benchmark"
    ],
    "history": "Lotus Temple (Baháʼí House of Worship) is situated in South Delhi District, Kalkaji, Delhi. Architectural Style: Biomorphic Expressionist Lotus Architecture. Built during 1980 – 1986 CE (20th Century) by Baháʼí International Community (Architect: Fariborz Sahba). Key scannable features include 27 Free-standing Petals in 3 Clusters, 9 Symmetrical Ponds, Central Hall of Silence, Skylight Optical Glazing. Ingested from National Baháʼí Council of India & Delhi Tourism (DTTDC) with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Lotus Temple.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Lotus Temple",
      "Category: Heritage",
      "Coordinates: 28.5535 N, 77.2588 E",
      "Visiting: 9:00 AM – 5:30 PM (Winter) / 7:00 PM (Summer). Closed Mondays. Silence strictly observed inside sanctum."
    ]
  },
  {
    "placeId": "p-sinhagad-fort",
    "shortStory": "Site of the legendary Battle of Sinhagad (February 1670), where Maratha subedar Tanaji Malusare scaled the sheer, near-vertical southern cliff using a trained monitor lizard (ghorpad) named Yashwanti in the dead of night. Tanaji died winning the fort from Mughal commander Udaybhan Rathod, prompting Shivaji Maharaj's historic words: 'Gad ala, pan sinh gela' ('The fort is won, but the lion is lost').",
    "detailedHistory": "Sinhagad Fort (Kondhana Lion Fortress) is situated in Pune District, Haveli Taluka, Maharashtra. Architectural Style: Sahyadri Mountain Rock-Cut Fortification & Bastion Wall. Built during 14th – 17th Century CE by Maratha Empire (Chhatrapati Shivaji Maharaj & Tanaji Malusare). Key scannable features include Pune Darwaza, Kalyan Darwaza, Tanaji Malusare Memorial Samadhi, Devtaka Sweet Water Cistern, Wind Point (Hawa Point). Ingested from Archaeological Survey of India (Pune Circle) & Maharashtra Tourism (MTDC) with Kaggle benchmark validation.",
    "childStory": "Did you know? Sinhagad Fort was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Sinhagad Fort. As you gaze upon this majestic site, notice the intricate Sahyadri Mountain Rock-Cut Fortification & Bastion Wall. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "State & Centrally Protected Monument (ASI)",
      "Maharashtra",
      "Kaggle Benchmark"
    ],
    "history": "Sinhagad Fort (Kondhana Lion Fortress) is situated in Pune District, Haveli Taluka, Maharashtra. Architectural Style: Sahyadri Mountain Rock-Cut Fortification & Bastion Wall. Built during 14th – 17th Century CE by Maratha Empire (Chhatrapati Shivaji Maharaj & Tanaji Malusare). Key scannable features include Pune Darwaza, Kalyan Darwaza, Tanaji Malusare Memorial Samadhi, Devtaka Sweet Water Cistern, Wind Point (Hawa Point). Ingested from Archaeological Survey of India (Pune Circle) & Maharashtra Tourism (MTDC) with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Sinhagad Fort.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Sinhagad Fort",
      "Category: Fort",
      "Coordinates: 18.3663 N, 73.7558 E",
      "Visiting: 6:00 AM – 6:00 PM daily. Excellent monsoon trekking. Traditional Kanda Bhaji and Pitla Bhakri served by local villagers atop fort."
    ]
  },
  {
    "placeId": "p-pratapgad-fort",
    "shortStory": "Famed for the fateful encounter on November 10, 1659, between Chhatrapati Shivaji Maharaj and Bijapur general Afzal Khan. When Afzal Khan attempted to stab Shivaji during a ceremonial embrace, Shivaji retaliated using concealed tiger claws (Bagh Nakh) and bichwa dagger, turning the tide of Maratha military sovereignty.",
    "detailedHistory": "Pratapgad Fort (Fortress of Valour) is situated in Satara District, Mahabaleshwar, Maharashtra. Architectural Style: Two-tiered Hill Fortification (Upper and Lower Ballekila). Built during 1656 CE (17th Century) by Maratha Empire (Chhatrapati Shivaji Maharaj / Moropant Trimbak Pingle). Key scannable features include Bhavani Mata Temple, Afzal Khan Tomb (Burial Cenotaph), Equestrian Bronze Statue of Shivaji, Reda Buruj, Hidden Bastion Gates. Ingested from Directorate of Archaeology and Museums, Government of Maharashtra with Kaggle benchmark validation.",
    "childStory": "Did you know? Pratapgad Fort was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Pratapgad Fort. As you gaze upon this majestic site, notice the intricate Two-tiered Hill Fortification (Upper and Lower Ballekila). Let your eyes travel up to the towering ramparts...",
    "tags": [
      "State Protected Monument",
      "Maharashtra",
      "Kaggle Benchmark"
    ],
    "history": "Pratapgad Fort (Fortress of Valour) is situated in Satara District, Mahabaleshwar, Maharashtra. Architectural Style: Two-tiered Hill Fortification (Upper and Lower Ballekila). Built during 1656 CE (17th Century) by Maratha Empire (Chhatrapati Shivaji Maharaj / Moropant Trimbak Pingle). Key scannable features include Bhavani Mata Temple, Afzal Khan Tomb (Burial Cenotaph), Equestrian Bronze Statue of Shivaji, Reda Buruj, Hidden Bastion Gates. Ingested from Directorate of Archaeology and Museums, Government of Maharashtra with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Pratapgad Fort.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Pratapgad Fort",
      "Category: Fort",
      "Coordinates: 17.9272 N, 73.5794 E",
      "Visiting: 6:00 AM – 6:00 PM. High rain during monsoons. Guides available at the base village."
    ]
  },
  {
    "placeId": "p-murud-janjira-fort",
    "shortStory": "Considered the only unconquered sea fort along India's western coastline. Resisted repeated amphibious and land sieges by the Marathas under Shivaji Maharaj and Sambhaji Maharaj, the Portuguese armada, and the British East India Company across three centuries.",
    "detailedHistory": "Murud-Janjira Fort (Impregnable Marine Fortress) is situated in Raigad District, Murud, Maharashtra. Architectural Style: Marine Coastal Fortification with Camouflaged Sea Gates. Built during 15th – 17th Century CE by Siddi Dynasty of Janjira (Habshi Seafarers of Abyssinian origin). Key scannable features include Kalal Bangadi Giant Bronze Cannon (3rd heaviest cannon in India), Camouflaged Darya Darwaza (Water Gate), Sweet Water Freshwater Ponds in the middle of Arabian Sea. Ingested from Archaeological Survey of India (Mumbai Circle) & data.gov.in with Kaggle benchmark validation.",
    "childStory": "Did you know? Murud-Janjira Fort was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Murud-Janjira Fort. As you gaze upon this majestic site, notice the intricate Marine Coastal Fortification with Camouflaged Sea Gates. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "Centrally Protected Monument (ASI)",
      "Maharashtra",
      "Kaggle Benchmark"
    ],
    "history": "Murud-Janjira Fort (Impregnable Marine Fortress) is situated in Raigad District, Murud, Maharashtra. Architectural Style: Marine Coastal Fortification with Camouflaged Sea Gates. Built during 15th – 17th Century CE by Siddi Dynasty of Janjira (Habshi Seafarers of Abyssinian origin). Key scannable features include Kalal Bangadi Giant Bronze Cannon (3rd heaviest cannon in India), Camouflaged Darya Darwaza (Water Gate), Sweet Water Freshwater Ponds in the middle of Arabian Sea. Ingested from Archaeological Survey of India (Mumbai Circle) & data.gov.in with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Murud-Janjira Fort.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Murud-Janjira Fort",
      "Category: Fort",
      "Coordinates: 18.3005 N, 72.9644 E",
      "Visiting: 7:00 AM – 5:30 PM (Subject to ocean tide schedules). Reached exclusively by local sailboat ferries from Rajapuri jetty. Closed during heavy monsoon squalls (June to August)."
    ]
  },
  {
    "placeId": "p-mehrangarh-fort",
    "shortStory": "Founded in 1459 by Rao Jodha atop Bhakurcheeria ('Mountain of Birds'). Cannonball marks from attacking Jaipur forces are still visible near the Loha Pol (Iron Gate), which also preserves the tragic handprints (sati marks) of 15 royal ranis who immolated themselves following Maharaja Man Singh's demise in 1843.",
    "detailedHistory": "Mehrangarh Fort (Citadel of the Sun) is situated in Jodhpur District, Jodhpur (Blue City), Rajasthan. Architectural Style: Mighty Rajput Fort Architecture with Ornate Sandstone Palaces. Built during Founded 1459 CE (15th – 17th Century additions) by Rathore Dynasty (Rao Jodha). Key scannable features include 7 Massive Victory Gates (Jai Pol, Fateh Pol with cannonball scars), Sheesh Mahal (Mirror Palace), Phool Mahal (Flower Palace), Kilkila Cannon, Royal Howdah Gallery. Ingested from Mehrangarh Museum Trust & Archaeological Survey of India (Jaipur Circle) with Kaggle benchmark validation.",
    "childStory": "Did you know? Mehrangarh Fort was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Mehrangarh Fort. As you gaze upon this majestic site, notice the intricate Mighty Rajput Fort Architecture with Ornate Sandstone Palaces. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "Centrally Protected Monument (ASI)",
      "Rajasthan",
      "Kaggle Benchmark"
    ],
    "history": "Mehrangarh Fort (Citadel of the Sun) is situated in Jodhpur District, Jodhpur (Blue City), Rajasthan. Architectural Style: Mighty Rajput Fort Architecture with Ornate Sandstone Palaces. Built during Founded 1459 CE (15th – 17th Century additions) by Rathore Dynasty (Rao Jodha). Key scannable features include 7 Massive Victory Gates (Jai Pol, Fateh Pol with cannonball scars), Sheesh Mahal (Mirror Palace), Phool Mahal (Flower Palace), Kilkila Cannon, Royal Howdah Gallery. Ingested from Mehrangarh Museum Trust & Archaeological Survey of India (Jaipur Circle) with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Mehrangarh Fort.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Mehrangarh Fort",
      "Category: Fort",
      "Coordinates: 26.2978 N, 73.0185 E",
      "Visiting: 9:00 AM – 5:00 PM daily. Elevator service available to the top museum deck. Audio guides in 12 languages. Zip-lining (Flying Fox) tours operate across fort battlements."
    ]
  },
  {
    "placeId": "p-jaisalmer-fort",
    "shortStory": "One of the world's very few fully inhabited 'living forts'. It glows with a brilliant honey-gold hue in desert sunlight, earning the sobriquet 'Sonar Qila' (immortalized by Satyajit Ray). Controlled the lucrative spice and silk trade routes between India, Persia, and Central Asia.",
    "detailedHistory": "Jaisalmer Fort (Sonar Qila / The Golden Fort) is situated in Jaisalmer District, Thar Desert, Rajasthan. Architectural Style: Desert Rajput Military Architecture with 99 Bastions. Built during 1156 CE (12th Century) by Bhati Rajput Dynasty (Rawal Jaisal). Key scannable features include Living Fort Quarters (1/4th city population resides inside), 7 Exquisite 12th-16th Century Jain Temples, Raj Mahal Palace, Akshaya Pol, Canon Point. Ingested from Archaeological Survey of India (Jaipur Circle) & UNESCO WHC Dossier No. 247 with Kaggle benchmark validation.",
    "childStory": "Did you know? Jaisalmer Fort was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Jaisalmer Fort. As you gaze upon this majestic site, notice the intricate Desert Rajput Military Architecture with 99 Bastions. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "UNESCO World Heritage Site",
      "Rajasthan",
      "Kaggle Benchmark"
    ],
    "history": "Jaisalmer Fort (Sonar Qila / The Golden Fort) is situated in Jaisalmer District, Thar Desert, Rajasthan. Architectural Style: Desert Rajput Military Architecture with 99 Bastions. Built during 1156 CE (12th Century) by Bhati Rajput Dynasty (Rawal Jaisal). Key scannable features include Living Fort Quarters (1/4th city population resides inside), 7 Exquisite 12th-16th Century Jain Temples, Raj Mahal Palace, Akshaya Pol, Canon Point. Ingested from Archaeological Survey of India (Jaipur Circle) & UNESCO WHC Dossier No. 247 with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Jaisalmer Fort.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Jaisalmer Fort",
      "Category: Fort",
      "Coordinates: 26.9124 N, 70.9127 E",
      "Visiting: Open 24 hours (living fort). Museum timings: 9:00 AM – 6:00 PM. Walking tours recommended through narrow cobblestone alleys."
    ]
  },
  {
    "placeId": "p-bhujia-fort-hill-citadel",
    "shortStory": "Constructed to safeguard Bhuj from marauding Mughal viceroys and bandit raids. Played a dramatic role in 1723 when Sher Buland Khan, Mughal viceroy of Gujarat, laid siege to Bhuj; local Naga Sadhus opened the gates during Nag Panchami and mounted a fierce combat charge, routing the Mughal army.",
    "detailedHistory": "Bhujia Fort & Hill Citadel is situated in Kutch District, Bhuj, Gujarat. Architectural Style: Kutchi Rajput Stone Hill Fortification. Built during 1715 – 1741 CE (18th Century) by Jadeja Rajput Dynasty (Rao Godji I & Maharao Deshalji I). Key scannable features include Bhujang Naag Temple, Battlements overlooking Rann, Powder Magazine (Barud Khana), Hill Observation Tower, Water Cisterns. Ingested from Gujarat Tourism (TCGL) & Gujarat State Archaeology Department with Kaggle benchmark validation.",
    "childStory": "Did you know? Bhujia Fort & Hill Citadel was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Bhujia Fort & Hill Citadel. As you gaze upon this majestic site, notice the intricate Kutchi Rajput Stone Hill Fortification. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "State Heritage Monument & Coastal Fortress",
      "Gujarat",
      "Kaggle Benchmark"
    ],
    "history": "Bhujia Fort & Hill Citadel is situated in Kutch District, Bhuj, Gujarat. Architectural Style: Kutchi Rajput Stone Hill Fortification. Built during 1715 – 1741 CE (18th Century) by Jadeja Rajput Dynasty (Rao Godji I & Maharao Deshalji I). Key scannable features include Bhujang Naag Temple, Battlements overlooking Rann, Powder Magazine (Barud Khana), Hill Observation Tower, Water Cisterns. Ingested from Gujarat Tourism (TCGL) & Gujarat State Archaeology Department with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Bhujia Fort & Hill Citadel.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Bhujia Fort & Hill Citadel",
      "Category: Fort",
      "Coordinates: 23.2458 N, 69.6914 E",
      "Visiting: 6:00 AM – 7:00 PM. Steep climb of ~600 steps. Annual festive fair held on Nag Panchami (Shravan month)."
    ]
  },
  {
    "placeId": "p-diu-fort",
    "shortStory": "Built following an alliance between Bahadur Shah, Sultan of Gujarat, and the Portuguese against Mughal Emperor Humayun in 1535. Survived epic combined naval sieges by the Ottoman Turkish navy (under Hadim Suleiman Pasha) and the Gujarat Sultanate in 1538 and 1546.",
    "detailedHistory": "Diu Fort (Praça de Diu Sea Fortress) is situated in Diu / Saurashtra Coast, Diu Island, Gujarat. Architectural Style: Renaissance Bastioned Sea Fortress. Built during 1535 – 1546 CE (16th Century) by Portuguese Maritime Empire (Governor Nuno da Cunha). Key scannable features include Rock-cut Double Moat, High Venetian Lighthouse, St. Paul's Church, Sea-facing Gun Emplacements, Underground Prison Vaults. Ingested from Archaeological Survey of India (Vadodara Circle) & Daman & Diu Tourism with Kaggle benchmark validation.",
    "childStory": "Did you know? Diu Fort was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Diu Fort. As you gaze upon this majestic site, notice the intricate Renaissance Bastioned Sea Fortress. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "Centrally Protected Monument (ASI)",
      "Gujarat",
      "Kaggle Benchmark"
    ],
    "history": "Diu Fort (Praça de Diu Sea Fortress) is situated in Diu / Saurashtra Coast, Diu Island, Gujarat. Architectural Style: Renaissance Bastioned Sea Fortress. Built during 1535 – 1546 CE (16th Century) by Portuguese Maritime Empire (Governor Nuno da Cunha). Key scannable features include Rock-cut Double Moat, High Venetian Lighthouse, St. Paul's Church, Sea-facing Gun Emplacements, Underground Prison Vaults. Ingested from Archaeological Survey of India (Vadodara Circle) & Daman & Diu Tourism with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Diu Fort.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Diu Fort",
      "Category: Fort",
      "Coordinates: 20.7139 N, 70.9942 E",
      "Visiting: 8:00 AM – 6:00 PM. Sweeping 360-degree views of the Arabian Sea. Cool sea breezes even in midday."
    ]
  },
  {
    "placeId": "p-idar-fort",
    "shortStory": "Celebrated in Gujarati folklore and proverbs ('Idario Gadh Jitya' - 'Conquering the unconquerable fort of Idar'). Perched amid colossal natural granite tors of the Aravallis, it proved an impenetrable bastion against raiding Sultanate forces due to natural labyrinthine rock chutes.",
    "detailedHistory": "Idar Fort (Idargadh / Ilva Durga) is situated in Sabarkantha District, Idar, Gujarat. Architectural Style: Rugged Natural Granitic Tor Fortification. Built during Mentioned in Mahabharata; Fortified 12th – 18th Century CE by Rathore Dynasty of Idar & Ancient Ilva Kingdom. Key scannable features include Ruthibani Palace (Palace of the Angry Queen), Gadh Mandir, Ancient Jain Cave Temples, Sheela Udyan (Granite boulder field), Natural Hill Springs. Ingested from Gujarat Tourism (TCGL) & Gujarat State Archaeology Department with Kaggle benchmark validation.",
    "childStory": "Did you know? Idar Fort was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Idar Fort. As you gaze upon this majestic site, notice the intricate Rugged Natural Granitic Tor Fortification. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "State Heritage Monument & Coastal Fortress",
      "Gujarat",
      "Kaggle Benchmark"
    ],
    "history": "Idar Fort (Idargadh / Ilva Durga) is situated in Sabarkantha District, Idar, Gujarat. Architectural Style: Rugged Natural Granitic Tor Fortification. Built during Mentioned in Mahabharata; Fortified 12th – 18th Century CE by Rathore Dynasty of Idar & Ancient Ilva Kingdom. Key scannable features include Ruthibani Palace (Palace of the Angry Queen), Gadh Mandir, Ancient Jain Cave Temples, Sheela Udyan (Granite boulder field), Natural Hill Springs. Ingested from Gujarat Tourism (TCGL) & Gujarat State Archaeology Department with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Idar Fort.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Idar Fort",
      "Category: Fort",
      "Coordinates: 23.8344 N, 73.0033 E",
      "Visiting: 6:00 AM – 6:00 PM daily. Excellent boulder hiking and photography of weathered granite formations."
    ]
  },
  {
    "placeId": "p-kanthkot-fort",
    "shortStory": "Historic refuge of Solanki King Bhima I when Mahmud of Ghazni invaded Gujarat in 1025 CE. Built atop a flat, isolated tableland surrounded by sheer rock cliffs, serving as an impregnable tactical sanctuary throughout early medieval warfare.",
    "detailedHistory": "Kanthkot Fort (Ancient Solanki Bastion) is situated in Kutch District, Bhachau Taluka, Gujarat. Architectural Style: Early Solanki Stone Citadel Architecture. Built during 8th – 11th Century CE by Chaulukya / Solanki Dynasty (Mularaja I & Bhima I). Key scannable features include Ruined Sun Temple (Surya Mandir), Mahavira Jain Shrines, Stepwells of Kanthkot, Ancient Granary Cisterns. Ingested from Gujarat Tourism (TCGL) & Archaeological Survey of India (Vadodara Circle) with Kaggle benchmark validation.",
    "childStory": "Did you know? Kanthkot Fort was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Kanthkot Fort. As you gaze upon this majestic site, notice the intricate Early Solanki Stone Citadel Architecture. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "State Protected Monument",
      "Gujarat",
      "Kaggle Benchmark"
    ],
    "history": "Kanthkot Fort (Ancient Solanki Bastion) is situated in Kutch District, Bhachau Taluka, Gujarat. Architectural Style: Early Solanki Stone Citadel Architecture. Built during 8th – 11th Century CE by Chaulukya / Solanki Dynasty (Mularaja I & Bhima I). Key scannable features include Ruined Sun Temple (Surya Mandir), Mahavira Jain Shrines, Stepwells of Kanthkot, Ancient Granary Cisterns. Ingested from Gujarat Tourism (TCGL) & Archaeological Survey of India (Vadodara Circle) with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Kanthkot Fort.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Kanthkot Fort",
      "Category: Fort",
      "Coordinates: 23.4833 N, 70.5167 E",
      "Visiting: Sunrise to Sunset. Remote site; 4x4 or sturdy vehicle recommended. Fascinating for archaeology enthusiasts."
    ]
  },
  {
    "placeId": "p-roha-fort",
    "shortStory": "Famed for tragic valor where 120 Sumra Rajput princesses committed Jauhar to protect their honor during invasions. In modern times, celebrated poet Kalapi spent significant periods composing poetic verses in the serene hilltop atmosphere of Roha.",
    "detailedHistory": "Roha Fort (Sumra Rajput Citadel) is situated in Kutch District, Nakhtrana Taluka, Gujarat. Architectural Style: Kutchi Masonry Fortress with Haveli Quarters. Built during 15th – 16th Century CE by Chavda / Sumra & Jadeja Rulers (Rao Khengarji I). Key scannable features include Sumra Princesses Samadhi Shrines, Royal Zanana Haveli, Temple of Roha Mata, Defensive Ramparts. Ingested from Gujarat Tourism (TCGL) & Gujarat State Archaeology Department with Kaggle benchmark validation.",
    "childStory": "Did you know? Roha Fort was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Roha Fort. As you gaze upon this majestic site, notice the intricate Kutchi Masonry Fortress with Haveli Quarters. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "State Protected Monument",
      "Gujarat",
      "Kaggle Benchmark"
    ],
    "history": "Roha Fort (Sumra Rajput Citadel) is situated in Kutch District, Nakhtrana Taluka, Gujarat. Architectural Style: Kutchi Masonry Fortress with Haveli Quarters. Built during 15th – 16th Century CE by Chavda / Sumra & Jadeja Rulers (Rao Khengarji I). Key scannable features include Sumra Princesses Samadhi Shrines, Royal Zanana Haveli, Temple of Roha Mata, Defensive Ramparts. Ingested from Gujarat Tourism (TCGL) & Gujarat State Archaeology Department with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Roha Fort.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Roha Fort",
      "Category: Fort",
      "Coordinates: 23.2000 N, 69.0333 E",
      "Visiting: Sunrise to Sunset. Quiet, atmospheric ruins with panoramic views of the Western Kutch expanse."
    ]
  },
  {
    "placeId": "p-kangra-fort",
    "shortStory": "Recognized as the oldest dated fort in India, tracing lineage to the Trigarta Kingdom mentioned in the Mahabharata. Guarded immense treasures of the Kangra Temple; attacked 52 times including by Mahmud of Ghazni (1009 CE), Feroz Shah Tughlaq, Emperor Jahangir (1620 CE), and Gurkha forces under Amar Singh Thapa.",
    "detailedHistory": "Kangra Fort (Nagarkot / Oldest Fort in India) is situated in Kangra District, Kangra Valley, Himachal Pradesh. Architectural Style: Ancient Hilltop Rock Fortification on River Confluence. Built during Founded 4th Century BCE (Over 2,400 years old) by Katoch Dynasty (Trigarta Kingdom - King Susharma Chand). Key scannable features include Darshani Darwaza, Ambika Devi Temple, Ancient Adinath Jain Shrine, Jahangiri Gate, Sheesh Mahal Ruins. Ingested from Archaeological Survey of India (Shimla Circle) & Himachal Tourism (HPTDC) with Kaggle benchmark validation.",
    "childStory": "Did you know? Kangra Fort was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Kangra Fort. As you gaze upon this majestic site, notice the intricate Ancient Hilltop Rock Fortification on River Confluence. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "Centrally Protected Monument (ASI)",
      "Himachal Pradesh",
      "Kaggle Benchmark"
    ],
    "history": "Kangra Fort (Nagarkot / Oldest Fort in India) is situated in Kangra District, Kangra Valley, Himachal Pradesh. Architectural Style: Ancient Hilltop Rock Fortification on River Confluence. Built during Founded 4th Century BCE (Over 2,400 years old) by Katoch Dynasty (Trigarta Kingdom - King Susharma Chand). Key scannable features include Darshani Darwaza, Ambika Devi Temple, Ancient Adinath Jain Shrine, Jahangiri Gate, Sheesh Mahal Ruins. Ingested from Archaeological Survey of India (Shimla Circle) & Himachal Tourism (HPTDC) with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Kangra Fort.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Kangra Fort",
      "Category: Fort",
      "Coordinates: 32.0998 N, 76.2570 E",
      "Visiting: 9:00 AM – 6:00 PM. High-tech audio guide available in the Maharaja Sansar Chandra Museum at base."
    ]
  },
  {
    "placeId": "p-fort-aguada-lighthouse",
    "shortStory": "Named after the Portuguese word 'Água' (water) because ocean-going galleons docked here to replenish their freshwater supplies from natural freshwater springs inside the fort. Defended the mouth of the Mandovi River against Dutch naval blockades and Maratha seaborne offensives.",
    "detailedHistory": "Fort Aguada & Lighthouse is situated in North Goa District, Sinquerim / Candolim, Goa. Architectural Style: Portuguese Maritime Vauban Military Architecture. Built during 1612 CE (17th Century) by Portuguese Colonial Empire. Key scannable features include Four-story 1864 Portuguese Lighthouse, Giant Underground Freshwater Cistern (Aguada = Water), 79 Defense Cannons, Moat. Ingested from Archaeological Survey of India (Goa Circle) & Goa Tourism Development Corporation (GTDC) with Kaggle benchmark validation.",
    "childStory": "Did you know? Fort Aguada & Lighthouse was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Fort Aguada & Lighthouse. As you gaze upon this majestic site, notice the intricate Portuguese Maritime Vauban Military Architecture. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "Centrally Protected Monument (ASI)",
      "Goa",
      "Kaggle Benchmark"
    ],
    "history": "Fort Aguada & Lighthouse is situated in North Goa District, Sinquerim / Candolim, Goa. Architectural Style: Portuguese Maritime Vauban Military Architecture. Built during 1612 CE (17th Century) by Portuguese Colonial Empire. Key scannable features include Four-story 1864 Portuguese Lighthouse, Giant Underground Freshwater Cistern (Aguada = Water), 79 Defense Cannons, Moat. Ingested from Archaeological Survey of India (Goa Circle) & Goa Tourism Development Corporation (GTDC) with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Fort Aguada & Lighthouse.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Fort Aguada & Lighthouse",
      "Category: Fort",
      "Coordinates: 15.4920 N, 73.7736 E",
      "Visiting: 9:30 AM – 6:00 PM. High vantage point for viewing dolphins in the Mandovi estuary."
    ]
  },
  {
    "placeId": "p-bidar-fort-mahmud-gawan-citadel",
    "shortStory": "Ahmad Shah Wali relocated the Bahmani capital from Gulbarga to Bidar in 1428. Renowned for its unique 'Karez' subterranean canal network engineered using Persian hydrology, channeling freshwater through 3 km of underground laterite ducts to supply the citadel even during year-long sieges.",
    "detailedHistory": "Bidar Fort & Mahmud Gawan Citadel is situated in Bidar District, Bidar, Karnataka. Architectural Style: Persianate Deccan Military Architecture with Triple Moat System. Built during 1428 CE (15th Century) by Bahmani Sultanate (Sultan Ahmad Shah I Wali) & Barid Shahi Dynasty. Key scannable features include Rangeen Mahal (Coloured Palace with Mother-of-Pearl inlay), Solah Khamba Mosque, Tarkash Mahal, Gagan Mahal, Karez Persian Underground Aqueducts. Ingested from Archaeological Survey of India (Bengaluru Circle) & data.gov.in with Kaggle benchmark validation.",
    "childStory": "Did you know? Bidar Fort & Mahmud Gawan Citadel was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Bidar Fort & Mahmud Gawan Citadel. As you gaze upon this majestic site, notice the intricate Persianate Deccan Military Architecture with Triple Moat System. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "Centrally Protected Monument (ASI)",
      "Karnataka",
      "Kaggle Benchmark"
    ],
    "history": "Bidar Fort & Mahmud Gawan Citadel is situated in Bidar District, Bidar, Karnataka. Architectural Style: Persianate Deccan Military Architecture with Triple Moat System. Built during 1428 CE (15th Century) by Bahmani Sultanate (Sultan Ahmad Shah I Wali) & Barid Shahi Dynasty. Key scannable features include Rangeen Mahal (Coloured Palace with Mother-of-Pearl inlay), Solah Khamba Mosque, Tarkash Mahal, Gagan Mahal, Karez Persian Underground Aqueducts. Ingested from Archaeological Survey of India (Bengaluru Circle) & data.gov.in with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Bidar Fort & Mahmud Gawan Citadel.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Bidar Fort & Mahmud Gawan Citadel",
      "Category: Fort",
      "Coordinates: 17.9255 N, 77.5303 E",
      "Visiting: 8:00 AM – 6:30 PM. Free entry. Bidriware silver inlay artisan workshops located in nearby Bidar old city."
    ]
  },
  {
    "placeId": "p-chitradurga-fort",
    "shortStory": "Never taken by frontal military assault due to its 7 concentric labyrinthine rings. Site of the famous 1779 siege by Hyder Ali: when soldiers tried sneaking through a narrow secret crevice, heroic woman Onake Obavva stood guard with a heavy wooden rice pestle (Onake), eliminating dozens of invading soldiers single-handedly.",
    "detailedHistory": "Chitradurga Fort (Kallina Kote / Seven-Ring Stone Citadel) is situated in Chitradurga District, Chitradurga, Karnataka. Architectural Style: Dravidian Concentric Military Defense Architecture. Built during 10th – 18th Century CE by Chitradurga Nayaka Dynasty (Madakari Nayaka V). Key scannable features include Onake Obavvana Kindi (Heroine Obavva's Secret Cleft), Hidimbeshwara Rock Cave Temple, Ekanatheshwari Temple, Rainwater Harvesting Talavs, Gunpowder Mills. Ingested from Archaeological Survey of India (Bengaluru Circle) & Karnataka Tourism (KSTDC) with Kaggle benchmark validation.",
    "childStory": "Did you know? Chitradurga Fort was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Chitradurga Fort. As you gaze upon this majestic site, notice the intricate Dravidian Concentric Military Defense Architecture. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "Centrally Protected Monument (ASI)",
      "Karnataka",
      "Kaggle Benchmark"
    ],
    "history": "Chitradurga Fort (Kallina Kote / Seven-Ring Stone Citadel) is situated in Chitradurga District, Chitradurga, Karnataka. Architectural Style: Dravidian Concentric Military Defense Architecture. Built during 10th – 18th Century CE by Chitradurga Nayaka Dynasty (Madakari Nayaka V). Key scannable features include Onake Obavvana Kindi (Heroine Obavva's Secret Cleft), Hidimbeshwara Rock Cave Temple, Ekanatheshwari Temple, Rainwater Harvesting Talavs, Gunpowder Mills. Ingested from Archaeological Survey of India (Bengaluru Circle) & Karnataka Tourism (KSTDC) with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Chitradurga Fort.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Chitradurga Fort",
      "Category: Fort",
      "Coordinates: 14.2185 N, 76.3986 E",
      "Visiting: 6:00 AM – 5:30 PM daily. Requires 3-4 hours of walking across granite steps. Excellent rainwater conservation models."
    ]
  },
  {
    "placeId": "p-rohtasgarh-fort",
    "shortStory": "One of the largest hill fortresses in the world by plateau area. Captured with strategic subterfuge by Sher Shah Suri in 1538 by sending armed soldiers disguised in covered palanquins (dolis) pretending to be royal women seeking shelter. Later served as the invincible headquarters of Mughal Viceroy Raja Man Singh.",
    "detailedHistory": "Rohtasgarh Fort (Shergarh Hill Citadel) is situated in Rohtas District, Kaimur Range, Bihar. Architectural Style: Mughal-Rajput Hill Plateau Citadel Architecture. Built during Ancient roots; Re-fortified 1538 CE by Sher Shah Suri & Raja Man Singh (1588 CE) by Solar Dynasty (Prince Rohitashva) & Suri Empire (Sher Shah Suri). Key scannable features include Man Singh Palace (Hathiya Pol with Carved Elephants), Aina Mahal, Jami Masjid of Rohtas, Shahi Jama Gate, Hanging Balcony. Ingested from Archaeological Survey of India (Patna Circle) & Bihar State Tourism Development Corporation (BSTDC) with Kaggle benchmark validation.",
    "childStory": "Did you know? Rohtasgarh Fort was an incredible wonder built hundreds of years ago! It protected kingdoms with mighty walls and astonishing secrets waiting to be discovered! 🏰✨",
    "audioTourScript": "Welcome to Rohtasgarh Fort. As you gaze upon this majestic site, notice the intricate Mughal-Rajput Hill Plateau Citadel Architecture. Let your eyes travel up to the towering ramparts...",
    "tags": [
      "Centrally Protected Monument (ASI)",
      "Bihar",
      "Kaggle Benchmark"
    ],
    "history": "Rohtasgarh Fort (Shergarh Hill Citadel) is situated in Rohtas District, Kaimur Range, Bihar. Architectural Style: Mughal-Rajput Hill Plateau Citadel Architecture. Built during Ancient roots; Re-fortified 1538 CE by Sher Shah Suri & Raja Man Singh (1588 CE) by Solar Dynasty (Prince Rohitashva) & Suri Empire (Sher Shah Suri). Key scannable features include Man Singh Palace (Hathiya Pol with Carved Elephants), Aina Mahal, Jami Masjid of Rohtas, Shahi Jama Gate, Hanging Balcony. Ingested from Archaeological Survey of India (Patna Circle) & Bihar State Tourism Development Corporation (BSTDC) with Kaggle benchmark validation.",
    "significance": "Cultural and architectural significance of Rohtasgarh Fort.",
    "architecture": "Historic regional architecture with authentic period craftsmanship.",
    "period": "Historical",
    "keyFacts": [
      "Monument: Rohtasgarh Fort",
      "Category: Fort",
      "Coordinates: 24.6289 N, 83.9169 E",
      "Visiting: 6:00 AM – 5:00 PM. High trekking destination across scenic Kaimur plateau."
    ]
  }
];

export const SOURCES_DATA = [
  {
    "heritageId": "p1-laxmi-vilas",
    "sourceName": "Archaeological Survey of India",
    "sourceUrl": "https://asi.nic.in",
    "referenceText": "Laxmi Vilas Palace is listed as a Grade I heritage structure. Designed by Major Charles Mant and completed by R.F. Chisholm in 1890."
  },
  {
    "heritageId": "p1-laxmi-vilas",
    "sourceName": "Gujarat Tourism",
    "sourceUrl": "https://www.gujarattourism.com",
    "referenceText": "Official tourism records confirm the palace covers 500 acres and was built at a cost of ₹60 lakh."
  },
  {
    "heritageId": "p2-baroda-museum",
    "sourceName": "Baroda Museum Archives",
    "sourceUrl": "https://www.barodamuseum.com",
    "referenceText": "The museum was established in 1894 by Maharaja Sayajirao III and houses over 100,000 objects."
  },
  {
    "heritageId": "p11-champaner",
    "sourceName": "UNESCO World Heritage Centre",
    "sourceUrl": "https://whc.unesco.org/en/list/1101",
    "referenceText": "Inscribed in 2004. The site represents the only complete and unchanged Islamic pre-Mughal city."
  },
  {
    "heritageId": "p11-champaner",
    "sourceName": "Archaeological Survey of India",
    "sourceUrl": "https://asi.nic.in",
    "referenceText": "Champaner-Pavagadh is a protected archaeological site covering 1,329 hectares with structures from the 8th to 16th century."
  },
  {
    "heritageId": "p12-jama-masjid-champaner",
    "sourceName": "UNESCO World Heritage Centre",
    "sourceUrl": "https://whc.unesco.org/en/list/1101",
    "referenceText": "The Jama Masjid of Champaner is noted for its exceptional blend of Hindu and Islamic architecture."
  },
  {
    "heritageId": "p4-eme-temple",
    "sourceName": "Indian Army Records",
    "referenceText": "The EME Temple was constructed by the Corps of Electronics and Mechanical Engineers as a multi-faith temple."
  },
  {
    "heritageId": "p6-sayaji-baug",
    "sourceName": "Gujarat Tourism",
    "sourceUrl": "https://www.gujarattourism.com",
    "referenceText": "Sayaji Baug spans 113 acres and was established in 1879 by Maharaja Sayajirao Gaekwad III."
  },
  {
    "heritageId": "IND-HER-01",
    "sourceName": "Archaeological Survey of India (Agra Circle) & UNESCO WHC Dossier No. 252",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-UP-A28 | UNESCO: 252 (Inscribed 1983) | Dynasty: Mughal Empire (Emperor Shah Jahan)"
  },
  {
    "heritageId": "IND-HER-02",
    "sourceName": "Archaeological Survey of India (Delhi Circle) & UNESCO Dossier No. 607",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-DL-1 | UNESCO: 607 (Inscribed 1993) | Dynasty: Delhi Sultanate (Qutb-ud-din Aibak, Iltutmish, Firoz Shah Tughlaq)"
  },
  {
    "heritageId": "IND-HER-03",
    "sourceName": "Archaeological Survey of India (Delhi Circle) & UNESCO Dossier No. 1054",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-DL-2 | UNESCO: 1054 (Inscribed 2007) | Dynasty: Mughal Empire (Emperor Shah Jahan)"
  },
  {
    "heritageId": "IND-HER-04",
    "sourceName": "Archaeological Survey of India & Aga Khan Trust for Culture (AKTC)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-DL-5 | UNESCO: 232 (Inscribed 1993) | Dynasty: Mughal Empire (Empress Bega Begum / Akbar)"
  },
  {
    "heritageId": "IND-HER-05",
    "sourceName": "Archaeological Survey of India (Agra Circle) & UNESCO WHC Dossier No. 255",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-UP-A25 | UNESCO: 255 (Inscribed 1986) | Dynasty: Mughal Empire (Emperor Akbar the Great)"
  },
  {
    "heritageId": "IND-HER-06",
    "sourceName": "Archaeological Survey of India (Aurangabad Circle) & UNESCO Dossier No. 242",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-MH-A1 | UNESCO: 242 (Inscribed 1983) | Dynasty: Satavahana Dynasty (Phase 1) & Vakataka Dynasty (Harishena, Phase 2)"
  },
  {
    "heritageId": "IND-HER-07",
    "sourceName": "Archaeological Survey of India (Aurangabad Circle) & UNESCO Dossier No. 243",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-MH-A2 | UNESCO: 243 (Inscribed 1983) | Dynasty: Rashtrakuta Dynasty (King Krishna I for Kailash) & Yadava/Kalachuri"
  },
  {
    "heritageId": "IND-HER-08",
    "sourceName": "Archaeological Survey of India (Bhubaneswar Circle) & UNESCO WHC Dossier No. 246",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: E-OD-1 | UNESCO: 246 (Inscribed 1984) | Dynasty: Eastern Ganga Dynasty (King Narasimhadeva I)"
  },
  {
    "heritageId": "IND-HER-09",
    "sourceName": "Archaeological Survey of India (Bhopal Circle) & UNESCO WHC Dossier No. 240",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: C-MP-1 | UNESCO: 240 (Inscribed 1986) | Dynasty: Chandela Dynasty (Kings Dhanga, Ganda, and Vidyadhara)"
  },
  {
    "heritageId": "IND-HER-10",
    "sourceName": "Archaeological Survey of India (Hampi Mini Circle) & Hampi World Heritage Area M",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: S-KA-1 | UNESCO: 241 (Inscribed 1986) | Dynasty: Vijayanagara Empire (Sangama, Saluva, Tuluva & Aravidu dynasties; Krishna Deva Raya)"
  },
  {
    "heritageId": "IND-HER-11",
    "sourceName": "Archaeological Survey of India (Vadodara Circle) & UNESCO WHC Dossier No. 922",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-1 | UNESCO: 922 (Inscribed 2014) | Dynasty: Chaulukya / Solanki Dynasty (Queen Udayamati for King Bhima I)"
  },
  {
    "heritageId": "IND-HER-12",
    "sourceName": "Archaeological Survey of India (Chennai Circle) & UNESCO WHC Dossier No. 249",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: S-TN-1 | UNESCO: 249 (Inscribed 1984) | Dynasty: Pallava Dynasty (Narasimhavarman I Mamalla & Rajasimha)"
  },
  {
    "heritageId": "IND-HER-13",
    "sourceName": "Archaeological Survey of India (Bhopal Circle) & UNESCO Dossier No. 524",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: C-MP-2 | UNESCO: 524 (Inscribed 1989) | Dynasty: Maurya Empire (Emperor Ashoka), Shunga & Satavahana Dynasties"
  },
  {
    "heritageId": "IND-HER-14",
    "sourceName": "Archaeological Survey of India (Trichy Circle) & HR&CE Department Tamil Nadu",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: S-TN-2 | UNESCO: 250bis (Inscribed 1987) | Dynasty: Chola Dynasty (Emperor Rajaraja Chola I)"
  },
  {
    "heritageId": "IND-HER-15",
    "sourceName": "Archaeological Survey of India (Jaipur Circle) & Department of Archaeology Rajas",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-RJ-1 | UNESCO: Component of Jaipur City UNESCO Site 1478 | Dynasty: Kachwaha Rajput Dynasty (Maharaja Sawai Pratap Singh)"
  },
  {
    "heritageId": "IND-HER-16",
    "sourceName": "Department of Archaeology and Museums Rajasthan & UNESCO Dossier No. 247",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-RJ-2 | UNESCO: 247-001 (Hill Forts of Rajasthan, 2013) | Dynasty: Kachwaha Rajput Clan (Raja Man Singh I & Sawai Jai Singh)"
  },
  {
    "heritageId": "IND-HER-17",
    "sourceName": "Archaeological Survey of India (Hyderabad Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: H-TL-1 | UNESCO: Tentative List (Monuments of the Deccan Sultanate) | Dynasty: Qutb Shahi Dynasty (Muhammad Quli Qutb Shah)"
  },
  {
    "heritageId": "IND-HER-18",
    "sourceName": "Archaeological Survey of India (Hyderabad Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: H-TL-2 | UNESCO: Tentative List (Qutb Shahi Monuments) | Dynasty: Kakatiya Dynasty (Origin) & Qutb Shahi Dynasty"
  },
  {
    "heritageId": "IND-HER-19",
    "sourceName": "Victoria Memorial Hall Trust & Ministry of Culture, Government of India",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: E-WB-1 | UNESCO: National Treasure of India | Dynasty: British Raj (Lord Curzon / Architect William Emerson)"
  },
  {
    "heritageId": "IND-HER-20",
    "sourceName": "Shiromani Gurdwara Parbandhak Committee (SGPC) & Punjab Heritage Tourism Board",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: State Heritage / SGPC | UNESCO: Tentative List (Sri Harmandir Sahib) | Dynasty: Sikh Gurus (Guru Arjan Dev Ji) & Sikh Empire (Maharaja Ranjit Singh)"
  },
  {
    "heritageId": "IND-HER-21",
    "sourceName": "Hindu Religious and Charitable Endowments (HR&CE) Dept Tamil Nadu",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: S-TN-3 | UNESCO: Tentative List (Great Temple of Madurai) | Dynasty: Pandya Dynasty (Origin) & Nayaka Dynasty (Thirumalai Nayak)"
  },
  {
    "heritageId": "IND-HER-22",
    "sourceName": "Archaeological Survey of India (Patna Circle) & UNESCO Dossier No. 1502",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: E-BR-1 | UNESCO: 1502 (Inscribed 2016) | Dynasty: Gupta Empire (Kumaragupta I) & Harsha / Pala Empire"
  },
  {
    "heritageId": "IND-HER-23",
    "sourceName": "Bodhgaya Temple Management Committee (BTMC) & Archaeological Survey of India (Pa",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: E-BR-2 | UNESCO: 1056 (Inscribed 2002) | Dynasty: Maurya Empire (Ashoka) & Late Gupta / Pala Dynasties"
  },
  {
    "heritageId": "IND-HER-24",
    "sourceName": "Archaeological Survey of India (Mumbai Circle) & UNESCO Dossier No. 244",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-MH-A3 | UNESCO: 244 (Inscribed 1987) | Dynasty: Kalachuri Dynasty & Konkan Mauryas / Rashtrakutas"
  },
  {
    "heritageId": "IND-HER-25",
    "sourceName": "Archaeological Survey of India (Dharwad Circle) & UNESCO Dossier No. 239",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: S-KA-2 | UNESCO: 239 (Inscribed 1987) | Dynasty: Early Chalukya Dynasty (Vikramaditya II & Queen Lokamahadevi)"
  },
  {
    "heritageId": "IND-HER-26",
    "sourceName": "Archaeological Survey of India (Jaipur Circle) & UNESCO Dossier No. 247",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-RJ-3 | UNESCO: 247-002 (Hill Forts of Rajasthan, 2013) | Dynasty: Sisodia Rajput Clan (Rana Kumbha)"
  },
  {
    "heritageId": "IND-HER-27",
    "sourceName": "Archaeological Survey of India (Jaipur Circle) & UNESCO Dossier No. 247",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-RJ-4 | UNESCO: 247-003 (Hill Forts of Rajasthan, 2013) | Dynasty: Mori Rajputs (Origin) & Sisodia Dynasty (Rana Ratan Singh, Rana Kumbha, Maharana Sanga)"
  },
  {
    "heritageId": "IND-HER-28",
    "sourceName": "Archaeological Survey of India (Vadodara Circle) & UNESCO WHC Dossier No. 1644",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-2 | UNESCO: 1644 (Inscribed 2021) | Dynasty: Indus Valley Civilization (Mature Harappan Phase)"
  },
  {
    "heritageId": "IND-HER-29",
    "sourceName": "Archaeological Survey of India (Hyderabad Circle) & UNESCO WHC Dossier No. 1570",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: H-TL-3 | UNESCO: 1570 (Inscribed 2021) | Dynasty: Kakatiya Dynasty (General Recharla Rudra / King Ganapati Deva)"
  },
  {
    "heritageId": "IND-HER-30",
    "sourceName": "Archaeological Survey of India (Bengaluru Circle) & UNESCO WHC Dossier No. 1670",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: S-KA-3 | UNESCO: 1670 (Inscribed 2023) | Dynasty: Hoysala Empire (King Vishnuvardhana & Queen Shantala)"
  },
  {
    "heritageId": "IND-HER-31",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-3 | UNESCO: Tentative List (Sun Temple Modhera) | Dynasty: Chaulukya / Solanki Dynasty (King Bhima I)"
  },
  {
    "heritageId": "IND-HER-32",
    "sourceName": "Archaeological Survey of India (Bhopal Circle) & UNESCO WHC Dossier No. 925",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: C-MP-3 | UNESCO: 925 (Inscribed 2003) | Dynasty: Prehistoric Hunter-Gatherers (Upper Paleolithic to Medieval)"
  },
  {
    "heritageId": "IND-HER-33",
    "sourceName": "Archaeological Survey of India (Goa Circle) & Archdiocese of Goa and Daman",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GA-1 | UNESCO: 234 (Churches and Convents of Goa, 1986) | Dynasty: Portuguese Colonial Era (Jesuit Order)"
  },
  {
    "heritageId": "IND-HER-34",
    "sourceName": "Central Railway (Ministry of Railways) & Archaeological Survey of India",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-MH-A4 | UNESCO: 945rev (Inscribed 2004) | Dynasty: British Raj (Architect Frederick William Stevens)"
  },
  {
    "heritageId": "IND-HER-35",
    "sourceName": "Archaeological Survey of India (Bhopal Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: C-MP-4 | UNESCO: Component of Gwalior UNESCO Creative Cities Network | Dynasty: Tomara Dynasty (Raja Man Singh Tomar) & Scindia Dynasty"
  },
  {
    "heritageId": "IND-HER-36",
    "sourceName": "Archaeological Survey of India (Aurangabad Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-MH-A5 | UNESCO: Tentative List (Monuments of Deccan Sultanate) | Dynasty: Yadava Dynasty (King Bhillama V) & Tughlaq / Bahmani / Nizam Shahi"
  },
  {
    "heritageId": "IND-HER-37",
    "sourceName": "Archaeological Survey of India (Mumbai Circle) & Raigad Development Authority",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-MH-A6 | UNESCO: Component of Maratha Military Landscapes UNESCO Nomination | Dynasty: Maratha Empire (Chhatrapati Shivaji Maharaj / Hiroji Indulkar)"
  },
  {
    "heritageId": "IND-HER-38",
    "sourceName": "Archaeological Survey of India (Mumbai Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-MH-A7 | UNESCO: Component of Maratha Military Landscapes Nomination | Dynasty: Siddis of Janjira (Habshi/Abyssinian Naval Chieftains)"
  },
  {
    "heritageId": "IND-HER-39",
    "sourceName": "Archaeological Survey of India (Dharwad Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: S-KA-4 | UNESCO: Tentative List (Monuments of Deccan Sultanate) | Dynasty: Adil Shahi Dynasty (Sultan Mohammed Adil Shah)"
  },
  {
    "heritageId": "IND-HER-40",
    "sourceName": "Mysore Palace Board (Government of Karnataka)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: KA-HER-1 | UNESCO: Karnataka State Heritage Masterpiece | Dynasty: Wadiyar Dynasty (Maharani Kempananjammanni & Maharaja Krishnaraja Wadiyar IV)"
  },
  {
    "heritageId": "IND-HER-41",
    "sourceName": "Shree Jagannath Temple Administration (SJTA) & Archaeological Survey of India (B",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: E-OD-2 | UNESCO: National Sacred Treasure of India | Dynasty: Eastern Ganga Dynasty (King Anantavarman Chodaganga Deva)"
  },
  {
    "heritageId": "IND-HER-42",
    "sourceName": "Andaman and Nicobar Administration (Art & Culture Directorate)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: ASI National Memorial | UNESCO: National Heritage Monument of India | Dynasty: British Raj (Public Works Department)"
  },
  {
    "heritageId": "IND-HER-43",
    "sourceName": "Kamakhya Devalaya Bordeuri Samaj & Tourism Department Assam",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: AS-HER-1 | UNESCO: Assam State Heritage Monument | Dynasty: Koch Dynasty (King Naranarayan & General Chilarai) & Ahom Kings"
  },
  {
    "heritageId": "IND-HER-44",
    "sourceName": "Archaeological Survey of India (Guwahati Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: NE-AS-1 | UNESCO: Component of Ahom Monuments Tentative List | Dynasty: Ahom Dynasty (Swargadeo Pramatta Singha & Rajeswar Singha)"
  },
  {
    "heritageId": "IND-HER-45",
    "sourceName": "Archaeological Survey of India (Srinagar Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-JK-1 | UNESCO: National Heritage Monument of India | Dynasty: Karkota Dynasty (Emperor Lalitaditya Muktapida)"
  },
  {
    "heritageId": "IND-HER-46",
    "sourceName": "Archaeological Survey of India (Kolkata Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: E-WB-2 | UNESCO: Tentative List (Temples at Bishnupur) | Dynasty: Malla Dynasty (Raja Bir Hambir & Raghunath Singha)"
  },
  {
    "heritageId": "IND-HER-47",
    "sourceName": "Archaeological Survey of India (Hyderabad Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: H-AP-1 | UNESCO: Tentative List (Lepakshi Veerabhadra Temple) | Dynasty: Vijayanagara Empire (Brothers Virupanna and Veeranna)"
  },
  {
    "heritageId": "IND-HER-48",
    "sourceName": "Archaeological Survey of India (Dharwad Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: S-KA-5 | UNESCO: Tentative List (Evolution of Temple Architecture - Aihole-Badami-Pattadakal) | Dynasty: Early Chalukya Dynasty (Pulakeshin I & Mangalesha)"
  },
  {
    "heritageId": "IND-HER-49",
    "sourceName": "Archaeological Survey of India (Dharwad Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: S-KA-6 | UNESCO: Tentative List (Aihole Complex) | Dynasty: Early Chalukya Dynasty"
  },
  {
    "heritageId": "IND-HER-50",
    "sourceName": "Archaeological Survey of India (Thrissur Circle) & Bekal Tourism Development Cor",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: S-KL-1 | UNESCO: State Heritage Coastal Monument | Dynasty: Keladi Nayakas (Shivappa Nayaka) & Tipu Sultan"
  },
  {
    "heritageId": "IND-ART-01",
    "sourceName": "National Museum, New Delhi (Ministry of Culture, Govt of India)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: National Museum Accession No. HR 5721/195 | UNESCO: National Treasure of India (Global Icon) | Dynasty: Indus Valley Civilization (Mature Harappan Phase)"
  },
  {
    "heritageId": "IND-ART-02",
    "sourceName": "Archaeological Survey of India (Sarnath Museum) & Ministry of Culture",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: ASI Museum Sarnath Acc. No. 544 | UNESCO: Adopted as National Emblem of India (Jan 26, 1950) | Dynasty: Maurya Empire (Emperor Ashoka the Great)"
  },
  {
    "heritageId": "IND-ART-03",
    "sourceName": "Bihar Museum (Department of Art and Culture, Govt of Bihar)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Bihar Museum Display No. 1 | UNESCO: National Treasure of India | Dynasty: Maurya Empire / Early Shunga Period"
  },
  {
    "heritageId": "IND-ART-04",
    "sourceName": "National Museum New Delhi & Dept of Museums, Govt of Tamil Nadu",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: National Museum Acc. No. 56.124 | UNESCO: Global Masterpiece of Indian Art | Dynasty: Imperial Chola Dynasty (Queen Sembiyan Mahadevi era)"
  },
  {
    "heritageId": "IND-ART-05",
    "sourceName": "National Museum, New Delhi (Arms & Armour Division)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Arms & Armor Collection Acc. No. 60.1179 | UNESCO: Rare Combat Armour Collection | Dynasty: Mughal Empire (Emperor Akbar & Jahangir era)"
  },
  {
    "heritageId": "IND-ART-06",
    "sourceName": "National Museum New Delhi & Archaeological Survey of India",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: National Museum / ASI Memorial Acc. No. 58.42/1 | UNESCO: National Historic Treasure | Dynasty: Kingdom of Mysore (Tipu Sultan, the Tiger of Mysore)"
  },
  {
    "heritageId": "IND-ART-07",
    "sourceName": "Department of Archaeology & Cultural Affairs, Government of Maharashtra",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: CSMVS Historic Weapons Register No. WN-1659 | UNESCO: State Icon of Maratha Chivalry | Dynasty: Maratha Empire (Chhatrapati Shivaji Maharaj)"
  },
  {
    "heritageId": "IND-ART-08",
    "sourceName": "Salar Jung Museum Board (Ministry of Culture, Government of India)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: SJM Accession No. 42-XXX/Arms | UNESCO: National Masterpiece Collection | Dynasty: Mughal Empire (Empress Noor Jahan & Emperor Jahangir)"
  },
  {
    "heritageId": "IND-ART-09",
    "sourceName": "National Museum New Delhi & Mehrangarh Museum Trust",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: National Museum Acc. No. 62.450 | UNESCO: World's Largest Historic Animal Armor | Dynasty: Mughal Empire / Rajput Kingdoms"
  },
  {
    "heritageId": "IND-ART-10",
    "sourceName": "Salar Jung Museum Board (Ministry of Culture, Government of India)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: SJM European Statuary Reg. No. 1876-BZ | UNESCO: Acquired by Salar Jung I in Rome, 1876 | Dynasty: Sculpted by Italian Master Giovanni Battista Benzoni"
  },
  {
    "heritageId": "IND-ART-11",
    "sourceName": "Indian Museum Kolkata & Numismatic Society of India",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Indian Museum Coin Cabinet Vault No. 1 | UNESCO: National Numismatic Masterpiece Collection | Dynasty: Mauryan Empire, Kushan Empire, and Gupta Dynasty (Samudragupta & Chandragupta II)"
  },
  {
    "heritageId": "IND-ART-12",
    "sourceName": "Maharaja Sawai Man Singh II Museum Trust & National Museum New Delhi",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Royal Silehkhana Armory Inv. No. K-402 | UNESCO: Iconic Indian Martial Weapon | Dynasty: Rajput, Mughal, and Vijayanagara Armies"
  },
  {
    "heritageId": "IND-GJ-04",
    "sourceName": "Archaeological Survey of India (Vadodara Circle) & UNESCO WHC Dossier No. 1101",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-4 | UNESCO: 1101 (Inscribed 2004) | Dynasty: Chavda / Khichi Chauhan Rajputs & Gujarat Sultanate (Mahmud Begada)"
  },
  {
    "heritageId": "IND-GJ-05",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-5 | UNESCO: Component of Historic City of Ahmadabad UNESCO Site 1551 | Dynasty: Gujarat Sultanate (Sidi Saiyyed / Sultan Muzaffar Shah III)"
  },
  {
    "heritageId": "IND-GJ-06",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-6 | UNESCO: National Protected Monument of India | Dynasty: Vaghela Rajput Dynasty (Rani Rudabai) & Mahmud Begada"
  },
  {
    "heritageId": "IND-GJ-07",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-7 | UNESCO: Tentative List (Archaeological Remains of Lothal) | Dynasty: Indus Valley Civilization (Mature Harappan Maritime Merchants)"
  },
  {
    "heritageId": "IND-GJ-08",
    "sourceName": "Shree Somnath Trust (Government of Gujarat & Ministry of Culture)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Shree Somnath Trust / State Heritage | UNESCO: Adyaprathama Jyotirlinga of India | Dynasty: Yadavas, Solankis (Kumarapala), Ahilyabai Holkar & Sardar Vallabhbhai Patel"
  },
  {
    "heritageId": "IND-GJ-09",
    "sourceName": "Archaeological Survey of India (Vadodara Circle) & Dwarka Devasthan Samiti",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-8 | UNESCO: Char Dham of India & National Sacred Treasure | Dynasty: Vajranabha (Grandson of Krishna, Traditional) & Chaulukya / Solanki Dynasty"
  },
  {
    "heritageId": "IND-GJ-10",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-9 | UNESCO: National Epigraphical Monument of India | Dynasty: Maurya Empire (Ashoka), Western Kshatrapas (Rudradaman I), and Gupta Empire (Skandagupta)"
  },
  {
    "heritageId": "IND-GJ-11",
    "sourceName": "Department of Archaeology Gujarat & Archaeological Survey of India",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-10 | UNESCO: Ancient Citadel of Saurashtra | Dynasty: Maurya Empire (Chandragupta Maurya) & Chudasama Rajputs (Ra Navghan)"
  },
  {
    "heritageId": "IND-GJ-12",
    "sourceName": "Anandji Kalyanji Trust & Gujarat Tourism Board",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Anandji Kalyanji Pedhi / State Heritage | UNESCO: World's Largest Cluster of Temple Shrines on a Single Hill | Dynasty: Solanki Kings & Jain Merchant Guilds (Vimal Shah, Vastupala, Tejapala)"
  },
  {
    "heritageId": "IND-GJ-13",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-11 | UNESCO: Tentative List (Vadnagar Historic Town) | Dynasty: Chaulukya / Solanki Dynasty (King Kumarapala / Jayasimha Siddharaja)"
  },
  {
    "heritageId": "IND-GJ-15",
    "sourceName": "Archaeological Survey of India (Vadodara Circle) & Sarkhej Roza Committee",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-12 | UNESCO: Component of Historic City of Ahmadabad UNESCO Site 1551 | Dynasty: Gujarat Sultanate (Sultan Muhammad Shah, Qutbuddin Ahmad Shah, Mahmud Begada)"
  },
  {
    "heritageId": "IND-GJ-16",
    "sourceName": "Department of Archaeology Gujarat & Archaeological Survey of India",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-13 | UNESCO: State Heritage Architectural Marvel | Dynasty: Babi Dynasty (Nawabs of Junagadh: Nawab Mahabat Khan II & Baha-ud-din Bhar)"
  },
  {
    "heritageId": "IND-GJ-17",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-14 | UNESCO: National Protected Monument of India | Dynasty: Gujarat Sultanate (Built by Bai Harir Sultani, royal superintendent of the harem)"
  },
  {
    "heritageId": "IND-GJ-18",
    "sourceName": "Maharao of Kutch Palace Trust & Gujarat Tourism Board",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Kutch Heritage / State Protected | UNESCO: Royal Palace Complex of the Maharaos of Kutch | Dynasty: Jadeja Rajput Dynasty (Rao Lakhpatji & Maharao Pragmalji II)"
  },
  {
    "heritageId": "IND-GJ-19",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-15 | UNESCO: National Protected Hydraulic Wonder | Dynasty: Chaulukya / Solanki Dynasty (Siddharaj Jaisinh)"
  },
  {
    "heritageId": "IND-GJ-20",
    "sourceName": "Hutheesing Temple Trust & Gujarat Tourism",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Hutheesing Family Trust / Heritage | UNESCO: Component of Ahmedabad Heritage City | Dynasty: Built by Sheth Hutheesing Kesrisinh & completed by Harkunwar Ba"
  },
  {
    "heritageId": "IND-GJ-21",
    "sourceName": "Maharao of Kutch Estate Trust & Gujarat Tourism",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Kutch Royal Trust / State Heritage | UNESCO: Royal Seaside Palace of the Maharaos of Kutch | Dynasty: Jadeja Rajput Dynasty (Maharao Vijayaraji of Kutch)"
  },
  {
    "heritageId": "IND-GJ-22",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-16 | UNESCO: Component of Historic City of Ahmadabad UNESCO Site 1551 | Dynasty: Gujarat Sultanate (Sultan Ahmed Shah)"
  },
  {
    "heritageId": "IND-GJ-23",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-17 | UNESCO: Component of Historic City of Ahmadabad UNESCO Site 1551 | Dynasty: Gujarat Sultanate (Sultan Ahmed Shah I)"
  },
  {
    "heritageId": "IND-GJ-24",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-18 | UNESCO: Component of Ahmedabad Heritage Matrix | Dynasty: Gujarat Sultanate (Sidi Bashir, slave of Sultan Ahmed Shah)"
  },
  {
    "heritageId": "IND-GJ-25",
    "sourceName": "Sabarmati Ashram Preservation and Memorial Trust (SAPMT) & Ministry of Culture",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: National Memorial (Ministry of Culture) | UNESCO: National Sacred Historic Monument of India | Dynasty: Mahatma Gandhi (Mohandas Karamchand Gandhi)"
  },
  {
    "heritageId": "IND-GJ-26",
    "sourceName": "Archaeological Survey of India (Vadodara Circle) & Gujarat Tourism",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-19 | UNESCO: National Protected Western Frontier Fortress | Dynasty: Jadeja Rulers of Kutch (Jamadar Fateh Muhammad)"
  },
  {
    "heritageId": "IND-GJ-27",
    "sourceName": "Archaeological Survey of India (Vadodara Circle) & Anandji Kalyanji Pedhi",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-20 | UNESCO: State Heritage Pilgrimage Mountain | Dynasty: Chaulukya / Solanki Dynasty (King Kumarapala)"
  },
  {
    "heritageId": "IND-GJ-28",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-21 | UNESCO: Tentative List (Bohra Havelis of Sidhpur) | Dynasty: Solanki Dynasty (Mulraja & Siddharaj Jaisinh) & Dawoodi Bohra Merchant Guilds"
  },
  {
    "heritageId": "IND-GJ-29",
    "sourceName": "Department of Archaeology, Government of Gujarat",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-22 | UNESCO: State Heritage Rock-Cut Sanctuary | Dynasty: Western Kshatrapas / Gupta Era"
  },
  {
    "heritageId": "IND-GJ-30",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-23 | UNESCO: Earliest Surviving Structural Temple in Gujarat | Dynasty: Maitraka Dynasty of Vallabhi"
  },
  {
    "heritageId": "IND-GJ-31",
    "sourceName": "Surat Municipal Corporation Heritage Cell & Department of Archaeology Gujarat",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Surat Municipal Corporation / State Heritage | UNESCO: Defensive Fortress of the Premier Port of the Mughal Empire | Dynasty: Gujarat Sultanate (Built by Khudawand Khan for Sultan Mahmud Shah III)"
  },
  {
    "heritageId": "IND-GJ-32",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: W-GJ-24 | UNESCO: National Protected Monument of India | Dynasty: Jethwa Rajput Dynasty (Rana Bhanji & Sangramji Jethwa)"
  },
  {
    "heritageId": "IND-ART-13",
    "sourceName": "Ministry of Textiles, Govt. of India & Gujarat Tourism",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Calico Museum Acc. TX-784 / GI Registry #40 | UNESCO: Intangible Cultural Heritage of Humanity & GI Tagged | Dynasty: Patronized by King Kumarapala (Solanki Dynasty)"
  },
  {
    "heritageId": "IND-ART-14",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-GJ-3 (Sidi Saiyyed Mosque) | UNESCO: Ahmedabad World Heritage City Key Monument | Dynasty: Gujarat Sultanate (Shams-ud-din Muzaffar Shah III / Sidi Saiyyid)"
  },
  {
    "heritageId": "IND-ART-15",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-GJ-140 (Sun Temple Modhera) | UNESCO: Tentative List World Heritage Site | Dynasty: Chaulukya / Solanki Dynasty (King Bhima I)"
  },
  {
    "heritageId": "IND-ART-16",
    "sourceName": "Archaeological Survey of India (Vadodara Circle) & UNESCO WHC",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-GJ-156 (Rani ki Vav) | UNESCO: UNESCO World Heritage Site Ref. 922 | Dynasty: Chaulukya / Solanki Dynasty (Queen Udayamati)"
  },
  {
    "heritageId": "IND-ART-17",
    "sourceName": "Archaeological Survey of India (Delhi Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-DL-1/Pillar | UNESCO: Part of Qutb Complex UNESCO Site 233 | Dynasty: Gupta Empire (King Chandragupta II Vikramaditya)"
  },
  {
    "heritageId": "IND-ART-18",
    "sourceName": "Archaeological Survey of India (Bhubaneswar Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-OR-63 (Sun Temple Konark) | UNESCO: UNESCO World Heritage Site Ref. 242 | Dynasty: Eastern Ganga Dynasty (King Narasimhadeva I)"
  },
  {
    "heritageId": "IND-ART-19",
    "sourceName": "Archaeological Survey of India (Hampi Mini-Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-KA-B34 (Vittala Temple Complex) | UNESCO: UNESCO World Heritage Site Ref. 241 | Dynasty: Vijayanagara Empire (King Krishnadevaraya)"
  },
  {
    "heritageId": "IND-ART-20",
    "sourceName": "Shree Somnath Trust & Gujarat State Archaeology Department",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Somnath Trust Heritage Monument | UNESCO: Ancient Indian Maritime Heritage | Dynasty: Ancient Saurashtra Navigators & Solanki Rulers"
  },
  {
    "heritageId": "IND-ART-21",
    "sourceName": "National Museum New Delhi & Archaeological Survey of India",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Acc. No. 4208 / National Museum | UNESCO: National Treasure of India | Dynasty: Indus Valley Civilization (Mature Harappan)"
  },
  {
    "heritageId": "IND-ART-22",
    "sourceName": "Archaeological Survey of India & Ministry of Culture, Govt. of India",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: ASI Piprahwa Relic Cache | UNESCO: Grade 1 National Sacred Antiquity | Dynasty: Shakya Republic / Emperor Ashoka (Maurya Empire)"
  },
  {
    "heritageId": "IND-ART-23",
    "sourceName": "National Museum Arms and Armor Collection, New Delhi",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Acc. No. 60.1477 / National Museum | UNESCO: National Treasure of Arms | Dynasty: Mughal Empire (Emperor Aurangzeb Alamgir)"
  },
  {
    "heritageId": "IND-ART-24",
    "sourceName": "National Museum, New Delhi",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Acc. No. 58.42 / National Museum | UNESCO: National Treasure of Arms | Dynasty: Mughal Empire (Emperor Akbar the Great)"
  },
  {
    "heritageId": "IND-ART-25",
    "sourceName": "Archaeological Survey of India (Sarnath Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: ASI Sarnath Site Museum Acc. No. B(b) 181 | UNESCO: Classical Peak of World Buddhist Art | Dynasty: Gupta Empire (Classical Golden Age)"
  },
  {
    "heritageId": "IND-ART-26",
    "sourceName": "Indian Museum Kolkata (Ministry of Culture, Govt. of India)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Indian Museum Kolkata Bharhut Gallery | UNESCO: Earliest Narrative Relief Art of India | Dynasty: Shunga Empire (King Dhanabhuti)"
  },
  {
    "heritageId": "IND-ART-27",
    "sourceName": "Indian Museum Kolkata",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Indian Museum Acc. No. G-12 | UNESCO: Greco-Indian Classical Synthesis | Dynasty: Kushan Empire (Emperor Kanishka Era)"
  },
  {
    "heritageId": "IND-ART-28",
    "sourceName": "Indian Museum Kolkata (Ministry of Culture)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Indian Museum Egyptian Gallery Acc. No. 1 | UNESCO: Only One of Six Authentic Egyptian Mummies in India | Dynasty: Ptolemaic Kingdom of Egypt (Acquired 1834)"
  },
  {
    "heritageId": "IND-ART-29",
    "sourceName": "Salar Jung Museum (Ministry of Culture)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Salar Jung Museum Acc. No. 74.8 | UNESCO: Masterpiece of Allegorical Wood Sculpture | Dynasty: Collection of Salar Jung III"
  },
  {
    "heritageId": "IND-ART-30",
    "sourceName": "Salar Jung Museum Board",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Salar Jung Museum Horological Collection | UNESCO: Iconic Horological Heritage of India | Dynasty: Crafted by Cook & Kelvey Co., Calcutta & London for Salar Jung"
  },
  {
    "heritageId": "IND-ART-31",
    "sourceName": "CSMVS Board of Trustees & Government of Maharashtra",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: CSMVS Acc. Arms-1674 | UNESCO: National Sacred Relic of Maratha Empire | Dynasty: Maratha Empire (Chhatrapati Shivaji Maharaj)"
  },
  {
    "heritageId": "IND-ART-32",
    "sourceName": "Department of Museums, Government of Tamil Nadu",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Government Museum Chennai Acc. No. 12/Bronze | UNESCO: Greatest Composite Icon of Indian Art | Dynasty: Chola Dynasty (Reign of Rajendra Chola I)"
  },
  {
    "heritageId": "IND-ART-33",
    "sourceName": "Directorate of Archaeology and Museums, Government of Gujarat & Baroda Museum",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Baroda Museum Acc. Akota-1 to 68 | UNESCO: National Treasure of Western Indian Art | Dynasty: Maitraka Dynasty & Gurjara-Pratihara (Gujarat)"
  },
  {
    "heritageId": "IND-ART-34",
    "sourceName": "Calico Museum of Textiles (Sarabhai Foundation) & Gujarat Tourism",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Calico Museum Acc. PIC-102 | UNESCO: Masterpiece of Indian Temple Textiles | Dynasty: Pushtimarg Vallabhacharya Tradition (Mewar / Gujarat)"
  },
  {
    "heritageId": "IND-ART-35",
    "sourceName": "Department of Museums, Gujarat & Kutch Museum Bhuj",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Kutch Museum Inscription Gallery No. 1 | UNESCO: Oldest Dated Sanskrit Inscriptions in Gujarat | Dynasty: Western Kshatrapa Dynasty (Mahakshatrapa Rudradaman I & Chashtana)"
  },
  {
    "heritageId": "IND-ART-36",
    "sourceName": "Kutch Museum, Government of Gujarat",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Kutch Museum Folk Gallery Acc. No. 42 | UNESCO: Royal Kutch Decorative Arts Heritage | Dynasty: Cutch State (Maharao of Kutch)"
  },
  {
    "heritageId": "IND-ART-37",
    "sourceName": "Directorate of Archaeology and Museums, Gujarat & Watson Museum",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Watson Museum Acc. R-101 to R-140 | UNESCO: Indus Valley Regional Civilization Heritage | Dynasty: Indus Valley Civilization (Late Harappan Rangpur Phase)"
  },
  {
    "heritageId": "IND-ART-38",
    "sourceName": "Archaeological Survey of India (Aurangabad Circle) & UNESCO",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-MH-A12 (Ellora Caves / Cave 16) | UNESCO: Part of UNESCO World Heritage Site Ref. 243 | Dynasty: Rashtrakuta Dynasty (King Krishna I)"
  },
  {
    "heritageId": "IND-ART-39",
    "sourceName": "Archaeological Survey of India (Aurangabad Circle) & UNESCO",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-MH-A1 (Ajanta Caves / Cave 1) | UNESCO: UNESCO World Heritage Site Ref. 242 | Dynasty: Vakataka Dynasty (Emperor Harishena)"
  },
  {
    "heritageId": "IND-ART-40",
    "sourceName": "Archaeological Survey of India (Chennai Circle) & UNESCO",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Part of Mahabalipuram Monuments | UNESCO: Part of Group of Monuments at Mahabalipuram (Ref. 249) | Dynasty: Pallava Dynasty (King Narasimhavarman I / Mamalla)"
  },
  {
    "heritageId": "IND-ART-41",
    "sourceName": "Archaeological Survey of India (Hyderabad Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-TL-2 (Golconda Fort) | UNESCO: Tentative List World Heritage Site | Dynasty: Qutb Shahi Dynasty (Sultan Quli Qutb Shah)"
  },
  {
    "heritageId": "IND-ART-42",
    "sourceName": "Gujarat State Archaeology Department & Junagadh Municipal Corporation",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: Uparkot Citadel Armory Heritage | UNESCO: Historic Saurashtra Defense Heritage | Dynasty: Ottoman Empire (Sultan Suleiman the Magnificent) & Gujarat Sultanate (Bahadur Shah)"
  },
  {
    "heritageId": "IND-ART-43",
    "sourceName": "Archaeological Survey of India (Vadodara Circle)",
    "sourceUrl": "https://whc.unesco.org",
    "referenceText": "Official Registry: N-GJ-73 (Adalaj Stepwell) | UNESCO: Centrally Protected Monument of National Importance | Dynasty: Vaghela Dynasty (Rani Rudabai & Rana Veer Singh)"
  }
];

export const ARTIFACTS_DATA = [
  {
    "placeId": "p1-laxmi-vilas",
    "name": "Palace Facade",
    "nameHi": "महल का अग्रभाग",
    "nameGu": "પેલેસ ફેસાડ",
    "description": "The grand Indo-Saracenic facade of Laxmi Vilas Palace with ornate domes and arches.",
    "visionLabel": "laxmi_vilas_facade"
  },
  {
    "placeId": "p4-eme-temple",
    "name": "Aluminum Dome",
    "nameHi": "एल्युमिनियम गुंबद",
    "nameGu": "એલ્યુમિનિયમ ગુંબજ",
    "description": "The distinctive geodesic aluminum dome of EME Temple.",
    "visionLabel": "eme_temple_dome"
  },
  {
    "placeId": "p12-jama-masjid-champaner",
    "name": "Jama Masjid Minaret",
    "nameHi": "जामा मस्जिद मीनार",
    "nameGu": "જામા મસ્જિદ મિનારો",
    "description": "The soaring minarets of Champaner Jama Masjid.",
    "visionLabel": "champaner_jami_masjid"
  },
  {
    "placeId": "p2-baroda-museum",
    "name": "Museum Sculpture Gallery",
    "nameHi": "संग्रहालय मूर्ति दीर्घा",
    "nameGu": "મ્યુઝિયમ શિલ્પ ગેલેરી",
    "description": "Greco-Roman and Indian sculptures in the Baroda Museum.",
    "visionLabel": "baroda_museum_statue"
  },
  {
    "placeId": "p3-kirti-mandir",
    "name": "Kirti Mandir Spire",
    "nameHi": "कीर्ति मंदिर शिखर",
    "nameGu": "કીર્તિ મંદિર શિખર",
    "description": "The Nagara-style shikhara of Kirti Mandir memorial.",
    "visionLabel": "kirti_mandir_memorial"
  },
  {
    "placeId": "p10-tambekar-wada",
    "name": "Wall Murals",
    "nameHi": "दीवार चित्र",
    "nameGu": "દીવાલ ચિત્રો",
    "description": "Maratha-era wall paintings depicting Hindu epics.",
    "visionLabel": "tambekar_wada_murals"
  },
  {
    "placeId": "p5-sursagar",
    "name": "Shiva Statue",
    "nameHi": "शिव प्रतिमा",
    "nameGu": "શિવ પ્રતિમા",
    "description": "The towering 120-feet Shiva statue at Sursagar Lake.",
    "visionLabel": "sursagar_shiva"
  },
  {
    "placeId": "p11-champaner",
    "name": "Fort Walls",
    "nameHi": "किले की दीवारें",
    "nameGu": "કિલ્લાની દીવાલો",
    "description": "The massive fortification walls of Champaner citadel.",
    "visionLabel": "champaner_fort_wall"
  },
  {
    "placeId": "p7-nyay-mandir",
    "name": "Clock Tower",
    "nameHi": "घंटाघर",
    "nameGu": "ઘડિયાળ ટાવર",
    "description": "The ornate clock tower of Nyay Mandir courthouse.",
    "visionLabel": "nyay_mandir_clock"
  },
  {
    "placeId": "p8-makarpura-palace",
    "name": "Palace Gardens",
    "nameHi": "महल के बगीचे",
    "nameGu": "પેલેસ ગાર્ડન",
    "description": "Italian Renaissance-style gardens of Makarpura Palace.",
    "visionLabel": "makarpura_palace_garden"
  },
  {
    "placeId": "IND-HER-01",
    "name": "Taj Mahal Scannable Feature",
    "nameHi": "ताज महल (Taj Mahal)",
    "nameGu": "ताज महल (Taj Mahal)",
    "description": "Central Bulbous Dome, 4 Tilted Corner Minarets, Darwaza-i-Rauza (Great Gate), Pietra Dura Inlay Jali Screens, Cenotaph Chamber, Mosque & Jawab",
    "visionLabel": "ind_her_01_feature"
  },
  {
    "placeId": "IND-HER-02",
    "name": "Qutub Minar & Monument Complex Scannable Feature",
    "nameHi": "क़ुतुब मीनार (Qutb Minar)",
    "nameGu": "क़ुतुब मीनार (Qutb Minar)",
    "description": "Five Superimposed Fluted Storeys with Projecting Balconies, Alai Darwaza, Iron Pillar of Delhi, Quwwat-ul-Islam Mosque, Tomb of Iltutmish, Alai Minar",
    "visionLabel": "ind_her_02_feature"
  },
  {
    "placeId": "IND-HER-03",
    "name": "Red Fort (Lal Qila) Scannable Feature",
    "nameHi": "लाल क़िला (Lal Qila)",
    "nameGu": "लाल क़िला (Lal Qila)",
    "description": "Lahori Gate, Delhi Gate, Chhatta Chowk (Covered Bazaar), Diwan-i-Aam, Diwan-i-Khas with Peacock Throne plinth, Nahr-i-Bihisht stream, Moti Masjid",
    "visionLabel": "ind_her_03_feature"
  },
  {
    "placeId": "IND-HER-04",
    "name": "Humayun's Tomb Complex Scannable Feature",
    "nameHi": "हुमायूँ का मक़बरा (Humayun's Tomb)",
    "nameGu": "हुमायूँ का मक़बरा (Humayun's Tomb)",
    "description": "Double Bulbous White Marble Dome, Grand Chamfered Pishtaq Arches, Isa Khan Niyazi Octagonal Tomb, Bu Halima Garden, Arab Sarai Gateway, Barber's Tomb",
    "visionLabel": "ind_her_04_feature"
  },
  {
    "placeId": "IND-HER-05",
    "name": "Fatehpur Sikri Imperial Citadel Scannable Feature",
    "nameHi": "फ़तेहपुर सीकरी (Fatehpur Sikri)",
    "nameGu": "फ़तेहपुर सीकरी (Fatehpur Sikri)",
    "description": "Buland Darwaza (Gate of Magnificence), Jama Masjid, Tomb of Sheikh Salim Chishti, Diwan-i-Khas Central Carved Pillar, Panch Mahal (5-storey tiered pavilion), Anup Talao",
    "visionLabel": "ind_her_05_feature"
  },
  {
    "placeId": "IND-HER-06",
    "name": "Ajanta Caves Scannable Feature",
    "nameHi": "अजिंठा लेणी (Ajanta Leni)",
    "nameGu": "अजिंठा लेणी (Ajanta Leni)",
    "description": "Cave 1 Bodhisattva Padmapani and Vajrapani Frescoes, Cave 19 Chaitya Facade with Horseshoe Arch, Cave 26 Reclining Parinirvana Buddha (7m long), Monolithic Vihara Cells",
    "visionLabel": "ind_her_06_feature"
  },
  {
    "placeId": "IND-HER-07",
    "name": "Ellora Caves & Kailash Temple Scannable Feature",
    "nameHi": "वेरूळ लेणी व कैलास मंदिर (Ellora Leni)",
    "nameGu": "वेरूळ लेणी व कैलास मंदिर (Ellora Leni)",
    "description": "Cave 16 Kailash Temple Monolithic Shikhara, Ravana Shaking Mount Kailash Relief, Life-size Elephants & Dhwajasthambha, Cave 10 Vishwakarma Carpenter's Cave, Cave 32 Indra Sabha",
    "visionLabel": "ind_her_07_feature"
  },
  {
    "placeId": "IND-HER-08",
    "name": "Konark Sun Temple (The Black Pagoda) Scannable Feature",
    "nameHi": "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର (Konark Sun Temple)",
    "nameGu": "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର (Konark Sun Temple)",
    "description": "24 Intricately Carved Sundial Wheels (Spokes tell exact time), 7 Galloping Horses representing days of week, Natya Mandapa with 128 dance poses, Chlorite Stone Sun God (Surya) Statues, Erotic Mithuna Sculptures",
    "visionLabel": "ind_her_08_feature"
  },
  {
    "placeId": "IND-HER-09",
    "name": "Khajuraho Group of Monuments Scannable Feature",
    "nameHi": "खजुराहो स्मारक समूह (Khajuraho Temples)",
    "nameGu": "खजुराहो स्मारक समूह (Khajuraho Temples)",
    "description": "Kandariya Mahadeva Shikhara representing Mount Kailash, Lakshmana Temple Vaikuntha Vishnu, Chausath Yogini Temple, Parshvanatha Jain Temple, Intricate Mithuna friezes, Celestial Apsaras",
    "visionLabel": "ind_her_09_feature"
  },
  {
    "placeId": "IND-HER-10",
    "name": "Hampi (Ruins of the Vijayanagara Empire) Scannable Feature",
    "nameHi": "ಹಂಪಿ (Hampi Vijayanagara)",
    "nameGu": "ಹಂಪಿ (Hampi Vijayanagara)",
    "description": "Stone Chariot at Vijaya Vittala Temple, 56 Musical Pillars (SaReGaMa), Virupaksha Temple 50m Gopuram, Lotus Mahal, Royal Elephant Stables, Queen's Bath, Monolithic Narasimha",
    "visionLabel": "ind_her_10_feature"
  },
  {
    "placeId": "IND-HER-11",
    "name": "Rani ki Vav (The Queen's Stepwell) Scannable Feature",
    "nameHi": "રાણકી વાવ (Rani ki Vav)",
    "nameGu": "રાણકી વાવ (Rani ki Vav)",
    "description": "Seven Subterranean Stepped Terraces, Central Sheshashayi Vishnu reclining on Sheshanaga, Dashavatara (10 avatars of Vishnu) wall panels, 500 major sculptures, Circular deep well shaft",
    "visionLabel": "ind_her_11_feature"
  },
  {
    "placeId": "IND-HER-12",
    "name": "Group of Monuments at Mahabalipuram Scannable Feature",
    "nameHi": "மாமல்லபுரம் சிற்பங்கள் (Mamallapuram)",
    "nameGu": "மாமல்லபுரம் சிற்பங்கள் (Mamallapuram)",
    "description": "Shore Temple facing Bay of Bengal, Descent of the Ganges (Arjuna's Penance) Bas-Relief, Pancha Rathas (Dharmaraja, Bhima, Arjuna, Nakula-Sahadeva, Draupadi), Krishna's Butterball (250-ton precariously balanced boulder)",
    "visionLabel": "ind_her_12_feature"
  },
  {
    "placeId": "IND-HER-13",
    "name": "Buddhist Monuments at Sanchi (Great Stupa 1) Scannable Feature",
    "nameHi": "सांची का महान स्तूप (Sanchi Stupa)",
    "nameGu": "सांची का महान स्तूप (Sanchi Stupa)",
    "description": "Four Ornate Torana Gateways (North, South, East, West), Shalabhanjika Yakshi Bracket figures, Ashoka Lion Pillar Capital fragment, Circumambulatory Pradakshina Path, Great Bowl, Stupa 3",
    "visionLabel": "ind_her_13_feature"
  },
  {
    "placeId": "IND-HER-14",
    "name": "Brihadisvara Temple (Peruvudaiyar Kovil) Scannable Feature",
    "nameHi": "தஞ்சைப் பெருவுடையார் கோயில் (Brihadisvara)",
    "nameGu": "தஞ்சைப் பெருவுடையார் கோயில் (Brihadisvara)",
    "description": "16-Storey Pyramidal Vimana, 80-tonne Single Granite Kumbam Capstone, Monolithic Nandi Bull Pavilion, Chola Frescoes in Inner Ambulatory, Epigraphical Tamil Inscriptions of Chola Donors",
    "visionLabel": "ind_her_14_feature"
  },
  {
    "placeId": "IND-HER-15",
    "name": "Hawa Mahal (Palace of Winds) Scannable Feature",
    "nameHi": "हवा महल (Hawa Mahal)",
    "nameGu": "हवा महल (Hawa Mahal)",
    "description": "953 Intricately Carved Jharokhas (Oriel Screen Windows), Venturi Effect Air Circulation Channels, Autumn (Sharad) & Light (Prakash) Mandirs, Stained Glass Windows, Courtyard Fountains",
    "visionLabel": "ind_her_15_feature"
  },
  {
    "placeId": "IND-HER-16",
    "name": "Amer Fort & Palace Scannable Feature",
    "nameHi": "आमेर क़िला (Amer Durg)",
    "nameGu": "आमेर क़िला (Amer Durg)",
    "description": "Sheesh Mahal (Mirror Palace where a single candle illuminates the hall), Ganesh Pol Gateway with frescoes, Diwan-i-Aam with 27 pillars, Sukh Niwas water-cooled palace, Maota Lake Kesar Kyari garden",
    "visionLabel": "ind_her_16_feature"
  },
  {
    "placeId": "IND-HER-17",
    "name": "Charminar Scannable Feature",
    "nameHi": "चारमीनार (Charminar)",
    "nameGu": "चारमीनार (Charminar)",
    "description": "Four 48-meter High Fluted Minarets, Four Grand Pointed Arches facing cardinal points, Upper Floor Mosque with 45 prayer spaces, Stucco Balustrades, Clock faces added in 1889",
    "visionLabel": "ind_her_17_feature"
  },
  {
    "placeId": "IND-HER-18",
    "name": "Golconda Fort Scannable Feature",
    "nameHi": "గోల్కొండ కోట (Golconda Fort)",
    "nameGu": "గోల్కొండ కోట (Golconda Fort)",
    "description": "Fateh Darwaza with Acoustic Handclap Signaling, Bala Hissar Royal Pavilion at summit, Sri Jagadamba Mahakali Temple, Rani Mahal, Aslah Khana (Armory), Kilwat Royal Council Hall",
    "visionLabel": "ind_her_18_feature"
  },
  {
    "placeId": "IND-HER-19",
    "name": "Victoria Memorial Hall Scannable Feature",
    "nameHi": "ভিক্টোরিয়া মেমোরিয়াল (Victoria Memorial)",
    "nameGu": "ভিক্টোরিয়া মেমোরিয়াল (Victoria Memorial)",
    "description": "Rotating Bronze Angel of Victory (3 tonnes, 16ft high), Central Classical Dome flanked by Mughal Chhatris, Queen's Hall with Royal Gallery, Curzon Collection Paintings, Extensive 64-acre Landscaped Gardens",
    "visionLabel": "ind_her_19_feature"
  },
  {
    "placeId": "IND-HER-20",
    "name": "Golden Temple (Sri Harmandir Sahib) Scannable Feature",
    "nameHi": "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ (Sri Harmandir Sahib)",
    "nameGu": "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ (Sri Harmandir Sahib)",
    "description": "Gilded Gold Fluted Dome, Amrit Sarovar (Nectar Pool), Guru Ram Das Langar Hall (feeds 100,000 daily free), Akal Takht (Seat of Temporal Authority), Dukh Bhanjani Beri (Sacred Jujube Tree), Darshani Deori Gateway",
    "visionLabel": "ind_her_20_feature"
  },
  {
    "placeId": "IND-HER-21",
    "name": "Meenakshi Amman Temple Scannable Feature",
    "nameHi": "மீனாட்சி சுந்தரேசுவரர் கோயில் (Meenakshi Kovil)",
    "nameGu": "மீனாட்சி சுந்தரேசுவரர் கோயில் (Meenakshi Kovil)",
    "description": "14 Soaring Polychromatic Gopurams (Over 33,000 carved stucco figures), Hall of 1000 Pillars (Aayiram Kaal Mandapam) with 985 carved granite columns, Golden Lotus Tank (Porthamarai Kulam), Musical Granite Pillars, Meenakshi and Sundareswarar Sanctums",
    "visionLabel": "ind_her_21_feature"
  },
  {
    "placeId": "IND-HER-22",
    "name": "Archaeological Site of Nalanda Mahavihara Scannable Feature",
    "nameHi": "नालंदा महाविहार (Nalanda University)",
    "nameGu": "नालंदा महाविहार (Nalanda University)",
    "description": "Sariputta Great Stupa (Temple 3) with Corner Towers, Chaitya 12 with Votive Stupas, Monastic Cells with Stone Beds and Private Cooking Hearths, Central Drainage and Water Wells, Monastic Lecture Halls",
    "visionLabel": "ind_her_22_feature"
  },
  {
    "placeId": "IND-HER-23",
    "name": "Mahabodhi Temple Complex Scannable Feature",
    "nameHi": "महाबोधि मंदिर (Mahabodhi Temple)",
    "nameGu": "महाबोधि मंदिर (Mahabodhi Temple)",
    "description": "Sacred Bodhi Tree (Ficus religiosa descendant), Diamond Throne (Vajrasana) of Emperor Ashoka, 55m Brick Main Temple Tower, Animesh Lochan Chaitya, Jewel Walk Cankamana with stone lotus carvings, Muchalinda Lake",
    "visionLabel": "ind_her_23_feature"
  },
  {
    "placeId": "IND-HER-24",
    "name": "Elephanta Caves Scannable Feature",
    "nameHi": "घारापुरीची लेणी (Elephanta Caves)",
    "nameGu": "घारापुरीची लेणी (Elephanta Caves)",
    "description": "Trimurti (Sadashiva) 6-meter Colossal 3-Headed Shiva Relief, Shiva Nataraja Dancing, Gangadhara Shiva catching Ganga in locks, Ardhanarishvara (Half-male half-female), Linga Shrine with Dvarapala Guardians",
    "visionLabel": "ind_her_24_feature"
  },
  {
    "placeId": "IND-HER-25",
    "name": "Group of Monuments at Pattadakal Scannable Feature",
    "nameHi": "ಪಟ್ಟದಕಲ್ಲು ಸ್ಮಾರಕಗಳು (Pattadakal)",
    "nameGu": "ಪಟ್ಟದಕಲ್ಲು ಸ್ಮಾರಕಗಳು (Pattadakal)",
    "description": "Virupaksha Temple with Dravidian Vimana, Mallikarjuna Temple, Sangameshwara Temple (Oldest), Kadasiddheshwara Temple with Nagara Shikhara, Papanatha Temple with mixed style, Monolithic Nandi Mandapas",
    "visionLabel": "ind_her_25_feature"
  },
  {
    "placeId": "IND-HER-26",
    "name": "Kumbhalgarh Fort & The Great Wall of India Scannable Feature",
    "nameHi": "कुंभलगढ़ दुर्ग (Kumbhalgarh)",
    "nameGu": "कुंभलगढ़ दुर्ग (Kumbhalgarh)",
    "description": "36-km Serpentine Defensive Wall with Battlements, Badal Mahal (Cloud Palace) at peak, 360 Temples within perimeter (300 Jain, 60 Hindu), Ram Pol and Hanuman Pol Gateways, Birthplace chamber of Maharana Pratap",
    "visionLabel": "ind_her_26_feature"
  },
  {
    "placeId": "IND-HER-27",
    "name": "Chittorgarh Fort & Vijay Stambha Scannable Feature",
    "nameHi": "चित्तौड़गढ़ दुर्ग (Chittor Fort)",
    "nameGu": "चित्तौड़गढ़ दुर्ग (Chittor Fort)",
    "description": "Vijay Stambha (Tower of Victory, 9 storeys, 37m high), Kirti Stambha (Tower of Fame, 22m), Padmini's Palace surrounded by water moat, Gaumukh Reservoir (Cow's Mouth spring), Jauhar Kund (Sacrificial fire site)",
    "visionLabel": "ind_her_27_feature"
  },
  {
    "placeId": "IND-HER-28",
    "name": "Dholavira: Ancient Harappan Metropolis Scannable Feature",
    "nameHi": "ધોળાવીરા (Dholavira)",
    "nameGu": "ધોળાવીરા (Dholavira)",
    "description": "16 Giant Rock-Cut Water Reservoirs (Storing 300,000 cubic meters), Dholavira Signboard with 10 Indus Script Glyphs, Fortified Citadel with Double Stone Walls, Ceremonial Stadium Ground, Underground Stormwater Drains",
    "visionLabel": "ind_her_28_feature"
  },
  {
    "placeId": "IND-HER-29",
    "name": "Kakatiya Rudreshwara (Ramappa) Temple Scannable Feature",
    "nameHi": "రామప్ప దేవాలయం (Ramappa Temple)",
    "nameGu": "రామప్ప దేవాలయం (Ramappa Temple)",
    "description": "12 Lustrous Black Basalt Madanika Bracket Figures, Floating Brick Vimana Shikhara, Sandbox Earthquake-Resistant Foundation, Flawlessly Polished Nandi Pavilion, Ramappa Lake water catchment",
    "visionLabel": "ind_her_29_feature"
  },
  {
    "placeId": "IND-HER-30",
    "name": "Sacred Ensembles of the Hoysalas: Belur & Halebidu Scannable Feature",
    "nameHi": "ಹೊಯ್ಸಳೇಶ್ವರ ಮತ್ತು ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ (Hoysala Temples)",
    "nameGu": "ಹೊಯ್ಸಳೇಶ್ವರ ಮತ್ತು ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ (Hoysala Temples)",
    "description": "Star-shaped Jagati Platform, Continuous Animal Friezes (Elephants for strength, Lions for courage, Horses for speed, Hamsas for purity), Shilabalika (Bracket dancers) with filigree jewellery, Lathe-turned Polished Stone Pillars, Dvarapalas",
    "visionLabel": "ind_her_30_feature"
  },
  {
    "placeId": "IND-HER-31",
    "name": "Sun Temple Modhera Scannable Feature",
    "nameHi": "મોઢેરા સૂર્ય મંદિર (Modhera Sun Temple)",
    "nameGu": "મોઢેરા સૂર્ય મંદિર (Modhera Sun Temple)",
    "description": "Surya Kund with 108 miniature stepped shrines, Sabha Mandapa with 52 intricately carved pillars (representing 52 weeks of the year), Equinox Solar Alignment Chamber, Torana Arches, 12 Adityas reliefs",
    "visionLabel": "ind_her_31_feature"
  },
  {
    "placeId": "IND-HER-32",
    "name": "Rock Shelters of Bhimbetka Scannable Feature",
    "nameHi": "भीमबेटका शैलचित्र (Bhimbetka Caves)",
    "nameGu": "भीमबेटका शैलचित्र (Bhimbetka Caves)",
    "description": "Auditorium Rock Shelter (Cave 3) with Cupules, 'Zoo Rock' Shelter 4 depicting 252 animals across 16 species, Boar Attack Wall Painting, Dancing and Hunting Pictographs, Massive Natural Rock Arches",
    "visionLabel": "ind_her_32_feature"
  },
  {
    "placeId": "IND-HER-33",
    "name": "Basilica of Bom Jesus & Se Cathedral Scannable Feature",
    "nameHi": "बोम जिजस बेसिलिका (Bom Jesus Goa)",
    "nameGu": "बोम जिजस बेसिलिका (Bom Jesus Goa)",
    "description": "Silver Casket containing Relics of St. Francis Xavier, Massive Gilded Baroque Altarpiece, Basalt Facade with Jesuit Insignia (IHS), Se Cathedral 'Golden Bell' (Largest in Goa), Chapel of the Miraculous Cross",
    "visionLabel": "ind_her_33_feature"
  },
  {
    "placeId": "IND-HER-34",
    "name": "Chhatrapati Shivaji Maharaj Terminus (CSMT) Scannable Feature",
    "nameHi": "छत्रपती शिवाजी महाराज टर्मिनस (CSMT)",
    "nameGu": "छत्रपती शिवाजी महाराज टर्मिनस (CSMT)",
    "description": "Central Ribbed Octagonal Stone Dome surmounted by 4m 'Progress' Statue, Stone Balustrades with Gargoyles and Peacocks, Grand Cantilevered Staircase, Lion (Great Britain) and Tiger (India) Entrance Gate Pier Statues, Stained Glass Windows",
    "visionLabel": "ind_her_34_feature"
  },
  {
    "placeId": "IND-HER-35",
    "name": "Gwalior Fort & Man Mandir Palace Scannable Feature",
    "nameHi": "ग्वालियर क़िला (Gwalior Durg)",
    "nameGu": "ग्वालियर क़िला (Gwalior Durg)",
    "description": "Man Mandir Palace Turquoise Tile Inlay (Ducks, Elephants, and Peacocks), Teli ka Mandir (30m high Dravidian-style temple), Saas Bahu (Sahastrabahu) Temples, 7th-century Chaturbhuj Temple (Earliest written 'Zero' glyph in stone), 57 Colossal Rock-Cut Jain Tirthankara Statues",
    "visionLabel": "ind_her_35_feature"
  },
  {
    "placeId": "IND-HER-36",
    "name": "Daulatabad Fort & Chand Minar Scannable Feature",
    "nameHi": "दौलताबाद किल्ला (Devagiri Fort)",
    "nameGu": "दौलताबाद किल्ला (Devagiri Fort)",
    "description": "Chand Minar (64-meter Victory Minaret built by Alauddin Bahmani), Andhari (Pitch-Dark Subterranean Maze Passage with lethal false steps), Moat filled with Crocodiles, Mendha Cannon (Ram-headed bronze cannon), Chini Mahal royal prison",
    "visionLabel": "ind_her_36_feature"
  },
  {
    "placeId": "IND-HER-37",
    "name": "Raigad Fort (Capital of Maratha Empire) Scannable Feature",
    "nameHi": "किल्ले रायगड (Raigad Durg)",
    "nameGu": "किल्ले रायगड (Raigad Durg)",
    "description": "Maha Darwaza (Flanked by 70-foot bastions), Raj Sabha (Grand Coronation Throne Room of Shivaji Maharaj with acoustic design), Hirkani Buruj sheer cliff bastion, Jagdishwar Temple and Shivaji Maharaj's Samadhi, Takmak Tok execution point",
    "visionLabel": "ind_her_37_feature"
  },
  {
    "placeId": "IND-HER-38",
    "name": "Murud-Janjira Sea Fort Scannable Feature",
    "nameHi": "मुरुड जंजिरा किल्ला (Murud Janjira)",
    "nameGu": "मुरुड जंजिरा किल्ला (Murud Janjira)",
    "description": "19 Round Stone Bastions directly kissing sea waves, Concealed Main Entrance Gate (Sher Darwaza), Kalal Bangadi (Third-largest cannon in India, 22 tonnes of 5-metal alloy), Freshwater Lakes amidst salty sea, Ruined Palaces of the Siddi Nawabs",
    "visionLabel": "ind_her_38_feature"
  },
  {
    "placeId": "IND-HER-39",
    "name": "Gol Gumbaz (The Whispering Gallery) Scannable Feature",
    "nameHi": "ಗೋಲ್ ಗುಮ್ಮಟ (Gol Gumbaz)",
    "nameGu": "ಗೋಲ್ ಗುಮ್ಮಟ (Gol Gumbaz)",
    "description": "Massive Hemispherical Free-Standing Dome (Second largest in the world after St. Peter's in Rome), Whispering Gallery running along the inner circumference, Four 8-Storey Octagonal Minaret Corner Towers, Lotus Petal Cornices, Adil Shahi Cenotaphs",
    "visionLabel": "ind_her_39_feature"
  },
  {
    "placeId": "IND-HER-40",
    "name": "Mysore Palace (Amba Vilas Palace) Scannable Feature",
    "nameHi": "ಮೈಸೂರು ಅರಮನೆ (Mysore Palace)",
    "nameGu": "ಮೈಸೂರು ಅರಮನೆ (Mysore Palace)",
    "description": "Durbar Hall with Ornate Painted Ceiling and Granite Columns, Kalyana Mantapa (Octagonal Stained Glass Marriage Pavilion), 97,000 Incandescent Bulbs Illumination, Golden Howdah (Elephant throne crafted of 80 kg gold), Gombe Thotti (Dolls Pavilion)",
    "visionLabel": "ind_her_40_feature"
  },
  {
    "placeId": "IND-HER-41",
    "name": "Jagannath Temple (Puri) Scannable Feature",
    "nameHi": "ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର (Puri Jagannath)",
    "nameGu": "ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର (Puri Jagannath)",
    "description": "Neelachakra (Eight-spoke Ashtadhatu wheel atop the 65m spire), Patitapavana Holy Flag flying opposite wind direction, Baisi Pahacha (22 Sacred Steps), Anandabazar (World's largest open-air food market), Ratha Yatra Chariots (Nandighosha, Taladhwaja, Darpadalana)",
    "visionLabel": "ind_her_41_feature"
  },
  {
    "placeId": "IND-HER-42",
    "name": "Cellular Jail (Kala Pani) Scannable Feature",
    "nameHi": "सेलुलर जेल (काला पानी)",
    "nameGu": "सेलुलर जेल (काला पानी)",
    "description": "Central Hexagonal Watchtower, Solitary Confinement Cell of Veer Savarkar, Gallows Execution Chamber, Eternal Flame of Freedom Martyrs, Three Surviving Radiating Prison Wings",
    "visionLabel": "ind_her_42_feature"
  },
  {
    "placeId": "IND-HER-43",
    "name": "Kamakhya Temple (Guwahati) Scannable Feature",
    "nameHi": "কামাখ্যা দেৱালয় (Kamakhya Mandir)",
    "nameGu": "কামাখ্যা দেৱালয় (Kamakhya Mandir)",
    "description": "Beehive-shaped Shikhara, Underground Garbhagriha with Natural Rock Fissure Spring (Yoni Mudra), Intricate Relief Sculptures of Hindu Deities, Tortoise Pond, View of River Brahmaputra",
    "visionLabel": "ind_her_43_feature"
  },
  {
    "placeId": "IND-HER-44",
    "name": "Rang Ghar & Talatal Ghar (Ahom Kingdom) Scannable Feature",
    "nameHi": "ৰংঘৰ আৰু তলাতল ঘৰ (Rang Ghar)",
    "nameGu": "ৰংঘৰ আৰু তলাতল ঘৰ (Rang Ghar)",
    "description": "Inverted Royal Longboat Shaped Roof, Sculptured Crocodile Horn Finials, Royal Balcony facing the Rupahi Pathar arena, Secret Subterranean Escape Tunnels connecting to Dikhow River",
    "visionLabel": "ind_her_44_feature"
  },
  {
    "placeId": "IND-HER-45",
    "name": "Martand Sun Temple Scannable Feature",
    "nameHi": "मार्तंड सूर्य मंदिर (Martand Temple)",
    "nameGu": "मार्तंड सूर्य मंदिर (Martand Temple)",
    "description": "Trefoil Arched Entrance Gateway, 84 Fluted Classical Pillars, Central Vimana with Sun God reliefs, Panoramic vista over the Kashmir Valley and Pir Panjal mountain range",
    "visionLabel": "ind_her_45_feature"
  },
  {
    "placeId": "IND-HER-46",
    "name": "Bishnupur Terracotta Temples Scannable Feature",
    "nameHi": "বিষ্ণুপুর পোড়ামাটির মন্দির (Bishnupur)",
    "nameGu": "বিষ্ণুপুর পোড়ামাটির মন্দির (Bishnupur)",
    "description": "Pancha-Ratna (Five Towers) of Shyam Rai Temple, Exquisite Baked Terracotta Wall Panels depicting Ramayana and Mahabharata battle scenes, Rasmancha Pyramidal Pavilion with 108 arched portals, Madan Mohan Temple, Dalmadal Cannon (Maratha siege cannon)",
    "visionLabel": "ind_her_46_feature"
  },
  {
    "placeId": "IND-HER-47",
    "name": "Lepakshi Veerabhadra Temple & Hanging Pillar Scannable Feature",
    "nameHi": "లేపాక్షి వీరభద్ర స్వామి ఆలయం (Lepakshi)",
    "nameGu": "లేపాక్షి వీరభద్ర స్వామి ఆలయం (Lepakshi)",
    "description": "Famous Hanging Pillar (Leaves clear gap above the stone floor; cloth can pass underneath), Monolithic Nagalinga (7-headed hooded serpent coiled around lingam), Giant Monolithic Basava Nandi Bull, Fresco Ceiling of Virupanna on Natya Mandapa roof, Sita's Giant Footprint",
    "visionLabel": "ind_her_47_feature"
  },
  {
    "placeId": "IND-HER-48",
    "name": "Badami Cave Temples Scannable Feature",
    "nameHi": "ಬಾದಾಮಿ ಗುಹಾಂತರ ದೇವಾಲಯಗಳು (Badami)",
    "nameGu": "ಬಾದಾಮಿ ಗುಹಾಂತರ ದೇವಾಲಯಗಳು (Badami)",
    "description": "Cave 1 18-Armed Dancing Nataraja (Demonstrating 81 Bharatanatyam mudras), Cave 3 Varaha and Narasimha Colossal Reliefs, Cave 4 Mahavira and Parshvanatha Tirthankaras, Bhootnath Temple on Agastya Lake edge, Agastya Lake reservoir",
    "visionLabel": "ind_her_48_feature"
  },
  {
    "placeId": "IND-HER-49",
    "name": "Aihole (Cradle of Indian Temple Architecture) Scannable Feature",
    "nameHi": "ಐಹೊಳೆ (Aihole Temple Complex)",
    "nameGu": "ಐಹೊಳೆ (Aihole Temple Complex)",
    "description": "Apsidal Durga Temple (Gajaprishtha/Elephant-back plan with pillared peristyle), Lad Khan Temple (Ancient cave-temple inspired hall), Meguti Jain Temple with Ravikirti's 634 CE Pulakeshin II Inscription, Huchappayya Matha, Ravana Phadi Cave",
    "visionLabel": "ind_her_49_feature"
  },
  {
    "placeId": "IND-HER-50",
    "name": "Bekal Fort (Sea Bastion of Malabar) Scannable Feature",
    "nameHi": "ബേക്കൽ കോട്ട (Bekal Fort)",
    "nameGu": "ബേക്കൽ കോട്ട (Bekal Fort)",
    "description": "Observation Watchtower at Center (Offering 360-degree sea view), Keyhole Defensive Bastion Wall Layout, Sea Gate with Concealed Escape Tunnel, Gun Holes at varying angles (High for ships, Low for landing boats), Anjaneya Temple",
    "visionLabel": "ind_her_50_feature"
  },
  {
    "placeId": "IND-ART-01",
    "name": "Harappan Bronze 'Dancing Girl' Scannable Feature",
    "nameHi": "नर्तकी (Dancing Girl - Mohenjo-daro)",
    "nameGu": "नर्तकी (Dancing Girl - Mohenjo-daro)",
    "description": "Tribhanga (Tri-bent) Dynamic Posture, Left Arm laden with 25 bangles made of bone/terracotta, Right Arm resting boldly on hip, Elaborate Hair Coiffure coiled in bun, Cowrie Shell Amulet Necklace, Naturalistic elongated limbs",
    "visionLabel": "ind_art_01_feature"
  },
  {
    "placeId": "IND-ART-02",
    "name": "Lion Capital of Ashoka (National Emblem of India) Scannable Feature",
    "nameHi": "अशोक की सिंह चतुर्मुख स्तंभशीर्ष (Ashoka Lion Capital)",
    "nameGu": "अशोक की सिंह चतुर्मुख स्तंभशीर्ष (Ashoka Lion Capital)",
    "description": "Four Asiatic Lions seated back-to-back facing cardinal directions, Abacus frieze with 4 animals (Elephant, Galloping Horse, Humped Bull, Lion), 24-Spoked Ashoka Chakra wheels separating animals, Inverted Bell-shaped Bell Lotus base",
    "visionLabel": "ind_art_02_feature"
  },
  {
    "placeId": "IND-ART-03",
    "name": "Didarganj Yakshi (Chauri Bearer) Scannable Feature",
    "nameHi": "दीदारगंज यक्षी (Didarganj Yakshi)",
    "nameGu": "दीदारगंज यक्षी (Didarganj Yakshi)",
    "description": "Chauri (Fly-whisk) held in right hand, Intricate multi-strand beaded girdle (Mekhala) on waist, Heavy anklets and coiled necklaces, Translucent folds of pleated dhoti garment, Mirror-smooth lustrous polished surface",
    "visionLabel": "ind_art_03_feature"
  },
  {
    "placeId": "IND-ART-04",
    "name": "Chola Bronze Nataraja (Cosmic Dancer) Scannable Feature",
    "nameHi": "நடராசர் வெண்கலச் சிலை (Chola Nataraja)",
    "nameGu": "நடராசர் வெண்கலச் சிலை (Chola Nataraja)",
    "description": "Ananda Tandava (Dance of Cosmic Bliss) pose, Right hand holding Damaru (Creation drum), Left hand holding Agni (Destruction flame), Lower right hand in Abhaya Mudra (Fearlessness), Right foot crushing demon Apasmara (Ignorance), Circular Flaming Prabha halo",
    "visionLabel": "ind_art_04_feature"
  },
  {
    "placeId": "IND-ART-05",
    "name": "Mughal Imperial Chahar-Aina Armoured Cuirass Scannable Feature",
    "nameHi": "चार-आईना (Chahar-Aina / Four Mirrors Armor)",
    "nameGu": "चार-आईना (Chahar-Aina / Four Mirrors Armor)",
    "description": "Four Interlocking Mirror Steel Plates, Gold Damascened Quranic Verses of Victory (Surah Al-Fath), Brass-riveted Hinges and Silk Straps, High-Carbon Watered Crucible Silk Wave Pattern",
    "visionLabel": "ind_art_05_feature"
  },
  {
    "placeId": "IND-ART-06",
    "name": "Tipu Sultan's Wootz Steel 'Tiger of Mysore' Bedchamber Sword Scannable Feature",
    "nameHi": "टीपू सुल्तान की शमशीर (Tipu Sultan's Sword)",
    "nameGu": "टीपू सुल्तान की शमशीर (Tipu Sultan's Sword)",
    "description": "Curved Wootz Steel Blade with Carbon-Nanotube Microcrystalline Banding, Solid Gold Tiger-Head Pommel, Quillon terminals shaped like snarling tigers, Calligraphic Gold Inscription invoking 'Shamshir-e-Ali' (Sword of Ali)",
    "visionLabel": "ind_art_06_feature"
  },
  {
    "placeId": "IND-ART-07",
    "name": "Maratha Wagh Nakh (Tiger Claws Concealed Weapon) Scannable Feature",
    "nameHi": "वाघनख (Chhatrapati Shivaji's Wagh Nakh)",
    "nameGu": "वाघनख (Chhatrapati Shivaji's Wagh Nakh)",
    "description": "Four Sharp Curved Steel Claws, Two Outer Finger Rings for thumb and pinky concealment in palm, Crossbar plate hidden inside clenched fist, Bichuwa (Scorpion) dagger slot",
    "visionLabel": "ind_art_07_feature"
  },
  {
    "placeId": "IND-ART-08",
    "name": "Noor Jahan's White Nephrite Jade Hilt Dagger Scannable Feature",
    "nameHi": "नूरजहाँ की खंजर (Noor Jahan's Jade Dagger)",
    "nameGu": "नूरजहाँ की खंजर (Noor Jahan's Jade Dagger)",
    "description": "Translucent White Jade Pistol-Grip Hilt carved with acanthus leaves, Gold-inlaid Floral Tendrils with inset Rubies, Double-edged curved watered steel blade with central fuller groove, Velvet-covered wooden sheath with pierced gold chape",
    "visionLabel": "ind_art_08_feature"
  },
  {
    "placeId": "IND-ART-09",
    "name": "Mughal Elephant Combat Armor (Gaj Charma) Scannable Feature",
    "nameHi": "गज चर्म (Mughal Elephant Armor)",
    "nameGu": "गज चर्म (Mughal Elephant Armor)",
    "description": "Articulated Steel Forehead Shaffron with brass rosette medallions, Throat Defense (Throat guard), Flank Curtains (Side bards) with riveted steel lames, Armored Ear flaps, Steel Trunk guards",
    "visionLabel": "ind_art_09_feature"
  },
  {
    "placeId": "IND-ART-10",
    "name": "Veiled Rebecca Marble Sculpture Scannable Feature",
    "nameHi": "घूंघट में रेबेका (Veiled Rebecca)",
    "nameGu": "घूंघट में रेबेका (Veiled Rebecca)",
    "description": "Translucent Stone Veil (Appears completely transparent revealing underlying facial features, hair, and gaze), Intricate Embroidered Veil Border, Realistic fabric folds draped across shoulders, Elegant poise with water jar at base",
    "visionLabel": "ind_art_10_feature"
  },
  {
    "placeId": "IND-ART-11",
    "name": "Ancient Indian Punch-Marked Silver Karshapana & Gupta Gold Dinars Scannable Feature",
    "nameHi": "आहत सिक्के एवं गुप्त कालीन स्वर्ण दीनार (Ancient Indian Coins)",
    "nameGu": "आहत सिक्के एवं गुप्त कालीन स्वर्ण दीनार (Ancient Indian Coins)",
    "description": "Five Symbol Punches on Silver (Sun, Six-arm wheel, Hill with Crescent, Peacock on Arches, Bull), Samudragupta Playing the Lyre (Veena) Gold Coin, Chandragupta II Archer Type Gold Dinar with Brahmi Legend, Goddess Lakshmi seated on lotus reverse",
    "visionLabel": "ind_art_11_feature"
  },
  {
    "placeId": "IND-ART-12",
    "name": "Katar (Indian Double-Edged Push Dagger) Scannable Feature",
    "nameHi": "कटार (Katar / Push Dagger)",
    "nameGu": "कटार (Katar / Push Dagger)",
    "description": "Horizontal H-shaped Grip Bars gripped in clenched fist, Parallel Steel Arm Guards protecting wrist and forearm, Thickened Reinforced Chisel Point designed to split chainmail links, Deep Central Fullers (Blood gutters), Gold floral overlay",
    "visionLabel": "ind_art_12_feature"
  },
  {
    "placeId": "IND-GJ-04",
    "name": "Champaner-Pavagadh Archaeological Park Scannable Feature",
    "nameHi": "ચાંપાનેર-પાવાગઢ પુરાતત્વીય ઉદ્યાન (Champaner-Pavagadh)",
    "nameGu": "ચાંપાનેર-પાવાગઢ પુરાતત્વીય ઉદ્યાન (Champaner-Pavagadh)",
    "description": "Jama Masjid of Champaner (172 carved pillars and 30m minarets), Kalika Mata Temple at Pavagadh peak, Helical Stepwell (Spiral stone stairs), Sahar ki Masjid, Citadel Fortification Gates (Atak Gate, Godhra Gate), Ek Minar ki Masjid",
    "visionLabel": "ind_gj_04_feature"
  },
  {
    "placeId": "IND-GJ-05",
    "name": "Sidi Saiyyed Mosque (The Tree of Life Jali) Scannable Feature",
    "nameHi": "સીદી સૈયદની જાળી (Sidi Saiyyed Ni Jali)",
    "nameGu": "સીદી સૈયદની જાળી (Sidi Saiyyed Ni Jali)",
    "description": "Tree of Life Stone Lattice Jali (Intertwining branches of kalpavriksha and palm fronds), Geometric Diamond Pattern Jali screens, Arched mihrab portals, Slender minaret bases, Ten semicircular lattice windows",
    "visionLabel": "ind_gj_05_feature"
  },
  {
    "placeId": "IND-GJ-06",
    "name": "Adalaj Stepwell (Rudabai Stepwell) Scannable Feature",
    "nameHi": "અડાલજની વાવ (Adalaj Ni Vav)",
    "nameGu": "અડાલજની વાવ (Adalaj Ni Vav)",
    "description": "Five Superimposed Subterranean Pillared Storeys, Octagonal Central Light Well, Carved Navagraha (Nine Planets) friezes, Kalpavriksha (Tree of Life) motifs, Ami Khumbor (Pot of Water of Life) carvings, Stepped corridor descent",
    "visionLabel": "ind_gj_06_feature"
  },
  {
    "placeId": "IND-GJ-07",
    "name": "Lothal: Ancient Harappan Port & Tidal Dockyard Scannable Feature",
    "nameHi": "લોથલ ગોદીવાડો (Lothal Harappan Port)",
    "nameGu": "લોથલ ગોદીવાડો (Lothal Harappan Port)",
    "description": "Trapezoidal Tidal Dock Basin with Sluice Gate and Spillway, Warehouse Acropolis on 3.5m elevated mud-brick platform, Micro-Bead Micro-Drill Factory (Carnelian & Agate gemstones), Underground Street Drainage with Inspection Soakage Jars, Circular Persian Gulf Steatite Button Seal",
    "visionLabel": "ind_gj_07_feature"
  },
  {
    "placeId": "IND-GJ-08",
    "name": "Somnath Temple (Prabhas Patan) Scannable Feature",
    "nameHi": "સોમનાથ મહાદેવ મંદિર (Somnath Temple)",
    "nameGu": "સોમનાથ મહાદેવ મંદિર (Somnath Temple)",
    "description": "Towering Kailash Mahameru Shikhara, Baan Stambh (Arrow Pillar pointing southward across uninterrupted ocean to Antarctica), Triveni Sangam (Confluence of Hiran, Kapila, and Saraswati rivers), Sabha Mandapa with carved pillar brackets, Sardar Patel Bronze Memorial Statue",
    "visionLabel": "ind_gj_08_feature"
  },
  {
    "placeId": "IND-GJ-09",
    "name": "Dwarkadhish Temple (Jagat Mandir, Dwarka) Scannable Feature",
    "nameHi": "દ્વારકાધીશ જગત મંદિર (Dwarkadhish)",
    "nameGu": "દ્વારકાધીશ જગત મંદિર (Dwarkadhish)",
    "description": "72-Pillared Nijamandir Sanctum, 52-Yard Sacred Triangular Flag (Dhwaja) fluttering atop the 78m spire (Changed 5 times daily), Swarga Dwar (Heaven Gate) facing Gomti River, Moksha Dwar (Liberation Gate), Gomti Ghat stepped riverbank",
    "visionLabel": "ind_gj_09_feature"
  },
  {
    "placeId": "IND-GJ-10",
    "name": "Junagadh Rock Inscriptions of Ashoka, Rudradaman & Skandagupta Scannable Feature",
    "nameHi": "જૂનાગઢ અશોક શિલાલેખ (Junagadh Rock Inscriptions)",
    "nameGu": "જૂનાગઢ અશોક શિલાલેખ (Junagadh Rock Inscriptions)",
    "description": "14 Major Rock Edicts of Emperor Ashoka inscribed in Brahmi script, Junagadh Rock Inscription of Rudradaman I (First major long Sanskrit inscription in classical chaste kavya style, 150 CE), Skandagupta Edict (455 CE recording the bursting and repair of Sudarshana Lake dam), Protective colonial building enclosure",
    "visionLabel": "ind_gj_10_feature"
  },
  {
    "placeId": "IND-GJ-11",
    "name": "Uparkot Fort & Buddhist Rock-Cut Caves Scannable Feature",
    "nameHi": "ઉપરકોટ કિલ્લો અને બૌદ્ધ ગુફાઓ (Uparkot Fort)",
    "nameGu": "ઉપરકોટ કિલ્લો અને બૌદ્ધ ગુફાઓ (Uparkot Fort)",
    "description": "Adi Kadi Vav (Deep stepwell carved 81m entirely out of a single rock vein without structural masonry), Navghan Kuvo (Circular stepwell spiral staircase reaching 52m deep), Buddhist Rock-Cut Caves with floral Corinthian-like fluted pillars, Cannon Neelam and Manek (Forged in Egypt and brought by Ottoman Admiral Sulaiman Pasha), Jami Masjid",
    "visionLabel": "ind_gj_11_feature"
  },
  {
    "placeId": "IND-GJ-12",
    "name": "Palitana Temples on Shatrunjaya Hill Scannable Feature",
    "nameHi": "પાલીતાણા શેત્રુંજય તીર્થ (Palitana Temples)",
    "nameGu": "પાલીતાણા શેત્રુંજય તીર્થ (Palitana Temples)",
    "description": "Adinath (Rishabhanatha) Main Temple with jeweled eyes, 863 Marble Spires dominating the mountain ridge, Chaumukha Temple with four-faced Tirthankara, Fortified defensive tuk walls, Angar Pir Dargah within the complex, 3,500 Pilgrimage Steps",
    "visionLabel": "ind_gj_12_feature"
  },
  {
    "placeId": "IND-GJ-13",
    "name": "Vadnagar Kirti Torana & Archaeological Site Scannable Feature",
    "nameHi": "વડનગર કીર્તિ તોરણ (Vadnagar Kirti Torana)",
    "nameGu": "વડનગર કીર્તિ તોરણ (Vadnagar Kirti Torana)",
    "description": "Twin 12-meter Free-Standing Kirti Torana Arches, Serpentine Makara Bracket Arches, Hatkeshwar Mahadev Temple, Sharmistha Lake stepped ghats, Excavated 2nd-Century Buddhist Monastery (Vihara)",
    "visionLabel": "ind_gj_13_feature"
  },
  {
    "placeId": "IND-GJ-15",
    "name": "Sarkhej Roza (The Acropolis of Ahmedabad) Scannable Feature",
    "nameHi": "સરખેજ રોઝા (Sarkhej Roza)",
    "nameGu": "સરખેજ રોઝા (Sarkhej Roza)",
    "description": "Tomb of Sufi Saint Sheikh Ahmed Khattu Ganj Baksh with fine pierced brass screens, Royal Tombs of Sultan Mahmud Begada and Queen Rajabai, Symmetrical Pillared Pavilions reflected in Ahmed Sar Lake, Sluice Water Inlet Channels",
    "visionLabel": "ind_gj_15_feature"
  },
  {
    "placeId": "IND-GJ-16",
    "name": "Mahabat Maqbara Complex Scannable Feature",
    "nameHi": "મહોબત મકબરા (Mahabat Maqbara)",
    "nameGu": "મહોબત મકબરા (Mahabat Maqbara)",
    "description": "Four Exterior Spiralling Helical Minaret Staircases winding upwards like serpents, Onion Domes with French Baroque cornices, Intricate Gothic pointed jali arches, Silver embossed inner sanctum doors, Ornate stone chandeliers",
    "visionLabel": "ind_gj_16_feature"
  },
  {
    "placeId": "IND-GJ-17",
    "name": "Dada Harir Stepwell (Bai Harir Vav) Scannable Feature",
    "nameHi": "દાદા હરીરની વાવ (Dada Harir Ni Vav)",
    "nameGu": "દાદા હરીરની વાવ (Dada Harir Ni Vav)",
    "description": "Bilingual Sanskrit and Arabic Foundation Inscriptions (dating well to 1499 CE), Five Pillared Pavilions descending underground, Octagonal spiral well shaft with carved floral brackets, Adjacent Bai Harir Mosque and stone tomb pavilion",
    "visionLabel": "ind_gj_17_feature"
  },
  {
    "placeId": "IND-GJ-18",
    "name": "Aina Mahal & Prag Mahal Scannable Feature",
    "nameHi": "આઈના મહેલ અને પ્રાગ મહેલ (Aina Mahal Bhuj)",
    "nameGu": "આઈના મહેલ અને પ્રાગ મહેલ (Aina Mahal Bhuj)",
    "description": "Hira Mahal (Sunken Pleasure Hall of Mirrors with floating dance floor surrounded by water moat), 45-meter Italian Gothic Bell Clock Tower, Carved Italian Corinthian capitals and Gothic arches in Prag Mahal, 18th-century European mechanical singing bird clock",
    "visionLabel": "ind_gj_18_feature"
  },
  {
    "placeId": "IND-GJ-19",
    "name": "Sahastralinga Talav Scannable Feature",
    "nameHi": "સહસ્ત્રલિંગ તળાવ (Sahastralinga Talav)",
    "nameGu": "સહસ્ત્રલિંગ તળાવ (Sahastralinga Talav)",
    "description": "Stone Siltation Inlets channeling Saraswati River waters, Sculptured sluice sluices with 48 carved pillars, Remains of miniature Shivalinga shrines along embankment, Octagonal three-ring water inlet basin, Ruined Rudra Kupa well",
    "visionLabel": "ind_gj_19_feature"
  },
  {
    "placeId": "IND-GJ-20",
    "name": "Hutheesing Jain Temple Scannable Feature",
    "nameHi": "હઠીસિંગનાં દેરાં (Hutheesing Temple)",
    "nameGu": "હઠીસિંગનાં દેરાં (Hutheesing Temple)",
    "description": "Central 2-Storey Sanctum dedicated to 15th Tirthankara Dharmanatha, 52 Subsidiary Shrines surrounding the marble cloister, Manastambha (6-storey Tower of Glory inspired by Chittorgarh), Ornate carved Makrana marble brackets and ceilings",
    "visionLabel": "ind_gj_20_feature"
  },
  {
    "placeId": "IND-GJ-21",
    "name": "Vijay Vilas Palace Scannable Feature",
    "nameHi": "વિજય વિલાસ પેલેસ (Vijay Vilas Mandvi)",
    "nameGu": "વિજય વિલાસ પેલેસ (Vijay Vilas Mandvi)",
    "description": "Central Rajput Bulbous Dome flanked by Bengal-style Chhatris, Surrounding Stone Jharokha Balconies overlooking Arabian Sea, Royal Private Beach promenade, Extensive Sandstone Jali Lattice screens",
    "visionLabel": "ind_gj_21_feature"
  },
  {
    "placeId": "IND-GJ-22",
    "name": "Bhadra Fort & Teen Darwaza Scannable Feature",
    "nameHi": "ભદ્રનો કિલ્લો અને ત્રણ દરવાજા (Bhadra Fort)",
    "nameGu": "ભદ્રનો કિલ્લો અને ત્રણ દરવાજા (Bhadra Fort)",
    "description": "Teen Darwaza (Triple Arched Gateway where royal decrees were read out), Bhadrakali Temple in citadel courtyard, Royal Palace Pavilion with carved wooden balconies, Azam Khan Sarai Clock Tower (Installed 1878), 14 Defensive Stone Bastions",
    "visionLabel": "ind_gj_22_feature"
  },
  {
    "placeId": "IND-GJ-23",
    "name": "Jama Masjid of Ahmedabad Scannable Feature",
    "nameHi": "જામા મસ્જિદ (Jama Masjid Ahmedabad)",
    "nameGu": "જામા મસ્જિદ (Jama Masjid Ahmedabad)",
    "description": "260 Intricately Carved Stone Pillars (Carved by local Hindu/Jain artisans with bell and chain motifs), 15 Central Domes with Raised Clerestory Lanterns for natural airflow, Royal Mezzanine Muluk-Khana (Purdah gallery for royal women), Central Ablution Water Basin, Shaking minarets bases (Destroyed in 1819 earthquake)",
    "visionLabel": "ind_gj_23_feature"
  },
  {
    "placeId": "IND-GJ-24",
    "name": "Jhulta Minar (The Shaking Minarets of Sidi Bashir) Scannable Feature",
    "nameHi": "ઝૂલતા મીનારા (Jhulta Minar)",
    "nameGu": "ઝૂલતા મીનારા (Jhulta Minar)",
    "description": "Three-Storey Fluted Sandstone Minarets with stone brackets, Carved Balcony balustrades, Connecting Archway, Internal Spiral Staircase",
    "visionLabel": "ind_gj_24_feature"
  },
  {
    "placeId": "IND-GJ-25",
    "name": "Sabarmati Ashram (Hriday Kunj) Scannable Feature",
    "nameHi": "સાબરમતી આશ્રમ / હૃદય કુંજ (Sabarmati Ashram)",
    "nameGu": "સાબરમતી આશ્રમ / હૃદય કુંજ (Sabarmati Ashram)",
    "description": "Hriday Kunj (The humble cottage of Mahatma Gandhi and Kasturba Gandhi containing Gandhi's original spinning charkha, round glasses, and writing desk), Magan Niwas, Vinoba Kutir, Nandini Guest House, Charles Correa Memorial Museum (1963)",
    "visionLabel": "ind_gj_25_feature"
  },
  {
    "placeId": "IND-GJ-26",
    "name": "Lakhpat Fort & Gurdwara Pehli Patshahi Scannable Feature",
    "nameHi": "લખપત કિલ્લો (Lakhpat Fort)",
    "nameGu": "લખપત કિલ્લો (Lakhpat Fort)",
    "description": "7-km Continuous Fortress Wall with Embrasures overlooking the Rann, Gurdwara Pehli Patshahi (UNESCO Heritage Award winner holding wooden footwear 'Khadau' of Guru Nanak Dev Ji), Tomb of Pir Ghaus Muhammad with intricate carvings, Ghost town ruins of historic merchant houses",
    "visionLabel": "ind_gj_26_feature"
  },
  {
    "placeId": "IND-GJ-27",
    "name": "Taranga Jain Temple & Buddhist Caves Scannable Feature",
    "nameHi": "તારંગા જૈન મંદિર (Taranga Hill)",
    "nameGu": "તારંગા જૈન મંદિર (Taranga Hill)",
    "description": "Central Colossal 2.75-meter Marble Idol of 2nd Tirthankara Ajitnath, 43-meter High Multi-tiered Shikhara, Ornate Carved Pillars with Apsaras and Musicians, Taranga Buddhist Rock-Cut Caves (Dating back to 4th century CE with Tara goddess carvings)",
    "visionLabel": "ind_gj_27_feature"
  },
  {
    "placeId": "IND-GJ-28",
    "name": "Sidhpur Havelis & Rudra Mahalaya Temple Ruins Scannable Feature",
    "nameHi": "સિદ્ધપુર રુદ્ર મહાલય અને હવેલીઓ (Sidhpur)",
    "nameGu": "સિદ્ધપુર રુદ્ર મહાલય અને હવેલીઓ (Sidhpur)",
    "description": "Surviving Colossal 40-foot Carved Stone Torana Arches and Pillars of Rudra Mahalaya, Multi-Storey Pastel-Coloured Bohra Havelis with neo-classical pediments and wrought iron grilles, Bindu Sarovar (Holy Matrugaya pilgrimage ghat), Exquisite teakwood facade brackets",
    "visionLabel": "ind_gj_28_feature"
  },
  {
    "placeId": "IND-GJ-29",
    "name": "Khambhalida Buddhist Caves Scannable Feature",
    "nameHi": "ખંભાલીડા બૌદ્ધ ગુફાઓ (Khambhalida Caves)",
    "nameGu": "ખંભાલીડા બૌદ્ધ ગુફાઓ (Khambhalida Caves)",
    "description": "Colossal Lifesize Rock Relief of Bodhisattva Padmapani / Avalokiteshvara with lotus stalk, Lifesize Bodhisattva Vajrapani Relief, Rock-Cut Hemispherical Stupa inside Chaitya, Monks' Vihara residence cells",
    "visionLabel": "ind_gj_29_feature"
  },
  {
    "placeId": "IND-GJ-30",
    "name": "Gop Temple (Earliest Structural Temple of Gujarat) Scannable Feature",
    "nameHi": "ગોપ મંદિર (Gop Temple)",
    "nameGu": "ગોપ મંદિર (Gop Temple)",
    "description": "Stepped Pyramidal Tower with Kudu (Horseshoe) Gable Arches, Gandharan Greco-Buddhist influenced pediments, Chamfered Ashlar Stone Blocks without mortar, Trabeated stone doorway with river goddess jambs",
    "visionLabel": "ind_gj_30_feature"
  },
  {
    "placeId": "IND-GJ-31",
    "name": "Surat Castle (Old Fort of Surat) Scannable Feature",
    "nameHi": "સૂરત કિલ્લો (Surat Castle)",
    "nameGu": "સૂરત કિલ્લો (Surat Castle)",
    "description": "Four Massive Round Bastions facing Tapi River, Lead-Poured Masonry Joints designed to absorb cannonball impacts, Historic Cannons and Gun Embrasures, Restored Governor's Palace Wing with maritime trade exhibits",
    "visionLabel": "ind_gj_31_feature"
  },
  {
    "placeId": "IND-GJ-32",
    "name": "Ghumli Navalakha Temple & Vichia Vav Scannable Feature",
    "nameHi": "ઘુમલી નવલખા મંદિર (Ghumli Navalakha)",
    "nameGu": "ઘુમલી નવલખા મંદિર (Ghumli Navalakha)",
    "description": "Two-Storey Sabha Mandapa with soaring corbelled ceilings, High Stepped Plinth (Jagati) adorned with elephant friezes (Gajathara), Ashapura Temple ruins, Vichia Vav (Stepwell with pillared galleries), Barda Hills mountain backdrop",
    "visionLabel": "ind_gj_32_feature"
  },
  {
    "placeId": "IND-ART-13",
    "name": "Patan Patola Double-Ikat Silk Heritage Textile Scannable Feature",
    "nameHi": "પાટણનું પટોળું (Patan Patola Saree)",
    "nameGu": "પાટણનું પટોળું (Patan Patola Saree)",
    "description": "Identical front and back reversible geometric pattern, Narikunja (dancing girl, parrot, elephant, flower) motif, Pan bhat (betel leaf design), zero color leakage along warp and weft intersections",
    "visionLabel": "ind_art_13_feature"
  },
  {
    "placeId": "IND-ART-14",
    "name": "Tree of Life Stone Lattice Jali (Sidi Saiyyed Mosque) Scannable Feature",
    "nameHi": "સીદી સૈયદની જાળી (Sidi Saiyyed Ni Jali)",
    "nameGu": "સીદી સૈયદની જાળી (Sidi Saiyyed Ni Jali)",
    "description": "Intertwining branches of Kalpavriksha (banyan) tree and palm fronds, delicate swirling tendrils, geometric leaf lacework, completely perforated open-work allowing sunlight to cast lace shadows",
    "visionLabel": "ind_art_14_feature"
  },
  {
    "placeId": "IND-ART-15",
    "name": "Sabha Mandapa 52 Pillars (Sun Temple Modhera) Scannable Feature",
    "nameHi": "મોઢેરા સૂર્ય મંદિરના ૫૨ સ્તંભો (Modhera 52 Carved Pillars)",
    "nameGu": "મોઢેરા સૂર્ય મંદિરના ૫૨ સ્તંભો (Modhera 52 Carved Pillars)",
    "description": "Octagonal base transitioning to circular shaft, cusped torana arches springing from brackets, detailed bas-relief panels depicting episodes from Ramayana and Mahabharata, dancers with musical instruments, 12 manifestations of Sun God Surya",
    "visionLabel": "ind_art_15_feature"
  },
  {
    "placeId": "IND-ART-16",
    "name": "Sheshashayi Vishnu Wall Sculpture (Rani ki Vav) Scannable Feature",
    "nameHi": "શેષશાયી વિષ્ણુ શિલ્પ (Sheshashayi Vishnu at Rani ki Vav)",
    "nameGu": "શેષશાયી વિષ્ણુ શિલ્પ (Sheshashayi Vishnu at Rani ki Vav)",
    "description": "Lord Vishnu reclining horizontally on the coils of 1,000-headed serpent Sheshanaga, Goddess Lakshmi massaging his lotus feet, Brahma emerging on lotus from navel, Madhu-Kaitabha demons at base, serene meditative facial expression",
    "visionLabel": "ind_art_16_feature"
  },
  {
    "placeId": "IND-ART-17",
    "name": "Rust-Resistant Iron Pillar of Delhi Scannable Feature",
    "nameHi": "दिल्ली का लौह स्तम्भ (Iron Pillar of Chandragupta II)",
    "nameGu": "दिल्ली का लौह स्तम्भ (Iron Pillar of Chandragupta II)",
    "description": "Fluted bell capital, inverted lotus top, deep Sanskrit Brahmi 6-line poetic inscription praising King Chandra, protective iron fence, zero rust or corrosion despite 1,600 years of open-air exposure",
    "visionLabel": "ind_art_17_feature"
  },
  {
    "placeId": "IND-ART-18",
    "name": "Konark Sun Chariot Sundial Wheels Scannable Feature",
    "nameHi": "कोणार्क सूर्य रथ चक्र (Konark Sun Wheels)",
    "nameGu": "कोणार्क सूर्य रथ चक्र (Konark Sun Wheels)",
    "description": "Eight major spokes (representing 8 prahars / 3-hour divisions of 24 hours), eight minor spokes, intricate medallion carvings of courtly life and mythical creatures along rim, shadow cast by axle pin calculates exact time down to the minute",
    "visionLabel": "ind_art_18_feature"
  },
  {
    "placeId": "IND-ART-19",
    "name": "Monolithic Stone Chariot (Vittala Temple Hampi) Scannable Feature",
    "nameHi": "ಕಲ್ಲಿನ ರಥ (Hampi Stone Chariot)",
    "nameGu": "ಕಲ್ಲಿನ ರಥ (Hampi Stone Chariot)",
    "description": "Four gigantic carved stone wheels with concentric lotus hubs (formerly rotatable), two stone elephants guarding the chariot ladder, Garuda shrine sanctuary, floral and battle friezes along plinth, featured on Indian ₹50 banknote",
    "visionLabel": "ind_art_19_feature"
  },
  {
    "placeId": "IND-ART-20",
    "name": "Baan Stambh (Arrow Pillar of Somnath) Scannable Feature",
    "nameHi": "બાણ સ્તંભ સોમનાથ (Baan Stambh / Arrow Pillar)",
    "nameGu": "બાણ સ્તંભ સોમનાથ (Baan Stambh / Arrow Pillar)",
    "description": "Top mounted directional arrow pointing straight South across the Arabian Sea, Sanskrit inscription engraved: 'Aasamudraant Dakshin Dhrut Paryant, Abadhito Jyotir Marga' (From this point to the South Pole, there is no piece of land in the way)",
    "visionLabel": "ind_art_20_feature"
  },
  {
    "placeId": "IND-ART-21",
    "name": "Pashupati Seal (Proto-Shiva Intaglio) Scannable Feature",
    "nameHi": "पशुपति मुहर (Pashupati Seal)",
    "nameGu": "पशुपति मुहर (Pashupati Seal)",
    "description": "Three-faced horned yogic figure seated in mulabandhasana, flanked by elephant, tiger, rhinoceros, water buffalo, and two horned deer below the low stool, top Indus pictographic script",
    "visionLabel": "ind_art_21_feature"
  },
  {
    "placeId": "IND-ART-22",
    "name": "Holy Piprahwa Relics of Lord Gautama Buddha Scannable Feature",
    "nameHi": "भगवान बुद्ध के पवित्र धातु अवशेष (Buddha Holy Relics)",
    "nameGu": "भगवान बुद्ध के पवित्र धातु अवशेष (Buddha Holy Relics)",
    "description": "Carved steatite casket with Ashokan Brahmi inscription, gilded brass reliquary pavillion, authentic bone relics of Tathagata Buddha, semi-precious gem beads",
    "visionLabel": "ind_art_22_feature"
  },
  {
    "placeId": "IND-ART-23",
    "name": "Sword of Emperor Aurangzeb (Wootz Steel with Calligraphy) Scannable Feature",
    "nameHi": "औरंगज़ेब की तलवार (Aurangzeb's Sword)",
    "nameGu": "औरंगज़ेब की तलवार (Aurangzeb's Sword)",
    "description": "Curved single-edged wootz blade showing watered silk crystalline pattern, gold calligraphic Persian cartouches reading Quranic verses and Emperor Aurangzeb title, disc pommel hilt with gold damascened floral scrollwork",
    "visionLabel": "ind_art_23_feature"
  },
  {
    "placeId": "IND-ART-24",
    "name": "Shield of Emperor Akbar (Zodiac Gold Damascened Dhal) Scannable Feature",
    "nameHi": "अकबर की ढाल (Emperor Akbar's Shield)",
    "nameGu": "अकबर की ढाल (Emperor Akbar's Shield)",
    "description": "Convex circular steel disc, four central pierced brass bosses, 12 outer medallions depicting the twelve signs of the Zodiac (Rashis), central radiant Sun symbol, Persian inscription dating 1002 AH / 1594 CE",
    "visionLabel": "ind_art_24_feature"
  },
  {
    "placeId": "IND-ART-25",
    "name": "Dharmachakra Pravartana Buddha (Gupta 5th Century) Scannable Feature",
    "nameHi": "धर्मचक्र प्रवर्तन बुद्ध (Preaching Buddha of Sarnath)",
    "nameGu": "धर्मचक्र प्रवर्तन बुद्ध (Preaching Buddha of Sarnath)",
    "description": "Buddha seated in padmasana with hands in Dharmachakra Mudra (turning the wheel of law), translucent wet-drapery monastic robe, intricately carved circular prabhamandala halo with celestial gandharvas and floral foliage, pedestal below showing the 12-spoked wheel flanked by two deer and five disciples",
    "visionLabel": "ind_art_25_feature"
  },
  {
    "placeId": "IND-ART-26",
    "name": "Bharhut Stupa Torana Gateway & Railing Panels Scannable Feature",
    "nameHi": "भरहुत तोरण द्वार एवं वेदिका (Bharhut Gateway)",
    "nameGu": "भरहुत तोरण द्वार एवं वेदिका (Bharhut Gateway)",
    "description": "Architraves with spiral makara ends, yakshas and yakshis (Chulakoka Devata, Sirima Devata), Queen Maya's dream of the white elephant, Jataka tales carved in medallions, Ashokan Brahmi donor inscriptions",
    "visionLabel": "ind_art_26_feature"
  },
  {
    "placeId": "IND-ART-27",
    "name": "Gandhara Standing Buddha (Greco-Buddhist Masterpiece) Scannable Feature",
    "nameHi": "गांधार बुद्ध (Gandhara Standing Buddha)",
    "nameGu": "गांधार बुद्ध (Gandhara Standing Buddha)",
    "description": "Apollo-like facial features, heavy flowing classical Greek toga-like drapery folds (himation), wavy chignon ushnisha hairstyle, circular halo, urna between eyebrows, abhaya mudra right hand gesture",
    "visionLabel": "ind_art_27_feature"
  },
  {
    "placeId": "IND-ART-28",
    "name": "4,000-Year-Old Egyptian Ptolemaic Mummy Scannable Feature",
    "nameHi": "मिस्र की ममी (Egyptian Mummy of Kolkata)",
    "nameGu": "मिस्र की ममी (Egyptian Mummy of Kolkata)",
    "description": "Hieroglyphic painted wooden coffin sarcophagus, wrapped linen mummy body with exposed feet and resin coating, gilded funerary mask, Horus and Anubis protective deity vignettes",
    "visionLabel": "ind_art_28_feature"
  },
  {
    "placeId": "IND-ART-29",
    "name": "Double-Sided Wood Statue of Mephistopheles and Margaretta Scannable Feature",
    "nameHi": "मेफिस्टोफिल्स और मार्गरेट (Double Statue)",
    "nameGu": "मेफिस्टोफिल्स और मार्गरेट (Double Statue)",
    "description": "Front face depicting haughty Mephistopheles (Devil) with hooded cloak, feathered cap, goatee, and mocking smile; rear face depicting demure, devout Margaretta holding prayer book with downcast eyes; mirror placed behind to show both faces simultaneously",
    "visionLabel": "ind_art_29_feature"
  },
  {
    "placeId": "IND-ART-30",
    "name": "Salar Jung Musical Clock (Cook & Kelvey 19th-Century) Scannable Feature",
    "nameHi": "सालार जंग संगीतमय घड़ी (Musical Clock)",
    "nameGu": "सालार जंग संगीतमय घड़ी (Musical Clock)",
    "description": "Miniature bearded watchman automaton emerging from small doorway every hour on the hour to strike a gong corresponding to the hour count, secondary chime automaton, astronomical sun/moon dial",
    "visionLabel": "ind_art_30_feature"
  },
  {
    "placeId": "IND-ART-31",
    "name": "Sword of Chhatrapati Shivaji Maharaj (Historical Maratha Talwar) Scannable Feature",
    "nameHi": "छत्रपती शिवाजी महाराजांची तलवार (Shivaji Maharaj Talwar)",
    "nameGu": "छत्रपती शिवाजी महाराजांची तलवार (Shivaji Maharaj Talwar)",
    "description": "Curved single-edged wootz blade with spine reinforcement ridge, spiked pommel for close-quarters strike, velvet padded basket hilt, gold engraved Devanagari invocation to Goddess Bhavani",
    "visionLabel": "ind_art_31_feature"
  },
  {
    "placeId": "IND-ART-32",
    "name": "Ardhanarisvara Chola Bronze of Tiruvenkadu Scannable Feature",
    "nameHi": "அர்த்தநாரீஸ்வரர் வெண்கலச் சிற்பம் (Ardhanarisvara)",
    "nameGu": "அர்த்தநாரீஸ்வரர் வெண்கலச் சிற்பம் (Ardhanarisvara)",
    "description": "Flawless vertical division: Right half male Shiva (trishula, tiger skin, jaṭā-mukuṭa, flat chest), Left half female Parvati (rounded breast, silk dhoti, karanda-mukuta, armlet, graceful hip sway), leaning on sacred bull Nandi",
    "visionLabel": "ind_art_32_feature"
  },
  {
    "placeId": "IND-ART-33",
    "name": "Akota Jain Bronzes Hoard (Vadodara) Scannable Feature",
    "nameHi": "અકોટા જૈન કાંસ્ય શિલ્પો (Akota Bronzes)",
    "nameGu": "અકોટા જૈન કાંસ્ય શિલ્પો (Akota Bronzes)",
    "description": "Jivantasvami (Mahavira as crowned prince) standing in kayotsarga posture with princely mukuta, silver inlaid eyes, lotus pedestal with lion thrones, Rishabhanatha seated in dhyanamudra with flowing hair locks",
    "visionLabel": "ind_art_33_feature"
  },
  {
    "placeId": "IND-ART-34",
    "name": "17th-Century Shrinathji Nathdwara Pichhwai (Calico Museum) Scannable Feature",
    "nameHi": "શ્રીનાથજી હવેલી પિછવાઈ (Shrinathji Pichhwai on Silk)",
    "nameGu": "શ્રીનાથજી હવેલી પિછવાઈ (Shrinathji Pichhwai on Silk)",
    "description": "Central depiction of Shrinathji with raised left hand lifting Mount Govardhan, lotus eyes, adorned with pearl necklaces and peacock feather crown, surrounded by 24 festival panels, playful cows, Yamuna river with lotus blooms at base",
    "visionLabel": "ind_art_34_feature"
  },
  {
    "placeId": "IND-ART-35",
    "name": "1st-Century Andhau Inscriptions of Rudradaman (Kutch Museum) Scannable Feature",
    "nameHi": "અંધૌ શિલાલેખ (Andhau Stone Inscription of Kutch)",
    "nameGu": "અંધૌ શિલાલેખ (Andhau Stone Inscription of Kutch)",
    "description": "Saka Brahmi script deeply chiselled into four vertical registers, dated in Saka era year 52 (130 CE), memorial lashti stone pillar commemorating fallen warriors and family ancestors",
    "visionLabel": "ind_art_35_feature"
  },
  {
    "placeId": "IND-ART-36",
    "name": "Airavat Sacred Wooden Elephant (Kutch Museum) Scannable Feature",
    "nameHi": "ઐરાવત હાથી (Kutch Royal Airavat Wood Carving)",
    "nameGu": "ઐરાવત હાથી (Kutch Royal Airavat Wood Carving)",
    "description": "Seven-trunked celestial elephant Airavat (mount of Indra), detailed lotus howdah seat on back, floral polychrome hand-painted blanket, floral motifs in red, gold, and green lacquer, tusks tipped with brass ferules",
    "visionLabel": "ind_art_36_feature"
  },
  {
    "placeId": "IND-ART-37",
    "name": "Rangpur Harappan Terracotta Toy Cart & Painted Pottery Scannable Feature",
    "nameHi": "રંગપુર સિંધુ ખીણના વાસણો (Rangpur Harappan Pottery)",
    "nameGu": "રંગપુર સિંધુ ખીણના વાસણો (Rangpur Harappan Pottery)",
    "description": "Perforated cylindrical strainer jars, dish-on-stand with painted peacocks and pipal leaves, solid wheel terracotta bullock cart with animal yokes, lustrous red burnished slip",
    "visionLabel": "ind_art_37_feature"
  },
  {
    "placeId": "IND-ART-38",
    "name": "Ravana Shaking Mount Kailash Bas-Relief (Ellora Cave 16) Scannable Feature",
    "nameHi": "रावणानुग्रह मूर्ति (Ravana Shaking Mount Kailash)",
    "nameGu": "रावणानुग्रह मूर्ति (Ravana Shaking Mount Kailash)",
    "description": "Multi-armed demon king Ravana trapped beneath Mount Kailash, straining muscles and shaking the mountain foundation with his 20 arms; above, serene Lord Shiva calmly pressing his big toe down to pin Ravana; Goddess Parvati clinging to Shiva in fright; fleeing ganas and celestial spirits",
    "visionLabel": "ind_art_38_feature"
  },
  {
    "placeId": "IND-ART-39",
    "name": "Padmapani Bodhisattva Fresco (Ajanta Cave 1) Scannable Feature",
    "nameHi": "पद्मपाणि बोधिसत्व भित्तिचित्र (Bodhisattva Padmapani)",
    "nameGu": "पद्मपाणि बोधिसत्व भित्तिचित्र (Bodhisattva Padmapani)",
    "description": "Bodhisattva Avalokiteshvara holding a blue lotus (utpala) in his right hand, gentle downward compassionate gaze, triple-bend tribhanga stance, jeweled crown with sapphires, pearl necklace around neck, Princess and attendants in background",
    "visionLabel": "ind_art_39_feature"
  },
  {
    "placeId": "IND-ART-40",
    "name": "Krishna's Butterball (Mahabalipuram Balancing Boulder) Scannable Feature",
    "nameHi": "கிருஷ்ண வெண்ணெய் பந்து (Krishna's Butterball)",
    "nameGu": "கிருஷ்ண வெண்ணெய் பந்து (Krishna's Butterball)",
    "description": "Spherical gigantic granite rock perched on a steep 45-degree smooth rock slope, contact point with the slope is less than 2 feet wide, defies gravity, half-cut appearance on rear side, local children sliding on the rock slope below",
    "visionLabel": "ind_art_40_feature"
  },
  {
    "placeId": "IND-ART-41",
    "name": "Fateh Darwaza Acoustic Clapping Dome (Golconda Fort) Scannable Feature",
    "nameHi": "फतेह दरवाजा (Fateh Darwaza Acoustic Arch)",
    "nameGu": "फतेह दरवाजा (Fateh Darwaza Acoustic Arch)",
    "description": "Pointed parabolic acoustic archway, teak doors studded with 13-inch iron elephant-deterrent spikes, central resonance point marked on stone floor where a hand clap echoes 1 km uphill to the Bala Hissar royal pavilion",
    "visionLabel": "ind_art_41_feature"
  },
  {
    "placeId": "IND-ART-42",
    "name": "Neelam and Manek Ottoman Cannons (Uparkot Fort) Scannable Feature",
    "nameHi": "નીલમ અને માણેક તોપ (Neelam & Manek Top)",
    "nameGu": "નીલમ અને માણેક તોપ (Neelam & Manek Top)",
    "description": "Deep blue-green oxidized bronze patina on Neelam cannon, Arabic calligraphic inscription honoring Sultan Suleiman the Magnificent, cast by armorer Ali bin Hamza in Egypt in 1531 CE, heavy trunnions and ring-lifting dolphins",
    "visionLabel": "ind_art_42_feature"
  },
  {
    "placeId": "IND-ART-43",
    "name": "Navagraha Frieze & Ami Khumbh Reservoir (Adalaj Stepwell) Scannable Feature",
    "nameHi": "નવગ્રહ શિલ્પ અને અમી કુંભ (Adalaj Navagraha & Water Pot)",
    "nameGu": "નવગ્રહ શિલ્પ અને અમી કુંભ (Adalaj Navagraha & Water Pot)",
    "description": "Horizontal frieze of nine planetary celestial deities (Navagrahas: Surya, Chandra, Mangala, Budha, Brihaspati, Shukra, Shani, Rahu, Ketu), Ami Khumbh (pot of the nectar of immortality), Kalpavriksha motifs, octagonal shaft letting soft blue skylight down to water level",
    "visionLabel": "ind_art_43_feature"
  }
];

export async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('  Clearing existing data...');
  try {
    await prisma.itineraryItem?.deleteMany();
    await prisma.itinerary?.deleteMany();
    await prisma.favorite?.deleteMany();
    await prisma.artifact?.deleteMany();
    await prisma.source?.deleteMany();
    await prisma.heritageRecord?.deleteMany();
    await prisma.preference?.deleteMany();
    await prisma.user?.deleteMany();
    await prisma.place?.deleteMany();
  } catch (e) {
    console.warn('  Note: cleanup warning (in-memory mode bypasses raw delete)');
  }

  // Seed places
  console.log(`  🏛️  Seeding ${PLACES_DATA.length} heritage places...`);
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
          shortStoryHi: (record as any).shortStoryHi || null,
          shortStoryGu: (record as any).shortStoryGu || null,
          history: record.history,
          historyHi: (record as any).historyHi || null,
          historyGu: (record as any).historyGu || null,
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

export * from './reviews';
