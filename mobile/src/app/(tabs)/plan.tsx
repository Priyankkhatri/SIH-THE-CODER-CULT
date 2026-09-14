import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
  Alert,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  INTERESTS_OPTIONS,
  DURATION_OPTIONS,
  TRAVEL_STYLES,
} from '../../constants/theme';
import { useUserStore, usePlacesStore, Place } from '../../stores';
import { useTranslation } from '../../hooks/useTranslation';
import { itineraryApi } from '../../services/api';
import { useLocation } from '../../hooks/useLocation';
import { TimelineItem } from '../../components/TimelineItem';
import { ALL_SEED_PLACES } from '../../utils/seedPlaces';
import { dynamicImageService } from '../../services/dynamicImageService';
import { haversineDistance } from '../../utils/routeService';

const SAVED_ITINERARIES_STORAGE_KEY = '@yatra_saved_itineraries_v1';

export interface ItineraryItem {
  placeId: string;
  placeName: string;
  order: number;
  visitDuration: number;
  travelTime: number;
  travelMode: string;
  reason: string;
  distance: number;
  imageUrl: string | null;
  shortStory: string | null;
  latitude?: number;
  longitude?: number;
}

export interface ItineraryData {
  id?: string;
  title: string;
  duration: string;
  totalTimeMinutes: number;
  stops: number;
  items: ItineraryItem[];
  savedAt?: string;
}

interface RegionalHub {
  id: string;
  name: string;
  label: string;
  latitude: number;
  longitude: number;
  icon: string;
}

const REGIONAL_HUBS: RegionalHub[] = [
  { id: 'gps', name: 'My Current Location', label: 'Live GPS', latitude: 0, longitude: 0, icon: 'my-location' },
  { id: 'agra', name: 'Agra & Northern Plains', label: 'Agra / Delhi', latitude: 27.1750, longitude: 78.0422, icon: 'account-balance' },
  { id: 'mewar', name: 'Rajasthan & Mewar Citadels', label: 'Mewar / Jaipur', latitude: 25.1478, longitude: 73.5878, icon: 'fort' },
  { id: 'gujarat', name: 'Gujarat Stepwells & Temples', label: 'Gujarat Circuit', latitude: 23.0225, longitude: 72.5714, icon: 'temple-hindu' },
  { id: 'caves', name: 'Maharashtra Rock-Cut Caves', label: 'Ajanta / Ellora', latitude: 20.5519, longitude: 75.7033, icon: 'landscape' },
  { id: 'deccan', name: 'Karnataka & Vijayanagara', label: 'Hampi / Deccan', latitude: 15.3350, longitude: 76.4600, icon: 'domain' },
];

interface CuratedCircuit {
  id: string;
  title: string;
  tag: string;
  duration: string;
  stopsCount: number;
  timeEstimate: string;
  description: string;
  centerLat: number;
  centerLng: number;
  placeIds: string[];
}

