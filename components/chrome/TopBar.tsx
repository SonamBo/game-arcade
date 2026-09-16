/**
 * Top bar (§5.3). Height 64, no rules. Wordmark "Arcade" in T.band taps home.
 * Coins are one neutral pill with a cyan dot, tapping Shop. The avatar circle
 * taps the profile and carries a 7px magenta badge when the inbox needs an
 * answer. Offline shows as a T.meta line under the wordmark — not a coloured
 * label. Streak and Inbox have left the bar (streak → Profile).
 */
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Dot } from '@/components/ui/primitives';
import { useOnline } from '@/lib/useOnline';
import { useStore } from '@/store';
import { C, R, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export function TopBar() {
  const insets = useSafeAreaInsets();
  const coins = useStore((s) => s.wallet.coins);
  const needsAnswer = useStore((s) => s.replies.length > 0);
  const online = useOnline();

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: C.bg }}>
      <View style={{ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: S.inset }}>
        <Pressable onPress={() => router.navigate('/')} style={{ marginRight: 'auto' }}>
          <Text style={text('band')}>Arcade</Text>
          {!online ? <Text style={text('meta', { color: C.n700 })}>Offline · syncing</Text> : null}
        </Pressable>

        {/* coins → shop */}
        <Pressable
          onPress={() => router.navigate('/shop')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: C.n200, paddingHorizontal: 11, paddingVertical: 6, borderRadius: R.md }}
        >
          <Dot color={C.accent} />
          <Text style={[text('body', { numeric: true }), { fontSize: 14 }]}>{coins.toLocaleString()}</Text>
        </Pressable>

        {/* avatar → profile, with inbox badge */}
        <Pressable onPress={() => router.navigate('/me')} hitSlop={8} style={{ width: 32, height: 32 }}>
          <View style={{ width: 32, height: 32, borderRadius: R.pill, backgroundColor: C.n300, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[text('meta', { color: C.n800 }), { fontSize: 14 }]}>S</Text>
          </View>
          {needsAnswer ? (
            <View style={{ position: 'absolute', top: -1, right: -1 }}>
              <Dot color={C.urgent} />
            </View>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}
