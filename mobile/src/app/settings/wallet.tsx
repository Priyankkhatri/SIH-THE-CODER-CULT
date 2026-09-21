import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadows } from '../../constants/theme';
import { CurrencyConverterCard } from '../../components/CurrencyConverterCard';

export default function TravelerWalletScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleOpenCheq = () => {
    Linking.openURL('https://www.cheq.dinero.in');
  };

  const handleOpenNpci = () => {
    Linking.openURL('https://www.npci.org.in');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerEyebrow}>TRAVELER'S FINANCIAL COMPASS</Text>
          <Text style={styles.headerTitle}>Tourist Wallet & UPI Guide</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Currency Converter */}
        <CurrencyConverterCard />

        {/* 2. UPI One World Master Guide */}
        <View style={styles.guideCard}>
          <View style={styles.guideHeaderRow}>
            <View style={styles.guideIconWrap}>
              <MaterialIcons name="qr-code-scanner" size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.officialBadgeRow}>
                <Text style={styles.guideEyebrow}>RBI & NPCI SANCTIONED</Text>
                <View style={styles.officialTag}>
                  <Text style={styles.officialTagText}>Official System</Text>
                </View>
              </View>
              <Text style={styles.guideTitle}>UPI One World for Foreign Tourists</Text>
            </View>
          </View>

          <Text style={styles.guideDesc}>
            India is 90% cashless. International credit cards fail at 99% of roadside tea stalls,
            monument auto-rickshaws, and craft shops. UPI One World allows foreign passport holders
            to scan and pay ANY Indian QR code.
          </Text>

          {/* 4-Step Walkthrough */}
          <View style={styles.stepsContainer}>
            <View style={styles.stepRow}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNumText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Airport Kiosks on Arrival</Text>
                <Text style={styles.stepText}>
                  Visit official UPI One World partner counters at international arrival halls in
                  Delhi (T3), Mumbai (T2), Bengaluru (T2), or Ahmedabad.
                </Text>
              </View>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNumText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Instant Passport Verification</Text>
                <Text style={styles.stepText}>
                  Present your valid foreign passport, Indian tourist visa, and arrival boarding
                  pass for instant on-the-spot verification.
                </Text>
              </View>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNumText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Load Wallet with Foreign Card or Forex</Text>
                <Text style={styles.stepText}>
                  Load rupees into your digital wallet using your international Visa/Mastercard or
                  foreign cash exchange. Unspent balance is refunded upon departure.
                </Text>
              </View>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNumText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Scan Any Merchant QR Across India</Text>
                <Text style={styles.stepText}>
                  Pay instantly at Google Pay, PhonePe, Paytm, and BHIM merchant stands from ₹10
                  cutting chai to ₹5,000 handicraft emporiums.
                </Text>
              </View>
            </View>
          </View>

          {/* External Partner Action Buttons */}
          <View style={styles.partnerButtonsRow}>
            <TouchableOpacity
              style={styles.partnerBtnPrimary}
              onPress={handleOpenCheq}
              activeOpacity={0.8}
            >
              <MaterialIcons name="smartphone" size={16} color="#0A0A0E" />
              <Text style={styles.partnerBtnPrimaryText}>Cheq UPI for Tourists</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.partnerBtnSecondary}
              onPress={handleOpenNpci}
              activeOpacity={0.8}
            >
              <MaterialIcons name="open-in-new" size={15} color={Colors.primary} />
              <Text style={styles.partnerBtnSecondaryText}>NPCI Guidelines</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. ATM & Card Fee Protection Advisory */}
        <View style={styles.atmCard}>
          <View style={styles.atmHeaderRow}>
            <MaterialIcons name="local-atm" size={20} color={Colors.success} />
            <Text style={styles.atmTitle}>ATM & Card Fee Protection Advisory</Text>
          </View>

          <View style={styles.atmPoint}>
            <MaterialIcons name="check-circle" size={16} color={Colors.success} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.atmPointTitle}>Trusted Public & Private Banks</Text>
              <Text style={styles.atmPointDesc}>
                Use State Bank of India (SBI), HDFC Bank, or ICICI Bank ATMs. They have standard
                interbank exchange rates with zero predatory markups.
              </Text>
            </View>
          </View>

          <View style={styles.atmPoint}>
            <MaterialIcons name="warning" size={16} color="#D9A45B" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.atmPointTitle}>Avoid Independent White-Label ATMs</Text>
              <Text style={styles.atmPointDesc}>
                Avoid standalone roadside ATMs (Euronet / Indicash) outside tourist zones that charge
                an extra ₹250–₹400 access fee per transaction.
              </Text>
            </View>
          </View>

          <View style={styles.atmPoint}>
            <MaterialIcons name="security" size={16} color={Colors.primary} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.atmPointTitle}>The DCC Trap: Always Choose "Bill in INR"</Text>
              <Text style={styles.atmPointDesc}>
                When inserting an international card into an Indian ATM or POS card reader, always
                select "Bill in INR (Rupees)" when prompted. Never choose your home currency—that
                triggers a hidden 6% to 9% conversion fee.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerEyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // UPI Guide Card
  guideCard: {
    backgroundColor: '#16161D',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    ...Shadows.md,
  },
  guideHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  guideIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  officialBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  guideEyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  officialTag: {
    backgroundColor: 'rgba(127, 182, 133, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  officialTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.success,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.2,
  },
  guideDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 18,
  },
  stepsContainer: {
    gap: 14,
    marginBottom: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#242434',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.primary,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 2,
  },
  stepText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  partnerButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  partnerBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
  },
  partnerBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A0A0E',
  },
  partnerBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1E1E28',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.3)',
  },
  partnerBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },

  // ATM Advisory Card
  atmCard: {
    backgroundColor: '#16161D',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    gap: 14,
    ...Shadows.md,
  },
  atmHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  atmTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  atmPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  atmPointTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 2,
  },
  atmPointDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
});
