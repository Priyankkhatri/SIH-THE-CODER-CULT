import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

/** Hairline divider — the primary separator in luxury layout. */
export function YatraDivider({ gold = false }: { gold?: boolean }) {
  return <View style={[styles.divider, gold && styles.dividerGold]} />;
}

export function Eyebrow({ children }: { children: string }) {
  return <Text style={styles.eyebrow}>{children.toUpperCase()}</Text>;
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action ? (
        <TouchableOpacity onPress={onAction} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function EditorialQuote({ children }: { children: string }) {
  return (
    <View style={styles.quoteWrap}>
      <View style={styles.quoteRule} />
      <Text style={styles.quoteText}>{children}</Text>
    </View>
  );
}

/** Restrained primary button — solid warm gold, dark text, no glow. */
export function PremiumPrimaryButton({
  label,
  sub,
  icon,
  onPress,
}: {
  label: string;
  sub?: string;
  icon?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.primaryBtn} onPress={onPress} activeOpacity={0.88}>
      {icon ? <MaterialIcons name={icon as any} size={20} color={Colors.textInverse} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.primaryLabel}>{label}</Text>
        {sub ? <Text style={styles.primarySub}>{sub}</Text> : null}
      </View>
      <MaterialIcons name="arrow-forward" size={18} color={Colors.textInverse} />
    </TouchableOpacity>
  );
}

/** Quiet outline row — for secondary actions like verified sources / archive links. */
export function PremiumOutlineRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.outlineRow} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.outlineIcon}>
        <MaterialIcons name={icon as any} size={20} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.outlineTitle}>{title}</Text>
        {subtitle ? <Text style={styles.outlineSub}>{subtitle}</Text> : null}
      </View>
      <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

/** Elegant expandable row with hairline separators — replaces stacked chunky cards. */
export function ExpandableRow({
  title,
  icon,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  icon: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.expandWrap}>
      <TouchableOpacity style={styles.expandHeader} onPress={onToggle} activeOpacity={0.8}>
        <MaterialIcons name={icon as any} size={18} color={Colors.primary} />
        <Text style={styles.expandTitle}>{title}</Text>
        <MaterialIcons
          name={expanded ? 'remove' : 'add'}
          size={20}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>
      {expanded ? <View style={styles.expandBody}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  },
  dividerGold: {
    backgroundColor: Colors.goldHairline,
    width: 40,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: Colors.primary,
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 21,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.2,
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  quoteWrap: {
    paddingHorizontal: 20,
    marginVertical: 14,
  },
  quoteRule: {
    width: 36,
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 0.8,
    marginBottom: 10,
  },
  quoteText: {
    fontFamily: Typography.fontFamily.serif,
    fontStyle: 'italic',
    fontSize: 17,
    lineHeight: 26,
    color: Colors.primaryLight,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  primarySub: {
    fontSize: 12,
    color: 'rgba(15,15,15,0.65)',
    marginTop: 1,
  },
  outlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: 14,
  },
  outlineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  outlineSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  expandWrap: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingVertical: 4,
  },
  expandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  expandTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  expandBody: {
    paddingBottom: 16,
  },
});
