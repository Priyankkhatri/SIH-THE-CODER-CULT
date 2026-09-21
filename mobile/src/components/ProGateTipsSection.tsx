import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows } from '../constants/theme';
import { getMonumentGateGuidelines, GateTipItem } from '../services/monumentGateTipsService';

interface ProGateTipsSectionProps {
  placeName: string;
  category?: string;
}

export function ProGateTipsSection({ placeName, category }: ProGateTipsSectionProps) {
  const guidelines = getMonumentGateGuidelines(placeName, category);
  const [expandedTipId, setExpandedTipId] = useState<string | null>(guidelines.tips[0]?.id || null);

  const toggleTip = (id: string) => {
    setExpandedTipId((prev) => (prev === id ? null : id));
  };

  const getBadgeStyle = (type: GateTipItem['badgeType']) => {
    switch (type) {
      case 'warning':
        return { bg: 'rgba(217, 123, 119, 0.15)', text: '#D97B77', border: 'rgba(217, 123, 119, 0.3)' };
      case 'success':
        return { bg: 'rgba(127, 182, 133, 0.15)', text: '#7FB685', border: 'rgba(127, 182, 133, 0.3)' };
      case 'info':
      default:
        return { bg: 'rgba(212, 175, 124, 0.15)', text: Colors.primary, border: 'rgba(212, 175, 124, 0.3)' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.eyebrowWrap}>
          <MaterialIcons name="security" size={15} color={Colors.primary} />
          <Text style={styles.eyebrow}>GATE SURVIVAL & SCAM SHIELD</Text>
        </View>
        <View style={styles.verifiedTag}>
          <MaterialIcons name="verified" size={12} color={Colors.success} />
          <Text style={styles.verifiedTagText}>Official Rules</Text>
        </View>
      </View>

      <Text style={styles.title}>Pro Gate Tips & Scam Protection</Text>
      <Text style={styles.subtitle}>
        Know your rights before entering the monument perimeter to avoid touts and unofficial charges.
      </Text>

      {/* Tip Cards Accordion */}
      <View style={styles.tipsList}>
        {guidelines.tips.map((tip) => {
          const isExpanded = expandedTipId === tip.id;
          const badgeColors = getBadgeStyle(tip.badgeType);

          return (
            <TouchableOpacity
              key={tip.id}
              style={[styles.tipCard, isExpanded && styles.tipCardExpanded]}
              onPress={() => toggleTip(tip.id)}
              activeOpacity={0.85}
            >
              {/* Card Header Row */}
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: badgeColors.bg, borderColor: badgeColors.border },
                  ]}
                >
                  <MaterialIcons name={tip.icon as any} size={20} color={badgeColors.text} />
                </View>

                <View style={styles.cardTitleWrap}>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.badgePill,
                        { backgroundColor: badgeColors.bg, borderColor: badgeColors.border },
                      ]}
                    >
                      <Text style={[styles.badgePillText, { color: badgeColors.text }]}>
                        {tip.badge}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                </View>

                <MaterialIcons
                  name={isExpanded ? 'expand-less' : 'expand-more'}
                  size={22}
                  color={Colors.textMuted}
                />
              </View>

              {/* Summary */}
              <Text style={styles.tipSummary}>{tip.summary}</Text>

              {/* Expanded Actionable Advice */}
              {isExpanded && (
                <View style={styles.adviceBox}>
                  <View style={styles.adviceHeaderRow}>
                    <MaterialIcons name="lightbulb" size={14} color={Colors.primary} />
                    <Text style={styles.adviceHeader}>What You Should Do</Text>
                  </View>
                  <Text style={styles.adviceText}>{tip.actionableAdvice}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    backgroundColor: '#16161D',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...Shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  eyebrowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.1,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(127, 182, 133, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  verifiedTagText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  tipsList: {
    gap: 10,
  },
  tipCard: {
    backgroundColor: '#1E1E28',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  tipCardExpanded: {
    borderColor: 'rgba(212, 175, 124, 0.3)',
    backgroundColor: '#20202C',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cardTitleWrap: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgePillText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 19,
  },
  tipSummary: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginTop: 8,
    marginLeft: 50,
  },
  adviceBox: {
    marginTop: 12,
    backgroundColor: 'rgba(212, 175, 124, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.20)',
    marginLeft: 50,
  },
  adviceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  adviceHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.4,
  },
  adviceText: {
    fontSize: 12,
    color: Colors.text,
    lineHeight: 17,
  },
});
