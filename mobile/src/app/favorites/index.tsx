import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows, CATEGORY_COLORS } from '../../constants/theme';
import { usePlacesStore, useUserStore } from '../../stores';
import { placesApi, favoritesApi } from '../../services/api';
import { useTranslation } from '../../hooks/useTranslation';
import { ALL_SEED_PLACES } from '../../utils/seedPlaces';
import { dynamicImageService } from '../../services/dynamicImageService';

function FavoriteCard({ item, onPress, onToggle }: { item: any; onPress: () => void; onToggle: () => void }) {
  const initialUri = dynamicImageService.getPlaceImage(item.name, item.category, item.imageUrl);
  const [imgUri, setImgUri] = useState<string>(initialUri);
  const categoryColor = CATEGORY_COLORS[item.category] || Colors.primary;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: imgUri,
          headers: {
            'User-Agent':
              'YatraHeritageCompanion/1.0 (https://github.com/Priyankkhatri/SIH-THE-CODER-CULT; contact@yatra.in)',
          },
        }}
        style={styles.cardImage}
        contentFit="cover"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        transition={300}
        onError={() => setImgUri(dynamicImageService.getArchitecturalFallback(item.name, item.category, 1))}
      />
      <View style={styles.cardOverlay} />

      <TouchableOpacity
        style={styles.heartBtn}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <MaterialIcons name="favorite" size={20} color={Colors.error} />
      </TouchableOpacity>

      <View style={styles.cardBody}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.name}</Text>
        {item.shortDescription && (
          <Text style={styles.cardDesc} numberOfLines={2}>{item.shortDescription}</Text>
        )}
        <View style={styles.cardFooter}>
          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={16} color={Colors.primary} />
            <Text style={styles.ratingText}>{item.rating || '4.0'}</Text>
          </View>
          {item.openingHours && (
            <View style={styles.hoursRow}>
              <MaterialIcons name="schedule" size={14} color={Colors.textMuted} />
              <Text style={styles.hoursText} numberOfLines={1}>{item.openingHours}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { favorites, toggleFavorite, loadFavorites } = usePlacesStore();

  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavoritePlaces();
  }, [favorites]);

  const fetchFavoritePlaces = async () => {
    setIsLoading(true);
    try {
      const res: any = await placesApi.getAll();
      const list = (res?.success && Array.isArray(res.data)) ? res.data : (Array.isArray(res) ? res : []);
      if (list.length > 0) {
        const favList = list.filter((p: any) => favorites.includes(p.id));
        setPlaces(favList);
      } else {
        const storePlaces = usePlacesStore.getState().places.length > 0
          ? usePlacesStore.getState().places
          : ALL_SEED_PLACES;
        const favList = storePlaces.filter((p: any) => favorites.includes(p.id));
        setPlaces(favList);
      }
    } catch (e) {
      const storePlaces = usePlacesStore.getState().places.length > 0
        ? usePlacesStore.getState().places
        : ALL_SEED_PLACES;
      const favList = storePlaces.filter((p: any) => favorites.includes(p.id));
      setPlaces(favList);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <FavoriteCard
      item={item}
      onPress={() => router.push(`/place/${item.id}`)}
      onToggle={() => toggleFavorite(item.id)}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Favorites</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{places.length}</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Fetching saved monuments...</Text>
        </View>
      ) : places.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <MaterialIcons name="favorite-border" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubtitle}>
            Save historical monuments and museum exhibits to quickly access them offline and review heritage chronicles.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.replace('/(tabs)/explore')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="explore" size={20} color={Colors.background} />
            <Text style={styles.exploreBtnText}>Discover Heritage Sites</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Typography.fontFamily.serif,
  },
  countBadge: {
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  countText: {
    color: Colors.primary,
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.base,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['2xl'],
    gap: Spacing.base,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.base,
    ...Shadows.md,
  },
  exploreBtnText: {
    color: Colors.background,
    fontSize: Typography.sizes.base,
    fontWeight: '700',
  },
  listContent: {
    padding: Spacing.base,
    gap: Spacing.base,
  },
  card: {
    height: 200,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'flex-end',
    ...Shadows.md,
  },
  cardImage: {
    ...StyleSheet.absoluteFill,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 10, 15, 0.7)',
  },
  heartBtn: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(10, 10, 15, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: Spacing.base,
    gap: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    color: Colors.text,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Typography.fontFamily.serif,
  },
  cardDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text,
    fontWeight: '700',
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: '700',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hoursText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    maxWidth: 150,
  },
});
