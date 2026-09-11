import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, CATEGORIES } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { t, getCategoryName } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[styles.chip, !selected && styles.chipActive]}
        onPress={() => onSelect(null)}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="apps"
          size={16}
          color={!selected ? Colors.textInverse : Colors.textSecondary}
        />
        <Text style={[styles.chipText, !selected && styles.chipTextActive]}>{t('categories.all')}</Text>
      </TouchableOpacity>

      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.key}
          style={[
            styles.chip,
            selected === cat.key && styles.chipActive,
            selected === cat.key && { backgroundColor: cat.color },
          ]}
          onPress={() => onSelect(selected === cat.key ? null : cat.key)}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={cat.icon as any}
            size={16}
            color={selected === cat.key ? Colors.textInverse : cat.color}
          />
          <Text
            style={[
              styles.chipText,
              selected === cat.key && styles.chipTextActive,
            ]}
          >
            {getCategoryName(cat.key)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    gap: 8,
    paddingVertical: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.textInverse,
  },
});
