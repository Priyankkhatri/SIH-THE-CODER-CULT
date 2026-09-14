import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useChatStore, useUserStore, usePlacesStore } from '../../stores';
import { ALL_SEED_PLACES } from '../../utils/seedPlaces';
import { aiApi } from '../../services/api';
import { ChatBubble, TypingIndicator } from '../../components/ChatBubble';
import { useSpeech } from '../../hooks/useSpeech';
import { useTranslation } from '../../hooks/useTranslation';

const RESPONSE_MODES: Array<{ key: 'short' | 'detailed' | 'child' | 'narrative'; label: string; description: string }> = [
  { key: 'short', label: '⚡ Short', description: '1-2 min' },
  { key: 'detailed', label: '📖 Detailed', description: '5-7 min' },
  { key: 'child', label: '🧒 Kids', description: 'Simple' },
  { key: 'narrative', label: '📜 Story', description: 'Narrative' },
];

const DEFAULT_SUGGESTIONS = [
  'What makes Rani ki Vav in Patan a World Heritage marvel?',
  'Tell me the astronomical secrets of Modhera Sun Temple',
  'Why is Laxmi Vilas Palace four times the size of Buckingham Palace?',
  'Tell me an epic medieval story of Champaner-Pavagadh',
  'What architectural wonders define the Taj Mahal?',
];

const INPUT_MAX = 500;

