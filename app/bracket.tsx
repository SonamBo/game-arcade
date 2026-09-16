/**
 * 13 · Bracket (§6.13). "Last eight" in T.title. Pairings are paper pairs: two
 * handles stacked with figures right-aligned, the advancing name in T.rowTitle
 * and the eliminated one at n700 (de-emphasised by weight, never below the
 * contrast floor). Connector rules stay — the one screen where a rule carries
 * meaning — 1px at C.divider. Your own pairing has a cyan left rail.
 */
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BackBar } from '@/components/chrome/BackBar';
import { Button } from '@/components/ui/primitives';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

type Pair = { a: string; as: string; b: string; bs: string; you?: 'a' | 'b'; won?: 'a' | 'b' };

const LAST8: Pair[] = [
  { a: 'You', as: '47', b: 'Ravi', bs: '44', you: 'a', won: 'a' },
  { a: 'Meha', as: '61', b: 'Ira', bs: '—' },
  { a: 'Zaid', as: '58', b: 'Neha', bs: '52', won: 'a' },
  { a: 'Kabir', as: '—', b: 'Dev', bs: '—' },
];
const SEMIS: Pair[] = [
  { a: 'You', as: '—', b: 'Meha', bs: '—', you: 'a' },
  { a: 'Zaid', as: '—', b: '?', bs: '—' },
];
const FINAL: Pair[] = [{ a: '?', as: '—', b: '?', bs: '—' }];

export default function Bracket() {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <BackBar label="Saturday Cup" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ paddingHorizontal: S.inset, paddingTop: S.rail }}>
          <Text style={text('micro', { color: C.n700, uppercase: true })}>Saturday Cup · Stack · 8 left</Text>
          <Text style={[text('title'), { marginTop: 4 }]}>Last eight</Text>
          <Text style={[text('meta', { color: C.accentDeep }), { marginTop: 4 }]}>Closes in 3h · win to reach the semis</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: S.rail, paddingHorizontal: S.inset, paddingTop: S.band }}>
          <Column title="Last 8" pairs={LAST8} />
          <Column title="Semis" pairs={SEMIS} />
          <Column title="Final" pairs={FINAL} />
        </View>

        <View style={{ paddingHorizontal: S.inset, paddingTop: S.band }}>
          <Button label="Play your quarter-final" variant="primary" full onPress={() => router.navigate('/match/stack?source=duel')} />
          <Text style={[text('meta', { color: C.n700 }), { marginTop: 10 }]}>Beat 44 to take the tie.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Column({ title, pairs }: { title: string; pairs: Pair[] }) {
  return (
    <View style={{ flex: 1, gap: S.rail }}>
      <Text style={text('meta', { color: C.n700 })}>{title}</Text>
      {pairs.map((p, i) => (
        <View key={i} style={{ borderLeftWidth: p.you ? 3 : 0, borderLeftColor: C.accent, paddingLeft: p.you ? 8 : 0 }}>
          <PairRow name={p.a} score={p.as} won={p.won === 'a'} />
          <View style={{ height: 1, backgroundColor: C.divider, marginVertical: 6 }} />
          <PairRow name={p.b} score={p.bs} won={p.won === 'b'} />
        </View>
      ))}
    </View>
  );
}

function PairRow({ name, score, won }: { name: string; score: string; won?: boolean }) {
  const color = won ? C.text : C.n700;
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 6 }}>
      <Text style={won ? text('rowTitle') : text('meta', { color })} numberOfLines={1}>{name}</Text>
      <Text style={text('meta', { color, numeric: true })}>{score}</Text>
    </View>
  );
}