const CURATED_CIRCUITS: CuratedCircuit[] = [
  {
    id: 'golden_triangle',
    title: 'Mughal Architectural Axis',
    tag: 'ICONIC TRAIL',
    duration: 'full-day',
    stopsCount: 3,
    timeEstimate: '6.5 Hours',
    description: 'Taj Mahal, Agra Fort, and Fatehpur Sikri Imperial Court.',
    centerLat: 27.1750,
    centerLng: 78.0422,
    placeIds: ['IND-HER-01', 'IND-HER-03', 'IND-HER-04'],
  },
  {
    id: 'solanki_marvels',
    title: 'Solanki Stepwells & Solar Sanctuaries',
    tag: 'UNESCO TRAIL',
    duration: 'half-day',
    stopsCount: 3,
    timeEstimate: '4.5 Hours',
    description: 'Rani Ki Vav subterranean stepwell, Modhera Sun Temple, and Adalaj Vav.',
    centerLat: 23.8585,
    centerLng: 72.1015,
    placeIds: ['IND-HER-11', 'IND-HER-31', 'IND-HER-12'],
  },
  {
    id: 'mewar_citadels',
    title: 'Mewar Royal Fortresses of India',
    tag: 'ROYAL CITADELS',
    duration: 'full-day',
    stopsCount: 3,
    timeEstimate: '7 Hours',
    description: 'Kumbhalgarh 36-km Great Wall, Chittorgarh Fortress, and City Palace.',
    centerLat: 25.1478,
    centerLng: 73.5878,
    placeIds: ['IND-HER-26', 'IND-HER-27', 'IND-HER-28'],
  },
  {
    id: 'rock_cut_caves',
    title: 'Monolithic Rock-Cut Marvels',
    tag: 'ANCIENT CAVE WONDERS',
    duration: 'full-day',
    stopsCount: 3,
    timeEstimate: '6 Hours',
    description: 'Ajanta Frescoed Chaityas, Ellora Kailasa Temple, and Daulatabad Fort.',
    centerLat: 20.5519,
    centerLng: 75.7033,
    placeIds: ['IND-HER-08', 'IND-HER-09', 'IND-MH-05'],
  },
];

