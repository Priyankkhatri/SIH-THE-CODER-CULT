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
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useChatStore, useUserStore } from '../../stores';
import { aiApi } from '../../services/api';
import { ChatBubble, TypingIndicator } from '../../components/ChatBubble';
import { useSpeech } from '../../hooks/useSpeech';

const RESPONSE_MODES = [
  { key: 'short', label: '⚡ Short', description: '1-2 min' },
  { key: 'detailed', label: '📖 Detailed', description: '5-7 min' },
  { key: 'child', label: '🧒 Kids', description: 'Simple' },
  { key: 'narrative', label: '📜 Story', description: 'Narrative' },
];

const DEFAULT_SUGGESTIONS = [
  'What are the top heritage sites in Vadodara?',
  'Tell me about the Gaekwad dynasty',
  'History of Champaner-Pavagadh',
  'Explain Gujarat architecture styles',
];

export default function AIGuideScreen() {
  const { messages, addMessage, contextPlaceId, contextPlaceName, isTyping, setTyping, clearChat } = useChatStore();
  const { language } = useUserStore();
  const { speak, stop, isSpeaking } = useSpeech();
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState('short');
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadSuggestions();
  }, [contextPlaceId]);

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

  const handleSend = async (text?: string) => {
    const question = text || inputText.trim();
    if (!question) return;

    setInputText('');
    addMessage({ role: 'user', content: question });
    setTyping(true);

    try {
      const response: any = await aiApi.ask(question, contextPlaceId || undefined, selectedMode, language);
      if (response?.data) {
        addMessage({
          role: 'assistant',
          content: response.data.answer,
          sources: response.data.sources,
        });
      }
    } catch (error) {
      // Fallback response
      addMessage({
        role: 'assistant',
        content: getOfflineResponse(question, contextPlaceName),
        sources: [{ name: 'Local Heritage Database', text: 'Response generated from cached data' }],
      });
    } finally {
      setTyping(false);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text, language);
    }
  };

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
          <View>
            <Text style={styles.headerTitle}>AI Heritage Guide</Text>
            {contextPlaceName && (
              <Text style={styles.contextText}>📍 {contextPlaceName}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <MaterialIcons name="refresh" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Response mode selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modeScroll}>
        <View style={styles.modeRow}>
          {RESPONSE_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.key}
              style={[styles.modeChip, selectedMode === mode.key && styles.modeChipActive]}
              onPress={() => setSelectedMode(mode.key)}
            >
              <Text style={[styles.modeLabel, selectedMode === mode.key && styles.modeLabelActive]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Messages */}
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🏛️</Text>
          <Text style={styles.emptyTitle}>Ask me anything about heritage</Text>
          <Text style={styles.emptySubtitle}>
            I answer using verified historical sources — never making up facts.
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
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              onSpeak={item.role === 'assistant' ? handleSpeak : undefined}
              isSpeaking={isSpeaking}
            />
          )}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
      )}

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder={contextPlaceName ? `Ask about ${contextPlaceName}...` : 'Ask about heritage sites...'}
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim()}
        >
          <MaterialIcons name="send" size={22} color={inputText.trim() ? Colors.textInverse : Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function getOfflineResponse(question: string, placeName: string | null): string {
  const q = question.toLowerCase();
  if (q.includes('laxmi vilas') || (placeName && placeName.includes('Laxmi'))) {
    return 'Laxmi Vilas Palace was commissioned by Maharaja Sayajirao III in 1878 and completed in 1890. Designed by British architect Major Charles Mant, it covers 500 acres — four times the size of Buckingham Palace. The palace is a masterpiece of Indo-Saracenic architecture blending Hindu, Gothic, and Mughal elements.';
  }
  if (q.includes('champaner') || q.includes('pavagadh')) {
    return 'Champaner-Pavagadh Archaeological Park is a UNESCO World Heritage Site. Sultan Mahmud Begada captured it in 1484 and transformed it into the capital of the Gujarat Sultanate. It is the only complete and unchanged pre-Mughal Islamic city in the world.';
  }
  if (q.includes('gaekwad') || q.includes('dynasty')) {
    return 'The Gaekwad dynasty ruled Baroda (Vadodara) from the early 18th century until Indian independence. Maharaja Sayajirao III (1875-1939) was the most notable ruler, who introduced compulsory education, built libraries, museums, and promoted industrialization.';
  }
  return 'I have information about heritage sites in Vadodara, Gujarat. Please connect to the backend server for AI-powered detailed answers. Try asking about Laxmi Vilas Palace, Champaner-Pavagadh, or the Gaekwad dynasty!';
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
    paddingTop: 56,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
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
  },
  modeScroll: {
    maxHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
  },
  modeChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeChipActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  modeLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  modeLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  messagesList: {
    paddingVertical: Spacing.base,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: Spacing.base,
  },
  emptyTitle: {
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
  },
  suggestionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    flex: 1,
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
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.surfaceHighlight,
  },
});
