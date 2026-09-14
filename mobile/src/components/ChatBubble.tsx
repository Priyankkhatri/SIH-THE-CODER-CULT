import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import type { ChatMessage } from '../stores';

interface ChatBubbleProps {
  message: ChatMessage;
  onSpeak?: (text: string) => void;
  speaking?: boolean;
  onCopy?: (text: string) => void;
  copied?: boolean;
  onRetry?: () => void;
  showRetry?: boolean;
  offline?: boolean;
}

const markdownStyle = {
  body: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    lineHeight: 22,
  },
  heading1: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes.lg,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  heading2: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes.md,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  heading3: {
    fontSize: Typography.sizes.base,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  strong: {
    fontWeight: '700' as const,
    color: Colors.text,
  },
  em: {
    fontStyle: 'italic' as const,
    color: Colors.textSecondary,
  },
  bullet_list: {
    marginTop: 6,
  },
  bullet_list_item: {
    flexDirection: 'row' as const,
    marginBottom: 4,
  },
  bullet_list_content: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    lineHeight: 22,
    flex: 1,
  },
  ordered_list_item: {
    flexDirection: 'row' as const,
    marginBottom: 4,
  },
  ordered_list_content: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    lineHeight: 22,
    flex: 1,
  },
  code_inline: {
    backgroundColor: Colors.surfaceHighlight,
    color: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: 4,
    fontSize: Typography.sizes.sm,
  },
  fence: {
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: 6,
  },
  code_block: {
    color: Colors.text,
    fontSize: Typography.sizes.sm,
  },
  blockquote: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    paddingLeft: 10,
    marginTop: 6,
  },
  link: {
    color: Colors.primary,
  },
  hr: {
    backgroundColor: Colors.border,
    height: 1,
    marginVertical: 8,
  },
};

class MarkdownSafe extends React.Component<{ content: string; style: any }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError || !this.props.content) {
      return <Text style={styles.messageText}>{this.props.content || ''}</Text>;
    }
    return <Markdown style={this.props.style}>{this.props.content}</Markdown>;
  }
}

export function ChatBubble({ message, onSpeak, speaking, onCopy, copied, onRetry, showRetry, offline }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  const openSource = (url?: string) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {!isUser && (
        <View style={styles.avatarWrap}>
          <MaterialIcons name="auto-awesome" size={18} color={Colors.primary} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        {isUser ? (
          <Text style={[styles.messageText, styles.userText]}>{message.content}</Text>
        ) : (
          <MarkdownSafe style={markdownStyle} content={message.content || ''} />
        )}

        {/* Offline badge */}
        {!isUser && offline && (
          <View style={styles.offlineBadge}>
            <MaterialIcons name="cloud-off" size={12} color={Colors.warning} />
            <Text style={styles.offlineText}>Offline knowledge</Text>
          </View>
        )}

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <View style={styles.sourcesWrap}>
            <Text style={styles.sourcesLabel}>
              📚 Sources ({message.sources.length})
            </Text>
            {message.sources.map((source, idx) => {
              const tappable = !!source.url;
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.sourceItem}
                  onPress={() => openSource(source.url)}
                  disabled={!tappable}
                  activeOpacity={tappable ? 0.7 : 1}
                >
                  <MaterialIcons
                    name={tappable ? 'open-in-new' : 'verified'}
                    size={12}
                    color={tappable ? Colors.primary : Colors.success}
                  />
                  <View style={styles.sourceTextWrap}>
                    <Text style={styles.sourceText} numberOfLines={1}>
                      {source.name}
                    </Text>
                    {!!source.text && (
                      <Text style={styles.sourceSnippet} numberOfLines={2}>
                        {source.text}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Actions */}
        {!isUser && (
          <View style={styles.actionsRow}>
            <View style={styles.actionsLeft}>
              {onSpeak && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onSpeak(message.content)}
                >
                  <MaterialIcons
                    name={speaking ? 'stop' : 'volume-up'}
                    size={16}
                    color={Colors.primary}
                  />
                  <Text style={styles.actionText}>
                    {speaking ? 'Stop' : 'Listen'}
                  </Text>
                </TouchableOpacity>
              )}
              {onCopy && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onCopy(message.content)}
                >
                  <MaterialIcons
                    name={copied ? 'check' : 'content-copy'}
                    size={14}
                    color={copied ? Colors.success : Colors.primary}
                  />
                  <Text style={styles.actionText}>
                    {copied ? 'Copied' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              )}
              {showRetry && onRetry && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onRetry}
                >
                  <MaterialIcons name="refresh" size={14} color={Colors.primary} />
                  <Text style={styles.actionText}>Retry</Text>
                </TouchableOpacity>
              )}
            </View>
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
        <Text style={styles.typingText}>Guide is thinking…</Text>
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
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '85%',
    minWidth: 0,
    flexShrink: 1,
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
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: Spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(217, 164, 91, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 91, 0.3)',
  },
  offlineText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.warning,
  },
  sourcesWrap: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 6,
  },
  sourcesLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sourceTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  sourceText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.text,
  },
  sourceSnippet: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    lineHeight: 15,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    gap: 8,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceHighlight,
    flexShrink: 0,
  },
  actionText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 10,
    color: Colors.textMuted,
    flexShrink: 0,
  },
  typingBubble: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    gap: 6,
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
  typingText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
});
