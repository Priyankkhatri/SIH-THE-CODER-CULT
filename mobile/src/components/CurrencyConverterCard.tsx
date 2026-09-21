import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Shadows } from '../constants/theme';
import {
  SUPPORTED_CURRENCIES,
  convertToInr,
  convertFromInr,
  getPurchasingPowerBenchmark,
  CurrencyInfo,
} from '../services/currencyService';

interface CurrencyConverterCardProps {
  compact?: boolean;
}

export function CurrencyConverterCard({ compact = false }: CurrencyConverterCardProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyInfo>(SUPPORTED_CURRENCIES[0]); // USD
  const [inputAmount, setInputAmount] = useState<string>('20');
  const [direction, setDirection] = useState<'foreignToInr' | 'inrToForeign'>('foreignToInr');

  const parsedAmount = parseFloat(inputAmount) || 0;

  let convertedValue = 0;
  let inrEquivalent = 0;

  if (direction === 'foreignToInr') {
    convertedValue = convertToInr(parsedAmount, selectedCurrency.code);
    inrEquivalent = convertedValue;
  } else {
    convertedValue = convertFromInr(parsedAmount, selectedCurrency.code);
    inrEquivalent = parsedAmount;
  }

  const purchasingPower = getPurchasingPowerBenchmark(inrEquivalent);

  const toggleDirection = () => {
    setDirection((prev) => (prev === 'foreignToInr' ? 'inrToForeign' : 'foreignToInr'));
  };

  const setPreset = (amt: number) => {
    setInputAmount(amt.toString());
  };

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.eyebrowWrap}>
          <MaterialIcons name="currency-exchange" size={15} color={Colors.primary} />
          <Text style={styles.eyebrow}>OFFLINE CURRENCY CONVERTER</Text>
        </View>
        <View style={styles.offlineBadge}>
          <MaterialIcons name="cloud-off" size={11} color={Colors.success} />
          <Text style={styles.offlineBadgeText}>100% Offline</Text>
        </View>
      </View>

      <Text style={styles.title}>Traveler Forex & Local Price Meter</Text>
      <Text style={styles.subtitle}>
        Instant conversions calibrated for Indian tourist destinations with real-world spending context.
      </Text>

      {/* Currency Selector Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.currencyScroll}
      >
        {SUPPORTED_CURRENCIES.map((cur) => {
          const isSelected = cur.code === selectedCurrency.code;
          return (
            <TouchableOpacity
              key={cur.code}
              style={[styles.currencyPill, isSelected && styles.currencyPillSelected]}
              onPress={() => setSelectedCurrency(cur)}
              activeOpacity={0.8}
            >
              <Text style={styles.currencyFlag}>{cur.flag}</Text>
              <Text style={[styles.currencyCode, isSelected && styles.currencyCodeSelected]}>
                {cur.code}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Conversion Input & Output Card */}
      <View style={styles.calcBox}>
        {/* Input Row */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            {direction === 'foreignToInr'
              ? `${selectedCurrency.name} (${selectedCurrency.symbol})`
              : 'Indian Rupee (₹ INR)'}
          </Text>
          <View style={styles.inputRow}>
            <Text style={styles.currencySymbolPrefix}>
              {direction === 'foreignToInr' ? selectedCurrency.symbol : '₹'}
            </Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={inputAmount}
              onChangeText={setInputAmount}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        </View>

        {/* Direction Switch Button */}
        <TouchableOpacity
          style={styles.switchBtn}
          onPress={toggleDirection}
          activeOpacity={0.8}
        >
          <MaterialIcons name="swap-vert" size={20} color={Colors.primary} />
        </TouchableOpacity>

        {/* Output Section */}
        <View style={styles.outputSection}>
          <Text style={styles.inputLabel}>
            {direction === 'foreignToInr'
              ? 'Converted to Indian Rupee (₹ INR)'
              : `Converted to ${selectedCurrency.name}`}
          </Text>
          <Text style={styles.outputValue}>
            {direction === 'foreignToInr'
              ? `₹${convertedValue.toLocaleString('en-IN')}`
              : `${selectedCurrency.symbol}${convertedValue.toLocaleString()}`}
          </Text>
          <Text style={styles.rateNote}>
            Base Rate: 1 {selectedCurrency.code} = ₹{selectedCurrency.rateToInr.toFixed(2)} INR
          </Text>
        </View>
      </View>

      {/* Preset Amount Shortcuts */}
      <View style={styles.presetRow}>
        {(direction === 'foreignToInr' ? [5, 10, 20, 50, 100] : [100, 250, 500, 1000, 2000]).map(
          (val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.presetPill,
                inputAmount === val.toString() && styles.presetPillActive,
              ]}
              onPress={() => setPreset(val)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.presetText,
                  inputAmount === val.toString() && styles.presetTextActive,
                ]}
              >
                {direction === 'foreignToInr' ? `${selectedCurrency.symbol}${val}` : `₹${val}`}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Real-World Indian Purchasing Power Context */}
      <View style={styles.purchasingPowerCard}>
        <View style={styles.purchasingHeader}>
          <MaterialIcons name="shopping-bag" size={14} color={Colors.primary} />
          <Text style={styles.purchasingHeaderText}>LOCAL PURCHASING POWER CONTEXT</Text>
        </View>
        <Text style={styles.purchasingText}>{purchasingPower}</Text>
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
  containerCompact: {
    marginVertical: 8,
    padding: 16,
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
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(127, 182, 133, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  offlineBadgeText: {
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
  currencyScroll: {
    gap: 8,
    paddingBottom: 14,
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#1E1E28',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  currencyPillSelected: {
    backgroundColor: 'rgba(212, 175, 124, 0.18)',
    borderColor: Colors.primary,
  },
  currencyFlag: {
    fontSize: 16,
  },
  currencyCode: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  currencyCodeSelected: {
    color: Colors.primary,
    fontWeight: '800',
  },
  calcBox: {
    backgroundColor: '#1E1E28',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    position: 'relative',
    marginBottom: 12,
  },
  inputSection: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161D',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  currencySymbolPrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    paddingVertical: 10,
  },
  switchBtn: {
    alignSelf: 'center',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#262635',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
    marginVertical: -4,
    zIndex: 2,
  },
  outputSection: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  outputValue: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
    marginVertical: 2,
  },
  rateNote: {
    fontSize: 10.5,
    color: Colors.textMuted,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  presetPill: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#1E1E28',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  presetPillActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  presetTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  purchasingPowerCard: {
    backgroundColor: 'rgba(212, 175, 124, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.20)',
  },
  purchasingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  purchasingHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.6,
  },
  purchasingText: {
    fontSize: 12.5,
    color: Colors.text,
    lineHeight: 18,
    fontWeight: '600',
  },
});
