import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Shadows } from '../constants/theme';
import {
  CURRENCIES,
  fetchLiveRates,
  convertToInr,
  convertFromInr,
  CurrencyMeta,
  LiveRates,
} from '../services/currencyService';

interface Props {
  compact?: boolean;
}

export function CurrencyConverterCard({ compact = false }: Props) {
  const [selected, setSelected] = useState<CurrencyMeta>(CURRENCIES[0]);
  const [amount, setAmount] = useState('50');
  const [direction, setDirection] = useState<'toInr' | 'fromInr'>('toInr');
  const [rates, setRates] = useState<LiveRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadRates = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const live = await fetchLiveRates();
      setRates(live);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRates();
  }, [loadRates]);

  const parsedAmount = parseFloat(amount) || 0;
  const currentRate = rates?.rates[selected.code] ?? 0;

  const convertedValue =
    direction === 'toInr'
      ? convertToInr(parsedAmount, currentRate)
      : convertFromInr(parsedAmount, currentRate);

  const presets =
    direction === 'toInr'
      ? [10, 25, 50, 100, 250, 500]
      : [500, 1000, 2500, 5000, 10000];

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleWrap}>
          <MaterialIcons name="currency-exchange" size={18} color={Colors.primary} />
          <Text style={styles.headerTitle}>Live Currency Converter</Text>
        </View>

        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={loadRates}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live Rates</Text>
              <MaterialIcons name="sync" size={13} color={Colors.success} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {error && !rates ? (
        <TouchableOpacity style={styles.errorBanner} onPress={loadRates} activeOpacity={0.8}>
          <MaterialIcons name="error-outline" size={18} color="#FF7B7B" />
          <Text style={styles.errorText}>Failed to fetch live rates. Tap to retry.</Text>
        </TouchableOpacity>
      ) : (
        <>
          {/* Currency Pill Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorScroll}
          >
            {CURRENCIES.map((c) => {
              const isSelected = c.code === selected.code;
              return (
                <TouchableOpacity
                  key={c.code}
                  style={[styles.currencyPill, isSelected && styles.currencyPillActive]}
                  onPress={() => setSelected(c)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.pillFlag}>{c.flag}</Text>
                  <Text style={[styles.pillCode, isSelected && styles.pillCodeActive]}>
                    {c.code}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Current Live Rate Tag */}
          <View style={styles.rateTagRow}>
            <View style={styles.rateTag}>
              <Text style={styles.rateTagText}>
                1 {selected.code} = ₹{currentRate > 0 ? currentRate.toFixed(2) : '--.--'} INR
              </Text>
            </View>
            {rates?.lastUpdated ? (
              <Text style={styles.updateTimeText}>
                Synced: {new Date(rates.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            ) : null}
          </View>

          {/* Dual Converter Box */}
          <View style={styles.converterContainer}>
            {/* Input Row */}
            <View style={styles.inputBlock}>
              <Text style={styles.blockLabel}>
                {direction === 'toInr' ? `${selected.name} (${selected.code})` : 'Indian Rupee (INR)'}
              </Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencyPrefix}>
                  {direction === 'toInr' ? selected.symbol : '₹'}
                </Text>
                <TextInput
                  style={styles.numericInput}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            {/* Swap Button */}
            <TouchableOpacity
              style={styles.swapButton}
              onPress={() => setDirection((d) => (d === 'toInr' ? 'fromInr' : 'toInr'))}
              activeOpacity={0.8}
            >
              <MaterialIcons name="swap-vert" size={20} color={Colors.primary} />
            </TouchableOpacity>

            {/* Output Row */}
            <View style={styles.outputBlock}>
              <Text style={styles.blockLabel}>
                {direction === 'toInr' ? 'Indian Rupee (INR)' : `${selected.name} (${selected.code})`}
              </Text>
              <View style={styles.outputWrapper}>
                <Text style={styles.resultValue}>
                  {direction === 'toInr'
                    ? `₹${convertedValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
                    : `${selected.symbol}${convertedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Presets */}
          <View style={styles.presetContainer}>
            {presets.map((val) => {
              const isActive = amount === String(val);
              return (
                <TouchableOpacity
                  key={val}
                  style={[styles.presetChip, isActive && styles.presetChipActive]}
                  onPress={() => setAmount(String(val))}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.presetChipText, isActive && styles.presetChipTextActive]}>
                    {direction === 'toInr' ? `${selected.symbol}${val}` : `₹${val}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Practical Card Payment Warning */}
          <View style={styles.advisoryCard}>
            <MaterialIcons name="info-outline" size={15} color={Colors.primary} />
            <Text style={styles.advisoryText}>
              <Text style={{ fontWeight: '700', color: Colors.primary }}>Forex Tip: </Text>
              Always choose "Pay in INR" on POS machines and ATMs to let your home bank do the exchange. Choosing your home currency triggers high conversion fees.
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    backgroundColor: '#16161D',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...Shadows.md,
  },
  cardCompact: {
    marginVertical: 6,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.2,
  },
  refreshBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#1E1E28',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  liveText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.success,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 123, 123, 0.1)',
    borderRadius: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#FF7B7B',
    fontWeight: '600',
  },
  selectorScroll: {
    gap: 8,
    paddingBottom: 10,
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
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  currencyPillActive: {
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
    borderColor: Colors.primary,
  },
  pillFlag: {
    fontSize: 15,
  },
  pillCode: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  pillCodeActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  rateTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  rateTag: {
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rateTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  updateTimeText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  converterContainer: {
    backgroundColor: '#1E1E28',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 6,
  },
  inputBlock: {
    marginBottom: 4,
  },
  blockLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14141B',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    marginRight: 6,
  },
  numericInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    paddingVertical: 8,
  },
  swapButton: {
    alignSelf: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#262635',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
    marginVertical: 4,
  },
  outputBlock: {
    marginTop: 4,
  },
  outputWrapper: {
    backgroundColor: '#14141B',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  resultValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  presetContainer: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#1E1E28',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  presetChipActive: {
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
    borderColor: Colors.primary,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  presetChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  advisoryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(212, 175, 124, 0.06)',
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.15)',
  },
  advisoryText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
