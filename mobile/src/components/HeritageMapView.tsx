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
  onSelectPlace,
  onPlaceDetails,
  userLocation,
  mapRef,
}: HeritageMapViewProps) {
  return (
    <MapView
      ref={mapRef as any}
      style={styles.map}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      customMapStyle={Platform.OS === 'android' ? DARK_MAP_STYLE : undefined}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      }}
      showsUserLocation
      showsMyLocationButton={false}
      showsCompass={false}
    >
      {places.map((place) => (
        <Marker
          key={place.id}
          coordinate={{ latitude: place.latitude, longitude: place.longitude }}
          pinColor={CATEGORY_COLORS[place.category] || Colors.primary}
          onPress={() => onSelectPlace(place)}
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
    ...StyleSheet.absoluteFillObject,
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
