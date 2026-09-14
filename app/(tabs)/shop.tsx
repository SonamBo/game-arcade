/**
 * 09 · Wallet & shop. Kicker "ONE WALLET · ALL 40 GAMES", the balance at 54px
 * with "coins" beside it, and a line naming how many games it was earned across.
 * "SPEND IT" lists power-ups — each a name, a one-line description and a bordered
 * price button (the cheapest is accent-filled). "TOP UP" is a 3-up pack grid.
 * Closing line, verbatim: coins buy continues and retries, never access.
 *
 * Per DECISIONS D-001-era note: mid-run revive is a candidate to cut (spec §11),
 * so it is listed but marked, pending Sonu's call.
 */
import { ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { BandHeader, Button, Rule } from '@/components/ui/primitives';
import { useStore } from '@/store';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

const POWERUPS = [
  { name: 'EXTRA RETRY', desc: 'One more run from where you fell.', price: 50, cheapest: true },
  { name: 'MID-RUN REVIVE ×3', desc: 'Carry on mid-run. (Under review for v1.)', price: 180 },
  { name: 'GHOST SCOUT', desc: "See a rival's run before you play it.", price: 120 },
  { name: 'STREAK FREEZE', desc: 'Miss a day without losing it all.', price: 300 },
];

const PACKS = [
  { coins: 1000, price: '₹79' },
  { coins: 3000, price: '₹199', best: true },
  { coins: 8000, price: '₹449' },
];

export default function Shop() {
  const coins = useStore((s) => s.wallet.coins);
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ paddingHorizontal: S.inset, paddingTop: 18 }}>
          <Text style={text('kicker', { color: C.n600 })}>One wallet · all 40 games</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <Text style={{ fontFamily: T.display.fontFamily, fontSize: 54, letterSpacing: -2, color: C.text, fontVariant: ['tabular-nums'] }}>
              {coins.toLocaleString()}
            </Text>
            <Text style={text('rowTitle', { color: C.n600 })}>coins</Text>
          </View>
          <Text style={[text('meta', { color: C.n600 }), { marginTop: 2 }]}>Earned across 6 games this week.</Text>
        </View>

        <BandHeader kicker="Spend it" />
        {POWERUPS.map((p) => (
          <View key={p.name}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.inset, paddingVertical: 12, gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={text('rowTitle')}>{p.name}</Text>
                <Text style={[text('meta', { color: C.n600 }), { marginTop: 2 }]}>{p.desc}</Text>
              </View>
              <Button label={`${p.price}`} variant={p.cheapest ? 'accent' : 'outlined'} />
            </View>
            <Rule />
          </View>
        ))}

        <BandHeader kicker="Top up" />
        <View style={{ flexDirection: 'row', backgroundColor: C.divider, gap: S.gap, marginHorizontal: 0 }}>
          {PACKS.map((pk) => (
            <View key={pk.coins} style={{ flex: 1, backgroundColor: pk.best ? C.accent : C.bg, padding: 12, minHeight: 88, justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: T.figure.fontFamily, fontSize: 22, color: pk.best ? C.bg : C.text, fontVariant: ['tabular-nums'] }}>
                {pk.coins.toLocaleString()}
              </Text>
              <Text style={text('kicker', { color: pk.best ? C.bg : C.n600, numeric: true })}>{pk.price}</Text>
            </View>
          ))}
        </View>

        <Text style={[text('body', { color: C.n700 }), { paddingHorizontal: S.inset, paddingTop: 20 }]}>
          Coins buy continues and retries. They never buy access to a game — all 40 are free.
        </Text>
      </ScrollView>
    </View>
  );
}
