import { Redirect } from 'expo-router';
import { useUserStore } from '../stores';

export default function Index() {
  const isOnboarded = useUserStore((s) => s.isOnboarded);
  return <Redirect href={isOnboarded ? '/(tabs)' : '/onboarding'} />;
}
