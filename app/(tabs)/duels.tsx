/**
 * 07 · Duels (§6.07). "Duels" in T.title, sentence case. Two bands separated by
 * space — "Your turn" and "Waiting on them". Each row: the opponent's avatar
 * circle, handle, the game as a meta line, and a cyan Race button. Waiting-on-you
 * rows carry the magenta dot. No reversed ink rows.
 */
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { BandHeader, Button, Dot } from '@/components/ui/primitives';
import { buildDuels } from '@/data/social';
import type { DuelView } from '@/data/social';
import { useStore } from '@/store';
import { C, R, S } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function Duels() {
  const progress = useStore((s) => s.progress);
  const duels = buildDuels(progress);
  const yourTurn = duels.filter((d) => d.soon);
  const waiting = duels.filter((d) => !d.soon);

  const row = (d: DuelView) => (
    <View key={d.gameId} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 64, paddingHorizontal: S.inset, paddingVertical: S.row, gap: S.rail }}>
      <Pressable onPress={() => router.navigate(`/friend/${d.handle.toLowerCase()}`)}>
        <View style={{ width: 40, height: 40, borderRadius: R.pill, backgroundColor: C.n300, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={text('rowTitle', { color: C.n800 })}>{d.handle[0]}</Text>
        </View>
      </Pressable>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={text('rowTitle')}>{d.handle} · {d.name}</Text>
          {d.soon ? <Dot color={C.urgent} size={6} /> : null}
        </View>
        <Text style={[text('meta', { color: C.n700 }), { marginTop: 2 }]}>{d.stake}</Text>
      </View>
      <Button label="Race" variant="primary" onPress={() => router.navigate(`/match/${d.gameId}?source=duel`)} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: S.inset, paddingTop: S.rail }}>
          <Text style={text('title')}>Duels</Text>
          <Text style={[text('meta', { color: C.n700 }), { marginTop: 2 }]}>Async · nobody waits</Text>
        </View>

        {yourTurn.length > 0 ? (<><BandHeader kicker="Your turn" />{yourTurn.map(row)}</>) : null}
        <BandHeader kicker="Waiting on them" />
        {waiting.map(row)}

        <Pressable onPress={() => router.navigate('/bracket')} style={{ marginHorizontal: S.inset, marginTop: S.band, backgroundColor: C.surface, borderRadius: R.lg, padding: S.card }}>
          <Text style={text('micro', { color: C.accentDeep, uppercase: true })}>Saturday Cup · round 2</Text>
          <Text style={[text('title'), { marginTop: 6 }]}>You're in the last eight</Text>
        </Pressable>

        <Pressable onPress={() => router.navigate('/inbox')} style={{ paddingHorizontal: S.inset, paddingVertical: S.band }}>
          <Text style={text('rowTitle', { color: C.accent })}>Challenges in your inbox →</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
