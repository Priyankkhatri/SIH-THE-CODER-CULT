import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import type { ChatMessage } from '../stores';

interface ChatBubbleProps {
  message: ChatMessage;
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
}

export function ChatBubble({ message, onSpeak, isSpeaking }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {!isUser && (
        <View style={styles.avatarWrap}>
          <MaterialIcons name="auto-awesome" size={18} color={Colors.primary} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.messageText, isUser && styles.userText]}>{message.content}</Text>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <View style={styles.sourcesWrap}>
            <Text style={styles.sourcesLabel}>📚 Sources</Text>
            {message.sources.map((source, idx) => (
              <View key={idx} style={styles.sourceItem}>
                <MaterialIcons name="verified" size={12} color={Colors.success} />
                <Text style={styles.sourceText} numberOfLines={2}>
                  {source.name}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Actions */}
        {!isUser && (
          <View style={styles.actionsRow}>
            {onSpeak && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onSpeak(message.content)}
              >
                <MaterialIcons
                  name={isSpeaking ? 'stop' : 'volume-up'}
                  size={16}
                  color={Colors.primary}
                />
                <Text style={styles.actionText}>
                  {isSpeaking ? 'Stop' : 'Listen'}
                </Text>
              </TouchableOpacity>
            )}
            <Text style={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Typing indicator
export function TypingIndicator() {
  return (
    <View style={[styles.container, styles.assistantContainer]}>
      <View style={styles.avatarWrap}>
        <MaterialIcons name="auto-awesome" size={18} color={Colors.primary} />
      </View>
      <View style={[styles.bubble, styles.assistantBubble, styles.typingBubble]}>
        <View style={styles.dotsRow}>
          <View style={[styles.dot, { opacity: 0.4 }]} />
          <View style={[styles.dot, { opacity: 0.7 }]} />
          <View style={[styles.dot, { opacity: 1 }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.base,
    gap: 8,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    lineHeight: 22,
  },
  userText: {
    color: Colors.textInverse,
  },
  sourcesWrap: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sourcesLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  sourceText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceHighlight,
  },
  actionText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  typingBubble: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
