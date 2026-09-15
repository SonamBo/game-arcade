/**
 * 08 · Duels. "ASYNC · NOBODY WAITS" over a count. One row per duel with a
 * friend's real best as the stake (accent when expiring soon), an accent RACE
 * button that launches the run directly, the live tournament banner, and a link
 * to the inbox. Cold start seeds a named GLOBAL RIVAL, never a fake friend.
 */
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { Button, Rule } from '@/components/ui/primitives';
import { buildDuels } from '@/data/social';
import { useStore } from '@/store';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Duels() {
  const progress = useStore((s) => s.progress);
  const duels = buildDuels(progress);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: S.inset, paddingTop: 18, paddingBottom: 10 }}>
          <Text style={text('kicker', { color: C.n600 })}>Async · nobody waits</Text>
          <Text style={{ fontFamily: T.title.fontFamily, fontSize: 26, color: C.text, letterSpacing: -0.8, marginTop: 2 }}>
            {duels.length} ghosts waiting
          </Text>
        </View>
        <Rule weight="section" />

        {duels.map((d) => (
          <View key={d.gameId}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: 56,
                paddingHorizontal: S.inset,
                paddingVertical: 10,
                gap: 12,
                backgroundColor: d.soon ? C.accentTint : C.bg,
              }}
            >
              <Pressable onPress={() => router.navigate(`/friend/${d.handle.toLowerCase()}`)} style={{ width: 44, height: 44, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={text('rowTitle', { color: C.bg })}>{d.handle[0]}</Text>
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={text('rowTitle')}>
                  {d.handle} · {d.name}
                </Text>
                <Text style={[text('meta', { color: d.soon ? C.accentDeep : C.n600 }), { marginTop: 2 }]}>{d.stake}</Text>
              </View>
              <Button label="Race" variant="accent" onPress={() => router.navigate(`/match/${d.gameId}?source=duel`)} />
            </View>
            <Rule />
          </View>
        ))}

        <Pressable onPress={() => router.navigate('/bracket')} style={{ backgroundColor: C.accent, paddingHorizontal: S.inset, paddingVertical: 18, marginTop: 12 }}>
          <Text style={text('kicker', { color: C.bg })}>Saturday Cup · Round 2</Text>
          <Text style={{ fontFamily: T.title.fontFamily, fontSize: 26, color: C.bg, letterSpacing: -0.8, marginTop: 4 }}>
            You're in the last eight →
          </Text>
        </Pressable>

        <Pressable onPress={() => router.navigate('/inbox')} style={{ paddingHorizontal: S.inset, paddingVertical: 16 }}>
          <Text style={text('kicker', { color: C.accentDeep })}>Challenges in your inbox →</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
