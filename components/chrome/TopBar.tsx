/**
 * Top bar (§4) — hub screens only. Height 40. Left: wordmark (taps home). Then
 * coin balance with a 9px accent square (taps Shop). Then STREAK + day count.
 * Then INBOX with a 7px accent dot when unread. Cells separated by 1px vertical
 * rules, closed by the 2px section rule beneath.
 *
 * Coins are global and never labelled per-game.
 */
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStore } from '@/store';
import { C, S } from '@/theme/tokens';
import { text } from '@/theme/type';
import { AccentDot, AccentSquare, VRule } from '@/components/ui/primitives';

export function TopBar({ unreadInbox = true }: { unreadInbox?: boolean }) {
  const insets = useSafeAreaInsets();
  const coins = useStore((s) => s.wallet.coins);
  const streak = useStore((s) => s.streak.days);

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: C.bg, borderBottomWidth: S.rule, borderBottomColor: C.divider }}>
      <View style={{ height: 40, flexDirection: 'row', alignItems: 'center' }}>
        {/* wordmark */}
        <Pressable onPress={() => router.navigate('/')} style={{ paddingHorizontal: S.inset, height: '100%', justifyContent: 'center' }}>
          <Text style={text('kicker', { color: C.text })}>Game Arcade</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        {/* coins → shop */}
        <VRule />
        <Pressable
          onPress={() => router.navigate('/shop')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, height: '100%' }}
        >
          <AccentSquare />
          <Text style={text('meta', { color: C.text, numeric: true })}>{coins.toLocaleString()}</Text>
        </Pressable>

        {/* streak */}
        <VRule />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, height: '100%' }}>
          <Text style={text('kicker', { color: C.n600 })}>Streak</Text>
          <Text style={text('meta', { color: C.text, numeric: true })}>{streak}</Text>
        </View>

        {/* inbox */}
        <VRule />
        <Pressable
          onPress={() => router.navigate('/inbox')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: S.inset, height: '100%' }}
        >
          <Text style={text('kicker', { color: C.text })}>Inbox</Text>
          {unreadInbox ? <AccentDot /> : null}
        </Pressable>
      </View>
    </View>
  );
}
