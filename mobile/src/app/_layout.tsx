import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="auth/register" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="place/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="place/[id]/heritage"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="camera/index"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="camera/result"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="itinerary/create" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="itinerary/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="favorites/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings/language" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings/preferences" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings/downloads" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="error" options={{ animation: 'fade' }} />
        <Stack.Screen name="+not-found" options={{ animation: 'fade' }} />
      </Stack>
    </>
  );
}