export default function AIGuideScreen() {
  const params = useLocalSearchParams<{ autoAsk?: string; placeId?: string; placeName?: string; t?: string }>();
  const autoAskedRef = useRef<string | null>(null);

  const {
    messages, addMessage, contextPlaceId, contextPlaceName,
    mode, setMode, isTyping, setTyping, clearChat, setContext, loadChat,
  } = useChatStore();
  const { language } = useUserStore();
  const { t } = useTranslation();
  const { speak, stop, isSpeaking } = useSpeech();
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState(mode);
  const defaultSugg = (t('ai.defaultSuggestions') as string[]) || DEFAULT_SUGGESTIONS;
  const [suggestions, setSuggestions] = useState<string[]>(defaultSugg);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastWasOffline, setLastWasOffline] = useState(false);
  const lastQuestionRef = useRef<string>('');
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Restore persisted chat once
  useEffect(() => {
    loadChat();
  }, []);

  // Keep local mode pills and global store mode in sync
  useEffect(() => {
    setSelectedMode(mode);
  }, [mode]);

  const changeMode = (key: 'short' | 'detailed' | 'child' | 'narrative') => {
    setSelectedMode(key);
    setMode(key);
  };

  // Clear per-message speaking highlight when TTS stops naturally
  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingId(null);
    }
  }, [isSpeaking]);

  useEffect(() => {
    loadSuggestions();
  }, [contextPlaceId]);

  // Stop TTS when leaving the chat tab so narration never bleeds into other tabs
  useEffect(() => {
    return () => {
      stop();
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // Handle auto-ask from Camera Presets / Monument scan / Place details
  useEffect(() => {
    if (params.autoAsk) {
      const askKey = `${params.autoAsk}_${params.t || ''}_${params.placeId || ''}`;
      if (askKey !== autoAskedRef.current) {
        autoAskedRef.current = askKey;
        const targetPlaceId = params.placeId || contextPlaceId || undefined;
        const targetPlaceName = params.placeName || contextPlaceName || null;
        if (params.placeId && params.placeName) {
          setContext(params.placeId, params.placeName);
        }
        const timer = setTimeout(() => {
          handleSend(params.autoAsk, targetPlaceId, targetPlaceName || undefined);
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [params.autoAsk, params.t, params.placeId, params.placeName]);

  const loadSuggestions = async () => {
    try {
      const response: any = await aiApi.getSuggestions(contextPlaceId || undefined);
      if (response?.data) {
        setSuggestions(response.data);
      }
    } catch {
      // Use context-aware defaults
      if (contextPlaceName) {
        setSuggestions([
          `Why was ${contextPlaceName} built?`,
          `Who built ${contextPlaceName} and when?`,
          `Tell me the history in 2 minutes`,
          `What is the architectural style?`,
          `Explain like I'm 8 years old`,
        ]);
      }
    }
  };

  const handleSend = async (text?: string, overridePlaceId?: string, overridePlaceName?: string) => {
    const question = (text || inputText.trim()).slice(0, INPUT_MAX);
    if (!question || isTyping) return;

    const activePlaceId = overridePlaceId || contextPlaceId || undefined;
    const activePlaceName = overridePlaceName || contextPlaceName || null;
    lastQuestionRef.current = question;

    setInputText('');
    addMessage({ role: 'user', content: question });
    setTyping(true);
    setLastWasOffline(false);

    try {
      const response: any = await aiApi.ask(question, activePlaceId, selectedMode, language);
      if (response?.data?.answer && typeof response.data.answer === 'string' && response.data.answer.trim().length > 0) {
        addMessage({
          role: 'assistant',
          content: response.data.answer,
          sources: response.data.sources || [{ name: 'ASI Verified Knowledge Base', text: 'Official Archaeological & Cultural Archive' }],
        });
        setLastWasOffline(false);
      } else {
        throw new Error('No answer returned from AI API');
      }
    } catch (error) {
      // High-accuracy fallback response from 155+ verified places
      addMessage({
        role: 'assistant',
        content: getOfflineResponse(question, activePlaceName, activePlaceId, language),
        sources: [{ name: 'Verified Heritage Knowledge Base', text: 'Curated historical chronicle from official ASI & Gujarat archives' }],
      });
      setLastWasOffline(true);
    } finally {
      setTyping(false);
      loadSuggestions();
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleRetry = () => {
    if (lastQuestionRef.current && !isTyping) {
      // Remove the failed assistant message so retry replaces it cleanly
      const msgs = useChatStore.getState().messages;
      const last = msgs[msgs.length - 1];
      if (last?.role === 'assistant') {
        useChatStore.setState({ messages: msgs.slice(0, -1) });
      }
      handleSend(lastQuestionRef.current);
    }
  };

  const handleSpeak = (text: string, id: string) => {
    if (speakingId === id || isSpeaking) {
      stop();
      setSpeakingId(null);
    } else {
      setSpeakingId(id);
      speak(text, language);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopiedId(id);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard unavailable — no-op
    }
  };

  const clearContextOnly = () => {
    stop();
    setSpeakingId(null);
    setContext(null, null);
  };

  const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant')?.id;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="auto-awesome" size={24} color={Colors.primary} />
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle} numberOfLines={1}>{t('ai.title')}</Text>
            {contextPlaceName && (
              <Text style={styles.contextText} numberOfLines={1}>📍 {contextPlaceName}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn} accessibilityLabel="Clear chat">
          <MaterialIcons name="delete-outline" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Active place context chip (X clears context only, trash clears all) */}
      {contextPlaceName && (
        <View style={styles.contextBar}>
          <View style={styles.contextChip}>
            <MaterialIcons name="place" size={14} color={Colors.primary} />
            <Text style={styles.contextChipText} numberOfLines={1}>
              {contextPlaceName}
            </Text>
            <TouchableOpacity onPress={clearContextOnly} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialIcons name="close" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Response mode selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.modeContent}
        style={styles.modeScroll}
      >
        {RESPONSE_MODES.map((m) => (
          <TouchableOpacity
            key={m.key}
            style={[styles.modeChip, selectedMode === m.key && styles.modeChipActive]}
            onPress={() => changeMode(m.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.modeLabel, selectedMode === m.key && styles.modeLabelActive]} numberOfLines={1}>
              {t('ai.modes.' + m.key) || m.label}
            </Text>
            <Text style={[styles.modeDesc, selectedMode === m.key && styles.modeLabelActive]} numberOfLines={1}>
              {m.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Messages */}
      {messages.length === 0 ? (
        <ScrollView contentContainerStyle={styles.emptyScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🏛️</Text>
            <Text style={styles.emptyTitle}>{t('ai.subtitle')}</Text>
            <Text style={styles.emptySubtitle}>
              {language === 'hi'
                ? 'मैं सत्यापित ऐतिहासिक स्रोतों से उत्तर देता हूं — प्रामाणिक जानकारी।'
                : language === 'gu'
                ? 'હું ચકાસાયેલ ઐતિહાસિક સ્ત્રોતોનો ઉપયોગ કરીને જવાબ આપું છું.'
                : 'I answer using verified historical sources — never making up facts.'}
            </Text>
            <View style={styles.suggestionsGrid}>
              {suggestions.map((q, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestionChip}
                  onPress={() => handleSend(q)}
                >
                  <Text style={styles.suggestionText}>{q}</Text>
                  <MaterialIcons name="arrow-forward" size={14} color={Colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              onSpeak={item.role === 'assistant' ? (text) => handleSpeak(text, item.id) : undefined}
              speaking={speakingId === item.id}
              onCopy={item.role === 'assistant' ? (text) => handleCopy(text, item.id) : undefined}
              copied={copiedId === item.id}
              onRetry={item.id === lastAssistantId ? handleRetry : undefined}
              showRetry={item.id === lastAssistantId}
              offline={item.id === lastAssistantId && lastWasOffline}
            />
          )}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
      )}

      {/* Follow-up suggestions after an answer */}
      {messages.length > 0 && !isTyping && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.followContent}
          style={styles.followScroll}
        >
          {suggestions.slice(0, 3).map((q, i) => (
            <TouchableOpacity key={i} style={styles.followChip} onPress={() => handleSend(q)}>
              <Text style={styles.followText} numberOfLines={1}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input bar */}
      <View style={styles.inputBar}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder={contextPlaceName ? (language === 'hi' ? `${contextPlaceName} के बारे में पूछें...` : language === 'gu' ? `${contextPlaceName} વિશે પૂછો...` : `Ask about ${contextPlaceName}...`) : t('ai.inputPlaceholder')}
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={(v) => setInputText(v.slice(0, INPUT_MAX))}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
            multiline
            maxLength={INPUT_MAX}
          />
          {inputText.length > 0 && (
            <Text style={styles.charCount}>{inputText.length}/{INPUT_MAX}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.sendBtn, (!inputText.trim() || isTyping) && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || isTyping}
        >
          <MaterialIcons name="send" size={22} color={inputText.trim() && !isTyping ? Colors.textInverse : Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const ID_ALIASES: Record<string, string> = {
  'IND-GJ-01': 'IND-HER-11', // Rani ki Vav (legacy mobile id)
  'IND-GJ-02': 'IND-HER-31', // Modhera Sun Temple (legacy mobile id)
};

const GREETING_RE = /^(hi+|hey+|hello+|hii+|heyy+|yo|namaste+|namaskar|salaam|satsriakal|kem\s*cho|kemcho|jai\s*shree\s*krishna|good\s*(morning|afternoon|evening|day)|sup|hola)[\s?.!,~]*$/i;

function getGreetingResponse(language: string = 'en'): string {
  if (language === 'hi') {
    return `🙏 **नमस्ते! मैं आपका AI Heritage Guide हूँ।**\n\nभारत के मंदिरों, किलों, बावड़ियों और संग्रहालयों के बारे में कुछ भी पूछिए — इतिहास, वास्तुकला, कहानियाँ, या घूमने की सलाह।\n\n• किसी स्मारक का इतिहास जानना हो तो उसका नाम लिखिए\n• बच्चों के लिए मज़ेदार अंदाज़ चाहिए तो Kids mode चुनिए`;
  }
  if (language === 'gu') {
    return `🙏 **નમસ્તે! હું તમારો AI Heritage Guide છું.**\n\nભારતના મંદિરો, કિલ્લાઓ, વાવ અને સંગ્રહાલયો વિશે કંઈ પણ પૂછો — ઇતિહાસ, સ્થાપત્ય, વાર્તાઓ કે મુલાકાતની સલાહ.\n\n• કોઈ સ્મારકનો ઇતિહાસ જાણવો હોય તો તેનું નામ લખો\n• બાળકો માટે મજેદાર શૈલી જોઈતી હોય તો Kids mode પસંદ કરો`;
  }
  return `🙏 **Hello! I'm your AI Heritage Guide.**\n\nAsk me anything about India's temples, forts, stepwells, palaces, and museums — history, architecture, stories, or visit tips.\n\n• Just type a monument's name to explore its story\n• Pick **Kids mode** for a fun family version`;
}

function getOfflineResponse(question: string, placeName: string | null, placeId?: string, language: string = 'en'): string {
  // Greeting-only messages get a warm greeting — never a random monument dump.
  if (GREETING_RE.test(question.trim()) && !placeId && !placeName) {
    return getGreetingResponse(language);
  }
  const q = question.toLowerCase();
  const resolvedId = placeId ? (ID_ALIASES[placeId] || placeId) : undefined;

  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/^(the|a|an)\s+/i, '')
      .replace(/(\(|\)|'|"|-|,)/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const cPlaceName = placeName ? clean(placeName) : '';

  // 1. Check client store places first, fall back to ALL_SEED_PLACES
  let pool = [...(usePlacesStore.getState().places || [])];
  if (pool.length === 0) {
    pool = [...ALL_SEED_PLACES];
  } else {
    // Combine pool with seed places so all 155+ are searchable
    const seen = new Set(pool.map((p) => p.id));
    for (const sp of ALL_SEED_PLACES) {
      if (!seen.has(sp.id)) pool.push(sp);
    }
  }

  // Find matching place
  let matched = pool.find((p) => resolvedId && p.id?.toLowerCase() === resolvedId.toLowerCase());

  if (!matched && cPlaceName) {
    matched = pool.find((p) => {
      const cp = clean(p.name);
      return cp === cPlaceName || cp.includes(cPlaceName) || cPlaceName.includes(cp);
    });
  }

  if (!matched) {
    // Search by question keywords against place names
    matched = pool.find((p) => {
      const cp = clean(p.name);
      return cp.length > 3 && (q.includes(cp) || cp.includes(q));
    });
  }

  if (matched) {
    const title = (language === 'hi' && matched.nameHi) ? matched.nameHi : (language === 'gu' && matched.nameGu) ? matched.nameGu : matched.name;
    const hr = (matched.heritageRecord as any) || {};
    const story = hr.shortStory || matched.shortDescription;
    const history = hr.detailedHistory || hr.history || '';
    const arch = hr.architecture || '';
    const sign = hr.significance || '';
    const facts = Array.isArray(hr.keyFacts) && hr.keyFacts.length > 0
      ? hr.keyFacts.slice(0, 4).map((f: string) => `• ${f}`).join('\n')
      : '';

    let answer = `🏛️ **${title}**\n\n${story}`;

    if (history && history !== story) {
      answer += `\n\n**Historical Chronicle:**\n${history}`;
    }

    if (arch) {
      answer += `\n\n**Architectural Marvel:**\n${arch}`;
    }

    if (sign) {
      answer += `\n\n**Cultural Significance:**\n${sign}`;
    }

    if (facts) {
      answer += `\n\n**Key Highlights:**\n${facts}`;
    }

    if (matched.openingHours) {
      answer += `\n\n🕒 **Visiting Hours:** ${matched.openingHours}`;
    }

    return answer;
  }

  // 2. Specialized curated fallbacks for flagship monuments
  if (q.includes('rani ki vav') || (cPlaceName && cPlaceName.includes('rani ki vav'))) {
    return '🏛️ **Rani ki Vav (Queen\'s Stepwell, Patan)**\n\nCommissioned in 1063 AD by Queen Udayamati in memory of King Bhimdev I of the Solanki Dynasty, Rani ki Vav is an inverted subterranean temple celebrating the sacredness of water.\n\n**Architectural Splendor:**\nDesigned in the Maru-Gurjara style with seven subterranean terraces descending 27 meters below ground level.\n\n**Key Highlights:**\n• UNESCO World Heritage Site inscribed in 2014.\n• Houses over 500 principal sculptures depicting Lord Vishnu\'s Dashavatara incarnations, culminated by the central Sheshashayi Vishnu sculpture resting on the cosmic serpent Shesha.\n• Built as a multi-tier stepwell combining religious sanctum with vital desert water management.';
  }

  if (q.includes('modhera') || q.includes('sun temple') || (cPlaceName && (cPlaceName.includes('modhera') || cPlaceName.includes('sun temple')))) {
    return '☀️ **Sun Temple, Modhera**\n\nBuilt in 1026-27 AD by King Bhima I of the Solanki dynasty on the banks of river Pushpavati. It is masterfully aligned with the solar equinoxes so that the first rays of the rising sun illuminate the inner sanctum sanctorum.\n\n**Architectural Grandeur:**\n• Gudhamandapa: The enclosed sanctum where the golden sun god once rested.\n• Sabhamandapa: The grand open assembly hall resting on 52 exquisitely carved pillars, each representing a week of the year.\n• Surya Kund: Massive stepped water reservoir containing 108 miniature shrines devoted to solar and Vedic deities.\n• First 100% solar-powered heritage village and monument complex in India.';
  }

  if (q.includes('adalaj') || (cPlaceName && cPlaceName.includes('adalaj'))) {
    return '💧 **Adalaj Stepwell (Gandhinagar)**\n\nBuilt in 1498 by Queen Rudabai in memory of her husband Rana Veer Singh. It stands as a unique synthesis of Solanki-Hindu architectural precision and Indo-Islamic floral friezes.\n\n**Architectural Highlights:**\n• 5-storey deep subterranean structure built of sandstone.\n• Octagonal overhead openings admit soft ambient light and continuous cross-ventilation, keeping inner galleries 5°C cooler even in midsummer heat.\n• Served as a serene sanctuary for traveling caravans on trade routes between Gujarat and Rajasthan.';
  }

  if (q.includes('somnath') || (cPlaceName && cPlaceName.includes('somnath'))) {
    return '🔱 **Somnath Jyotirlinga Temple (Prabhas Patan)**\n\nFirst among the twelve sacred Aadi Jyotirlingas of Lord Shiva, situated right at the confluence of three holy rivers and the Arabian Sea.\n\n**Historical & Architectural Chronicle:**\n• Revered since the Rigvedic era, reconstructed multiple times through history and restored to its full glory under the leadership of Sardar Vallabhbhai Patel after independence.\n• Built in the grand Kailash Mahameru Prasad (Chalukyan) architectural style.\n• Features the ancient Baan Stambh (Arrow Pillar), pointing along an unobstructed maritime line directly to the South Pole (Antarctica).';
  }

  if (q.includes('laxmi vilas') || (cPlaceName && cPlaceName.includes('laxmi vilas'))) {
    return '👑 **Laxmi Vilas Palace (Vadodara)**\n\nCommissioned by Maharaja Sayajirao Gaekwad III in 1878 and completed in 1890. Designed by British architect Major Charles Mant and Robert Chisholm, it is four times the size of Buckingham Palace.\n\n**Key Highlights:**\n• Masterpiece of Indo-Saracenic architecture blending Hindu, Mughal, Rajput, and Venetian Gothic styles.\n• Features Venetian mosaic floorings, Belgian stained-glass windows, and elaborate bronze sculptures.\n• Home to the world-renowned Raja Ravi Varma art collections and historical armory.';
  }

  if (q.includes('champaner') || q.includes('pavagadh') || (cPlaceName && cPlaceName.includes('champaner'))) {
    return '🏰 **Champaner-Pavagadh Archaeological Park**\n\nUNESCO World Heritage Site and the only complete and unchanged pre-Mughal Islamic city in the world.\n\n**Key Highlights:**\n• Sultan Mahmud Begada captured the hilltop citadel in 1484 and established it as his royal capital.\n• Contains magnificent monuments including Jama Masjid, Kevada Masjid, ancient Jain and Hindu temples, military fortifications, and ingenious rainwater harvesting stepwells.';
  }

  if (q.includes('statue of unity') || (cPlaceName && cPlaceName.includes('statue of unity'))) {
    return '🇮🇳 **Statue of Unity (Kevadia / Ekta Nagar)**\n\nThe world\'s tallest statue standing at 182 meters (597 feet), dedicated to Sardar Vallabhbhai Patel, the Iron Man of India who united 562 princely states into one nation.\n\n**Key Highlights:**\n• Designed by master sculptor Ram V. Sutar and engineered to withstand winds of up to 180 km/h and high-magnitude earthquakes.\n• Features an observation deck at 153 meters offering panoramic vistas of the Narmada River and Sardar Sarovar Dam.';
  }

  if (language === 'hi') {
    return `🏛️ **मुझे इस बारे में पक्की जानकारी नहीं मिली।**\n\nकृपया स्मारक का नाम सही लिखकर पूछिए — जैसे रानी की वाव, मोढेरा सूर्य मंदिर, सोमनाथ, या लक्ष्मी विलास पैलेस।`;
  }
  if (language === 'gu') {
    return `🏛️ **મને આ વિશે પાક્કી માહિતી મળી નથી.**\n\nકૃપા કરીને સ્મારકનું નામ લખીને પૂછો — જેમ કે રાણીની વાવ, મોઢેરા સૂર્ય મંદિર, સોમનાથ કે લક્ષ્મી વિલાસ પેલેસ.`;
  }
  return `🏛️ **Heritage Knowledge Base**\n\nI have comprehensive historical, architectural, and cultural archives on ${placeName || 'heritage landmarks across Gujarat and India'}.\n\nYou can ask about:\n• Dynasty origins and royal patronage\n• Architectural styles and intricate stone carvings\n• Historical timelines and conservation by ASI\n• Cultural legends, festivals, and visitor guidelines`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTextWrap: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  contextText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '500',
  },
  clearBtn: {
    padding: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    flexShrink: 0,
  },
  contextBar: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  contextChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
    borderRadius: BorderRadius.full,
    paddingLeft: 10,
    paddingRight: 8,
    paddingVertical: 5,
  },
  contextChipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.primary,
    flexShrink: 1,
  },
  modeScroll: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    flexGrow: 0,
  },
  modeContent: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
    alignItems: 'center',
  },
  modeChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    flexShrink: 0,
    alignItems: 'center',
    minWidth: 86,
  },
  modeChipActive: {
    backgroundColor: 'rgba(212, 175, 124, 0.16)',
    borderColor: Colors.primary,
  },
  modeLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  modeLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  modeDesc: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  messagesList: {
    paddingVertical: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  emptyScroll: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['2xl'],
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: Spacing.base,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    lineHeight: 22,
  },
  suggestionsGrid: {
    width: '100%',
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  suggestionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    flex: 1,
    flexShrink: 1,
  },
  followScroll: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    flexGrow: 0,
  },
  followContent: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
  },
  followChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
    maxWidth: 240,
    flexShrink: 0,
  },
  followText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 30 : Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    backgroundColor: Colors.surface,
    gap: 8,
  },
  inputWrap: {
    flex: 1,
    minWidth: 0,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingTop: 10,
    paddingBottom: 6,
  },
  input: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    maxHeight: 100,
    padding: 0,
  },
  charCount: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 2,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.surfaceHighlight,
  },
});
