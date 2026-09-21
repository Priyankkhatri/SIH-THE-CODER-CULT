import { Tabs } from 'expo-router';
import { useTranslation } from '../../hooks/useTranslation';
import { AnimatedBottomTabBar } from '../../components/AnimatedBottomTabBar';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <AnimatedBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('tabs.explore'),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: t('tabs.aiGuide'),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: t('tabs.plan'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
        }}
      />
    </Tabs>
  );
}