export default function PlanScreen() {
  const router = useRouter();
  const { interests, travelStyle, duration, language, userId } = useUserStore();
  const { t } = useTranslation();
  const location = useLocation();

  // Mode tabs: 'craft' (AI Builder) | 'saved' (Saved Trips)
  const [activeTab, setActiveTab] = useState<'craft' | 'saved'>('craft');

  // Form selections
  const [selectedHub, setSelectedHub] = useState<string>('gps');
  const [selectedDuration, setSelectedDuration] = useState<string>(duration || '90min');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    interests && interests.length > 0 ? interests : ['heritage']
  );
  const [selectedTravelStyle, setSelectedTravelStyle] = useState<string>(travelStyle || 'moderate');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [showForm, setShowForm] = useState(true);

  // Saved itineraries list
  const [savedTrips, setSavedTrips] = useState<ItineraryData[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadSavedItineraries();
  }, []);

  const loadSavedItineraries = async () => {
    try {
      const json = await AsyncStorage.getItem(SAVED_ITINERARIES_STORAGE_KEY);
      if (json) {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) {
          setSavedTrips(parsed);
        }
      }
    } catch (e) {
      console.warn('[Plan] Could not load saved itineraries:', e);
    }
  };

  const persistSavedItineraries = async (trips: ItineraryData[]) => {
    try {
      await AsyncStorage.setItem(SAVED_ITINERARIES_STORAGE_KEY, JSON.stringify(trips));
      setSavedTrips(trips);
    } catch (e) {
      console.warn('[Plan] Could not persist saved itineraries:', e);
    }
  };

  const getEffectiveCoordinates = (): { lat: number; lng: number; hubName: string } => {
    if (selectedHub === 'gps' && location.latitude && location.longitude) {
      return {
        lat: location.latitude,
        lng: location.longitude,
        hubName: `${location.city || 'Current'}, ${location.region || 'GPS'}`,
      };
    }
    const match = REGIONAL_HUBS.find((h) => h.id === selectedHub);
    if (match && match.latitude !== 0) {
      return { lat: match.latitude, lng: match.longitude, hubName: match.name };
    }
    // Fallback: Taj Mahal / Northern plains or user coords
    return {
      lat: location.latitude || 27.1750,
      lng: location.longitude || 78.0422,
      hubName: 'Northern Plains',
    };
  };

  const toggleInterest = (key: string) => {
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  const handleSelectCuratedCircuit = (circuit: CuratedCircuit) => {
    const allPlaces = usePlacesStore.getState().places.length > 0
      ? usePlacesStore.getState().places
      : ALL_SEED_PLACES;

    const matchedPlaces = circuit.placeIds
      .map((id) => allPlaces.find((p) => p.id === id || p.id?.toLowerCase() === id.toLowerCase()))
      .filter((p): p is Place => !!p);

    if (matchedPlaces.length > 0) {
      let totalTime = 0;
      const items: ItineraryItem[] = matchedPlaces.map((p, idx) => {
        const visitDuration = 45;
        const travelTime = idx === 0 ? 0 : 25;
        totalTime += visitDuration + travelTime;
        return {
          placeId: p.id,
          placeName: p.name,
          order: idx + 1,
          visitDuration,
          travelTime,
          travelMode: 'drive',
          reason: `Core highlight of the ${circuit.title}`,
          distance: idx === 0 ? 0 : 12.4,
          imageUrl: dynamicImageService.getPlaceImage(p.name, p.category, p.imageUrl),
          shortStory: p.heritageRecord?.shortStory || p.shortDescription || null,
          latitude: p.latitude,
          longitude: p.longitude,
        };
      });

      setItinerary({
        id: `curated-${circuit.id}-${Date.now()}`,
        title: circuit.title,
        duration: circuit.duration,
        totalTimeMinutes: totalTime,
        stops: items.length,
        items,
        savedAt: new Date().toISOString(),
      });
      setIsSaved(false);
      setShowForm(false);
    }
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    const { lat, lng } = getEffectiveCoordinates();

    try {
      const response: any = await itineraryApi.generate({
        latitude: lat,
        longitude: lng,
        interests: selectedInterests,
        duration: selectedDuration,
        travelStyle: selectedTravelStyle,
      });

      if (response?.data && response.data.items && response.data.items.length > 0) {
        setItinerary(response.data);
        setIsSaved(false);
        setShowForm(false);
      } else {
        const pool = usePlacesStore.getState().places.length > 0
          ? usePlacesStore.getState().places
          : ALL_SEED_PLACES;
        const dynamicTour = generateDynamicItinerary(
          pool,
          lat,
          lng,
          selectedInterests,
          selectedDuration,
          selectedTravelStyle
        );
        setItinerary(dynamicTour);
        setIsSaved(false);
        setShowForm(false);
      }
    } catch (error) {
      const pool = usePlacesStore.getState().places.length > 0
        ? usePlacesStore.getState().places
        : ALL_SEED_PLACES;
      const dynamicTour = generateDynamicItinerary(
        pool,
        lat,
        lng,
        selectedInterests,
        selectedDuration,
        selectedTravelStyle
      );
      setItinerary(dynamicTour);
      setIsSaved(false);
      setShowForm(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveItinerary = async () => {
    if (!itinerary) return;

    const toSave: ItineraryData = {
      ...itinerary,
      id: itinerary.id || `trip-${Date.now()}`,
      savedAt: new Date().toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    const existingFiltered = savedTrips.filter((t) => t.id !== toSave.id && t.title !== toSave.title);
    const updated = [toSave, ...existingFiltered];
    await persistSavedItineraries(updated);
    setIsSaved(true);

    // Also attempt background sync to server
    try {
      await itineraryApi.save({
        userId: userId || 'default-user',
        title: toSave.title,
        duration: toSave.duration,
        totalTime: toSave.totalTimeMinutes,
        items: toSave.items,
      });
    } catch (e) {
      // Local save succeeded, non-blocking network warning
    }

    Alert.alert('Itinerary Saved', 'This heritage tour is safely stored in "My Saved Trips" and available offline.');
  };

  const handleDeleteSavedTrip = async (tripId?: string) => {
    if (!tripId) return;
    const updated = savedTrips.filter((t) => t.id !== tripId);
    await persistSavedItineraries(updated);
  };

  const handleRemoveStop = (order: number) => {
    if (!itinerary) return;
    const remaining = itinerary.items.filter((i) => i.order !== order);
    if (remaining.length === 0) {
      resetPlan();
      return;
    }
    const reindexed = remaining.map((item, idx) => ({ ...item, order: idx + 1 }));
    const newTotal = reindexed.reduce((acc, curr) => acc + curr.visitDuration + curr.travelTime, 0);

    setItinerary({
      ...itinerary,
      items: reindexed,
      stops: reindexed.length,
      totalTimeMinutes: newTotal,
    });
  };

  const resetPlan = () => {
    setItinerary(null);
    setShowForm(true);
    setIsSaved(false);
  };

  const handleStartNavigation = (item?: ItineraryItem) => {
    if (!itinerary || itinerary.items.length === 0) return;
    const target = item || itinerary.items[0];
    const allPlaces = usePlacesStore.getState().places;
    const matched =
      allPlaces.find((p) => p.id === target.placeId) ||
      ALL_SEED_PLACES.find((p) => p.id === target.placeId);
    const lat = matched?.latitude || target.latitude || location.latitude || 27.175;
    const lng = matched?.longitude || target.longitude || location.longitude || 78.0422;

    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(target.placeName)})`,
      web: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  };

  const handleViewOnRadarMap = () => {
    if (itinerary && itinerary.items.length > 0) {
      const first = itinerary.items[0];
      router.push({
        pathname: '/(tabs)/explore',
        params: {
          destinationId: first.placeId,
          destinationName: first.placeName,
          routeTo: 'true',
        },
      });
    } else {
      router.push('/(tabs)/explore');
    }
  };

  const handleShareItinerary = async () => {
    if (!itinerary) return;
    try {
      const stopsList = itinerary.items
        .map((i) => `${i.order}. ${i.placeName} (~${i.visitDuration} mins)`)
        .join('\n');
      const shareMessage = `🏛️ Yatra Heritage Tour: ${itinerary.title}\n⏱️ Duration: ~${itinerary.totalTimeMinutes} mins (${itinerary.stops} Stops)\n\nCircuit Itinerary:\n${stopsList}\n\nPlanned with Yatra — India Heritage Companion`;
      await Share.share({ message: shareMessage });
    } catch (e) {
      // Ignored
    }
  };

  const { hubName } = getEffectiveCoordinates();

  return (
    <View style={styles.container}>
      {/* Editorial Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>AI EXPEDITION PLANNER</Text>
          <Text style={styles.headerTitle}>Heritage Itinerary</Text>
        </View>
        {itinerary && (
          <TouchableOpacity style={styles.resetBtn} onPress={resetPlan} activeOpacity={0.8}>
            <MaterialIcons name="restart-alt" size={18} color={Colors.primary} />
            <Text style={styles.resetText}>New Plan</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Segmented Tab Switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'craft' && styles.tabBtnActive]}
          onPress={() => setActiveTab('craft')}
          activeOpacity={0.85}
        >
          <MaterialIcons
            name="auto-awesome"
            size={16}
            color={activeTab === 'craft' ? Colors.primary : Colors.textMuted}
          />
          <Text style={[styles.tabBtnText, activeTab === 'craft' && styles.tabBtnTextActive]}>
            Craft Route
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'saved' && styles.tabBtnActive]}
          onPress={() => setActiveTab('saved')}
          activeOpacity={0.85}
        >
          <MaterialIcons
            name="bookmark"
            size={16}
            color={activeTab === 'saved' ? Colors.primary : Colors.textMuted}
          />
          <Text style={[styles.tabBtnText, activeTab === 'saved' && styles.tabBtnTextActive]}>
            Saved Trips ({savedTrips.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'saved' ? (
          /* ================= SAVED TRIPS TAB ================= */
          <View style={styles.savedSection}>
            {savedTrips.length === 0 ? (
              <View style={styles.emptySavedState}>
                <MaterialIcons name="bookmark-border" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No Saved Itineraries Yet</Text>
                <Text style={styles.emptySubtitle}>
                  Generate a customized cultural tour or pick one of our curated national trails to save it for offline travel.
                </Text>
                <TouchableOpacity
                  style={styles.browseCuratedBtn}
                  onPress={() => setActiveTab('craft')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.browseCuratedBtnText}>Plan Your First Itinerary</Text>
                </TouchableOpacity>
              </View>
            ) : (
              savedTrips.map((trip, idx) => (
                <View key={trip.id || idx} style={styles.savedTripCard}>
                  <View style={styles.savedTripHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.savedTripTitle}>{trip.title}</Text>
                      <Text style={styles.savedTripMeta}>
                        {trip.stops} Stops · ~{trip.totalTimeMinutes} mins · {trip.savedAt || 'Saved'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteSavedTrip(trip.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <MaterialIcons name="delete-outline" size={20} color={Colors.textMuted} />
                    </TouchableOpacity>
                  </View>

                  {/* Stop Preview Pills */}
                  <View style={styles.savedStopsPillRow}>
                    {trip.items.slice(0, 4).map((item, sIdx) => (
                      <View key={sIdx} style={styles.savedStopPill}>
                        <Text style={styles.savedStopPillText} numberOfLines={1}>
                          {sIdx + 1}. {item.placeName}
                        </Text>
                      </View>
                    ))}
                    {trip.items.length > 4 && (
                      <View style={styles.savedStopPillMore}>
                        <Text style={styles.savedStopPillMoreText}>+{trip.items.length - 4}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.savedTripActions}>
                    <TouchableOpacity
                      style={styles.openTripBtn}
                      onPress={() => {
                        setItinerary(trip);
                        setIsSaved(true);
                        setShowForm(false);
                        setActiveTab('craft');
                      }}
                      activeOpacity={0.85}
                    >
                      <MaterialIcons name="visibility" size={16} color={Colors.primary} />
                      <Text style={styles.openTripBtnText}>View Itinerary</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : showForm ? (
          /* ================= CRAFT ROUTE: FORM VIEW ================= */
          <View style={styles.formSection}>
            {/* Curated Pre-Made Indian Circuits */}
            <View style={styles.curatedSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.formSectionTitle}>One-Tap Curated Circuits</Text>
                <Text style={styles.sectionBadge}>VERIFIED TRAILS</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.curatedScrollContent}
              >
                {CURATED_CIRCUITS.map((circuit) => (
                  <TouchableOpacity
                    key={circuit.id}
                    style={styles.curatedCard}
                    onPress={() => handleSelectCuratedCircuit(circuit)}
                    activeOpacity={0.88}
                  >
                    <View style={styles.curatedBadgeRow}>
                      <Text style={styles.curatedTag}>{circuit.tag}</Text>
                      <View style={styles.curatedTimeBadge}>
                        <MaterialIcons name="schedule" size={11} color={Colors.primary} />
                        <Text style={styles.curatedTimeText}>{circuit.timeEstimate}</Text>
                      </View>
                    </View>
                    <Text style={styles.curatedTitle}>{circuit.title}</Text>
                    <Text style={styles.curatedDesc} numberOfLines={2}>
                      {circuit.description}
                    </Text>
                    <View style={styles.curatedFooter}>
                      <Text style={styles.curatedStopsCount}>{circuit.stopsCount} Iconic Monuments</Text>
                      <View style={styles.curatedArrowWrap}>
                        <MaterialIcons name="arrow-forward" size={14} color={Colors.primary} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.divider} />

            {/* Custom Circuit Builder */}
            <Text style={styles.formSectionTitle}>Customize Your Personal Route</Text>

            {/* 1. Regional Hub Selector */}
            <Text style={styles.formLabel}>EXPLORATION HUB / REGION</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hubScrollRow}
            >
              {REGIONAL_HUBS.map((hub) => {
                const isActive = selectedHub === hub.id;
                return (
                  <TouchableOpacity
                    key={hub.id}
                    style={[styles.hubChip, isActive && styles.hubChipActive]}
                    onPress={() => setSelectedHub(hub.id)}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name={hub.icon as any}
                      size={16}
                      color={isActive ? Colors.primary : Colors.textMuted}
                    />
                    <Text style={[styles.hubChipText, isActive && styles.hubChipTextActive]}>
                      {hub.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.activeHubNotice}>
              <MaterialIcons name="place" size={14} color={Colors.primary} />
              <Text style={styles.activeHubText} numberOfLines={1}>
                Routing centered around: <Text style={{ color: Colors.text, fontWeight: '700' }}>{hubName}</Text>
              </Text>
            </View>

            {/* 2. Duration Grid */}
            <Text style={[styles.formLabel, { marginTop: Spacing.lg }]}>TIME ALLOTMENT</Text>
            <View style={styles.durationGrid}>
              {DURATION_OPTIONS.map((opt) => {
                const isActive = selectedDuration === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[styles.durationCard, isActive && styles.durationActive]}
                    onPress={() => setSelectedDuration(opt.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.durationValue, isActive && styles.activeText]}>
                      {opt.label}
                    </Text>
                    <Text style={styles.durationDesc}>{opt.description}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 3. Travel Style Pace */}
            <Text style={[styles.formLabel, { marginTop: Spacing.lg }]}>TRAVEL STYLE & PACE</Text>
            <View style={styles.travelStyleRow}>
              {TRAVEL_STYLES.map((style) => {
                const isActive = selectedTravelStyle === style.key;
                return (
                  <TouchableOpacity
                    key={style.key}
                    style={[styles.travelStyleCard, isActive && styles.travelStyleActive]}
                    onPress={() => setSelectedTravelStyle(style.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.styleIcon}>{style.icon}</Text>
                    <Text style={[styles.styleLabel, isActive && styles.activeText]}>{style.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 4. Interests Multi-Select */}
            <Text style={[styles.formLabel, { marginTop: Spacing.lg }]}>CULTURAL INTERESTS</Text>
            <View style={styles.interestGrid}>
              {INTERESTS_OPTIONS.map((opt) => {
                const isActive = selectedInterests.includes(opt.key);
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[styles.interestChip, isActive && styles.interestActive]}
                    onPress={() => toggleInterest(opt.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.interestIcon}>{opt.icon}</Text>
                    <Text style={[styles.interestLabel, isActive && styles.activeText]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              style={styles.generateBtn}
              onPress={generateItinerary}
              disabled={isGenerating || selectedInterests.length === 0}
              activeOpacity={0.88}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator color="#0A0A0A" />
                  <Text style={styles.generateText}>Calculating Optimal Heritage Route...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="auto-awesome" size={20} color="#0A0A0A" />
                  <Text style={styles.generateText}>Generate AI Heritage Route</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : itinerary ? (
          /* ================= CRAFT ROUTE: GENERATED ITINERARY VIEW ================= */
          <View style={styles.itinerarySection}>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryTitle}>{itinerary.title}</Text>
                  <Text style={styles.summarySubtitle}>
                    Optimized itinerary considering visitor pace and travel times
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.saveActionBtn, isSaved && styles.saveActionBtnActive]}
                  onPress={handleSaveItinerary}
                  activeOpacity={0.8}
                >
                  <MaterialIcons
                    name={isSaved ? 'bookmark' : 'bookmark-border'}
                    size={20}
                    color={isSaved ? Colors.primary : Colors.text}
                  />
                  <Text style={[styles.saveActionText, isSaved && styles.saveActionTextActive]}>
                    {isSaved ? 'Saved' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.summaryStatsRow}>
                <View style={styles.summaryItem}>
                  <MaterialIcons name="schedule" size={18} color={Colors.primary} />
                  <Text style={styles.summaryValue}>~{itinerary.totalTimeMinutes} min</Text>
                  <Text style={styles.summaryLabel}>Total Duration</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <MaterialIcons name="place" size={18} color={Colors.primary} />
                  <Text style={styles.summaryValue}>{itinerary.stops}</Text>
                  <Text style={styles.summaryLabel}>Planned Stops</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <MaterialIcons name="route" size={18} color={Colors.primary} />
                  <Text style={styles.summaryValue}>{itinerary.duration}</Text>
                  <Text style={styles.summaryLabel}>Pace Style</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions Bar */}
            <View style={styles.quickBar}>
              <TouchableOpacity
                style={styles.quickBarBtn}
                onPress={handleViewOnRadarMap}
                activeOpacity={0.85}
              >
                <MaterialIcons name="radar" size={16} color={Colors.primary} />
                <Text style={styles.quickBarText}>View on Radar Map</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickBarBtn}
                onPress={handleShareItinerary}
                activeOpacity={0.85}
              >
                <MaterialIcons name="share" size={16} color={Colors.textSecondary} />
                <Text style={styles.quickBarText}>Share Route</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickBarBtn}
                onPress={() => generateItinerary()}
                activeOpacity={0.85}
              >
                <MaterialIcons name="refresh" size={16} color={Colors.textSecondary} />
                <Text style={styles.quickBarText}>Re-Roll</Text>
              </TouchableOpacity>
            </View>

            {/* Timeline Stops */}
            <Text style={styles.timelineTitle}>Itinerary Stops ({itinerary.stops})</Text>
            {itinerary.items.map((item, idx) => (
              <TouchableOpacity
                key={item.placeId || idx}
                activeOpacity={0.9}
                onPress={() => router.push(`/place/${item.placeId}`)}
              >
                <TimelineItem
                  item={item}
                  isLast={idx === itinerary.items.length - 1}
                  onNavigate={() => handleStartNavigation(item)}
                  onRemove={() => handleRemoveStop(item.order)}
                />
              </TouchableOpacity>
            ))}

            {/* Bottom Floating Navigation Action */}
            <View style={styles.itineraryActions}>
              <TouchableOpacity
                style={styles.startNavBtn}
                onPress={() => handleStartNavigation()}
                activeOpacity={0.88}
              >
                <MaterialIcons name="navigation" size={20} color="#0A0A0A" />
                <Text style={styles.startNavText}>Start Turn-by-Turn Route</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function generateDynamicItinerary(
  places: Place[],
  userLat: number,
  userLng: number,
  selectedInterests: string[],
  selectedDuration: string,
  travelStyle: string
): ItineraryData {
  let targetStops = 3;
  let targetMinutes = 90;
  let tourTitle = '90-Minute Heritage Circuit';

  if (
    selectedDuration === 'half-day' ||
    selectedDuration === 'halfDay' ||
    selectedDuration === 'half_day' ||
    selectedDuration === '4h'
  ) {
    targetStops = 4;
    targetMinutes = 240;
    tourTitle = 'Half-Day Cultural Odyssey';
  } else if (
    selectedDuration === 'full-day' ||
    selectedDuration === 'fullDay' ||
    selectedDuration === 'full_day' ||
    selectedDuration === '8h'
  ) {
    targetStops = 6;
    targetMinutes = 480;
    tourTitle = 'Full-Day Grand Heritage Expedition';
  } else if (selectedDuration === '30min') {
    targetStops = 2;
    targetMinutes = 45;
    tourTitle = 'Express Heritage Stroll';
  }

  const pool = places && places.length > 0 ? places : ALL_SEED_PLACES;

  // Filter & score places by proximity and category match
  const scored = pool.map((p) => {
    const dist = haversineDistance(userLat, userLng, p.latitude, p.longitude);
    const categoryMatches = selectedInterests.length === 0 || selectedInterests.includes(p.category);
    const score = (categoryMatches ? 10 : 0) + (p.rating || 4.5) * 2 - Math.min(dist / 30, 10);
    return {
      place: p,
      distance: dist,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const selectedStops = scored.slice(0, targetStops);
  let totalTime = 0;

  const items: ItineraryItem[] = selectedStops.map((item, index) => {
    const p = item.place;
    const basePace = travelStyle === 'rushed' ? 20 : travelStyle === 'leisurely' ? 45 : 30;
    const visitDuration = Math.round(targetMinutes / (targetStops * 1.25)) || basePace;
    const travelTime = index === 0 ? 5 : Math.max(8, Math.min(45, Math.round(item.distance * 2.2)));
    totalTime += visitDuration + travelTime;

    return {
      placeId: p.id,
      placeName: p.name,
      order: index + 1,
      visitDuration,
      travelTime,
      travelMode: item.distance <= 2.5 ? 'walk' : 'drive',
      reason: `Matches your interest in ${p.category} (${p.rating || 4.8}★ rating, ${item.distance.toFixed(1)} km away)`,
      distance: Number(item.distance.toFixed(1)),
      imageUrl: dynamicImageService.getPlaceImage(p.name, p.category, p.imageUrl),
      shortStory: p.heritageRecord?.shortStory || p.shortDescription || null,
      latitude: p.latitude,
      longitude: p.longitude,
    };
  });

  return {
    title: tourTitle,
    duration: selectedDuration,
    totalTimeMinutes: totalTime,
    stops: items.length,
    items,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 56,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: Colors.primary,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes['2xl'],
    fontWeight: '800',
    color: Colors.text,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceHighlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  resetText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 4,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
  },
  tabBtnActive: {
    backgroundColor: Colors.surfaceHighlight,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabBtnTextActive: {
    color: Colors.text,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  curatedSection: {
    marginTop: Spacing.base,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  formSectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionBadge: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.primary,
  },
  curatedScrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 6,
    gap: 14,
  },
  curatedCard: {
    width: 250,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  curatedBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  curatedTag: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
  },
  curatedTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surfaceHighlight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  curatedTimeText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  curatedTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  curatedDesc: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  curatedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  curatedStopsCount: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  curatedArrowWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.lg,
  },
  formSection: {
    paddingTop: Spacing.xs,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: Colors.textMuted,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    marginTop: Spacing.base,
  },
  hubScrollRow: {
    paddingHorizontal: Spacing.xl,
    gap: 10,
  },
  hubChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hubChipActive: {
    backgroundColor: Colors.surfaceHighlight,
    borderColor: Colors.primary,
  },
  hubChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  hubChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  activeHubNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: Spacing.xl,
    marginTop: 8,
    backgroundColor: 'rgba(212, 175, 124, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  activeHubText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: Spacing.xl,
  },
  durationCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  durationActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceHighlight,
  },
  durationValue: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.text,
  },
  durationDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  travelStyleRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.xl,
  },
  travelStyleCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  travelStyleActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceHighlight,
  },
  styleIcon: {
    fontSize: 20,
  },
  styleLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: Spacing.xl,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  interestActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceHighlight,
  },
  interestIcon: {
    fontSize: 16,
  },
  interestLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing['2xl'],
    paddingVertical: 16,
    borderRadius: BorderRadius.xl,
    ...Shadows.glow,
  },
  generateText: {
    fontSize: Typography.sizes.base,
    fontWeight: '800',
    color: '#0A0A0A',
    letterSpacing: 0.3,
  },
  itinerarySection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.base,
  },
  summaryTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  saveActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceHighlight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveActionBtnActive: {
    borderColor: Colors.primary,
  },
  saveActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  saveActionTextActive: {
    color: Colors.primary,
  },
  summaryStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  quickBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  quickBarBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickBarText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  timelineTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  itineraryActions: {
    marginTop: Spacing.lg,
  },
  startNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.xl,
    ...Shadows.glow,
  },
  startNavText: {
    fontSize: Typography.sizes.base,
    fontWeight: '800',
    color: '#0A0A0A',
    letterSpacing: 0.3,
  },
  savedSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
  },
  emptySavedState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  browseCuratedBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
  },
  browseCuratedBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  savedTripCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  savedTripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  savedTripTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 3,
  },
  savedTripMeta: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  savedStopsPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  savedStopPill: {
    backgroundColor: Colors.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    maxWidth: '48%',
  },
  savedStopPillText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  savedStopPillMore: {
    backgroundColor: Colors.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  savedStopPillMoreText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  savedTripActions: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  openTripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  openTripBtnText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
});
