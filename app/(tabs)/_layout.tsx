/**
 * The tab hub (§5.8). Four tabs — Home · Duels · Feed · Me — with Phosphor-style
 * duotone icons at 24px and T.micro labels (the only place letter-spacing
 * survives). Selected is cyan, unselected n700. No top rule; the bar sits on the
 * paper. Duels carries a magenta dot when a ghost is waiting. Shop is still a
 * route but is reached from the coins pill, so it is hidden from the bar.
 *
 * Routing is unchanged: onboarding still gates a fresh install.
 */
import { Redirect, Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Dot } from '@/components/ui/primitives';
import { TabIcon } from '@/components/ui/icons';
import type { TabIconName } from '@/components/ui/icons';
import { useStore } from '@/store';
import { C, MIN_TAP, S } from '@/theme/tokens';
import { text } from '@/theme/type';

const TABS: { name: string; label: string; icon: TabIconName }[] = [
  { name: 'index', label: 'Home', icon: 'home' },
  { name: 'duels', label: 'Duels', icon: 'duels' },
  { name: 'feed', label: 'Feed', icon: 'feed' },
  { name: 'me', label: 'Me', icon: 'me' },
];

/** A ghost is waiting → Duels dot. Wired to real duel state in stage 06. */
const GHOST_WAITING = true;

type TabBarShape = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (e: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

function TabBar({ state, navigation }: TabBarShape) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: C.bg, paddingTop: 10, paddingBottom: insets.bottom + 12, flexDirection: 'row' }}>
      {TABS.map((tab) => {
        const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
        const focused = state.index === routeIndex;
        const route = state.routes[routeIndex];
        const color = focused ? C.accent : C.n700;
        return (
          <Pressable
            key={tab.name}
            onPress={() => {
              if (!route) return;
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(tab.name);
            }}
            style={{ flex: 1, minHeight: MIN_TAP, alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <View>
              <TabIcon name={tab.icon} color={color} />
              {tab.name === 'duels' && GHOST_WAITING ? (
                <View style={{ position: 'absolute', top: -2, right: -4 }}>
                  <Dot color={C.urgent} size={6} />
                </View>
              ) : null}
            </View>
            <Text style={[text('micro', { color, uppercase: false }), { letterSpacing: 1.2 }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  const onboardingComplete = useStore((s) => s.onboardingComplete);
  if (!onboardingComplete) return <Redirect href="/onboarding" />;

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="duels" />
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="me" />
      {/* Shop stays a route but is reached from the coins pill, not a tab. */}
      <Tabs.Screen name="shop" options={{ href: null }} />
    </Tabs>
  );
}
