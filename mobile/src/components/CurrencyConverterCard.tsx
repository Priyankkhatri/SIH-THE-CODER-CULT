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
  getSpendingContext,
  CurrencyMeta,
  LiveRates,
} from '../services/currencyService';

interface Props {
  compact?: boolean;
}

export function CurrencyConverterCard({ compact = false }: Props) {
  const [selected, setSelected] = useState<CurrencyMeta>(CURRENCIES[0]);
  const [amount, setAmount] = useState('20');
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

  const parsed = parseFloat(amount) || 0;
  const rate = rates?.rates[selected.code] ?? 0;

  let converted = 0;
  let inrValue = 0;
  if (direction === 'toInr') {
    converted = convertToInr(parsed, rate);
    inrValue = converted;
  } else {
    converted = convertFromInr(parsed, rate);
    inrValue = parsed;
  }

  const spending = getSpendingContext(inrValue);

  const formatLastUpdated = () => {
    if (!rates?.lastUpdated) return '';
    try {
      const d = new Date(rates.lastUpdated);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return rates.lastUpdated;
    }
  };

  return (
    <View style={[s.card, compact && s.cardCompact]}>
      {/* Header */}
      <View style={s.headerRow}>
        <View style={s.headerLeft}>
          <MaterialIcons name="currency-exchange" size={15} color={Colors.primary} />
          <Text style={s.eyebrow}>LIVE FOREX</Text>
        </View>
        {rates && !loading && (
          <TouchableOpacity style={s.liveBadge} onPress={loadRates} activeOpacity={0.7}>
            <View style={s.liveDot} />
            <Text style={s.liveText}>Live</Text>
            <MaterialIcons name="refresh" size={11} color={Colors.success} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={s.title}>Currency Converter</Text>
      {rates && (
        <Text style={s.updated}>Updated: {formatLastUpdated()}</Text>
      )}

      {/* Loading / Error state */}
      {loading && (
        <View style={s.loadingWrap}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={s.loadingText}>Fetching live rates...</Text>
        </View>
      )}

      {error && !rates && (
        <TouchableOpacity style={s.errorWrap} onPress={loadRates} activeOpacity={0.7}>
          <MaterialIcons name="wifi-off" size={18} color="#E57373" />
          <Text style={s.errorText}>Could not load rates. Tap to retry.</Text>
        </TouchableOpacity>
      )}

      {/* Currency pills */}
      {!loading && rates && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.pillScroll}
          >
            {CURRENCIES.map((c) => {
              const active = c.code === selected.code;
              return (
                <TouchableOpacity
                  key={c.code}
                  style={[s.pill, active && s.pillActive]}
                  onPress={() => setSelected(c)}
                  activeOpacity={0.8}
                >
                  <Text style={s.pillFlag}>{c.flag}</Text>
                  <Text style={[s.pillCode, active && s.pillCodeActive]}>{c.code}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Rate display */}
          <View style={s.rateChip}>
            <Text style={s.rateChipText}>
              1 {selected.code} = ₹{rate.toFixed(2)}
            </Text>
          </View>

          {/* Converter */}
          <View style={s.converterBox}>
            <View style={s.inputBlock}>
              <Text style={s.label}>
                {direction === 'toInr' ? selected.name : 'Indian Rupee'}
              </Text>
              <View style={s.inputRow}>
                <Text style={s.symbolPrefix}>
                  {direction === 'toInr' ? selected.symbol : '₹'}
                </Text>
                <TextInput
                  style={s.input}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>

            <TouchableOpacity
              style={s.swapBtn}
              onPress={() => setDirection((d) => (d === 'toInr' ? 'fromInr' : 'toInr'))}
              activeOpacity={0.7}
            >
              <MaterialIcons name="swap-vert" size={18} color={Colors.primary} />
            </TouchableOpacity>

            <View style={s.outputBlock}>
              <Text style={s.label}>
                {direction === 'toInr' ? 'Indian Rupee' : selected.name}
              </Text>
              <Text style={s.outputValue}>
                {direction === 'toInr'
                  ? `₹${converted.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
                  : `${selected.symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              </Text>
            </View>
          </View>

          {/* Quick presets */}
          <View style={s.presetRow}>
            {(direction === 'toInr' ? [1, 5, 10, 20, 50, 100] : [100, 500, 1000, 2000, 5000]).map(
              (v) => (
                <TouchableOpacity
                  key={v}
                  style={[s.preset, amount === String(v) && s.presetActive]}
                  onPress={() => setAmount(String(v))}
                  activeOpacity={0.75}
                >
                  <Text style={[s.presetText, amount === String(v) && s.presetTextActive]}>
                    {direction === 'toInr' ? `${selected.symbol}${v}` : `₹${v}`}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>

          {/* Spending context */}
          {spending ? (
            <View style={s.spendCard}>
              <Text style={s.spendLabel}>WHAT THIS BUYS IN INDIA</Text>
              <Text style={s.spendText}>{spending}</Text>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginVertical: 14,
    backgroundColor: '#16161D',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    ...Shadows.md,
  },
  cardCompact: {
    marginVertical: 8,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerLeft: {
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
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(127,182,133,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  liveText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  updated: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 14,
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  errorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 13,
    color: '#E57373',
  },
  pillScroll: {
    gap: 8,
    paddingBottom: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#1E1E28',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  pillActive: {
    backgroundColor: 'rgba(212,175,124,0.15)',
    borderColor: Colors.primary,
  },
  pillFlag: {
    fontSize: 15,
  },
  pillCode: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  pillCodeActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  rateChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212,175,124,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  rateChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  converterBox: {
    backgroundColor: '#1E1E28',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 10,
  },
  inputBlock: {
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161D',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  symbolPrefix: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primary,
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
    paddingVertical: 9,
  },
  swapBtn: {
    alignSelf: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#262635',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,124,0.25)',
    marginVertical: -2,
    zIndex: 2,
  },
  outputBlock: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  outputValue: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  preset: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#1E1E28',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  presetActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(212,175,124,0.12)',
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
  spendCard: {
    backgroundColor: 'rgba(212,175,124,0.08)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(212,175,124,0.18)',
  },
  spendLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  spendText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
  },
});
