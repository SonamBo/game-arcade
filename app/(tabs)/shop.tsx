/**
 * 09 · Wallet & shop. Balance at 54px, a line naming where it was earned, then
 * "SPEND IT" — power-ups that cost real coins and do real things. TOP UP is
 * shown but disabled: there is no payments backend in v1 (coins buy continues
 * and retries only — never access, and never real money yet).
 */
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { TopBar } from '@/components/chrome/TopBar';
import { BandHeader, Button, Rule } from '@/components/ui/primitives';
import { ToastStripStatic } from '@/components/ui/ToastStrip';
import { POWERUP_COST } from '@/store/slices/economy';
import type { PowerUp } from '@/store/slices/economy';
import { useStore } from '@/store';
import { C, S, T } from '@/theme/tokens';
import { text } from '@/theme/type';

interface Row {
  kind: PowerUp;
  name: string;
  desc: string;
}

const POWERUPS: Row[] = [
  { kind: 'retry', name: 'EXTRA RETRY', desc: 'Bank one more retry on top of the free three.' },
  { kind: 'ghostScout', name: 'GHOST SCOUT', desc: "See a rival's run before you play it." },
  { kind: 'streakFreeze', name: 'STREAK FREEZE', desc: 'Miss a day without losing your streak.' },
];

const PACKS = [
  { coins: 1000, price: '₹79' },
  { coins: 3000, price: '₹199', best: true },
  { coins: 8000, price: '₹449' },
];

export default function Shop() {
  const coins = useStore((s) => s.wallet.coins);
  const freeRetriesLeft = useStore((s) => s.wallet.freeRetriesLeft);
  const powerups = useStore((s) => s.powerups);
  const buyPowerUp = useStore((s) => s.buyPowerUp);
  const [toast, setToast] = useState<{ label: string; refusal?: boolean } | null>(null);

  const owned = (kind: PowerUp) => kind !== 'retry' && powerups[kind];

  const buy = (row: Row) => {
    const res = buyPowerUp(row.kind);
    if (res === 'insufficient') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setToast({ label: 'Not enough coins', refusal: true });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setToast({ label: `${row.name} bought` });
    }
    setTimeout(() => setToast(null), 1500);
  };

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
          <Text style={[text('meta', { color: C.n600, numeric: true }), { marginTop: 2 }]}>{freeRetriesLeft} free retries left today.</Text>
        </View>

        {toast ? <View style={{ marginTop: 12 }}><ToastStripStatic label={toast.label} refusal={toast.refusal} /></View> : null}

        <BandHeader kicker="Spend it" />
        {POWERUPS.map((p) => (
          <View key={p.kind}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.inset, paddingVertical: 12, gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={text('rowTitle')}>{p.name}</Text>
                <Text style={[text('meta', { color: C.n600 }), { marginTop: 2 }]}>{p.desc}</Text>
              </View>
              {owned(p.kind) ? (
                <Text style={text('kicker', { color: C.n500 })}>Owned</Text>
              ) : (
                <Button label={`${POWERUP_COST[p.kind]}`} variant={p.kind === 'retry' ? 'accent' : 'outlined'} onPress={() => buy(p)} />
              )}
            </View>
            <Rule />
          </View>
        ))}

        <BandHeader kicker="Top up" />
        <View style={{ flexDirection: 'row', backgroundColor: C.divider, gap: S.gap, opacity: 0.55 }}>
          {PACKS.map((pk) => (
            <View key={pk.coins} style={{ flex: 1, backgroundColor: pk.best ? C.accent : C.bg, padding: 12, minHeight: 88, justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: T.figure.fontFamily, fontSize: 22, color: pk.best ? C.bg : C.text, fontVariant: ['tabular-nums'] }}>
                {pk.coins.toLocaleString()}
              </Text>
              <Text style={text('kicker', { color: pk.best ? C.bg : C.n600, numeric: true })}>{pk.price}</Text>
            </View>
          ))}
        </View>
        <Text style={[text('meta', { color: C.n500 }), { paddingHorizontal: S.inset, paddingTop: 8 }]}>Top-up packs arrive with payments — not in this build.</Text>

        <Text style={[text('body', { color: C.n700 }), { paddingHorizontal: S.inset, paddingTop: 16 }]}>
          Coins buy continues and retries. They never buy access to a game — all 40 are free.
        </Text>
      </ScrollView>
    </View>
  );
}
