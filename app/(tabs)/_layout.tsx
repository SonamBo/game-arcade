/**
 * The five-tab hub (§4 tab bar). Five equal columns, labels flush left in their
 * column at 10px/800. The active tab is accent type plus a 3px accent rule
 * sitting on top of the 2px divider. DUELS carries a 6px accent dot when a
 * ghost is waiting.
 *
 * This group also gates onboarding: a fresh install is redirected to the
 * "pick your three" screen before the shelf can be reached.
 */
import { Redirect, Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStore } from '@/store';
import { AccentDot } from '@/components/ui/primitives';
import { C, MIN_TAP, S } from '@/theme/tokens';
import { text } from '@/theme/type';

const LABELS: Record<string, string> = {
  index: 'Play',
  feed: 'Feed',
  duels: 'Duels',
  shop: 'Shop',
  me: 'Me',
};

/** A ghost is waiting → DUELS dot. Wired to real duel state in stage 06. */
const GHOST_WAITING = true;

/**
 * Minimal shape of the tab-bar render props we use. Expo Router hands this the
 * full @react-navigation BottomTabBarProps at runtime; typing only what we read
 * keeps us off that transitive dependency's type surface.
 */
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
    <View style={{ borderTopWidth: S.rule, borderTopColor: C.divider, backgroundColor: C.bg, paddingBottom: insets.bottom }}>
      <View style={{ flexDirection: 'row' }}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const label = LABELS[route.name] ?? route.name;
          return (
            <Pressable
              key={route.key}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
              style={{ flex: 1, minHeight: MIN_TAP }}
            >
              {/* 3px accent rule on top of the divider, active only */}
              <View style={{ height: 3, backgroundColor: focused ? C.accent : 'transparent' }} />
              <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={text('kicker', { color: focused ? C.accentDeep : C.n600 })}>{label}</Text>
                {route.name === 'duels' && GHOST_WAITING ? <AccentDot size={6} /> : null}
                <View style={{ flex: 1 }} />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const onboardingComplete = useStore((s) => s.onboardingComplete);
  if (!onboardingComplete) return <Redirect href="/onboarding" />;

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="duels" />
      <Tabs.Screen name="shop" />
      <Tabs.Screen name="me" />
    </Tabs>
  );
}
