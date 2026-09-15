/**
 * 13 · Friend profile. Ink initial block, handle, mutuals, an accent presence
 * line. Then the head-to-head band on accent tint, then "WHERE THEY BEAT YOU" —
 * one row per game with the delta in accent when they lead — and a RACE button
 * that launches the run. Footer: CHALLENGE plus a FOLLOWING toggle.
 *
 * All values come from the seeded graph via data/social — never fabricated at
 * render time.
 */
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { BandHeader, Button, Rule } from '@/components/ui/primitives';
import { friendProfile } from '@/data/social';
import { useStore } from '@/store';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

export default function FriendProfile() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const progress = useStore((s) => s.progress);
  const p = friendProfile(String(handle ?? 'ravi'), progress);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label={p.handle} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ flexDirection: 'row', gap: 14, padding: S.inset, alignItems: 'center' }}>
          <View style={{ width: 72, height: 72, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: T.title.fontFamily, fontSize: 30, color: C.bg }}>{p.initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: T.title.fontFamily, fontSize: 24, letterSpacing: -0.8, color: C.text }}>{p.handle}</Text>
            <Text style={[text('meta', { color: C.n600 }), { marginTop: 2 }]}>{p.mutuals} mutuals</Text>
            <Text style={[text('kicker', { color: C.accentDeep }), { marginTop: 4 }]}>{p.presence}</Text>
          </View>
        </View>

        <View style={{ backgroundColor: C.accentTint, paddingHorizontal: S.inset, paddingVertical: 14 }}>
          <Text style={text('kicker', { color: C.accentDeep })}>Head to head</Text>
          <Text style={{ fontFamily: T.display.fontFamily, fontSize: 40, letterSpacing: -1.4, color: C.text, fontVariant: ['tabular-nums'] }}>
            {p.h2h.you} – {p.h2h.them}
          </Text>
          <Text style={text('meta', { color: C.n700 })}>{p.h2h.note}</Text>
        </View>

        <BandHeader kicker="Where they beat you" />
        {p.beats.map((r) => (
          <View key={r.gameId}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.inset, minHeight: 56, gap: 12 }}>
              <Text style={[text('rowTitle'), { flex: 1 }]}>{r.name}</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={text('meta', { color: r.lead === 'them' ? C.accentDeep : C.n600, numeric: true })}>{r.them.toLocaleString()}</Text>
                <Text style={text('meta', { color: C.n600, numeric: true })}>{r.you.toLocaleString()}</Text>
              </View>
              <Button label="Race" variant="outlined" onPress={() => router.navigate(`/match/${r.gameId}?source=duel`)} />
            </View>
            <Rule />
          </View>
        ))}

        <View style={{ flexDirection: 'row', gap: 10, padding: S.inset }}>
          <View style={{ flex: 1 }}>
            <Button label="Challenge" variant="accent" full onPress={() => router.navigate(`/match/${p.beats[0]?.gameId ?? 'stack'}?source=duel`)} />
          </View>
          <Button label="Following" variant="outlined" />
        </View>
      </ScrollView>
    </View>
  );
}
