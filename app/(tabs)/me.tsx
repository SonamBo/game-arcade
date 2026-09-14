/**
 * 10 · Your profile. An 88px accent initial block beside the handle, a
 * level/rank/join line and a streak line in accent. Then a 2-up stat grid, the
 * season ladder with a reset countdown, and "YOUR BEST GAMES".
 *
 * Figures are illustrative until real progress accrues.
 */
import { ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { BandHeader, Rule } from '@/components/ui/primitives';
import { StatStrip } from '@/components/ui/StatStrip';
import { useStore } from '@/store';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

const BEST_GAMES = [
  { name: 'STACK', rank: '#2 of friends', best: 47 },
  { name: 'MERGE', rank: '#1 of friends', best: 512 },
  { name: 'DODGE', rank: '#4 of friends', best: 2910 },
  { name: 'SNAP', rank: '#3 of friends', best: 212 },
];

export default function Me() {
  const streak = useStore((s) => s.streak.days);
  const coins = useStore((s) => s.wallet.coins);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* header */}
        <View style={{ flexDirection: 'row', gap: 14, padding: S.inset, alignItems: 'center' }}>
          <View style={{ width: 88, height: 88, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: T.display.fontFamily, fontSize: 42, color: C.bg }}>S</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: T.title.fontFamily, fontSize: 24, color: C.text, letterSpacing: -0.8 }}>SONU</Text>
            <Text style={[text('meta', { color: C.n600 }), { marginTop: 2 }]}>Level 7 · rank 214 · joined June</Text>
            <Text style={[text('kicker', { color: C.accentDeep }), { marginTop: 4 }]}>{streak}-day streak</Text>
          </View>
        </View>

        <StatStrip cells={[{ kicker: 'Runs today', value: 14 }, { kicker: 'Sessions', value: '5 · avg 3m' }]} />
        <StatStrip cells={[{ kicker: 'Games played', value: '8 / 40' }, { kicker: 'Duels won', value: '11 · 61%' }]} />
        <StatStrip cells={[{ kicker: 'Coins earned', value: coins }, { kicker: 'Best streak', value: 9 }]} />

        {/* season ladder */}
        <BandHeader kicker="Season · resets in 6d" />
        <View style={{ paddingHorizontal: S.inset }}>
          <Text style={{ fontFamily: T.title.fontFamily, fontSize: 30, color: C.text, letterSpacing: -0.9 }}>Contender</Text>
          <View style={{ height: 10, backgroundColor: C.n300, marginTop: 10 }}>
            <View style={{ height: 10, width: '64%', backgroundColor: C.accent }} />
          </View>
          <Text style={[text('meta', { color: C.n600 }), { marginTop: 6 }]}>640 / 1000 to Challenger</Text>
        </View>

        <BandHeader kicker="Your best games" />
        {BEST_GAMES.map((g) => (
          <View key={g.name}>
            <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, paddingHorizontal: S.inset, gap: 12 }}>
              <Text style={[text('rowTitle'), { flex: 1 }]}>{g.name}</Text>
              <Text style={text('meta', { color: C.n600 })}>{g.rank}</Text>
              <Text style={text('figure', { numeric: true })}>{g.best.toLocaleString()}</Text>
            </View>
            <Rule />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
