/**
 * 12 · Tournament bracket. Kicker naming cup, game and entrant count; "LAST
 * EIGHT" at 30px; an accent urgency line with the closing time. Then three
 * columns — LAST 8 / SEMIS / FINAL — of stacked pairings; each pairing is a
 * 1px-bordered box of two rows (name, score). The player's row is accent-filled;
 * a decided winner's row is neutral-200; undecided scores are em dashes.
 */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { Button } from '@/components/ui/primitives';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

type Pair = { a: string; as: string; b: string; bs: string; you?: 'a' | 'b'; won?: 'a' | 'b' };

const LAST8: Pair[] = [
  { a: 'YOU', as: '47', b: 'RAVI', bs: '44', you: 'a', won: 'a' },
  { a: 'MEHA', as: '61', b: 'IRA', bs: '—' },
  { a: 'ZAID', as: '58', b: 'NEHA', bs: '52', won: 'a' },
  { a: 'KABIR', as: '—', b: 'DEV', bs: '—' },
];
const SEMIS: Pair[] = [
  { a: 'YOU', as: '—', b: 'MEHA', bs: '—', you: 'a' },
  { a: 'ZAID', as: '—', b: '?', bs: '—' },
];
const FINAL: Pair[] = [{ a: '?', as: '—', b: '?', bs: '—' }];

export default function Bracket() {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label="Saturday Cup" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ paddingHorizontal: S.inset, paddingTop: 18 }}>
          <Text style={text('kicker', { color: C.n600 })}>Saturday Cup · STACK · 8 left</Text>
          <Text style={{ fontFamily: T.title.fontFamily, fontSize: 30, letterSpacing: -0.9, color: C.text, marginTop: 2 }}>LAST EIGHT</Text>
          <Text style={[text('kicker', { color: C.accentDeep }), { marginTop: 4 }]}>Closes in 3h · win to reach the semis</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: S.gap, padding: S.inset }}>
          <Column title="LAST 8" pairs={LAST8} />
          <Column title="SEMIS" pairs={SEMIS} />
          <Column title="FINAL" pairs={FINAL} />
        </View>

        <View style={{ paddingHorizontal: S.inset }}>
          <Button label="Play your quarter-final" variant="accent" full onPress={() => router.navigate('/match/stack')} />
          <Text style={[text('meta', { color: C.n600 }), { marginTop: 10 }]}>Beat 44 to take the tie.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Column({ title, pairs }: { title: string; pairs: Pair[] }) {
  return (
    <View style={{ flex: 1, gap: 10 }}>
      <Text style={text('kicker', { color: C.n500 })}>{title}</Text>
      {pairs.map((p, i) => (
        <View key={i} style={{ borderWidth: S.hairline, borderColor: C.divider }}>
          <PairRow name={p.a} score={p.as} you={p.you === 'a'} won={p.won === 'a'} />
          <View style={{ height: S.hairline, backgroundColor: C.divider }} />
          <PairRow name={p.b} score={p.bs} you={p.you === 'b'} won={p.won === 'b'} />
        </View>
      ))}
    </View>
  );
}

function PairRow({ name, score, you, won }: { name: string; score: string; you?: boolean; won?: boolean }) {
  const bg = you ? C.accent : won ? C.n200 : C.bg;
  const fg = you ? C.bg : C.text;
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 8, backgroundColor: bg }}>
      <Text style={text('meta', { color: fg })} numberOfLines={1}>{name}</Text>
      <Text style={text('meta', { color: fg, numeric: true })}>{score}</Text>
    </View>
  );
}
