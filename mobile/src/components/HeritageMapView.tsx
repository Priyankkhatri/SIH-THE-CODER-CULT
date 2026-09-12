import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, CATEGORY_COLORS } from '../constants/theme';
import type { Place } from '../stores';

interface HeritageMapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onPlaceDetails: (placeId: string) => void;
  userLocation: { latitude: number; longitude: number };
  mapRef?: React.RefObject<MapView | null>;
}

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#171f2e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#255b4a' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#023e58' }] },
];

export function HeritageMapView({
  places,
  selectedPlace,
  onSelectPlace,
  onPlaceDetails,
  userLocation,
  mapRef,
}: HeritageMapViewProps) {
  // 1. Sanitize & filter valid numeric coordinates to prevent any map crash
  const validPlaces = React.useMemo(() => {
    return (places || []).filter(
      (p) =>
        p &&
        typeof p.latitude === 'number' &&
        typeof p.longitude === 'number' &&
        !isNaN(p.latitude) &&
        !isNaN(p.longitude) &&
        p.latitude > 5 &&
        p.longitude > 5
    );
  }, [places]);

  // 2. Smooth auto-focus camera when a place is tapped or searched
  React.useEffect(() => {
    if (selectedPlace && mapRef?.current && typeof (mapRef.current as any).animateToRegion === 'function') {
      const lat = Number(selectedPlace.latitude);
      const lng = Number(selectedPlace.longitude);
      if (!isNaN(lat) && !isNaN(lng) && lat > 0) {
        (mapRef.current as any).animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          500
        );
      }
    }
  }, [selectedPlace]);

  // 3. Default wide-angle viewport displaying all of Gujarat & West India heritage
  const initialRegion = {
    latitude: 22.85,
    longitude: 72.35,
    latitudeDelta: 3.6,
    longitudeDelta: 3.6,
  };

  return (
    <MapView
      ref={mapRef as any}
      style={styles.map}
      initialRegion={initialRegion}
      customMapStyle={DARK_MAP_STYLE}
      loadingEnabled={true}
      loadingIndicatorColor={Colors.primary}
      loadingBackgroundColor={Colors.background}
      showsUserLocation={Boolean(userLocation?.latitude)}
      showsMyLocationButton={false}
      showsCompass={true}
      toolbarEnabled={false}
    >
      {validPlaces.map((place) => (
        <Marker
          key={place.id}
          coordinate={{ latitude: place.latitude, longitude: place.longitude }}
          pinColor={CATEGORY_COLORS[place.category] || Colors.primary}
          onPress={() => onSelectPlace(place)}
          tracksViewChanges={false}
        >
          <Callout tooltip onPress={() => onPlaceDetails(place.id)}>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutTitle}>{place.name}</Text>
              <Text style={styles.calloutDesc} numberOfLines={2}>
                {place.shortDescription}
              </Text>
              {place.rating && (
                <View style={styles.calloutRating}>
                  <MaterialIcons name="star" size={12} color={Colors.primary} />
                  <Text style={styles.calloutRatingText}>{place.rating}</Text>
                </View>
              )}
              <Text style={styles.calloutTap}>Tap for details →</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFill,
  },
  calloutContainer: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 220,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  calloutDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  calloutRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  calloutRatingText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  calloutTap: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
});
