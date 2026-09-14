/**
 * 13 · Friend profile. An ink initial block, handle, mutuals line, and an accent
 * presence line. Then the head-to-head band on accent tint ("14 – 19" at 40px
 * with a note). Then "WHERE THEY BEAT YOU" — one row per game with the delta in
 * accent when they lead, both scores stacked right, and a bordered RACE button.
 * Footer: ink CHALLENGE plus an outlined FOLLOWING toggle.
 */
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { BandHeader, Button, Rule } from '@/components/ui/primitives';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

const H2H = [
  { game: 'STACK', them: 50, you: 47, lead: 'them' },
  { game: 'DODGE', them: 2740, you: 2910, lead: 'you' },
  { game: 'REFLEX', them: 176, you: 184, lead: 'them' },
];

export default function FriendProfile() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const name = String(handle ?? 'ravi').toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label={name} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ flexDirection: 'row', gap: 14, padding: S.inset, alignItems: 'center' }}>
          <View style={{ width: 72, height: 72, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: T.title.fontFamily, fontSize: 30, color: C.bg }}>{name[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: T.title.fontFamily, fontSize: 24, letterSpacing: -0.8, color: C.text }}>{name}</Text>
            <Text style={[text('meta', { color: C.n600 }), { marginTop: 2 }]}>7 mutuals</Text>
            <Text style={[text('kicker', { color: C.accentDeep }), { marginTop: 4 }]}>Played STACK 4 minutes ago</Text>
          </View>
        </View>

        {/* head to head */}
        <View style={{ backgroundColor: C.accentTint, paddingHorizontal: S.inset, paddingVertical: 14 }}>
          <Text style={text('kicker', { color: C.accentDeep })}>Head to head</Text>
          <Text style={{ fontFamily: T.display.fontFamily, fontSize: 40, letterSpacing: -1.4, color: C.text, fontVariant: ['tabular-nums'] }}>
            14 – 19
          </Text>
          <Text style={text('meta', { color: C.n700 })}>Duels since June. They lead by five.</Text>
        </View>

        <BandHeader kicker="Where they beat you" />
        {H2H.map((r) => (
          <View key={r.game}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.inset, minHeight: 56, gap: 12 }}>
              <Text style={[text('rowTitle'), { flex: 1 }]}>{r.game}</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={text('meta', { color: r.lead === 'them' ? C.accentDeep : C.n600, numeric: true })}>{r.them.toLocaleString()}</Text>
                <Text style={text('meta', { color: C.n600, numeric: true })}>{r.you.toLocaleString()}</Text>
              </View>
              <Button label="Race" variant="outlined" onPress={() => router.navigate(`/match/${r.game.toLowerCase()}`)} />
            </View>
            <Rule />
          </View>
        ))}

        <View style={{ flexDirection: 'row', gap: 10, padding: S.inset }}>
          <View style={{ flex: 1 }}>
            <Button label="Challenge" variant="accent" full onPress={() => router.navigate('/match/stack')} />
          </View>
          <Button label="Following" variant="outlined" />
        </View>
      </ScrollView>
    </View>
  );
}
